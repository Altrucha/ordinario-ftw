class Biblioteca {
    constructor() {
        this.datos = {
            libros: [],
            autores: {},
            editoriales: {},
            generos: {},
        };
        this.estaCargado = false;
        this.promesaCarga = this.cargarDatos();
    }
    async cargarDatos() {
        try {
            const response = await fetch("biblioteca.xml");
            const xml = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "application/xml");
            const librosXml = doc.getElementsByTagName("libro");
            this.datos.libros = Array.from(librosXml).map((libro) => ({
                id: libro.getAttribute("id"),
                titulo: libro.querySelector("titulo")?.textContent || "",
                isbn: libro.querySelector("isbn")?.textContent || "",
                autor_id: libro.querySelector("autor_id")?.textContent || "",
                editorial_id:
                    libro.querySelector("editorial_id")?.textContent || "",
                genero_id: libro.querySelector("genero_id")?.textContent || "",
                anio: parseInt(libro.querySelector("anio")?.textContent || 0),
                portada: libro.querySelector("portada")?.textContent || "",
            }));
            const autoresXml = doc.getElementsByTagName("autor");
            Array.from(autoresXml).forEach((autor) => {
                this.datos.autores[autor.getAttribute("id")] = {
                    id: autor.getAttribute("id"),
                    nombre:
                        autor.querySelector("nombre")?.textContent ||
                        "Desconocido",
                };
            });
            const editorialesXml = doc.getElementsByTagName("editorial");
            Array.from(editorialesXml).forEach((editorial) => {
                this.datos.editoriales[editorial.getAttribute("id")] = {
                    id: editorial.getAttribute("id"),
                    nombre:
                        editorial.querySelector("nombre")?.textContent ||
                        "Desconocida",
                };
            });
            const generosXml = doc.getElementsByTagName("genero");
            Array.from(generosXml).forEach((genero) => {
                this.datos.generos[genero.getAttribute("id")] = {
                    id: genero.getAttribute("id"),
                    nombre:
                        genero.querySelector("nombre")?.textContent ||
                        "Desconocido",
                };
            });
            this.estaCargado = true;
            return true;
        } catch (error) {
            return false;
        }
    }
    async esperar() {
        return this.promesaCarga;
    }
    obtenerLibros() {
        return this.datos.libros;
    }
    obtenerLibroPorId(id) {
        return this.datos.libros.find((libro) => libro.id === id);
    }
    obtenerLibrosPorGenero(idGenero) {
        return this.datos.libros.filter(
            (libro) => libro.genero_id === idGenero,
        );
    }
    obtenerLibrosPorAutor(idAutor) {
        return this.datos.libros.filter((libro) => libro.autor_id === idAutor);
    }
    buscarPorTitulo(consulta) {
        const q = consulta.toLowerCase();
        return this.datos.libros.filter((libro) =>
            libro.titulo.toLowerCase().includes(q),
        );
    }
    obtenerAutores() {
        return Object.values(this.datos.autores).sort((a, b) =>
            a.nombre.localeCompare(b.nombre),
        );
    }
    obtenerAutorPorId(id) {
        return this.datos.autores[id];
    }
    obtenerGeneros() {
        return Object.values(this.datos.generos);
    }
    obtenerGeneroPorId(id) {
        return this.datos.generos[id];
    }
    obtenerEditoriales() {
        return Object.values(this.datos.editoriales);
    }
    obtenerEditorialPorId(id) {
        return this.datos.editoriales[id];
    }
    filtrarLibros(filtros) {
        let resultado = [...this.datos.libros];
        if (filtros.genero) {
            resultado = resultado.filter((l) => l.genero_id === filtros.genero);
        }
        if (filtros.autor) {
            resultado = resultado.filter((l) => l.autor_id === filtros.autor);
        }
        if (filtros.anio) {
            resultado = resultado.filter(
                (l) => l.anio === parseInt(filtros.anio),
            );
        }
        if (filtros.busqueda) {
            const q = filtros.busqueda.toLowerCase();
            resultado = resultado.filter(
                (l) =>
                    l.titulo.toLowerCase().includes(q) ||
                    this.obtenerAutorPorId(l.autor_id)
                        ?.nombre.toLowerCase()
                        .includes(q),
            );
        }
        return resultado;
    }
    obtenerLibroEnriquecido(id) {
        const libro = this.obtenerLibroPorId(id);
        if (!libro) return null;
        return {
            ...libro,
            autor: this.obtenerAutorPorId(libro.autor_id),
            editorial: this.obtenerEditorialPorId(libro.editorial_id),
            genero: this.obtenerGeneroPorId(libro.genero_id),
            librosDelAutor: this.obtenerLibrosPorAutor(libro.autor_id).filter(
                (l) => l.id !== id,
            ),
            librosDelGenero: this.obtenerLibrosPorGenero(libro.genero_id)
                .filter((l) => l.id !== id)
                .slice(0, 4),
        };
    }
}
const biblioteca = new Biblioteca();
