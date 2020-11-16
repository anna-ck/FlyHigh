require('dotenv').config()
const fetch = require("node-fetch");
const fetchWeather = require('./fetchWeatherAPI');

async function fetchCorona (city) {
    const [weather, weatherError] = await fetchWeather(city)
    let corona = null;
    let coronaError = null;
    const coronaUrlToFetch = 'https://api.covid19api.com/summary';
    const coronaResponse = await fetch(coronaUrlToFetch)
    if (coronaResponse.ok) {
        coronaJson = await coronaResponse.json()
        if (coronaJson.Countries && weather) {
            for(let i = 0; i < coronaJson.Countries.length; i++){
                if (coronaJson.Countries[i].CountryCode === weather.sys.country) {
                    corona = coronaJson.Countries[i]
                }
            }
        }
        else {
            coronaError = `Coronavirus situation in ${city.toUpperCase()} not available`
        }
    }
    else {
        coronaError = `Coronavirus  situation in ${city.toUpperCase()} not available`
    }
    return [weather, weatherError, corona, coronaError]
}


module.exports = fetchCorona