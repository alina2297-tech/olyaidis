const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".mobile-menu");
const covered = document.querySelectorAll(
  ".hero__visual, .hero__panel, .about, .catalog, .equipment",
);
const desktop = window.matchMedia("(min-width: 801px)");

const setMenuOpen = (open) => {
  document.body.classList.toggle("is-menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Меню");
  covered.forEach((node) => {
    node.inert = open;
  });
};

burger.addEventListener("click", () => {
  setMenuOpen(burger.getAttribute("aria-expanded") !== "true");
});

menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("is-menu-open")) {
    setMenuOpen(false);
    burger.focus();
  }
});

desktop.addEventListener("change", (event) => {
  if (event.matches) setMenuOpen(false);
});

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".header__link, .mobile-menu__link, .header__brand").forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return;

    const target = hash === "#" ? null : document.querySelector(hash);
    if (hash !== "#" && !target) return;

    event.preventDefault();
    if (document.body.classList.contains("is-menu-open")) setMenuOpen(false);

    const behavior = motionQuery.matches ? "auto" : "smooth";
    if (target) target.scrollIntoView({ behavior, block: "start" });
    else window.scrollTo({ top: 0, behavior });

    const url = hash === "#" ? `${location.pathname}${location.search}` : hash;
    history.pushState(null, "", url);
  });
});

const stage = document.querySelector(".catalog__stage");
const play = document.querySelector(".catalog__play");
const video = document.querySelector(".catalog__video");

play.addEventListener("click", async () => {
  stage.classList.add("is-playing");
  video.controls = true;
  try {
    await video.play();
  } catch {
    stage.classList.remove("is-playing");
    video.controls = false;
  }
});
