export class CalculatorApp {
  constructor() {
    this.expression = "0";
  }

  render() {
    return `
      <div style="display: flex; flex-direction: column; height: 100%; justify-content: flex-end; padding-bottom: 10px;">
        <div style="text-align: right; padding: 20px; min-height: 100px; display: flex; flex-direction: column; justify-content: flex-end;">
          <div style="color: rgba(255,255,255,0.5); font-size: 1.2rem; min-height: 1.5rem; letter-spacing: 2px;"></div>
          <div style="color: white; font-size: 3.5rem; font-weight: 300; letter-spacing: -1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" class="js-calc-display">${this.expression}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
          <button class="js-calc-btn" data-calc-action="clear" type="button" style="height: 65px; border-radius: 50%; background: #a5a5a5; color: black; border: none; font-size: 1.5rem; font-weight: 500; cursor: pointer;">AC</button>
          <button class="js-calc-btn" data-calc-action="backspace" type="button" style="height: 65px; border-radius: 50%; background: #a5a5a5; color: black; border: none; font-size: 1.5rem; font-weight: 500; cursor: pointer;">⌫</button>
          <button class="js-calc-btn" data-calc-value="%" type="button" style="height: 65px; border-radius: 50%; background: #a5a5a5; color: black; border: none; font-size: 1.5rem; font-weight: 500; cursor: pointer;">%</button>
          <button class="js-calc-btn" data-calc-value="/" type="button" style="height: 65px; border-radius: 50%; background: #ff9f43; color: white; border: none; font-size: 1.8rem; font-weight: 500; cursor: pointer;">÷</button>

          <button class="js-calc-btn" data-calc-value="7" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">7</button>
          <button class="js-calc-btn" data-calc-value="8" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">8</button>
          <button class="js-calc-btn" data-calc-value="9" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">9</button>
          <button class="js-calc-btn" data-calc-value="*" type="button" style="height: 65px; border-radius: 50%; background: #ff9f43; color: white; border: none; font-size: 1.8rem; font-weight: 500; cursor: pointer;">×</button>

          <button class="js-calc-btn" data-calc-value="4" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">4</button>
          <button class="js-calc-btn" data-calc-value="5" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">5</button>
          <button class="js-calc-btn" data-calc-value="6" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">6</button>
          <button class="js-calc-btn" data-calc-value="-" type="button" style="height: 65px; border-radius: 50%; background: #ff9f43; color: white; border: none; font-size: 2rem; font-weight: 500; cursor: pointer;">−</button>

          <button class="js-calc-btn" data-calc-value="1" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">1</button>
          <button class="js-calc-btn" data-calc-value="2" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">2</button>
          <button class="js-calc-btn" data-calc-value="3" type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">3</button>
          <button class="js-calc-btn" data-calc-value="+" type="button" style="height: 65px; border-radius: 50%; background: #ff9f43; color: white; border: none; font-size: 1.8rem; font-weight: 500; cursor: pointer;">+</button>

          <button class="js-calc-btn" data-calc-value="0" type="button" style="height: 65px; grid-column: span 2; border-radius: 35px; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer; text-align: left; padding-left: 25px;">0</button>
          <button class="js-calc-btn" data-calc-value="." type="button" style="height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; font-size: 1.8rem; font-weight: 400; cursor: pointer;">.</button>
          <button class="js-calc-btn" data-calc-action="equals" type="button" style="height: 65px; border-radius: 50%; background: #ff9f43; color: white; border: none; font-size: 1.8rem; font-weight: 500; cursor: pointer;">=</button>
        </div>
      </div>
    `;
  }

  handleAction(target, renderCallback) {
    if (!target.classList.contains("js-calc-btn")) return;
    const action = target.dataset.calcAction;
    const value = target.dataset.calcValue;

    if (action === "clear") {
      this.expression = "0";
    } else if (action === "backspace") {
      this.expression = this.expression.slice(0, -1) || "0";
    } else if (action === "equals") {
      this.expression = this.evaluate(this.expression);
    } else if (value) {
      if (value === "%") {
        this.expression = String(Number(this.evaluate(this.expression)) / 100);
      } else {
        this.expression = this.appendValue(this.expression, value);
      }
    }
    if (renderCallback) renderCallback();
  }

  appendValue(current, next) {
    if (current === "0" && /\d/.test(next)) return next;
    if (next === ".") {
      const chunk = current.split(/[+\-*/]/).at(-1);
      if (chunk.includes(".")) return current;
    }
    const lastChar = current.at(-1);
    if (/[+\-*/]/.test(lastChar) && /[+\-*/]/.test(next)) {
      return `${current.slice(0, -1)}${next}`;
    }
    return `${current}${next}`;
  }

  evaluate(expression) {
    if (!/^[0-9+\-*/.\s()]+$/.test(expression)) return "0";
    try {
      const result = Function(`"use strict"; return (${expression})`)();
      if (!Number.isFinite(result)) return "0";
      return Number(result.toFixed(8)).toString();
    } catch {
      return "0";
    }
  }
}
