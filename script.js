const apiKey = "25989a1f238349de8de55646261607";

window.onload = () => {
  getLocation();
};

function searchWeather() {
  const city = document.getElementById("city").value;
  if (city) fetchWeather(city);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetchWeather(`${lat},${lon}`);
      loadRadar(lat, lon);
    },
    () => alert("Location denied ❌")
  );
}

async function fetchWeather(query) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7`
  );
  const data = await res.json();

  document.getElementById("weather").innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <h1>${data.current.temp_c}°C</h1>
    <p>${data.current.condition.text}</p>
    <img src="https:${data.current.condition.icon}">
  `;

  showForecast(data.forecast.forecastday);
}

function showForecast(days) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";

  days.forEach(day => {
    const div = document.createElement("div");
    div.className = "day-card";

    div.innerHTML = `
      <h4>${day.date}</h4>
      <p>${day.day.avgtemp_c}°C</p>
      <img src="https:${day.day.condition.icon}">
    `;

    div.onclick = () => {
      localStorage.setItem("dayData", JSON.stringify(day));
      window.location.href = "details.html";
    };

    container.appendChild(div);
  });
}

// 🌧 Radar Map
async function loadRadar(lat, lon) {
  const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
  const data = await res.json();

  const frame = data.radar.past[data.radar.past.length - 1].path;

  if (window.map) {
    window.map.remove();
  }

  window.map = L.map("map").setView([lat, lon], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .addTo(window.map);

  L.tileLayer(
    `https://tilecache.rainviewer.com${frame}/256/{z}/{x}/{y}/2/1_1.png`,
    { opacity: 0.5 }
  ).addTo(window.map);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
