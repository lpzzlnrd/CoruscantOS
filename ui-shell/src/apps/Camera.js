export class CameraApp {
  constructor() {
    this.stream = null;
  }

  render() {
    return `
      <div class="camera-app" style="display: flex; flex-direction: column; height: 100%; position: relative; border-radius: var(--radius-lg); overflow: hidden;">
        <video id="camera-view" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; background: #000;"></video>
        <div style="position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: 30px; z-index: 10;">
          <button class="js-camera-switch" type="button" style="width: 50px; height: 50px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); color: white; cursor: pointer; backdrop-filter: blur(10px);">🔄</button>
          <button class="js-camera-capture" type="button" style="width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.8); border: 4px solid white; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"></button>
          <div style="width: 50px; height: 50px; border-radius: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px);"></div>
        </div>
        <canvas id="camera-canvas" style="display: none;"></canvas>
      </div>
    `;
  }

  async onMount(container) {
    this.videoElement = container.querySelector('#camera-view');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      this.videoElement.srcObject = this.stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (this.videoElement) {
        this.videoElement.insertAdjacentHTML('afterend', '<p style="position:absolute; top: 50%; width: 100%; text-align: center; color: white;">Permiso denegado o cámara no disponible</p>');
      }
    }
  }

  onUnmount() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  handleAction(target, renderCallback) {
    // Handling is done in main.js if needed
  }
}
