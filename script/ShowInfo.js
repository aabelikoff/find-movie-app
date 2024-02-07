class ShowMovies {
  constructor(container, form, moviesElem, detailsElem, searchInfoElem, countFilms) {
    this.form = form;
    this.moviesElem = moviesElem;
    this.detailsElem = detailsElem;
    this.searchInfoElem = searchInfoElem;
    this.countFilms = countFilms;
    this.moviesArray = [];
    this.totalResults = null;
    this.page = 1;
    this.pagObj = new Pagination(container, 5, 2);
    this.spinner = new Spinner();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.resetData();
      this.findMovies();
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.dataset.btnIndex) {
        let btnIndex = target.dataset.btnIndex;
        this.showPart(btnIndex);
      }
      if (target.dataset.move) {
        switch (target.dataset.move) {
          case "left":
            if (this.page != 1) {
              this.page--;
            }
            break;
          case "right":
            if (this.page < Math.ceil(this.totalResults / 10)) {
              this.page++;
            }
            break;
          default:
            break;
        }
        this.findMovies();
      }
      if (target.dataset.movieId) {
        this.findMovieDetails(target.dataset.movieId);
      }
    });
  }

  resetData() {
    this.moviesElem.innerHTML = this.detailsElem.innerHTML = this.searchInfoElem.innerHTML = "";
    this.moviesArray = [];
    this.totalResults = null;
    this.page = 1;
    this.pagObj.resetPagination();
  }

  clearMoviesElement() {
    this.moviesElem.innerHTML = "";
    this.pagObj.clearPaginationElem(false);
  }

  createMovieBrief({ Poster, Type, Title, Year, imdbID }) {
    const movieElem = document.createElement("div");
    movieElem.classList.add("movieItem");
    const htmlTemplate = `
    <div class='posterContainer'>
    </div>
    <div class = 'movieInfoContainer'>
        <p class='movieType'>${Type}</p>
        <h2 class='movieTitle'>${Title}</h2>
        <p class='movieYear'>${Year}</p>
        <button class='btn' data-movie-id='${imdbID}'> Details</button>
    </div>
    `;
    if (Poster != "N/A") {
      const img = document.createElement("img");
      img.src = Poster;
      img.alt = `${Title} poster`;
      img.classList.add("poster");
      img.onload = () => {
        movieElem.innerHTML = htmlTemplate;
        const posterContainerElem = movieElem.querySelector(".posterContainer");
        posterContainerElem.append(img);
      };
    } else {
      movieElem.innerHTML = htmlTemplate;
    }
    return movieElem;
  }

  generateSearchParams() {
    let formData = new FormData(this.form);
    let params = {};
    formData.forEach((val, key) => {
      params[key] = val;
    });
    params.page = this.page;
    return params;
  }

  findMovies() {
    this.clearMoviesElement();
    let params = this.generateSearchParams();
    try {
      this.spinner.showSpinner();
      sendRequest(
        movieUrl,
        ({ Search: moviesArr, totalResults, Response }) => {
          if (Response == "False") {
            this.showSearchInfo("There weren't found any movies");
            this.spinner.hideSpinner();
            return;
          }
          this.moviesArray = moviesArr;
          this.totalResults = +totalResults;
          this.showSearchInfo(this.totalResults);
          this.showPart(1);
          this.pagObj.setMaxCount(+totalResults);
          this.pagObj.createPaginationElem();
          this.spinner.hideSpinner();
        },
        params
      );
    } catch (error) {
      this.showSearchInfo(error);
      this.spinner.hideSpinner();
    }
  }

  findMovieDetails(movieId) {
    let params = { i: movieId };
    this.spinner.showSpinner();
    sendRequest(
      movieUrl,
      (movieObj) => {
        this.showDetails(movieObj);
        this.spinner.hideSpinner();
      },
      params
    );
  }

  showDetails({ Poster, Title, Released, Genre, Country, Director, Writer, Actors, Awards }) {
    let htmlTemplate = `
    <h2 class="title">Film info:</h2>
    <div class="detailsInfoBlock">
      <div class="bigPosterContainer">
      </div>
      <div class="detailItemsContainer">
        <div class="detailItem">
          <p class="detailTitle">Title:</p>
          <p class="detailInfo">${Title}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Released:</p>
          <p class="detailInfo">${Released}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Genre:</p>
          <p class="detailInfo">${Genre}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Country:</p>
          <p class="detailInfo">${Country}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Director:</p>
          <p class="detailInfo">${Director}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Writer:</p>
          <p class="detailInfo">${Writer}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Actors:</p>
          <p class="detailInfo">${Actors}</div>
          </p>
        <div class="detailItem">
          <p class="detailTitle">Awards:</p>
          <p class="detailInfo">${Awards}</div>
          </p>
      </div>
    </div>
    `;
    if (Poster != "N/A") {
      const img = document.createElement("img");
      img.src = Poster;
      img.alt = `${Title} large poster`;
      img.classList.add("poster");
      img.onload = () => {
        this.detailsElem.innerHTML = htmlTemplate;
        const posterContainerElem = this.detailsElem.querySelector(".bigPosterContainer");
        posterContainerElem.append(img);
      };
    } else {
      this.detailsElem.innerHTML = htmlTemplate;
    }
  }

  showSearchInfo(param) {
    const moviesCountElem = document.querySelector("#moviesCount");
    let text = ``;
    if (param instanceof Error) {
      text = `${param.name}: ${param.message}`;
    } else if (typeof param == "string") {
      text = param;
    } else {
      text = `${this.totalResults} films: `;
    }

    moviesCountElem.innerText = text;
  }

  showPart(btnIndex) {
    this.moviesElem.innerHTML = "";
    btnIndex %= 5;
    if (!btnIndex) {
      btnIndex = 5;
    }
    let end = btnIndex * this.countFilms;
    let start = end - this.countFilms;
    let part = this.moviesArray.slice(start, end);
    part.forEach((movie) => {
      let movieBrief = this.createMovieBrief(movie);
      this.moviesElem.append(movieBrief);
    });
  }
}
