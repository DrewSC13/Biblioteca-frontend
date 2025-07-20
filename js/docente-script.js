// Configuración
const CONFIG = {
    API_BASE_URL: 'https://api.biblioteca-arcana.edu',
    ENDPOINTS: {
        docente: '/docente/datos',
        libros: '/libros/recomendados',
        prestamos: '/prestamos',
        reservas: '/reservas',
        descargas: '/descargas/recientes',
        catalogo: '/libros',
        actualizarPerfil: '/docente/actualizar'
    },
    DEFAULT_AVATAR: 'img/avatar-docente-default.jpg'
};

// Estado de la aplicación
const APP_STATE = {
    docente: null,
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
    nombreDocente: document.getElementById('nombreDocente'),

    // Menú
    sidebar: document.querySelector('.gothic-sidebar'),
    menuToggle: null,
    mainContent: document.getElementById('mainContent'),

    // Panel
    especialidadDocente: document.getElementById('especialidadDocente'),
    gradoDocente: document.getElementById('gradoDocente'),
    carreraDocente: document.getElementById('carreraDocente'),
    librosEspecialidad: document.getElementById('librosEspecialidad'),
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
        loadDocenteData(),
        loadLibrosRecomendados(),
        loadPrestamos(),
        loadReservas(),
        loadDescargasRecientes()
    ]);
}

/**
 * Cargar datos del docente
 */
