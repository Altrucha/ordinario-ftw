const acerca_de_modulo = (() => {
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
        biblioteca.renderizar_componentes_globales();
        await biblioteca.esperar_carga();
        cargar_estadisticas();
    };
    return {
        inicializar_modulo: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    acerca_de_modulo.inicializar_modulo();
});
