// ============================================================
// ARCHIVO DE CONFIGURACIÓN - PERSONALIZA AQUÍ TODO EL JUEGO
// ============================================================

const CONFIG = {

  // --- NOMBRES ---
  nombreProtagonista: "María",
  nombreRemitente: "Lucía",
  edadCumple: 20,

  // --- PANTALLA DE INICIO ---
  titulo: "Las aventuras de María y Lucía",
  subtitulo: "Un pequeño viaje para alguien muy especial ✨",
  botonEmpezar: "Comenzar",

  // --- RECUERDOS (se muestran al perder) ---
  // Las fotos deben estar en: assets/fotos/
  // Nómbralas: foto1.jpg, foto2.jpg, foto3.jpg, foto4.jpg, foto5.jpg
  recuerdos: [
    {
      foto: "assets/fotos/foto1.jpeg",
      frase: "💥 BOOMBAAA la primera en la cara, aquí empezó todo. Una de las primeras fotos de tantas..."
    },
    {
      foto: "assets/fotos/foto2.jpeg",
      frase: "Esta foto representa una vuelta a nuestras vidas, sobre todo cuando más nos necesitábamos las dos. Fue la primera después de casi 6 años sin contacto. 🤍"
    },
    {
      foto: "assets/fotos/foto3.jpeg",
      frase: "🎵 Nuestro primer concierto juntas. Tú muy dela y yo muy morad xxd"
    },
    {
      foto: "assets/fotos/foto4.jpeg",
      frase: "Cómo olvidar este día... Creo que ahí nos dimos cuenta de que nunca perdimos la vibra entre nosotras, que realmente nuestra amistad era pura. 💫"
    },
    {
      foto: "assets/fotos/foto5.jpeg",
      frase: "Gracias por estar conmigo en ese día tan bonito, pequeña cómplice de mi hermana jejejej 🥹"
    }
  ],

  // --- PANTALLA DE CELEBRACIÓN (al completar el nivel) ---
  textoGano: "¡Lo conseguiste, María! 🎉",
  textoReflexion: "Pero este juego nunca fue realmente sobre ganar.",
  botonSorpresa: "Ver sorpresa final 🎬",

  // --- VÍDEO FINAL ---
  // Pon tu vídeo en: assets/video/
  // Nómbralo: video.mp4
  rutaVideo: "assets/video/video.mp4",

  // --- PANTALLA FINAL (después del vídeo) ---
  mensajeFinal: `No ha sido el regalo más caro, pero es único y espero que te guste. 

Felices 20 María, te amo con todo mi corazón, hermana. 

Preparando esto habré llorado como 3 veces, que emocional soy, coño jajaja. 

Ojalá sigamos progresando juntas... 🌸`,

  botonVolver: "Volver al inicio 🔄",

  // --- DIFICULTAD DEL JUEGO ---
  // Ajusta cuántos obstáculos hay y su velocidad
 velocidadJuego: 9,
 frecuenciaObstaculos: 90,
 maxObstaculos: 5,
};
