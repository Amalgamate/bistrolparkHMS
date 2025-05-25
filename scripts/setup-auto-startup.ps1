# Bristol Park HMS Auto-Startup Configuration
# This script configures the system for automatic service startup

param(
    [Parameter(Mandatory=$false)]
    [switch]$Install,
    
    [Parameter(Mandatory=$false)]
    [switch]$Uninstall,
    
    [Parameter(Mandatory=$false)]
    [switch]$Status
)

# Configuration
$HMS_ROOT = Split-Path -Parent $PSScriptRoot
$SERVICE_NAME = "BristolParkHMS"
$LOG_PATH = Join-Path $HMS_ROOT "logs"

# Ensure logs directory exists
if (!(Test-Path $LOG_PATH)) {
    New-Item -ItemType Directory -Path $LOG_PATH -Force
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path (Join-Path $LOG_PATH "auto-startup.log") -Value $logMessage
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-AutoStartup {
    Write-Log "Installing Bristol Park HMS auto-startup configuration..."
    
    # Check prerequisites
    if (!(Test-Administrator)) {
        Write-Error "Administrator privileges required for auto-startup installation"
        return $false
    }
    
    # Install PM2 globally if not present
    try {
        $pm2Version = npm list -g pm2 --depth=0 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Installing PM2 globally..."
            npm install -g pm2
            npm install -g pm2-windows-startup
        }
    } catch {
        Write-Log "Installing PM2 and PM2 Windows Startup..."
        npm install -g pm2
        npm install -g pm2-windows-startup
    }
    
    # Create PM2 ecosystem configuration
    $ecosystemConfig = @"
module.exports = {
  apps: [
    {
      name: 'bristol-park-api',
      script: 'src/index.js',
      cwd: '$HMS_ROOT/api',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      log_file: '$LOG_PATH/api.log',
      out_file: '$LOG_PATH/api-out.log',
      error_file: '$LOG_PATH/api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'bristol-park-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '$HMS_ROOT',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5173
      },
      log_file: '$LOG_PATH/frontend.log',
      out_file: '$LOG_PATH/frontend-out.log',
      error_file: '$LOG_PATH/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
"@
    
    $ecosystemPath = Join-Path $HMS_ROOT "ecosystem.config.js"
    Set-Content -Path $ecosystemPath -Value $ecosystemConfig
    Write-Log "Created PM2 ecosystem configuration at $ecosystemPath"
    
    # Start applications with PM2
    Set-Location $HMS_ROOT
    pm2 start ecosystem.config.js
    pm2 save
    Write-Log "Started applications with PM2"
    
    # Install PM2 startup service
    pm2-startup install
    Write-Log "Installed PM2 startup service"
    
    # Create Windows startup script
    $startupScript = @"
@echo off
title Bristol Park HMS - Auto Startup
echo Starting Bristol Park Hospital Management System...

REM Start PostgreSQL if not running
net start postgresql-x64-13 >nul 2>&1

REM Wait for database
timeout /t 5 /nobreak >nul

REM Start PM2 services
pm2 resurrect

echo Bristol Park HMS services started successfully
echo Services available at:
echo - Frontend: http://localhost:5173
echo - API: http://localhost:3001
echo - Admin: http://localhost:5173/admin/services

REM Optional: Open browser after delay
timeout /t 10 /nobreak >nul
start http://localhost:5173
"@
    
    $startupScriptPath = Join-Path $HMS_ROOT "auto-start.bat"
    Set-Content -Path $startupScriptPath -Value $startupScript
    Write-Log "Created startup script at $startupScriptPath"
    
    # Add to Windows startup folder
    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupFolder "Bristol Park HMS.lnk"
    
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = $startupScriptPath
    $Shortcut.WorkingDirectory = $HMS_ROOT
    $Shortcut.Description = "Bristol Park Hospital Management System Auto Startup"
    $Shortcut.Save()
    
    Write-Log "Added startup shortcut to Windows startup folder"
    
    # Create system service for critical monitoring
    $serviceScript = @"
# Bristol Park HMS Monitor Service
# This script monitors and restarts services if they fail

while (`$true) {
    try {
        # Check if PM2 processes are running
        `$pm2List = pm2 jlist | ConvertFrom-Json
        `$apiProcess = `$pm2List | Where-Object { `$_.name -eq 'bristol-park-api' }
        `$frontendProcess = `$pm2List | Where-Object { `$_.name -eq 'bristol-park-frontend' }
        
        # Restart if not running
        if (!`$apiProcess -or `$apiProcess.pm2_env.status -ne 'online') {
            Write-Host "Restarting API service..."
            pm2 restart bristol-park-api
        }
        
        if (!`$frontendProcess -or `$frontendProcess.pm2_env.status -ne 'online') {
            Write-Host "Restarting Frontend service..."
            pm2 restart bristol-park-frontend
        }
        
        # Check database connectivity
        try {
            `$connection = New-Object System.Data.SqlClient.SqlConnection
            `$connection.ConnectionString = "Server=localhost;Database=bristol_park_hmis;Integrated Security=true;Connection Timeout=5"
            `$connection.Open()
            `$connection.Close()
        } catch {
            Write-Host "Database connection issue detected"
            # Could add database restart logic here
        }
        
    } catch {
        Write-Host "Monitor error: `$_"
    }
    
    # Wait 60 seconds before next check
    Start-Sleep -Seconds 60
}
"@
    
    $monitorScriptPath = Join-Path $HMS_ROOT "scripts/monitor-services.ps1"
    Set-Content -Path $monitorScriptPath -Value $serviceScript
    Write-Log "Created service monitor script"
    
    Write-Log "Auto-startup installation completed successfully!"
    Write-Log "Bristol Park HMS will now start automatically on system boot"
    
    return $true
}

function Uninstall-AutoStartup {
    Write-Log "Uninstalling Bristol Park HMS auto-startup configuration..."
    
    # Remove PM2 processes
    pm2 delete all 2>$null
    pm2 save
    
    # Uninstall PM2 startup
    pm2-startup uninstall 2>$null
    
    # Remove startup shortcut
    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupFolder "Bristol Park HMS.lnk"
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
        Write-Log "Removed startup shortcut"
    }
    
    # Remove ecosystem config
    $ecosystemPath = Join-Path $HMS_ROOT "ecosystem.config.js"
    if (Test-Path $ecosystemPath) {
        Remove-Item $ecosystemPath -Force
        Write-Log "Removed ecosystem configuration"
    }
    
    Write-Log "Auto-startup uninstallation completed"
}

