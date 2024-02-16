# Weather App

This project is a simple weather application built with JavaScript. It uses the OpenWeatherMap API and the OpenCage Geocoder API to fetch and display weather data for the user's current location or a location entered by the user.

## Features

- Fetches and displays the following weather data:
  - Location name
  - Temperature (in Celsius)
  - "Feels like" temperature
  - Humidity (in percentage)
  - Wind speed (in m/s)
  - Air quality index (AQI)
  - Weather description
- Fetches and displays the user's current location using the Geolocation API and the OpenCage Geocoder API.
- Allows the user to enter a location to fetch and display the weather data for that location.
- Displays a weather icon based on the weather description.

## Usage

To use this application, simply open it in a web browser. It will automatically fetch and display the weather data for your current location. You can enter a different location in the search bar to fetch and display the weather data for that location.

## API Keys

This application uses the following API keys:

- OpenWeatherMap API: `3f2d3cd3a5900736eb3cd458b875135f`
- OpenCage Geocoder API: `8267cbaa8e8f4be89279e0dc1476f54b`

Please note that these keys are included in the code for demonstration purposes only. You should replace them with your own keys before using this application.

## Dependencies

This application uses the Fetch API to make HTTP requests and the Geolocation API to get the user's current location. It does not have any external library dependencies.
