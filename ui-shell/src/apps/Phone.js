const TWILIO_SID = "";
const TWILIO_AUTH = "";
const TWILIO_PHONE = "+";
const MY_REAL_PHONE = "+";

export class PhoneApp {
  constructor() {
    this.number = "";
    this.isCalling = false;
  }

  render() {
    if (this.isCalling) {
      return `
        <div class="phone-app" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 20px;">
            👤
          </div>
          <h2 style="margin: 0; font-size: 2rem;">${this.number || "Desconocido"}</h2>
          <p style="color: var(--safe-glow); font-size: 1.1rem; margin-top: 8px;" class="js-call-status">Conectando con Twilio...</p>
          
          <button class="phone-btn is-end js-phone-btn" data-phone-action="end" type="button" style="margin-top: 40px; background: #ff4757; color: white; border: none; width: 64px; height: 64px; border-radius: 50%; font-size: 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 20px rgba(255, 71, 87, 0.4);">
            📞
          </button>
        </div>
      `;
    }

    return `
      <div class="phone-app" style="display: flex; flex-direction: column; height: 100%;">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 20px; text-align: center;">
          <h2 class="js-phone-display" style="font-size: 2.5rem; margin: 0; min-height: 3rem; letter-spacing: 2px;">${this.number}</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 280px; margin: 0 auto; padding-bottom: 20px;">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "+"].map(num => `
            <button class="phone-btn js-phone-btn" data-phone-value="${num}" type="button" style="width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.05); color: white; font-size: 1.8rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
              ${num}
            </button>
          `).join("")}
        </div>

        <div style="display: flex; justify-content: center; gap: 20px;">
          <div style="width: 70px;"></div> <!-- Spacer -->
          <button class="phone-btn js-phone-btn" data-phone-action="call" type="button" style="width: 70px; height: 70px; border-radius: 50%; background: #2ed573; color: white; border: none; font-size: 2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(46, 213, 115, 0.4);">
            📞
          </button>
          <button class="phone-btn js-phone-btn" data-phone-action="backspace" type="button" style="width: 70px; height: 70px; border-radius: 50%; background: transparent; color: rgba(255,255,255,0.5); border: none; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            ⌫
          </button>
        </div>
      </div>
    `;
  }

  async handleAction(target, renderCallback) {
    const value = target.dataset.phoneValue;
    const action = target.dataset.phoneAction;

    if (value) {
      if (this.number.length < 16) {
        this.number += value;
      }
    } else if (action === "backspace") {
      this.number = this.number.slice(0, -1);
    } else if (action === "call") {
      if (this.number.length > 0) {
        this.isCalling = true;
        if (renderCallback) renderCallback();

        let finalNumber = this.number;
        if (!finalNumber.startsWith("+")) {
          finalNumber = "+" + finalNumber;
        }

        try {
          const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json`;
          const data = new URLSearchParams();

          data.append('To', MY_REAL_PHONE);
          data.append('From', TWILIO_PHONE);
          data.append('Twiml', `<Response><Dial callerId="${TWILIO_PHONE}">${finalNumber}</Dial></Response>`);

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_AUTH}`),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.message || "Error al llamar");

          const status = document.querySelector(".js-call-status");
          if (status) {
            status.textContent = "00:01";
            this.startTimer(status);
          }
        } catch (error) {
          console.error("Error Twilio:", error);
          const status = document.querySelector(".js-call-status");
          if (status) {
            status.textContent = `⚠️ Error: ${error.message}`;
            status.style.color = "#ff4757";
          }
        }
        return; // Ya hicimos render
      }
    } else if (action === "end") {
      this.isCalling = false;
      this.number = "";
      clearInterval(this.callInterval);
    }

    if (renderCallback) renderCallback();
  }

  startTimer(element) {
    let seconds = 1;
    this.callInterval = setInterval(() => {
      if (!this.isCalling) {
        clearInterval(this.callInterval);
        return;
      }
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      element.textContent = `${m}:${s}`;
    }, 1000);
  }
}
