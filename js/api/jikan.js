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