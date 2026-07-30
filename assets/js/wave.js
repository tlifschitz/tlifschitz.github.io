/* Hero signal: the damped sine oscillates from the first frame, and is
   revealed left-to-right over 900ms (the title typing duration). Because
   the wave is already moving while it appears, there is no draw/oscillate
   boundary to stall on. CSS draw remains as the no-JS fallback.
   Skipped entirely under reduced motion. */
(function () {
  var path = document.querySelector(".signal[data-wave] path");
  if (!path) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var DRAW_MS = 900; /* keep in sync with the 900ms cap in type.js */

  path.style.animation = "none";
  path.style.strokeDashoffset = "1400";

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

  var t0, revealed = false;
  function frame(ts) {
    if (t0 === undefined) t0 = ts;
    var t = ts - t0;
    path.setAttribute("d", d((t / 1000) * 0.8));
    if (t < DRAW_MS) {
      /* reveal tracks the live path length so the moving wave uncovers cleanly */
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len * (1 - easeOut(t / DRAW_MS));
    } else if (!revealed) {
      revealed = true;
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
