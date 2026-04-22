import { CalculatorApp } from "../../apps/Calculator.js";

// Prueba unitaria para la aplicacion de calculadora
function testCalculator() {
  const calc = new CalculatorApp();

  // Caso 1: Verificacion de inicializacion
  if (calc.expression !== "0") {
    console.error("Fallo: La calculadora debe iniciar en 0");
  }

  // Caso 2: Suma basica
  calc.expression = calc.appendValue("2", "+");
  calc.expression = calc.appendValue(calc.expression, "2");
  const result = calc.evaluate(calc.expression);
  if (result !== "4") {
    console.error("Fallo: 2 + 2 debe ser 4, se obtuvo: " + result);
  }

  // Caso 3: Division por cero
  const divZero = calc.evaluate("10/0");
  if (divZero !== "0") {
    console.error("Fallo: Division por cero debe retornar 0 por seguridad");
  }

  // Caso 4: Evitar multiples puntos decimales
  let dec = calc.appendValue("1.5", ".");
  if (dec !== "1.5") {
    console.error("Fallo: No se deben permitir multiples puntos en un numero");
  }

  console.log("Pruebas de calculadora completadas");
}

// Ejecucion manual si es necesario
// testCalculator();
