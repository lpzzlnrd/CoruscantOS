@echo off
setlocal
cd /d C:\Users\leoco\CoruscantOS\ui-shell

if not exist node_modules (
  echo [CoruscantOS] Instalando dependencias UI...
  call npm install
)

echo [CoruscantOS] Iniciando Coruscant Shell (Vite)...
call npm run dev
