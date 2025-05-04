@echo off
echo Starting РиелторПро development server...
echo.

:: Run PowerShell with bypass execution policy to run our script
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1

:: If PowerShell exits with an error, pause so user can see the error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error occurred when starting the development server.
    pause
) 