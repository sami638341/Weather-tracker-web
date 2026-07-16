let data = JSON.parse(localStorage.getItem("dayData"));

document.getElementById("details").innerHTML = `
  <h2>${data.date}</h2>
  <h1>${data.day.avgtemp_c}°C</h1>
  <img src="https:${data.day.condition.icon}">
  <p>${data.day.condition.text}</p>

  <p>🌡 Max: ${data.day.maxtemp_c}°C</p>
  <p>❄ Min: ${data.day.mintemp_c}°C</p>
  <p>💧 Humidity: ${data.day.avghumidity}%</p>
`;
