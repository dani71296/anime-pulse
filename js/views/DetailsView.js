export function showDetails(anime) {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `
    <h2>${anime.title}</h2>
    <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
    <p>${anime.synopsis || "No description available"}</p>
  `;

    modal.classList.remove("hidden");
}