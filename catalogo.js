const catalogo_modulo = (() => {
    let filtros_actuales = {
        busqueda: "",
        genero: "",
        autor: "",
        orden: "titulo_ascendente",
    };
    const renderizar_componentes = () => {
        const header_html = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="inicio.html" class="boton_primario">Inicio</a>
                    <a href="autores.html" class="boton_primario">Autores</a>
                    <a href="editoriales.html" class="boton_primario">Editoriales</a>
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
        document.getElementById("componente_encabezado").innerHTML =
            header_html;
        document.getElementById("componente_pie_pagina").innerHTML =
            footer_html;
    };
    const cargar_parametros_de_url = () => {
        const parametros = new URLSearchParams(window.location.search);
        if (parametros.has("busqueda")) {
            filtros_actuales.busqueda = parametros.get("busqueda");
            document.getElementById("busqueda").value =
                filtros_actuales.busqueda;
        }
        if (parametros.has("genero")) {
            filtros_actuales.genero = parametros.get("genero");
        }
        if (parametros.has("autor")) {
            filtros_actuales.autor = parametros.get("autor");
        }
    };
    const aplicar_filtros = () => {
        let libros = biblioteca.filtrar_libros(filtros_actuales);
        libros = ordenar_libros(libros, filtros_actuales.orden);
        mostrar_libros(libros);
        actualizar_info_resultados(libros.length);
        actualizar_url();
    };
    const ordenar_libros = (libros, orden) => {
        const copia = [...libros];
        switch (orden) {
            case "titulo_ascendente":
                return copia.sort((a, b) => a.titulo.localeCompare(b.titulo));
            case "titulo-descendente":
                return copia.sort((a, b) => b.titulo.localeCompare(a.titulo));
            case "anio-ascendente":
                return copia.sort((a, b) => a.anio - b.anio);
            case "anio-descendente":
                return copia.sort((a, b) => b.anio - a.anio);
            default:
                return copia;
        }
    };
    const mostrar_libros = (libros) => {
        const cuerpo_tabla = document.getElementById("cuerpo_tabla_libros");
        const no_resultados = document.getElementById("no_resultados");
        const tabla_elemento = document.getElementById("tabla_libros");
        if (!libros || libros.length === 0) {
            cuerpo_tabla.innerHTML = "";
            tabla_elemento.style.display = "none";
            no_resultados.classList.remove("oculto");
            return;
        }
        no_resultados.classList.add("oculto");
        tabla_elemento.style.display = "table";
        cuerpo_tabla.innerHTML = libros
            .map((libro) => {
                const autor = biblioteca.obtener_autor_por_id(libro.autor_id);
                const genero = biblioteca.obtener_genero_por_id(
                    libro.genero_id,
                );
                return `
                    <tr>
                        <td style="width: 70px; text-align: center;">
                            <img 
                                src="${libro.portada}"
                                style="width: 64px; height: 100px; object-fit: cover; border-radius: var(--radius-xs);" 
                                onerror="this.src='sin_portada.png'"
                            />
                        </td>
                        <td><strong>${libro.titulo}</strong></td>
                        <td>${autor?.nombre}</td>
                        <td><span class="badge">${genero?.nombre}</span></td>
                        <td><code>${libro.anio}</code></td>
                        <td>
                            <a href="detalle_libro.html?id=${libro.id}" class="btn boton_primario" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-label-sm);">
                                Ver detalles
                            </a>
                        </td>
                    </tr>
                `;
            })
            .join("");
    };
    const actualizar_info_resultados = (total) => {
        const info = document.getElementById("resultados_info");
        let texto = `Se encontraron ${total} libro${total !== 1 ? "s" : ""}`;
        if (filtros_actuales.busqueda) {
            texto += ` para "${filtros_actuales.busqueda}"`;
        }
        if (filtros_actuales.genero) {
            const nombre_genero = biblioteca.obtener_genero_por_id(
                filtros_actuales.genero,
            )?.nombre;
            texto += ` en el género ${nombre_genero}`;
        }
        if (filtros_actuales.autor) {
            const nombre_autor = biblioteca.obtener_autor_por_id(
                filtros_actuales.autor,
            )?.nombre;
            texto += ` escritos por ${nombre_autor}`;
        }
        info.textContent = texto;
    };
    const limpiar_filtros = () => {
        filtros_actuales = {
            busqueda: "",
            genero: "",
            autor: "",
            orden: "titulo_ascendente",
        };
        document.getElementById("busqueda").value = "";
        document.getElementById("ordenamiento").value = "titulo_ascendente";
        aplicar_filtros();
    };
    const actualizar_url = () => {
        const parametros = new URLSearchParams();
        if (filtros_actuales.busqueda)
            parametros.append("busqueda", filtros_actuales.busqueda);
        if (filtros_actuales.genero)
            parametros.append("genero", filtros_actuales.genero);
        if (filtros_actuales.autor)
            parametros.append("autor", filtros_actuales.autor);
        const nueva_url = parametros.toString()
            ? `${window.location.pathname}?${parametros.toString()}`
            : window.location.pathname;
        window.history.replaceState({}, "", nueva_url);
    };
    const vincular_eventos = () => {
        document.getElementById("busqueda").addEventListener("input", (e) => {
            filtros_actuales.busqueda = e.target.value;
            aplicar_filtros();
        });
        document
            .getElementById("ordenamiento")
            .addEventListener("change", (e) => {
                filtros_actuales.orden = e.target.value;
                aplicar_filtros();
            });
        document
            .getElementById("limpiar_filtros")
            .addEventListener("click", limpiar_filtros);
    };
    const inicializar = async () => {
        renderizar_componentes();
        await biblioteca.esperar_carga();
        cargar_parametros_de_url();
        vincular_eventos();
        aplicar_filtros();
    };
    return {
        init: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    catalogo_modulo.init();
});
