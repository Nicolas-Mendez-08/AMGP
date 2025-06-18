// Desplazamiento suave al hacer clic en botones con clase "scroll"
document.querySelectorAll('.scroll').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.getElementById("formulario-contacto").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !correo || !mensaje) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Aquí iría el código para enviar datos real (más adelante)
  document.getElementById("mensaje-confirmacion").style.display = "block";
  this.reset();
});
// Animación al hacer scroll
const secciones = document.querySelectorAll("section, header, footer");

const mostrar = () => {
  secciones.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", mostrar);
window.addEventListener("load", mostrar);
