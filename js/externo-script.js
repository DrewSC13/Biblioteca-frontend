document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos de ejemplo
    inicializarDatosEjemplo();

    // Cargar datos del usuario desde localStorage
    const usuario = cargarDatosUsuario();
    actualizarDatosUsuario(usuario);

    // Configurar navegación entre secciones
    configurarNavegacion();

    // Cargar datos iniciales
    cargarLibros();
    cargarDescargas();
    cargarActividadReciente();

    // Configurar eventos
    document.getElementById('logout').addEventListener('click', cerrarSesion);
    document.getElementById('btn-filtrar').addEventListener('click', filtrarLibros);
    document.getElementById('form-configuracion').addEventListener('submit', guardarConfiguracion);
});

function cargarDatosUsuario() {
    // Obtener usuario de localStorage o crear uno de ejemplo
    let usuario = JSON.parse(localStorage.getItem('usuarioExterno'));

    if (!usuario) {
        usuario = {
            id: 13,
            nombre: "Isabella",
            apellido: "Reyes",
            correo: "isabella.reyes@uni.edu",
            telefono: "789456312",
            matricula: "EXT001",
            fechaRegistro: "2025-07-20"
        };
        localStorage.setItem('usuarioExterno', JSON.stringify(usuario));
    }

    return usuario;
}

function actualizarDatosUsuario(usuario) {
    document.getElementById('nombre-usuario').textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById('matricula-usuario').textContent = `Matrícula: ${usuario.matricula}`;
    document.getElementById('nombre-header').textContent = usuario.nombre;

    // Llenar formulario de configuración
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('apellido').value = usuario.apellido;
    document.getElementById('correo').value = usuario.correo;
    document.getElementById('telefono').value = usuario.telefono || '';
}

function configurarNavegacion() {
    const menuItems = document.querySelectorAll('.menu li a');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase active de todos los items
            menuItems.forEach(i => i.parentElement.classList.remove('active'));

            // Agregar clase active al item seleccionado
            this.parentElement.classList.add('active');

            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar la sección correspondiente
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function cargarLibros() {
    const libros = JSON.parse(localStorage.getItem('librosExterno')) || [];

    const librosContainer = document.getElementById('lista-libros');
    librosContainer.innerHTML = '';

    if (libros.length === 0) {
        librosContainer.innerHTML = '<p class="no-results">No se encontraron libros disponibles.</p>';
        return;
    }

    libros.forEach(libro => {
        const libroElement = document.createElement('div');
        libroElement.className = 'book-card';

        let estadoClass = '';
        let estadoText = '';

        if (libro.estado === 'Disponible') {
            estadoClass = 'status-available';
            estadoText = 'Disponible';
        } else if (libro.estado === 'Reservado') {
            estadoClass = 'status-reserved';
            estadoText = 'Reservado';
        } else if (libro.tipo_acceso === 'derechos_reservados') {
            estadoClass = 'status-restricted';
            estadoText = 'Acceso restringido';
        }

        libroElement.innerHTML = `
            <div class="book-cover">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${libro.titulo}</h3>
                <p class="book-author">${libro.autor}</p>
                <div class="book-meta">
                    <span>${libro.formato}</span>
                    <span>${libro.anio_publicacion}</span>
                </div>
                <span class="book-status ${estadoClass}">${estadoText}</span>
                <div class="book-actions">
                    <button class="btn-download" data-id="${libro.id_libro}" ${libro.tipo_acceso !== 'libre' || libro.estado !== 'Disponible' ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Descargar
                    </button>
                    <button class="btn-details" data-id="${libro.id_libro}">
                        <i class="fas fa-info-circle"></i> Detalles
                    </button>
                </div>
            </div>
        `;

        librosContainer.appendChild(libroElement);
    });

    // Configurar eventos de los botones
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroId = this.getAttribute('data-id');
            descargarLibro(libroId);
        });
    });

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroId = this.getAttribute('data-id');
            mostrarDetallesLibro(libroId);
        });
    });

    // Actualizar contador de libros disponibles
    const librosDisponibles = libros.filter(l => l.tipo_acceso === 'libre').length;
    document.getElementById('total-libros').textContent = librosDisponibles;
}

