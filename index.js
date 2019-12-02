'use strict'

function returnSearch() {
    $('#return').click(function (event) {
        event.preventDefault();

        $('.results').hide();
        renderSearchScreen();
    })
}

function displayWeatherResults(responseJson) {
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#js-weather-results-list').append(`
        <div class="weather-data">
        <h4>Day: ${[i + 1]}</h3>
        <img src="weather-icons/${responseJson.data[i].weather.icon}.png" alt="An img depicting the weather">
        <p>${responseJson.data[i].high_temp}°/${responseJson.data[i].low_temp}°</p>
        <p>${responseJson.data[i].weather.description}</p>
        </div>`);
    }
};

function displayNewsResults(responseJson) {
    for (let i = 0; i < responseJson.articles.length; i++) {
        $('#js-news-results-list').append(`
    <div>
    <a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a>
    <p>Source name: ${responseJson.articles[i].source.name}</p>
    </div>`)
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


function getNewsQuery(formatedQuery) {
    let baseUrl = 'https://newsapi.org/v2/everything?';
    let queryString = `q=${formatedQuery}&page=1&apiKey=832ecf1cdf9741c19ffe553820ed8d60`
    let url = baseUrl + queryString;
    console.log(url)
    fetch(url)
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

function getNewsCountry(country) {
    let baseUrl = 'https://newsapi.org/v2/top-headlines?';
    let queryString = `country=${country}&apiKey=832ecf1cdf9741c19ffe553820ed8d60`;
    let url = baseUrl + queryString;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => alert(`error:` + err))
}

function getNews(country, formatedQuery) {
    $('#js-news-results-list').empty();
    getNewsQuery(formatedQuery);
    getNewsCountry(country);
};

function handleGetting(cityState, country, formatedQuery) {
    if ($('#news').is(':checked')) {
        getNews(country, formatedQuery);
        $('#js-news-results').show();
        $('#js-weather-results').hide();
    }
    else if ($('#weather').is(':checked')) {
        getWeather(cityState);
        $('#js-weather-results').show();
        $('#js-news-results').hide();
    }
    else {
        getNews(country, formatedQuery);
        getWeather(cityState);
        $('#js-weather-results').show();
        $('#js-news-results').show();
    }
};

function renderResultsScreen(state) {
    $('.search').hide();
    $('.results').show();
};

function formatQueryParams(params) {
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
        console.log(newsCityState);
        let formatedQuery = formatQueryParams(newsCityState);
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
};

$(handleExploreApp);