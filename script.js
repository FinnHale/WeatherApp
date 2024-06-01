const apiKey = '79fd9ffffe45421bbed193458240106';
const defaultCity = 'Paris';

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(defaultCity);
  updateDate();
});

function searchLocation() {
  const searchInput = document.getElementById('search-input');
  const city = searchInput.value.trim();
  if (city) {
    fetchWeather(city);
    searchInput.value = ''; 
  }
}

async function fetchWeather(city) {
  try {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    updateWeatherUI(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("An error occurred. Please try again later.");
  }
}

function updateWeatherUI(data) {
  document.getElementById('temperature').textContent = Math.round(data.current.temp_c);
  document.getElementById('weather-description').textContent = data.current.condition.text;
  document.getElementById('location').textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById('precipitation').textContent = `${data.current.precip_mm} mm`;
  document.getElementById('humidity').textContent = `${data.current.humidity}%`;
  document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;

  const weatherIcon = document.getElementById('weather-icon');
  const iconCode = data.current.condition.code;
  weatherIcon.className = 'bx';
  weatherIcon.classList.add(`bx-${getIconClass(iconCode)}`);

  updateForecast(data);
}

function updateDate() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const now = new Date();
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  document.getElementById('date').textContent = dayName;
  document.getElementById('current-date').textContent = `${date} ${monthName} ${year}`;
}

function updateForecast(data) {
  const daysList = document.querySelector('.days-list');
  daysList.innerHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 1; i < data.forecast.forecastday.length; i++) {
    const dayData = data.forecast.forecastday[i];
    const date = new Date(dayData.date);
    const dayIndex = date.getDay();
    const temp = Math.round(dayData.day.avgtemp_c);
    const iconCode = dayData.day.condition.code;
    const li = document.createElement('li');
    li.innerHTML = `
            <i class='bx ${getIconClass(iconCode)}'></i>
            <span>${days[dayIndex]}</span>
            <span class="day-temp">${temp}°C</span>
        `;
    daysList.appendChild(li);
  }
}

function getIconClass(iconCode) {
  switch (iconCode) {
    case 1000:
      return 'bx-sun';
    case 1003:
      return 'bx-cloud-sun';
    case 1006:
    case 1009:
      return 'bx-cloud';
    case 1030:
    case 1135:
      return 'bx-cloud-light-rain';
    case 1063:
    case 1150:
    case 1153:
    case 1180:
    case 1183:
    case 1240:
    case 1273:
      return 'bx-cloud-drizzle';
    case 1066:
    case 1069:
    case 1168:
    case 1171:
    case 1186:
    case 1189:
    case 1198:
    case 1201:
    case 1249:
    case 1261:
      return 'bx-cloud-rain';
    case 1072:
    case 1192:
    case 1195:
    case 1204:
    case 1207:
    case 1243:
    case 1252:
    case 1276:
      return 'bx-cloud-light-rain';
    case 1087:
      return 'bx-cloud-lightning';
    case 1114:
    case 1117:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1255:
    case 1279:
      return 'bx-cloud-snow';
    case 1222:
    case 1225:
    case 1258:
    case 1264:
    case 1282:
      return 'bx-snow';
    case 1237:
      return 'bx-hail';
    case 1246:
      return 'bx-downpour';
    default:
      return 'bx-question-mark';
  }
}