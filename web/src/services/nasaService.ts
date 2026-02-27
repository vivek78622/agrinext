import { format, subDays, subMonths } from 'date-fns';

const NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";
const NASA_CMR_URL = "https://cmr.earthdata.nasa.gov/search/granules.json";

// Types
export interface WeatherData {
    temp: number;
    rainfall: number;
    humidity: number;
    soilMoisture: number;
    source: 'NASA POWER';

    // AI Model Required Fields
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    rainfallTotalMm: number;
    rainfallConsistency: number;
    soilMoisturePercent: number;
}

interface EarthDataGranule {
    title: string;
    downloadUrl: string;
    timeStart: string;
    timeEnd: string;
}

// Helper: Get date range for last 6 months (For Seasonal Weather Analysis)
const getSeasonalDateRange = () => {
    const end = new Date();
    const start = subMonths(end, 6);
    return {
        start: format(start, 'yyyyMMdd'),
        end: format(end, 'yyyyMMdd')
    };
};

// Helper: Get date range for last 7 days (Legacy / for Granule Search)
const getWeeklyDateRange = () => {
    const end = new Date();
    const start = subDays(end, 7);
    return {
        start: format(start, 'yyyyMMdd'),
        end: format(end, 'yyyyMMdd'),
        startIso: start.toISOString(),
        endIso: end.toISOString(),
    };
};

// Helper: Safe Math functions handling NASA's -999/-9999 missing values
// NASA strictly uses -999 or -9999 to indicate missing data
function safeAverage(values: number[]): number | null {
    const valid = values.filter(v => v !== -999 && v !== -9999 && !isNaN(v));
    return valid.length > 0
        ? valid.reduce((a, b) => a + b, 0) / valid.length
        : null;
}

function safeSum(values: number[]): number | null {
    const valid = values.filter(v => v !== -999 && v !== -9999 && !isNaN(v));
    return valid.length > 0
        ? valid.reduce((a, b) => a + b, 0)
        : null;
}

/**
 * 1. NASA POWER API (No Token Needed)
 * Fetches Temp (T2M), Rainfall (PRECTOTCORR), Soil Moisture (GWETTOP)
 * Uses 6-Month Seasonal Data for accurate farm analysis.
 */
export async function fetchWeatherFromPower(lat: number, lon: number): Promise<WeatherData | null> {
    const { start, end } = getSeasonalDateRange();

    // Using PRECTOTCORR as it is the Corrected Total Precipitation (v2 standard)
    // T2M: Temperature at 2 Meters
    // GWETTOP: Surface Soil Wetness (0-1)
    // RH2M: Relative Humidity (optional, but requested)
    const params = new URLSearchParams({
        parameters: "T2M,PRECTOTCORR,RH2M,GWETTOP",
        community: "AG",
        latitude: lat.toString(),
        longitude: lon.toString(),
        start: start,
        end: end,
        format: "JSON"
    });

    try {
        const response = await fetch(`${NASA_POWER_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('NASA POWER API failed');

        const data = await response.json();
        const properties = data.properties?.parameter;

        if (!properties) throw new Error('Invalid NASA API response structure');

        // Extract values arrays (filter out meta keys if any)
        const tempValues = Object.values(properties.T2M || {}) as number[];
        const rainValues = Object.values(properties.PRECTOTCORR || {}) as number[];
        const humidityValues = Object.values(properties.RH2M || {}) as number[];
        const soilValues = Object.values(properties.GWETTOP || {}) as number[];

        // Calculate Cleaned Metrics
        const avgTemp = safeAverage(tempValues);
        const minTemp = Math.min(...(tempValues.filter(v => v > -50))); // Filter bad data
        const maxTemp = Math.max(...(tempValues.filter(v => v < 60)));
        const totalRain = safeSum(rainValues);
        const avgHumidity = safeAverage(humidityValues);
        const avgSoilRaw = safeAverage(soilValues);

        // Calculate Rainfall Consistency (Standard Deviation & CV)
        const validRain = rainValues.filter(v => v >= 0);
        const meanRain = validRain.reduce((a, b) => a + b, 0) / (validRain.length || 1);
        const rainVariance = validRain.reduce((acc, val) => acc + Math.pow(val - meanRain, 2), 0) / (validRain.length || 1);
        const rainStdDev = Math.sqrt(rainVariance);
        // Coefficient of Variation (CV) = (StdDev / Mean) * 100. Lower is more consistent.
        // If mean is 0, CV is 0 (consistent dry).
        const rainConsistency = meanRain > 0 ? (rainStdDev / meanRain) * 100 : 0;

        // Fail gracefully if NO valid data exists
        if (avgTemp === null || totalRain === null) return null;

        // Convert Soil Moisture: 0-1 fraction -> Percentage (0-100%)
        const finalSoilMoisture = avgSoilRaw !== null ? Math.round(avgSoilRaw * 100) : 0;

        return {
            temp: Math.round(avgTemp * 10) / 10,
            rainfall: Math.round(totalRain),
            humidity: avgHumidity !== null ? Math.round(avgHumidity) : 0,
            soilMoisture: finalSoilMoisture,
            source: 'NASA POWER',

            // New Fields for AI Models
            avgTemp: avgTemp,
            minTemp: minTemp,
            maxTemp: maxTemp,
            rainfallTotalMm: totalRain,
            rainfallConsistency: rainConsistency, // High value = volatile rain
            soilMoisturePercent: finalSoilMoisture
        };

    } catch (error) {
        console.error("Error fetching NASA POWER data:", error);
        return null;
    }
}

const NASA_TOKEN = process.env.NEXT_PUBLIC_NASA_EARTHDATA_TOKEN || "";

/**
 * 2. NASA CMR Search API (Requires Token for Restricted Data like SMAP)
 * Searches for available granules (files)
 * Uses Weekly range as this is likely for specific recent files.
 */
export async function searchEarthData(
    shortName: 'SPL3SMP' | 'GPM_3IMERGDF' | 'MOD13Q1',
    box: string, // lon1,lat1,lon2,lat2
    token: string = NASA_TOKEN
): Promise<EarthDataGranule[]> {
    const { startIso, endIso } = getWeeklyDateRange();

    // Clean temporal format for CMR
    const temporal = `${startIso.split('.')[0]}Z,${endIso.split('.')[0]}Z`; // Remove millis

    const params = new URLSearchParams({
        short_name: shortName,
        temporal: temporal,
        bounding_box: box,
        page_size: '5'
    });

    // Version must be explicitly 007 for SMAP as per requirements
    if (shortName === 'SPL3SMP') {
        params.append('version', '007');
    }

    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${NASA_CMR_URL}?${params.toString()}`, { headers });
        if (!response.ok) throw new Error(`CMR API Search failed: ${response.statusText}`);

        const data = await response.json();

        if (!data.feed || !data.feed.entry) return [];

        return data.feed.entry.map((entry: any) => ({
            title: entry.title,
            downloadUrl: entry.links[0]?.href || '',
            timeStart: entry.time_start,
            timeEnd: entry.time_end
        }));

    } catch (error) {
        console.error("Error searching EarthData:", error);
        return [];
    }
}

