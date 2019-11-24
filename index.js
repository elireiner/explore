'use strict'
let keepTrack = [];

function getWeather(state) {

};

function getNews(state) {

};

function displayResults() {

};


function handleGetting(state) {
    
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