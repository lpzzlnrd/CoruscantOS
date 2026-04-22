# CoruscantOS

CoruscantOS es una base de sistema operativo movil Linux (inspirado en iOS, con enfoque mas "pro"), pensada para arrancar en **QEMU ARM64** y evolucionar despues a hardware real.

## Identidad

- **Nombre:** CoruscantOS
- **Inspiracion:** Star Wars (capital galactica, tecnologia avanzada)
- **Base Linux:** postmarketOS (Alpine Linux)
- **Shell grafica:** Web UI sobre GTK/WebKit

## Estado actual

Este repositorio contiene:

1. Base de arquitectura del proyecto.
2. Prototipo funcional de interfaz movil (HTML/CSS/JS).
3. Guia de build para imagen ARM64 en QEMU.
4. Documentacion integral para evolucion a MVP y produccion.

## Estructura

```text
CoruscantOS/
  docs/
  os/
    postmarketos/
  scripts/
  ui-shell/
```

## Inicio rapido

1. Revisa `docs/03-build-qemu.md`.
2. Si estas en Windows, ejecuta `scripts/setup-wsl.ps1`.
3. Configura host Linux para build de postmarketOS.
4. Para UI local, ejecuta `scripts/dev-ui.cmd`.
5. Construye imagen aarch64.
6. Inicia QEMU con `scripts/run-qemu.sh`.
7. Itera la UI desde `ui-shell/`.

## Nota importante

El build final del SO debe ejecutarse en Linux (idealmente contenedor/VM Linux), porque `pmbootstrap`, `apk` y pipeline de imagen requieren entorno Linux.
