document.addEventListener('DOMContentLoaded', function() {
  // Datos de ejemplo basados en tu base de datos
  const sampleData = {
    books: [
      { id: 5, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", categoria: "Novela", estado: "Disponible", editorial: "Sudamericana", anio: 1967 },
      { id: 6, titulo: "1984", autor: "George Orwell", categoria: "Distopía", estado: "Prestado", editorial: "Secker & Warburg", anio: 1949 },
      { id: 7, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", categoria: "Novela", estado: "Disponible", editorial: "Francisco de Robles", anio: 1605 },
      { id: 8, titulo: "La Odisea", autor: "Homero", categoria: "Épico", estado: "Disponible", editorial: "Gredos", anio: -800 },
      { id: 9, titulo: "La Divina Comedia", autor: "Dante Alighieri", categoria: "Poesía", estado: "Reservado", editorial: "Mondadori", anio: 1320 }
    ],
    users: [
      { id: 1, nombre: "Ana", apellido: "Torres", tipo: "Estudiante", correo: "ana.torres@uni.edu", estado: "Activo", matricula: "MAT2021001", carrera: "Ingeniería de Sistemas" },
      { id: 2, nombre: "Luis", apellido: "Pérez", tipo: "Estudiante", correo: "luis.perez@uni.edu", estado: "Activo", matricula: "MAT2021002", carrera: "Biología" },
      { id: 9, nombre: "Camila", apellido: "Morales", tipo: "Docente", correo: "camila.morales@uni.edu", estado: "Activo", especialidad: "Inteligencia Artificial", grado: "PhD" },
      { id: 13, nombre: "Isabella", apellido: "Reyes", tipo: "Externo", correo: "isabella.reyes@uni.edu", estado: "Activo", matricula: "EXT001" }
    ],
    loans: [
      { id: 1, usuario: "Carlos Gómez", libro: "Rayuela", fechaPrestamo: "2025-07-20", fechaDevolucion: "2025-07-27", estado: "Activo", diasRestantes: 7 },
      { id: 2, usuario: "Elena Martínez", libro: "En busca del tiempo perdido", fechaPrestamo: "2025-07-18", fechaDevolucion: "2025-07-25", estado: "Activo", diasRestantes: 5 },
      { id: 3, usuario: "María López", libro: "Matar a un ruiseñor", fechaPrestamo: "2025-07-15", fechaDevolucion: "2025-07-22", estado: "Vencido", diasAtraso: 3 }
    ],
    reservations: [
      { id: 1, usuario: "Jorge Sánchez", libro: "1984", fecha: "2025-07-20", estado: "Pendiente" },
      { id: 2, usuario: "Lucía Fernández", libro: "La Odisea", fecha: "2025-07-19", estado: "Pendiente" },
      { id: 3, usuario: "Pedro Ramírez", libro: "Orgullo y Prejuicio", fecha: "2025-07-15", notificacion: "2025-07-18", estado: "Completado" }
    ]
  };

  // Cambio entre pestañas del menú principal
  const menuItems = document.querySelectorAll('.sidebar-menu li');
  const contentSections = document.querySelectorAll('.content-section');

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remover clase active de todos los items
      menuItems.forEach(i => i.classList.remove('active'));
      // Añadir clase active al item clickeado
      this.classList.add('active');

      // Ocultar todas las secciones
      contentSections.forEach(section => {
        section.classList.remove('active');
      });

      // Mostrar la sección correspondiente
      const target = this.getAttribute('data-target');
      document.getElementById(target).classList.add('active');

      // Actualizar título de la página
      document.getElementById('page-title').textContent = this.querySelector('span').textContent;

      // Cargar datos específicos de la sección
      loadSectionData(target);
    });
  });

  // Cargar datos según la sección
  function loadSectionData(section) {
    switch(section) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'libros':
        loadBooks();
        break;
      case 'prestamos':
        loadLoans();
        break;
      case 'reservas':
        loadReservations();
        break;
      case 'usuarios':
        loadUsers();
        break;
      case 'reportes':
        loadReports();
        break;
    }
  }

  // Cargar dashboard
  function loadDashboard() {
    // Datos para el gráfico de préstamos por categoría
    const loansByCategoryData = {
      labels: ['Novela', 'Poesía', 'Teatro', 'Distopía', 'Fábula', 'Épico'],
      datasets: [{
        data: [65, 25, 20, 15, 10, 5],
        backgroundColor: [
          'rgba(139, 0, 0, 0.7)',
          'rgba(94, 80, 63, 0.7)',
          'rgba(226, 183, 20, 0.7)',
          'rgba(60, 141, 188, 0.7)',
          'rgba(0, 166, 90, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderWidth: 1
      }]
    };

    // Crear gráfico de préstamos por categoría
    const loansByCategoryCtx = document.getElementById('loans-by-category').getContext('2d');
    new Chart(loansByCategoryCtx, {
      type: 'doughnut',
      data: loansByCategoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });

    // Simular datos actualizados cada 10 segundos (opcional)
    setInterval(() => {
      // Rotar los números de las tarjetas para demostración
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(num => {
        const current = parseInt(num.textContent.replace(/,/g, ''));
        num.textContent = (current + Math.floor(Math.random() * 3)).toLocaleString();
      });
    }, 10000);
  }

  // Cargar libros
  function loadBooks() {
    const booksTable = document.getElementById('books-table').querySelector('tbody');
    booksTable.innerHTML = '';

    sampleData.books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.titulo}</td>
        <td>${book.autor}</td>
        <td>${book.categoria}</td>
        <td><span class="status ${book.estado.toLowerCase()}">${book.estado}</span></td>
        <td>
          <button class="btn-icon edit-book" data-id="${book.id}" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete-book" data-id="${book.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
        </td>
      `;
      booksTable.appendChild(row);
    });

    // Configurar eventos para los botones de editar/eliminar
    document.querySelectorAll('.edit-book').forEach(btn => {
      btn.addEventListener('click', function() {
        const bookId = this.getAttribute('data-id');
        editBook(bookId);
      });
    });

    document.querySelectorAll('.delete-book').forEach(btn => {
      btn.addEventListener('click', function() {
        const bookId = this.getAttribute('data-id');
        if(confirm('¿Seguro que deseas eliminar este tomo?')) {
          // Aquí iría el código para eliminar el libro
          alert(`Tomo con ID ${bookId} eliminado (simulado)`);
          loadBooks(); // Recargar la lista
        }
      });
    });
  }

  // Editar libro
  function editBook(bookId) {
    const book = sampleData.books.find(b => b.id == bookId);
    if (!book) return;

    document.getElementById('modal-book-title').textContent = `Editar Tomo: ${book.titulo}`;
    document.getElementById('book-id').value = book.id;
    document.getElementById('book-title').value = book.titulo;
    document.getElementById('book-author').value = book.autor;
    document.getElementById('book-publisher').value = book.editorial || '';
    document.getElementById('book-category').value = book.categoria;
    document.getElementById('book-year').value = book.anio || '';
    document.getElementById('book-status').value = book.estado;

    document.getElementById('book-modal').style.display = 'block';
  }

  // Cargar préstamos
  function loadLoans() {
    // Llenar tabla de préstamos activos
    const activeTable = document.getElementById('active-loans-table').querySelector('tbody');
    activeTable.innerHTML = '';

    sampleData.loans.filter(loan => loan.estado === 'Activo').forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.usuario}</td>
            <td>${loan.libro}</td>
            <td>${formatDate(loan.fechaPrestamo)}</td>
            <td>${formatDate(loan.fechaDevolucion)}</td>
            <td>${loan.diasRestantes}</td>
            <td>
                <button class="btn-icon return-loan" data-id="${loan.id}" title="Registrar Devolución">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="btn-icon renew-loan" data-id="${loan.id}" title="Renovar Préstamo">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </td>
        `;
        activeTable.appendChild(row);
    });

    // Llenar tabla de préstamos vencidos
    const overdueTable = document.getElementById('overdue-loans-table').querySelector('tbody');
    overdueTable.innerHTML = '';

    sampleData.loans.filter(loan => loan.estado === 'Vencido').forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.usuario}</td>
            <td>${loan.libro}</td>
            <td>${formatDate(loan.fechaPrestamo)}</td>
            <td>${formatDate(loan.fechaDevolucion)}</td>
            <td>${loan.diasAtraso}</td>
            <td>
                <button class="btn-icon notify-loan" data-id="${loan.id}" title="Notificar Usuario">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="btn-icon return-loan" data-id="${loan.id}" title="Registrar Devolución">
                    <i class="fas fa-check-circle"></i>
                </button>
            </td>
        `;
        overdueTable.appendChild(row);
    });

    // Llenar tabla de historial de préstamos
    const historyTable = document.getElementById('history-loans-table').querySelector('tbody');
    historyTable.innerHTML = '';

    // Datos simulados de historial
    const historyLoans = [
        { id: 4, usuario: "Ana Torres", libro: "Cien Años de Soledad", fechaPrestamo: "2025-07-10", fechaDevolucion: "2025-07-17", estado: "Completado" },
        { id: 5, usuario: "Luis Pérez", libro: "1984", fechaPrestamo: "2025-07-05", fechaDevolucion: "2025-07-12", estado: "Completado" },
        { id: 6, usuario: "Jorge Sánchez", libro: "Don Quijote", fechaPrestamo: "2025-06-28", fechaDevolucion: "2025-07-05", estado: "Completado" }
    ];

    historyLoans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.usuario}</td>
            <td>${loan.libro}</td>
            <td>${formatDate(loan.fechaPrestamo)}</td>
            <td>${formatDate(loan.fechaDevolucion)}</td>
            <td><span class="status ${loan.estado.toLowerCase()}">${loan.estado}</span></td>
        `;
        historyTable.appendChild(row);
    });

    // Configurar eventos para los botones
    document.querySelectorAll('.return-loan').forEach(btn => {
        btn.addEventListener('click', function() {
            const loanId = this.getAttribute('data-id');
            if (confirm('¿Registrar devolución de este préstamo?')) {
                alert(`Préstamo ${loanId} marcado como devuelto (simulado)`);
                loadLoans();
            }
        });
    });

    document.querySelectorAll('.renew-loan').forEach(btn => {
        btn.addEventListener('click', function() {
            const loanId = this.getAttribute('data-id');
            const newDate = prompt("Ingrese la nueva fecha de devolución (YYYY-MM-DD):", "2025-08-01");
            if (newDate) {
                alert(`Préstamo ${loanId} renovado hasta ${newDate} (simulado)`);
                loadLoans();
            }
        });
    });

    document.querySelectorAll('.notify-loan').forEach(btn => {
        btn.addEventListener('click', function() {
            const loanId = this.getAttribute('data-id');
            alert(`Notificación enviada al usuario sobre préstamo vencido ${loanId} (simulado)`);
        });
    });
  }

  //cargar reservas
  function loadReservations() {
    // Datos de ejemplo para reservas
    const sampleReservations = {
        pending: [
            { id: 1, usuario: "Jorge Sánchez", libro: "1984", fecha: "2025-07-20", estado: "Pendiente" },
            { id: 2, usuario: "Lucía Fernández", libro: "La Odisea", fecha: "2025-07-19", estado: "Pendiente" }
        ],
        completed: [
            { id: 3, usuario: "Pedro Ramírez", libro: "Orgullo y Prejuicio", fecha: "2025-07-15", notificacion: "2025-07-18", estado: "Completado" },
            { id: 4, usuario: "Ana Torres", libro: "Cien Años de Soledad", fecha: "2025-07-10", notificacion: "2025-07-12", estado: "Completado" }
        ],
        cancelled: [
            { id: 5, usuario: "María López", libro: "Ulises", fecha: "2025-07-08", cancelacion: "2025-07-10", motivo: "Disponibilidad inmediata", estado: "Cancelado" },
            { id: 6, usuario: "Carlos Gómez", libro: "Hamlet", fecha: "2025-07-05", cancelacion: "2025-07-07", motivo: "Usuario no respondió", estado: "Cancelado" }
        ]
    };

    // Llenar tabla de reservas pendientes
    const pendingTable = document.getElementById('pending-reservations-table').querySelector('tbody');
    pendingTable.innerHTML = '';
    sampleReservations.pending.forEach(res => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.usuario}</td>
            <td>${res.libro}</td>
            <td>${formatDate(res.fecha)}</td>
            <td>
                <button class="btn-icon manage-reservation" data-id="${res.id}" title="Gestionar">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="btn-icon cancel-reservation-btn" data-id="${res.id}" title="Cancelar">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        pendingTable.appendChild(row);
    });

    // Llenar tabla de reservas completadas
    const completedTable = document.getElementById('completed-reservations-table').querySelector('tbody');
    completedTable.innerHTML = '';
    sampleReservations.completed.forEach(res => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.usuario}</td>
            <td>${res.libro}</td>
            <td>${formatDate(res.fecha)}</td>
            <td>${formatDate(res.notificacion)}</td>
            <td><span class="status ${res.estado.toLowerCase()}">${res.estado}</span></td>
        `;
        completedTable.appendChild(row);
    });

    // Llenar tabla de reservas canceladas
    const cancelledTable = document.getElementById('cancelled-reservations-table').querySelector('tbody');
    cancelledTable.innerHTML = '';
    sampleReservations.cancelled.forEach(res => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.usuario}</td>
            <td>${res.libro}</td>
            <td>${formatDate(res.fecha)}</td>
            <td>${formatDate(res.cancelacion)}</td>
            <td>${res.motivo}</td>
        `;
        cancelledTable.appendChild(row);
    });

    // Configurar eventos para los botones
    document.querySelectorAll('.manage-reservation').forEach(btn => {
        btn.addEventListener('click', function() {
            const resId = this.getAttribute('data-id');
            const reservation = sampleReservations.pending.find(r => r.id == resId);

            if (reservation) {
                document.getElementById('reservation-user').textContent = reservation.usuario;
                document.getElementById('reservation-book').textContent = reservation.libro;
                document.getElementById('reservation-date').textContent = formatDate(reservation.fecha);
                document.getElementById('reservation-modal').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.cancel-reservation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const resId = this.getAttribute('data-id');
            const reason = prompt("Ingrese el motivo de cancelación:");
            if (reason) {
                alert(`Reserva ${resId} cancelada. Motivo: ${reason} (simulado)`);
                loadReservations();
            }
        });
    });

    // Configurar modal de nueva reserva
    setupModal('new-reservation-btn', 'new-reservation-modal');

    // Configurar evento para el select de acción
    document.getElementById('reservation-action').addEventListener('change', function() {
      const cancelReasonGroup = document.getElementById('cancel-reason-group');
      cancelReasonGroup.style.display = this.value === 'cancel' ? 'block' : 'none';
    });

    // Configurar formulario de reserva
    document.getElementById('reservation-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const action = document.getElementById('reservation-action').value;

      if (action === 'notify') {
        alert('Usuario notificado sobre disponibilidad del libro');
      } else if (action === 'cancel') {
        const reason = document.getElementById('cancel-reason').value;
        alert(`Reserva cancelada. Motivo: ${reason}`);
      }

      document.getElementById('reservation-modal').style.display = 'none';
      loadReservations();
    });
  }

  // Cargar usuarios
  function loadUsers() {
    const usersTable = document.getElementById('users-table').querySelector('tbody');
    usersTable.innerHTML = '';

    sampleData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre} ${user.apellido}</td>
            <td>${user.tipo}</td>
            <td>${user.correo}</td>
            <td><span class="status ${user.estado.toLowerCase()}">${user.estado}</span></td>
            <td>
                <div class="actions-container">
                    <button class="btn-icon edit-user" data-id="${user.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon toggle-user" data-id="${user.id}" data-status="${user.estado}"
                        title="${user.estado === 'Activo' ? 'Bloquear' : 'Desbloquear'}">
                        <i class="fas ${user.estado === 'Activo' ? 'fa-lock' : 'fa-unlock'}"></i>
                    </button>
                    <button class="btn-icon restrict-user" data-id="${user.id}" title="Restringir acceso">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn-icon notify-user" data-id="${user.id}" title="Notificar usuario">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn-icon delete-user" data-id="${user.id}" title="Eliminar usuario">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        usersTable.appendChild(row);
    });

    // Configurar eventos para los botones de editar/bloquear
    document.querySelectorAll('.edit-user').forEach(btn => {
      btn.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        editUser(userId);
      });
    });

    document.querySelectorAll('.toggle-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');
            const newStatus = currentStatus === 'Activo' ? 'Bloqueado' : 'Activo';

            if (confirm(`¿${currentStatus === 'Activo' ? 'Bloquear' : 'Desbloquear'} este usuario?`)) {
                alert(`Usuario ${userId} ${newStatus.toLowerCase()} (simulado)`);
                loadUsers();
            }
        });
    });

    document.querySelectorAll('.restrict-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const restriction = prompt("Ingrese el tipo de restricción (Ej: Sin préstamos, Solo consulta, etc.):");
            if (restriction) {
                alert(`Usuario ${userId} restringido: ${restriction} (simulado)`);
            }
        });
    });

    document.querySelectorAll('.notify-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const message = prompt("Ingrese el mensaje para el usuario:");
            if (message) {
                alert(`Notificación enviada al usuario ${userId}: "${message}" (simulado)`);
            }
        });
    });

    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            if (confirm(`¿Está seguro de eliminar permanentemente al usuario ${userId}?`)) {
                alert(`Usuario ${userId} eliminado (simulado)`);
                loadUsers();
            }
        });
    });
  }

  // Editar usuario
  function editUser(userId) {
    const user = sampleData.users.find(u => u.id == userId);
    if (!user) return;

    document.getElementById('modal-user-title').textContent = `Editar Usuario: ${user.nombre} ${user.apellido}`;
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-name').value = user.nombre;
    document.getElementById('user-lastname').value = user.apellido;
    document.getElementById('user-email').value = user.correo;
    document.getElementById('user-type').value = user.tipo;
    document.getElementById('user-status').value = user.estado;

    // Mostrar campos específicos según el tipo de usuario
    document.getElementById('student-fields').style.display = 'none';
    document.getElementById('teacher-fields').style.display = 'none';

    if (user.tipo === 'Estudiante') {
      document.getElementById('student-fields').style.display = 'block';
      document.getElementById('user-matricula').value = user.matricula || '';
      document.getElementById('user-carrera').value = user.carrera || '';
    } else if (user.tipo === 'Docente') {
      document.getElementById('teacher-fields').style.display = 'block';
      document.getElementById('user-especialidad').value = user.especialidad || '';
      document.getElementById('user-grado').value = user.grado || '';
    }

    // Mostrar el modal
    document.getElementById('user-modal').style.display = 'block';
  }

  // Cargar reportes
  function loadReports() {
    // Datos para gráficos
    const topBooksData = {
      labels: ['Cien Años de Soledad', '1984', 'Don Quijote', 'La Odisea', 'El Principito'],
      data: [15, 12, 10, 8, 7]
    };

    const activeUsersData = {
      labels: ['Carlos Gómez', 'Ana Torres', 'Luis Pérez', 'Elena Martínez', 'María López'],
      data: [8, 6, 5, 4, 4]
    };

    const monthlyStatsData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
      loans: [45, 60, 55, 70, 65, 80, 35],
      reservations: [20, 25, 30, 28, 32, 40, 15]
    };

    const categoriesData = {
      labels: ['Novela', 'Poesía', 'Teatro', 'Distopía', 'Fábula', 'Épico'],
      data: [120, 45, 30, 25, 20, 15]
    };

    // Gráfico de libros más solicitados
    const topBooksCtx = document.getElementById('top-books-chart').getContext('2d');
    new Chart(topBooksCtx, {
      type: 'bar',
      data: {
        labels: topBooksData.labels,
        datasets: [{
          label: 'Préstamos',
          data: topBooksData.data,
          backgroundColor: 'rgba(94, 80, 63, 0.7)',
          borderColor: 'rgba(94, 80, 63, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Gráfico de usuarios más activos
    const activeUsersCtx = document.getElementById('active-users-chart').getContext('2d');
    new Chart(activeUsersCtx, {
      type: 'doughnut',
      data: {
        labels: activeUsersData.labels,
        datasets: [{
          label: 'Actividad',
          data: activeUsersData.data,
          backgroundColor: [
            'rgba(139, 0, 0, 0.7)',
            'rgba(94, 80, 63, 0.7)',
            'rgba(226, 183, 20, 0.7)',
            'rgba(60, 141, 188, 0.7)',
            'rgba(0, 166, 90, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    });

    // Gráfico de estadísticas mensuales
    const monthlyStatsCtx = document.getElementById('monthly-stats-chart').getContext('2d');
    new Chart(monthlyStatsCtx, {
      type: 'line',
      data: {
        labels: monthlyStatsData.labels,
        datasets: [
          {
            label: 'Préstamos',
            data: monthlyStatsData.loans,
            borderColor: 'rgba(139, 0, 0, 1)',
            backgroundColor: 'rgba(139, 0, 0, 0.1)',
            tension: 0.1
          },
          {
            label: 'Reservas',
            data: monthlyStatsData.reservations,
            borderColor: 'rgba(94, 80, 63, 1)',
            backgroundColor: 'rgba(94, 80, 63, 0.1)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Gráfico por categorías
    const categoriesCtx = document.getElementById('categories-chart').getContext('2d');
    new Chart(categoriesCtx, {
      type: 'polarArea',
      data: {
        labels: categoriesData.labels,
        datasets: [{
          label: 'Libros por categoría',
          data: categoriesData.data,
          backgroundColor: [
            'rgba(139, 0, 0, 0.7)',
            'rgba(94, 80, 63, 0.7)',
            'rgba(226, 183, 20, 0.7)',
            'rgba(60, 141, 188, 0.7)',
            'rgba(0, 166, 90, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ]
        }]
      }
    });

    // Configurar botones de reportes
    document.getElementById('generate-report').addEventListener('click', function() {
      alert('Reporte generado en formato PDF (simulado)');
    });

    document.getElementById('print-report').addEventListener('click', function() {
      window.print();
    });

    document.getElementById('apply-filters').addEventListener('click', function() {
      const startDate = document.getElementById('report-start-date').value;
      const endDate = document.getElementById('report-end-date').value;
      const reportType = document.getElementById('report-type').value;

      alert(`Filtros aplicados: ${startDate} a ${endDate}, Tipo: ${reportType}`);
      // Aquí iría el código para actualizar los gráficos con los filtros
    });
  }

  // Función para formatear fechas
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Configurar modales
  function setupModal(btnId, modalId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.close-modal');

    btn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Inicializar modales
  setupModal('add-book-btn', 'book-modal');
  setupModal('new-loan-btn', 'loan-modal');
  setupModal('new-user-btn', 'user-modal');

  // Configurar formularios
  document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Libro guardado con éxito (simulado)');
    document.getElementById('book-modal').style.display = 'none';
    loadBooks();
  });

  document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Préstamo registrado con éxito (simulado)');
    document.getElementById('loan-modal').style.display = 'none';
    loadLoans();
  });

  document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Usuario guardado con éxito (simulado)');
    document.getElementById('user-modal').style.display = 'none';
    loadUsers();
  });

  // Configurar cambio de tipo de usuario
  document.getElementById('user-type').addEventListener('change', function() {
    document.getElementById('student-fields').style.display = 'none';
    document.getElementById('teacher-fields').style.display = 'none';

    if (this.value === 'Estudiante') {
      document.getElementById('student-fields').style.display = 'block';
    } else if (this.value === 'Docente') {
      document.getElementById('teacher-fields').style.display = 'block';
    }
  });

  // Configurar botones de cancelar
  document.getElementById('cancel-book').addEventListener('click', function() {
    document.getElementById('book-modal').style.display = 'none';
  });

  document.getElementById('cancel-loan').addEventListener('click', function() {
    document.getElementById('loan-modal').style.display = 'none';
  });

  document.getElementById('cancel-user').addEventListener('click', function() {
    document.getElementById('user-modal').style.display = 'none';
  });

  document.getElementById('cancel-reservation').addEventListener('click', function() {
    document.getElementById('reservation-modal').style.display = 'none';
  });

  // Configurar tabs en préstamos y reservas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabContainer = this.closest('.tabs-medieval').parentElement;

      // Remover active de todos los botones y contenidos
      tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Activar el seleccionado
      this.classList.add('active');
      document.getElementById(this.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Cargar la sección inicial (dashboard)
  loadSectionData('dashboard');
});
