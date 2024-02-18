// Weather APP

// Get weather data
async function getWeatherData(location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const weatherResponse = await fetch(
      `https://poliweather.vercel.app/api/weather?location=${encodedLocation}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`https error! status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    return {
      location: weatherData.name,
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure, // Changed from airQuality to pressure
      weatherDescription: weatherData.weather[0].description,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Throw the error so it can be caught later
  }
}

async function getForecastData(city) {
  try {
    const forecastResponse = await fetch(
      `https://poliweather.vercel.app/api/forecast?city=${city}`
    );

    if (!forecastResponse.ok) {
      throw new Error(`https error! status: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    return forecastData;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error; // Throw the error so it can be caught later
  }
}

// Get user location
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log(`Latitude: ${lat}, Longitude: ${lon}`); // Log the latitude and longitude

      const response = await fetch(
        `https://poliweather.vercel.app/api/location?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      console.log(data); // Log the data returned from the server

      const components = data.results[0].components;
      const city =
        components.city ||
        components.town ||
        components.village ||
        components.hamlet;

      resolve(city);
    }, reject);
  });
}

function updateDOM(weatherData) {
  // Create variables for each piece of weather data
  const location = weatherData.location;
  const temperature = weatherData.temperature;
  const feelsLike = weatherData.feelsLike;
  const humidity = weatherData.humidity;
  const windSpeed = weatherData.windSpeed;
  const pressure = weatherData.pressure; // Changed from airQuality to pressure
  const weatherDescription = weatherData.weatherDescription;

  // Update the DOM with the weather data
  document.querySelector("#search").setAttribute("placeholder", location);
  document.querySelector("#temperature").textContent =
    Math.round(temperature) + "°C";
  document.querySelector("#feels-like-value").textContent =
    Math.round(feelsLike) + "°C";
  document.querySelector("#humidity-value").textContent = humidity + "%";
  document.querySelector("#wind-value").textContent = windSpeed + " m/s";
  document.querySelector("#pressure-value").textContent = pressure + " hPa"; // Changed from air-quality-value to pressure-value
  const capitalizedDescription =
    weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  document.querySelector("#description").textContent = capitalizedDescription;

  // Update the weather icon
  document
    .querySelector("#weather-icon")
    .setAttribute("src", getWeatherIcon(weatherDescription));
}

// Helper function to get the ordinal suffix of a number
function getOrdinalSuffix(i) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function updateForecastDOM(forecast) {
  console.log("Forecast data:", forecast); // Log the forecast data

  const forecastDiv = document.querySelector("#forecast");

  if (!forecastDiv) {
    console.error("Could not find #forecast div");
    return;
  }

  forecastDiv.innerHTML = ""; // Clear the current content

  for (let item of forecast) {
    const forecastPiece = document.createElement("div");
    forecastPiece.classList.add("forecast-piece");

    const date = document.createElement("p");
    date.textContent = item.date;
    date.classList.add("day-date");

    const time = document.createElement("p");
    time.textContent = item.time;
    time.classList.add("day-time");

    const temperature = document.createElement("p");
    temperature.textContent = `${Math.round(item.temperature)}°C`;
    temperature.classList.add("day-temperature");

    forecastPiece.appendChild(date);
    forecastPiece.appendChild(time); // Append time to forecastPiece
    forecastPiece.appendChild(temperature);
    forecastDiv.appendChild(forecastPiece);
  }
}

