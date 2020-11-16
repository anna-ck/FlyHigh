const express = require('express');
const router = express.Router();
const fetchPlaces = require('./fetchPlacesAPI');
const fetchCorona = require('./fetchCoronaAPI');
const fetchFlights = require('./fetchFlightsAPI');

router.get('/', function (req, res) {
    res.render('index', {places: null, placesError: null, city: null, weather: null});
});

router.post('/submit', async (req, res) => {
    const searchCity = req.body.city;
    const surpriseCity = req.body.city2
    const city = searchCity || surpriseCity || localStorage.getItem('storageCity');
    localStorage.setItem('storageCity', city);
    const origin = req.body.origin;
    const [places, placesError] = await fetchPlaces(city)
    const [weather, weatherError, corona, coronaError] = await fetchCorona(city)
    const [flights, flightsError] = await fetchFlights(origin)

    res.render('index', {
        city: city, 
        places: places, 
        placesError: placesError, 
        weather: weather, 
        weatherError: weatherError, 
        corona: corona, 
        coronaError: coronaError, 
        origin: origin, 
        flights: flights, 
        flightsError: flightsError,
    });
})

module.exports = router