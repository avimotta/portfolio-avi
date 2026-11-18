/* ==========================================================================
   La historia: el portfolio es una canción.

   Cada sección es una parte del tema y las animaciones la cuentan en orden:
     Intro      → Hero: el nombre entra palabra por palabra y los puntos laten.
     Estrofa    → About: los párrafos aparecen de a uno.
     Estribillo → On repeat: el tracklist carga track por track.
     Canciones  → Proyectos: cada uno entra con su propio movimiento.
     Outro      → Contact: el título cierra el tema y después aparecen los links.
   La barra de progreso del menú avanza con el scroll, como una canción.

   Todo usa Motion (https://motion.dev):
     animate  → anima elementos
     inView   → avisa cuando un elemento entra en pantalla
     scroll   → conecta algo con el avance del scroll
     stagger  → escalona varios elementos, uno detrás del otro

   Un mismo "idioma" en todo el sitio: los elementos suben desde abajo, con la
   misma curva y duraciones parecidas. La excepción son las pantallas de los
   proyectos 1 y 4, que llegan desde lados opuestos y se encuentran.

   Los elementos arrancan invisibles solo si <html> tiene la clase "motion"
   (la pone un script en el <head>). Sin JavaScript o con
   prefers-reduced-motion, todo se ve desde el principio y sin movimiento.
   ========================================================================== */

import { animate, inView, scroll, stagger } from "motion";

// Avisa al script del <head> que las animaciones cargaron (si no, muestra todo).
window.__storyReady = true;

const EASE = [0.22, 0.61, 0.36, 1]; // la misma curva que usaba la animación original
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ── Barra de progreso: la canción avanza con el scroll ─────────────────────
   No es una animación decorativa: acompaña el scroll del usuario, así que se
   mantiene también con prefers-reduced-motion. */
const progress = $(".site-progress-fill");
if (progress) {
  scroll((p) => {
    progress.style.transform = `scaleX(${p})`;
  });
}

// Con menos movimiento no hay animaciones de entrada: todo queda visible.
if (!reduced) tell();

/* Ejecuta la animación una sola vez, cuando `trigger` entra en pantalla.
   amount: qué parte del elemento tiene que verse (0.3 = 30 %). */
function onceInView(trigger, play, amount = 0.3) {
  if (!trigger) return;
  const stop = inView(
    trigger,
    () => {
      play();
      stop();
    },
    { amount }
  );
}

// Subir desde abajo y aparecer: el movimiento base de todo el sitio.
function rise(targets, { delay = 0, y = 28, duration = 0.8 } = {}) {
  return animate(
    targets,
    { opacity: [0, 1], y: [y, 0] },
    { duration, delay, ease: EASE }
  );
}

function tell() {
  intro();
  verse();
  chorus();
  songs();
  outro();
}

/* ── Intro: Hero ─────────────────────────────────────────────────────────── */
function intro() {
  // La foto se acerca suave, como el primer acorde.
  animate(".hero-photo", { opacity: [0, 1], scale: [1.08, 1] }, { duration: 1.6, ease: EASE });

  // "Avi" y "Motta" entran de a una palabra; después el rol.
  rise(".hero-word", { delay: stagger(0.25, { startDelay: 0.4 }), y: 40, duration: 1 });
  rise(".t-role", { delay: 1.05 });

  // Los puntos del ángulo laten a 120 BPM (un pulso cada medio segundo),
  // solo mientras el hero está en pantalla.
  const dots = $$(".dot");
  if (dots.length) {
    inView(".hero-stage", () => {
      const beat = animate(
        dots,
        { scale: [1, 1.5, 1] },
        { duration: 0.5, repeat: Infinity, ease: "easeOut" }
      );
      return () => beat.stop();
    });
  }
}

