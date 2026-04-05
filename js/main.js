import { getTopAnime } from "./api/jikan.js";
import AnimeCard from "./components/AnimeCard.js";
import { showDetails } from "./views/DetailsView.js";
import { toggleFavorite, getFavorites } from "./utils/favorites.js"; 

const container = document.getElementById("animeContainer");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");



// Navbar
const navHome = document.getElementById("homeBtn");
const navFavorites = document.getElementById("favoritesBtn");

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

async function init() {
    const animeList = await getTopAnime();

    container.innerHTML = "";

    animeList.forEach(anime => {
        const cardHTML = AnimeCard(anime);

        const temp = document.createElement("div");
        temp.innerHTML = cardHTML;

        const cardElement = temp.firstElementChild;

        // 👇 1. CLICK EN LA CARD (MODAL)
        cardElement.addEventListener("click", () => {
            showDetails(anime);
        });

        // 👇 2. BOTÓN DE FAVORITO (IMPORTANTE)
        const favBtn = cardElement.querySelector(".favorite-btn");

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 🚨 evita que abra el modal

            const updated = toggleFavorite(anime);

            const exists = updated.some(fav => fav.mal_id === anime.mal_id);

            // actualizar icono
            favBtn.textContent = exists ? "❤️" : "🤍";
        });

        container.appendChild(cardElement);
    });
}

init();
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
navHome.addEventListener("click", () => {
    init();
});

navFavorites.addEventListener("click", () => {
    showFavorites();
});