'use strict'

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

};

function renderSearchScreen() {

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