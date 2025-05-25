@echo off
title Bristol Park Hospital Management System - Service Starter
color 0A

echo.
echo ========================================
echo   Bristol Park Hospital Management System
echo   Service Startup Manager
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Bristol Park HMS services...
echo.

REM Start PostgreSQL service
echo [1/3] Starting PostgreSQL Database Service...
net start postgresql-x64-13 >nul 2>&1
if %errorLevel% equ 0 (
    echo [SUCCESS] PostgreSQL service started
) else (
    echo [INFO] PostgreSQL service already running or failed to start
)

REM Wait for database to be ready
echo [INFO] Waiting for database to be ready...
timeout /t 3 /nobreak >nul

REM Start API server
echo [2/3] Starting API Server...
cd /d "%~dp0api"
if exist "src\index.js" (
    start "Bristol Park HMS API" cmd /k "node src\index.js"
    echo [SUCCESS] API server starting on port 3001
) else (
    echo [ERROR] API server files not found
)

REM Wait for API to start
timeout /t 5 /nobreak >nul

REM Start Frontend server
echo [3/3] Starting Frontend Server...
cd /d "%~dp0"
if exist "package.json" (
    start "Bristol Park HMS Frontend" cmd /k "npm run dev"
    echo [SUCCESS] Frontend server starting on port 5173
) else (
    echo [ERROR] Frontend files not found
)

echo.
echo ========================================
echo   Bristol Park HMS Services Started
echo ========================================
echo.
echo Services should be available at:
echo - Frontend: http://localhost:5173
echo - API:      http://localhost:3001
echo - Database: localhost:5432
echo.
echo Service Management Dashboard:
echo http://localhost:5173/admin/services
echo.

REM Wait and then open browser
echo [INFO] Opening Bristol Park HMS in browser...
timeout /t 10 /nobreak >nul
start http://localhost:5173

echo.
echo Press any key to exit...
pause >nul
