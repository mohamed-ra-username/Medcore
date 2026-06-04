@echo off
title Medcore Master Runner

echo ==========================================
echo        STARTING MEDCORE SYSTEMS
echo ==========================================

echo - [1/3] Installing/Updating Requirements...
call commands/install_requirements.bat

echo - [2/3] Launching Server Windows...
call commands\start_backend.bat
call commands\start_frontend.bat


echo - [3/3] Opening Web Page...
call commands\open_frontend.bat

echo.
echo ==========================================
echo   SUCCESS: Medcore is now running!
echo ==========================================
echo   Backend:  http://localhost:5001/api
echo   Frontend: http://localhost:5000
echo ==========================================
echo.

timeout /t 2 > nul
