const API_KEY = "25989a1f238349de8de55646261607";

// AUTO LOCATION
navigator.geolocation.getCurrentPosition(pos => {
  loadWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
});

// SEARCH
function searchCity() {
  const city = document.getElementById("search").value;
  loadWeather(city);
}

// MAIN FUNCTION
async function loadWeather(query) {

  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=no&alerts=no`
  );

  const data = await res.json();

  document.getElementById("city").innerText = data.location.name;
  document.getElementById("temp").innerText = data.current.temp_c + "°C";
  document.getElementById("condition").innerText = data.current.condition.text;
  document.getElementById("icon").src = data.current.condition.icon;

  showHourly(data.forecast.forecastday[0].hour);
  showDaily(data.forecast.forecastday);
}

// HOURLY
function showHourly(hours) {
  const div = document.getElementById("hourly");
  div.innerHTML = "";

  hours.slice(0, 24).forEach(h => {
    div.innerHTML += `
      <div class="box">
        <p>${h.time.split(" ")[1]}</p>
        <img src="${h.condition.icon}">
        <p>${h.temp_c}°</p>
      </div>
    `;
  });
}

// DAILY
function showDaily(days) {
  const div = document.getElementById("daily");
  div.innerHTML = "";

  days.forEach(d => {
    div.innerHTML += `
      <div class="box">
        <p>${d.date}</p>
        <img src="${d.day.condition.icon}">
        <p>${d.day.avgtemp_c}°</p>
      </div>
    `;
  });
      }
