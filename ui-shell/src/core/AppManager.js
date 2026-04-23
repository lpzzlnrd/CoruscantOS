import { CalculatorApp } from "../apps/Calculator.js";
import { WeatherApp } from "../apps/Weather.js";
import { StopwatchApp } from "../apps/Stopwatch.js";
import { PhoneApp } from "../apps/Phone.js";
import { CameraApp } from "../apps/Camera.js";
import { NotesApp } from "../apps/Notes.js";
import { CalendarApp } from "../apps/Calendar.js";
import { SettingsApp } from "../apps/Settings.js";
import { MusicApp } from "../apps/Music.js";
import { FlappyApp } from "../apps/Flappy.js";
import { MessagesApp } from "../apps/Messages.js";

export class AppManager {
  constructor() {
    this.apps = {
      phone: { id: "phone", label: "Teléfono", icon: "icon-phone", logo: "📞", Class: PhoneApp },
      messages: { id: "messages", label: "Mensajes", icon: "icon-mail", logo: "💬", Class: MessagesApp },
      calculator: { id: "calculator", label: "Calculadora", icon: "icon-calc", logo: "🧮", Class: CalculatorApp },
      weather: { id: "weather", label: "Clima", icon: "icon-weather", logo: "🌤️", Class: WeatherApp },
      stopwatch: { id: "stopwatch", label: "Cronometro", icon: "icon-stopwatch", logo: "⏱️", Class: StopwatchApp },
      maps: { id: "maps", label: "Mapas", icon: "icon-maps", logo: "🗺️" },
      music: { id: "music", label: "Musica", icon: "icon-music", logo: "🎵", Class: MusicApp },
      camera: { id: "camera", label: "Camara", icon: "icon-camera", logo: "📷", Class: CameraApp },
      files: { id: "files", label: "Archivos", icon: "icon-files", logo: "📁" },
      settings: { id: "settings", label: "Ajustes", icon: "icon-settings", logo: "⚙️", Class: SettingsApp },
      flappy: { id: "flappy", label: "Flappy Bird", icon: "icon-browser", logo: "🎮", Class: FlappyApp },
      notes: { id: "notes", label: "Notas", icon: "icon-notes", logo: "📝", Class: NotesApp },
      calendar: { id: "calendar", label: "Agenda", icon: "icon-calendar", logo: "📅", Class: CalendarApp }
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
