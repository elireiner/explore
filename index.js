'use strict'

let keepTrack = [];

function displayResults(responseJson) {
    $('#js-weather-results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
        $('#js-weather-results-list').append(`
        <li>
        <h3>Day: ${[i + 1]}</h3>
        <p>${responseJson.data[i].temp}</p>
        </li>`);
    }
};

function getWeather(state) {
    let baseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'
    let queryString = 'key=5ae81936c8514eacb8ef228b49c7eaa4&units=I&city=New+York,NY'
    let url = baseUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(err => alert(`error:` + err))
};

function getNews(state) {
  
};

function handleGetting(state) {
    if (keepTrack[0] === 'news') {
        getNews(state);
    }
    else if (keepTrack[0] === 'weather') {
        getWeather(state);
    }
    else {
        getNews(state);
        getWeather(state);
    }
};

function renderResultsScreen(state) {
    $('.search').toggleClass('hidden');
    $('.results').toggleClass('hidden');
};

function handleSubmit() {
    $('.search').submit(function (event) {
        event.preventDefault();
        let enteredState = $('input[type="text"]').val();
        renderResultsScreen();
        handleGetting(enteredState);
    });
};

function renderForm() {
    $('#news').toggleClass('hidden');
    $('#weather').toggleClass('hidden');
    $('#both').toggleClass('hidden');
    $('.form').toggleClass('hidden');
};

function handleSearchButtons() {
    $('#news').click(function () {
        keepTrack.push('news');
        renderForm();
    });
    $('#weather').click(function () {
        keepTrack.push('weather');
        renderForm();
    });
    $('#both').click(function () {
        keepTrack.push('both');
        renderForm();
    });

};

function renderSearchScreen() {
    $('.search').toggleClass('hidden');
    handleSearchButtons();
    handleSubmit();
};

function handleHomeButton() {
    $('.home').on('click', '#explore-Button', function () {
        $('.home').toggleClass('hidden');
        renderSearchScreen();
    });
};

function handleExploreApp() {
    handleHomeButton();
};

$(handleExploreApp);