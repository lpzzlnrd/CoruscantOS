export class SystemState {
  constructor() {
    this.isLocked = true;
    this.currentView = "home"; // home, app, switcher, quick
    this.recentApps = [];
    this.LOCK_PASSWORD = "1138";
  }

  unlock(password) {
    if (password === this.LOCK_PASSWORD) {
      this.isLocked = false;
      return true;
    }
    return false;
  }

  lock() {
    this.isLocked = true;
    this.currentView = "home";
  }

  setView(view) {
    this.currentView = view;
  }

  addRecentApp(appName) {
    if (!appName) return;
    this.recentApps = [appName, ...this.recentApps.filter(a => a !== appName)].slice(0, 5);
  }
}
