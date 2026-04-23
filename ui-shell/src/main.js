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
const appWindow = root.querySelector(".js-app-window");
const lockError = root.querySelector(".js-lock-error");
const passInput = root.querySelector(".js-pass-input");

// Intro Animation
gsap.fromTo(
  ".phone-frame",
  { scale: 0.9, opacity: 0, y: 40 },
  { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }
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

  handleAppActions(target);
});

passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlockDevice();
});

// System Actions
function unlockDevice() {
  if (!state.isLocked) return;

  if (state.unlock(passInput.value)) {
    const tl = gsap.timeline({
      onComplete: () => {
        frame.classList.remove("is-locked");
        // Stagger reveal apps
        gsap.fromTo(".app-icon", 
          { scale: 0.5, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.7)" }
        );
      }
    });

    tl.to(".lock-card", { 
      y: -40, 
      opacity: 0, 
      duration: 0.5, 
      ease: "power4.inOut" 
    })
    .to(".phone-frame", {
      backgroundColor: "rgba(13, 20, 38, 0.2)",
      duration: 0.5
    }, "<");

  } else {
    lockError.textContent = "ACCESS DENIED";
    gsap.fromTo(".lock-card", { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
    passInput.select();
  }
}

function lockDevice() {
  state.lock();
  frame.classList.add("is-locked");
  frame.dataset.view = "home";
  quickPanel.classList.remove("is-open");
  
  passInput.value = "";
  lockError.textContent = "";
  
  gsap.to(".lock-card", { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
  gsap.to(".phone-frame", { backgroundColor: "rgba(3, 5, 10, 0.45)", duration: 0.4 });
}

function clearPassInput() {
  passInput.value = "";
  lockError.textContent = "";
  passInput.focus();
}

function toggleQuickPanel() {
  const isOpen = quickPanel.classList.toggle("is-open");
  state.setView(isOpen ? "quick" : "home");
  
  if (isOpen) {
    gsap.fromTo(".quick-item", 
      { opacity: 0, scale: 0.8, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }
    );
  }
}

function navigate(view) {
  if (state.isLocked) return;
  
  const oldView = state.currentView;
  state.setView(view);

  // Call onUnmount if leaving an app
  if (oldView === "app" && view !== "app" && window.currentActiveAppId) {
    const activeApp = appManager.getApp(window.currentActiveAppId);
    if (activeApp && activeApp.instance && typeof activeApp.instance.onUnmount === "function") {
      activeApp.instance.onUnmount();
    }
    window.currentActiveAppId = null;
  }
  frame.dataset.view = view;
  quickPanel.classList.remove("is-open");

  if (view === "switcher") {
    updateStage("Processes", "Active background tasks.", renderSwitcher(state.recentApps));
    gsap.fromTo(".switcher-card", 
      { x: 30, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );
  }

  // Animation based on view change
  if (view === "home") {
    gsap.fromTo(".app-icon", 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" }
    );
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
  window.currentActiveAppId = appId;

  const content = appInfo.instance ? appInfo.instance.render() : `
    <div style="text-align: center; padding-top: 40px;">
      <span style="font-size: 4rem; display: block; margin-bottom: 20px;">🚧</span>
      <strong>${appInfo.label}</strong>
      <p style="opacity: 0.6; margin-top: 12px;">This module is currently under maintenance or encrypted.</p>
    </div>
  `;

  updateStage(appInfo.label, "", content);
  
  if (appId === "weather" && appInfo.instance) {
    appInfo.instance.loadWeather(appInfo.instance.city, appWindow.querySelector(".js-weather-output"));
  }

  if (appInfo.instance && typeof appInfo.instance.onMount === "function") {
    appInfo.instance.onMount(appWindow);
  }

  gsap.fromTo(".app-window", 
    { scale: 0.92, opacity: 0, y: 20 }, 
    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }
  );
}

function updateStage(title, copy, customHtml = null) {
  if (customHtml) {
    appWindow.innerHTML = customHtml;
  } else {
    appWindow.innerHTML = `
      <strong>${title}</strong>
      <p>${copy}</p>
    `;
  }
}

function handleAppActions(target) {
  if (state.currentView !== "app" || !window.currentActiveAppId) return;
  const activeApp = appManager.getApp(window.currentActiveAppId);
  if (activeApp && activeApp.instance && typeof activeApp.instance.handleAction === "function") {
    activeApp.instance.handleAction(target, () => {
      updateStage(activeApp.label, "", activeApp.instance.render());
    });
  }
}
