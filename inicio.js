const inicio_modulo = (() => {
    const renderizar_componentes = () => {
        const encabezado_html = `
            <encabezado class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="acerca_de.html" class="boton_primario">Acerca de</a>
                    <a href="#" id="boton_cerrar_sesion" class="boton_primario" style="background-color: var(--error);">Cerrar sesión</a>
                </nav>
            </encabezado>
        `;
        const pie_pagina_html = `
            <pie_pagina class="pie_pagina">
                <div class="contenedor">
                    <p>&copy;2026 Biblioteca Digital. Todos los derechos reservados.</p>
                </div>
            </pie_pagina>
        `;
        document.getElementById("componente_encabezado").innerHTML =
            encabezado_html;
        document.getElementById("componente_pie_pagina").innerHTML =
            pie_pagina_html;
    };
    const cargar_tabla_generos = () => {
        const cuerpo_tabla = document.getElementById("cuerpo_tabla_generos");
        const generos = biblioteca.obtener_generos();
        if (!generos || generos.length === 0) {
            cuerpo_tabla.innerHTML = `
                <tr>
                    <td colspan="3" class="texto_centro texto_silenciado">No hay datos disponibles.</td>
                </tr>
            `;
            return;
        }
        cuerpo_tabla.innerHTML = generos
            .map((genero) => {
                const total_libros = biblioteca.obtener_libros_por_genero(
                    genero.id,
                ).length;
                return `
                    <tr>
                        <td><strong>${genero.nombre}</strong></td>
                        <td>
                            <span class="etiqueta">
                                ${total_libros} libro${total_libros !== 1 ? "s" : ""}
                            </span>
                        </td>
                        <td>
                            <a href="catalogo.html?genero=${genero.id}" class="boton boton_primario" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-label-sm);">
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
        cargar_tabla_generos();
    };
    return {
        inicializar_modulo: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    inicio_modulo.inicializar_modulo();
});
