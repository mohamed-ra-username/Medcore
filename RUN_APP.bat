@echo off
title Medcore Master Runner

echo ==========================================
echo        STARTING MEDCORE SYSTEMS
echo ==========================================

echo - [1/3] Installing/Updating Requirements...
pip install -r requirements.txt

echo - [2/3] Launching Server Windows...
:: Changed /c to /k so the windows stay open if an error occurs
start "Medcore Backend API" cmd /k "python backend/app.py"
start "Medcore Frontend Server" cmd /k "python -m http.server 5000"


echo - [3/3] Opening Web Page...
start frontend/pages/home.html

echo.
echo ==========================================
echo   SUCCESS: Medcore is now running!
echo ==========================================
echo   Backend:  http://localhost:5001/api
echo   Frontend: http://localhost:5000
echo ==========================================
echo.

timeout /t 2 > nul
