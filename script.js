const apiKey = "25989a1f238349de8de55646261607";

window.onload = () => {
  getLocation(); // auto load user location
};

function toggleTheme(){
  document.body.classList.toggle("light");
}

// 📍 LIVE LOCATION
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      getWeather(`${lat},${lon}`);
    }, () => {
      alert("Location access denied");
      getWeather("Karachi");
    });
  }
}

// SEARCH
function searchWeather(){
  const city = document.getElementById("searchBox").value.trim();
  if(!city) return;
  getWeather(city);
}

// MAIN WEATHER FUNCTION
async function getWeather(query){
  try{
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7`);
    const data = await res.json();

    if(data.error){
      alert("City not found");
      return;
    }

    // CHANGE BACKGROUND
    setBackground(data.current.condition.text.toLowerCase());

    // CURRENT
    document.getElementById("weather").innerHTML = `
      <h2>${data.location.name}</h2>
      <img src="https:${data.current.condition.icon}">
      <div class="temp">${data.current.temp_c}°C</div>
      <p>${data.current.condition.text}</p>
      <p>💧 ${data.current.humidity}% | 🌬 ${data.current.wind_kph} km/h</p>
    `;

    // 24 HOURS
    let hourlyHTML = "";
    data.forecast.forecastday[0].hour.forEach(h => {
      hourlyHTML += `
        <div>
          <p>${h.time.split(" ")[1]}</p>
          <img src="https:${h.condition.icon}">
          <p>${h.temp_c}°</p>
        </div>
      `;
    });
    document.getElementById("hourly").innerHTML = hourlyHTML;

    // 7 DAYS
    let forecastHTML = "";
    data.forecast.forecastday.forEach(day => {
      forecastHTML += `
        <div>
          <p>${day.date}</p>
          <img src="https:${day.day.condition.icon}">
          <p>${day.day.avgtemp_c}°C</p>
        </div>
      `;
    });
    document.getElementById("forecast").innerHTML = forecastHTML;

  }catch(err){
    console.log(err);
    alert("Error loading weather");
  }
}

// 🌤️ BACKGROUND LOGIC
function setBackground(condition){
  document.body.classList.remove("sunny","cloudy","rain");

  if(condition.includes("sun") || condition.includes("clear")){
    document.body.classList.add("sunny");
  }
  else if(condition.includes("rain")){
    document.body.classList.add("rain");
  }
  else{
    document.body.classList.add("cloudy");
  }
}
