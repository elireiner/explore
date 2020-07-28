'use strict'

$.getScript('filter.js', function () {
    filter;
    getId;
    reduceLength;
});

function handleCountryClick() {
    $("#country-list").on("click", 'li', function () {
        $("#country").val(null)
        $("#country").val($(this).text())
    })
}

function handleFilter() {
    $("#country").keyup(function () {
        let input = $('#country').val()
        filter(input)
        $(`#country-list`).empty().append(filter(input))
    });
}


function handleCountries() {
    $('#country-list').hide();
    $('#country').click(function () {
        $("#country-list").show();
    });
    handleFilter()
    handleCountryClick()
}

function handleUnitButtons() {
    $('#js-weather-results-M').hide();
    $('#js-f').click(event => {
        event.preventDefault();
        $('#js-weather-results-M').hide();
        $('#js-weather-results-I').show();
    });
    $('#js-c').click(event => {
        event.preventDefault();
        $('#js-weather-results-I').hide();
        $('#js-weather-results-M').show();
    });
}

function displayWeatherResults(responseJson, unitType) {
    for (let i = 0; i < responseJson.data.length; i++) {
        $(`#js-weather-results-${unitType}`).append(`
        <div class="weather-data">
        <h4 class="day">Day: ${[i + 1]}</h4>
        <img class="weather-img" src="weather-icons/${responseJson.data[i].weather.icon}.png" alt="An img depicting the weather as ${responseJson.data[i].weather.description}">
        <p class="temp">${responseJson.data[i].high_temp}°/${responseJson.data[i].low_temp}°</p>
        </div>`);
    }
    $('.results').show();
};

function formatQueryParams(params) {
    let queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

let weatherBaseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
let weatherApiKey = '5ae81936c8514eacb8ef228b49c7eaa4';

function getWeather(cityState, unitType) {
    let params = {
        units: unitType,
        city: cityState,
        key: weatherApiKey
    }
    let queryString = formatQueryParams(params)
    let url = weatherBaseUrl + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayWeatherResults(responseJson, unitType))
        .catch(err => {
            $('#js-hide').hide();
            $('#js-error-message-weather').empty().text(`Something went wrong: ${err.message}`).show();
        })
};

function displayNewsResults(responseJson) {
    console.log(responseJson)
    for (let i = 0; i < responseJson.news.length; i++) {
        $('#js-news-results-list').append(`
    <li class="news-item">
    <a href="${responseJson.news[i].url}" target="_blank">${reduceLength(responseJson.news[i].title)}</a>
    ${
            //<p>Author: ${responseJson.news[i].author}</p>
            //The data in this field is inconsistent
            ''}
    </li>`)
    }
    $('.results').show();

    //This code will be helpful in displaying images for news articles:
    //<img src="${responseJson.articles[i].urlToImage}" alt="An img about this news article">
};

let newsBaseUrl = 'https://api.currentsapi.services/v1/search'
let newsApiKey = 'LViWVggw4c3qYA8wJv7trnhs9j3K6gkavCz9zZPGK2h1cX8c';

function getNews(country) {

    let params = {
        country: country,
        language: 'en',
        domain_not: "arxiv.org",
        apiKey: newsApiKey
    }

    let queryString = formatQueryParams(params);
    let url = newsBaseUrl + '?' + queryString;

    console.log(url)

    let req = new Request(url);

    fetch(req)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => {
            $('#js-error-message-news').empty().text(`Something went wrong: ${err.message}`).show();
        })
}

function handleGettingNews(country) {
    $('#js-news-results-list').empty();
    getNews(country)
};

function handleGetting(cityState, country) {

    handleGettingNews(country);
    $('#js-weather-results-I').empty();
    getWeather(cityState, "I");
    $('#js-weather-results-M').empty();
    getWeather(cityState, "M");
    $('#js-weather-results').show();
    $('#js-news-results').show();

};

function combine(city, state) {
    let formatedCity = city.split(' ');
    formatedCity = formatedCity.join('+');
    formatedCity = formatedCity + ',' + state;
    return formatedCity
}
function hideError() {
    $('#js-error-message-weather').hide()
    $('#js-error-message-news').hide()
}

function handleInvalidCountry(country) {
    if (country == "anError") {
        $('#invalid-country').show()
    }
}

function handleSubmit() {
    $('form').submit(function (event) {
        event.preventDefault();
        hideError()
        $('#js-hide').show();
        let city = $('#city').val();
        let state = $('#state').val();
        let country = getId($("#country").val())
        handleInvalidCountry(country)
        let cityState = combine(city, state);
        handleGetting(cityState, country);
    });
};


function handleExploreApp() {
    handleCountries()
    $('#invalid-country').hide()
    $('.results').hide();
    hideError()
    handleSubmit();
    handleUnitButtons();
};

$(handleExploreApp);