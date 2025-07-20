// Configuración
const CONFIG = {
    API_BASE_URL: 'https://api.biblioteca-arcana.edu',
    ENDPOINTS: {
        estudiante: '/estudiante/datos',
        libros: '/libros/recomendados',
        prestamos: '/prestamos',
        reservas: '/reservas',
        descargas: '/descargas/recientes',
        catalogo: '/libros',
        actualizarPerfil: '/estudiante/actualizar'
    },
    DEFAULT_AVATAR: 'img/avatar-biblio.jpg'
};

// Estado de la aplicación
const APP_STATE = {
    estudiante: null,
    libros: [],
    prestamos: {
        activos: [],
        historial: [],
        vencidos: []
    },
    reservas: {
        pendientes: [],
        completadas: [],
        canceladas: []
    },
    descargas: [],
    catalogo: [],
    currentSection: 'panel',
    sidebarVisible: false
};

// Elementos del DOM
const DOM = {
    // Header
    nombreEstudiante: document.getElementById('nombreEstudiante'),

    // Menú
    sidebar: document.querySelector('.gothic-sidebar'),
    menuToggle: null,
    mainContent: document.getElementById('mainContent'),

    // Panel
    carreraEstudiante: document.getElementById('carreraEstudiante'),
    matriculaEstudiante: document.getElementById('matriculaEstudiante'),
    semestreEstudiante: document.getElementById('semestreEstudiante'),
    librosRecomendados: document.getElementById('librosRecomendados'),
    contadorPrestamos: document.getElementById('contadorPrestamos'),
    contadorReservas: document.getElementById('contadorReservas'),

    // Catálogo
    catalogoCompleto: document.getElementById('catalogoCompleto'),
    busquedaLibros: document.getElementById('busquedaLibros'),
    filtroCategoria: document.getElementById('filtroCategoria'),
    filtroOrden: document.getElementById('filtroOrden'),

    // Préstamos
    tablaPrestamos: document.getElementById('tablaPrestamos'),

    // Reservas
    gridReservas: document.getElementById('gridReservas'),

    // Descargas
    descargasRecientes: document.getElementById('descargasRecientes'),

    // Perfil
    avatarPreview: document.getElementById('avatarPreview'),
    avatarInput: document.getElementById('avatarInput'),
    saveBtn: document.querySelector('.save-btn')
};

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoadingState();
        initMenu();
        await loadAllData();
        renderAll();
        setupEventListeners();
        setupDynamicEffects();
        hideLoadingState();

        // Mostrar sidebar en desktop por defecto
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        }
    } catch (error) {
        console.error('Error al inicializar:', error);
        showErrorState();
    }
});

/**
 * Inicializa el menú y botón toggle
 */
function initMenu() {
    // Crear botón toggle para móviles
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.onclick = toggleSidebar;
    document.body.appendChild(toggleBtn);
    DOM.menuToggle = toggleBtn;

    // Cargar sección por defecto
    cargarSeccion('panel');
}

/**
 * Alternar la visibilidad del menú lateral
 */
