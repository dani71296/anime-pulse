// Obtener todos los favoritos
export function getFavorites() {
    try {
        const data = localStorage.getItem("favorites");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error al leer favoritos:", error);
        return [];
    }
}


export function saveFavorites(favorites) {
    try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
        console.error("Error al guardar favoritos:", error);
    }
}


export function isFavorite(animeId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.mal_id === animeId);
}


export function addFavorite(anime) {
    const favorites = getFavorites();

   s
    const exists = favorites.some(fav => fav.mal_id === anime.mal_id);
    if (exists) return favorites;

    const newFavorite = {
        mal_id: anime.mal_id,
        title: anime.title,
        image: anime.images?.jpg?.image_url || ""
    };

    const updated = [...favorites, newFavorite];
    saveFavorites(updated);
    return updated;
}

export function removeFavorite(animeId) {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => fav.mal_id !== animeId);
    saveFavorites(updated);
    return updated;
}


export function toggleFavorite(anime) {
    const favorites = getFavorites();

    const exists = favorites.some(fav => fav.mal_id === anime.mal_id);

    let updated;

    if (exists) {
        updated = favorites.filter(fav => fav.mal_id !== anime.mal_id);
    } else {
        const newFavorite = {
            mal_id: anime.mal_id,
            title: anime.title,
            image: anime.images?.jpg?.image_url || ""
        };
        updated = [...favorites, newFavorite];
    }

    saveFavorites(updated);
    return updated;
}

export function clearFavorites() {
    localStorage.removeItem("favorites");
}