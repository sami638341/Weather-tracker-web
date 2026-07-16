const data = JSON.parse(localStorage.getItem("dayData"));

document.getElementById("details").innerHTML = `
  <h2>${data.date}</h2>
  <p>Max Temp: ${data.day.maxtemp_c}°C</p>
  <p>Min Temp: ${data.day.mintemp_c}°C</p>
  <p>Humidity: ${data.day.avghumidity}%</p>
  <p>Condition: ${data.day.condition.text}</p>
`;
