/* ==========================================================================
   Avi Motta — Portfolio
   JavaScript mínimo, sin dependencias.

   El diseño original de Readymag tenía una sola animación real: el párrafo
   de "About" caía 38 px cuando entraba en el viewport (un offset-path que se
   recorría una única vez). Reproducimos exactamente eso con
   IntersectionObserver, respetando prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");

  function showAll() {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("is-in");
    });
  }

  // Sin animación o sin soporte del observer: mostrar desde el inicio.
  if (prefersReduced || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target); // animación de una sola vez
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();
