const API_KEY = "25989a1f238349de8de55646261607";

async function getWeather() {
  const city = document.getElementById("search").value;

  const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
  const geoData = await geo.json();

  const { lat, lon } = geoData[0];

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  const data = await res.json();

  displayCurrent(data, city);
  displayHourly(data.hourly);
  displayDaily(data.daily);
  changeTheme(data.current.weather[0].main.toLowerCase());
}

function displayCurrent(data, city) {
  document.getElementById("city").innerText = city;
  document.getElementById("temp").innerText = Math.round(data.current.temp) + "°C";
  document.getElementById("desc").innerText = data.current.weather[0].description;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`;
}

/* 24 HOURS */
function displayHourly(hourly) {
  const container = document.getElementById("hourly");
  container.innerHTML = "";

  hourly.slice(0, 24).forEach(h => {
    const div = document.createElement("div");
    div.className = "hour-card fade-in";

    div.innerHTML = `
      <p>${new Date(h.dt * 1000).getHours()}:00</p>
      <img src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png">
      <p>${Math.round(h.temp)}°C</p>
    `;

    container.appendChild(div);
  });
}

/* 7 DAYS */
function displayDaily(days) {
  const container = document.getElementById("daily");
  container.innerHTML = "";

  days.slice(0, 7).forEach(day => {
    const div = document.createElement("div");
    div.className = "day-card fade-in";

    div.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <p>${Math.round(day.temp.day)}°C</p>
    `;

    div.onclick = () => {
      localStorage.setItem("selectedDay", JSON.stringify(day));
      window.location.href = "details.html";
    };

    container.appendChild(div);
  });
}

/* AUTO COLOR */
function changeTheme(weather) {
  if (weather.includes("rain"))
    document.body.style.background = "linear-gradient(#4b6cb7,#182848)";
  else if (weather.includes("clear"))
    document.body.style.background = "linear-gradient(#fceabb,#f8b500)";
  else if (weather.includes("cloud"))
    document.body.style.background = "linear-gradient(#757f9a,#d7dde8)";
}

/* DARK MODE */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};
