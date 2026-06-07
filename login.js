document.addEventListener("DOMContentLoaded", async () => {
    await biblioteca.esperar();
    const formulario = document.getElementById("formulario-login");
    const mensajeError = document.getElementById("mensaje-error");
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("nombre_usuario").value;
        const pass = document.getElementById("contrasenia").value;
        if (biblioteca.validarUsuario(user, pass)) {
            mensajeError.classList.add("oculto");
            window.location.href = "inicio.html";
        } else {
            mensajeError.classList.remove("oculto");
        }
    });
});
