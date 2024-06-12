"use strict";

const api_key = "9fb242396d4c3dc826de84c6749003e4";

const imageBaseURL = "https://image.tmdb.org/t/p/";

/*Fetching the data*/

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export { imageBaseURL, api_key, fetchDataFromServer };
