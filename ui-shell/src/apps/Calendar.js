export class CalendarApp {
  constructor() {
    this.date = new Date();
  }

  render() {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `
      <div style="display: flex; flex-direction: column; height: 100%; color: white; padding: 10px;">
        <h2 style="margin: 0; font-size: 2rem; color: #ff4757;">${months[this.date.getMonth()]} ${this.date.getFullYear()}</h2>
        <div style="font-size: 4rem; font-weight: bold; margin: 10px 0;">${this.date.getDate()}</div>
        <div style="font-size: 1.5rem; opacity: 0.8; margin-bottom: 30px;">${days[this.date.getDay()]}</div>
        
        <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Eventos de hoy</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #2ed573;"></span>
              <span>10:00 AM - Daily Standup</span>
            </li>
            <li style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff4757;"></span>
              <span>1:00 PM - Almuerzo</span>
            </li>
            <li style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #1e90ff;"></span>
              <span>4:30 PM - Revisión de CoruscantOS</span>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}
