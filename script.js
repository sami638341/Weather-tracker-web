const apiKey = "25989a1f238349de8de55646261607";

// AUTO LOAD DEFAULT CITY
window.onload = () => {
    getWeather("Karachi");
};

function searchWeather(){
    const city = document.getElementById("searchBox").value.trim();

    if(!city){
        alert("Enter city name");
        return;
    }

    getWeather(city);
}

async function getWeather(city){
    try{
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
        const data = await res.json();

        if(data.error){
            alert("City not found ❌");
            return;
        }

        document.getElementById("weather").innerHTML = `
            <h2 class="city">${data.location.name}</h2>
            <img src="https:${data.current.condition.icon}">
            <div class="temp">${data.current.temp_c}°C</div>
            <p>${data.current.condition.text}</p>

            <div class="details">
                <div class="card">
                    <p>💧 Humidity</p>
                    <p>${data.current.humidity}%</p>
                </div>
                <div class="card">
                    <p>🌬 Wind</p>
                    <p>${data.current.wind_kph} km/h</p>
                </div>
            </div>
        `;

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
        alert("Something went wrong ❌");
    }
      }
