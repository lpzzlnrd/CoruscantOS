import { CalculatorApp } from "../apps/Calculator.js";
import { WeatherApp } from "../apps/Weather.js";
import { StopwatchApp } from "../apps/Stopwatch.js";

export class AppManager {
  constructor() {
    this.apps = {
      calculator: { id: "calculator", label: "Calculadora", icon: "icon-calc", Class: CalculatorApp },
      weather: { id: "weather", label: "Clima", icon: "icon-weather", Class: WeatherApp },
      stopwatch: { id: "stopwatch", label: "Cronometro", icon: "icon-stopwatch", Class: StopwatchApp },
      maps: { id: "maps", label: "Maps", icon: "icon-maps" },
      music: { id: "music", label: "Music", icon: "icon-music" },
      camera: { id: "camera", label: "Camera", icon: "icon-camera" },
      files: { id: "files", label: "Files", icon: "icon-files" },
      settings: { id: "settings", label: "Settings", icon: "icon-settings" }
    };
    this.instances = {};
  }

  getApp(id) {
    const config = this.apps[id];
    if (!config) return null;
    
    if (config.Class && !this.instances[id]) {
      this.instances[id] = new config.Class();
    }
    return { ...config, instance: this.instances[id] };
  }

  getAllApps() {
    return Object.values(this.apps);
  }
}
