// api/weather.js

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const location = req.query.location;
  const encodedLocation = encodeURIComponent(location);
  const apiOpenWeather = process.env.OPENWEATHERMAP_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${apiOpenWeather}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();
  res.json(weatherData);
};
