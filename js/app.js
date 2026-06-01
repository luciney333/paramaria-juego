// ============================================================
// CONTROLADOR DE PANTALLAS - Flujo de la aplicación
// ============================================================

let game = null;
let recuerdoActual = 0;
let videoElement = null;

// --- UTILIDADES ---

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach((p) => {
    p.classList.remove("activa");
  });
  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add("activa");
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- PANTALLA DE INICIO ---

function iniciarApp() {
  // Rellenar textos desde config
  document.getElementById("titulo-inicio").textContent = CONFIG.titulo;
  document.getElementById("subtitulo-inicio").textContent = CONFIG.subtitulo;
  document.getElementById("btn-empezar").textContent = CONFIG.botonEmpezar;

  mostrarPantalla("pantalla-inicio");
}

function empezarJuego() {
  recuerdoActual = 0;
  mostrarPantalla("pantalla-juego");
  iniciarNivel();
}

// --- JUEGO ---

function iniciarNivel() {
  const canvas = document.getElementById("game-canvas");
  if (game) game.stop();
  game = new Game(canvas);

  // Eventos de salto
  const saltar = () => game.jump();
  canvas.onclick = saltar;

  document.onkeydown = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      saltar();
    }
  };

  // Callbacks
  window.onDeath = () => {
    game.stop();
    mostrarRecuerdo();
  };

  window.onWin = () => {
    mostrarCelebracion();
  };

  game.start();
}

// --- RECUERDOS ---

function mostrarRecuerdo() {
  if (recuerdoActual >= CONFIG.recuerdos.length) {
    // Si ya se mostraron todos, seguir ciclando
    recuerdoActual = recuerdoActual % CONFIG.recuerdos.length;
  }

  const recuerdo = CONFIG.recuerdos[recuerdoActual];
  recuerdoActual++;

  // Rellenar tarjeta
  const foto = document.getElementById("recuerdo-foto");
  const frase = document.getElementById("recuerdo-frase");
  const contador = document.getElementById("recuerdo-contador");

  foto.src = recuerdo.foto;
  foto.onerror = () => {
    foto.style.display = "none";
    document.getElementById("recuerdo-foto-placeholder").style.display = "flex";
  };
  foto.onload = () => {
    foto.style.display = "block";
    document.getElementById("recuerdo-foto-placeholder").style.display = "none";
  };

  frase.textContent = recuerdo.frase;
  contador.textContent = `Recuerdo ${recuerdoActual} de ${CONFIG.recuerdos.length}`;

  mostrarPantalla("pantalla-recuerdo");
}

function continuarDesdeRecuerdo() {
  mostrarPantalla("pantalla-juego");
  iniciarNivel();
}

// --- CELEBRACIÓN (VICTORIA) ---

async function mostrarCelebracion() {
  mostrarPantalla("pantalla-celebracion");
  document.getElementById("texto-gano").textContent = CONFIG.textoGano;
  document.getElementById("texto-reflexion").textContent = CONFIG.textoReflexion;
  document.getElementById("btn-sorpresa").textContent = CONFIG.botonSorpresa;

  iniciarConfeti();

  await sleep(3000);
  document.getElementById("texto-reflexion").classList.add("visible");
  await sleep(1500);
  document.getElementById("btn-sorpresa").classList.add("visible");
}

// --- CONFETI ---

function iniciarConfeti() {
  const canvas = document.getElementById("confeti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colores = ["#f0abfc", "#c026d3", "#7c3aed", "#fde68a", "#34d399", "#60a5fa", "#fb923c"];
  const piezas = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    color: colores[Math.floor(Math.random() * colores.length)],
    vy: Math.random() * 3 + 2,
    vx: (Math.random() - 0.5) * 2,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.15,
    alpha: Math.random() * 0.5 + 0.5,
  }));

  let frames = 0;
  function animarConfeti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piezas.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.rotV;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frames++;
    if (frames < 360) {
      // ~6 segundos
      requestAnimationFrame(animarConfeti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animarConfeti();
}

// --- VÍDEO FINAL ---

function verSorpresa() {
  mostrarPantalla("pantalla-video");
  const video = document.getElementById("video-final");
  video.src = CONFIG.rutaVideo;

  video.onerror = () => {
    // Si no hay vídeo, saltar a pantalla final
    document.getElementById("video-error").style.display = "flex";
    document.getElementById("video-final").style.display = "none";
  };

  video.onended = () => {
    mostrarPantallaFinal();
  };

  video.play().catch(() => {
    document.getElementById("video-error").style.display = "flex";
    document.getElementById("video-final").style.display = "none";
  });
}

function saltarVideo() {
  const video = document.getElementById("video-final");
  video.pause();
  mostrarPantallaFinal();
}

// --- PANTALLA FINAL ---

async function mostrarPantallaFinal() {
  mostrarPantalla("pantalla-final");

  const mensaje = document.getElementById("mensaje-final");
  const btnVolver = document.getElementById("btn-volver");

  // Formatear saltos de línea
  mensaje.innerHTML = CONFIG.mensajeFinal
    .split("\n")
    .map((l) => `<span>${l || "&nbsp;"}</span>`)
    .join("<br>");

  btnVolver.textContent = CONFIG.botonVolver;

  // Animación línea a línea
  const spans = mensaje.querySelectorAll("span");
  for (let i = 0; i < spans.length; i++) {
    await sleep(200);
    spans[i].classList.add("visible");
  }

  await sleep(500);
  btnVolver.classList.add("visible");
}

function volverAlInicio() {
  if (game) {
    game.stop();
    game = null;
  }

  // Reset completo del vídeo
  const video = document.getElementById("video-final");
  video.pause();
  video.src = "";
  video.load();
  document.getElementById("video-error").style.display = "none";
  document.getElementById("video-final").style.display = "block";

  // Reset pantalla celebración
  document.getElementById("texto-reflexion").classList.remove("visible");
  document.getElementById("btn-sorpresa").classList.remove("visible");

  // Reset pantalla final
  document.getElementById("btn-volver").classList.remove("visible");

  // Reset contador de recuerdos
  recuerdoActual = 0;

  mostrarPantalla("pantalla-inicio");
}

// --- ARRANCAR ---
window.addEventListener("DOMContentLoaded", iniciarApp);
