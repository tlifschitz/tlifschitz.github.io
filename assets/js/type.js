/* Types page titles on load. Without JS (or with reduced motion) the
   full text is already in the DOM — this only replays it. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".type-target").forEach(function (el) {
    var heading = el.parentElement;
    var full = el.textContent;
    if (!full) return;

    heading.setAttribute("aria-label", full);
    heading.style.minHeight = heading.offsetHeight + "px";
    el.setAttribute("aria-hidden", "true");
    heading.classList.add("typing");
    el.textContent = "";

    var step = Math.min(28, 900 / full.length);
    var i = 0;
    (function tick() {
      el.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(tick, step);
      else heading.classList.remove("typing");
    })();
  });
})();
