const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const apiOpenWeather = process.env.OPENWEATHERMAP_API_KEY;
const apiOpenCage = process.env.OPENCAGE_API_KEY;

app.get("/weather", async (req, res) => {
  const location = req.query.location;
  const encodedLocation = encodeURIComponent(location);
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${apiOpenWeather}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();
  res.json(weatherData);
});

app.get("/forecast", async (req, res) => {
  const city = req.query.city;
  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiOpenWeather}`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();
  const lat = geocodingData[0].lat;
  const lon = geocodingData[0].lon;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiOpenWeather}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);
  const forecastData = await forecastResponse.json();
  res.json(forecastData);
});

app.get("/location", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiOpenCage}&language=en`
  );
  const data = await response.json();
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
