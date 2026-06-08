const login_modulo = (() => {
    let elementos = {};
    const renderizar_componentes = () => {
        const headerHTML = `
            <header class="barra_superior">
                <img src="logo.png" alt="Logo Biblioteca Digital" class="barra_superior_logo" />
                <h1>Biblioteca Digital</h1>
            </header>
        `;
        const footerHTML = `
            <footer class="footer">
                <div class="container">
                    <p>&copy;2026 Biblioteca Digital. Todos los derechos reservados.</p>
                </div>
            </footer>
        `;
        document.getElementById("componente_encabezado").innerHTML = headerHTML;
        document.getElementById("componente_pie_pagina").innerHTML = footerHTML;
    };
    const vincular_eventos = () => {
        elementos.formulario = document.getElementById("formulario_login");
        elementos.mensaje_error = document.getElementById("mensaje_error");
        elementos.input_usuario = document.getElementById("nombre_usuario");
        elementos.input_contrasenia = document.getElementById("contrasenia");
        elementos.formulario.addEventListener("submit", manejar_submit);
    };
    const manejar_submit = (e) => {
        e.preventDefault();
        const usuario = elementos.input_usuario.value.trim();
        const contrasenia = elementos.input_contrasenia.value.trim();
        const es_valido = biblioteca.iniciar_sesion(usuario, contrasenia);
        if (es_valido) {
            elementos.mensaje_error.classList.add("oculto");
            elementos.mensaje_error.textContent = "";
        } else {
            elementos.mensaje_error.textContent =
                "Usuario o contraseña incorrectos. Verifica tus credenciales.";
            elementos.mensaje_error.classList.remove("oculto");
            elementos.input_usuario.focus();
        }
    };
    const inicializar = async () => {
        renderizar_componentes();
        await biblioteca.esperar_carga();
        vincular_eventos();
    };
    return {
        init: inicializar,
    };
})();
document.addEventListener("DOMContentLoaded", () => {
    login_modulo.init();
});
