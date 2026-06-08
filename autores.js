document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar_carga();
    cargarAutores();
});

function cargarAutores() {
    const grid = document.getElementById("autores-grid");
    const autores = biblioteca.obtenerAutores();

    if (!autores || autores.length === 0) {
        grid.innerHTML =
            '<div class="autores-vacio">No hay autores disponibles en este momento.</div>';
        return;
    }

    grid.innerHTML = autores
        .map((autor) => {
            const librosDelAutor = biblioteca.obtenerLibrosPorAutor(
                autor.id,
            ).length;
            return `
                <article class="autor-tarjeta_interactiva">
                    <h3 class="autor-tarjeta_interactiva-nombre">${autor.nombre}</h3>
                    <p class="autor-tarjeta_interactiva-libros">${librosDelAutor} libro${
                        librosDelAutor !== 1 ? "s" : ""
                    }</p>
                    <div class="autor-tarjeta_interactiva_acciones">
                        <a
                            href="catalogo.html?autor=${autor.id}"
                            class="autor-tarjeta_interactiva-btn"
                        >
                            Ver libros
                        </a>
                    </div>
                </article>
            `;
        })
        .join("");
}
