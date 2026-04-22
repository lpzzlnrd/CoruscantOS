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

## Secciones del sistema (explicación)

### 1) `docs/` - Documentación de arquitectura y ejecución

Reúne la definición funcional y técnica del proyecto:

- `01-vision.md`: objetivo del producto, principios y alcance del MVP.
- `02-architecture.md`: capas del sistema (kernel, base Linux, display/compositor, shell y apps).
- `03-build-qemu.md`: guía para construir y arrancar el sistema en QEMU ARM64.
- `04-ui-guidelines.md`: lineamientos visuales y de UX para la shell.
- `05-roadmap.md`: fases de evolución desde MVP hasta ecosistema.

### 2) `os/postmarketos/` - Base del sistema operativo

Contiene la base Linux sobre postmarketOS/Alpine y perfiles de dispositivo.
Actualmente define el target inicial virtual para validar el arranque, el pipeline de imagen y la integración de la shell.

### 3) `ui-shell/` - Interfaz gráfica (Coruscant Shell)

Implementa el frontend de la experiencia móvil (HTML/CSS/JS), construido con Vite.
Aquí se desarrolla la capa visible del sistema: pantalla de bloqueo, home, dock, quick settings y transiciones.

### 4) `scripts/` - Automatización operativa

Incluye scripts para preparar el entorno, compilar imagenes y ejecutar QEMU:

- `setup-host.sh`: prepara dependencias base en Linux.
- `build-image.sh`: flujo de construcción de imágenes.
- `run-qemu.sh`: arranque de la imagen en emulación ARM64.
- `setup-wsl.ps1` y `dev-ui.cmd`: soporte de flujo en Windows/WSL.

## Mapa de capas del sistema

Para ubicar rápidamente cada bloque:

1. **Kernel + drivers** -> base Linux del dispositivo virtual/real.
2. **Base system (postmarketOS/Alpine)** -> servicios y userland.
3. **Display/compositor** -> stack gráfico de render.
4. **Coruscant Shell (`ui-shell/`)** -> experiencia de usuario.
5. **Apps del sistema** -> modulos funcionales (iterativos en roadmap).

## Inicio rápido

1. Revisa `docs/03-build-qemu.md`.
2. Si estas en Windows, ejecuta `scripts/setup-wsl.ps1`.
3. Configura host Linux para build de postmarketOS.
4. Para UI local, ejecuta `scripts/dev-ui.cmd`.
5. Construye imagen aarch64.
6. Inicia QEMU con `scripts/run-qemu.sh`.
7. Itera la UI desde `ui-shell/`.

## Nota importante

El build final del SO debe ejecutarse en Linux (idealmente contenedor/VM Linux), porque `pmbootstrap`, `apk` y pipeline de imagen requieren entorno Linux.
