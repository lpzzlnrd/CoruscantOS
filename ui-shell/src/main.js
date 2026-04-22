import { gsap } from "gsap";
import { renderShellFrame, renderSwitcher } from "./ui/ShellFrame.js";
import { SystemState } from "./core/SystemState.js";
import { AppManager } from "./core/AppManager.js";

const root = document.getElementById("app");
const state = new SystemState();
const appManager = new AppManager();

// Inicializacion de la UI
root.innerHTML = renderShellFrame(appManager.getAllApps());

const frame = root.querySelector(".phone-frame");
const lockCard = root.querySelector(".js-lock");
const quickPanel = root.querySelector(".js-quick");
const stageTitle = root.querySelector(".js-app-title");
const stageCopy = root.querySelector(".js-app-copy");
const appWindow = root.querySelector(".js-app-window");
const lockError = root.querySelector(".js-lock-error");
const passInput = root.querySelector(".js-pass-input");

gsap.fromTo(
  ".phone-frame",
  { scale: 0.96, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.55, ease: "power2.out" }
);

// Event Delegation
root.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.classList.contains("js-lock-btn")) lockDevice();
  if (target.classList.contains("js-unlock-btn")) unlockDevice();
  if (target.classList.contains("js-clear-pass")) clearPassInput();
  if (target.classList.contains("js-open-quick")) toggleQuickPanel();
  if (target.classList.contains("js-nav")) navigate(target.dataset.target);
  if (target.classList.contains("js-app")) openApp(target.dataset.app);

  // App specific actions
  handleAppActions(target);
});

passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlockDevice();
});

// System Actions
function unlockDevice() {
  if (!state.isLocked) return;

  if (state.unlock(passInput.value)) {
    lockError.textContent = "";
    lockCard.classList.remove("has-error");
    frame.classList.remove("is-locked");
    gsap.to(".lock-card", { y: -18, opacity: 0, duration: 0.22, ease: "power2.inOut" });
  } else {
    lockError.textContent = "Contrasena incorrecta. Intenta de nuevo.";
    lockCard.classList.add("has-error");
    passInput.select();
  }
}

function lockDevice() {
  state.lock();
  frame.classList.add("is-locked");
  frame.dataset.view = "home";
  quickPanel.classList.remove("is-open");
  updateStage("Home", "Selecciona una app para abrirla.");
  passInput.value = "";
  lockError.textContent = "";
  lockCard.classList.remove("has-error");
  gsap.to(".lock-card", { y: 0, opacity: 1, duration: 0.2, ease: "power2.inOut" });
}

function clearPassInput() {
  passInput.value = "";
  lockError.textContent = "";
  lockCard.classList.remove("has-error");
  passInput.focus();
}

function toggleQuickPanel() {
  if (state.isLocked) {
    lockError.textContent = "Desbloquea para abrir Quick Settings.";
    lockCard.classList.add("has-error");
    return;
  }
  quickPanel.classList.toggle("is-open");
  state.setView(quickPanel.classList.contains("is-open") ? "quick" : "home");
  frame.dataset.view = state.currentView;
}

function navigate(view) {
  if (state.isLocked) return;
  
  state.setView(view);
  frame.dataset.view = view;
  quickPanel.classList.remove("is-open");

  if (view === "switcher") {
    updateStage("App Switcher", "Apps abiertas recientemente.", renderSwitcher(state.recentApps));
  } else if (view === "home") {
    updateStage("Home", "Selecciona una app para abrirla.");
  }
}

function openApp(appId) {
  if (state.isLocked) return;

  const appInfo = appManager.getApp(appId);
  if (!appInfo) return;

  state.addRecentApp(appInfo.label);
  state.setView("app");
  frame.dataset.view = "app";
  quickPanel.classList.remove("is-open");

  const content = appInfo.instance ? appInfo.instance.render() : `
    <strong>${appInfo.label}</strong>
    <p>Esta app aun esta en construccion dentro del MVP del shell.</p>
  `;

  updateStage(appInfo.label, `${appInfo.label} esta corriendo dentro de Coruscant Shell.`, content);
  
  if (appId === "weather" && appInfo.instance) {
    appInfo.instance.loadWeather(appInfo.instance.city, appWindow.querySelector(".js-weather-output"));
  }

  gsap.fromTo(".app-window", { y: 12, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.24 });
}

function updateStage(title, copy, customHtml = null) {
  stageTitle.textContent = title;
  stageCopy.textContent = copy;
  if (customHtml) {
    appWindow.innerHTML = customHtml;
  } else {
    appWindow.innerHTML = `
      <strong class="js-app-title">${title}</strong>
      <p class="js-app-copy">${copy}</p>
    `;
  }
}

function handleAppActions(target) {
  if (state.currentView !== "app") return;

  // Calculator
  if (target.classList.contains("js-calc-btn")) {
    const calc = appManager.getApp("calculator").instance;
    const result = calc.handleAction(target);
    const display = appWindow.querySelector(".js-calc-display");
    if (display) display.textContent = result;
  }

  // Weather
  if (target.classList.contains("js-weather-load")) {
    const weather = appManager.getApp("weather").instance;
    const city = appWindow.querySelector(".js-weather-city").value;
    weather.loadWeather(city, appWindow.querySelector(".js-weather-output"));
  }

  // Stopwatch
  const isStopwatch = target.className.includes("stopwatch-btn");
  if (isStopwatch) {
    const sw = appManager.getApp("stopwatch").instance;
    const display = appWindow.querySelector(".js-stopwatch-time");
    const onTick = (val) => { if (display) display.textContent = val; };

    if (target.classList.contains("js-stopwatch-start")) sw.start(onTick);
    if (target.classList.contains("js-stopwatch-pause")) sw.pause();
    if (target.classList.contains("js-stopwatch-reset")) sw.reset(onTick);
  }
}
