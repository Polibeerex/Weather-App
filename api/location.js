// api/location.js

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const apiOpenCage = process.env.OPENCAGE_API_KEY;
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiOpenCage}&language=en`
  );
  const data = await response.json();
  res.json(data);
};