function toggleSidebar() {
    APP_STATE.sidebarVisible = !APP_STATE.sidebarVisible;

    if (APP_STATE.sidebarVisible) {
        DOM.sidebar.classList.add('show');
        DOM.mainContent.classList.add('sidebar-open');
        DOM.menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        DOM.sidebar.classList.remove('show');
        DOM.mainContent.classList.remove('sidebar-open');
        DOM.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

/**
 * Cargar todas las datos necesarios
 */
async function loadAllData() {
    await Promise.all([
        loadEstudianteData(),
        loadLibrosRecomendados(),
        loadPrestamos(),
        loadReservas(),
        loadDescargasRecientes()
    ]);
}

/**
 * Cargar datos del estudiante
 */
async function loadEstudianteData() {
    try {
        // Datos de ejemplo basados en tu base de datos
        const estudianteEjemplo = {
            id_usuario: 1,
            nombre: "Ana Torres",
            apellido: "Torres",
            telefono: "789123456",
            correo: "ana.torres@uni.edu",
            fecha_nacimiento: "1995-06-10",
            fecha_registro: "2025-07-20",
            matricula: "MAT2021001",
            carrera: "Ingeniería de Sistemas",
            semestre: "5"
        };

        APP_STATE.estudiante = estudianteEjemplo;
    } catch (error) {
        console.error('Error al cargar datos del estudiante:', error);
        // Datos de ejemplo como fallback
        APP_STATE.estudiante = {
            nombre: "Ana Torres",
            matricula: "MAT2021001",
            carrera: "Ingeniería de Sistemas",
            semestre: "5",
            correo: "ana.torres@uni.edu"
        };
    }
}

/**
 * Cargar libros recomendados
 */
async function loadLibrosRecomendados() {
    try {
        // Libros recomendados basados en la carrera del estudiante
        const librosRecomendados = [
            {
                id_libro: 6,
                titulo: "1984",
                autor: "George Orwell",
                editorial: "Secker & Warburg",
                formato: "EPUB",
                estado: "Prestado",
                categoria: "Distopía",
                anio_publicacion: 1949,
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
            },
            {
                id_libro: 21,
                titulo: "El nombre de la rosa",
                autor: "Umberto Eco",
                editorial: "Bompiani",
                formato: "EPUB",
                estado: "Disponible",
                categoria: "Misterio",
                anio_publicacion: 1980,
                tipo_acceso: "derechos_reservados"
            }
        ];

        APP_STATE.libros = librosRecomendados;
    } catch (error) {
        console.error('Error al cargar libros recomendados:', error);
        APP_STATE.libros = [];
    }
}

/**
 * Cargar préstamos
 */
async function loadPrestamos() {
    try {
        // Datos de ejemplo para préstamos
        const prestamosEjemplo = {
            activos: [
                {
                    id: 1,
                    libroId: 16,
                    titulo: "Rayuela",
                    fechaPrestamo: "2025-07-20",
                    fechaDevolucion: null,
                    dias_prestamo: 7,
                    plazo_maximo: 10,
                    estado: "activo",
                    vencido: false,
                    devuelto: false
                }
            ],
            historial: [
                {
                    id: 2,
                    libroId: 13,
                    titulo: "Hamlet",
                    fechaPrestamo: "2025-07-15",
                    fechaDevolucion: "2025-07-22",
                    dias_prestamo: 7,
                    plazo_maximo: 10,
                    estado: "devuelto",
                    vencido: false,
                    devuelto: true
                }
            ],
            vencidos: []
        };

        APP_STATE.prestamos = prestamosEjemplo;

        // Actualizar contador
        if (DOM.contadorPrestamos) {
            DOM.contadorPrestamos.textContent = `${APP_STATE.prestamos.activos.length} activos`;
        }
    } catch (error) {
        console.error('Error al cargar préstamos:', error);
        APP_STATE.prestamos = {
            activos: [],
            historial: [],
            vencidos: []
        };
    }
}

/**
 * Cargar reservas
 */
async function loadReservas() {
    try {
        // Datos de ejemplo para reservas
        const reservasEjemplo = {
            pendientes: [
                {
                    id: 1,
                    libroId: 9,
                    titulo: "La Divina Comedia",
                    fechaReserva: "2025-07-20",
                    fechaDisponible: "2025-07-25",
                    estado: "pendiente"
                }
            ],
            completadas: [
                {
                    id: 2,
                    libroId: 15,
                    titulo: "La Metamorfosis",
                    fechaReserva: "2025-07-15",
                    fechaDisponible: "2025-07-18",
                    estado: "completada"
                }
            ],
            canceladas: []
        };

        APP_STATE.reservas = reservasEjemplo;

        // Actualizar contador
        if (DOM.contadorReservas) {
            DOM.contadorReservas.textContent = `${APP_STATE.reservas.pendientes.length} pendientes`;
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        APP_STATE.reservas = {
            pendientes: [],
            completadas: [],
            canceladas: []
        };
    }
}

/**
 * Cargar descargas recientes
 */
async function loadDescargasRecientes() {
    try {
        // Datos de ejemplo para descargas
        const descargasEjemplo = [
            {
                id: 1,
                libroId: 5,
                titulo: "Cien Años de Soledad",
                fecha: "2025-07-20",
                formato: "PDF"
            },
            {
                id: 2,
                libroId: 7,
                titulo: "Don Quijote de la Mancha",
                fecha: "2025-07-18",
                formato: "PDF"
            },
            {
                id: 3,
                libroId: 10,
                titulo: "Orgullo y Prejuicio",
                fecha: "2025-07-15",
                formato: "EPUB"
            }
        ];

        APP_STATE.descargas = descargasEjemplo;
    } catch (error) {
        console.error('Error al cargar descargas recientes:', error);
        APP_STATE.descargas = [];
    }
}

/**
 * Cargar catálogo completo
 */
async function loadCatalogo() {
    try {
        // Catálogo completo basado en tu base de datos
        const catalogoEjemplo = [
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
                id_libro: 6,
                titulo: "1984",
                autor: "George Orwell",
                editorial: "Secker & Warburg",
                formato: "EPUB",
                estado: "Prestado",
                categoria: "Distopía",
                anio_publicacion: 1949,
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
                id_libro: 9,
                titulo: "La Divina Comedia",
                autor: "Dante Alighieri",
                editorial: "Mondadori",
                formato: "PDF",
                estado: "Reservado",
                categoria: "Poesía",
                anio_publicacion: 1320,
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
            }
        ];

        APP_STATE.catalogo = catalogoEjemplo;
        renderCatalogo();
    } catch (error) {
        console.error('Error al cargar catálogo:', error);
        APP_STATE.catalogo = [];
    }
}

/**
 * Buscar libros en el catálogo
 */
async function buscarLibros() {
    const termino = DOM.busquedaLibros.value.toLowerCase();
    const categoria = DOM.filtroCategoria.value;
    const orden = DOM.filtroOrden.value;

    try {
        showLoadingState();

        // Simular búsqueda con filtrado local
        let resultados = [...APP_STATE.catalogo];

        // Aplicar filtros
        if (termino) {
            resultados = resultados.filter(libro =>
                libro.titulo.toLowerCase().includes(termino) ||
                (libro.autor && libro.autor.toLowerCase().includes(termino)) ||
                libro.categoria.toLowerCase().includes(termino)
            );
        }

        if (categoria) {
            resultados = resultados.filter(libro => libro.categoria === categoria);
        }

        // Aplicar orden
        switch (orden) {
            case 'titulo':
                resultados.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'autor':
                resultados.sort((a, b) => (a.autor || '').localeCompare(b.autor || ''));
                break;
            case 'fecha':
                resultados.sort((a, b) => (b.anio_publicacion || 0) - (a.anio_publicacion || 0));
                break;
        }

        // Mostrar resultados
        DOM.catalogoCompleto.innerHTML = '';
        resultados.forEach(libro => {
            DOM.catalogoCompleto.appendChild(createBookCard(libro));
        });

        hideLoadingState();
    } catch (error) {
        console.error('Error al buscar libros:', error);
        hideLoadingState();
        alert('Error al realizar la búsqueda');
    }
}

/**
 * Renderizar todos los componentes
 */
function renderAll() {
    renderEstudianteData();
    renderLibrosRecomendados();
    renderPrestamos('activos');
    renderReservas('pendientes');
    renderDescargas();
}

/**
 * Renderizar datos del estudiante
 */
function renderEstudianteData() {
    if (!APP_STATE.estudiante) return;

    const { nombre, carrera, matricula, semestre } = APP_STATE.estudiante;

    DOM.nombreEstudiante.textContent = nombre || 'Estudiante';
    DOM.carreraEstudiante.textContent = carrera || 'Carrera no disponible';
    DOM.matriculaEstudiante.textContent = matricula || 'Matrícula no disponible';
    DOM.semestreEstudiante.textContent = semestre || 'Semestre no disponible';

    // Actualizar campos del perfil
    if (document.getElementById('nombre')) {
        document.getElementById('nombre').value = nombre || '';
        document.getElementById('matricula').value = matricula || '';
        document.getElementById('carrera').value = carrera || '';
        document.getElementById('semestre').value = semestre || '';
        document.getElementById('telefono').value = APP_STATE.estudiante.telefono || '';
        document.getElementById('correo').value = APP_STATE.estudiante.correo || '';
    }
}

/**
 * Renderizar libros recomendados
 */
function renderLibrosRecomendados() {
    if (!DOM.librosRecomendados) return;

    DOM.librosRecomendados.innerHTML = '';

    if (APP_STATE.libros.length === 0) {
        DOM.librosRecomendados.innerHTML = '<p class="no-data">No hay libros recomendados disponibles</p>';
        return;
    }

    APP_STATE.libros.forEach(libro => {
        DOM.librosRecomendados.appendChild(createBookCard(libro));
    });
}

/**
 * Renderizar catálogo completo
 */
function renderCatalogo() {
    if (!DOM.catalogoCompleto) return;

    DOM.catalogoCompleto.innerHTML = '';

    if (APP_STATE.catalogo.length === 0) {
        DOM.catalogoCompleto.innerHTML = '<p class="no-data">No hay libros en el catálogo</p>';
        return;
    }

    APP_STATE.catalogo.forEach(libro => {
        DOM.catalogoCompleto.appendChild(createBookCard(libro));
    });
}

/**
 * Crear tarjeta de libro
 */
function createBookCard(libro) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <div class="book-cover">
            <i class="fas fa-book-spells"></i>
        </div>
        <div class="book-info">
            <h3>${libro.titulo || 'Título no disponible'}</h3>
            <p>${libro.autor || 'Autor desconocido'}</p>
            <span class="book-category">${libro.categoria || 'Sin categoría'}</span>
            <button class="gothic-button" data-action="view-book" data-id="${libro.id_libro}">
                <i class="fas fa-eye"></i> Ver
            </button>
        </div>
    `;
    return card;
}

/**
 * Renderizar descargas
 */
function renderDescargas() {
    const container = document.getElementById('descargasRecientes');
    if (!container) {
        console.error('Error crítico: No se encontró el contenedor de descargas');
        return;
    }

    container.innerHTML = '';

    if (!APP_STATE.descargas || APP_STATE.descargas.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes descargas recientes</p>';
        return;
    }

    APP_STATE.descargas.forEach(descarga => {
        const item = document.createElement('div');
        item.className = 'download-item';

        const titulo = descarga.titulo || 'Archivo no disponible';
        const fecha = formatDate(descarga.fecha) || '--';
        const formato = descarga.formato || '--';
        const libroId = descarga.libroId || '';

        item.innerHTML = `
            <div class="download-icon">
                <i class="fas fa-file-${formato.toLowerCase() === 'pdf' ? 'pdf' : 'download'}"></i>
            </div>
            <div class="download-info">
                <h4>${titulo}</h4>
                <p>Descargado el ${fecha}</p>
                <p>Formato: ${formato}</p>
            </div>
            <div class="download-actions">
                <button class="gothic-button-small" data-action="download-again" data-id="${libroId}">
                    <i class="fas fa-download"></i> Descargar
                </button>
                <button class="gothic-button-small" data-action="view-book" data-id="${libroId}">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * Renderizar préstamos según tipo
 */
function renderPrestamos(tipo) {
    if (!DOM.tablaPrestamos) return;

    const tbody = DOM.tablaPrestamos.querySelector('tbody');
    tbody.innerHTML = '';

    const prestamos = APP_STATE.prestamos[tipo] || [];

    if (prestamos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="no-data">No tienes préstamos ${getPrestamoTipoNombre(tipo)}</td></tr>`;
        return;
    }

    prestamos.forEach(prestamo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prestamo.titulo || 'Libro no disponible'}</td>
            <td>${formatDate(prestamo.fechaPrestamo) || '--'}</td>
            <td>${formatDate(prestamo.fechaDevolucion) || '--'}</td>
            <td>${getEstadoPrestamo(prestamo)}</td>
            <td>
                ${tipo === 'activos' ? `
                <button class="gothic-button-small" data-action="renew-loan" data-id="${prestamo.id}">
                    <i class="fas fa-sync-alt"></i> Renovar
                </button>
                ` : ''}
                <button class="gothic-button-small" data-action="view-book" data-id="${prestamo.libroId}">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Filtrar préstamos por tipo
 */
function filtrarPrestamos(tipo) {
    // Actualizar pestañas activas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Renderizar préstamos
    renderPrestamos(tipo);
}

/**
 * Renderizar reservas según tipo
 */
function renderReservas(tipo) {
    if (!DOM.gridReservas) return;

    DOM.gridReservas.innerHTML = '';

    const reservas = APP_STATE.reservas[tipo] || [];

    if (reservas.length === 0) {
        DOM.gridReservas.innerHTML = `<p class="no-data">No tienes reservas ${getReservaTipoNombre(tipo)}</p>`;
        return;
    }

    reservas.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <h3>${reserva.titulo || 'Libro no disponible'}</h3>
            <p><strong>Fecha Reserva:</strong> ${formatDate(reserva.fechaReserva) || '--'}</p>
            <p><strong>Fecha Disponibilidad:</strong> ${formatDate(reserva.fechaDisponible) || '--'}</p>
            <p><strong>Estado:</strong> <span class="status-${reserva.estado ? reserva.estado.toLowerCase() : 'pendiente'}">
                ${getEstadoReserva(reserva.estado)}
            </span></p>
            ${tipo === 'pendientes' ? `
            <button class="gothic-button-small" data-action="cancel-reservation" data-id="${reserva.id}">
                <i class="fas fa-times"></i> Cancelar
            </button>
            ` : ''}
            <button class="gothic-button-small" data-action="view-book" data-id="${reserva.libroId}">
                <i class="fas fa-eye"></i> Ver libro
            </button>
        `;
        DOM.gridReservas.appendChild(card);
    });
}

/**
 * Filtrar reservas por tipo
 */
function filtrarReservas(tipo) {
    // Actualizar pestañas activas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Renderizar reservas
    renderReservas(tipo);
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Delegación de eventos para mejor performance
    document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');

        switch (action) {
            case 'view-book':
                verDetalleLibro(id);
                break;
            case 'renew-loan':
                renovarPrestamo(id);
                break;
            case 'cancel-reservation':
                cancelarReserva(id);
                break;
            case 'download-again':
                descargarDeNuevo(id);
                break;
        }
    });

    // Cambiar imagen de perfil
    if (DOM.avatarInput) {
        DOM.avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    DOM.avatarPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Guardar cambios de perfil
    if (DOM.saveBtn) {
        DOM.saveBtn.addEventListener('click', guardarPerfil);
    }

    // Buscar libros al presionar Enter
    if (DOM.busquedaLibros) {
        DOM.busquedaLibros.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarLibros();
            }
        });
    }

    // Filtrar catálogo al cambiar opciones
    if (DOM.filtroCategoria && DOM.filtroOrden) {
        DOM.filtroCategoria.addEventListener('change', buscarLibros);
        DOM.filtroOrden.addEventListener('change', buscarLibros);
    }

    // Cerrar modales al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        const modalReserva = document.getElementById('modalReserva');
        const modalPrestamo = document.getElementById('modalPrestamo');

        if (event.target === modalReserva) {
            cerrarModalReserva();
        }

        if (event.target === modalPrestamo) {
            cerrarModalPrestamo();
        }
    });
}

