// Weather APP

// Get weather data
async function getWeatherData(lat, lon) {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_sum`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    return {
      location: `${lat}, ${lon}`,
      temperature: weatherData.hourly.temperature_2m[0].value,
      precipitation: weatherData.hourly.precipitation_sum[0].value,
      // Add other weather data as needed
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Throw the error so it can be caught later
  }
}

// Get user location
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Usage
getUserLocation().then(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const weatherData = await getWeatherData(lat, lon);
  updateDOM(weatherData);
});

function updateDOM(weatherData) {
  // Create variables for each piece of weather data
  const location = weatherData.location;
  const temperature = weatherData.temperature;

  // Update the DOM with the weather data
  document.querySelector("#search").setAttribute("placeholder", location);
  document.querySelector("#temperature").textContent =
    Math.round(temperature) + "°C";
}

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

document.querySelector("#search-button").addEventListener("click", async () => {
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
