# start-agrisahayak.ps1 - 1-Click Launch Script for AgriSahayak
$nodePath = "C:\Users\win10\node-v20.18.0-win-x64\node.exe"
$npmPath = "C:\Users\win10\node-v20.18.0-win-x64\npm.cmd"

Write-Host "🌾 Starting AgriSahayak Digital Agriculture Support System..." -ForegroundColor Green

# Start Backend Server
Start-Process -FilePath $nodePath -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\server" -WindowStyle Hidden
Write-Host "📡 Backend API Gateway started at http://localhost:5000" -ForegroundColor Cyan

# Start Frontend Dev Server
Start-Process -FilePath $npmPath -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\client"
Write-Host "💻 Frontend Web App started at http://localhost:5173" -ForegroundColor Yellow
Write-Host "🚀 AgriSahayak is now running!" -ForegroundColor Green