// Get the user's location and weather data, then update the DOM
getUserLocation().then(async (city) => {
  console.log("User location:", city); // Log the user's location
  try {
    const weatherData = await getWeatherData(city);
    console.log("Weather data:", weatherData); // Log the weather data

    const forecastData = await getForecastData(city);
    console.log("Forecast data:", forecastData); // Log the forecast data

    // Get the forecast data for the next 5 days
    let forecastList = forecastData.list;
    let forecast = [];

    for (let i = 0; i < forecastList.length; i++) {
      let forecastItem = forecastList[i];
      let date = new Date(forecastItem.dt_txt);
      let day = getOrdinalSuffix(date.getDate());
      let time = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
      let temperature = forecastItem.main.temp;
      let humidity = forecastItem.main.humidity;
      let windSpeed = forecastItem.wind.speed;

      forecast.push({
        date: day,
        time: time,
        temperature: temperature,
        humidity: humidity,
        windSpeed: windSpeed,
      });
    }
    // Now forecast contains the forecast data for the next 5 days
    console.log(forecast); // Log the forecast data
    // Update the DOM with the weather data
    updateDOM(weatherData);
    updateForecastDOM(forecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert(
      "Error fetching weather data. Please check the city name and try again."
    );
  }
});

// Fetch and update the weather data when the user searches for a location
async function fetchAndUpdateWeather(location) {
  try {
    const weatherData = await getWeatherData(location);
    console.log("Weather data:", weatherData); // Log the weather data
    updateDOM(weatherData);

    const forecastData = await getForecastData(location);
    console.log("Forecast data:", forecastData); // Log the forecast data

    // Get the forecast data for the next 5 days
    let forecastList = forecastData.list;
    let forecast = [];

    for (let i = 0; i < forecastList.length; i++) {
      let forecastItem = forecastList[i];
      let date = new Date(forecastItem.dt_txt);
      let day = getOrdinalSuffix(date.getDate());
      let time = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
      let temperature = forecastItem.main.temp;
      let humidity = forecastItem.main.humidity;
      let windSpeed = forecastItem.wind.speed;

      forecast.push({
        date: day,
        time: time,
        temperature: temperature,
        humidity: humidity,
        windSpeed: windSpeed,
      });
    }
    // Now forecast contains the forecast data for the next 5 days
    console.log(forecast); // Log the forecast data
    updateForecastDOM(forecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert(
      "Error fetching weather data. Please check the city name and try again."
    );
  }
}

// Event listeners
document.querySelector("#search-button").addEventListener("click", () => {
  const location = document.querySelector("#search").value;
  fetchAndUpdateWeather(location);
  document.querySelector("#search").value = ""; // Clear the search bar
});

//
document.querySelector("#search").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const location = document.querySelector("#search").value;
    fetchAndUpdateWeather(location);
    document.querySelector("#search").value = ""; // Clear the search bar
  }
});

// Get the weather icon based on the weather description

function getWeatherIcon(description) {
  let icon;

  switch (description) {
    case "clear sky":
      icon = "image/sun.svg";
      break;
    case "few clouds":
      icon = "image/suncloudy.svg";
      break;
    case "scattered clouds":
    case "broken clouds":
    case "overcast clouds":
      icon = "image/cloud.svg";
      break;
    case "shower rain":
    case "light intensity shower rain":
    case "heavy intensity shower rain":
    case "ragged shower rain":
      icon = "image/rain.svg";
      break;
    case "rain":
    case "light rain":
    case "moderate rain":
    case "heavy intensity rain":
    case "very heavy rain":
    case "extreme rain":
      icon = "image/rain.svg";
      break;
    case "thunderstorm":
    case "thunderstorm with light rain":
    case "thunderstorm with rain":
    case "thunderstorm with heavy rain":
    case "light thunderstorm":
    case "heavy thunderstorm":
    case "ragged thunderstorm":
    case "thunderstorm with light drizzle":
    case "thunderstorm with drizzle":
    case "thunderstorm with heavy drizzle":
      icon = "image/thunder.svg";
      break;
    case "snow":
    case "light snow":
    case "heavy snow":
    case "sleet":
    case "light shower sleet":
    case "shower sleet":
    case "light rain and snow":
    case "rain and snow":
    case "light shower snow":
    case "shower snow":
    case "heavy shower snow":
      icon = "image/snow.svg";
      break;
    case "mist":
    case "smoke":
    case "haze":
    case "sand/dust whirls":
    case "fog":
    case "sand":
    case "dust":
    case "volcanic ash":
    case "squalls":
      icon = "image/mist.svg";
      break;
    case "tornado":
      icon = "image/tornado.svg";
      break;
    default:
      icon = "meteor.svg";
      break;
  }

  return icon;
}