function Get-AutoStartupStatus {
    Write-Log "Checking Bristol Park HMS auto-startup status..."
    
    # Check PM2 processes
    try {
        $pm2List = pm2 jlist | ConvertFrom-Json
        Write-Host "PM2 Processes:" -ForegroundColor Green
        foreach ($process in $pm2List) {
            $status = $process.pm2_env.status
            $color = if ($status -eq "online") { "Green" } else { "Red" }
            Write-Host "  $($process.name): $status" -ForegroundColor $color
        }
    } catch {
        Write-Host "PM2 not installed or no processes running" -ForegroundColor Yellow
    }
    
    # Check startup shortcut
    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupFolder "Bristol Park HMS.lnk"
    $shortcutExists = Test-Path $shortcutPath
    Write-Host "Windows Startup Shortcut: $(if ($shortcutExists) { 'Installed' } else { 'Not Installed' })" -ForegroundColor $(if ($shortcutExists) { 'Green' } else { 'Red' })
    
    # Check ecosystem config
    $ecosystemPath = Join-Path $HMS_ROOT "ecosystem.config.js"
    $ecosystemExists = Test-Path $ecosystemPath
    Write-Host "PM2 Ecosystem Config: $(if ($ecosystemExists) { 'Present' } else { 'Missing' })" -ForegroundColor $(if ($ecosystemExists) { 'Green' } else { 'Red' })
    
    # Check PostgreSQL service
    try {
        $pgService = Get-Service postgresql-x64-13 -ErrorAction SilentlyContinue
        if ($pgService) {
            $color = if ($pgService.Status -eq "Running") { "Green" } else { "Red" }
            Write-Host "PostgreSQL Service: $($pgService.Status)" -ForegroundColor $color
        } else {
            Write-Host "PostgreSQL Service: Not Found" -ForegroundColor Red
        }
    } catch {
        Write-Host "PostgreSQL Service: Error checking status" -ForegroundColor Red
    }
}

# Main execution
if (!(Test-Administrator) -and ($Install -or $Uninstall)) {
    Write-Error "Administrator privileges required for installation/uninstallation"
    exit 1
}

if ($Install) {
    Install-AutoStartup
} elseif ($Uninstall) {
    Uninstall-AutoStartup
} elseif ($Status) {
    Get-AutoStartupStatus
} else {
    Write-Host "Bristol Park HMS Auto-Startup Configuration" -ForegroundColor Cyan
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  -Install    Install auto-startup configuration"
    Write-Host "  -Uninstall  Remove auto-startup configuration"
    Write-Host "  -Status     Check current auto-startup status"
    Write-Host ""
    Write-Host "Example: .\setup-auto-startup.ps1 -Install"
}
