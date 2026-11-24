import { ANIM, epochIs, isDesktop, track } from "./utils.js";

let epochId = 0;
let settled = false;
let pending = 0;
let photo = null;
let tween = null;

function clip(amount, radius) {
  return `inset(0 ${amount} 0 0 round ${radius})`;
}

export function initAbout(epoch) {
  settled = false;
  pending = 0;
  epochId = epoch;
  photo = document.querySelector(".about__photo");
  const copy = document.querySelector(".about__copy");
  if (!photo || !copy) return;

  const radius = getComputedStyle(photo).borderTopLeftRadius || "0px";
  window.gsap.set(photo, {
    clipPath: clip("100%", radius),
    scale: 1.08,
    transformOrigin: "center center",
  });
  const facts = window.gsap.utils.toArray(".about__facts li");
  const genres = window.gsap.utils.toArray(".about__genres li");
  const button = document.querySelector(".about__btn");
  const ornament = document.querySelector(".about__ornament");
  const showOrnament = ornament && getComputedStyle(ornament).display !== "none";

  window.gsap.fromTo(
    photo,
    { clipPath: clip("100%", radius), scale: 1.08 },
    {
      clipPath: clip("0%", radius),
      scale: 1,
      duration: 1.2,
      ease: ANIM.ease,
      transformOrigin: "center center",
      overwrite: "auto",
      scrollTrigger: { trigger: photo, start: "top 80%", once: true },
      onComplete: settlePhoto,
    },
  );

  const tl = window.gsap.timeline({
    scrollTrigger: { trigger: copy, start: "top 80%", once: true },
    defaults: { ease: ANIM.ease },
  });

  const steps = [];
  if (showOrnament) steps.push(ornament);
  facts.forEach((item) => steps.push(item));
  genres.forEach((item) => steps.push(item));
  if (button) steps.push(button);

  steps.forEach((element) => {
    window.gsap.set(element, { opacity: 0, y: 18 });
  });

  let at = 0;
  steps.forEach((element, index) => {
    const isFirstFact = element === facts[0];
    const distance = isFirstFact || element === ornament ? 20 : 16;
    window.gsap.set(element, { y: distance });
    tl.to(element, { opacity: 1, y: 0, duration: index === 0 ? 0.8 : 0.72 }, at);
    at += index === 0 ? 0.16 : 0.14;
  });
}

function settlePhoto() {
  if (!epochIs(epochId) || !photo) return;
  window.gsap.set(photo, { clearProps: "transform,clipPath" });
  settled = true;
  if (pending) mount(pending);
}

export function setAboutParallax(distance) {
  pending = distance;
  if (settled && epochIs(epochId)) mount(distance);
}

export function killAboutParallax() {
  const active = Boolean(tween);
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
  if (!photo) return;
  photo.style.willChange = "auto";
  if (active && settled) window.gsap.set(photo, { y: 0 });
}

function mount(distance) {
  if (!photo || !distance) return;
  killAboutParallax();
  const epoch = epochId;
  const shift = isDesktop() ? distance : Math.min(distance, 12);
  // Уже пройденный скролл не должен сдвигать фото, которое только что появилось.
  const anchor = window.scrollY;

  track(() => {
    if (!epochIs(epoch) || !photo) return;
    tween = window.gsap.fromTo(
      photo,
      { y: 0 },
      {
        y: shift,
        ease: "none",
        overwrite: "auto",
        immediateRender: false,
        scrollTrigger: {
          trigger: ".about",
          start: anchor,
          end: "bottom top",
          scrub: 1,
          onToggle(self) {
            photo.style.willChange = self.isActive ? "transform" : "auto";
          },
        },
      },
    );
  });
}
