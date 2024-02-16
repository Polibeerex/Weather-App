// Weather APP
// API KEY: 3f2d3cd3a5900736eb3cd458b875135f

// Get weather data
async function getWeatherData(location) {
  try {
    const apiKey = "3f2d3cd3a5900736eb3cd458b875135f";
    const encodedLocation = encodeURIComponent(location);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`;
    const pollutionResponse = await fetch(pollutionUrl);
    const pollutionData = await pollutionResponse.json();

    return {
      location: weatherData.name,
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      airQuality: pollutionData.list[0].main.aqi,
      weatherDescription: weatherData.weather[0].description,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
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
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=8267cbaa8e8f4be89279e0dc1476f54b&language=en`
      );
      const data = await response.json();

      console.log(data); // Log the data returned from the OpenCage Geocoder API

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
  const airQuality = weatherData.airQuality;
  const weatherDescription = weatherData.weatherDescription;

  // Update the DOM with the weather data
  document.querySelector("#search").setAttribute("placeholder", location);
  document.querySelector("#temperature").textContent =
    Math.round(temperature) + "°C";
  document.querySelector("#feels-like-value").textContent =
    Math.round(feelsLike) + "°C";
  document.querySelector("#humidity-value").textContent = humidity + "%";
  document.querySelector("#wind-value").textContent = windSpeed + " m/s";
  document.querySelector("#air-quality-value").textContent =
    airQuality + " AQI";
  const capitalizedDescription =
    weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  document.querySelector("#description").textContent = capitalizedDescription;

  // Update the weather icon
  document
    .querySelector("#weather-icon")
    .setAttribute("src", getWeatherIcon(weatherDescription));
}

// Get the user's location and weather data, then update the DOM

getUserLocation().then(async (city) => {
  const weatherData = await getWeatherData(city);
  updateDOM(weatherData);
});

document.querySelector("#search").addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const location = event.target.value;
    try {
      const weatherData = await getWeatherData(location);
      updateDOM(weatherData);
    } catch (error) {
      alert(
        "Error fetching weather data. Please check the city name and try again."
      );
    }
  }
});

ocument.querySelector("#search-button").addEventListener("click", async () => {
  const location = document.querySelector("#search").value;
  try {
    const weatherData = await getWeatherData(location);
    updateDOM(weatherData);
  } catch (error) {
    alert(
      "Error fetching weather data. Please check the city name and try again."
    );
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
    case "tornado":
      icon = "image/tornado.svg";
      break;
    default:
      icon = "meteor.svg";
  }

  return icon;
}
