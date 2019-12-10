'use strict'

function returnSearch() {
    $('#return').click(function (event) {
        event.preventDefault();

        $('.results').hide();
        renderSearchScreen();
    })
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
        <h3>Day: ${[i + 1]}</h3>
        <img src="weather-icons/${responseJson.data[i].weather.icon}.png" alt="An img depicting the weather">
        <p>${responseJson.data[i].high_temp}°/${responseJson.data[i].low_temp}°</p>
        <p>${responseJson.data[i].weather.description}</p>
        </div>`);
    }
};



function displayNewsResults(responseJson) {
    for (let i = 0; i < responseJson.articles.length; i++) {
        $('#js-news-results-list').append(`
    <li>
    <a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a>
    <p>Source name: ${responseJson.articles[i].source.name}</p>
    </li>`)
    }
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

    console.log(url)
    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayWeatherResults(responseJson, unitType))
        .catch(err => alert(`error:` + err))
};

let newsBaseUrl = 'https://newsapi.org/v2/'
let newsApiKey = '832ecf1cdf9741c19ffe553820ed8d60';

function getNews(searchType, queryString){
    let url = newsBaseUrl + searchType + '?' + queryString;
    console.log(url)

    let options = {
        headers: new Headers({
            "X-Api-Key": newsApiKey
        })
    };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => alert(`error:` + err));
}

function buildNewsQueryUrl(formatedQuery) {
    let params = {
        q: formatedQuery,
        page: 1
    }

    let searchType = 'everything';
    let queryString = formatQueryParams(params);
    getNews(searchType, queryString)
}

function buildNewsCountryUrl(countryInput) {
    let params = {
        country: countryInput
    }

    let searchType = 'top-headlines';
    let queryString = formatQueryParams(params);
    getNews(searchType, queryString)
    
}

function handleGettingNews(country, formatedQuery) {
    $('#js-news-results-list').empty();
    buildNewsQueryUrl(formatedQuery);
    buildNewsCountryUrl(country);
};

function handleGetting(cityState, country, formatedQuery) {
    if ($('#news').is(':checked')) {
        handleGettingNews(country, formatedQuery);
        $('#js-news-results').show();
        $('#js-weather-results').hide();
    }
    else if ($('#weather').is(':checked')){
        getWeather(cityState, "I");
        getWeather(cityState, "M");
        $('#js-weather-results').show();
        $('#js-news-results').hide();
    }
    else {
        handleGettingNews(country, formatedQuery);
        getWeather(cityState, "I");
        getWeather(cityState, "M");
        $('#js-weather-results').show();
        $('#js-news-results').show();
    }
};

function renderResultsScreen(state) {
    $('.search').hide();
    $('.results').show();
};

function formatParamsUri(params) {
    const queryItems = encodeURIComponent(params);
    console.log(queryItems);
    return queryItems;
}

function combine(city, state) {
    let formatedCity = city.split(' ');
    formatedCity = formatedCity.join('+');
    formatedCity = formatedCity + ',' + state;
    return formatedCity
}

function handleSubmit() {
    $('form').submit(function (event) {
        event.preventDefault();
        let city = $('#city').val();
        let state = $('#state').val();
        let country = $('option:selected').val();
        let cityState = combine(city, state);
        let newsCityState = `"` + city + `"` + ` AND ` + `"` + state + `"`;
        let formatedQuery = formatParamsUri(newsCityState);
        handleGetting(cityState, country, formatedQuery);
        renderResultsScreen();
    });
};

function renderSearchScreen() {
    $('.results').hide();
    $('.search').show();
    handleSubmit();
};

function handleExploreApp() {
    renderSearchScreen();
    returnSearch();
    handleUnitButtons();
};

$(handleExploreApp);