function cargarDescargas() {
    const descargas = JSON.parse(localStorage.getItem('descargasExterno')) || [];
    const libros = JSON.parse(localStorage.getItem('librosExterno')) || [];

    const descargasContainer = document.getElementById('lista-descargas');
    descargasContainer.innerHTML = '';

    if (descargas.length === 0) {
        descargasContainer.innerHTML = '<p class="no-results">No has realizado ninguna descarga aún.</p>';
        document.getElementById('total-descargas').textContent = '0';
        return;
    }

    // Filtrar descargas del usuario actual
    const usuario = JSON.parse(localStorage.getItem('usuarioExterno'));
    const misDescargas = descargas.filter(d => d.id_usuario == usuario.id);

    misDescargas.forEach(descarga => {
        const libro = libros.find(l => l.id_libro == descarga.id_libro);
        if (!libro) return;

        const descargaElement = document.createElement('div');
        descargaElement.className = 'download-item';

        descargaElement.innerHTML = `
            <div class="download-icon">
                <i class="fas fa-file-${libro.formato.toLowerCase() === 'pdf' ? 'pdf' : 'ebook'}"></i>
            </div>
            <div class="download-content">
                <h4>${libro.titulo}</h4>
                <p>${libro.autor} - ${libro.formato}</p>
            </div>
            <div class="download-date">${new Date(descarga.fecha).toLocaleDateString()}</div>
            <button class="btn-open" data-id="${libro.id_libro}">
                <i class="fas fa-external-link-alt"></i> Abrir
            </button>
        `;

        descargasContainer.appendChild(descargaElement);
    });

    // Configurar eventos de los botones
    document.querySelectorAll('.btn-open').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroId = this.getAttribute('data-id');
            abrirLibro(libroId);
        });
    });

    // Actualizar contador de descargas
    document.getElementById('total-descargas').textContent = misDescargas.length;
}

