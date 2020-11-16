require('dotenv').config()
const fetch = require("node-fetch");

async function fetchPlaces (city) {
    let places = null;
    let placesError = null;
    const placesUrlToFetch = `https://api.foursquare.com/v2/venues/explore?near=${city}&limit=6&client_id=${process.env.FOURSQUARECLIENTID}&client_secret=${process.env.FOURSQUARECLIENTSECRET}&v=20200610&locale=en`;
    const placesResponse = await fetch(placesUrlToFetch)
    if (placesResponse.ok) {
        const json = await placesResponse.json()
        if (json.response.groups[0].items.length > 0) {
            places = json.response.groups[0].items.map(item => item.venue)
        }
        else {
            placesError = `Attractions in ${city.toUpperCase()} not available`
        }
    }
    else {
        placesError = `Attractions in ${city.toUpperCase()} not available`
    }
    return [places, placesError]
}


module.exports = fetchPlaces