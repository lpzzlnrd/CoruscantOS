import { gsap } from "gsap";
import { renderShell } from "./shell.js";
import {
  initPin,
  verifyPin,
  changePin,
  getFailedAttempts,
  incrementFailedAttempts,
  resetFailedAttempts,
  isLockedOut,
  setLockout,
  MAX_ATTEMPTS,
} from "./security.js";

const root = document.getElementById("app");

const appNames = {
  calculator: "Calculadora",
  weather: "Clima",
  stopwatch: "Cronometro",
  maps: "Maps",
  music: "Music",
  camera: "Camera",
  files: "Files",
  settings: "Settings"
};

const weatherCodeMap = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla densa",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna fuerte",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia intensa",
  71: "Nieve ligera",
  80: "Chubascos",
  95: "Tormenta"
};

renderShell(root);
const frame = root.querySelector(".phone-frame");
const lockCard = root.querySelector(".js-lock");
const quickPanel = root.querySelector(".js-quick");
const stageTitle = root.querySelector(".js-app-title");
const stageCopy = root.querySelector(".js-app-copy");
const appWindow = root.querySelector(".js-app-window");
const lockError = root.querySelector(".js-lock-error");
const passInput = root.querySelector(".js-pass-input");

let calculatorExpression = "0";
let stopwatchElapsedMs = 0;
let stopwatchIntervalId;
let stopwatchRunning = false;
let stopwatchLastStart = 0;
let weatherLoadedCity = "Santiago";
const recentApps = [];

gsap.fromTo(
  ".phone-frame",
  { scale: 0.96, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.55, ease: "power2.out" }
);

root.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  if (target.classList.contains("js-lock-btn")) {
    lockDevice();
    return;
  }

  if (target.classList.contains("js-unlock-btn")) {
    unlockDevice();
    return;
  }

  if (target.classList.contains("js-clear-pass")) {
    passInput.value = "";
    clearLockError();
    passInput.focus();
    return;
  }

  if (target.classList.contains("js-open-quick")) {
    toggleQuickPanel();
    return;
  }

  if (target.classList.contains("js-nav")) {
    navigate(target.dataset.target);
    return;
  }

  if (target.classList.contains("js-app")) {
    openApp(target.dataset.app);
    return;
  }

  if (target.classList.contains("js-calc-btn")) {
    handleCalculatorAction(target);
    return;
  }

  if (target.classList.contains("js-weather-load")) {
    loadWeatherForInput();
    return;
  }

  if (target.classList.contains("js-stopwatch-start")) {
    startStopwatch();
    return;
  }

  if (target.classList.contains("js-stopwatch-pause")) {
    pauseStopwatch();
    return;
  }

  if (target.classList.contains("js-stopwatch-reset")) {
    resetStopwatch();
    return;
  }

  if (target.classList.contains("js-settings-change-pin")) {
    handleChangePinAction();
    return;
  }
});

passInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlockDevice();
  }
});

function isLocked() {
  return frame.classList.contains("is-locked");
}

function clearLockError() {
  lockError.textContent = "";
  lockCard.classList.remove("has-error");
}

function showLockError(message) {
  lockError.textContent = message;
  lockCard.classList.add("has-error");
}

async function unlockDevice() {
  if (!isLocked()) {
    return;
  }

  if (isLockedOut()) {
    applyLockoutState();
    return;
  }

  const valid = await verifyPin(passInput.value);

  if (!valid) {
    const attempts = incrementFailedAttempts();
    const remaining = MAX_ATTEMPTS - attempts;

    if (attempts >= MAX_ATTEMPTS) {
      setLockout(true);
      applyLockoutState();
    } else {
      showLockError(
        `Contrasena incorrecta. Intentos restantes: ${remaining}.`
      );
      passInput.select();
    }
    return;
  }

  resetFailedAttempts();
  setLockout(false);
  clearLockError();
  frame.classList.remove("is-locked");
  gsap.to(".lock-card", { y: -18, opacity: 0, duration: 0.22, ease: "power2.inOut" });
}

