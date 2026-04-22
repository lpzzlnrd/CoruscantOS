# Seguridad del Bloqueo de Pantalla — CoruscantOS

## Resumen

CoruscantOS implementa autenticación por PIN con las siguientes capas de seguridad:

| Capa | Mecanismo |
|------|-----------|
| Almacenamiento | PBKDF2-SHA-256, nunca texto plano |
| Sal aleatoria | 128 bits (16 bytes) por dispositivo |
| Iteraciones | 100 000 (cost factor PBKDF2) |
| Protección contra fuerza bruta | Bloqueo permanente tras 3 intentos fallidos |
| Persistencia | Todas las claves derivadas se guardan en `localStorage` |

---

## 1. Módulo `security.js`

El archivo `ui-shell/src/security.js` concentra toda la lógica de seguridad y expone una API pública:

### Claves en `localStorage`

| Clave | Contenido |
|-------|-----------|
| `cos_pin_hash` | Hash derivado del PIN (PBKDF2, hex, 256 bits) |
| `cos_pin_salt` | Sal aleatoria (hex, 128 bits) |
| `cos_fail_attempts` | Contador de intentos fallidos consecutivos |
| `cos_lockout` | `"1"` cuando el dispositivo está bloqueado por seguridad |

> **Nota:** el PIN en texto plano **nunca** se almacena ni en `localStorage` ni en memoria más allá del tiempo necesario para la derivación.

### API exportada

```js
initPin()             // Inicializa el PIN por defecto (1138) en el primer arranque
verifyPin(pin)        // Verifica el PIN contra el hash almacenado → Promise<boolean>
changePin(cur, new)   // Cambia el PIN (requiere el PIN actual correcto) → Promise<boolean>
getFailedAttempts()   // Retorna el contador de fallos → number
incrementFailedAttempts() // Incrementa el contador → number
resetFailedAttempts() // Resetea el contador
isLockedOut()         // true si el dispositivo está en bloqueo de seguridad
setLockout(locked)    // Activa / desactiva el bloqueo de seguridad
MAX_ATTEMPTS          // Constante = 3
```

---

## 2. Derivación de la clave (PBKDF2)

```
clave_derivada = PBKDF2-SHA256(
  password = PIN_texto_plano,
  salt     = sal_aleatoria_128bits,
  c        = 100 000,
  dkLen    = 256 bits
)
```

- Se utiliza la **Web Crypto API** nativa del navegador (`crypto.subtle.deriveBits`), sin dependencias externas.
- Cada vez que el usuario cambia el PIN, se genera una **nueva sal**, invalidando cualquier hash anterior.

---

## 3. Flujo de desbloqueo

```
Usuario ingresa PIN
       │
       ▼
¿isLockedOut() == true?
  Sí → mostrar mensaje de bloqueo (Star Wars), deshabilitar formulario
  No
       │
       ▼
verifyPin(pin)
  Correcto → resetFailedAttempts() + desbloquear UI
  Incorrecto
       │
       ▼
incrementFailedAttempts()
  intentos < MAX_ATTEMPTS → mostrar intentos restantes
  intentos >= MAX_ATTEMPTS → setLockout(true) + applyLockoutState()
```

---

## 4. Bloqueo por intentos fallidos

- Máximo **3 intentos** consecutivos.
- Al superar el límite:
  - `setLockout(true)` persiste el estado en `localStorage`.
  - La UI muestra un mensaje de alerta con referencia a **Star Wars**.
  - El campo de PIN y los botones quedan **deshabilitados** (`disabled`).
  - El bloqueo **sobrevive recargas de página** (estado persistido en localStorage).

### Mensajes de alerta (selección aleatoria)

- *"Este no es el PIN que buscas..." — Obi-Wan Kenobi*
- *"Que el PIN esté contigo." Pero claramente no lo está.*
- *"Yo soy tu administrador." — Darth Vader*
- *El Lado Oscuro de la Fuerza ha bloqueado este dispositivo.*

---

## 5. Cambio de PIN (Settings)

El usuario puede cambiar su PIN en la app **Settings → Ajustes de Seguridad**:

1. Ingresar el PIN actual (verificado contra el hash).
2. Ingresar y confirmar el nuevo PIN (mínimo 4 dígitos).
3. Al guardar, se genera una nueva sal y un nuevo hash.

---

## 6. Restablecimiento de emergencia (desarrollo)

En un entorno de desarrollo, el bloqueo de seguridad puede restablecerse manualmente mediante la consola del navegador:

```js
// Restablecer bloqueo (solo para desarrollo/testing)
localStorage.removeItem('cos_lockout');
localStorage.removeItem('cos_fail_attempts');
location.reload();
```

> **Advertencia:** en producción, esta capacidad debería ser reemplazada por un mecanismo de recuperación seguro (código de respaldo, autenticación biométrica, etc.).

---

## 7. Consideraciones de seguridad adicionales

- **localStorage no es cifrado:** los hashes derivados son accesibles desde DevTools. Para un entorno de producción real, se recomienda complementar con cifrado de la partición de datos del sistema operativo subyacente (PostmarketOS).
- **Sin transmisión de red:** la verificación del PIN ocurre completamente en el cliente.
- **Timing attacks:** la comparación de cadenas hex (`hash === storedHash`) puede ser vulnerable a ataques de temporización. Para mitigar esto en producción, se recomienda usar `crypto.subtle.timingSafeEqual` o una implementación equivalente.
