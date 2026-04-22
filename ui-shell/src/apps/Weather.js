export class WeatherApp {
  constructor() {
    this.city = "Santiago";
    this.weatherCodeMap = {
      0: "Despejado",
      1: "Mayormente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Niebla",
      48: "Niebla densa",
      51: "Llovizna ligera",
      53: "Llovizna",
      55: "Llovizna fuerte",
      61: "Lluvia ligera",
      63: "Lluvia",
      65: "Lluvia intensa",
      71: "Nieve ligera",
      80: "Chubascos",
      95: "Tormenta"
    };
  }

  render() {
    return `
      <div class="weather-app">
        <div class="weather-controls">
          <input class="weather-input js-weather-city" type="text" value="${this.city}" placeholder="Ciudad" />
          <button class="weather-btn js-weather-load" type="button">Actualizar</button>
        </div>
        <article class="weather-card js-weather-output">
          <p>Cargando clima...</p>
        </article>
      </div>
    `;
  }

  async loadWeather(city, outputEl) {
    if (!outputEl) return;
    this.city = city;
    outputEl.innerHTML = "<p>Consultando servicio meteorologico...</p>";

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      const firstResult = geoData?.results?.[0];

      if (!firstResult) throw new Error("City not found");

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${firstResult.latitude}&longitude=${firstResult.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      outputEl.innerHTML = `
        <h3>${firstResult.name}, ${firstResult.country || ""}</h3>
        <p class="weather-temp">${Math.round(current.temperature_2m)} ${weatherData.current_units.temperature_2m}</p>
        <p>${this.weatherCodeMap[current.weather_code] || "Condicion variable"}</p>
        <p>Humedad: ${current.relative_humidity_2m}${weatherData.current_units.relative_humidity_2m}</p>
        <p>Viento: ${Math.round(current.wind_speed_10m)} ${weatherData.current_units.wind_speed_10m}</p>
      `;
    } catch {
      outputEl.innerHTML = `
        <h3>${city}</h3>
        <p class="weather-temp">22 C</p>
        <p>Modo offline: sin conexion al servicio.</p>
        <p>Tip: prueba otra ciudad o revisa internet.</p>
      `;
    }
  }
}
