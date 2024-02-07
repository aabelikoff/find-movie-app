const form = document.forms["movieForm"];
const movies = document.querySelector(".movies");
const details = document.querySelector(".details");
const searchInfo = document.querySelector("#moviesCount");
const container = document.querySelector(".container");

const showMovies = new ShowMovies(container, form, movies, details, searchInfo, 2);
