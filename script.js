const apiKey = process.env.apiKey;
const inputContainer = document.getElementById("input-container");
const cityInput = document.getElementById("city");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherResult = document.getElementById("weather-result");

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      weatherResult.textContent = data.message;
      return;
    }

    inputContainer.style.display = "none";

    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back";
    backBtn.id = "back-btn";
    backBtn.onclick = () => {
      weatherResult.innerHTML = "";
      inputContainer.style.display = "flex";
      cityInput.value = "";
      cityInput.focus();
      backBtn.remove();
    };
    weatherResult.appendChild(backBtn);

    const current = data.list[0];
    const cityName = data.city.name;
    const country = data.city.country;
    const temp = current.main.temp.toFixed(1);
    const desc = current.weather[0].description;
    const icon = current.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const humidity = current.main.humidity;
    const wind = current.wind.speed;

    const currentHTML = `
      <h2>${cityName}, ${country}</h2>
      <img src="${iconUrl}" alt="${desc}" />
      <p><strong>${desc}</strong></p>
      <p>Temperature: ${temp} °C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${wind} m/s</p>
    `;
    weatherResult.insertAdjacentHTML("beforeend", currentHTML);

    const forecastList = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    ).slice(0, 5);

    let forecastHTML = '<h3>5-Day Forecast</h3><div id="forecast">';
    forecastList.forEach(day => {
      const dayName = getDayName(day.dt_txt);
      const icon = day.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const temp = day.main.temp.toFixed(1);

      forecastHTML += `
        <div class="forecast-day">
          <div>${dayName}</div>
          <img src="${iconUrl}" alt="${day.weather[0].description}" />
          <div>${temp} °C</div>
        </div>
      `;
    });
    forecastHTML += "</div>";

    weatherResult.insertAdjacentHTML("beforeend", forecastHTML);
  } catch (error) {
    weatherResult.textContent = "Error fetching weather data.";
  }
}

getWeatherBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});
