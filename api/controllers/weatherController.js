/**
 * This is the internal weather API. It is a server application that listens for
 * HTTP requests related to the weather information, makes a call to an external weather
 * API to receive the latest information, and sends it back to the client.
 * 
 * The API focuses on HTTP interactions built on top of Express and Node.js. It contains
 * only the requests and responses related to the weather information, and is isolated
 * from the rest of the code.
 * 
 * It requires the Moment js package for formatting time in the returned weather data.
 * 
 * @date Apr 2018
 * @module api/controllers/weather
 */

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const moment = require('moment');

(function() {

  // export functions to get weather data
  module.exports = {
    /**
     * @function
     * @returns {Object} The different weather data to be displayed on the webapp
     */
    getCurrentWeather: getCurrentWeather,
    getForecast: getForecast,
    getDescription: getDescription
  };

  /**
   * Handler for /getCurrentWeather resource. It makes a call to an external weather API
   * provided by openweathermap.org and fetches the current weather for the selected town,
   * based on the town weather ID received with the client request.
   */
  function getCurrentWeather(req,res,next) {
    // makes a call to the external weather API based on town weather ID
    // this is sent over from the client side when 'Overview' link is clicked
    let weatherID = req.params.name;

    fetch('http://api.openweathermap.org/data/2.5/weather?id='+weatherID+'&units=metric&APPID=e2c2a6d63857bbb62a97f6f7c0ea87cc')
    .then(res => res.json())
    .then(data => {
      data = formatWeather(data);
      return res.status(200).end(JSON.stringify(data));
    })
    .catch(error => console.log(error))
  };

  /**
   * Takes in the weather data retrieved by getCurrentWeather function and formats it
   * to display in a human-friendly way.
   */
  function formatWeather(json) {
    // format external API data as it is to be displayed in the main page
    let temp = Math.trunc(json.main.temp); // remove decimals from temperature
    let img = 'https://openweathermap.org/img/w/'+ json.weather[0].icon +'.png'; // get icon URL
    let desc = json.weather[0].description;
    let descFixed = desc[0].toUpperCase() + desc.substr(1); // capitalise description
    let wind = json.wind.speed;
    let clouds = json.clouds.all;
    let sunrise = moment(new Date(json.sys.sunrise*1000)).format('HH:mm');
    let sunset = moment(new Date(json.sys.sunset*1000)).format('HH:mm');

    // store the above as an object to be sent back
    let result = [
      {"temp": temp, "icon": img, "desc": descFixed, "wind": wind, "clouds": clouds, "sunrise": sunrise, "sunset": sunset}
    ];
    return result;
  };

  /**
   * Handler for /getForecast resource. Like /getCurrentWeather, it makes a call to openweathermap.org
   * and fetches the weather forecast for the selected town, based on the town weather ID received with
   * the client request.
   */
  function getForecast(req,res,next) {
    // makes a call to the external api to get 5 day/3hr
    // forecast data based on weather ID
    let weatherID = req.params.name;

    fetch('http://api.openweathermap.org/data/2.5/forecast?id='+weatherID+'&units=metric&APPID=e2c2a6d63857bbb62a97f6f7c0ea87cc')
    .then(res => res.json())
    .then(data => { return res.status(200).end(JSON.stringify(data)) })
    .catch(error => console.log(error))
  };

  /**
   * Handler for /getDescription resource. It makes a call to the UK Met Office API and fetches
   * a text weather forecast for the Tayside, Central and Fife region.
   */
  function getDescription(req, res, next) {
    fetch('http://datapoint.metoffice.gov.uk/public/data/txt/wxfcs/regionalforecast/json/504?key=1817a364-85cb-4e36-aa6c-498ac840f584')
    .then(res => res.json())
    .then(data => { return res.status(200).end(JSON.stringify(data)) })
    .catch(error => console.log(error))
  };

}());
