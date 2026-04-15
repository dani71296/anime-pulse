const BASE_URL = "https://api.jikan.moe/v4";


export async function getTopAnime() {
    try {
        const response = await fetch(`${BASE_URL}/top/anime`);
        const data = await response.json();

        return data.data; 
    } catch (error) {
        console.error("Error fetching anime:", error);
    }
}
export async function getAnimeNews() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/anime/5114/news");
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data || [];

    } catch (error) {
        if (error.message.includes("504")) {
            console.error("La API de Jikan está saturada (504).");
        } else {
            console.error("Error al obtener noticias:", error);
        }
        throw error;
    }
}