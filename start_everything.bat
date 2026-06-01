@REM @echo off
start python -m http.server 5000
start python backend/app.py
start "browser" "http://localhost:5001/"
start frontend/pages/home.html
