export default async (req, res) => {
  try {
    const location = req.query.location;
    const encodedLocation = encodeURIComponent(location);
    const apiOpenWeather = process.env.OPENWEATHERMAP_API_KEY;
    const fetch = (await import("node-fetch")).default;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${apiOpenWeather}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      console.error("Error fetching weather data:", weatherResponse.statusText);
      throw new Error("Error fetching weather data");
    }
    const weatherData = await weatherResponse.json();

    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};
