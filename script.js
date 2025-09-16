// ==========================
// Helpers
// ==========================
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

document.documentElement.setAttribute("data-js", "enabled");

// ==========================
// Navbar & Mobile Menu
// ==========================
const hambBtn = $("#hambBtn");
const mobileMenu = $("#mobileMenu");
const mTheme = $("#mTheme");

// ==========================
// Scroll Progress Bar
// ==========================
const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / height) * 100;
  progressBar.style.width = progress + "%";
});



// فتح/غلق المينيو
hambBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  mobileMenu.setAttribute("aria-hidden", !open);
});

// غلق المينيو لما اضغط براها
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) mobileMenu.classList.remove("open");
});

// ==========================
// Explore Services
// ==========================

const exploreBtn = document.querySelector(".primary[href='#services']");
exploreBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#services").scrollIntoView({ behavior: "smooth", block: "start" });
});


// ==========================
// Search Box
// ==========================
const searchBtn = $("#searchBtn");
const searchBox = $("#searchBox");
const searchInput = $("#searchInput");
const searchClose = $("#searchClose");

searchBtn.addEventListener("click", () => {
  searchBox.classList.toggle("show");
  searchInput.focus();
});

searchClose.addEventListener("click", () => {
  searchBox.classList.remove("show");
});

// Search sections by title
  const sections = $$("main section");
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase();
    sections.forEach((sec) => {
      const match = sec.querySelector("h2")?.textContent.toLowerCase().includes(val);
      sec.style.display = match || !val ? "block" : "none";
    });
  });

// ==========================
// Preloader
// ==========================
window.addEventListener("load", () => {
  const preloader = $("#preloader");
  preloader.style.opacity = "0";
  setTimeout(() => (preloader.style.display = "none"), 500);
});

// ==========================
// Smooth Scroll & Scrollspy
// ==========================
$$("a.link").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (mobileMenu.classList.contains("open")) mobileMenu.classList.remove("open");
  });
});

const navLinks = $$("a.link");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = "#" + en.target.id;
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === id)
        );
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => spy.observe(s));

// ==========================
// Theme Toggle
// ==========================
const THEME_KEY = "myjs:theme";
const themeBtn = $("#themeToggle");

const applyTheme = (theme) =>
  document.documentElement.setAttribute("data-theme", theme);

const saved = localStorage.getItem(THEME_KEY);
if (saved) {
  applyTheme(saved);
} else {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

themeBtn.addEventListener("click", () => {
  const cur =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  const next = cur === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

if (mTheme) mTheme.addEventListener("click", () => themeBtn.click());

// ==========================
// Back to Top
// ==========================
const backTop = $("#backTop");
backTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ==========================
// Carousel (Slides right-to-left)
// ==========================





// ========================== // Carousel (Slides left-to-right)  // ==========================
const track = $("#track");
const slides = () => Array.from(track.children);
let idx = 0;
let autoplay = true;
let interval;

const nextBtn = $("#next"),
  prevBtn = $("#prev"),
  dotsWrap = $("#dots");

function createDots() {
  dotsWrap.innerHTML = "";
  slides().forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "dot";
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });
  updateDots();
}

function updateDots() {
  const ds = Array.from(dotsWrap.children);
  ds.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function calcTransform() {
  const slideW =
    slides()[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(track).gap || 10);
  const x = -(idx * slideW);
  track.style.transform = `translateX(${x}px)`;
}

function goTo(i) {
  idx = (i + slides().length) % slides().length;
  calcTransform();
  updateDots();
}
function next() {
  goTo(idx + 1);
}
function prev() {
  goTo(idx - 1);
}

function startAuto() {
  stopAuto();
  interval = setInterval(() => {
    if (autoplay) next();
  }, 3000);
}
function stopAuto() {
  if (interval) clearInterval(interval);
}

nextBtn.addEventListener("click", () => {
  autoplay = false;
  next();
  setTimeout(() => (autoplay = true), 5000);
});
prevBtn.addEventListener("click", () => {
  autoplay = false;
  prev();
  setTimeout(() => (autoplay = true), 5000);
});

track.parentElement.addEventListener("mouseenter", () => (autoplay = false));
track.parentElement.addEventListener("mouseleave", () => (autoplay = true));

window.addEventListener("load", () => {
  createDots();
  calcTransform();
  startAuto();
  window.addEventListener("resize", calcTransform);
});

// Swipe
(function swipe() {
  let startX = 0,
    dist = 0;
  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  track.addEventListener(
    "touchmove",
    (e) => (dist = e.touches[0].clientX - startX)
  );
  track.addEventListener("touchend", () => {
    if (Math.abs(dist) > 40) {
      if (dist < 0) next();
      else prev();
    }
    dist = 0;
  });
})();

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

// ==========================
// Contact Form & Dev Actions
// ==========================
const toast = $("#toast");

function showToast(text = "Sent", time = 2200) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), time);
}

$$("button.icon-btn[data-email]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const em = btn.dataset.email;
    navigator.clipboard.writeText(em).then(() => showToast("Email copied"));
  });
});

$$("button[data-mailto]").forEach(
  (b) => (b.onclick = () => (location.href = b.dataset.mailto))
);

const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const msg = $("#message").value.trim();

    if (!name || !email || !msg) {
      showToast("Please fill all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Enter valid email");
      return;
    }

    localStorage.setItem(
      "lastContact",
      JSON.stringify({ name, email, msg, date: Date.now() })
    );

    form.reset();
    showToast("Message sent — thank you!");
  });
}

// ==========================
// FAQ Accordion
// ==========================
$$(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    const p = item.querySelector("p");
    if (open) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
});


// Parallax Effect on Hero background
const hero = document.querySelector('.hero');

hero.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 80; 
  const y = (e.clientY / window.innerHeight - 0.5) * 80;
  hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
});
hero.addEventListener('mouseleave', () => {
  hero.style.backgroundPosition = '50% 50%';
});



// ==========================
// Counters Animation
// ==========================
const counters = $$(".counter");
if (counters.length) {
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const el = en.target;
          const target = +el.dataset.target;
          let num = 0;
          const step = target / 200;
          const timer = setInterval(() => {
            num += step;
            if (num >= target) {
              num = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(num);
          }, 20);
          counterObs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObs.observe(c));
}

// ==========================
// Newsletter
// ==========================
const newsletterForm = $("#newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#newsEmail").value.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Enter valid email");
      return;
    }

    localStorage.setItem("newsletterEmail", email);
    newsletterForm.reset();
    showToast("Subscribed successfully!");
  });
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


// ==========================
// Footer Year
// ==========================
$("#year").textContent = new Date().getFullYear();


