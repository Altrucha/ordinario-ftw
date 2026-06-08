class clase_biblioteca {
    constructor() {
        this.datos = {
            libros: [],
            autores: {},
            editoriales: {},
            generos: {},
            usuarios: [],
        };
        this.esta_cargado = false;
        this.promesa_carga = this.cargar_datos();
        this.verificar_sesion();
    }
    verificar_sesion() {
        const ruta_actual = window.location.pathname;
        const es_login =
            ruta_actual.includes("login.html") || ruta_actual.endsWith("/");
        const sesion_activa = sessionStorage.getItem("sesion_activa");
        if (!sesion_activa && !es_login) {
            window.location.href = "login.html";
        } else if (sesion_activa && es_login) {
            window.location.href = "inicio.html";
        }
    }
    async cargar_datos() {
        try {
            const respuesta = await fetch("biblioteca.xml");
            const texto_xml = await respuesta.text();
            const analizador = new DOMParser();
            const documento_xml = analizador.parseFromString(
                texto_xml,
                "application/xml",
            );
            const nodos_libros = documento_xml.getElementsByTagName("libro");
            this.datos.libros = Array.from(nodos_libros).map((nodo) => ({
                id: nodo.getAttribute("id"),
                titulo: nodo.querySelector("titulo")?.textContent || "",
                isbn: nodo.querySelector("isbn")?.textContent || "",
                autor_id: nodo.querySelector("autor_id")?.textContent || "",
                editorial_id:
                    nodo.querySelector("editorial_id")?.textContent || "",
                genero_id: nodo.querySelector("genero_id")?.textContent || "",
                anio: parseInt(nodo.querySelector("anio")?.textContent || 0),
                portada: nodo.querySelector("portada")?.textContent || "",
            }));
            const nodos_autores = documento_xml.getElementsByTagName("autor");
            Array.from(nodos_autores).forEach((nodo) => {
                this.datos.autores[nodo.getAttribute("id")] = {
                    id: nodo.getAttribute("id"),
                    nombre:
                        nodo.querySelector("nombre")?.textContent ||
                        "Desconocido",
                };
            });
            const nodos_editoriales =
                documento_xml.getElementsByTagName("editorial");
            Array.from(nodos_editoriales).forEach((nodo) => {
                this.datos.editoriales[nodo.getAttribute("id")] = {
                    id: nodo.getAttribute("id"),
                    nombre:
                        nodo.querySelector("nombre")?.textContent ||
                        "Desconocida",
                };
            });
            const nodos_generos = documento_xml.getElementsByTagName("genero");
            Array.from(nodos_generos).forEach((nodo) => {
                this.datos.generos[nodo.getAttribute("id")] = {
                    id: nodo.getAttribute("id"),
                    nombre:
                        nodo.querySelector("nombre")?.textContent ||
                        "Desconocido",
                };
            });
            const nodos_usuarios =
                documento_xml.getElementsByTagName("usuario");
            this.datos.usuarios = Array.from(nodos_usuarios).map((nodo) => ({
                nombre_usuario:
                    nodo.querySelector("nombre_usuario")?.textContent || "",
                contrasenia:
                    nodo.querySelector("contrasenia")?.textContent || "",
            }));
            this.esta_cargado = true;
            return true;
        } catch (error) {
            console.error("Error al cargar y procesar XML: ", error);
            return false;
        }
    }
    async esperar_carga() {
        return this.promesa_carga;
    }
    iniciar_sesion(nombre_usuario, contrasenia) {
        const es_valido = this.datos.usuarios.some(
            (usuario) =>
                usuario.nombre_usuario === nombre_usuario &&
                usuario.contrasenia === contrasenia,
        );
        if (es_valido) {
            sessionStorage.setItem("sesion_activa", "true");
            window.location.href = "inicio.html";
        }
        return es_valido;
    }
    cerrar_sesion() {
        sessionStorage.removeItem("sesion_activa");
        window.location.href = "login.html";
    }
    obtener_libros() {
        return this.datos.libros;
    }
    obtener_libro_por_id(id_libro) {
        return this.datos.libros.find((libro) => libro.id === id_libro);
    }
    obtener_libros_por_genero(id_genero) {
        return this.datos.libros.filter(
            (libro) => libro.genero_id === id_genero,
        );
    }
    obtener_libros_por_autor(id_autor) {
        return this.datos.libros.filter((libro) => libro.autor_id === id_autor);
    }
    obtener_autores() {
        return Object.values(this.datos.autores).sort((a, b) =>
            a.nombre.localeCompare(b.nombre),
        );
    }
    obtener_autor_por_id(id_autor) {
        return this.datos.autores[id_autor];
    }
    obtener_generos() {
        return Object.values(this.datos.generos);
    }
    obtener_genero_por_id(id_genero) {
        return this.datos.generos[id_genero];
    }
    obtener_editoriales() {
        return Object.values(this.datos.editoriales);
    }
    obtener_editorial_por_id(id_editorial) {
        return this.datos.editoriales[id_editorial];
    }
    buscar_por_titulo(consulta) {
        const termino = consulta.toLowerCase();
        return this.datos.libros.filter((libro) =>
            libro.titulo.toLowerCase().includes(termino),
        );
    }
    filtrar_libros(filtros) {
        let resultado = [...this.datos.libros];
        if (filtros.genero) {
            resultado = resultado.filter(
                (libro) => libro.genero_id === filtros.genero,
            );
        }
        if (filtros.autor) {
            resultado = resultado.filter(
                (libro) => libro.autor_id === filtros.autor,
            );
        }
        if (filtros.anio) {
            resultado = resultado.filter(
                (libro) => libro.anio === parseInt(filtros.anio),
            );
        }
        if (filtros.busqueda) {
            const termino = filtros.busqueda.toLowerCase();
            resultado = resultado.filter(
                (libro) =>
                    libro.titulo.toLowerCase().includes(termino) ||
                    this.obtener_autor_por_id(libro.autor_id)
                        ?.nombre.toLowerCase()
                        .includes(termino),
            );
        }
        return resultado;
    }
    obtener_libro_enriquecido(id_libro) {
        const libro = this.obtener_libro_por_id(id_libro);
        if (!libro) return null;
        return {
            ...libro,
            autor: this.obtener_autor_por_id(libro.autor_id),
            editorial: this.obtener_editorial_por_id(libro.editorial_id),
            genero: this.obtener_genero_por_id(libro.genero_id),
            libros_del_autor: this.obtener_libros_por_autor(
                libro.autor_id,
            ).filter((l) => l.id !== id_libro),
            libros_del_genero: this.obtener_libros_por_genero(libro.genero_id)
                .filter((l) => l.id !== id_libro)
                .slice(0, 4),
        };
    }
}
const biblioteca = new clase_biblioteca();
document.addEventListener("click", (evento) => {
    const boton_salir = evento.target.closest("#boton_cerrar_sesion");
    if (boton_salir) {
        evento.preventDefault();
        biblioteca.cerrar_sesion();
    }
});
