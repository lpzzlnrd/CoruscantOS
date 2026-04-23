export function renderShellFrame(apps) {
  return `
    <main class="phone-frame is-locked" data-view="home">
      <header class="status-bar">
        <button class="status-pill js-open-quick" type="button">09:41</button>
        <span class="status-center">CoruscantOS</span>
        <div class="status-right">
          <span class="status-icon">ᯤ</span>
          <span class="status-icon">🔋</span>
          <span>100%</span>
        </div>
      </header>

      <section class="lock-card js-lock">
        <h1>Coruscant</h1>
        <p>Holonet Secure Link</p>
        
        <div class="lock-input-group">
          <label class="lock-label" for="lock-pass">Access Key</label>
          <input
            id="lock-pass"
            class="lock-input js-pass-input"
            type="password"
            inputmode="numeric"
            maxlength="16"
            placeholder="····"
            autocomplete="off"
          />
        </div>
        
        <p class="lock-error js-lock-error" role="alert" aria-live="assertive"></p>
        
        <div class="lock-actions">
          <button class="lock-btn js-unlock-btn" type="button">Unlock</button>
          <button class="lock-btn is-ghost js-clear-pass" type="button">Clear</button>
        </div>
        
        <div style="margin-top: auto; padding-bottom: 20px; opacity: 0.5; font-size: 0.7rem;">
          SYSTEM AUTH REQUIRED | KEY: 1138
        </div>
      </section>

      <section class="apps-grid">
        ${apps
          .map(
            (app) => `
          <button class="app-icon js-app" type="button" data-app="${app.id}">
            <div class="glyph ${app.icon}">${app.logo || ""}</div>
            <span>${app.label}</span>
          </button>
        `
          )
          .join("")}
      </section>

      <section class="app-stage js-stage" aria-live="polite">
        <div class="app-window js-app-window">
          <strong class="js-app-title">Home</strong>
          <p class="js-app-copy">Select an app to begin.</p>
        </div>
      </section>

      <footer class="dock">
        <button class="js-nav" type="button" data-target="home" title="Home">
          <span style="font-size: 1.2rem;">🏠</span>
        </button>
        <button class="js-nav" type="button" data-target="switcher" title="Switcher">
          <span style="font-size: 1.2rem;">❐</span>
        </button>
        <button class="js-nav" type="button" data-target="quick" title="Quick Settings">
          <span style="font-size: 1.2rem;">⚙️</span>
        </button>
        <button class="js-lock-btn" type="button" title="Lock Device">
          <span style="font-size: 1.2rem;">🔒</span>
        </button>
      </footer>

      <aside class="quick-panel js-quick">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 1.2rem;">Control Center</h2>
          <button class="status-pill js-open-quick" style="padding: 4px 10px;">Close</button>
        </header>
        <div class="quick-grid">
          <button class="quick-item" type="button">🛰️ Wi-Fi</button>
          <button class="quick-item" type="button">🦷 Bluetooth</button>
          <button class="quick-item" type="button">🌙 Focus</button>
          <button class="quick-item" type="button">🔦 Torch</button>
          <button class="quick-item" type="button">✈️ Airplane</button>
          <button class="quick-item" type="button">🔋 Power</button>
        </div>
      </aside>
    </main>
  `;
}

export function renderSwitcher(recentApps) {
  if (!recentApps.length) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.5;">
        <span style="font-size: 3rem; margin-bottom: 20px;">Empty</span>
        <p>No active background processes found.</p>
      </div>
    `;
  }

  return `
    <div class="switcher-grid">
      ${recentApps
        .map(
          (app) => `
        <article class="switcher-card" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 1.1rem;">${app}</strong>
            <span style="font-size: 0.7rem; color: #5ec4ff; font-weight: 700; text-transform: uppercase;">In Memory</span>
          </div>
        </article>
      `
        )
        .join("")}
    </div>
  `;
}
