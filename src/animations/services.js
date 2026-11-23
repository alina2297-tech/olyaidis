import { ANIM } from "./utils.js";

export function initServices() {
  const copy = document.querySelector(".catalog__copy");
  const list = document.querySelector(".catalog__list");
  if (!copy || !list) return;

  const ornament = document.querySelector(".catalog__ornament");
  const label = document.querySelector(".catalog__label");
  const title = document.querySelector(".catalog__title");
  const lead = document.querySelector(".catalog__lead");
  [ornament, label, lead].filter(Boolean).forEach((element) => {
    window.gsap.set(element, { opacity: 0, y: 16 });
  });
  if (title) {
    window.gsap.set(title, { opacity: 0, y: 22, scale: 0.98, transformOrigin: "left center" });
  }

  const intro = window.gsap.timeline({
    scrollTrigger: { trigger: copy, start: "top 82%", once: true },
    defaults: { ease: ANIM.ease },
  });

  if (ornament) intro.to(ornament, { opacity: 1, y: 0, duration: 0.6 }, 0);
  if (label) intro.to(label, { opacity: 1, y: 0, duration: 0.7 }, 0.12);
  if (title) intro.to(title, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.22);
  if (lead) intro.to(lead, { opacity: 1, y: 0, duration: 0.75 }, 0.4);

  const items = window.gsap.utils.toArray(".catalog__item");
  const listTl = window.gsap.timeline({
    scrollTrigger: { trigger: list, start: "top 85%", once: true },
  });

  items.forEach((item, index) => {
    const price = item.querySelector(".catalog__price");
    const at = index * 0.15;
    window.gsap.set(item, { opacity: 0, y: 20 });
    if (price) window.gsap.set(price, { opacity: 0 });
    listTl.to(item, { opacity: 1, y: 0, duration: 0.75, ease: ANIM.ease }, at);
    if (price) listTl.to(price, { opacity: 1, duration: 0.45, ease: ANIM.ease }, at + 0.16);
  });

  initStage();
}

function initStage() {
  const stage = document.querySelector(".catalog__stage");
  const shot = document.querySelector(".catalog__shot");
  const play = document.querySelector(".catalog__play");
  if (!stage || !shot || !play) return;

  play.style.transition = "none";
  window.gsap.set(shot, { opacity: 0, scale: 1.05 });
  window.gsap.set(play, { opacity: 0, scale: 0.88, xPercent: -50, yPercent: -50 });

  const tl = window.gsap.timeline({
    scrollTrigger: { trigger: stage, start: "top 82%", once: true },
    onComplete() {
      window.gsap.set(shot, { clearProps: "transform,opacity" });
      window.gsap.set(play, { clearProps: "transform,opacity" });
      requestAnimationFrame(() => {
        play.style.transition = "";
        stage.classList.add("is-settled");
      });
    },
  });

  tl.to(shot, { opacity: 1, scale: 1, duration: 1, ease: ANIM.ease }, 0);
  tl.to(play, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 0.7, ease: ANIM.ease }, 0.18);
}
