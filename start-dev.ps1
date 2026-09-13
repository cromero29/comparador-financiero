# Script de inicio rapido para desarrollo local
# Comparador Financiero

Write-Host "Iniciando Comparador Financiero..." -ForegroundColor Green
Write-Host ""

# Verificar Docker
Write-Host "Verificando servicios Docker..." -ForegroundColor Cyan
$postgresStatus = docker ps --filter "name=comparador_postgres" --format "{{.Status}}"
$redisStatus = docker ps --filter "name=comparador_redis" --format "{{.Status}}"

if ($postgresStatus -like "*Up*") {
    Write-Host "[OK] PostgreSQL esta corriendo" -ForegroundColor Green
} else {
    Write-Host "[WARN] PostgreSQL no esta corriendo. Iniciando..." -ForegroundColor Yellow
    docker start comparador_postgres
    Start-Sleep -Seconds 3
}

if ($redisStatus -like "*Up*") {
    Write-Host "[OK] Redis esta corriendo" -ForegroundColor Green
} else {
    Write-Host "[WARN] Redis no esta corriendo. Iniciando..." -ForegroundColor Yellow
    docker start comparador_redis
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "Servicios preparados!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el proyecto, abre 2 terminales:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  -> http://localhost:4000" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  -> http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Mas informacion en SETUP_LOCAL.md" -ForegroundColor Cyan
Write-Host ""
