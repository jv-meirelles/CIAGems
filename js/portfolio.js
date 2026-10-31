(function () {
  "use strict";

  /* Carrossel infinito do portfólio: um card por projeto (dados em js/projects.js).
     A lista aparece três vezes; ao parar de rolar perto de uma das pontas, a posição
     volta para a cópia do meio sem salto visível. Cada card abre o projeto em nova aba. */
  var projetos = window.CASAC_PROJETOS || [];
  var carousel = document.getElementById("carousel");
  var track = document.getElementById("carouselTrack");
  var bar = document.getElementById("carouselBar");
  var prev = document.getElementById("carouselPrev");
  var next = document.getElementById("carouselNext");
  if (!track || !projetos.length) return;

  function card(p, clone) {
    var a = document.createElement("a");
    a.className = "project-card";
    a.href = "projetos/" + p.slug + "/";
    a.target = "_blank";
    a.rel = "noopener";
    a.draggable = false;
    if (clone) { a.setAttribute("aria-hidden", "true"); a.tabIndex = -1; }
    a.innerHTML =
      '<div class="project-card__img"><img src="img/portfolio/' + p.slug + '/capa.jpg" alt="' + (clone ? "" : p.nome) + '" loading="lazy" draggable="false"></div>' +
      '<div class="project-card__meta"><strong>' + p.nome + "</strong><span>" + p.local + "</span></div>";
    return a;
  }
  [true, false, true].forEach(function (clone) {
    projetos.forEach(function (p) { track.appendChild(card(p, clone)); });
  });

  var cards = track.children;
  var n = projetos.length;
  function setWidth() { return cards[n].offsetLeft - cards[0].offsetLeft; }
  function step() { return cards[1].offsetLeft - cards[0].offsetLeft; }

  // Começa na cópia do meio
  function center() { track.scrollLeft = setWidth(); update(); }

  // Ao parar de rolar fora da cópia do meio, volta para a posição equivalente nela
  function normalize() {
    var w = setWidth();
    if (!w) return;
    if (track.scrollLeft < w * 0.5 || track.scrollLeft > w * 1.5) {
      track.classList.add("is-jumping");
      track.scrollLeft += track.scrollLeft < w * 0.5 ? w : -w;
      requestAnimationFrame(function () { track.classList.remove("is-jumping"); });
    }
  }

  // Barra de progresso: posição dentro de uma volta completa da lista
  function update() {
    var w = setWidth();
    if (!w) return;
    var pos = ((track.scrollLeft - w) % w + w) % w;
    var visible = Math.min(1, track.clientWidth / w);
    bar.style.width = Math.max(10, visible * 100) + "%";
    bar.style.transform = "translateX(" + (pos / w) * (100 / Math.max(visible, 0.1)) + "%)";
  }

  var timer = null;
  track.addEventListener("scroll", function () {
    update();
    clearTimeout(timer);
    timer = setTimeout(function () { if (!down) normalize(); }, 160);
  }, { passive: true });
  window.addEventListener("resize", center);
  window.addEventListener("load", center);
  center();

  prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
  next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });

  // Arrastar com o mouse (no toque, a rolagem lateral já é nativa)
  var down = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
  });
  window.addEventListener("pointermove", function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    // Só vira arraste depois de mexer o mouse; antes disso o clique continua abrindo o projeto
    if (!moved && Math.abs(dx) > 4) { moved = true; carousel.classList.add("is-dragging"); }
    if (moved) track.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", function () {
    if (!down) return;
    down = false; carousel.classList.remove("is-dragging");
    normalize();
  });
  // Um arraste não deve abrir o projeto ao soltar o mouse
  track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
})();
