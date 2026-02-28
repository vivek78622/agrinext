@echo off
echo Starting Crop Advisor Backend...
cd /d "%~dp0crop_advisor_api"
python -m uvicorn app.main:app --reload --port 8000
pause
