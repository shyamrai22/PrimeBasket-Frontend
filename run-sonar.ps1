param(
    [string]$ProjectKey = "PrimeBasket-Frontend",
    [string]$HostUrl = "http://localhost:9000",
    [string]$Token = "sqp_d7570e72fdf36ea80fb9b729d4dd7af0663575b9"
)

# Ensure the script stops on errors
$ErrorActionPreference = "Stop"

Write-Host "Starting SonarQube Scanner for Frontend..." -ForegroundColor Green

# Using npx to run sonar-scanner CLI without needing global installation
npx sonarqube-scanner

Write-Host "SonarQube analysis for Frontend complete!" -ForegroundColor Green
