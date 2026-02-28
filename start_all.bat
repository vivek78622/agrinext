@echo off
echo Starting npm dev server and Python main...
echo.

start "NPM Dev Server" cmd /k "cd /d "%~dp0web" && npm run dev"
timeout /t 2 /nobreak >nul

start "Python Main" cmd /k "cd /d "%~dp0crop_advisor_api" && python app\main.py"

echo.
echo Both services are starting...
echo NPM Dev: Check the NPM Dev Server window
echo Python: Check the Python Main window
echo.
