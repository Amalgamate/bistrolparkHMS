@echo off
REM Bristol Park HMS Unified Startup - Windows Batch File
REM This provides the simplest way to start all services on Windows

title Bristol Park HMS - Starting Services...

echo.
echo ========================================================
echo 🏥 Bristol Park Hospital Management System
echo ========================================================
echo 🚀 Starting all services...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available
    echo Please ensure Node.js is properly installed
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

REM Try PowerShell script first (better experience)
echo 🔧 Attempting to use PowerShell startup script...
powershell -ExecutionPolicy Bypass -File "scripts\unified-startup.ps1" 2>nul
if not errorlevel 1 goto :success

echo.
echo ⚠️  PowerShell script failed, falling back to basic startup...
echo.

REM Fallback: Basic service startup
echo 🗄️  Checking PostgreSQL Database...
pg_isready -h localhost -p 5432 >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not running
    echo Please start PostgreSQL service manually
    echo.
) else (
    echo ✅ PostgreSQL Database is running
    echo.
)

echo 🚀 Starting API Server...
cd /d "%~dp0server" 2>nul
if exist "server.js" (
    start "Bristol Park HMS - API Server" cmd /k "node server.js"
    echo ✅ API Server starting in new window...
) else (
    echo ⚠️  API Server not found at expected location
)
echo.

echo 🌐 Starting Frontend Development Server...
cd /d "%~dp0"
start "Bristol Park HMS - Frontend" cmd /k "npm run dev"
echo ✅ Frontend Server starting in new window...
echo.

REM Wait a moment for services to start
echo ⏳ Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo.
echo 🎉 Bristol Park HMS Startup Complete!
echo.
echo 📱 Access the application at: http://localhost:5173
echo 🔧 Service dashboard: http://localhost:5173/admin/services
echo 🔐 Login credentials: bristoladmin / Bristol2024!
echo.

REM Try to open browser with startup progress
echo 🌐 Opening Bristol Park HMS with startup progress...
start "" "http://localhost:5173?startup=true" 2>nul
if errorlevel 1 (
    echo ⚠️  Could not auto-open browser
    echo Please manually navigate to: http://localhost:5173?startup=true
)

:success
echo.
echo ✨ All done! Bristol Park HMS is ready for use.
echo.
echo Press any key to exit...
pause >nul
exit /b 0
