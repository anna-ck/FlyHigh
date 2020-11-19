require('dotenv').config()
const axios = require("axios");

async function fetchFlights (origin) {
    let flights = null;
    let flightsError = null;
    if (origin) {
        const urlToken = 'https://test.api.amadeus.com/v1/security/oauth2/token'
        try {
            const tokenResponse = await axios({
                method: 'post',
                url: urlToken,
                data: 'grant_type=client_credentials&client_id=' + process.env.FLIGHTID + '&client_secret=' + process.env.FLIGHTSECRET,
            });
            if (tokenResponse.status === 200) {
                const depDateMin = new Date().toISOString().slice(0,10);
                const depDateMax = new Date(Date.now() + 12096e5).toISOString().slice(0,10);
                const flightsUrlToFetch = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&departureDate=${depDateMin}%2C${depDateMax}&oneWay=false&nonStop=true&viewBy=DESTINATION`;
                const flightsResponse = await axios.get(flightsUrlToFetch, {
                    headers: {
                    'Authorization': tokenResponse.data.token_type + ' ' + tokenResponse.data.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                if (flightsResponse.status === 200) {
                    flights = flightsResponse.data
                }
                else {
                    flightsError = `Flights from ${origin} are not available.`
                }
            }
        }
        catch (error) {
            if (error.response) {
                console.error(`Error response with status ${error.response.status} and message ${error.response.data} occured during flights API request`)
            }
            else {
                console.error(`An error occured: ${error.message} during flights API request`)
            }
            flightsError = `Flight from ${origin} are not available.`
        }
    }
    return [flights, flightsError]
}


module.exports = fetchFlights