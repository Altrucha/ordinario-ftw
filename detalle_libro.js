const detalle_libro_modulo = (() => {
    const mostrar_error = (mensaje) => {
        const contenedor = document.getElementById("detalle_contenido");
        contenedor.innerHTML = `<div class="mensaje_error" role="alert">${mensaje}</div>`;
    };
    const mostrar_detalle = (libro) => {
        const contenedor = document.getElementById("detalle_contenido");
        const autor_nombre = libro.autor?.nombre || "Desconocido";
        const editorial_nombre = libro.editorial?.nombre || "Desconocida";
        const genero_nombre = libro.genero?.nombre || "Desconocido";
        contenedor.innerHTML = `
            <div class="detalle_tarjeta_interactiva detalle_tarjeta_principal">
                <div class="detalle_imagen_contenedor">
                    <img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="detalle_imagen detalle_imagen_estilo" onerror="this.src='sin_portada.png';" />
                </div>
                <div class="detalle_informacion detalle_informacion_centrada">
                    <div class="detalle_etiquetas_contenedor">
                        <span class="etiqueta etiqueta_genero">${genero_nombre}</span>
                        <span class="etiqueta etiqueta_anio">Año ${libro.anio}</span>
                    </div>
                    <h2 class="detalle_titulo detalle_titulo_principal">${libro.titulo}</h2>
                    <p class="detalle_autor_texto">
                        Escrito por <a href="catalogo.html?autor=${libro.autor_id}" class="detalle_autor_enlace">${autor_nombre}</a>
                    </p>
                    <div class="detalle_meta detalle_meta_caja">
                        <div class="detalle_meta_lista">
                            <span><strong class="detalle_meta_fuerte">Editorial:</strong> ${editorial_nombre}</span>
                            <span><strong class="detalle_meta_fuerte">ISBN:</strong> <code class="detalle_isbn_codigo">${libro.isbn}</code></span>
                        </div>
                    </div>
                    <div class="detalle_resumen">
                        <h3 class="detalle_sinopsis_titulo">Sinopsis</h3>
                        <p class="detalle_sinopsis_texto">
                            <strong>${libro.titulo}</strong> es una pieza clave dentro del género <em>${genero_nombre.toLowerCase()}</em> que no puede faltar en Biblioteca Digital. Esta magistral edición fue publicada en el año ${libro.anio} por ${editorial_nombre} y continua cautivando a lectores en todo el mundo.
                        </p>
                    </div>
                </div>
            </div>
        `;
    };
    const cargar_relacionados = (libro) => {
        const seccion = document.getElementById("relacionados_seccion");
        const grid = document.getElementById("relacionados_grid");
        const autor_libros = libro.libros_del_autor || [];
        const genero_libros = libro.libros_del_genero || [];
        const elementos = [];
        autor_libros.forEach((libro_relacionado) => {
            elementos.push({
                titulo: libro_relacionado.titulo,
                detalle: `Mismo autor`,
                id: libro_relacionado.id,
            });
        });
        genero_libros.forEach((libro_relacionado) => {
            if (!elementos.some((e) => e.id === libro_relacionado.id)) {
                elementos.push({
                    titulo: libro_relacionado.titulo,
                    detalle: `Mismo género`,
                    id: libro_relacionado.id,
                });
            }
        });
        if (elementos.length === 0) {
            seccion.classList.add("oculto");
            return;
        }
        seccion.classList.remove("oculto");
        grid.innerHTML = elementos
            .map(
                (item) => `
                <article class="libro_relacionado libro_relacionado_articulo">
                    <h4 class="libro_relacionado_titulo libro_relacionado_titulo_estilo">${item.titulo}</h4>
                    <span class="etiqueta etiqueta_relacionado">${item.detalle}</span>
                    <div class="enlace_relacionado_contenedor">
                        <a href="detalle_libro.html?id=${item.id}" class="enlace_relacionado">Ver libro →</a>
                    </div>
                </article>
            `,
            )
            .join("");
    };
    const inicializar = async () => {
        biblioteca.renderizar_componentes_globales();
        await biblioteca.esperar_carga();
        const parametros = new URLSearchParams(window.location.search);
        const id_libro = parametros.get("id");
        if (!id_libro) {
            mostrar_error("No se encontró.");
            return;
        }
        const libro_enriquecido =
            biblioteca.obtener_libro_enriquecido(id_libro);
        if (!libro_enriquecido) {
            mostrar_error("El libro no existe.");
            return;
        }
        mostrar_detalle(libro_enriquecido);
        cargar_relacionados(libro_enriquecido);
    };
    return { inicializar_modulo: inicializar };
})();
document.addEventListener("DOMContentLoaded", () => {
    detalle_libro_modulo.inicializar_modulo();
});