function lockDevice() {
  frame.classList.add("is-locked");
  frame.dataset.view = "home";
  quickPanel.classList.remove("is-open");
  stageTitle.textContent = "Home";
  stageCopy.textContent = "Selecciona una app para abrirla.";
  appWindow.innerHTML = `
    <strong class="js-app-title">Home</strong>
    <p class="js-app-copy">Selecciona una app para abrirla.</p>
  `;
  passInput.value = "";
  clearLockError();

  if (isLockedOut()) {
    applyLockoutState();
  } else {
    removeLockoutState();
  }

  gsap.to(".lock-card", { y: 0, opacity: 1, duration: 0.2, ease: "power2.inOut" });
}

/**
 * Apply the Star Wars lockout banner and disable the PIN form.
 * Called when MAX_ATTEMPTS consecutive failures are reached.
 */
function applyLockoutState() {
  const STAR_WARS_MESSAGES = [
    "\"Este no es el PIN que buscas...\" — Obi-Wan Kenobi",
    "\"Que el PIN esté contigo.\" Pero claramente no lo está.",
    "\"Yo soy tu administrador.\" — Darth Vader",
    "El Lado Oscuro de la Fuerza ha bloqueado este dispositivo.",
  ];
  const msg = STAR_WARS_MESSAGES[Math.floor(Math.random() * STAR_WARS_MESSAGES.length)];

  lockCard.classList.add("is-locked-out");
  showLockError(
    `⚠️ DISPOSITIVO BLOQUEADO ⚠️\n${msg}\nDemasiados intentos fallidos (${MAX_ATTEMPTS}/${MAX_ATTEMPTS}). Contacta al administrador o borra los datos del navegador para restablecer.`
  );

  passInput.disabled = true;
  passInput.value = "";
  passInput.placeholder = "Dispositivo bloqueado";

  const unlockBtn = lockCard.querySelector(".js-unlock-btn");
  const clearBtn = lockCard.querySelector(".js-clear-pass");
  if (unlockBtn) unlockBtn.disabled = true;
  if (clearBtn) clearBtn.disabled = true;
}

/**
 * Remove lockout state from the UI (used when lockout is cleared programmatically).
 */
function removeLockoutState() {
  lockCard.classList.remove("is-locked-out");
  passInput.disabled = false;
  passInput.placeholder = "Ingresa tu clave";

  const unlockBtn = lockCard.querySelector(".js-unlock-btn");
  const clearBtn = lockCard.querySelector(".js-clear-pass");
  if (unlockBtn) unlockBtn.disabled = false;
  if (clearBtn) clearBtn.disabled = false;
}

function toggleQuickPanel() {
  if (isLocked()) {
    showLockError("Desbloquea para abrir Quick Settings.");
    return;
  }

  quickPanel.classList.toggle("is-open");
  frame.dataset.view = quickPanel.classList.contains("is-open") ? "quick" : "home";
}

function navigate(targetView) {
  if (isLocked()) {
    showLockError("Ingresa la contrasena para navegar.");
    return;
  }

  frame.dataset.view = targetView;
  if (targetView !== "quick") {
    quickPanel.classList.remove("is-open");
  } else {
    quickPanel.classList.add("is-open");
  }

  if (targetView === "switcher") {
    stageTitle.textContent = "App Switcher";
    stageCopy.textContent = "Apps abiertas recientemente.";
    appWindow.innerHTML = renderSwitcherApp();
  } else if (targetView === "home") {
    stageTitle.textContent = "Home";
    stageCopy.textContent = "Selecciona una app para abrirla.";
    appWindow.innerHTML = `
      <strong class="js-app-title">Home</strong>
      <p class="js-app-copy">Selecciona una app para abrirla.</p>
    `;
  }
}

