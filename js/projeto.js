(function () {
  "use strict";

  /* Página de projeto: as fotos já estão no HTML (geradas por tools/gerar-portfolio.ps1).
     Aqui só tratamos a foto ampliada. */
  var fotos = Array.prototype.slice.call(document.querySelectorAll(".project__photo"));
  var lb = document.getElementById("lightbox");
  if (!fotos.length || !lb) return;

  var lbImg = document.getElementById("lbImg");
  var lbCount = document.getElementById("lbCount");
  var current = 0, lastFocus = null;

  function show(i) {
    current = (i + fotos.length) % fotos.length;
    var img = fotos[current].querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = (current + 1) + " / " + fotos.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  fotos.forEach(function (btn, i) { btn.addEventListener("click", function () { open(i); }); });
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", function () { show(current - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  // Deslizar para o lado no celular troca de foto
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
