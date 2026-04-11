// ==============================
// 📦 IMPORTS
// ==============================
import { getTopAnime } from "./api/jikan.js";
import AnimeCard from "./components/AnimeCard.js";
import { showDetails } from "./views/DetailsView.js";
import { toggleFavorite, getFavorites } from "./utils/favorites.js";
import { getAnimeNews } from "./api/jikan.js";


// ==============================
// 📍 DOM ELEMENTS
// ==============================
const container = document.getElementById("animeContainer");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");

const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const sortFilter = document.getElementById("sortFilter");

const navHome = document.getElementById("homeBtn");
const navFavorites = document.getElementById("favoritesBtn");
const navNews = document.getElementById("newsBtn");


// ==============================
// 🧠 GLOBAL STATE
// ==============================
let allAnime = [];


// ==============================
// ❌ MODAL CLOSE
// ==============================
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// ==============================
// 🎴 RENDER ANIME LIST (REUTILIZABLE)
// ==============================
function renderAnimeList(list) {
    container.innerHTML = "";

    list.forEach(anime => {
        const cardHTML = AnimeCard(anime);

        const temp = document.createElement("div");
        temp.innerHTML = cardHTML;

        const cardElement = temp.firstElementChild;

        // 👉 abrir modal
        cardElement.addEventListener("click", () => {
            showDetails(anime);
        });

        // 👉 botón favorito
        const favBtn = cardElement.querySelector(".favorite-btn");

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const updated = toggleFavorite(anime);
            const exists = updated.some(fav => fav.mal_id === anime.mal_id);

            favBtn.textContent = exists ? "❤️" : "🤍";
        });

        container.appendChild(cardElement);
    });
}


// ==============================
// 🎭 GENERAR FILTROS DE GÉNERO
// ==============================
function populateGenres(animeList) {
    const genresSet = new Set();

    animeList.forEach(anime => {
        anime.genres.forEach(g => genresSet.add(g.name));
    });

    genreFilter.innerHTML = `<option value="">All Genres</option>`;

    genresSet.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
}


// ==============================
// 🔍 FILTROS + SEARCH + SORT
// ==============================
function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const selectedSort = sortFilter.value;

    let filtered = [...allAnime];

    // 🔍 SEARCH
    if (query) {
        filtered = filtered.filter(anime =>
            anime.title.toLowerCase().includes(query)
        );
    }

    // 🎭 FILTRO POR GÉNERO
    if (selectedGenre) {
        filtered = filtered.filter(anime =>
            anime.genres.some(g => g.name === selectedGenre)
        );
    }

    // 🔃 ORDENAR
    if (selectedSort === "top") {
        filtered.sort((a, b) => b.score - a.score);
    }

    if (selectedSort === "popular") {
        filtered.sort((a, b) => b.members - a.members);
    }

    renderAnimeList(filtered);
}


// ==============================
// ❤️ FAVORITES VIEW
// ==============================
function showFavorites() {
    const favorites = getFavorites();

    container.innerHTML = "";

    favorites.forEach(anime => {
        const cardHTML = AnimeCard({
            ...anime,
            images: {
                jpg: { image_url: anime.image }
            }
        });

        const temp = document.createElement("div");
        temp.innerHTML = cardHTML;

        const cardElement = temp.firstElementChild;

        container.appendChild(cardElement);
    });
}


// ==============================
// 📰 NEWS VIEW
// ==============================
function renderNews(newsList) {
    const newsContainer = document.getElementById("newsContainer");

    newsContainer.innerHTML = newsList.map(news => `
        <div class="news-card">
            <h3>${news.title}</h3>
            <p>${news.excerpt}</p>
            <a href="${news.url}" target="_blank">Leer más</a>
        </div>
    `).join("");
}

async function showNews() {
    const animeContainer = document.getElementById("animeContainer");
    const newsContainer = document.getElementById("newsContainer");

    animeContainer.classList.add("hidden");
    newsContainer.classList.remove("hidden");

    newsContainer.innerHTML = "<p>Loading...</p>";

    const news = await getAnimeNews();
    renderNews(news);
}


// ==============================
// 🧭 NAVIGATION
// ==============================
navHome.addEventListener("click", () => {
    const animeContainer = document.getElementById("animeContainer");
    const newsContainer = document.getElementById("newsContainer");

    newsContainer.classList.add("hidden");
    animeContainer.classList.remove("hidden");

    init();
});

navFavorites.addEventListener("click", () => {
    const animeContainer = document.getElementById("animeContainer");
    const newsContainer = document.getElementById("newsContainer");

    newsContainer.classList.add("hidden");
    animeContainer.classList.remove("hidden");

    showFavorites();
});

navNews.addEventListener("click", showNews);


// ==============================
// 🌙 DARK MODE
// ==============================
function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

themeToggle.addEventListener("click", toggleTheme);

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }
}


// ==============================
// 🚀 INIT APP
// ==============================
async function init() {
    allAnime = await getTopAnime();

    populateGenres(allAnime); // 👉 llena dropdown de géneros
    renderAnimeList(allAnime);
}

// eventos de filtros
searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

// inicializar app
loadTheme();
init();