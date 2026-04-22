export function renderShellFrame(apps) {
  return `
    <main class="phone-frame is-locked" data-view="home">
      <header class="status-bar">
        <button class="status-pill js-open-quick" type="button">09:41</button>
        <span>CoruscantOS</span>
        <span>100%</span>
      </header>

      <section class="lock-card js-lock">
        <h1>Coruscant</h1>
        <p>Pantalla de bloqueo segura</p>
        <label class="lock-label" for="lock-pass">Contrasena</label>
        <input
          id="lock-pass"
          class="lock-input js-pass-input"
          type="password"
          inputmode="numeric"
          maxlength="16"
          placeholder="Ingresa tu clave"
          autocomplete="off"
        />
        <p class="lock-error js-lock-error" role="alert" aria-live="assertive"></p>
        <div class="lock-actions">
          <button class="lock-btn js-unlock-btn" type="button">Desbloquear</button>
          <button class="lock-btn is-ghost js-clear-pass" type="button">Limpiar</button>
        </div>
        <small>Demo local. Clave inicial: 1138</small>
      </section>

      <section class="apps-grid">
        ${apps
          .map(
            (app) => `
          <button class="app-icon js-app" type="button" data-app="${app.id}">
            <span class="glyph ${app.icon}"></span>
            <span>${app.label}</span>
          </button>
        `
          )
          .join("")}
      </section>

      <section class="app-stage js-stage" aria-live="polite">
        <div class="app-window js-app-window">
          <strong class="js-app-title">Home</strong>
          <p class="js-app-copy">Selecciona una app para abrirla.</p>
        </div>
      </section>

      <footer class="dock">
        <button class="js-nav" type="button" data-target="home">Home</button>
        <button class="js-nav" type="button" data-target="switcher">Switcher</button>
        <button class="js-nav" type="button" data-target="quick">Quick</button>
        <button class="js-lock-btn" type="button">Lock</button>
      </footer>

      <aside class="quick-panel js-quick">
        <h2>Quick Settings</h2>
        <div class="quick-grid">
          <button class="quick-item" type="button">Wi-Fi</button>
          <button class="quick-item" type="button">Bluetooth</button>
          <button class="quick-item" type="button">Focus</button>
          <button class="quick-item" type="button">Torch</button>
        </div>
      </aside>
    </main>
  `;
}

export function renderSwitcher(recentApps) {
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
