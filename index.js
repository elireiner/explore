'use strict'
let keepTrack = [];

function getWeather(){

};

function getNews(){

};

function displayResults(){

};

function renderResultsScreen() {

};

function handleSubmit() {

};

function handleSearchButtons(){
    $('#news').click(function(){
        keepTrack.push('news');
    });
    $('#weather').click(function(){
        keepTrack.push('weather');
    });
    $('#both').click(function(){
        keepTrack.push('both');
    });
};

function renderSearchScreen() {
    $('.search').toggleClass('hidden');
};

function handleHomeButton() {
    $('.home').on('click', '#explore-Button', function(){
        $('.home').toggleClass('hidden');
        renderSearchScreen();
    });
};

function handleExploreApp() {
    handleHomeButton();
    handleSearchButtons();
};

$(handleExploreApp);