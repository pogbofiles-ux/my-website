@echo off
title The Gym Rat Bible
echo.
echo   THE GYM RAT BIBLE
echo   Opening http://localhost:8080 ...
echo   (Close this window to stop the server)
echo.
cd /d "%~dp0"
start "" http://localhost:8080
python -m http.server 8080
