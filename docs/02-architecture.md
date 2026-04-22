# Arquitectura tecnica

## Capas

1. **Kernel + drivers**
   - Linux kernel (perfil postmarketOS/aarch64).
2. **Base system**
   - Alpine userland, OpenRC, paquetes base.
3. **Compositor / Display**
   - Wayland stack (migrable segun decisiones de shell).
4. **Shell UI (Coruscant Shell)**
   - GTK host + WebKit render de UI HTML/CSS/JS.
5. **Apps del sistema**
   - Ajustes, telefono, mensajes, camara (iterativas).

## Diseño de shell

- **Host nativo:** proceso GTK que renderiza WebKit.
- **Frontend shell:** SPA modular (componentes UI, estado global, animaciones).
- **Contrato host-shell:** bridge JS para:
  - estado de bateria/red/bluetooth;
  - eventos hardware (botones, desbloqueo);
  - launch/close de apps sandbox.

## Seguridad (target)

- apps en contenedores ligeros por usuario/sesion.
- permisos por capacidad (camara, microfono, archivos, red local).
- defaults deny y prompts explicitos.

## Rendimiento (target)

- 60fps en transiciones base.
- cold start shell < 2s despues de login.
- mem budget shell: ~250MB target inicial.

## Estrategia de evolucion

1. MVP en QEMU.
2. Port a PinePhone o dispositivo ARM soportado.
3. Hardening de seguridad y energia.
4. App framework estable.

