const express = require('express');
require('dotenv').config()
//const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
//import fetch from 'node-fetch'
//const dotenv = require('dotenv');
//dotenv.config();
const app = express();
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//app.engine('ejs', require('ejs').__express);
app.use(express.static("client"))

/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
*/
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);


router.get('/', function (req, res) {
    res.render('index', {places: null, placesError: null, city: null, weather: null});
});

router.post('/', function (req, res) {
    res.redirect('/')
    res.render('index', {places: null, error: null});
});

router.post('/submit', async (req, res) => {
    let places = null;
    let placesError = null;
    let weather = null;
    let weatherError = null;
    let corona = null;
    let coronaError = null;
    let flights = null;
    let flightsError = null;
    let jsonToken = null
    const searchCity = req.body.city;
    const surpriseCity = req.body.city2
    const city = searchCity || surpriseCity || localStorage.getItem('storageCity');
    localStorage.setItem('storageCity', city);
    const destination = req.body.destination || null;
    const placesUrlToFetch = `https://api.foursquare.com/v2/venues/explore?near=${city}&limit=6&client_id=${process.env.FOURSQUARECLIENTID}&client_secret=${process.env.FOURSQUARECLIENTSECRET}&v=20200610&locale=en`;
    const weatherUrlToFetch = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&APPID=${process.env.WEATHERAPIKEY}&units=metric`
    const coronaUrlToFetch = 'https://api.covid19api.com/summary'
    const placesResponse = await fetch(placesUrlToFetch)
    if (placesResponse.ok) {
        const json = await placesResponse.json()
        if (json.response.groups[0].items.length > 0) {
            places = json.response.groups[0].items.map(item => item.venue)
        }
        else {
            placesError = 'Attractions not available'
        }
    }
    else {
        placesError = 'Attractions not available'
    }
    const weatherResponse = await fetch(weatherUrlToFetch)
    if (weatherResponse.ok) {
        const jsonWeather = await weatherResponse.json() 
        if (jsonWeather.main) {
            weather = jsonWeather
        }
        else {
            weatherError = 'Weather not available'
        }
    }
    else {
        weatherError = 'Weather not available'
    }
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
            coronaError = 'Coronavirus data not available'
        }
    }
    else {
        coronaError = 'Coronavoris data not available'
    }
    if (destination) {
        const urlToken = 'https://test.api.amadeus.com/v1/security/oauth2/token'
        const tokenResponse = await fetch(urlToken, {
            method: 'POST',
            body: 'grant_type=client_credentials&client_id=' + process.env.FLIGHTID + '&client_secret=' + process.env.FLIGHTSECRET,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        if (tokenResponse.ok) {
            jsonToken = await tokenResponse.json();
            const depDateMin = new Date().toISOString().slice(0,10);
            const depDateMax = new Date(Date.now() + 12096e5).toISOString().slice(0,10);
            const flightsUrlToFetch = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${destination}&departureDate=${depDateMin}%2C${depDateMax}&oneWay=false&nonStop=true&viewBy=COUNTRY`;
            const flightsResponse = await fetch(flightsUrlToFetch, {
                headers: {
                  'Authorization': jsonToken.token_type + ' ' + jsonToken.access_token,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            flights = await flightsResponse.json()
            if (!flights.data) {
                flightsError = 'Flights data not available'
            }
        }
    }
    res.render('index', {
        city: city, 
        places: places, 
        placesError: placesError, 
        weather: weather, 
        weatherError: weatherError, 
        corona: corona, 
        coronaError: coronaError, 
        destination: destination, 
        flights: flights, 
        flightsError: flightsError,
        token: jsonToken
    });
})

app.use('/', router);

//module.exports.handler = serverless(app)