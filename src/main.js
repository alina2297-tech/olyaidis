const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".mobile-menu");
const covered = document.querySelectorAll(".hero__visual, .hero__panel");
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