/**
 * Configurar efectos dinámicos
 */
function setupDynamicEffects() {
    // Efecto de carga de página
    gsap.from('body', {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // Efectos hover para libros
    document.querySelectorAll('.book-card, .quick-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.03,
                y: -5,
                boxShadow: '0 8px 25px rgba(90, 43, 139, 0.6)',
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                y: 0,
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });

    // Animación de aparición escalonada para tarjetas
    gsap.from('.book-card, .reservation-card, .download-item, .quick-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)"
    });

    // Efecto de velas parpadeantes
    setInterval(() => {
        document.querySelectorAll('.candle-effect').forEach(candle => {
            gsap.to(candle, {
                opacity: 0.7 + Math.random() * 0.3,
                duration: 2 + Math.random() * 3,
                ease: "power1.inOut"
            });
        });
    }, 3000);
}

/**
 * Cargar sección específica
 */
function cargarSeccion(seccion) {
    // Si ya está en la misma sección, no hacer nada
    if (APP_STATE.currentSection === seccion) return;

    // Ocultar todas las secciones
    document.querySelectorAll('[id^="seccion"]').forEach(sec => {
        sec.style.display = 'none';
    });

    // Desactivar todos los botones
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activar la sección seleccionada
    APP_STATE.currentSection = seccion;
    const seccionElement = document.getElementById(`seccion${capitalize(seccion)}`);
    const botonElement = document.getElementById(`btn${capitalize(seccion)}`);

    if (seccionElement && botonElement) {
        // Cargar datos específicos si es necesario
        if (seccion === 'catalogo' && APP_STATE.catalogo.length === 0) {
            loadCatalogo();
        }

        if (seccion === 'prestamos') {
            renderPrestamos('activos');
            // Activar la primera pestaña
            const tabButtons = seccionElement.querySelectorAll('.tab-btn');
            if (tabButtons.length > 0) {
                tabButtons[0].classList.add('active');
            }
        }

        if (seccion === 'reservas') {
            renderReservas('pendientes');
            // Activar la primera pestaña
            const tabButtons = seccionElement.querySelectorAll('.tab-btn');
            if (tabButtons.length > 0) {
                tabButtons[0].classList.add('active');
            }
        }

        if (seccion === 'descargas') {
            renderDescargas();
        }

        seccionElement.style.display = 'block';
        botonElement.classList.add('active');

        // Animación de entrada
        gsap.from(seccionElement, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Cerrar el sidebar en móviles
    if (window.innerWidth < 1024) {
        toggleSidebar();
    }
}

/**
 * Mostrar modal de reserva
 */
function mostrarModalReserva() {
    const modal = document.getElementById('modalReserva');
    const selectLibro = document.getElementById('libroReserva');

    // Limpiar opciones anteriores
    selectLibro.innerHTML = '';

    // Agregar opciones de libros disponibles
    const librosDisponibles = APP_STATE.catalogo.filter(libro => libro.estado === 'Disponible');

    if (librosDisponibles.length === 0) {
        selectLibro.innerHTML = '<option value="">No hay libros disponibles</option>';
    } else {
        librosDisponibles.forEach(libro => {
            const option = document.createElement('option');
            option.value = libro.id_libro;
            option.textContent = `${libro.titulo} - ${libro.autor}`;
            selectLibro.appendChild(option);
        });
    }

    // Mostrar modal
    modal.style.display = 'block';
}

/**
 * Cerrar modal de reserva
 */
function cerrarModalReserva() {
    document.getElementById('modalReserva').style.display = 'none';
}

/**
 * Solicitar reserva
 */
async function solicitarReserva() {
    const selectLibro = document.getElementById('libroReserva');
    const idLibro = selectLibro.value;

    if (!idLibro) {
        alert('Por favor selecciona un libro');
        return;
    }

    try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Actualizar estado local
        const libroReservado = APP_STATE.catalogo.find(libro => libro.id_libro == idLibro);
        if (libroReservado) {
            libroReservado.estado = 'Reservado';
        }

        const nuevaReserva = {
            id: APP_STATE.reservas.pendientes.length + 1,
            libroId: parseInt(idLibro),
            titulo: libroReservado?.titulo || 'Libro reservado',
            fechaReserva: new Date().toISOString().split('T')[0],
            fechaDisponible: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'pendiente'
        };

        APP_STATE.reservas.pendientes.push(nuevaReserva);
        DOM.contadorReservas.textContent = `${APP_STATE.reservas.pendientes.length} pendientes`;

        cerrarModalReserva();
        alert('Reserva solicitada con éxito');
        renderReservas('pendientes');
    } catch (error) {
        console.error('Error al solicitar reserva:', error);
        alert('Error al solicitar la reserva');
    }
}

/**
 * Mostrar modal de préstamo
 */
function mostrarModalPrestamo() {
    const modal = document.getElementById('modalPrestamo');
    const selectLibro = document.getElementById('libroPrestamo');

    // Limpiar opciones anteriores
    selectLibro.innerHTML = '';

    // Agregar opciones de libros disponibles
    const librosDisponibles = APP_STATE.catalogo.filter(libro => libro.estado === 'Disponible');

    if (librosDisponibles.length === 0) {
        selectLibro.innerHTML = '<option value="">No hay libros disponibles</option>';
    } else {
        librosDisponibles.forEach(libro => {
            const option = document.createElement('option');
            option.value = libro.id_libro;
            option.textContent = `${libro.titulo} - ${libro.autor}`;
            selectLibro.appendChild(option);
        });
    }

    // Mostrar modal
    modal.style.display = 'block';
}

/**
 * Cerrar modal de préstamo
 */
function cerrarModalPrestamo() {
    document.getElementById('modalPrestamo').style.display = 'none';
}

/**
 * Solicitar préstamo
 */
async function solicitarPrestamo() {
    const selectLibro = document.getElementById('libroPrestamo');
    const diasPrestamo = document.getElementById('diasPrestamo');
    const idLibro = selectLibro.value;

    if (!idLibro) {
        alert('Por favor selecciona un libro');
        return;
    }

    try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Actualizar estado local
        const libroPrestado = APP_STATE.catalogo.find(libro => libro.id_libro == idLibro);
        if (libroPrestado) {
            libroPrestado.estado = 'Prestado';
        }

        const nuevoPrestamo = {
            id: APP_STATE.prestamos.activos.length + 1,
            libroId: parseInt(idLibro),
            titulo: libroPrestado?.titulo || 'Libro prestado',
            fechaPrestamo: new Date().toISOString().split('T')[0],
            fechaDevolucion: null,
            dias_prestamo: parseInt(diasPrestamo.value),
            plazo_maximo: 15,
            estado: 'activo',
            vencido: false,
            devuelto: false
        };

        APP_STATE.prestamos.activos.push(nuevoPrestamo);
        DOM.contadorPrestamos.textContent = `${APP_STATE.prestamos.activos.length} activos`;

        cerrarModalPrestamo();
        alert('Préstamo solicitado con éxito');
        renderPrestamos('activos');
    } catch (error) {
        console.error('Error al solicitar préstamo:', error);
        alert('Error al solicitar el préstamo');
    }
}

