// protofolio.js (or portfolio.js) — replace whole file with this

// small helper
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ------- THEME -------
const THEME_KEY = "myjs:theme";
const themeBtn = $("#themeToggle");
const applyTheme = (theme) =>
  document.documentElement.setAttribute("data-theme", theme);

// load saved / system
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme:dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
} catch (e) {
  // localStorage might be disabled in some contexts — ignore
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const cur =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
  });
}

// ------- MOBILE MENU (safe) -------
const hambBtn = $("#hambBtn");
const mobileMenu = $("#mobileMenu");
if (hambBtn && mobileMenu) {
  hambBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", !open);
  });

  // close when click outside inner content
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) mobileMenu.classList.remove("open");
  });

  // close on link click inside mobile menu
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mobileMenu.classList.remove("open"))
  );
}

// ------- BACK TO TOP -------
const backTop = $("#backTop");
if (backTop) {
  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// ------- YEAR -------
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

// ------- PRELOADER -------
window.addEventListener("load", () => {
  const preloader = $("#preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => (preloader.style.display = "none"), 500);
  }
});

// ------- PROGRESS BAR -------
const progressBar = $("#progressBar");
if (progressBar) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + "%";
  };
  window.addEventListener("scroll", updateProgress);
  // init
  updateProgress();
}

// ------- TYPING ON SCROLL (more robust) -------
const typeEl = $("#typeTarget");
const typeSection = $("#typing"); // observe section (more reliable)

function typeText(el) {
  if (!el) return;
  const txt = el.dataset.text || el.textContent || "";
  el.textContent = "";
  let i = 0;
  (function step() {
    if (i <= txt.length) {
      // show a blinking caret while typing
      el.textContent = txt.slice(0, i) + (i % 2 ? "|" : "");
      i++;
      setTimeout(step, 28);
    } else {
      el.textContent = txt;
    }
  })();
}

if ("IntersectionObserver" in window) {
  if (typeSection && typeEl) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            typeText(typeEl);
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(typeSection);
  }
} else {
  // fallback: just type immediately if no observer support
  if (typeEl) typeText(typeEl);
}

// ------- optional: animate elements on scroll (small generic helper) -------
const reveals = $$(".reveal-on-scroll");
if ("IntersectionObserver" in window && reveals.length) {
  const revObs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("show");
          observer.unobserve(en.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  reveals.forEach((r) => revObs.observe(r));
}


// ==========================
// Particles Background
// ==========================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = Array.from({ length: 300 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 3 + 1.8,
  dx: (Math.random() - 0.5) * 0.7,
  dy: (Math.random() - 0.5) * 0.7,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(45,212,191,0.7)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();