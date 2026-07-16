const data = JSON.parse(localStorage.getItem("selectedDay"));

if (data) {
  document.getElementById("day-name").innerText =
    new Date(data.dt * 1000).toDateString();

  document.getElementById("temp").innerText =
    Math.round(data.temp.day) + "°C";

  document.getElementById("desc").innerText =
    data.weather[0].description;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  // 🔥 EXTRA DATA
  document.getElementById("feels").innerText =
    Math.round(data.feels_like.day) + "°C";

  document.getElementById("humidity").innerText =
    data.humidity + "%";

  document.getElementById("wind").innerText =
    data.wind_speed + " m/s";
}

function goBack() {
  window.history.back();
}