/**
 * Funciones helper
 */

function formatDate(dateString) {
    if (!dateString) return null;
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch {
        return dateString;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPrestamoTipoNombre(tipo) {
    const nombres = {
        'activos': 'activos',
        'historial': 'en tu historial',
        'vencidos': 'vencidos'
    };
    return nombres[tipo] || '';
}

function getReservaTipoNombre(tipo) {
    const nombres = {
        'pendientes': 'pendientes',
        'completadas': 'completadas',
        'canceladas': 'canceladas'
    };
    return nombres[tipo] || '';
}

function getEstadoPrestamo(prestamo) {
    if (prestamo.vencido) return 'Vencido';
    if (prestamo.devuelto) return 'Devuelto';
    return 'Activo';
}

function getEstadoReserva(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'completada': 'Completada',
        'cancelada': 'Cancelada'
    };
    return estados[estado] || 'Pendiente';
}

/**
 * Mostrar estado de carga
 */
function showLoadingState() {
    document.body.classList.add('loading');
    // Podrías añadir un spinner o skeleton screens aquí
}

/**
 * Ocultar estado de carga
 */
function hideLoadingState() {
    document.body.classList.remove('loading');
}

/**
 * Mostrar estado de error
 */
function showErrorState() {
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Error al cargar los datos. Por favor, intenta recargar la página.</span>
        <button onclick="location.reload()">Recargar</button>
    `;
    document.body.prepend(errorBanner);
}

/**
 * Funciones de interacción
 */

function verDetalleLibro(idLibro) {
    console.log(`Mostrando detalles del libro con ID: ${idLibro}`);
    // Implementación real: abrir modal o redirigir
    const libro = APP_STATE.catalogo.find(l => l.id_libro == idLibro) ||
                 APP_STATE.libros.find(l => l.id_libro == idLibro);

    if (libro) {
        alert(`Detalles del libro:\n\nTítulo: ${libro.titulo}\nAutor: ${libro.autor}\nEditorial: ${libro.editorial}\nAño: ${libro.anio_publicacion}\nCategoría: ${libro.categoria}\nEstado: ${libro.estado}`);
    } else {
        alert('Libro no encontrado');
    }
}

async function renovarPrestamo(idPrestamo) {
    try {
        console.log(`Solicitando renovación para el préstamo con ID: ${idPrestamo}`);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const prestamo = APP_STATE.prestamos.activos.find(p => p.id == idPrestamo);
        if (prestamo) {
            prestamo.dias_prestamo += 7;
            prestamo.plazo_maximo += 7;
            alert('Préstamo renovado con éxito por 7 días más');
            await loadPrestamos();
            renderPrestamos('activos');
        } else {
            alert('Préstamo no encontrado');
        }
    } catch (error) {
        console.error('Error al renovar préstamo:', error);
        alert('Error al renovar el préstamo');
    }
}

async function cancelarReserva(idReserva) {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;

    try {
        console.log(`Cancelando reserva con ID: ${idReserva}`);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const reservaIndex = APP_STATE.reservas.pendientes.findIndex(r => r.id == idReserva);
        if (reservaIndex !== -1) {
            const reserva = APP_STATE.reservas.pendientes[reservaIndex];

            // Actualizar estado del libro
            const libro = APP_STATE.catalogo.find(l => l.id_libro == reserva.libroId);
            if (libro) {
                libro.estado = 'Disponible';
            }

            // Mover reserva a canceladas
            APP_STATE.reservas.pendientes.splice(reservaIndex, 1);
            reserva.estado = 'cancelada';
            APP_STATE.reservas.canceladas.push(reserva);

            // Actualizar contador
            DOM.contadorReservas.textContent = `${APP_STATE.reservas.pendientes.length} pendientes`;

            alert('Reserva cancelada con éxito');
            renderReservas('pendientes');
        } else {
            alert('Reserva no encontrada');
        }
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        alert('Error al cancelar la reserva');
    }
}

async function descargarDeNuevo(idLibro) {
    try {
        console.log(`Iniciando nueva descarga del libro con ID: ${idLibro}`);
        // Simular descarga
        await new Promise(resolve => setTimeout(resolve, 1000));

        const libro = APP_STATE.catalogo.find(l => l.id_libro == idLibro) ||
                     APP_STATE.libros.find(l => l.id_libro == idLibro);

        if (libro) {
            alert(`Iniciando descarga de "${libro.titulo}" en formato ${libro.formato}`);

            // Agregar a descargas recientes
            const nuevaDescarga = {
                id: APP_STATE.descargas.length + 1,
                libroId: libro.id_libro,
                titulo: libro.titulo,
                fecha: new Date().toISOString().split('T')[0],
                formato: libro.formato
            };

            APP_STATE.descargas.unshift(nuevaDescarga);
            renderDescargas();
        } else {
            alert('Libro no encontrado');
        }
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('Error al iniciar la descarga');
    }
}

async function guardarPerfil() {
    try {
        const datosActualizados = {
            nombre: document.getElementById('nombre').value,
            matricula: document.getElementById('matricula').value,
            carrera: document.getElementById('carrera').value,
            semestre: document.getElementById('semestre').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value
        };

        console.log('Guardando cambios:', datosActualizados);
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Actualizar estado local
        if (APP_STATE.estudiante) {
            APP_STATE.estudiante.nombre = datosActualizados.nombre;
            APP_STATE.estudiante.matricula = datosActualizados.matricula;
            APP_STATE.estudiante.carrera = datosActualizados.carrera;
            APP_STATE.estudiante.semestre = datosActualizados.semestre;
            APP_STATE.estudiante.telefono = datosActualizados.telefono;
            APP_STATE.estudiante.correo = datosActualizados.correo;

            // Actualizar UI
            DOM.nombreEstudiante.textContent = datosActualizados.nombre;
            DOM.carreraEstudiante.textContent = datosActualizados.carrera;
            DOM.matriculaEstudiante.textContent = datosActualizados.matricula;
            DOM.semestreEstudiante.textContent = datosActualizados.semestre;
        }

        alert('Perfil actualizado con éxito');
    } catch (error) {
        console.error('Error al guardar perfil:', error);
        alert('Error al guardar los cambios');
    }
}

function cerrarSesion() {
    // Animación de salida
    gsap.to("body", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            // Redirigir al login
            window.location.href = "index.html";
        }
    });
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && !APP_STATE.sidebarVisible) {
        toggleSidebar();
    } else if (window.innerWidth < 1024 && APP_STATE.sidebarVisible) {
        toggleSidebar();
    }
});
