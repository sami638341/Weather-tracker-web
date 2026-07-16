const apiKey = "25989a1f238349de8de55646261607";

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// LOADER
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

// SEARCH
function searchWeather() {
  let city = document.getElementById("search").value;
  fetchWeather(city);
}

// AUTO LOCATION
navigator.geolocation.getCurrentPosition(pos => {
  fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
});

// FETCH
async function fetchWeather(q) {

  showLoader(true);

  let res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=7`
  );
  let data = await res.json();

  showLoader(false);

  // WEATHER UI
  document.getElementById("weather").innerHTML = `
    <h2>${data.location.name}</h2>
    <h1>${data.current.temp_c}°C</h1>
    <p>${data.current.condition.text}</p>
    <img src="https:${data.current.condition.icon}">
  `;

  // SAVE
  localStorage.setItem("weatherData", JSON.stringify(data));

  // FORECAST
  let html = "";

  data.forecast.forecastday.forEach((day, i) => {
    html += `
      <div class="day-card fade" onclick="openDetails(${i})">
        <h4>${day.date}</h4>
        <p>${day.day.avgtemp_c}°C</p>
        <img src="https:${day.day.condition.icon}">
      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = html;
}

// OPEN DETAILS
function openDetails(i) {
  localStorage.setItem("dayIndex", i);
  window.location.href = "details.html";
}

// DETAILS PAGE
if (window.location.pathname.includes("details.html")) {

  let data = JSON.parse(localStorage.getItem("weatherData"));
  let index = localStorage.getItem("dayIndex");
  let day = data.forecast.forecastday[index];

  let html = `<h2>${day.date}</h2><div class="hour-grid">`;

  day.hour.forEach(h => {
    html += `
      <div class="hour-box">
        <p>${h.time.split(" ")[1]}</p>
        <p>${h.temp_c}°C</p>
        <img src="https:${h.condition.icon}">
      </div>
    `;
  });

  html += "</div>";

  document.getElementById("details").innerHTML = html;
}

// BACK
function goBack() {
  window.history.back();
}
