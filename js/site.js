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
  var currentIndex = 0;
  var isSyncing = false;

  function computeClosestIndex() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 2) return slides.length - 1;
    if (track.scrollLeft <= 2) return 0;
    var trackRect = track.getBoundingClientRect();
    var closest = 0;
    var closestDist = Infinity;
    slides.forEach(function (slide, i) {
      var r = slide.getBoundingClientRect();
      var dist = Math.abs(r.left - trackRect.left);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    return closest;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    currentIndex = i;
    updateActive();
    var trackRect = track.getBoundingClientRect();
    var slideRect = slides[i].getBoundingClientRect();
    var targetLeft = track.scrollLeft + (slideRect.left - trackRect.left);
    isSyncing = true;
    track.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }

  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function updateActive() {
    dots.forEach(function (d, i) { d.classList.toggle('active', i === currentIndex); });
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= slides.length - 1;
  }

  // Only resync from real user scrolling (touch drag, trackpad) —
  // programmatic scrolls from goTo() already set currentIndex correctly
  // and must not be second-guessed here. 'scrollend' fires exactly once
  // when a scroll truly finishes, so there's no race with goTo's own
  // smooth-scroll animation (unlike a fixed debounce timer).
  function handleScrollSettled() {
    if (isSyncing) { isSyncing = false; return; }
    currentIndex = computeClosestIndex();
    updateActive();
  }
  if ('onscrollend' in window) {
    track.addEventListener('scrollend', handleScrollSettled);
  } else {
    var scrollTimeout;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollSettled, 150);
    }, { passive: true });
  }

  prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

  window.addEventListener('resize', function () { goTo(currentIndex); });
  updateActive();
})();
