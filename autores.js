const autores_modulo = (() => {
    const renderizar_componentes = () => {
        const header_html = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="inicio.html" class="boton_primario">Inicio</a>
                    <a href="catalogo.html" class="boton_primario">Catálogo</a>
                    <a href="editoriales.html" class="boton_primario">Editoriales</a>
                    <a href="acerca-de.html" class="boton_primario">Acerca de</a>
                    <a href="#" id="boton_cerrar_sesion" class="boton_primario" style="background-color: var(--error);">Cerrar Sesión</a>
                </nav>
            </header>
        `;
        const footer_html = `
            <footer class="footer">
                <div class="container">
                    <p>&copy;2026 Biblioteca Digital. Todos los derechos reservados.</p>
                </div>
            </footer>
        `;
        document.getElementById("componente_encabezado").innerHTML =
            header_html;
        document.getElementById("componente_pie_pagina").innerHTML =
            footer_html;
    };
    const cargar_autores = () => {
        const cuerpo_tabla = document.getElementById("cuerpo_tabla_autores");
        const contenedor_vacio = document.getElementById("autores_vacio");
        const tabla_elemento = document.getElementById("tabla_autores");
        const autores = biblioteca.obtener_autores();
        if (!autores || autores.length === 0) {
            tabla_elemento.style.display = "none";
            contenedor_vacio.classList.remove("oculto");
            return;
        }
        contenedor_vacio.classList.add("oculto");
        tabla_elemento.style.display = "table";
        cuerpo_tabla.innerHTML = autores
            .map((autor) => {
                const libros_del_autor = biblioteca.obtener_libros_por_autor(
                    autor.id,
                ).length;
                return `
                    <tr>
                        <td><strong>${autor.nombre}</strong></td>
                        <td>
                            <span class="badge">
                                ${libros_del_autor} libro${libros_del_autor !== 1 ? "s" : ""}
                            </span>
                        </td>
                        <td>
                            <a 
                                href="catalogo.html?autor=${autor.id}" 
                                class="btn boton_primario"
                                style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-label-sm);"
                                aria-label="Ver todos los libros escritos por ${autor.nombre}"
                            >
                                Ver libros
                            </a>
                        </td>
                    </tr>
                `;
            })
            .join("");
    };
    const inicializar = async () => {
        renderizar_componentes();
        await biblioteca.esperar_carga();
        cargar_autores();
    };
    return {
        init: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    autores_modulo.init();
});
