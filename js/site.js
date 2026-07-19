(function () {
  var header = document.getElementById("header");
  if (!header) return;
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function () {
  var track = document.getElementById('shotsTrack');
  var dotsWrap = document.getElementById('shotsDots');
  var prevBtn = document.querySelector('.lc-carousel-prev');
  var nextBtn = document.querySelector('.lc-carousel-next');
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  var slides = Array.prototype.slice.call(track.children);

  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
    dot.addEventListener('click', function () {
      slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function updateActive() {
    var trackRect = track.getBoundingClientRect();
    var center = trackRect.left + trackRect.width / 2;
    var closest = 0;
    var closestDist = Infinity;
    slides.forEach(function (slide, i) {
      var r = slide.getBoundingClientRect();
      var dist = Math.abs((r.left + r.width / 2) - center);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === closest); });
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }

  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -240, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: 240, behavior: 'smooth' });
  });

  track.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateActive);
  });
  window.addEventListener('resize', updateActive);
  updateActive();
})();
