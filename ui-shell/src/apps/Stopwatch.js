export class StopwatchApp {
  constructor() {
    this.elapsedMs = 0;
    this.running = false;
    this.lastStart = 0;
    this.intervalId = null;
  }

  render() {
    return `
      <div class="stopwatch-app">
        <p class="stopwatch-time js-stopwatch-time">${this.formatTime(this.elapsedMs)}</p>
        <div class="stopwatch-controls">
          <button class="stopwatch-btn js-stopwatch-start" type="button">Start</button>
          <button class="stopwatch-btn js-stopwatch-pause" type="button">Pause</button>
          <button class="stopwatch-btn js-stopwatch-reset" type="button">Reset</button>
        </div>
      </div>
    `;
  }

  start(onTick) {
    if (this.running) return;
    this.running = true;
    this.lastStart = performance.now();
    this.intervalId = window.setInterval(() => {
      const now = performance.now();
      const delta = now - this.lastStart;
      this.lastStart = now;
      this.elapsedMs += delta;
      if (onTick) onTick(this.formatTime(this.elapsedMs));
    }, 100);
  }

  pause() {
    if (!this.running) return;
    this.running = false;
    window.clearInterval(this.intervalId);
  }

  reset(onTick) {
    this.pause();
    this.elapsedMs = 0;
    if (onTick) onTick(this.formatTime(this.elapsedMs));
  }

  formatTime(ms) {
    const totalHundredths = Math.floor(ms / 10);
    const hundredths = totalHundredths % 100;
    const totalSeconds = Math.floor(totalHundredths / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
  }
}
