const modulo_editoriales = (() => {
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
                const libros_de_editorial =
                    biblioteca.obtener_libros_por_editorial(
                        editorial.id,
                    ).length;
                return `
                    <tr>
                        <td><strong>${editorial.nombre}</strong></td>
                        <td>
                            <span class="etiqueta">
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
        biblioteca.renderizar_componentes_globales();
        await biblioteca.esperar_carga();
        cargar_editoriales();
        vincular_eventos();
    };
    return { inicializar: inicializar };
})();
document.addEventListener("DOMContentLoaded", () => {
    modulo_editoriales.inicializar();
});
