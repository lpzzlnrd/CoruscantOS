export class MusicApp {
  constructor() {
    this.isPlaying = false;
    this.audio = new Audio("https://www.myinstants.com/media/sounds/rick-roll.mp3");
    this.audio.loop = true;
  }

  render() {
    return `
      <div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center; text-align: center;">
        <div style="width: 200px; height: 200px; border-radius: 20px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 5rem; animation: ${this.isPlaying ? 'spin 5s linear infinite' : 'none'};">
          🕺
        </div>
        
        <h2 style="margin: 0 0 10px 0; font-size: 1.8rem;">Never Gonna Give You Up</h2>
        <p style="margin: 0 0 40px 0; color: rgba(255,255,255,0.6);">Rick Astley</p>
        
        <div style="display: flex; align-items: center; gap: 30px;">
          <button style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">⏮</button>
          <button class="js-music-play" type="button" style="width: 70px; height: 70px; border-radius: 50%; background: white; color: black; border: none; font-size: 2.5rem; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 15px rgba(255,255,255,0.3);">
            ${this.isPlaying ? '⏸' : '▶'}
          </button>
          <button style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">⏭</button>
        </div>
        
        <style>
          @keyframes spin { 100% { transform: rotate(360deg); } }
        </style>
      </div>
    `;
  }

  handleAction(target, renderCallback) {
    if (target.classList.contains("js-music-play") || target.closest('.js-music-play')) {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play().catch(e => console.log("Audio play failed:", e));
      }
      this.isPlaying = !this.isPlaying;
      if (renderCallback) renderCallback();
    }
  }

  onUnmount() {
    this.audio.pause();
    this.isPlaying = false;
  }
}
