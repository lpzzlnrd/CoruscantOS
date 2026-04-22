import { StopwatchApp } from "../../apps/Stopwatch.js";

// Prueba unitaria para la aplicacion de cronometro
function testStopwatch() {
  const sw = new StopwatchApp();

  // Caso 1: Formateo de milisegundos a texto
  // 61500 ms = 01:01.50
  const formatted = sw.formatTime(61500);
  if (formatted !== "01:01.50") {
    console.error("Fallo: El formato de 61500ms debe ser 01:01.50, se obtuvo: " + formatted);
  }

  // Caso 2: Formateo de valores pequeños
  const small = sw.formatTime(10);
  if (small !== "00:00.01") {
    console.error("Fallo: El formato de 10ms debe ser 00:00.01, se obtuvo: " + small);
  }

  console.log("Pruebas de cronometro completadas");
}

// testStopwatch();
