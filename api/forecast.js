// api/forecast.js

import fetch from "node-fetch";

export default async (req, res) => {
  const city = req.query.city;
  const apiOpenWeather = process.env.OPENWEATHERMAP_API_KEY;
  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiOpenWeather}`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();
  const lat = geocodingData[0].lat;
  const lon = geocodingData[0].lon;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiOpenWeather}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);
  const forecastData = await forecastResponse.json();
  res.json(forecastData);
};
