// api/location.js
export default async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const apiOpenCage = process.env.OPENCAGE_API_KEY;

    const fetch = (await import("node-fetch")).default;

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiOpenCage}&language=en`
    );
    const data = await response.json();

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};
