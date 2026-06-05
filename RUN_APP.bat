@echo off
title Medcore Master Runner

echo ==========================================
echo        STARTING MEDCORE SYSTEMS
echo ==========================================
cd commands
echo - [1/4] Installing/Updating Requirements...
call install_requirements.bat

echo - [2/4] Launching Server Windows...
call start_backend.bat
call start_frontend.bat


echo - [3/4] Opening Web Page...
call open_frontend.bat

echo - [4/4] Opening Admin Page...
call open_backend_admin_panel.bat

echo.
echo ==========================================
echo   SUCCESS: Medcore is now running!
echo ==========================================
echo   Backend:  http://localhost:5001/api
echo   Frontend: http://localhost:5000
echo ==========================================
echo.

timeout /t 2 > nul
