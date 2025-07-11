document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    const rol = document.getElementById('rol').value;

    if (usuario === '' || password === '' || rol === '') {
      mensaje.textContent = 'Por favor, complete todos los campos.';
      mensaje.style.color = 'red';
    } else {
      mensaje.style.color = 'green';
      mensaje.textContent = `Bienvenido, ${usuario} (${rol})`;

      setTimeout(() => {
        switch (rol) {
          case 'bibliotecario':
            window.location.href = 'dashboard-biblio.html';
            break;
          case 'docente':
            window.location.href = 'dashboard-docente.html';
            break;
          case 'estudiante':
            window.location.href = 'dashboard-estudiante.html';
            break;
          case 'externo':
            window.location.href = 'dashboard-externo.html';
            break;
          default:
            window.location.href = 'dashboard.html';
        }
      }, 1500);
    }
  });
});
