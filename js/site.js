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
  if (CFG.email) {
    document.querySelectorAll(".js-email").forEach(function (a) { a.href = "mailto:" + CFG.email; });
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Aberto direto do disco (file://), link para pasta mostraria a pasta: completa com index.html */
  if (location.protocol === "file:") {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      var href = a && a.getAttribute("href");
      if (href && !/^[a-z]+:|^#/i.test(href) && /\/(#.*)?$/.test(href)) a.href = href.replace(/\/(#.*)?$/, "/index.html$1");
    }, true);
  }

  /* ---------------- Cabeçalho e animações de entrada ---------------- */
  var header = document.querySelector(".header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
  }
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
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
