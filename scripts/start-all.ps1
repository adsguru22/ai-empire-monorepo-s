# Start all services script
Write-Host "Starting AI Empire services..." -ForegroundColor Cyan

# Kill existing processes
& "$PSScriptRoot\kill-ports.ps1"

Start-Sleep -Seconds 2

# Start aggregator
Write-Host "Starting Aggregator on :4900..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\apps\aggregator'; pnpm dev"

Start-Sleep -Seconds 1

# Start MCP bridge
Write-Host "Starting MCP Bridge on :4920..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\apps\mcp-bridge'; pnpm dev"

Start-Sleep -Seconds 1

# Start command center
Write-Host "Starting Command Center on :4200..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\apps\command-center'; pnpm dev"

Start-Sleep -Seconds 2

# Start existing services in new tabs (if directories exist)
if (Test-Path "G:\AI_EMPIRE_CLEAN") {
    Write-Host "Starting AI Empire Core..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'G:\AI_EMPIRE_CLEAN'; npm start"
}

if (Test-Path "G:\spark-ai") {
    Write-Host "Starting Spark AI..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'G:\spark-ai'; node server.js"
}

if (Test-Path "G:\taskmaster") {
    Write-Host "Starting Taskmaster..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'G:\taskmaster'; node server.js"
}

Write-Host ""
Write-Host "All services starting..." -ForegroundColor Green
Write-Host "Command Center: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Aggregator API: http://localhost:4900" -ForegroundColor Cyan
Write-Host "MCP Bridge: http://localhost:4920" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10 seconds then open http://localhost:4200" -ForegroundColor Magenta