function cargarActividadReciente() {
    const actividad = [
        {
            tipo: 'login',
            fecha: new Date(),
            texto: 'Has iniciado sesión en el sistema'
        },
        {
            tipo: 'busqueda',
            termino: 'literatura clásica',
            fecha: new Date(Date.now() - 3600000),
            texto: 'Has buscado libros con el término "literatura clásica"'
        }
    ];

    // Añadir actividad de descargas si existe
    const descargas = JSON.parse(localStorage.getItem('descargasExterno')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuarioExterno'));
    const libros = JSON.parse(localStorage.getItem('librosExterno')) || [];

    const misDescargas = descargas.filter(d => d.id_usuario == usuario.id);
    if (misDescargas.length > 0) {
        const ultimaDescarga = misDescargas[0];
        const libro = libros.find(l => l.id_libro == ultimaDescarga.id_libro);

        if (libro) {
            actividad.unshift({
                tipo: 'descarga',
                libroId: libro.id_libro,
                fecha: new Date(ultimaDescarga.fecha),
                texto: `Has descargado el libro "${libro.titulo}"`
            });
        }
    }

    const actividadContainer = document.getElementById('actividad-reciente');
    actividadContainer.innerHTML = '';

    actividad.forEach(item => {
        let icono = '';
        switch(item.tipo) {
            case 'descarga':
                icono = 'fa-download';
                break;
            case 'login':
                icono = 'fa-sign-in-alt';
                break;
            case 'busqueda':
                icono = 'fa-search';
                break;
            default:
                icono = 'fa-info-circle';
        }

        const actividadElement = document.createElement('div');
        actividadElement.className = 'activity-item';

        actividadElement.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${icono}"></i>
            </div>
            <div class="activity-content">
                <h4>${item.texto}</h4>
                <p>${item.tipo === 'descarga' ? 'Descarga completada' : 'Actividad del sistema'}</p>
            </div>
            <div class="activity-time">${tiempoTranscurrido(item.fecha)}</div>
        `;

        actividadContainer.appendChild(actividadElement);
    });
}

function filtrarLibros() {
    const categoria = document.getElementById('filtro-categoria').value;
    const formato = document.getElementById('filtro-formato').value;

    const libros = JSON.parse(localStorage.getItem('librosExterno')) || [];

    let librosFiltrados = libros;

    if (categoria) {
        librosFiltrados = librosFiltrados.filter(libro => libro.categoria === categoria);
    }

    if (formato) {
        librosFiltrados = librosFiltrados.filter(libro => libro.formato === formato);
    }

    // Actualizar la lista de libros con los filtrados
    const librosContainer = document.getElementById('lista-libros');
    librosContainer.innerHTML = '';

    if (librosFiltrados.length === 0) {
        librosContainer.innerHTML = '<p class="no-results">No se encontraron libros con los filtros seleccionados.</p>';
        return;
    }

    librosFiltrados.forEach(libro => {
        const libroElement = document.createElement('div');
        libroElement.className = 'book-card';

        let estadoClass = '';
        let estadoText = '';

        if (libro.estado === 'Disponible') {
            estadoClass = 'status-available';
            estadoText = 'Disponible';
        } else if (libro.estado === 'Reservado') {
            estadoClass = 'status-reserved';
            estadoText = 'Reservado';
        } else if (libro.tipo_acceso === 'derechos_reservados') {
            estadoClass = 'status-restricted';
            estadoText = 'Acceso restringido';
        }

        libroElement.innerHTML = `
            <div class="book-cover">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${libro.titulo}</h3>
                <p class="book-author">${libro.autor}</p>
                <div class="book-meta">
                    <span>${libro.formato}</span>
                    <span>${libro.anio_publicacion}</span>
                </div>
                <span class="book-status ${estadoClass}">${estadoText}</span>
                <div class="book-actions">
                    <button class="btn-download" data-id="${libro.id_libro}" ${libro.tipo_acceso !== 'libre' || libro.estado !== 'Disponible' ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Descargar
                    </button>
                    <button class="btn-details" data-id="${libro.id_libro}">
                        <i class="fas fa-info-circle"></i> Detalles
                    </button>
                </div>
            </div>
        `;

        librosContainer.appendChild(libroElement);
    });

    // Configurar eventos de los botones
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroId = this.getAttribute('data-id');
            descargarLibro(libroId);
        });
    });

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroId = this.getAttribute('data-id');
            mostrarDetallesLibro(libroId);
        });
    });
}

function descargarLibro(libroId) {
    const libro = obtenerLibroPorId(libroId);

    if (!libro || libro.tipo_acceso !== 'libre') {
        alert('No tienes permiso para descargar este libro.');
        return;
    }

    // Simular descarga
    alert(`Descargando "${libro.titulo}" en formato ${libro.formato}`);

    // Registrar la descarga
    const usuario = JSON.parse(localStorage.getItem('usuarioExterno'));
    const descargas = JSON.parse(localStorage.getItem('descargasExterno')) || [];

    descargas.push({
        id_usuario: usuario.id,
        id_libro: libro.id_libro,
        fecha: new Date().toISOString()
    });

    localStorage.setItem('descargasExterno', JSON.stringify(descargas));

    // Actualizar la lista de descargas y actividad
    cargarDescargas();
    cargarActividadReciente();
}

function abrirLibro(libroId) {
    const libro = obtenerLibroPorId(libroId);

    if (!libro) {
        alert('Libro no encontrado.');
        return;
    }

    // Simular apertura del libro
    alert(`Abriendo "${libro.titulo}" en el visor de ${libro.formato}`);
}

function mostrarDetallesLibro(libroId) {
    const libro = obtenerLibroPorId(libroId);

    if (!libro) {
        alert('Libro no encontrado.');
        return;
    }

    // Crear modal con los detalles del libro
    const modal = document.createElement('div');
    modal.className = 'modal-detalles';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${libro.titulo}</h2>
            <p><strong>Autor:</strong> ${libro.autor}</p>
            <p><strong>Editorial:</strong> ${libro.editorial}</p>
            <p><strong>Año de publicación:</strong> ${libro.anio_publicacion}</p>
            <p><strong>Categoría:</strong> ${libro.categoria}</p>
            <p><strong>Formato:</strong> ${libro.formato}</p>
            <p><strong>Estado:</strong> ${libro.estado}</p>
            <p><strong>Acceso:</strong> ${libro.tipo_acceso === 'libre' ? 'Libre' : 'Restringido'}</p>
            <div class="modal-actions">
                <button class="btn-modal-download" ${libro.tipo_acceso !== 'libre' || libro.estado !== 'Disponible' ? 'disabled' : ''}>
                    <i class="fas fa-download"></i> Descargar
                </button>
                <button class="btn-modal-close">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Configurar eventos del modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.btn-modal-close').addEventListener('click', () => {
        modal.remove();
    });

    const btnDownload = modal.querySelector('.btn-modal-download');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            descargarLibro(libroId);
            modal.remove();
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function guardarConfiguracion(e) {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuarioExterno'));

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const contrasenia = document.getElementById('contrasenia').value;
    const confirmarContrasenia = document.getElementById('confirmar-contrasenia').value;

    // Validar contraseñas si se están cambiando
    if (contrasenia || confirmarContrasenia) {
        if (contrasenia !== confirmarContrasenia) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (contrasenia.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // En una aplicación real, aquí se haría hash de la contraseña
        usuario.contrasenia = contrasenia;
    }

    // Actualizar datos del usuario
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo = correo;
    usuario.telefono = telefono;

    // Guardar cambios
    localStorage.setItem('usuarioExterno', JSON.stringify(usuario));

    // Actualizar la UI
    actualizarDatosUsuario(usuario);

    // Mostrar confirmación
    alert('Tus cambios se han guardado correctamente.');
}

function cerrarSesion() {
    // En una aplicación real, aquí se haría una petición al servidor
    localStorage.removeItem('usuarioExterno');

    // Redirigir al login
    window.location.href = 'index.html';
}

function obtenerLibroPorId(id) {
    const libros = JSON.parse(localStorage.getItem('librosExterno')) || [];
    return libros.find(libro => libro.id_libro == id);
}

function tiempoTranscurrido(fecha) {
    const ahora = new Date();
    const segundos = Math.floor((ahora - fecha) / 1000);

    if (segundos < 60) {
        return 'Justo ahora';
    }

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
        return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }

    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
        return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    }

    const dias = Math.floor(horas / 24);
    if (dias < 7) {
        return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    }

    return fecha.toLocaleDateString();
}

function inicializarDatosEjemplo() {
    // Verificar si ya existen datos para no sobrescribirlos
    if (localStorage.getItem('librosExterno') && localStorage.getItem('descargasExterno')) {
        return;
    }

    // Datos de ejemplo basados en la estructura de la base de datos
    const librosEjemplo = [
        {
            id_libro: 5,
            titulo: "Cien Años de Soledad",
            autor: "Gabriel García Márquez",
            editorial: "Sudamericana",
            formato: "PDF",
            estado: "Disponible",
            categoria: "Novela",
            anio_publicacion: 1967,
            tipo_acceso: "libre"
        },
        {
            id_libro: 7,
            titulo: "Don Quijote de la Mancha",
            autor: "Miguel de Cervantes",
            editorial: "Francisco de Robles",
            formato: "PDF",
            estado: "Disponible",
            categoria: "Novela",
            anio_publicacion: 1605,
            tipo_acceso: "libre"
        },
        {
            id_libro: 8,
            titulo: "La Odisea",
            autor: "Homero",
            editorial: "Gredos",
            formato: "PDF",
            estado: "Disponible",
            categoria: "Épico",
            anio_publicacion: -800,
            tipo_acceso: "libre"
        },
        {
            id_libro: 10,
            titulo: "Orgullo y Prejuicio",
            autor: "Jane Austen",
            editorial: "T. Egerton",
            formato: "EPUB",
            estado: "Disponible",
            categoria: "Romance",
            anio_publicacion: 1813,
            tipo_acceso: "libre"
        },
        {
            id_libro: 14,
            titulo: "El Principito",
            autor: "Antoine de Saint-Exupéry",
            editorial: "Reynal & Hitchcock",
            formato: "EPUB",
            estado: "Disponible",
            categoria: "Fábula",
            anio_publicacion: 1943,
            tipo_acceso: "libre"
        },
        {
            id_libro: 15,
            titulo: "La Metamorfosis",
            autor: "Franz Kafka",
            editorial: "Kurt Wolff Verlag",
            formato: "PDF",
            estado: "Reservado",
            categoria: "Novela",
            anio_publicacion: 1915,
            tipo_acceso: "libre"
        },
        {
            id_libro: 16,
            titulo: "Rayuela",
            autor: "Julio Cortázar",
            editorial: "Sudamericana",
            formato: "PDF",
            estado: "Disponible",
            categoria: "Novela",
            anio_publicacion: 1963,
            tipo_acceso: "libre"
        },
        {
            id_libro: 12,
            titulo: "Ulises",
            autor: "James Joyce",
            editorial: "Sylvia Beach",
            formato: "PDF",
            estado: "Disponible",
            categoria: "Experimental",
            anio_publicacion: 1922,
            tipo_acceso: "derechos_reservados"
        }
    ];

    localStorage.setItem('librosExterno', JSON.stringify(librosEjemplo));

    // Descargas de ejemplo para el usuario externo
    const descargasEjemplo = [
        {
            id_usuario: 13, // ID del usuario externo de ejemplo
            id_libro: 5, // Cien Años de Soledad
            fecha: new Date(Date.now() - 86400000).toISOString() // Hace 1 día
        },
        {
            id_usuario: 13,
            id_libro: 14, // El Principito
            fecha: new Date(Date.now() - 259200000).toISOString() // Hace 3 días
        }
    ];

    localStorage.setItem('descargasExterno', JSON.stringify(descargasEjemplo));
}

// Estilos para el modal de detalles (se añaden dinámicamente)
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-detalles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 25px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        position: relative;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
    }

    .close-modal:hover {
        color: var(--dark-color);
    }

    .modal-content h2 {
        margin-bottom: 15px;
        color: var(--primary-color);
    }

    .modal-content p {
        margin-bottom: 10px;
        line-height: 1.5;
    }

    .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .btn-modal-download, .btn-modal-close {
        flex: 1;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }

    .btn-modal-download {
        background-color: var(--primary-color);
        color: white;
        border: none;
    }

    .btn-modal-download:hover {
        background-color: var(--secondary-color);
    }

    .btn-modal-download:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .btn-modal-close {
        background-color: transparent;
        color: var(--dark-color);
        border: 1px solid #ddd;
    }

    .btn-modal-close:hover {
        background-color: #f8f9fa;
    }
`;

document.head.appendChild(modalStyles);
