document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar_carga();
    cargar_estadisticas();
});

function cargar_estadisticas() {
    document.getElementById("total_libros").textContent =
        biblioteca.obtener_libros().length;
    document.getElementById("total_autores").textContent =
        biblioteca.obtener_autores().length;
    document.getElementById("total_generos").textContent =
        biblioteca.obtener_generos().length;
    document.getElementById("total_editoriales").textContent =
        biblioteca.obtener_editoriales().length;
}
