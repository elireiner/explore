'use strict'
$.getScript('filter.js', function () {
    filter;
    getId;
    reduceLength;
});

$("#js-weather-link").click(function () {
    $('html, body').animate({
        scrollTop: $("#js-weather-results").offset().top - 150
    }, 3000);
    $("#js-weather-header").show()
    setTimeout(function () {
        $('#js-moving-links').css({
            position: 'fixed',
            top: 0,
            "background-color": "#D04356",
            display: "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "align-items": "center",
            "width": "100vw",
            "color": "#000000"
        })
    }, 4000)

});

$("#js-news-link").click(function () {
    $('html, body').animate({
        scrollTop: $("#js-news-results").offset().top - 150
    }, 3000);
    setTimeout(function () {
        $('#js-moving-links').css({
            position: 'fixed',
            top: 0,
            "background-color": "#D04356",
            display: "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "align-items": "center",
            "width": "100vw",
            "color": "#000000"
        })
    }, 4000)
});

$("#js-news-link").click(function () {
    $('html, body').animate({
        scrollTop: $("#js-news-results").offset().top - 200
    }, 4000);
    setTimeout(function () {
        $('#js-moving-links').css({
            position: 'fixed',
            top: 0,
            
            "background-color": "#D04356",
            display: "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "align-items": "center",
            "width": "100vw",
            "color": "#000000"
        })
    }, 5000)
});

//this will hide the country list dropdown when a user click outside
$(document).mouseup(function (e) {
    var container = new Array();
    container.push($('#js-country-list'));
    container.push($('#js-white-country'));

    $.each(container, function (key, value) {// the 'value' is each container item
        if (!$(value).is(e.target) // if the target of the click isn't the container...
            && $(value).has(e.target).length === 0) // ... nor a descendant of the container
        {
            $("#js-country-list").hide();
        }
    });
});

function handleCountryClick() {
    $("#js-country-list").on("click", 'li', function () {
        $("#country").empty()
        $("#country").val($(this).text())
    })
}

//filter the content of the country list bast on current user input
function handleFilter() {
    $("#country").keyup(function () {
        let input = $('#country').val()
        $(`#js-country-list`).empty().append(filter(input))
    });
}


function handleCountries() {
    $('#js-country-list').hide();
    $('#country').click(function () {
        $("#js-country-list").show();
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
    $('#js-results').show();
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
    $('#js-results').show();
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
        .then(responseJson => {
            if (responseJson.news.length === 0) {
                $('#js-no-news-message').show();
            }
            else {
                displayNewsResults(responseJson)
            }
        })
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

$("#country").on("input", function () {
    let country = getId($("#country").val())
    if ($("#country").val()) {
        if (country == "anError") {
            $('.invalid-country').text('Invalid Country')
        } else {
            $('.invalid-country').text('Country')
        }
    } else {
        $('.invalid-country').text('Country')
    }
})

function handleSubmit() {
    $('form').submit(function (event) {
        $('#js-no-news-message').hide();
        event.preventDefault();
        hideError()
        $('#js-hide').show();
        let city = $('#city').val();
        let state = $('#state').val();
        let country = getId($("#country").val())
        let cityState = combine(city, state);
        handleGetting(cityState, country);
    });
};

function hideElements() {
    $('#js-invalid-country').hide()
    $('#js-results').hide();
    $('#js-no-news-message').hide();
    $("#js-weather-header").hide()
}


function handleExploreApp() {
    hideElements()

    //set country list to hidden by default
    handleCountries()
    hideError()
    handleSubmit();
    handleUnitButtons();
};

$(handleExploreApp);