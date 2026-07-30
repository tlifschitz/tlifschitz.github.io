/* After the hero signal draws in, keep it gently oscillating: the same
   damped sine with a slowly advancing phase. Skipped under reduced motion. */
(function () {
  var path = document.querySelector(".signal[data-wave] path");
  if (!path) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function d(phase) {
    var pts = [];
    for (var i = 0; i <= 160; i++) {
      var t = i / 160;
      var y = 48 - 40 * Math.exp(-2.8 * t) * Math.sin(2 * Math.PI * 5.5 * t - phase);
      pts.push(i * 4 + "," + y.toFixed(1));
    }
    return "M" + pts.join(" L");
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    path.style.strokeDasharray = "none";
    var t0;
    function frame(ts) {
      if (t0 === undefined) t0 = ts;
      path.setAttribute("d", d(((ts - t0) / 1000) * 0.8));
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* hand off seamlessly once the draw-in finishes (phase 0 == static path) */
  path.addEventListener("animationend", start);
  setTimeout(start, 2000);
})();
