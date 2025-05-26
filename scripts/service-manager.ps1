# Bristol Park HMS Service Manager
# PowerShell script for managing HMS services on Windows

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("install", "uninstall", "start", "stop", "restart", "status")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "postgresql", "api", "frontend")]
    [string]$Service = "all"
)

# Configuration
$HMS_ROOT = Split-Path -Parent $PSScriptRoot
$API_PATH = Join-Path $HMS_ROOT "api"
$FRONTEND_PATH = $HMS_ROOT
$LOG_PATH = Join-Path $HMS_ROOT "logs"

# Ensure logs directory exists
if (!(Test-Path $LOG_PATH)) {
    New-Item -ItemType Directory -Path $LOG_PATH -Force
}

# Service configurations
$Services = @{
    "postgresql" = @{
        Name = "postgresql-x64-13"
        DisplayName = "PostgreSQL Database Server"
        Description = "Bristol Park HMS Database Service"
        Type = "windows-service"
    }
    "api" = @{
        Name = "BristolParkHMS-API"
        DisplayName = "Bristol Park HMS API Server"
        Description = "Backend API service for Bristol Park Hospital Management System"
        Type = "node-service"
        Path = $API_PATH
        Script = "src/index.js"
        Port = 3001
    }
    "frontend" = @{
        Name = "BristolParkHMS-Frontend"
        DisplayName = "Bristol Park HMS Frontend Server"
        Description = "Frontend web server for Bristol Park Hospital Management System"
        Type = "node-service"
        Path = $FRONTEND_PATH
        Script = "npm run dev"
        Port = 5173
    }
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path (Join-Path $LOG_PATH "service-manager.log") -Value $logMessage
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-NodeService {
    param($ServiceConfig)
    
    Write-Log "Installing Node.js service: $($ServiceConfig.Name)"
    
    # Check if PM2 is installed
    try {
        $pm2Version = npm list -g pm2 --depth=0 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Installing PM2 globally..."
            npm install -g pm2
        }
    } catch {
        Write-Log "Installing PM2 globally..."
        npm install -g pm2
    }
    
    # Create PM2 ecosystem file
    $ecosystemFile = Join-Path $ServiceConfig.Path "ecosystem.config.js"
    $ecosystemContent = @"
module.exports = {
  apps: [{
    name: '$($ServiceConfig.Name)',
    script: '$($ServiceConfig.Script)',
    cwd: '$($ServiceConfig.Path)',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $($ServiceConfig.Port)
    },
    log_file: '$LOG_PATH/$($ServiceConfig.Name).log',
    out_file: '$LOG_PATH/$($ServiceConfig.Name)-out.log',
    error_file: '$LOG_PATH/$($ServiceConfig.Name)-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
"@
    
    Set-Content -Path $ecosystemFile -Value $ecosystemContent
    
    # Start with PM2
    Set-Location $ServiceConfig.Path
    pm2 start ecosystem.config.js
    pm2 save
    
    # Install PM2 as Windows service
    pm2-service-install -n "PM2-$($ServiceConfig.Name)"
    
    Write-Log "Node.js service installed: $($ServiceConfig.Name)"
}

function Uninstall-NodeService {
    param($ServiceConfig)
    
    Write-Log "Uninstalling Node.js service: $($ServiceConfig.Name)"
    
    # Stop and delete PM2 process
    pm2 delete $ServiceConfig.Name 2>$null
    pm2 save
    
    # Remove PM2 Windows service
    $serviceName = "PM2-$($ServiceConfig.Name)"
    if (Get-Service $serviceName -ErrorAction SilentlyContinue) {
        pm2-service-uninstall -n $serviceName
    }
    
    Write-Log "Node.js service uninstalled: $($ServiceConfig.Name)"
}

function Start-ServiceByName {
    param($ServiceName, $ServiceConfig)
    
    Write-Log "Starting service: $ServiceName"
    
    switch ($ServiceConfig.Type) {
        "windows-service" {
            Start-Service -Name $ServiceConfig.Name
        }
        "node-service" {
            Set-Location $ServiceConfig.Path
            pm2 start $ServiceConfig.Name
        }
    }
    
    Write-Log "Service started: $ServiceName"
}

function Stop-ServiceByName {
    param($ServiceName, $ServiceConfig)
    
    Write-Log "Stopping service: $ServiceName"
    
    switch ($ServiceConfig.Type) {
        "windows-service" {
            Stop-Service -Name $ServiceConfig.Name
        }
        "node-service" {
            pm2 stop $ServiceConfig.Name
        }
    }
    
    Write-Log "Service stopped: $ServiceName"
}

function Get-ServiceStatus {
    param($ServiceName, $ServiceConfig)
    
    $status = "Unknown"
    
    switch ($ServiceConfig.Type) {
        "windows-service" {
            $service = Get-Service -Name $ServiceConfig.Name -ErrorAction SilentlyContinue
            $status = if ($service) { $service.Status } else { "Not Found" }
        }
        "node-service" {
            $pm2List = pm2 jlist | ConvertFrom-Json
            $process = $pm2List | Where-Object { $_.name -eq $ServiceConfig.Name }
            $status = if ($process) { $process.pm2_env.status } else { "Not Found" }
        }
    }
    
    return @{
        Name = $ServiceName
        DisplayName = $ServiceConfig.DisplayName
        Status = $status
        Type = $ServiceConfig.Type
    }
}

# Main execution
if (!(Test-Administrator)) {
    Write-Error "This script requires administrator privileges. Please run as administrator."
    exit 1
}

Write-Log "Bristol Park HMS Service Manager - Action: $Action, Service: $Service"

switch ($Action) {
    "install" {
        if ($Service -eq "all" -or $Service -eq "api") {
            Install-NodeService $Services["api"]
        }
        if ($Service -eq "all" -or $Service -eq "frontend") {
            Install-NodeService $Services["frontend"]
        }
        if ($Service -eq "all" -or $Service -eq "postgresql") {
            Write-Log "PostgreSQL service should be installed separately"
        }
    }
    
    "uninstall" {
        if ($Service -eq "all" -or $Service -eq "api") {
            Uninstall-NodeService $Services["api"]
        }
        if ($Service -eq "all" -or $Service -eq "frontend") {
            Uninstall-NodeService $Services["frontend"]
        }
    }
    
    "start" {
        $servicesToStart = if ($Service -eq "all") { $Services.Keys } else { @($Service) }
        foreach ($svc in $servicesToStart) {
            Start-ServiceByName $svc $Services[$svc]
        }
    }
    
    "stop" {
        $servicesToStop = if ($Service -eq "all") { $Services.Keys } else { @($Service) }
        foreach ($svc in $servicesToStop) {
            Stop-ServiceByName $svc $Services[$svc]
        }
    }
    
    "restart" {
        $servicesToRestart = if ($Service -eq "all") { $Services.Keys } else { @($Service) }
        foreach ($svc in $servicesToRestart) {
            Stop-ServiceByName $svc $Services[$svc]
            Start-Sleep -Seconds 3
            Start-ServiceByName $svc $Services[$svc]
        }
    }
    
    "status" {
        $servicesToCheck = if ($Service -eq "all") { $Services.Keys } else { @($Service) }
        foreach ($svc in $servicesToCheck) {
            $status = Get-ServiceStatus $svc $Services[$svc]
            Write-Host "$($status.DisplayName): $($status.Status)" -ForegroundColor $(if ($status.Status -eq "Running" -or $status.Status -eq "online") { "Green" } else { "Red" })
        }
    }
}

Write-Log "Service manager operation completed: $Action"
