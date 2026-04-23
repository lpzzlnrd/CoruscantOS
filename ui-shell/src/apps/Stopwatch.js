export class StopwatchApp {
  constructor() {
    this.elapsedMs = 0;
    this.running = false;
    this.lastStart = 0;
    this.intervalId = null;
  }

  render() {
    return `
      <div class="stopwatch-app" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
        <p class="stopwatch-time js-stopwatch-time" style="font-size: 4rem; font-variant-numeric: tabular-nums; margin-bottom: 40px; font-weight: 300;">${this.formatTime(this.elapsedMs)}</p>
        <div class="stopwatch-controls" style="display: flex; gap: 20px;">
          <button class="stopwatch-btn js-stopwatch-start js-stopwatch-btn" type="button" style="width: 80px; height: 80px; border-radius: 50%; border: none; background: #2ed573; color: white; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 15px rgba(46, 213, 115, 0.4);">Start</button>
          <button class="stopwatch-btn js-stopwatch-pause js-stopwatch-btn" type="button" style="width: 80px; height: 80px; border-radius: 50%; border: none; background: #ffa502; color: white; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 165, 2, 0.4);">Pause</button>
          <button class="stopwatch-btn js-stopwatch-reset js-stopwatch-btn" type="button" style="width: 80px; height: 80px; border-radius: 50%; border: none; background: #ff4757; color: white; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);">Reset</button>
        </div>
      </div>
    `;
  }

  handleAction(target) {
    if (!target.classList.contains("js-stopwatch-btn")) return;
    const display = document.querySelector(".js-stopwatch-time");
    const onTick = (val) => { if (display) display.textContent = val; };

    if (target.classList.contains("js-stopwatch-start")) this.start(onTick);
    if (target.classList.contains("js-stopwatch-pause")) this.pause();
    if (target.classList.contains("js-stopwatch-reset")) this.reset(onTick);
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
