import { toggleFavorite, getFavorites } from "../utils/favorites.js";

export default function AnimeCard(anime) {
  const favorites = getFavorites();
  const isFavorite = favorites.some(fav => fav.mal_id === anime.mal_id);

  return `
    <article class="card">
      <img src="${anime.images?.jpg?.image_url || anime.image}" alt="${anime.title}" />
      <h3>${anime.title}</h3>

      <button class="favorite-btn" data-id="${anime.mal_id}">
        ${isFavorite ? "❤️" : "🤍"}
      </button>
    </article>
  `;
}