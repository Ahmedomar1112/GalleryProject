// ==========================
// Helpers
// ==========================
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

document.documentElement.setAttribute("data-js", "enabled");


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




// ==========================
// Navbar & Mobile Menu
// ==========================
const hambBtn = $("#hambBtn");
const mobileMenu = $("#mobileMenu");
const mTheme = $("#mTheme");


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
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");

  // إظهار الانترو بانسيابية
  requestAnimationFrame(() => {
    intro.classList.add("active");
  });

  // بعد 5 ثواني تخفيها بانسيابية
  setTimeout(() => {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
    }, 1000);
  }, 5000);
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
const spy = new IntersectionObserver(  // مراقب الأقسام
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

  // استخدم carousel-wrap نفسها بدل parentElement
  const wrap = track.closest(".carousel-wrap");
  const centerOffset = (wrap.offsetWidth - slideW) / 2;

  const x = -(idx * slideW) + centerOffset;
  track.style.transform = `translateX(${x}px)`;

  // ✅ تحديث الكلاس active-slide
  slides().forEach((s, i) => {
    s.classList.toggle("active-slide", i === idx);
  });
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
  updateDots();
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
    if (Math.abs(dist) > 43) {
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
const particles = Array.from({ length: 200 }, () => {
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



// ==========================
// Footer Year
// ==========================
$("#year").textContent = new Date().getFullYear();


