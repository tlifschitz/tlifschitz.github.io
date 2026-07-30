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

    var total = Math.min(28 * full.length, 900);
    var start;
    (function tick(ts) {
      if (start === undefined) start = ts;
      var i = Math.min(full.length, Math.round(((ts - start) / total) * full.length));
      el.textContent = full.slice(0, i);
      if (i < full.length) requestAnimationFrame(tick);
      else heading.classList.remove("typing");
    })(performance.now());
  });
})();