function openApp(appName) {
  if (isLocked()) {
    showLockError("Desbloquea el sistema para abrir apps.");
    return;
  }

  const normalizedApp = appName || "";
  const title = appNames[normalizedApp] || normalizedApp;

  recentApps.unshift(title);
  if (recentApps.length > 5) {
    recentApps.pop();
  }

  frame.dataset.view = "app";
  quickPanel.classList.remove("is-open");
  stageTitle.textContent = title;
  stageCopy.textContent = `${title} esta corriendo dentro de Coruscant Shell.`;

  if (normalizedApp === "calculator") {
    appWindow.innerHTML = renderCalculatorApp();
    updateCalculatorDisplay();
  } else if (normalizedApp === "weather") {
    appWindow.innerHTML = renderWeatherApp();
    loadWeather(weatherLoadedCity);
  } else if (normalizedApp === "stopwatch") {
    appWindow.innerHTML = renderStopwatchApp();
    renderStopwatchTime();
  } else if (normalizedApp === "settings") {
    appWindow.innerHTML = renderSettingsApp();
  } else {
    appWindow.innerHTML = renderPlaceholderApp(title);
  }

  gsap.fromTo(".app-window", { y: 12, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.24 });
}

function renderPlaceholderApp(appLabel) {
  return `
    <strong>${appLabel}</strong>
    <p>Esta app aun esta en construccion dentro del MVP del shell.</p>
  `;
}

function renderSwitcherApp() {
  if (!recentApps.length) {
    return "<p class=\"switcher-empty\">Aun no hay apps abiertas en esta sesion.</p>";
  }

  return `
    <div class="switcher-grid">
      ${recentApps
        .map(
          (app) => `
        <article class="switcher-card">
          <strong>${app}</strong>
          <p>Estado: en memoria</p>
        </article>
      `
        )
        .join("")}
    </div>
  `;
}

function renderCalculatorApp() {
  return `
    <div class="calc-app">
      <label for="calc-display" class="calc-label">Calculadora</label>
      <output id="calc-display" class="calc-display js-calc-display">0</output>
      <div class="calc-grid">
        <button class="calc-btn js-calc-btn" data-calc-action="clear" type="button">C</button>
        <button class="calc-btn js-calc-btn" data-calc-action="backspace" type="button">DEL</button>
        <button class="calc-btn js-calc-btn" data-calc-value="/" type="button">/</button>
        <button class="calc-btn js-calc-btn" data-calc-value="*" type="button">x</button>

        <button class="calc-btn js-calc-btn" data-calc-value="7" type="button">7</button>
        <button class="calc-btn js-calc-btn" data-calc-value="8" type="button">8</button>
        <button class="calc-btn js-calc-btn" data-calc-value="9" type="button">9</button>
        <button class="calc-btn js-calc-btn" data-calc-value="-" type="button">-</button>

        <button class="calc-btn js-calc-btn" data-calc-value="4" type="button">4</button>
        <button class="calc-btn js-calc-btn" data-calc-value="5" type="button">5</button>
        <button class="calc-btn js-calc-btn" data-calc-value="6" type="button">6</button>
        <button class="calc-btn js-calc-btn" data-calc-value="+" type="button">+</button>

        <button class="calc-btn js-calc-btn" data-calc-value="1" type="button">1</button>
        <button class="calc-btn js-calc-btn" data-calc-value="2" type="button">2</button>
        <button class="calc-btn js-calc-btn" data-calc-value="3" type="button">3</button>
        <button class="calc-btn is-equal js-calc-btn" data-calc-action="equals" type="button">=</button>

        <button class="calc-btn calc-zero js-calc-btn" data-calc-value="0" type="button">0</button>
        <button class="calc-btn js-calc-btn" data-calc-value="." type="button">.</button>
      </div>
    </div>
  `;
}

function handleCalculatorAction(target) {
  if (frame.dataset.view !== "app") {
    return;
  }

  const action = target.dataset.calcAction;
  const value = target.dataset.calcValue;

  if (action === "clear") {
    calculatorExpression = "0";
  } else if (action === "backspace") {
    calculatorExpression = calculatorExpression.slice(0, -1) || "0";
  } else if (action === "equals") {
    calculatorExpression = evaluateCalculatorExpression(calculatorExpression);
  } else if (value) {
    calculatorExpression = appendCalculatorValue(calculatorExpression, value);
  }

  updateCalculatorDisplay();
}

