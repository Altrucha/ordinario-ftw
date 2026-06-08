let filtrosActuales = {
    busqueda: "",
    genero: "",
    autor: "",
    anio: "",
    orden: "titulo-ascendente",
};
document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar_carga();
    inicializarSelectsDeGeneros();
    inicializarSelectsDeAutores();
    inicializarSelectsDeAnios();
    cargarParametrosDeURL();
    document.getElementById("busqueda").addEventListener("input", (e) => {
        filtrosActuales.busqueda = e.target.value;
        aplicarFiltros();
    });
    document.getElementById("filtro-genero").addEventListener("change", (e) => {
        filtrosActuales.genero = e.target.value;
        aplicarFiltros();
    });
    document.getElementById("filtro-autor").addEventListener("change", (e) => {
        filtrosActuales.autor = e.target.value;
        aplicarFiltros();
    });
    document.getElementById("filtro-anio").addEventListener("change", (e) => {
        filtrosActuales.anio = e.target.value;
        aplicarFiltros();
    });
    document.getElementById("ordenamiento").addEventListener("change", (e) => {
        filtrosActuales.orden = e.target.value;
        aplicarFiltros();
    });
    document
        .getElementById("limpiarFiltros")
        .addEventListener("click", limpiarFiltros);
    aplicarFiltros();
});
function inicializarSelectsDeGeneros() {
    const select = document.getElementById("filtro-genero");
    const generos = biblioteca.obtenerGeneros();
    generos.forEach((genero) => {
        const option = document.createElement("option");
        option.value = genero.id;
        option.textContent = genero.nombre;
        select.appendChild(option);
    });
}
function inicializarSelectsDeAutores() {
    const select = document.getElementById("filtro-autor");
    const autores = biblioteca.obtenerAutores();
    autores.forEach((autor) => {
        const option = document.createElement("option");
        option.value = autor.id;
        option.textContent = autor.nombre;
        select.appendChild(option);
    });
}
function inicializarSelectsDeAnios() {
    const select = document.getElementById("filtro-anio");
    const libros = biblioteca.obtenerLibros();
    const anos = [...new Set(libros.map((l) => l.anio))].sort((a, b) => b - a);
    anos.forEach((ano) => {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    });
}
function cargarParametrosDeURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("genero")) {
        filtrosActuales.genero = params.get("genero");
        document.getElementById("filtro-genero").value = filtrosActuales.genero;
    }
    if (params.has("autor")) {
        filtrosActuales.autor = params.get("autor");
        document.getElementById("filtro-autor").value = filtrosActuales.autor;
    }
    if (params.has("busqueda")) {
        filtrosActuales.busqueda = params.get("busqueda");
        document.getElementById("busqueda").value = filtrosActuales.busqueda;
    }
}
function aplicarFiltros() {
    let libros = biblioteca.filtrarLibros(filtrosActuales);
    libros = ordenarLibros(libros, filtrosActuales.orden);
    mostrarLibros(libros);
    actualizarInfoResultados(libros.length);
    actualizarURL();
}
function ordenarLibros(libros, orden) {
    const copia = [...libros];
    switch (orden) {
        case "titulo-ascendente":
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
}
function mostrarLibros(libros) {
    const container = document.getElementById("libros-grid");
    const noResultados = document.getElementById("no-resultados");
    if (!libros || libros.length === 0) {
        container.innerHTML = "";
        noResultados.classList.remove("oculto");
        return;
    }
    noResultados.classList.add("oculto");
    container.innerHTML = libros
        .map((libro) => {
            const autor = biblioteca.obtenerAutorPorId(libro.autor_id);
            const genero = biblioteca.obtenerGeneroPorId(libro.genero_id);
            return `
            <article class="catalogo-libro-tarjeta_interactiva">
                <img src="${libro.portada}" alt="${libro.titulo}" class="catalogo-libro-tarjeta-imagen" onerror="this.src='https://via.placeholder.com/200x260?text=Sin+portada'">
                <div class="catalogo-libro-tarjeta_interactiva-contenido">
                    <h3 class="catalogo-libro-tarjeta_interactiva-title">${libro.titulo}</h3>
                    <p class="catalogo-libro-tarjeta_interactiva-info">${autor?.nombre || "Autor desconocido"}</p>
                    <div class="catalogo-libro-tarjeta_interactiva-meta">
                        <span class="badge">${genero?.nombre || "Género"}</span>
                        <span class="badge">${libro.anio}</span>
                    </div>
                    <a href="detalle_libro.html?id=${libro.id}" class="catalogo-libro-tarjeta_interactiva-btn">Ver Detalles</a>
                </div>
            </article>
        `;
        })
        .join("");
}
function actualizarInfoResultados(count) {
    const info = document.getElementById("resultados-info");
    let texto = `Se encontraron ${count} libro${count !== 1 ? "s" : ""}`;
    if (filtrosActuales.busqueda) {
        texto += ` para "${filtrosActuales.busqueda}"`;
    }
    info.textContent = texto;
}
function limpiarFiltros() {
    filtrosActuales = {
        busqueda: "",
        genero: "",
        autor: "",
        anio: "",
        orden: "titulo-ascendente",
    };
    document.getElementById("busqueda").value = "";
    document.getElementById("filtro-genero").value = "";
    document.getElementById("filtro-autor").value = "";
    document.getElementById("filtro-anio").value = "";
    document.getElementById("ordenamiento").value = "titulo-ascendente";
    aplicarFiltros();
}
function actualizarURL() {
    const params = new URLSearchParams();
    if (filtrosActuales.genero) params.append("genero", filtrosActuales.genero);
    if (filtrosActuales.autor) params.append("autor", filtrosActuales.autor);
    if (filtrosActuales.busqueda)
        params.append("busqueda", filtrosActuales.busqueda);
    const newURL = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
    window.history.replaceState({}, "", newURL);
}
