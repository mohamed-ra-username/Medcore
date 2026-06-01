@echo off
title Medcore Master Runner

echo - [1/3] Installing/Updating Requirements...
pip install -r requirements.txt --quiet

echo - [2/3] Starting Medcore Systems...

:: Start Backend in a new window
start "Medcore Backend API" cmd /c "python backend/app.py"

:: Start Frontend in a new window
start "Medcore Frontend Server" cmd /c "python -m http.server 5000"

echo - [3/3] Opening Browser...
timeout /t 3 /nobreak > nul
start http://localhost:5000/frontend/views/home.html

echo.
echo = Medcore is now running!
echo ------------------------------------------
echo Backend:  http://localhost:5001/api
echo Frontend: http://localhost:5000
echo ------------------------------------------
echo Close the other windows to stop the servers.
pause
