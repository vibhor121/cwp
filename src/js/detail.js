"use strict";

import {
  genreAPI,
  moviesAPI,
  upcomingAPI,
  fetchDataFromServer,
  movieDetailsAPI,
} from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

const movieId = window.localStorage.getItem("movieId");

async function getData() {
  let response = await fetch(`${movieDetailsAPI}`);
  let data = await response.json();

  console.log(data);

  showData(data);
}

getData();

const pageContent = document.querySelector("[page-content]");

sidebar();

let showData = (data) => {
  data.forEach((ele) => {
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
      <div
        class="backdrop-image"
        style="background-image: url('${ele.backdrop_path || ele.poster_path}')"
      ></div>

      <figure class="poster-box movie-poster">
        <img src="${ele.poster_path}" alt="${
      ele.title
    } poster" class="img-cover" />
      </figure>

      <div class="detail-box">

        <div class="detail-content">
          <h1 class="heading">${ele.title}</h1>
          <button id="seatBookingBtn">Book Movie</button>

          <div class="meta-list">
            <div class="meta-item">
              <img
                src="./src/images/star.png"
                width="20"
                height="20"
                alt="rating"
              />
              <span class="span">${ele.vote_average.toFixed(1)}</span>
            </div>
            <div class="seperator"></div>
            <div class="meta-item">${ele.release_date}</div>
          </div>

          <p class="genre">${getGenres(ele.genres)}</p>

          <p class="overview">${ele.overview}</p>

          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCastNames(ele.casts)}</p>
            </div>
          </ul>
        </div>

        <div class="title-wrapper">
          <h3 class="title-large">Trailer and Clips</h3>
        </div>

        <div class="slider-list">
          <div class="slider-inner">
            <!-- Videos will be appended here -->
          </div>
        </div>

      </div>
    `;

    // Function to filter and return video results
    function filterVideos(videos) {
      return videos.results.filter((video) => video.site === "YouTube");
    }

    const sliderInner = movieDetail.querySelector(".slider-inner");

    for (const { key, name } of filterVideos(ele.videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0"
        allowfullscreen="1" title="${name}"
        class="img-cover" loading="lazy"></iframe>
      `;
      sliderInner.appendChild(videoCard);
    }

    const pageContent = document.querySelector("[page-content]");
    pageContent.appendChild(movieDetail);
  });
};

function getCastNames(casts) {
  if (!casts || !Array.isArray(casts.cast)) {
    console.error("Invalid casts object");
    return [];
  }

  const castNames = casts.cast.map((castMember) => castMember.name);

  return castNames.join(", ");
}

seatBookingBtn.addEventListener("click", () => {
  window.location.href = "pavan.html";
});

function getGenres(genres) {
  if (!Array.isArray(genres)) {
    console.error("Expected an array of genres");
    return [];
  }

  const genreNames = genres.map((genre) => genre.name);

  return genreNames.join(", ");
}

// const getGenres = function (genreList) {
//   const newGenreList = [];
//   for (const { name } of genreList) newGenreList.push(name);

//   return newGenreList.join(", ");
// };

// const getCasts = function (castList) {
//   const newCastList = [];
//   for (let i = 0, len = castList.length; i < len && i < 10; i++) {
//     const { name } = castList[i];
//     newCastList.push(name);
//   }

//   return newCastList.join(", ");
// };

// const getDirectors = function (crewList) {
//   const directors = crewList.filter(({ job }) => job === "Director");

//   const directorList = [];
//   for (const { name } of directors) directorList.push(name);

//   return directorList.join(", ");
// };

// const filterVideos = function (videoList) {
//   return videoList.filter(
//     ({ type, site }) =>
//       (type === "Trailer" || type === "Teaser") && site === "YouTube"
//   );
// };

// fetchDataFromServer(`${movieDetailsAPI}`, function (movie) {
//   const {
//     backdrop_path,
//     poster_path,
//     title,
//     release_date,
//     runtime,
//     vote_average,
//     releases: {
//       countries: [{ certification }],
//     },
//     genres,
//     overview
//   } = movie;

//   document.title = `${title} - Masai`;

//   const movieDetail = document.createElement("div");
//   movieDetail.classList.add("movie-detail");
//   movieDetail.innerHTML = `
//   <div
//           class="backdrop-image"
//           style="background-image: url('${backdrop_path || poster_path}')"
//         ></div>

//         <figure class="poster-box movie-poster">
//           <img src="${poster_path}" alt="${title} poster" class="img-cover" />
//         </figure>

//         <div class="detail-box">

//           <div class="detail-content">
//             <h1 class="heading">${title}</h1>
//             <button id="seatBookingBtn">Book Movie</button>

//             <div class="meta-list">
//               <div class="meta-item">
//                 <img
//                   src="./src/images/star.png"
//                   width="20"
//                   height="20"
//                   alt="rating"
//                 />

//                 <span class="span">${vote_average.toFixed(1)}</span>
//               </div>

//               <div class="seperator"></div>

//               <div class="meta-item">${runtime}m</div>

//               <div class="seperator"></div>

//               <div class="meta-item">${release_date}</div>

//             </div>

//             <p class="genre">${genres}</p>

//             <p class="overview">
//               ${overview}
//             </p>

//             <ul class="detail-list">
//               <div class="list-item">
//                 <p class="list-name">Starring</p>

//                 <p>
//                  ${cast}
//                 </p>
//               </div>

//               <div class="list-item">
//                 <p class="list-name">Directed By</p>

//                 <p>${crew}</p>
//               </div>
//             </ul>

//           </div>

//           <div class="title-wrapper">
//             <h3 class="title-large">Trailer and Clips</h3>
//           </div>

//           <div class="slider-list">
//             <div class="slider-inner"></div>
//           </div>

//         </div>
//   `;

//   for (const { key, name } of filterVideos(videos)) {
//     const videoCard = document.createElement("div");
//     videoCard.classList.add("video-card");
//     videoCard.innerHTML = `
//       <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0"
//       allowfullscreen="1" title="${name}"
//       class="img-cover" loading = "lazy"></iframe>
//     `;

//     movieDetail.querySelector(".slider-inner").appendChild(videoCard);
//   }

//   pageContent.appendChild(movieDetail);
// });