/* ── Primera estrofa: About ──────────────────────────────────────────────── */
function verse() {
  const title = $("#about-title");
  const paragraphs = $$(".about-copy p");

  onceInView(title, () => {
    rise(title);
    rise(paragraphs, { delay: stagger(0.35, { startDelay: 0.25 }) });

    // La flecha de "Keep scrolling" rebota: invita a seguir bajando.
    const cue = $(".about-cue");
    if (cue) {
      const start = 0.25 + 0.35 * paragraphs.length + 0.4;
      animate(cue, { y: [0, 8, 0] }, { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: start });
    }
  });
}

/* ── Estribillo: On repeat ───────────────────────────────────────────────── */
function chorus() {
  const section = $(".s-repeat");
  if (!section) return;

  onceInView($("#repeat-title"), () => {
    rise($$("#repeat-title, .repeat-intro", section), { delay: stagger(0.15) });
    // El tracklist carga un track detrás del otro.
    rise($$(".repeat-list li", section), { delay: stagger(0.12, { startDelay: 0.35 }), y: 20 });
    rise($$(".repeat-now, .repeat-credit", section), { delay: stagger(0.2, { startDelay: 0.8 }) });
  });

  // Al cambiar de track, el título y el artista nuevos entran en vez de saltar.
  // OnRepeat ya cambió el texto (su listener se registró antes que este).
  const info = $$(".repeat-label, .repeat-title, .repeat-artist, .repeat-link", section);
  $$(".repeat-pick", section).forEach((pick) => {
    pick.addEventListener("click", () => {
      rise(info, { delay: stagger(0.06), y: 12, duration: 0.45 });
    });
  });

  // La carátula aparece cuando termina de cargar, como un disco que se pone.
  const cover = $(".repeat-cover img", section);
  if (cover) {
    cover.addEventListener("load", () => {
      animate(cover, { opacity: [0, 1], scale: [0.85, 1] }, { duration: 0.5, ease: EASE });
    });
  }
}

/* ── Las canciones: los cuatro proyectos ─────────────────────────────────── */
function songs() {
  // Título y descripción de cada proyecto suben al entrar, como en el resto del sitio.
  $$(".s-project .h-section, .s-project .body").forEach((el) => {
    onceInView(el, () => rise(el), 0.4);
  });

  // UMAI TV y folklore: las dos pantallas llegan desde lados opuestos y se encuentran.
  ["p1", "p4"].forEach((id) => {
    const shots = $$(`.s-${id} .shot`);
    if (shots.length < 2) return;
    onceInView(shots[0], () => {
      animate(shots[0], { opacity: [0, 1], x: [-80, 0] }, { duration: 0.9, ease: EASE });
      animate(shots[1], { opacity: [0, 1], x: [80, 0] }, { duration: 0.9, delay: 0.2, ease: EASE });
    }, 0.25);
  });

  // UMAI TV: "click the screens and see!" aparece cuando ya están las pantallas.
  const hints = $$(".s-p1 .hint, .s-p1 .arrow");
  onceInView($(".s-p1 .shot"), () => {
    animate(hints, { opacity: [0, 1] }, { duration: 0.6, delay: stagger(0.15, { startDelay: 0.9 }) });
  }, 0.25);

  // JukeBox: los tres celulares aparecen uno tras otro, como tres canciones del ranking.
  const phones = $$(".s-p2 .phone");
  onceInView(phones[0], () => {
    rise(phones, { delay: stagger(0.18), y: 60, duration: 0.9 });
  }, 0.25);

  // Babeblade: el sitio de la artista emergente "emerge", crece desde un poco más chico.
  const artist = $(".s-p3 .shot");
  onceInView(artist, () => {
    animate(artist, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 1, ease: EASE });
  }, 0.3);
}

/* ── Outro: Contact ──────────────────────────────────────────────────────── */
function outro() {
  const title = $("#contact-title");
  onceInView(title, () => {
    // El título entra un poco más grande y se asienta: el acorde final.
    animate(title, { opacity: [0, 1], scale: [1.12, 1] }, { duration: 1.1, ease: EASE });
    rise($$(".s-contact .t-email, .s-contact .pill"), { delay: stagger(0.15, { startDelay: 0.5 }) });
  }, 0.5);
}
