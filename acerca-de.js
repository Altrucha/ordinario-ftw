const acerca_de_modulo = (() => {
    const renderizar_componentes = () => {
        const header_html = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
                <nav class="barra_superior_acciones" aria-label="Navegación principal">
                    <a href="inicio.html" class="boton_primario">Inicio</a>
                    <a href="catalogo.html" class="boton_primario">Catálogo</a>
                    <a href="autores.html" class="boton_primario">Autores</a>
                    <a href="editoriales.html" class="boton_primario">Editoriales</a>
                    <a href="#" id="boton_cerrar_sesion" class="boton_primario" style="background-color: var(--error);">Cerrar Sesión</a>
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
        cargar_estadisticas();
    };
    return {
        init: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    acerca_de_modulo.init();
});
