// ---------- Helpers ----------
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1400);
}

// ---------- Reveal on scroll ----------
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ---------- Progress bar ----------
const progressBar = $("#progressBar");
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${p}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// ---------- Year ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Copy email ----------
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Copied!");
  }catch{
    toast("Copy failed");
  }
}
const email = "skarthiksubramanian0704@gmail.com";
$("#copyEmail")?.addEventListener("click", () => copyText(email));
$("#copyEmail2")?.addEventListener("click", () => copyText(email));

// ---------- Project filters ----------
const filters = $$(".filter");
const projects = $$("#projectGrid .project");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const f = btn.dataset.filter;
    projects.forEach(card => {
      const tags = (card.dataset.tags || "").split(" ");
      const show = f === "all" || tags.includes(f);
      card.style.display = show ? "" : "none";
    });
  });
});

// ---------- Mobile menu ----------
const menuToggle = $("#menuToggle");
const mobileMenu = $("#mobileMenu");

function closeMobile(){
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.style.display = "none";
}
function openMobile(){
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenu.style.display = "block";
}

menuToggle?.addEventListener("click", () => {
  const isHidden = mobileMenu.getAttribute("aria-hidden") === "true";
  if (isHidden) openMobile();
  else closeMobile();
});

$$(".mobile__link").forEach(a => a.addEventListener("click", closeMobile));

// Close menu on resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMobile();
});

// ---------- Theme toggle ----------
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function setIcon(){
  const theme = document.documentElement.getAttribute("data-theme");
  $(".icon", themeToggle).textContent = theme === "light" ? "☼" : "☾";
}
setIcon();

themeToggle?.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "light" ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");

  const stored = next || "";
  if (stored) localStorage.setItem("theme", stored);
  else localStorage.removeItem("theme");

  setIcon();
});
