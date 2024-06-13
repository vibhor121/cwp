"use strict";

import { genreAPI, fetchDataFromServer } from "./api.js";

export function sidebar() {
  const genreList = {};

  fetchDataFromServer(`${genreAPI}`, function ({ genres }) {
    // if (!genres) {
    //   console.error("No genres found in the API response.");
    //   return;
    // }

    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    genreLink();
  });

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>
    </div>

    <div class="sidebar-list">
      <p class="title">Language</p>

      <a href="./movie-list.html" menu-close class="sidebar-link">English</a>
      <a href="./movie-list.html" menu-close class="sidebar-link">Hindi</a>
      <a href="./movie-list.html" menu-close class="sidebar-link">Bengali</a>
    </div>

    <div class="sidebar-footer">
      <p class="copyright">Copyright 2024 <a href="#">Masai Movies</a></p>
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      // link.setAttribute("onclick", `getMovieList("with_genres=${genreId})", "${genreName}"`);

      link.textContent = genreName;
      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    // if (!sidebar) {
    //   console.error("Sidebar element not found.");
    //   return;
    // }
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    // if (!sidebarBtn || !overlay) {
    //   console.error("Sidebar button or overlay not found.");
    //   return;
    // }

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };

  const addEventOnElements = function (elements, eventType, callback) {
    for (const element of elements) {
      element.addEventListener(eventType, callback);
    }
  };
}
