require('dotenv').config()
const fetch = require("node-fetch");

async function fetchWeather (city) {
    let weather = null;
    let weatherError = null;
    const weatherUrlToFetch = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&APPID=${process.env.WEATHERAPIKEY}&units=metric`
    const weatherResponse = await fetch(weatherUrlToFetch)
    if (weatherResponse.ok) {
        const jsonWeather = await weatherResponse.json() 
        if (jsonWeather.main) {
            weather = jsonWeather
        }
        else {
            weatherError = `Weather in ${city.toUpperCase()} not available`
        }
    }
    else {
        weatherError = `Weather in ${city.toUpperCase()}  not available`
    }
    return [weather, weatherError]
}


module.exports = fetchWeather