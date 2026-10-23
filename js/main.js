(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  var CFG = window.CIA_CONFIG || {};
  var IMG = "assets/img/";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Links: comunidade, pagamento e Instagram ---------------- */
  if (CFG.linkComunidade) {
    document.querySelectorAll(".js-community").forEach(function (a) { a.href = CFG.linkComunidade; });
  }
  if (CFG.linkPagamento) {
    document.querySelectorAll(".js-buy").forEach(function (a) { a.href = CFG.linkPagamento; });
  }
  if (CFG.instagram) {
    var insta = document.getElementById("instaLink");
    insta.href = "https://instagram.com/" + CFG.instagram.replace(/^@/, "");
    insta.hidden = false;
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Antes e depois: um comparador por agente ---------------- */
  var PAIRS = [
    { id: "cozinha", agent: "CIA Fotografia", label: "Print do SketchUp → foto realista" },
    { id: "novoolhar", agent: "CIA Novo Olhar", label: "Uma imagem → novos ângulos", before: "Imagem base" },
    { id: "aprimorar", agent: "CIA Aprimorar", label: "Render comum → render aprimorado", before: "Antes" },
    { id: "moodboard", agent: "CIA Moodboard", label: "Uma imagem → moodboard completo", before: "Imagem base" },
    { id: "moodlight", agent: "CIA Mood Light", label: "Luz natural → clima aconchegante", before: "Antes" },
    { id: "humanizar", agent: "CIA Humanizar", label: "Ambiente vazio → cena com pessoas", before: "Antes" }
  ];

  function makeCompare(p) {
    var fig = document.createElement("figure");
    fig.className = "cmp reveal" + (p.wide ? " cmp--wide" : "");
    fig.innerHTML =
      '<div class="cmp__frame" style="--pos:50%">' +
        '<img class="cmp__img" src="' + IMG + p.id + '-depois.jpg" alt="Depois: resultado do ' + p.agent + '" loading="lazy">' +
        '<div class="cmp__before"><img class="cmp__img" src="' + IMG + p.id + '-antes.jpg" alt="Antes: imagem enviada ao ' + p.agent + '" loading="lazy"></div>' +
        '<span class="cmp__label cmp__label--before mono">' + (p.before || "Print") + '</span>' +
        '<span class="cmp__label cmp__label--after mono">CIA</span>' +
        '<div class="cmp__handle" aria-hidden="true"><span>‹ ›</span></div>' +
        '<input class="cmp__range" type="range" min="0" max="100" value="50" step="0.5" aria-label="' + p.agent + ': mover divisória entre antes e depois">' +
      "</div>" +
      '<figcaption><strong>' + p.agent + '</strong><span>' + p.label + "</span></figcaption>";

    var frame = fig.querySelector(".cmp__frame");
    var range = fig.querySelector(".cmp__range");
    function setPos(v) {
      v = Math.max(0, Math.min(100, v));
      frame.style.setProperty("--pos", v + "%");
      range.value = v;
    }
    function posFrom(e) {
      var r = frame.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    // Teclado e leitores de tela usam o input; mouse e toque arrastam o quadro
    range.addEventListener("input", function () { setPos(parseFloat(range.value)); });

    var dragging = false, decided = false, sx = 0, sy = 0;
    frame.addEventListener("pointerdown", function (e) {
      dragging = true; decided = e.pointerType === "mouse"; sx = e.clientX; sy = e.clientY;
      if (decided) { frame.classList.add("is-dragging"); setPos(posFrom(e)); frame.setPointerCapture(e.pointerId); }
    });
    frame.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (!decided) {
        // No toque, só assume o arraste se o gesto for mais horizontal que vertical
        var dx = Math.abs(e.clientX - sx), dy = Math.abs(e.clientY - sy);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; frame.classList.add("is-dragging"); frame.setPointerCapture(e.pointerId);
      }
      setPos(posFrom(e));
    });
    function end(e) {
      if (dragging && !decided && e.type === "pointerup") setPos(posFrom(e)); // toque simples
      dragging = false; frame.classList.remove("is-dragging");
    }
    frame.addEventListener("pointerup", end);
    frame.addEventListener("pointercancel", end);
    return fig;
  }

  var comparesEl = document.getElementById("compares");
  PAIRS.forEach(function (p) {
    comparesEl.appendChild(makeCompare(p));
  });

  // Comparador do card de preço
  var planCmp = makeCompare({ id: "escritorio", agent: "CIA Fotografia", label: "Home office" });
  planCmp.classList.remove("reveal");
  document.getElementById("planCompare").appendChild(planCmp);

  /* ---------------- Galeria (pares com enquadramento diferente) ---------------- */
  var GALLERY = [
    { id: "sala", label: "Sala de estar" },
    { id: "jantar", label: "Jantar" },
    { id: "living", label: "Living" },
    { id: "lavabo", label: "Lavabo" },
    { id: "quarto", label: "Suíte" },
    { id: "gourmet", label: "Cozinha gourmet" },
    { id: "banho", label: "Lavabo · outra vista" }
  ];
  var gal = document.querySelector(".gallery");
  GALLERY.forEach(function (g) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shot reveal";
    btn.setAttribute("aria-label", g.label + ": alternar entre print original e imagem gerada");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<img src="' + IMG + g.id + '-depois.jpg" alt="' + g.label + ' gerado pela CIA" loading="lazy">' +
      '<img class="shot__before" src="' + IMG + g.id + '-antes.jpg" alt="' + g.label + ', print original" loading="lazy">' +
      '<span class="shot__tag">' + g.label + "</span>";
    btn.addEventListener("click", function () {
      var on = btn.classList.toggle("is-flipped");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    gal.appendChild(btn);
  });

  /* ---------------- Feedback: prints em roleta contínua, arrastável ---------------- */
  var FEEDBACK_TOTAL = 13; // assets/img/feedback/feedback-01.jpg … feedback-13.jpg
  var FEEDBACK_HEIGHTS = { 1: 620, 4: 840 }; // altura (em 540 px de largura); as demais têm 1174
  var marquee = document.getElementById("feedbackMarquee");
  var track = document.getElementById("feedbackTrack");

  function feedbackCard(n, hidden) {
    var fig = document.createElement("figure");
    fig.className = "fb-card";
    if (hidden) fig.setAttribute("aria-hidden", "true");
    var img = document.createElement("img");
    img.src = IMG + "feedback/feedback-" + String(n).padStart(2, "0") + ".jpg";
    img.alt = hidden ? "" : "Print de cliente comentando o resultado da CIA no WhatsApp";
    img.width = 540;
    img.height = FEEDBACK_HEIGHTS[n] || 1174;
    img.loading = "lazy";
    img.draggable = false;
    fig.appendChild(img);
    return fig;
  }
  // Duas cópias da lista: quando a primeira sai da tela, a posição volta ao início sem salto
  for (var k = 0; k < 2; k++) {
    for (var n = 1; n <= FEEDBACK_TOTAL; n++) track.appendChild(feedbackCard(n, k === 1));
  }

  var offset = 0, speed = reduceMotion ? 0 : 40; // px por segundo
  var half = 0, last = 0, dragging = false, startX = 0, startOffset = 0, moved = false, visible = true;
  function measure() { half = track.scrollWidth / 2; }
  function wrap(v) { return half ? ((v % half) + half) % half : 0; }
  function render() { track.style.transform = "translate3d(" + (-wrap(offset)) + "px,0,0)"; }
  function tick(t) {
    var dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    if (!dragging && visible) { offset += speed * dt; render(); }
    requestAnimationFrame(tick);
  }
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  track.addEventListener("load", measure, true); // cada imagem carregada muda a largura total
  measure();
  requestAnimationFrame(tick);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(marquee);
  }

  // Arrastar com mouse ou dedo (gesto vertical continua rolando a página)
  var sy = 0, decided = false;
  marquee.addEventListener("pointerdown", function (e) {
    dragging = true; moved = false; decided = e.pointerType === "mouse";
    startX = e.clientX; sy = e.clientY; startOffset = offset;
    if (decided) { marquee.classList.add("is-dragging"); marquee.setPointerCapture(e.pointerId); }
  });
  marquee.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!decided) {
      if (Math.abs(dx) < 6 && Math.abs(e.clientY - sy) < 6) return;
      if (Math.abs(e.clientY - sy) > Math.abs(dx)) { dragging = false; return; }
      decided = true; marquee.classList.add("is-dragging"); marquee.setPointerCapture(e.pointerId);
    }
    if (Math.abs(dx) > 3) moved = true;
    offset = startOffset - dx;
    render();
  });
  function stopDrag() { dragging = false; marquee.classList.remove("is-dragging"); }
  marquee.addEventListener("pointerup", stopDrag);
  marquee.addEventListener("pointercancel", stopDrag);
  marquee.addEventListener("click", function (e) { if (moved) e.preventDefault(); }, true);

  /* ---------------- Vídeo do hero (loop com controles) ---------------- */
  var loop = document.querySelector(".js-loop");
  var devTabs = document.querySelectorAll(".device__tabs button");
  var player = document.querySelector(".player");
  var seek = player.querySelector(".js-seek");
  var timeEl = player.querySelector(".js-time");
  var toggleBtn = player.querySelector(".js-toggle");
  var userPaused = reduceMotion; // pausa feita pelo visitante não é desfeita ao rolar a página
  var seeking = false;

  function loadLoop() {
    loop.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; s.removeAttribute("data-src"); });
    loop.load();
    if (!userPaused) loop.play().catch(function () {});
  }
  if (document.readyState === "complete") loadLoop();
  else window.addEventListener("load", loadLoop);

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function play() { userPaused = false; loop.play().catch(function () {}); }
  function pause() { userPaused = true; loop.pause(); }
  function jumpTo(t) {
    if (!loop.duration) return;
    loop.currentTime = Math.max(0, Math.min(loop.duration - 0.05, t));
  }

  function syncState() {
    var paused = loop.paused;
    player.classList.toggle("is-paused", paused);
    toggleBtn.setAttribute("aria-label", paused ? "Reproduzir" : "Pausar");
  }
  loop.addEventListener("play", syncState);
  loop.addEventListener("pause", syncState);
  syncState();

  toggleBtn.addEventListener("click", function () { loop.paused ? play() : pause(); });
  loop.addEventListener("click", function () { loop.paused ? play() : pause(); });
  player.querySelector(".js-back").addEventListener("click", function () { jumpTo(loop.currentTime - 5); });
  player.querySelector(".js-restart").addEventListener("click", function () { jumpTo(0); play(); });

  // Barra de progresso: arrastar para voltar ou avançar
  seek.addEventListener("input", function () {
    seeking = true;
    seek.style.setProperty("--p", seek.value / 10 + "%");
    jumpTo((seek.value / 1000) * loop.duration);
  });
  seek.addEventListener("change", function () { seeking = false; });

  // Etapas clicáveis: cada uma leva ao trecho correspondente do vídeo
  devTabs.forEach(function (b) {
    b.addEventListener("click", function () {
      jumpTo((loop.duration / 3) * Number(b.dataset.step) + 0.1);
      if (loop.paused && !userPaused) play();
    });
  });

  // A tela do "aparelho" assume a proporção real do vídeo
  loop.addEventListener("loadedmetadata", function () {
    if (loop.videoWidth) loop.parentNode.style.setProperty("--vratio", loop.videoWidth + "/" + loop.videoHeight);
    timeEl.textContent = "0:00 / " + fmt(loop.duration);
  });

  // Atualiza progresso, tempo e etapa ativa (enviar → processar → resultado)
  loop.addEventListener("timeupdate", function () {
    if (!loop.duration) return;
    var r = loop.currentTime / loop.duration;
    if (!seeking) {
      seek.value = Math.round(r * 1000);
      seek.style.setProperty("--p", r * 100 + "%");
    }
    timeEl.textContent = fmt(loop.currentTime) + " / " + fmt(loop.duration);
    var step = Math.min(2, Math.floor(r * 3));
    devTabs.forEach(function (t, i) { t.classList.toggle("is-active", i === step); });
  });

  // Pausa o vídeo fora da tela para economizar bateria e dados
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting && !userPaused && loop.readyState > 0) loop.play().catch(function () {});
      else if (!en[0].isIntersecting) loop.pause();
    }, { threshold: 0.15 }).observe(loop);
  }

  /* ---------------- Header, CTA fixo e animações de entrada ---------------- */
  var header = document.querySelector(".header");
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  var contato = document.getElementById("comunidade");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    var pastHero = y > hero.offsetHeight * 0.6;
    var atContact = contato.getBoundingClientRect().top < window.innerHeight * 0.9;
    sticky.classList.toggle("is-visible", pastHero && !atContact);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
