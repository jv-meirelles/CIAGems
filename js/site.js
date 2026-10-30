(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  var CFG = window.CASAC_CONFIG || {};

  /* ---------------- Contatos ---------------- */
  var phone = String(CFG.whatsapp || "").replace(/\D/g, "");
  if (phone) {
    var wa = "https://wa.me/" + phone + (CFG.mensagem ? "?text=" + encodeURIComponent(CFG.mensagem) : "");
    document.querySelectorAll(".js-whatsapp").forEach(function (a) { a.href = wa; });
  }
  if (CFG.instagram) {
    var ig = "https://instagram.com/" + String(CFG.instagram).replace(/^@/, "");
    document.querySelectorAll(".js-instagram").forEach(function (a) { a.href = ig; });
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Portfólio (vem de js/config.js) ---------------- */
  var works = Array.isArray(CFG.portfolio) ? CFG.portfolio : [];
  if (works.length) {
    var grid = document.getElementById("portfolioGrid");
    works.forEach(function (w) {
      var fig = document.createElement("figure");
      fig.className = "work reveal";
      var box = document.createElement("div");
      box.className = "work__img";
      var img = document.createElement("img");
      img.src = w.foto; img.alt = w.titulo || "Projeto Casa C."; img.loading = "lazy";
      box.appendChild(img);
      var cap = document.createElement("figcaption");
      var t = document.createElement("strong"); t.textContent = w.titulo || "";
      var meta = document.createElement("span"); meta.textContent = [w.tipo, w.local].filter(Boolean).join(" · ");
      cap.append(t, meta);
      fig.append(box, cap);
      grid.appendChild(fig);
    });
    grid.hidden = false;
    document.getElementById("portfolioEmpty").hidden = true;
  }

  /* ---------------- Cabeçalho e animações de entrada ---------------- */
  var header = document.querySelector(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
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
