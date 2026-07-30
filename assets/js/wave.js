/* Hero signal: draw in over 900ms (the same duration the title takes to
   type), then keep oscillating with a slowly advancing phase, with no gap
   between the two. The CSS draw animation remains as the no-JS fallback.
   Skipped entirely under reduced motion. */
(function () {
  var path = document.querySelector(".signal[data-wave] path");
  if (!path) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var DRAW_MS = 900; /* keep in sync with the 900ms cap in type.js */
  var LEN = 1400;

  path.style.animation = "none";
  path.style.strokeDashoffset = LEN;

  function d(phase) {
    var pts = [];
    for (var i = 0; i <= 160; i++) {
      var t = i / 160;
      var y = 48 - 40 * Math.exp(-2.8 * t) * Math.sin(2 * Math.PI * 5.5 * t - phase);
      pts.push(i * 4 + "," + y.toFixed(1));
    }
    return "M" + pts.join(" L");
  }

  function easeOut(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  var t0;
  function frame(ts) {
    if (t0 === undefined) t0 = ts;
    var t = ts - t0;
    if (t < DRAW_MS) {
      path.style.strokeDashoffset = LEN * (1 - easeOut(t / DRAW_MS));
    } else {
      if (path.style.strokeDasharray !== "none") {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
      }
      path.setAttribute("d", d(((t - DRAW_MS) / 1000) * 0.8));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
