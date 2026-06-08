const inicio_modulo = (() => {
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
        biblioteca.renderizar_componentes_globales();
        await biblioteca.esperar_carga();
        cargar_tabla_generos();
    };
    return { inicializar_modulo: inicializar };
})();
document.addEventListener("DOMContentLoaded", () => {
    inicio_modulo.inicializar_modulo();
});
