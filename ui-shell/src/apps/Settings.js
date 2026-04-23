export class SettingsApp {
  render() {
    return `
      <div style="display: flex; flex-direction: column; height: 100%; color: white;">
        <h2 style="margin-top: 0; margin-bottom: 20px;">Ajustes</h2>
        
        <div style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden;">
          <div style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="background: #1e90ff; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">📶</span>
              <span>Wi-Fi</span>
            </div>
            <span style="color: rgba(255,255,255,0.5);">Coruscant_5G</span>
          </div>
          
          <div style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="background: #00a8ff; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">🦷</span>
              <span>Bluetooth</span>
            </div>
            <span style="color: rgba(255,255,255,0.5);">Activado</span>
          </div>
          
          <div style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="background: #2ed573; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">🔋</span>
              <span>Batería</span>
            </div>
            <span style="color: rgba(255,255,255,0.5);">100%</span>
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden; margin-top: 20px;">
          <div style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="background: #ff4757; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">🔔</span>
              <span>Sonido y Vibración</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
