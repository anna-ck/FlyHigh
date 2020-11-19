require('dotenv').config()
const axios = require("axios");

async function fetchPlaces (city) {
    let places = null;
    let placesError = null;
    const placesUrlToFetch = `https://api.foursquare.com/v2/venues/explore?near=${city}&limit=6&client_id=${process.env.FOURSQUARECLIENTID}&client_secret=${process.env.FOURSQUARECLIENTSECRET}&v=20200610&locale=en`;
    try {
        const placesResponse = await axios.get(placesUrlToFetch)
        if (placesResponse.data.response.groups[0].items.length > 0) {
            places = placesResponse.data.response.groups[0].items.map(item => item.venue)
        }
     }
     catch (error) {
        if (error.response) {
            console.error(`Error response with status ${error.response.status} and message ${error.response.data} occured during places API request`)
        }
        else {
            console.error(`An error occured: ${error.message} during places API request`)
        }
        placesError = `Attractions in ${city} are not available.`
     }
     return [places, placesError]
}


module.exports = fetchPlaces