'use strict'

let keepTrack = [];

function displayWeatherResults(responseJson) {
    $('#js-weather-results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
        $('#js-weather-results-list').append(`
        <li>
        <h3>Day: ${[i + 1]}</h3>
        <p>${responseJson.data[i].temp}</p>
        </li>`);
    }
};

function displayNewsResults(responseJson) {
   $('#js-news-results-list').empty();
   for (let i = 0; i < responseJson.articles.length; i++){
    $('#js-news-results-list').append(`
    <li>
    <h3></h3>
    <a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a>
    <p>Sorce name: ${responseJson.articles[i].source.name}</p>
    </li>`)
   }
};

function getWeather(cityState) {
    let baseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'
    let queryString = `key=5ae81936c8514eacb8ef228b49c7eaa4&units=I&city=${cityState}`;
    let url = baseUrl + queryString;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayWeatherResults(responseJson))
    .catch(err => alert(`error:` + err))
};

function getNews(country) {
    let baseUrl = 'https://newsapi.org/v2/top-headlines?';
    let queryString = `country=${country}&apiKey=832ecf1cdf9741c19ffe553820ed8d60`;
    let url = baseUrl + queryString;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayNewsResults(responseJson))
    .catch(err => alert(`error:` + err))
};

function handleGetting(cityState, country) {
    if (keepTrack[0] === 'news') {
        getNews(country);
    }
    else if (keepTrack[0] === 'weather') {
        getWeather(cityState);
    }
    else {
        getNews(country);
        getWeather(cityState);
    }
};

function renderResultsScreen(state) {
    $('.search').toggleClass('hidden');
    $('.results').toggleClass('hidden');
};

function combine(city, state){
    let formatedCity = city.split(' ');
    formatedCity = formatedCity.join('+');
    formatedCity = formatedCity + ',' + state;
    return formatedCity
}

function handleSubmit() {
    $('.search').submit(function (event) {
        event.preventDefault();
        let city = $('#city').val();
        let state = $('#state').val();
        let country = $('#country').val();
        let cityState = combine(city ,state);
        renderResultsScreen();
        handleGetting(cityState, country);
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