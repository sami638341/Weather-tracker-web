const apiKey = "25989a1f238349de8de55646261607";

// DEFAULT THEME
document.body.classList.add("light");

// SEARCH
function searchWeather() {
  let city = document.getElementById("search").value;
  fetchWeather(city);
}

// THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// AUTO LOAD
navigator.geolocation.getCurrentPosition(pos => {
  fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
});

async function fetchWeather(q) {
  let res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=7`
  );
  let data = await res.json();

  // CHANGE UI COLOR BASED ON WEATHER
  if (data.current.condition.text.toLowerCase().includes("rain")) {
    document.body.style.background = "#4e54c8";
  } else if (data.current.condition.text.toLowerCase().includes("sun")) {
    document.body.style.background = "#f7971e";
  }

  // CURRENT
  document.getElementById("weather").innerHTML = `
    <h2>${data.location.name}</h2>
    <h1>${data.current.temp_c}°C</h1>
    <p>${data.current.condition.text}</p>
    <img src="https:${data.current.condition.icon}">
  `;

  // 7 DAY + 24 HOUR INSIDE
  let html = "";

  data.forecast.forecastday.forEach(day => {

    html += `
      <div class="day-card">
        <h4>${day.date}</h4>
        <p>${day.day.avgtemp_c}°C</p>

        <div class="hourly">
          ${day.hour.slice(0, 6).map(h => `
            <div class="hour">
              <p>${h.time.split(" ")[1]}</p>
              <p>${h.temp_c}°C</p>
              <img src="https:${h.condition.icon}">
            </div>
          `).join("")}
        </div>

      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = html;
}
