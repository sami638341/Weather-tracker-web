const apiKey = "25989a1f238349de8de55646261607";

window.onload = () => {
  getLocation();
};

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

function searchWeather() {
  let city = document.getElementById("search").value;
  if (city) fetchWeather(city);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
    loadRadar(pos.coords.latitude, pos.coords.longitude);
  });
}

async function fetchWeather(query) {
  showLoader(true);

  let res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7&aqi=no&alerts=no`
  );

  let data = await res.json();

  showLoader(false);

  // CURRENT
  document.getElementById("weather").innerHTML = `
    <h2>${data.location.name}</h2>
    <h1>${data.current.temp_c}°C</h1>
    <img src="https:${data.current.condition.icon}">
    <p>${data.current.condition.text}</p>
  `;

  // HOURLY (24H)
  let hourlyHTML = "";
  data.forecast.forecastday[0].hour.forEach(h => {
    hourlyHTML += `
      <div class="hour">
        <p>${h.time.split(" ")[1]}</p>
        <p>${h.temp_c}°C</p>
        <img src="https:${h.condition.icon}">
      </div>
    `;
  });
  document.getElementById("hourly").innerHTML = hourlyHTML;

  // 7 DAY
  let forecastHTML = "";
  data.forecast.forecastday.forEach(day => {
    forecastHTML += `
      <div class="day-card" onclick='openDetails(${JSON.stringify(day)})'>
        <p>${day.date}</p>
        <p>${day.day.avgtemp_c}°C</p>
        <img src="https:${day.day.condition.icon}">
      </div>
    `;
  });
  document.getElementById("forecast").innerHTML = forecastHTML;
}

// DETAILS PAGE
function openDetails(day) {
  localStorage.setItem("dayData", JSON.stringify(day));
  window.location.href = "details.html";
}

// RADAR
function loadRadar(lat, lon) {
  if (window.map) window.map.remove();

  window.map = L.map("map").setView([lat, lon], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .addTo(window.map);

  L.tileLayer(
    "https://tilecache.rainviewer.com/v2/radar/latest/256/{z}/{x}/{y}/2/1_1.png",
    { opacity: 0.5 }
  ).addTo(window.map);
}