/**
 * Step B: Download File (Automatic)
 * Uses the token to fetch the actual data file (e.g. .h5 for SMAP)
 */
export async function downloadGranule(url: string, token: string = NASA_TOKEN): Promise<Blob | null> {
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

        return await response.blob();
    } catch (error) {
        console.error("Error downloading granule:", error);
        return null;
    }
}

/**
 * 3. Farmer Friendly Converters
 */

export interface AnalysisResult {
    soilMoisture: { status: string; label: string; color: string };
    rainfall: { status: string; label: string; color: string };
    temperature: { status: string; label: string; color?: string };
    waterAvailability: { status: string; label: string; color: string };
}

export const analyzeFarmConditions = (temp: number, rainTotal: number, soilMoisturePercent: number): AnalysisResult => {

    // 1. Soil Moisture Analysis (0-100% Scale)
    // >40% Good, >25% Medium, Else Low
    let soilStatus = "Low";
    let soilLabel = "Low (Dry)";
    let soilColor = "text-red-500";

    if (soilMoisturePercent > 40) {
        soilStatus = "Good";
        soilLabel = "Optimal (>40%)";
        soilColor = "text-green-500";
    } else if (soilMoisturePercent > 25) {
        soilStatus = "Medium";
        soilLabel = "Moderate (25-40%)";
        soilColor = "text-orange-500";
    }

    const soilAnalysis = { status: soilStatus, label: soilLabel, color: soilColor };


    // 2. Rainfall Analysis (Seasonal Total for 6 Months)
    // >600mm High, >300mm Medium, Else Low
    let rainStatus = "Low";
    let rainLabel = "Low (<300mm)";
    let rainColor = "text-red-500";

    if (rainTotal > 600) {
        rainStatus = "High";
        rainLabel = "High (>600mm)";
        rainColor = "text-blue-500";
    } else if (rainTotal > 300) {
        rainStatus = "Medium";
        rainLabel = "Medium (300-600mm)";
        rainColor = "text-green-500";
    }

    const rainAnalysis = { status: rainStatus, label: rainLabel, color: rainColor };


    // 3. Temperature Analysis
    let tempStatus = "Ideal";
    let tempLabel = "Good for Growth";
    let tempColor = "text-green-500";

    if (temp < 10) {
        tempStatus = "Cold";
        tempLabel = "Too Cold (<10°C)";
        tempColor = "text-blue-500";
    } else if (temp > 35) {
        tempStatus = "Hot";
        tempLabel = "Too Hot (>35°C)";
        tempColor = "text-red-500";
    }

    const tempAnalysis = { status: tempStatus, label: tempLabel, color: tempColor };


    // 4. Water Availability Analysis (Derived)
    // Logic: 
    // High Rain (>600) + High Soil (>40) -> High
    // Med Rain (>300) + Med Soil (>25) -> Medium
    // Else Low

    let waterStatus = "Low";
    let waterLabel = "Scarcity";
    let waterColor = "text-red-500";

    if (rainTotal > 600 && soilMoisturePercent > 40) {
        waterStatus = "High";
        waterLabel = "Abundant";
        waterColor = "text-blue-500";
    } else if (rainTotal > 300 && soilMoisturePercent > 25) {
        waterStatus = "Medium";
        waterLabel = "Sufficient";
        waterColor = "text-green-500";
    }

    return {
        soilMoisture: soilAnalysis,
        rainfall: rainAnalysis,
        temperature: tempAnalysis,
        waterAvailability: {
            status: waterStatus,
            label: waterLabel,
            color: waterColor
        }
    };
}
