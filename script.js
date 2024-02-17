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
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      resolve({ latitude, longitude });
    }, reject);
  });
}

// Get weather data for user location
const fetchWeatherApi = require("openmeteo").fetchWeatherApi;

const params = {
  latitude: location.latitude,
  longitude: location.longitude,
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "pressure_msl",
    "surface_pressure",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ],
  hourly: [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "apparent_temperature",
    "precipitation_probability",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "snow_depth",
    "weather_code",
    "pressure_msl",
    "surface_pressure",
    "cloud_cover",
    "cloud_cover_low",
    "cloud_cover_mid",
    "cloud_cover_high",
    "visibility",
    "evapotranspiration",
    "et0_fao_evapotranspiration",
    "vapour_pressure_deficit",
    "wind_speed_10m",
    "wind_speed_80m",
    "wind_speed_120m",
    "wind_speed_180m",
    "wind_direction_10m",
    "wind_direction_80m",
    "wind_direction_120m",
    "wind_direction_180m",
    "wind_gusts_10m",
    "temperature_80m",
    "temperature_120m",
    "temperature_180m",
    "soil_temperature_0cm",
    "soil_temperature_6cm",
    "soil_temperature_18cm",
    "soil_temperature_54cm",
    "soil_moisture_0_to_1cm",
    "soil_moisture_1_to_3cm",
    "soil_moisture_3_to_9cm",
    "soil_moisture_9_to_27cm",
    "soil_moisture_27_to_81cm",
  ],
  daily: [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "sunrise",
    "sunset",
    "daylight_duration",
    "sunshine_duration",
    "uv_index_max",
    "uv_index_clear_sky_max",
    "precipitation_sum",
    "rain_sum",
    "showers_sum",
    "snowfall_sum",
    "precipitation_hours",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
    "shortwave_radiation_sum",
    "et0_fao_evapotranspiration",
  ],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
