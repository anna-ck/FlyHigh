require('dotenv').config()
const axios = require("axios");


async function fetchCorona (country, city) {
    let corona = null;
    let coronaError = null;
    const coronaUrlToFetch =  `https://api.covid19api.com/total/country/${country}`
    try {
       coronaAll = await axios.get(coronaUrlToFetch)
       corona = coronaAll.data[coronaAll.data.length - 1]
    }
    catch (error) {
       if (error.response) {
           console.error(`Error response with status ${error.response.status} and message ${error.response.data} occured during corona API request`)
       }
       else {
           console.error(`An error occured: ${error.message} during corona API request`)
       }
       coronaError = `Coronavirus situation in ${country ? country: city} is not available.`
    }
    return [corona, coronaError]
}


module.exports = fetchCorona