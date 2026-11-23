import { ANIM, isDesktop } from "./utils.js";

let timeline = null;

export function initGallery() {
  const images = window.gsap.utils.toArray(".gallery__shot img");
  if (!images.length) return;

  if (isDesktop()) {
    window.gsap.set(images, { opacity: 0, scale: 1.08 });
    window.gsap.to(images, {
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.12,
      ease: ANIM.ease,
      overwrite: "auto",
      scrollTrigger: { trigger: ".gallery", start: "top 75%", once: true },
      onComplete: settle,
    });
    return;
  }

  const seen = new WeakSet();
  images.forEach((img) => window.gsap.set(img, { opacity: 0, scale: 1.05 }));

  window.ScrollTrigger.batch(".gallery__shot", {
    start: "top 90%",
    once: true,
    onEnter(batch) {
      const fresh = batch.filter((shot) => !seen.has(shot));
      fresh.forEach((shot) => seen.add(shot));
      const imgs = fresh.map((shot) => shot.querySelector("img")).filter(Boolean);
      if (!imgs.length) return;
      window.gsap.to(imgs, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: ANIM.ease,
        overwrite: "auto",
        onComplete() {
          window.gsap.set(imgs, { clearProps: "transform,opacity" });
          document.querySelector(".gallery")?.classList.add("is-settled");
        },
      });
    },
  });
}

function settle() {
  window.gsap.set(".gallery__shot img", { clearProps: "transform,opacity" });
  document.querySelector(".gallery")?.classList.add("is-settled");
}

export function setGalleryParallax(shifts) {
  killGalleryParallax();
  if (!shifts?.length) return;

  const shots = window.gsap.utils.toArray(".gallery__shot");
  timeline = window.gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".gallery",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onToggle(self) {
        shots.forEach((shot) => {
          shot.style.willChange = self.isActive ? "transform" : "auto";
        });
      },
    },
  });

  shots.forEach((shot, index) => {
    const distance = shifts[index];
    if (!distance) return;
    timeline.fromTo(shot, { y: 0 }, { y: distance, duration: 1 }, 0);
  });
}

export function killGalleryParallax() {
  timeline?.scrollTrigger?.kill();
  timeline?.kill();
  timeline = null;
  window.gsap.set(".gallery__shot", { clearProps: "transform" });
  window.gsap.utils.toArray(".gallery__shot").forEach((shot) => {
    shot.style.willChange = "auto";
  });
}
