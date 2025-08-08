# Kill ports script
Write-Host "Killing processes on ports..." -ForegroundColor Yellow

$ports = @(4001, 7007, 8003, 5555, 6969, 3000, 4900, 4920, 4200, 8080, 11434, 9000)

foreach ($port in $ports) {
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process on port $port" -ForegroundColor Green
        }
    }
    catch {
        # Port not in use, continue
    }
}

Write-Host "Port cleanup complete." -ForegroundColor Green