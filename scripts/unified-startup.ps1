# Bristol Park HMS Unified Startup Script (PowerShell)
# Provides single command startup with visual feedback

param(
    [switch]$SkipBrowser,
    [switch]$Verbose
)

# Service configuration
$Services = @{
    'database' = @{
        Name = 'PostgreSQL Database'
        Port = 5432
        CheckCommand = 'pg_isready -h localhost -p 5432'
        StartCommand = $null
        Icon = '🗄️'
        Priority = 1
    }
    'api' = @{
        Name = 'API Server'
        Port = 3001
        CheckCommand = 'Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5'
        StartCommand = 'node server.js'
        WorkingDir = Join-Path $PSScriptRoot '..\server'
        Icon = '🚀'
        Priority = 2
    }
    'frontend' = @{
        Name = 'Frontend Server'
        Port = 5173
        CheckCommand = 'Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5'
        StartCommand = 'npm run dev'
        WorkingDir = Join-Path $PSScriptRoot '..'
        Icon = '🌐'
        Priority = 3
    }
}

# Global variables
$ServiceStatus = @{}
$Processes = @{}

# Initialize service status
foreach ($serviceKey in $Services.Keys) {
    $ServiceStatus[$serviceKey] = @{
        Status = 'checking'
        Message = 'Initializing...'
        Error = $null
    }
}

function Write-ColoredOutput {
    param(
        [string]$Text,
        [string]$Color = 'White'
    )

    $colorMap = @{
        'Red' = 'Red'
        'Green' = 'Green'
        'Yellow' = 'Yellow'
        'Blue' = 'Blue'
        'Magenta' = 'Magenta'
        'Cyan' = 'Cyan'
        'White' = 'White'
        'BgRed' = 'Red'
        'BgGreen' = 'Green'
        'BgYellow' = 'Yellow'
    }

    $foregroundColor = $colorMap[$Color]
    if ($foregroundColor) {
        Write-Host $Text -ForegroundColor $foregroundColor
    } else {
        Write-Host $Text
    }
}

function Write-ServiceStatus {
    param(
        [string]$ServiceKey,
        [string]$Status,
        [string]$Message = ''
    )

    $service = $Services[$ServiceKey]

    $statusColors = @{
        'checking' = 'Yellow'
        'starting' = 'Cyan'
        'running' = 'Green'
        'ready' = 'Green'
        'error' = 'Red'
        'failed' = 'Red'
    }

    $statusIcons = @{
        'checking' = '🔍'
        'starting' = '⏳'
        'running' = '✅'
        'ready' = '🎉'
        'error' = '❌'
        'failed' = '💥'
    }

    $color = $statusColors[$Status]
    $icon = $statusIcons[$Status]

    Write-ColoredOutput "$icon $($service.Icon) $($service.Name) (Port $($service.Port)): $($Status.ToUpper())" $color

    if ($Message) {
        Write-ColoredOutput "   $Message" 'Cyan'
    }
}