async function loadDocenteData() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.docente}`);
        if (!response.ok) throw new Error('Error al cargar datos del docente');

        const data = await response.json();
        if (!data || !data.nombre) throw new Error('Datos del docente inválidos');

        APP_STATE.docente = data;
    } catch (error) {
        console.error('Error al cargar datos del docente:', error);
        // Datos de ejemplo como fallback
        APP_STATE.docente = {
            nombre: "Camila Morales",
            especialidad: "Inteligencia Artificial",
            grado: "PhD",
            carrera: "Ingeniería de Sistemas",
            correo: "camila.morales@uni.edu"
        };
    }
}

/**
 * Cargar libros recomendados
 */
async function loadLibrosRecomendados() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.libros}`);
        if (!response.ok) throw new Error('Error al cargar libros recomendados');

        const data = await response.json();
        APP_STATE.libros = Array.isArray(data) ? data : [];
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
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.prestamos}`);
        if (!response.ok) throw new Error('Error al cargar préstamos');

        const data = await response.json();

        // Organizar préstamos por estado
        APP_STATE.prestamos = {
            activos: Array.isArray(data.activos) ? data.activos : [],
            historial: Array.isArray(data.historial) ? data.historial : [],
            vencidos: Array.isArray(data.vencidos) ? data.vencidos : []
        };

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
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.reservas}`);
        if (!response.ok) throw new Error('Error al cargar reservas');

        const data = await response.json();

        // Organizar reservas por estado
        APP_STATE.reservas = {
            pendientes: Array.isArray(data.pendientes) ? data.pendientes : [],
            completadas: Array.isArray(data.completadas) ? data.completadas : [],
            canceladas: Array.isArray(data.canceladas) ? data.canceladas : []
        };

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
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.descargas}`);
        if (!response.ok) throw new Error('Error al cargar descargas recientes');

        const data = await response.json();
        APP_STATE.descargas = Array.isArray(data) ? data : [];
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
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.catalogo}`);
        if (!response.ok) throw new Error('Error al cargar catálogo');

        const data = await response.json();
        APP_STATE.catalogo = Array.isArray(data) ? data : [];
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

        // Simular búsqueda con filtrado local (en producción sería una llamada API)
        let resultados = [...APP_STATE.catalogo];

        // Aplicar filtros
        if (termino) {
            resultados = resultados.filter(libro =>
                libro.titulo.toLowerCase().includes(termino) ||
                libro.autor.toLowerCase().includes(termino) ||
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
                resultados.sort((a, b) => a.autor.localeCompare(b.autor));
                break;
            case 'fecha':
                resultados.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
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
    renderDocenteData();
    renderLibrosRecomendados();
    renderPrestamos('activos');
    renderReservas('pendientes');
    renderDescargasRecientes();
}

/**
 * Renderizar datos del docente
 */
function renderDocenteData() {
    if (!APP_STATE.docente) return;

    const { nombre, especialidad, grado, carrera } = APP_STATE.docente;

    DOM.nombreDocente.textContent = nombre || 'Docente';
    DOM.especialidadDocente.textContent = especialidad || 'Especialidad no disponible';
    DOM.gradoDocente.textContent = grado || 'Grado no disponible';
    DOM.carreraDocente.textContent = carrera || 'Carrera no disponible';
}

/**
 * Renderizar libros recomendados
 */
function renderLibrosRecomendados() {
    if (!DOM.librosEspecialidad) return;

    DOM.librosEspecialidad.innerHTML = '';

    if (APP_STATE.libros.length === 0) {
        DOM.librosEspecialidad.innerHTML = '<p class="no-data">No hay libros recomendados disponibles</p>';
        return;
    }

    APP_STATE.libros.forEach(libro => {
        DOM.librosEspecialidad.appendChild(createBookCard(libro));
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
            <button class="gothic-button" data-action="view-book" data-id="${libro.id}">
                <i class="fas fa-eye"></i> Ver
            </button>
        </div>
    `;
    return card;
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
 * Renderizar descargas recientes
 */
function renderDescargasRecientes() {
    if (!DOM.descargasRecientes) return;

    DOM.descargasRecientes.innerHTML = '';

    if (APP_STATE.descargas.length === 0) {
        DOM.descargasRecientes.innerHTML = '<p class="no-data">No hay descargas recientes</p>';
        return;
    }

    APP_STATE.descargas.forEach(descarga => {
        const item = document.createElement('div');
        item.className = 'download-item';
        item.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <div class="download-info">
                <h4>${descarga.titulo || 'Archivo no disponible'}</h4>
                <p>Descargado el ${formatDate(descarga.fecha) || '--'}</p>
            </div>
            <button class="gothic-button-small" data-action="download-again" data-id="${descarga.id}">
                <i class="fas fa-download"></i> Descargar
            </button>
        `;
        DOM.descargasRecientes.appendChild(item);
    });
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
                boxShadow: '0 8px 25px rgba(139, 90, 43, 0.6)',
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
    alert(`Detalles del libro ${idLibro}`);
}

async function renovarPrestamo(idPrestamo) {
    try {
        console.log(`Solicitando renovación para el préstamo con ID: ${idPrestamo}`);
        // Implementación real: llamada a API
        // await fetch(...);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada API
        alert('Préstamo renovado con éxito');
        await loadPrestamos();
        renderPrestamos('activos');
    } catch (error) {
        console.error('Error al renovar préstamo:', error);
        alert('Error al renovar el préstamo');
    }
}

async function cancelarReserva(idReserva) {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;

    try {
        console.log(`Cancelando reserva con ID: ${idReserva}`);
        // Implementación real: llamada a API
        // await fetch(...);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada API
        alert('Reserva cancelada con éxito');
        await loadReservas();
        renderReservas('pendientes');
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        alert('Error al cancelar la reserva');
    }
}

async function descargarDeNuevo(idLibro) {
    try {
        console.log(`Iniciando nueva descarga del libro con ID: ${idLibro}`);
        // Implementación real: llamada a API
        // const response = await fetch(...);
        // Procesar descarga...
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular descarga
        alert('Descarga iniciada');
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('Error al iniciar la descarga');
    }
}

async function guardarPerfil() {
    try {
        const datosActualizados = {
            nombre: document.getElementById('nombre').value,
            especialidad: document.getElementById('especialidad').value,
            grado: document.getElementById('grado').value,
            carrera: document.getElementById('carrera').value,
            correo: document.getElementById('correo').value
        };

        console.log('Guardando cambios:', datosActualizados);
        // Implementación real: llamada a API
        // await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.actualizarPerfil}`, {
        //     method: 'POST',
        //     body: JSON.stringify(datosActualizados)
        // });

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular guardado
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
