require('dotenv').config()
const axios = require("axios");

async function fetchWeather (city) {
    let weather = null;
    let weatherError = null;
    let country = null;
    const weatherUrlToFetch = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&APPID=${process.env.WEATHERAPIKEY}&units=metric`
    try {
        const weatherResponse = await axios.get(weatherUrlToFetch)
        if (weatherResponse.data.main) {
            weather = weatherResponse.data
            country = weatherResponse.data.sys.country
        }
     }
     catch (error) {
        if (error.response) {
            console.error(`Error response with status ${error.response.status} and message ${error.response.data} occured during weather API request`)
        }
        else {
            console.error(`An error occured: ${error.message} during weather API request`)
        }
        weatherError = `Current weather in ${city} is not available.`
     }
     return [weather, weatherError, country]
}


module.exports = fetchWeather