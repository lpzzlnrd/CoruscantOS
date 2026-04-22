# Build y ejecucion en QEMU ARM64

## Requisitos host (Linux)

- git
- python3
- sudo
- qemu-system-aarch64
- pmbootstrap

## Flujo recomendado

1. Clonar este repo.
2. Inicializar `pmbootstrap` para `aarch64` + target virtual.
3. Construir imagen.
4. Arrancar en QEMU.
5. Inyectar/actualizar shell UI.

## Script de referencia

Usa:

- `scripts/setup-host.sh`
- `scripts/build-image.sh`
- `scripts/run-qemu.sh`

## Notas

- Si trabajas en Windows, usa WSL2 o VM Linux para build real.
- Mantener versiones fijadas de paquetes reduce roturas en pipeline.

## Flujo en Windows (WSL2)

1. Ejecuta PowerShell como administrador y corre:
   - `wsl --install -d Ubuntu`
2. Reinicia y abre Ubuntu.
3. En Ubuntu:
   - `cd /mnt/c/Users/leoco/CoruscantOS`
   - `bash scripts/setup-host.sh`
   - `bash scripts/build-image.sh`
4. Ejecuta QEMU desde Linux o ajusta rutas para lanzarlo desde Windows.

Para automatizar bootstrap en Windows tienes:

- `scripts/setup-wsl.ps1`
- `scripts/dev-ui.cmd`