console.log("Timezone " + timezone);
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);
// Helper function to form time ranges
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];
// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();
const current = response.current();
const hourly = response.hourly();
const daily = response.daily();
// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature2m: current.variables(0).value(),
    relativeHumidity2m: current.variables(1).value(),
    apparentTemperature: current.variables(2).value(),
    isDay: current.variables(3).value(),
    precipitation: current.variables(4).value(),
    rain: current.variables(5).value(),
    showers: current.variables(6).value(),
    snowfall: current.variables(7).value(),
    weatherCode: current.variables(8).value(),
    cloudCover: current.variables(9).value(),
    pressureMsl: current.variables(10).value(),
    surfacePressure: current.variables(11).value(),
    windSpeed10m: current.variables(12).value(),
    windDirection10m: current.variables(13).value(),
    windGusts10m: current.variables(14).value(),
  },
  hourly: {
    time: range(
      Number(hourly.time()),
      Number(hourly.timeEnd()),
      hourly.interval()
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    temperature2m: hourly.variables(0).valuesArray(),
    relativeHumidity2m: hourly.variables(1).valuesArray(),
    dewPoint2m: hourly.variables(2).valuesArray(),
    apparentTemperature: hourly.variables(3).valuesArray(),
    precipitationProbability: hourly.variables(4).valuesArray(),
    precipitation: hourly.variables(5).valuesArray(),
    rain: hourly.variables(6).valuesArray(),
    showers: hourly.variables(7).valuesArray(),
    snowfall: hourly.variables(8).valuesArray(),
    snowDepth: hourly.variables(9).valuesArray(),
    weatherCode: hourly.variables(10).valuesArray(),
    pressureMsl: hourly.variables(11).valuesArray(),
    surfacePressure: hourly.variables(12).valuesArray(),
    cloudCover: hourly.variables(13).valuesArray(),
    cloudCoverLow: hourly.variables(14).valuesArray(),
    cloudCoverMid: hourly.variables(15).valuesArray(),
    cloudCoverHigh: hourly.variables(16).valuesArray(),
    visibility: hourly.variables(17).valuesArray(),
    evapotranspiration: hourly.variables(18).valuesArray(),
    et0FaoEvapotranspiration: hourly.variables(19).valuesArray(),
    vapourPressureDeficit: hourly.variables(20).valuesArray(),
    windSpeed10m: hourly.variables(21).valuesArray(),
    windSpeed80m: hourly.variables(22).valuesArray(),
    windSpeed120m: hourly.variables(23).valuesArray(),
    windSpeed180m: hourly.variables(24).valuesArray(),
    windDirection10m: hourly.variables(25).valuesArray(),
    windDirection80m: hourly.variables(26).valuesArray(),
    windDirection120m: hourly.variables(27).valuesArray(),
    windDirection180m: hourly.variables(28).valuesArray(),
    windGusts10m: hourly.variables(29).valuesArray(),
    temperature80m: hourly.variables(30).valuesArray(),
    temperature120m: hourly.variables(31).valuesArray(),
    temperature180m: hourly.variables(32).valuesArray(),
    soilTemperature0cm: hourly.variables(33).valuesArray(),
    soilTemperature6cm: hourly.variables(34).valuesArray(),
    soilTemperature18cm: hourly.variables(35).valuesArray(),
    soilTemperature54cm: hourly.variables(36).valuesArray(),
    soilMoisture0To1cm: hourly.variables(37).valuesArray(),
    soilMoisture1To3cm: hourly.variables(38).valuesArray(),
    soilMoisture3To9cm: hourly.variables(39).valuesArray(),
    soilMoisture9To27cm: hourly.variables(40).valuesArray(),
    soilMoisture27To81cm: hourly.variables(41).valuesArray(),
  },
  daily: {
    time: range(
      Number(daily.time()),
      Number(daily.timeEnd()),
      daily.interval()
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    weatherCode: daily.variables(0).valuesArray(),
    temperature2mMax: daily.variables(1).valuesArray(),
    temperature2mMin: daily.variables(2).valuesArray(),
    apparentTemperatureMax: daily.variables(3).valuesArray(),
    apparentTemperatureMin: daily.variables(4).valuesArray(),
    sunrise: daily.variables(5).valuesArray(),
    sunset: daily.variables(6).valuesArray(),
    daylightDuration: daily.variables(7).valuesArray(),
    sunshineDuration: daily.variables(8).valuesArray(),
    uvIndexMax: daily.variables(9).valuesArray(),
    uvIndexClearSkyMax: daily.variables(10).valuesArray(),
    precipitationSum: daily.variables(11).valuesArray(),
    rainSum: daily.variables(12).valuesArray(),
    showersSum: daily.variables(13).valuesArray(),
    snowfallSum: daily.variables(14).valuesArray(),
    precipitationHours: daily.variables(15).valuesArray(),
    precipitationProbabilityMax: daily.variables(16).valuesArray(),
    windSpeed10mMax: daily.variables(17).valuesArray(),
    windGusts10mMax: daily.variables(18).valuesArray(),
    windDirection10mDominant: daily.variables(19).valuesArray(),
    shortwaveRadiationSum: daily.variables(20).valuesArray(),
    et0FaoEvapotranspiration: daily.variables(21).valuesArray(),
  },
};
// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
  console.log(
    weatherData.hourly.time[i].toISOString(),
    weatherData.hourly.temperature2m[i],
    weatherData.hourly.relativeHumidity2m[i],
    weatherData.hourly.dewPoint2m[i],
    weatherData.hourly.apparentTemperature[i],
    weatherData.hourly.precipitationProbability[i],
    weatherData.hourly.precipitation[i],
    weatherData.hourly.rain[i],
    weatherData.hourly.showers[i],
    weatherData.hourly.snowfall[i],
    weatherData.hourly.snowDepth[i],
    weatherData.hourly.weatherCode[i],
    weatherData.hourly.pressureMsl[i],
    weatherData.hourly.surfacePressure[i],
    weatherData.hourly.cloudCover[i],
    weatherData.hourly.cloudCoverLow[i],
    weatherData.hourly.cloudCoverMid[i],
    weatherData.hourly.cloudCoverHigh[i],
    weatherData.hourly.visibility[i],
    weatherData.hourly.evapotranspiration[i],
    weatherData.hourly.et0FaoEvapotranspiration[i],
    weatherData.hourly.vapourPressureDeficit[i],
    weatherData.hourly.windSpeed10m[i],
    weatherData.hourly.windSpeed80m[i],
    weatherData.hourly.windSpeed120m[i],
    weatherData.hourly.windSpeed180m[i],
    weatherData.hourly.windDirection10m[i],
    weatherData.hourly.windDirection80m[i],
    weatherData.hourly.windDirection120m[i],
    weatherData.hourly.windDirection180m[i],
    weatherData.hourly.windGusts10m[i],
    weatherData.hourly.temperature80m[i],
    weatherData.hourly.temperature120m[i],
    weatherData.hourly.temperature180m[i],
    weatherData.hourly.soilTemperature0cm[i],
    weatherData.hourly.soilTemperature6cm[i],
    weatherData.hourly.soilTemperature18cm[i],
    weatherData.hourly.soilTemperature54cm[i],
    weatherData.hourly.soilMoisture0To1cm[i],
    weatherData.hourly.soilMoisture1To3cm[i],
    weatherData.hourly.soilMoisture3To9cm[i],
    weatherData.hourly.soilMoisture9To27cm[i],
    weatherData.hourly.soilMoisture27To81cm[i]
  );
}
for (let i = 0; i < weatherData.daily.time.length; i++) {
  console.log(
    weatherData.daily.time[i].toISOString(),
    weatherData.daily.weatherCode[i],
    weatherData.daily.temperature2mMax[i],
    weatherData.daily.temperature2mMin[i],
    weatherData.daily.apparentTemperatureMax[i],
    weatherData.daily.apparentTemperatureMin[i],
    weatherData.daily.sunrise[i],
    weatherData.daily.sunset[i],
    weatherData.daily.daylightDuration[i],
    weatherData.daily.sunshineDuration[i],
    weatherData.daily.uvIndexMax[i],
    weatherData.daily.uvIndexClearSkyMax[i],
    weatherData.daily.precipitationSum[i],
    weatherData.daily.rainSum[i],
    weatherData.daily.showersSum[i],
    weatherData.daily.snowfallSum[i],
    weatherData.daily.precipitationHours[i],
    weatherData.daily.precipitationProbabilityMax[i],
    weatherData.daily.windSpeed10mMax[i],
    weatherData.daily.windGusts10mMax[i],
    weatherData.daily.windDirection10mDominant[i],
    weatherData.daily.shortwaveRadiationSum[i],
    weatherData.daily.et0FaoEvapotranspiration[i]
  );
}