function appendCalculatorValue(currentExpression, nextValue) {
  if (currentExpression === "0" && /\d/.test(nextValue)) {
    return nextValue;
  }

  if (nextValue === ".") {
    const chunk = currentExpression.split(/[+\-*/]/).at(-1);
    if (chunk.includes(".")) {
      return currentExpression;
    }
  }

  const lastChar = currentExpression.at(-1);
  if (/[+\-*/]/.test(lastChar) && /[+\-*/]/.test(nextValue)) {
    return `${currentExpression.slice(0, -1)}${nextValue}`;
  }

  return `${currentExpression}${nextValue}`;
}

function evaluateCalculatorExpression(expression) {
  if (!/^[0-9+\-*/.\s()]+$/.test(expression)) {
    return "0";
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) {
      return "0";
    }

    return Number(result.toFixed(8)).toString();
  } catch {
    return "0";
  }
}

function updateCalculatorDisplay() {
  const display = root.querySelector(".js-calc-display");
  if (display) {
    display.textContent = calculatorExpression;
  }
}

function renderWeatherApp() {
  return `
    <div class="weather-app">
      <div class="weather-controls">
        <input class="weather-input js-weather-city" type="text" value="${weatherLoadedCity}" placeholder="Ciudad" />
        <button class="weather-btn js-weather-load" type="button">Actualizar</button>
      </div>
      <article class="weather-card js-weather-output">
        <p>Cargando clima...</p>
      </article>
    </div>
  `;
}

function loadWeatherForInput() {
  const input = root.querySelector(".js-weather-city");
  const requestedCity = input?.value?.trim();
  if (!requestedCity) {
    return;
  }

  loadWeather(requestedCity);
}

async function loadWeather(city) {
  const output = root.querySelector(".js-weather-output");
  if (!output) {
    return;
  }

  output.innerHTML = "<p>Consultando servicio meteorologico...</p>";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error("Geocoding unavailable");
    }

    const geoData = await geoResponse.json();
    const firstResult = geoData?.results?.[0];
    if (!firstResult) {
      throw new Error("City not found");
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${firstResult.latitude}&longitude=${firstResult.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Weather unavailable");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    weatherLoadedCity = firstResult.name;

    output.innerHTML = `
      <h3>${firstResult.name}, ${firstResult.country || ""}</h3>
      <p class="weather-temp">${Math.round(current.temperature_2m)} ${weatherData.current_units.temperature_2m}</p>
      <p>${weatherCodeMap[current.weather_code] || "Condicion variable"}</p>
      <p>Humedad: ${current.relative_humidity_2m}${weatherData.current_units.relative_humidity_2m}</p>
      <p>Viento: ${Math.round(current.wind_speed_10m)} ${weatherData.current_units.wind_speed_10m}</p>
    `;
  } catch {
    output.innerHTML = `
      <h3>${city}</h3>
      <p class="weather-temp">22 C</p>
      <p>Modo offline: sin conexion al servicio.</p>
      <p>Tip: prueba otra ciudad o revisa internet.</p>
    `;
  }
}

function renderStopwatchApp() {
  return `
    <div class="stopwatch-app">
      <p class="stopwatch-time js-stopwatch-time">00:00.00</p>
      <div class="stopwatch-controls">
        <button class="stopwatch-btn js-stopwatch-start" type="button">Start</button>
        <button class="stopwatch-btn js-stopwatch-pause" type="button">Pause</button>
        <button class="stopwatch-btn js-stopwatch-reset" type="button">Reset</button>
      </div>
    </div>
  `;
}

function startStopwatch() {
  if (stopwatchRunning) {
    return;
  }

  stopwatchRunning = true;
  stopwatchLastStart = performance.now();
  stopwatchIntervalId = window.setInterval(() => {
    const now = performance.now();
    const delta = now - stopwatchLastStart;
    stopwatchLastStart = now;
    stopwatchElapsedMs += delta;
    renderStopwatchTime();
  }, 100);
}

