const autores_modulo = (() => {
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
                            <span class="etiqueta">
                                ${libros_del_autor} libro${libros_del_autor !== 1 ? "s" : ""}
                            </span>
                        </td>
                        <td>
                            <a href="catalogo.html?autor=${autor.id}" class="boton boton_primario" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-label-sm);" aria-label="Ver todos los libros escritos por ${autor.nombre}">
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
        cargar_autores();
    };
    return { inicializar_modulo: inicializar };
})();
document.addEventListener("DOMContentLoaded", () => {
    autores_modulo.inicializar_modulo();
});
