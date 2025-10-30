// protofolio.js (or portfolio.js) — replace whole file with this

// small helper
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));



const lens = document.getElementById("lens");
document.addEventListener("mousemove", (e) => {
  lens.style.top = `${e.clientY}px`;
  lens.style.left = `${e.clientX}px`;
});

// ====== لفّ الكلمات داخل span ======
function wrapWordsInSpans() {
  document.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (el.classList.contains("magnify-text")) return;

    const words = el.textContent.trim().split(/\s+/);
    el.classList.add("magnify-text");
    el.innerHTML = "";

    for (let word of words) {
      const span = document.createElement("span");
      span.textContent = word;
      el.appendChild(span);
      el.appendChild(document.createTextNode(" "));
    }
  });
}

wrapWordsInSpans();

// ====== التأثير مع الماوس ======
document.addEventListener("mousemove", (e) => {
  const spans = document.querySelectorAll(".magnify-text span");
  spans.forEach((span) => {
    const rect = span.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) { // مدى التأثير (غيّره لو عايز)
      span.classList.add("active");
    } else {
      span.classList.remove("active");
    }
  });
});


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

// 🔹 ضبط حجم الكانفاس
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 🔹 تعريف موقع الماوس
const mouse = { x: null, y: null };
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
document.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// 🔹 إنشاء الجزيئات مع اختيار نوع كل جزيئة: dot | code | ui
const particles = Array.from({ length: 400 }, () => {
  // نسبة كل نوع — عدّل لو عايز تغير النسب
  const rand = Math.random();
  const type = rand < 0.6 ? "dot" : rand < 0.85 ? "code" : "ui";

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.6 + 1.2, // حجم أساسي
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    type,
    angle: Math.random() * Math.PI * 2, // زاوية للتدوير لو احتجنا
    wobble: Math.random() * 0.02 + 0.01 // حركة خفيفة
  };
});

// دالة رسم مستطيل بزوايا مدورة
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// 🔹 رسم وتحريك الجزيئات
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // نحسب اللون بناء على الوقت (حركة ألوان)
  const time = Date.now() * 0.0015; // تقدر تزود أو تقلل للسرعة
  const hue = Math.floor(time % 360);
  // نستخدم HSL كقيمة أساسية للألوان
  const fillColor = `hsl(${hue}, 75%, 60%)`;
  const strokeColor = `hsl(${(hue + 30) % 360}, 80%, 45%)`;

  particles.forEach((p) => {
    // حركة طفيفة (wobble) لإحساس طبيعي
    p.angle += p.wobble;
    p.x += Math.cos(p.angle) * 0.05;
    p.y += Math.sin(p.angle) * 0.05;

    // تفاعل مع الماوس (تنافر كما كان)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const angle = Math.atan2(dy, dx);
        const force = (100 - dist) / 100;
        const fx = Math.cos(angle) * force * 1.6;
        const fy = Math.sin(angle) * force * 1.6;
        p.x += fx;
        p.y += fy;
      }
    }

    // حدود الشاشة (ارتداد)
    if (p.x < -20) p.x = canvas.width + 20;
    if (p.x > canvas.width + 20) p.x = -20;
    if (p.y < -20) p.y = canvas.height + 20;
    if (p.y > canvas.height + 20) p.y = -20;

    // حركة طبيعية الأساسية
    p.x += p.dx;
    p.y += p.dy;

    // رسم حسب النوع
    ctx.save();
    ctx.translate(p.x, p.y);

    if (p.type === "dot") {
      // نقطة دائرية
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();

    } else if (p.type === "code") {
      // أيقونة الكود "</>" مرسومة كنص
      const fontSize = Math.max(10, Math.round(p.r * 3 + 8)); // غير للحجم
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fillColor;
      ctx.fillText("</>", 0, 0);

      // optional subtle stroke to pop
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = strokeColor;
      ctx.strokeText("</>", 0, 0);

    } else if (p.type === "ui") {
      // أيقونة UI بسيطة: صندوق صغير مع كلمة UI
      const w = Math.max(18, p.r * 6);
      const h = Math.max(12, p.r * 3.5);
      ctx.fillStyle = `rgba(255,255,255,0.06)`;
      roundRect(-w / 2, -h / 2, w, h, 3);

      // stroke border
      ctx.lineWidth = 1;
      ctx.strokeStyle = fillColor;
      ctx.stroke();

      // حرفي UI
      ctx.font = `${Math.max(9, Math.round(p.r * 2 + 6))}px Poppins, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fillColor;
      ctx.fillText("UI", 0, 0);
    }

    ctx.restore();
  });

  requestAnimationFrame(drawParticles);
}

drawParticles();