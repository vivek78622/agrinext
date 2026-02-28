# Crop Selection Feature - Implementation Summary

## Overview
Updated the crop advisor system to allow users to select specific crops from the prescreen results. The pipeline now analyzes only the selected crops instead of processing all 100+ crops in the database.

## Changes Made

### 1. Backend Schema Update (`app/models/schemas.py`)
- Added `selected_crop_ids` field to `PipelineRequest` schema
- This optional field accepts a list of crop IDs to analyze
- Falls back to automatic filtering if not provided

### 2. Main API Endpoint (`app/main.py`)
- Modified the job submission endpoint to accept `selected_crop_ids`
- Updated pipeline logic to use selected crops when provided:
  - If `selected_crop_ids` is provided: Only analyze those specific crops
  - If not provided: Use automatic scoring/filtering (top 10 crops with score >= 80)
- Added logging to show which mode is being used

### 3. Background Worker (`app/workers/tasks.py`)
- Updated the ARQ worker task to handle `selected_crop_ids`
- Extracts crop IDs from request data (supports both snake_case and camelCase)
- Filters CROP_DATABASE to only include selected crops
- Falls back to automatic selection if no crops specified

### 4. Frontend Pipeline Service (`web/src/services/cropAdvisor/pipeline.ts`)
- Added `selectedCropIds` to `PipelineOptions` interface
- Updated `submitPipelineJob()` to send selected crop IDs to backend
- Updated legacy `runPipeline()` to support selected crops

### 5. Frontend Page Component (`web/src/app/(main)/crop-advisor/page.tsx`)
- Modified `runFullPipeline()` to pass `selectedCropIds` in options
- Only sends crop IDs if user has made selections

## How It Works

### User Flow:
1. User fills out farm conditions form
2. System calls `/api/crop-advisor/prescreen` to get all crops ranked by score
3. User sees top candidates and can select 1-5 crops
4. User clicks "Analyze Selected Crops"
5. System calls `/api/crop-advisor/jobs/submit` with `selected_crop_ids`
6. Backend analyzes ONLY the selected crops through all 9 models
7. Results show comparison of selected crops only

### Benefits:
- **Faster Analysis**: Only 3-5 crops analyzed instead of 10-100
- **User Control**: Farmers can focus on crops they're interested in
- **Better UX**: Clear two-step process (prescreen → deep analysis)
- **Cost Efficient**: Fewer LLM API calls
- **Backward Compatible**: Still works without crop selection

## API Example

### Request with Selected Crops:
```json
{
  "location": {"lat": 19.0, "lon": 73.0},
  "land_area": {"value": 5, "unit": "acres"},
  "water_availability": "Limited",
  "budget_per_acre": 30000,
  "selected_crop_ids": ["soybean", "cotton", "jowar"]
}
```

### Request without Selection (Auto Mode):
```json
{
  "location": {"lat": 19.0, "lon": 73.0},
  "land_area": {"value": 5, "unit": "acres"},
  "water_availability": "Limited",
  "budget_per_acre": 30000
}
```

## Testing

To test the feature:
1. Start the backend: `cd crop_advisor_api && python -m uvicorn app.main:app --reload`
2. Start the frontend: `cd web && npm run dev`
3. Fill out the form and select crops from the prescreen results
4. Verify only selected crops are analyzed in the results

## Console Output

When crops are selected:
```
🎯 Using 3 user-selected crops: ['Soybean', 'Cotton', 'Jowar (Sorghum)']
```

When auto-selecting:
```
🤖 Auto-selected 10 crops based on scoring
```

## Notes
- Maximum 5 crops can be selected at once (UI limitation)
- Minimum 1 crop must be selected
- If invalid crop IDs are provided, they are silently filtered out
- The prescreen endpoint still returns all crops for flexibility
