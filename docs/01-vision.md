# Vision de producto

## Objetivo

Construir un sistema operativo movil Linux con:

- experiencia visual tipo iOS;
- base mas abierta y extensible;
- foco en rendimiento, privacidad y arquitectura limpia.

## Principios

1. **UX premium:** animaciones fluidas, tipografia clara, componentes consistentes.
2. **Base robusta:** stack Linux minimalista y mantenible.
3. **Modularidad:** separar kernel/base system/shell/aplicaciones.
4. **Seguridad por defecto:** sandboxing, permisos explicitos, minima superficie.
5. **DX fuerte:** tooling, scripts y documentacion para iterar rapido.

## Alcance fase 1 (MVP tecnico)

- Boot en QEMU ARM64.
- Shell inicial con lockscreen, homescreen, dock, quick settings y app switcher.
- Pipeline reproducible de build de imagen.
- Documentacion completa para evolucion a hardware real.

## Fuera de alcance inicial

- Certificacion telefonica/modem.
- Store de apps.
- Telemetria en produccion.

