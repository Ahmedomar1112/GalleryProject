// ==========================
// Portfolio Page Script
// ==========================

// Helpers
const $ = (sel) => document.querySelector(sel);

// ==========================
// Theme Toggle
// ==========================
const THEME_KEY = "myjs:theme";
const themeBtn = $("#themeToggle");

// Apply theme
const applyTheme = (theme) =>
  document.documentElement.setAttribute("data-theme", theme);

// Load saved theme or system preference
const saved = localStorage.getItem(THEME_KEY);
if (saved) {
  applyTheme(saved);
} else {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

// Toggle theme on click
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const cur =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}




// ==========================
// humburger Menu
// ==========================
const hambBtn = $("#hambBtn");
const mobileMenu = $("#mobileMenu");

hambBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  mobileMenu.setAttribute("aria-hidden", !open);
});

// غلق المينيو لما اضغط براها
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) mobileMenu.classList.remove("open");
});





// ==========================
// Back to Top Button
// ==========================
const backTop = $("#backTop");
if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================
// Footer Year
// ==========================
const year = $("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// ==========================
// Preloader
// ==========================
window.addEventListener("load", () => {
  const preloader = $("#preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => (preloader.style.display = "none"), 500);
  }
});

// ==========================
// Progress Bar
// ==========================
const progressBar = $("#progressBar");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });
}

// ==========================
// Typing on Scroll
// ==========================
const typeEl = $("#typeTarget");

function typeText(el) {
  const txt = el.dataset.text || el.textContent;
  el.textContent = "";
  let i = 0;

  function step() {
    if (i <= txt.length) {
      el.textContent = txt.slice(0, i) + (i % 2 ? "|" : "");
      i++;
      setTimeout(step, 28);
    } else {
      el.textContent = txt;
    }
  }
  step();
}

const typeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        typeText(typeEl);
        typeObs.unobserve(en.target);
      }
    });
  },
  { threshold: 0.4 }
);
if (typeEl) typeObs.observe(typeEl);

