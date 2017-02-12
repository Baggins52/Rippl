// Utility functions for converting location name to GPS Coordinates, before making request to Twitter
var googleAPIKey = require('../config/google.js');
var Promise = require('bluebird');
var axios = require('axios');





module.exports = {
  
  getCoordinates:(location, callback) => {
    var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var keyString = '&key=' + googleAPIKey['apikey'];
    // KG: need make sure location passed in is valid URL string
    var url = baseURL + location + keyString;

    axios.get(url).then((response) => {
      var coordinates = response.data.results[0].geometry.location;
      var coordinateString = coordinates.lat + ',' + coordinates.lng;
      console.log(coordinates)
      console.log(coordinateString)
      callback(coordinateString);
    }).catch((error) => {
      console.log('getCoordinates failed');
    });
  }
}

// FOR TESTING
// console.log('util-google.js running');
// module.exports.getCoordinates('Cleveland', (data)=> console.log(data))