const inicio_modulo = (() => {
    const renderizar_componentes = () => {
        const header_html = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="acerca-de.html" class="boton_primario">Acerca de</a>
                    <a href="#" id="boton_cerrar_sesion" class="boton_primario" style="background-color: var(--error);">Cerrar sesión</a>
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
        document.getElementById("componente_header").innerHTML = header_html;
        document.getElementById("componente_footer").innerHTML = footer_html;
    };
    const cargar_tabla_generos = () => {
        const cuerpo_tabla = document.getElementById("cuerpo_tabla_generos");
        const generos = biblioteca.obtener_generos();
        if (!generos || generos.length === 0) {
            cuerpo_tabla.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">No hay datos disponibles.</td>
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
                            <span class="badge">
                                ${total_libros} libro${total_libros !== 1 ? "s" : ""}
                            </span>
                        </td>
                        <td>
                            <a href="catalogo.html?genero=${genero.id}" class="btn boton_primario" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-label-sm);">
                                Ver libros
                            </a>
                        </td>
                    </tr>
                `;
            })
            .join("");
    };
    const cargar_estadisticas = () => {
        document.getElementById("total_libros").textContent =
            biblioteca.obtener_libros().length;
        document.getElementById("total_autores").textContent =
            biblioteca.obtener_autores().length;
        document.getElementById("total_generos").textContent =
            biblioteca.obtener_generos().length;
        document.getElementById("total_editoriales").textContent =
            biblioteca.obtener_editoriales().length;
    };
    const inicializar = async () => {
        renderizar_componentes();
        await biblioteca.esperar_carga();
        cargar_tabla_generos();
        cargar_estadisticas();
    };
    return {
        init: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    inicio_modulo.init();
});
