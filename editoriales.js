const modulo_editoriales = (() => {
    const renderizar_componentes = () => {
        const html_encabezado = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="inicio.html" class="boton_primario">Inicio</a>
                    <a href="catalogo.html" class="boton_primario">Catálogo</a>
                    <a href="autores.html" class="boton_primario">Autores</a>
                    <a href="acerca-de.html" class="boton_primario">Acerca de</a>
                    <a href="#" id="boton_cerrar_sesion" class="boton_primario" style="background-color: var(--error);">Cerrar Sesión</a>
                </nav>
            </header>
        `;
        const html_pie_pagina = `
            <footer class="footer">
                <div class="container">
                    <p>&copy;2026 Biblioteca Digital. Todos los derechos reservados.</p>
                </div>
            </footer>
        `;
        document.getElementById("componente_encabezado").innerHTML =
            html_encabezado;
        document.getElementById("componente_pie_pagina").innerHTML =
            html_pie_pagina;
    };
    const cargar_editoriales = (filtro = "") => {
        const cuerpo_tabla = document.getElementById(
            "cuerpo_tabla_editoriales",
        );
        const contenedor_vacio = document.getElementById("editoriales_vacio");
        const tabla_elemento = document.getElementById("tabla_editoriales");
        let editoriales = biblioteca.obtener_editoriales();
        if (filtro) {
            const termino = filtro.toLowerCase();
            editoriales = editoriales.filter((editorial) =>
                editorial.nombre.toLowerCase().includes(termino),
            );
        }
        if (!editoriales || editoriales.length === 0) {
            tabla_elemento.style.display = "none";
            contenedor_vacio.classList.remove("oculto");
            return;
        }
        contenedor_vacio.classList.add("oculto");
        tabla_elemento.style.display = "table";
        cuerpo_tabla.innerHTML = editoriales
            .map((editorial) => {
                const libros_de_editorial = biblioteca
                    .obtener_libros()
                    .filter(
                        (libro) => libro.editorial_id === editorial.id,
                    ).length;
                return `
                    <tr>
                        <td><strong>${editorial.nombre}</strong></td>
                        <td>
                            <span class="badge">
                                ${libros_de_editorial} libro${libros_de_editorial !== 1 ? "s" : ""}
                            </span>
                        </td>
                    </tr>
                `;
            })
            .join("");
    };
    const vincular_eventos = () => {
        document
            .getElementById("busqueda_editorial")
            .addEventListener("input", (evento) => {
                cargar_editoriales(evento.target.value);
            });
    };
    const inicializar = async () => {
        renderizar_componentes();
        await biblioteca.esperar_carga();
        cargar_editoriales();
        vincular_eventos();
    };
    return {
        inicializar: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    modulo_editoriales.inicializar();
});