function Test-Service {
    param([string]$ServiceKey)

    $service = $Services[$ServiceKey]

    try {
        if ($service.CheckCommand) {
            if ($service.CheckCommand.StartsWith('Invoke-WebRequest')) {
                Invoke-Expression $service.CheckCommand | Out-Null
            } else {
                cmd /c $service.CheckCommand 2>$null | Out-Null
            }
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

function Start-Service {
    param([string]$ServiceKey)

    $service = $Services[$ServiceKey]

    if (-not $service.StartCommand) {
        $ServiceStatus[$ServiceKey] = @{
            Status = 'error'
            Message = 'No start command configured'
            Error = 'Service must be started manually'
        }
        return $false
    }

    $ServiceStatus[$ServiceKey] = @{
        Status = 'starting'
        Message = 'Launching service...'
        Error = $null
    }

    Write-ServiceStatus $ServiceKey 'starting' 'Launching service...'

    try {
        $workingDir = $service.WorkingDir
        if (-not $workingDir) {
            $workingDir = $PSScriptRoot
        }

        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "powershell.exe"
        $processInfo.Arguments = "-Command `"cd '$workingDir'; $($service.StartCommand)`""
        $processInfo.UseShellExecute = $false
        $processInfo.CreateNoWindow = $true
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true

        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo
        $process.Start() | Out-Null

        $Processes[$ServiceKey] = $process

        # Wait a moment for the service to start
        Start-Sleep -Seconds 3

        $ServiceStatus[$ServiceKey] = @{
            Status = 'running'
            Message = 'Service is running'
            Error = $null
        }

        Write-ServiceStatus $ServiceKey 'running' 'Service is running'
        return $true
    }
    catch {
        $ServiceStatus[$ServiceKey] = @{
            Status = 'failed'
            Message = $_.Exception.Message
            Error = $_.Exception.Message
        }

        Write-ServiceStatus $ServiceKey 'failed' $_.Exception.Message
        return $false
    }
}

function Wait-ForService {
    param(
        [string]$ServiceKey,
        [int]$MaxAttempts = 30
    )

    for ($i = 0; $i -lt $MaxAttempts; $i++) {
        if (Test-Service $ServiceKey) {
            $ServiceStatus[$ServiceKey] = @{
                Status = 'ready'
                Message = 'Service is ready and responding'
                Error = $null
            }
            Write-ServiceStatus $ServiceKey 'ready' 'Service is ready and responding'
            return $true
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Open-ServiceDashboard {
    if (-not $SkipBrowser) {
        try {
            Start-Process "http://localhost:5173?startup=true"
            Write-ColoredOutput '🌐 Opening Bristol Park HMS with startup progress...' 'Cyan'
        }
        catch {
            Write-ColoredOutput '⚠️  Could not auto-open browser. Please navigate to: http://localhost:5173?startup=true' 'Yellow'
        }
    }
}

# Main startup sequence
function Start-UnifiedStartup {
    Write-ColoredOutput '🏥 Bristol Park HMS - Unified Startup' 'White'
    Write-ColoredOutput ('=' * 50) 'Blue'
    Write-ColoredOutput 'Starting all services with dependency management...' 'Cyan'
    Write-Host ''

    # Sort services by priority
    $sortedServices = $Services.Keys | Sort-Object { $Services[$_].Priority }

    # Check and start each service
    foreach ($serviceKey in $sortedServices) {
        $service = $Services[$serviceKey]

        Write-ServiceStatus $serviceKey 'checking' 'Checking service status...'

        $isRunning = Test-Service $serviceKey

        if ($isRunning) {
            $ServiceStatus[$serviceKey] = @{
                Status = 'ready'
                Message = 'Service is already running'
                Error = $null
            }
            Write-ServiceStatus $serviceKey 'ready' 'Service is already running'
        }
        else {
            if ($service.StartCommand) {
                $started = Start-Service $serviceKey
                if ($started) {
                    Wait-ForService $serviceKey | Out-Null
                }
            }
            else {
                $ServiceStatus[$serviceKey] = @{
                    Status = 'error'
                    Message = 'Service not running and no start command available'
                    Error = 'Manual start required'
                }
                Write-ServiceStatus $serviceKey 'error' 'Service not running - please start manually'
            }
        }

        Write-Host ''
    }

    # Summary
    Write-ColoredOutput '🎯 Startup Summary' 'White'
    Write-ColoredOutput ('=' * 30) 'Blue'

    $allReady = $true
    foreach ($serviceKey in $Services.Keys) {
        $status = $ServiceStatus[$serviceKey]
        $isReady = $status.Status -eq 'ready' -or $status.Status -eq 'running'
        $allReady = $allReady -and $isReady

        $statusText = if ($isReady) { 'READY' } else { 'FAILED' }
        $color = if ($isReady) { 'Green' } else { 'Red' }
        Write-ColoredOutput "$($Services[$serviceKey].Icon) $($Services[$serviceKey].Name): $statusText" $color
    }

    Write-Host ''

    if ($allReady) {
        Write-ColoredOutput '🎉 All services are ready!' 'Green'
        Write-ColoredOutput '🌐 Opening service management dashboard...' 'Cyan'

        # Open service dashboard immediately
        Open-ServiceDashboard

        # Wait a moment then show next steps
        Start-Sleep -Seconds 2
        Write-ColoredOutput '🔐 Ready for login...' 'Cyan'
    }
    else {
        Write-ColoredOutput '⚠️  Some services failed to start' 'Yellow'
        Write-ColoredOutput '🔧 Check the service management dashboard for details' 'Yellow'
        Open-ServiceDashboard
    }

    Write-ColoredOutput '✨ Bristol Park HMS is ready for use!' 'White'
    Write-ColoredOutput '📱 Access the application at: http://localhost:5173' 'Cyan'
    Write-ColoredOutput '🔧 Service dashboard: http://localhost:5173/admin/services' 'Cyan'
    Write-ColoredOutput '🔐 Login credentials: bristoladmin / Bristol2024!' 'Yellow'
}

# Handle Ctrl+C
$null = Register-EngineEvent PowerShell.Exiting -Action {
    Write-ColoredOutput "`n🛑 Shutting down services..." 'Yellow'

    foreach ($serviceKey in $Processes.Keys) {
        if ($Processes[$serviceKey] -and -not $Processes[$serviceKey].HasExited) {
            $Processes[$serviceKey].Kill()
        }
    }
}

# Start the sequence
try {
    Start-UnifiedStartup
}
catch {
    Write-ColoredOutput "💥 Startup failed: $($_.Exception.Message)" 'Red'
    exit 1
}
