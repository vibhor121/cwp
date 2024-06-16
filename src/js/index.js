"use strict";

// import

import { sidebar } from "./sidebar.js";
import { genreAPI, popularAPI, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

let loginBtn = document.querySelector("#loginBtn");
let userprofileIcon = document.querySelector("#userprofileIcon");

let userId = localStorage.getItem("userId");

sidebar();

// Home page sections

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "upcoming.json",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending.json",
  },
  {
    title: "Top Rated Movies",
    path: "/top_rated.json",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); //
      this == genreList;
    }

    return newGenreList.join(", ");
  },
};

fetchDataFromServer(`${genreAPI}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(`${popularAPI}`, heroBanner);
});

// fetchDataFromServer(
//   `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
//   heroBanner
// );

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />

      <div class="banner-content">
        <h2 class="heading-">${title}</h2>

        <div class="meta-list">
          <div class="meta-item">${release_date}</div>

          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>

        <p class="genre">${genreList.asString(genre_ids)}</p>

        <p class="banner-text">
          ${overview}
        </p>

        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img
            src="./src/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />

          <span class="span">Watch Now</span>
        </a>
      </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${poster_path}"
        alt="${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;

    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();

  // fetching data for the home page sections (top rated, upcoming, trending)

  //BUG FIX
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://sahilz9.github.io/CW-API/${path}`,
      createMovieList,
      title
    );
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");

  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // `this` == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");

  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
  <div class="title-wrapper">
          <h3 class="title-large">${title}</h3>
        </div>
  
        <div class="slider-list">
          <div class="slider-inner">
          </div>
        </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

if (userId) {
  userprofileIcon.innerHTML = `<img
  src="https://media.licdn.com/dms/image/C4D03AQFA9zzNa2zOsg/profile-displayphoto-shrink_200_200/0/1644760685717?e=1723680000&v=beta&t=qzO69q_9jgQ8TH2N-Wa4eGmgOVvc-Iqx2h6llR_clBw"
  class="profile-logo"
  alt=""
/>`;

  loginBtn.style.display = "none";
} else {
  userprofileIcon.innerHTML = "";
}

loginBtn.addEventListener("click", () => {
  window.location.href = "vibhorlogin.html";
});

userprofileIcon.addEventListener("click", () => {
  window.location.href = "syedProfile.html";
});
