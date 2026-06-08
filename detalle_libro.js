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
            <div class="detalle_tarjeta_interactiva" style="border-top: 5px solid var(--primary); padding: var(--spacing-2xl); align-items: start;">
                <div style="position: relative; text-align: center;">
                    <img
                        src="${libro.portada}"
                        class="detalle_imagen"
                        style="box-shadow: var(--shadow-xl); border: 1px solid var(--outline-variant); max-width: 100%; border-radius: var(--radius-sm);"
                        onerror="this.src='sin_portada.png';"
                    />
                </div>
                <div class="detalle_informacion" style="justify-content: center;">
                    <div style="margin-bottom: var(--spacing-sm); display: flex; gap: var(--spacing-sm);">
                        <span class="etiqueta" style="background-color: var(--primary-light); color: var(--on-primary); font-weight: 600;">
                            ${genero_nombre}
                        </span>
                        <span class="etiqueta" style="background-color: var(--surface-container-high); border: 1px solid var(--outline-variant);">
                            Año ${libro.anio}
                        </span>
                    </div>
                    
                    <h2 class="detalle_titulo" style="font-size: var(--font-size-display-sm); font-weight: 700; color: var(--primary-dark); line-height: 1.1;">
                        ${libro.titulo}
                    </h2>
                    <p style="font-size: var(--font-size-title-md); color: var(--outline); margin-top: var(--spacing-xs); margin-bottom: var(--spacing-lg);">
                        Escrito por <a href="catalogo.html?autor=${libro.autor_id}" style="font-weight: 600; color: var(--primary); text-decoration: underline;">${autor_nombre}</a>
                    </p>
                    <div class="detalle_meta" style="background-color: var(--surface-container-low); padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid var(--secondary); margin-bottom: var(--spacing-lg);">
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
                            <span><strong style="color: var(--on-surface);">Editorial:</strong> ${editorial_nombre}</span>
                            <span><strong style="color: var(--on-surface);">ISBN:</strong> <code style="background: var(--surface-container-high); padding: 2px 6px; border-radius: 4px;">${libro.isbn}</code></span>
                        </div>
                    </div>
                    <div class="detalle_resumen">
                        <h3 style="font-size: var(--font-size-title-sm); color: var(--on-surface); margin-bottom: var(--spacing-sm);">Sinopsis</h3>
                        <p style="line-height: 1.7; color: var(--outline); font-size: var(--font-size-body-lg);">
                            <strong>${libro.titulo}</strong> es una pieza clave dentro del género <em>${genero_nombre.toLowerCase()}</em> que no puede faltar en Biblioteca Digital. Esta magistral edición fue publicada en el año ${libro.anio} por ${editorial_nombre} y continúa cautivando a lectores en todo el mundo.
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
                <article class="libro-relacionado" style="border-left: 4px solid var(--primary-light); background: var(--surface-container-lowest); transition: transform 0.2s, box-shadow 0.2s;">
                    <h4 class="libro-relacionado-titulo" style="color: var(--primary-dark); font-weight: 600; margin-bottom: var(--spacing-xs);">${item.titulo}</h4>
                    <span class="etiqueta" style="font-size: 0.7rem; background-color: var(--surface-container-high); color: var(--outline); padding: 2px 8px; border-radius: 4px;">
                        ${item.detalle}
                    </span>
                    <div style="margin-top: var(--spacing-md);">
                        <a href="detalle_libro.html?id=${item.id}" style="font-size: var(--font-size-label-md); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                            Ver libro →
                        </a>
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
    return {
        inicializar_modulo: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    detalle_libro_modulo.inicializar_modulo();
});
