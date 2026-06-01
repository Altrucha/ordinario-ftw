document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar();
    cargarGenerosCategorias();
    cargarEstadisticas();
});
function cargarGenerosCategorias() {
    const contenedor = document.getElementById("generos-grid");
    const generos = biblioteca.obtenerGeneros();
    if (!generos || generos.length === 0) {
        contenedor.innerHTML =
            '<p class="text-muted">No hay géneros disponibles.</p>';
        return;
    }
    const clases = ["", "alt1", "alt2", "alt3"];
    contenedor.innerHTML = generos
        .map((genero, indice) => {
            const totalLibros = biblioteca.obtenerLibrosPorGenero(
                genero.id,
            ).length;
            return `
            <a href="catalogo.html?genero=${genero.id}" class="categoria-tarjeta ${clases[indice % clases.length]}">
                <h3>${genero.nombre}</h3>
                <p>${totalLibros} libro${totalLibros !== 1 ? "s" : ""}</p>
            </a>
        `;
        })
        .join("");
}
function cargarEstadisticas() {
    document.getElementById("totalLibros").textContent =
        biblioteca.obtenerLibros().length;
    document.getElementById("totalAutores").textContent =
        biblioteca.obtenerAutores().length;
    document.getElementById("totalGeneros").textContent =
        biblioteca.obtenerGeneros().length;
    document.getElementById("totalEditoriales").textContent =
        biblioteca.obtenerEditoriales().length;
}
