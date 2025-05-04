# start-dev.ps1
# Script to safely run the Next.js development server in PowerShell

# Check if we need to set execution policy for this session
$currentPolicy = Get-ExecutionPolicy -Scope Process
if ($currentPolicy -eq "Restricted" -or $currentPolicy -eq "AllSigned") {
    Write-Host "Setting execution policy to RemoteSigned for current process..."
    try {
        Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
        Write-Host "Execution policy set successfully for this session."
    } catch {
        Write-Host "Warning: Could not set execution policy. You may need to run PowerShell as Administrator."
    }
}

# Print info message
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server"

# Start the Next.js development server
try {
    # Run the dev script from package.json
    pnpm dev
} catch {
    Write-Host "Error starting development server: $_" -ForegroundColor Red
    Write-Host "Try running the following command manually:" -ForegroundColor Yellow
    Write-Host "pnpm dev" -ForegroundColor Cyan
} 