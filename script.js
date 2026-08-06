  // ---------- Pre-loader ----------
  window.addEventListener("load", () => {
    setTimeout(() => document.body.classList.remove("is-preload"), 120);
  });
  setTimeout(() => document.body.classList.remove("is-preload"), 3500);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Reveal cards as they enter the viewport ----------
  const cards = document.querySelectorAll(".card");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target); // reveal once, like Apple product pages
        }
      });
    }, { threshold: 0.25 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add("in-view"));
  }

  // ---------- Parallax (rAF-driven, GPU-friendly transforms only) ----------
  const heroContent = document.getElementById("heroContent");
  const drifts = document.querySelectorAll(".drift");
  let ticking = false;

  function parallax() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    // Hero: recedes upward at ~35% of scroll speed and fades — the classic
    // Apple hero hand-off. (Background is fixed, so it forms a third layer.)
    const p = Math.min(y / vh, 1);
    heroContent.style.transform = `translateY(${y * 0.35}px) scale(${1 - p * 0.05})`;
    heroContent.style.opacity = 1 - p * 1.15;

    // Section content drifts gently against scroll direction relative to
    // its distance from the viewport centre — subtle depth, never dizzy.
    drifts.forEach(d => {
      const r = d.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around centre
      d.style.transform = `translateY(${offset * -28}px)`;
    });

    // Slim nav appears after ~70% of the first viewport
    document.body.classList.toggle("scrolled", y > vh * 0.7);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }

  if (!reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    parallax();
  } else {
    // Still show the slim nav without any motion effects
    window.addEventListener("scroll", () => {
      document.body.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.7);
    }, { passive: true });
  }