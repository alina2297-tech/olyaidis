import { ANIM, epochIs, track } from "./utils.js";

let epochId = 0;
let settled = false;
let pending = 0;
let photo = null;
let tween = null;

export function initContacts(epoch) {
  settled = false;
  pending = 0;
  epochId = epoch;

  const root = document.querySelector(".contacts");
  const copy = document.querySelector(".contacts__copy");
  if (!root || !copy) return;

  const sequence = [
    ".contacts__ornament",
    ".contacts__label",
    ".contacts__title",
    ".contacts__lead",
    ".contacts__item",
    ".contacts__telegram",
    ".contacts__write",
  ]
    .map((selector) => root.querySelector(selector))
    .filter(Boolean);

  sequence.forEach((element) => {
    window.gsap.set(element, { opacity: 0, y: element.matches(".contacts__title") ? 24 : 16 });
  });

  const tl = window.gsap.timeline({
    scrollTrigger: { trigger: copy, start: "top 80%", once: true },
    defaults: { ease: ANIM.ease },
  });

  sequence.forEach((element, index) => {
    tl.to(element, { opacity: 1, y: 0, duration: 0.75 }, index * 0.14);
  });
}

function settlePhoto() {
  if (!epochIs(epochId) || !photo) return;
  const frame = photo.parentElement;
  window.gsap.set(photo, { clearProps: "transform,opacity" });
  if (frame) window.gsap.set(frame, { clearProps: "clipPath" });
  settled = true;
  if (pending) mount(pending);
}

export function setContactsParallax(distance) {
  pending = distance;
  if (settled && epochIs(epochId)) mount(distance);
}

export function killContactsParallax() {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
  if (settled && photo) window.gsap.set(photo, { y: 0 });
}

function mount(distance) {
  if (!photo || !distance) return;
  killContactsParallax();
  const epoch = epochId;

  track(() => {
    if (!epochIs(epoch) || !photo) return;
    tween = window.gsap.fromTo(
      photo,
      { y: 0 },
      {
        y: distance,
        ease: "none",
        overwrite: "auto",
        scrollTrigger: {
          trigger: ".contacts",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });
}
