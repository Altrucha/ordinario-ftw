document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar_carga();
    const params = new URLSearchParams(window.location.search);
    const libroId = params.get("id");

    if (!libroId) {
        mostrarError("No se encontró el identificador del libro.");
        return;
    }

    const libro = biblioteca.obtenerLibroEnriquecido(libroId);

    if (!libro) {
        mostrarError("No se encontró el libro solicitado.");
        return;
    }

    mostrarDetalle(libro);
    cargarRelacionados(libro);
});

function mostrarError(mensaje) {
    const contenedor = document.getElementById("detalle_contenido");
    contenedor.innerHTML = `<div class="mensaje_error">${mensaje}</div>`;
}

function mostrarDetalle(libro) {
    const contenedor = document.getElementById("detalle_contenido");
    const autorNombre = libro.autor?.nombre || "Desconocido";
    const editorialNombre = libro.editorial?.nombre || "Desconocida";
    const generoNombre = libro.genero?.nombre || "Sin género";

    contenedor.innerHTML = `
        <div class="detalle_tarjeta_interactiva">
            <img
                src="${libro.portada}"
                alt="Portada de ${libro.titulo}"
                class="detalle_imagen"
            />
            <div class="detalle_informacion">
                <h2 class="detalle_titulo">${libro.titulo}</h2>
                <div class="detalle_meta">
                    <span><strong>Autor:</strong> <a href="catalogo.html?autor=${libro.autor_id}">${autorNombre}</a></span>
                    <span><strong>Editorial:</strong> ${editorialNombre}</span>
                    <span><strong>Género:</strong> <a href="catalogo.html?genero=${libro.genero_id}">${generoNombre}</a></span>
                    <span><strong>Año:</strong> ${libro.anio}</span>
                    <span><strong>ISBN:</strong> ${libro.isbn}</span>
                </div>
                <p class="detalle_resumen">
                    Información del libro basada en la colección de la biblioteca.
                </p>
                <div class="detalle_boton_grupo">
                    <a href="catalogo.html" class="detalle_boton">Volver al catálogo</a>
                    <a href="autores.html" class="detalle_boton">Ver autores</a>
                </div>
            </div>
        </div>
    `;
}

function cargarRelacionados(libro) {
    const section = document.getElementById("relacionados-section");
    const grid = document.getElementById("relacionados-grid");
    const autorLibros = libro.librosDelAutor || [];
    const generoLibros = libro.librosDelGenero || [];

    const elementos = [];

    autorLibros.forEach((libroRelacionado) => {
        elementos.push({
            titulo: libroRelacionado.titulo,
            detalle: `Autor: ${biblioteca.obtenerAutorPorId(libroRelacionado.autor_id)?.nombre || "Desconocido"}`,
            id: libroRelacionado.id,
        });
    });

    generoLibros.forEach((libroRelacionado) => {
        elementos.push({
            titulo: libroRelacionado.titulo,
            detalle: `Género: ${biblioteca.obtenerGeneroPorId(libroRelacionado.genero_id)?.nombre || "Desconocido"}`,
            id: libroRelacionado.id,
        });
    });

    if (elementos.length === 0) {
        section.classList.add("oculto");
        return;
    }

    section.classList.remove("oculto");
    grid.innerHTML = elementos
        .map(
            (item) => `
            <article class="libro-relacionado">
                <h4 class="libro-relacionado-titulo">${item.titulo}</h4>
                <p class="libro-relacionado-meta">${item.detalle}</p>
                <a href="detalle_libro.html?id=${item.id}">Ver detalles</a>
            </article>
        `,
        )
        .join("");
}
