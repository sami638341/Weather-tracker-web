const API_KEY = "433b49d6ad7f175038641fb257812372";

let chart;

// Start app
window.onload = () => {
  showDate();
  getLocationWeather();
};

// Show date
function showDate() {
  document.getElementById("date").innerText =
    new Date().toDateString();
}

// Search by Enter
document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeatherByCity();
});

// Search city
async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  showLoading(true);

  try {
    const geo = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const data = await geo.json();

    if (!data.length) throw new Error("City not found");

    getWeather(data[0].lat, data[0].lon, data[0].name);

  } catch (err) {
    showError("City not found 😢");
  }
}

// Get user location
function getLocationWeather() {
  if (!navigator.geolocation) {
    showError("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      getWeather(pos.coords.latitude, pos.coords.longitude, "Your Location");
    },
    () => showError("Location permission denied")
  );
}

// MAIN WEATHER FUNCTION (FIXED API)
async function getWeather(lat, lon, name) {
  showLoading(true);

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    document.getElementById("city").innerText = name;

    showCurrent(data);
    showHourly(data.hourly);
    showDaily(data.daily);
    drawChart(data.hourly);

    showLoading(false);

  } catch (err) {
    console.error(err);
    showError("Weather failed to load ⚠️");
  }
}

// CURRENT WEATHER
function showCurrent(data) {
  document.getElementById("currentWeather").innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png">
    <h2>${Math.round(data.current.temp)}°C</h2>
    <p>${data.current.weather[0].description}</p>
  `;
}

// HOURLY
function showHourly(hourly) {
  const div = document.getElementById("hourly");
  div.innerHTML = "";

  hourly.slice(0, 24).forEach(h => {
    const hour = new Date(h.dt * 1000).getHours();

    div.innerHTML += `
      <div class="hour-card">
        <p>${hour}:00</p>
        <img src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png">
        <p>${Math.round(h.temp)}°</p>
      </div>
    `;
  });
}

// DAILY
function showDaily(daily) {
  const div = document.getElementById("daily");
  div.innerHTML = "";

  daily.slice(0, 7).forEach(d => {
    const day = new Date(d.dt * 1000)
      .toLocaleDateString("en-US", { weekday: "short" });

    div.innerHTML += `
      <div class="day-card">
        <span>${day}</span>
        <span>${Math.round(d.temp.day)}°C</span>
      </div>
    `;
  });
}

// CHART
function drawChart(hourly) {
  const labels = hourly.slice(0, 12).map(h =>
    new Date(h.dt * 1000).getHours()
  );

  const temps = hourly.slice(0, 12).map(h => h.temp);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("tempChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        data: temps,
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// LOADING UI
function showLoading(state) {
  const loading = document.getElementById("city");

  if (state) {
    loading.innerText = "Loading...";
    document.getElementById("currentWeather").innerHTML = "";
  }
}

// ERROR UI
function showError(msg) {
  document.getElementById("city").innerText = msg;
  document.getElementById("currentWeather").innerHTML = "";
                              }
