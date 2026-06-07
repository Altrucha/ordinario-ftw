document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar();
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
                <article class="autor-card">
                    <h3 class="autor-card-nombre">${autor.nombre}</h3>
                    <p class="autor-card-libros">${librosDelAutor} libro${
                        librosDelAutor !== 1 ? "s" : ""
                    }</p>
                    <div class="autor-card-acciones">
                        <a
                            href="catalogo.html?autor=${autor.id}"
                            class="autor-card-btn"
                        >
                            Ver libros
                        </a>
                    </div>
                </article>
            `;
        })
        .join("");
}
