Write-Host "[CoruscantOS] Verificando WSL..."

$wsl = wsl.exe --status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "[CoruscantOS] Instalando WSL + Ubuntu..."
  wsl --install -d Ubuntu
  Write-Host "[CoruscantOS] Reinicia Windows y vuelve a correr este script."
  exit 0
}

Write-Host "[CoruscantOS] WSL detectado. Ejecutando setup de host Linux..."
$linuxPath = "/mnt/c/Users/leoco/CoruscantOS"
wsl bash -lc "cd $linuxPath && chmod +x scripts/*.sh && bash scripts/setup-host.sh"

Write-Host "[CoruscantOS] Setup de WSL finalizado."
