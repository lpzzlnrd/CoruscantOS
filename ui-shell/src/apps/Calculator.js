export class CalculatorApp {
  constructor() {
    this.expression = "0";
  }

  render() {
    return `
      <div class="calc-app">
        <label for="calc-display" class="calc-label">Calculadora</label>
        <output id="calc-display" class="calc-display js-calc-display">${this.expression}</output>
        <div class="calc-grid">
          <button class="calc-btn js-calc-btn" data-calc-action="clear" type="button">C</button>
          <button class="calc-btn js-calc-btn" data-calc-action="backspace" type="button">DEL</button>
          <button class="calc-btn js-calc-btn" data-calc-value="/" type="button">/</button>
          <button class="calc-btn js-calc-btn" data-calc-value="*" type="button">x</button>

          <button class="calc-btn js-calc-btn" data-calc-value="7" type="button">7</button>
          <button class="calc-btn js-calc-btn" data-calc-value="8" type="button">8</button>
          <button class="calc-btn js-calc-btn" data-calc-value="9" type="button">9</button>
          <button class="calc-btn js-calc-btn" data-calc-value="-" type="button">-</button>

          <button class="calc-btn js-calc-btn" data-calc-value="4" type="button">4</button>
          <button class="calc-btn js-calc-btn" data-calc-value="5" type="button">5</button>
          <button class="calc-btn js-calc-btn" data-calc-value="6" type="button">6</button>
          <button class="calc-btn js-calc-btn" data-calc-value="+" type="button">+</button>

          <button class="calc-btn js-calc-btn" data-calc-value="1" type="button">1</button>
          <button class="calc-btn js-calc-btn" data-calc-value="2" type="button">2</button>
          <button class="calc-btn js-calc-btn" data-calc-value="3" type="button">3</button>
          <button class="calc-btn is-equal js-calc-btn" data-calc-action="equals" type="button">=</button>

          <button class="calc-btn calc-zero js-calc-btn" data-calc-value="0" type="button">0</button>
          <button class="calc-btn js-calc-btn" data-calc-value="." type="button">.</button>
        </div>
      </div>
    `;
  }

  handleAction(target) {
    const action = target.dataset.calcAction;
    const value = target.dataset.calcValue;

    if (action === "clear") {
      this.expression = "0";
    } else if (action === "backspace") {
      this.expression = this.expression.slice(0, -1) || "0";
    } else if (action === "equals") {
      this.expression = this.evaluate(this.expression);
    } else if (value) {
      this.expression = this.appendValue(this.expression, value);
    }
    return this.expression;
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