function pauseStopwatch() {
  if (!stopwatchRunning) {
    return;
  }

  stopwatchRunning = false;
  window.clearInterval(stopwatchIntervalId);
}

function resetStopwatch() {
  pauseStopwatch();
  stopwatchElapsedMs = 0;
  renderStopwatchTime();
}

function formatStopwatch(ms) {
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function renderStopwatchTime() {
  const timeEl = root.querySelector(".js-stopwatch-time");
  if (timeEl) {
    timeEl.textContent = formatStopwatch(stopwatchElapsedMs);
  }
}

// ─── Settings app ─────────────────────────────────────────────────────────────

function renderSettingsApp() {
  const attempts = getFailedAttempts();
  const locked = isLockedOut();
  return `
    <div class="settings-app">
      <h3>Ajustes de Seguridad</h3>
      <fieldset class="settings-fieldset">
        <legend>Cambiar PIN</legend>
        <label class="settings-label" for="settings-current-pin">PIN actual</label>
        <input
          id="settings-current-pin"
          class="settings-input js-settings-current-pin"
          type="password"
          inputmode="numeric"
          maxlength="16"
          placeholder="PIN actual"
          autocomplete="current-password"
        />
        <label class="settings-label" for="settings-new-pin">Nuevo PIN (min. 4 digitos)</label>
        <input
          id="settings-new-pin"
          class="settings-input js-settings-new-pin"
          type="password"
          inputmode="numeric"
          maxlength="16"
          placeholder="Nuevo PIN"
          autocomplete="new-password"
        />
        <label class="settings-label" for="settings-confirm-pin">Confirmar nuevo PIN</label>
        <input
          id="settings-confirm-pin"
          class="settings-input js-settings-confirm-pin"
          type="password"
          inputmode="numeric"
          maxlength="16"
          placeholder="Confirmar PIN"
          autocomplete="new-password"
        />
        <p class="settings-msg js-settings-msg"></p>
        <button class="settings-btn js-settings-change-pin" type="button">Guardar nuevo PIN</button>
      </fieldset>
      <p class="settings-info">
        Intentos fallidos actuales: <strong>${attempts}</strong> / ${MAX_ATTEMPTS}<br/>
        Estado del dispositivo: <strong>${locked ? "BLOQUEADO" : "Activo"}</strong>
      </p>
    </div>
  `;
}

async function handleChangePinAction() {
  const currentPinInput = root.querySelector(".js-settings-current-pin");
  const newPinInput = root.querySelector(".js-settings-new-pin");
  const confirmPinInput = root.querySelector(".js-settings-confirm-pin");
  const msgEl = root.querySelector(".js-settings-msg");

  if (!currentPinInput || !newPinInput || !confirmPinInput || !msgEl) {
    return;
  }

  const currentPin = currentPinInput.value;
  const newPin = newPinInput.value;
  const confirmPin = confirmPinInput.value;

  msgEl.className = "settings-msg js-settings-msg";

  if (newPin.length < 4) {
    msgEl.textContent = "El nuevo PIN debe tener al menos 4 digitos.";
    return;
  }

  if (newPin !== confirmPin) {
    msgEl.textContent = "Los PINs nuevos no coinciden.";
    return;
  }

  const btn = root.querySelector(".js-settings-change-pin");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Guardando...";
  }

  const success = await changePin(currentPin, newPin);

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Guardar nuevo PIN";
  }

  if (success) {
    msgEl.textContent = "✓ PIN cambiado correctamente.";
    msgEl.classList.add("is-success");
    currentPinInput.value = "";
    newPinInput.value = "";
    confirmPinInput.value = "";
  } else {
    msgEl.textContent = "PIN actual incorrecto.";
  }
}

// ─── Security bootstrap ───────────────────────────────────────────────────────

(async () => {
  await initPin();
  if (isLockedOut()) {
    applyLockoutState();
  }
})();

