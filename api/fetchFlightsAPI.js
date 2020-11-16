require('dotenv').config()
const fetch = require("node-fetch");

async function fetchFlights (origin) {
    let flights = null;
    let flightsError = null;
    let jsonToken = null;
    if (origin) {
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
        const flightsUrlToFetch = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&departureDate=${depDateMin}%2C${depDateMax}&oneWay=false&nonStop=true&viewBy=DESTINATION`;
        const flightsResponse = await fetch(flightsUrlToFetch, {
            headers: {
              'Authorization': jsonToken.token_type + ' ' + jsonToken.access_token,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (flightsResponse.ok) {
            flights = await flightsResponse.json()
            if (!flights.data) {
                flightsError = `Flights from ${origin} are not available at the moment`
            }
        }
        else {
            flightsError = `Flights from ${origin} are not available at the moment`
        }
    }
}
return [flights, flightsError]
}


module.exports = fetchFlights