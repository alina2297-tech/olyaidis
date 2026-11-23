import { ANIM, isDesktop, revealElements } from "./utils.js";

export function initEquipment() {
  const section = document.querySelector(".equipment");
  if (!section) return;

  const ornament = document.querySelector(".equipment__ornament");
  const label = document.querySelector(".equipment__label");
  const lead = document.querySelector(".equipment__lead");
  const intro = [ornament, label, lead].filter(Boolean);

  intro.forEach((element) => window.gsap.set(element, { opacity: 0, y: element === lead ? 22 : 14 }));

  const head = window.gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 82%", once: true },
    defaults: { ease: ANIM.ease },
  });

  if (ornament) head.to(ornament, { opacity: 1, y: 0, duration: 0.6 }, 0);
  if (label) head.to(label, { opacity: 1, y: 0, duration: 0.7 }, 0.12);
  if (lead) head.to(lead, { opacity: 1, y: 0, duration: 0.85 }, 0.26);

  const kits = window.gsap.utils.toArray(".equipment__kit");
  const desktop = isDesktop();

  if (desktop) {
    const tl = window.gsap.timeline({
      scrollTrigger: { trigger: ".equipment__kits", start: "top 80%", once: true },
      onComplete: () => settleKits(kits),
    });
    kits.forEach((kit, index) => addKit(tl, kit, index * 0.22));
  } else {
    kits.forEach((kit) => {
      const tl = window.gsap.timeline({
        scrollTrigger: { trigger: kit, start: "top 86%", once: true },
        onComplete: () => settleKits([kit]),
      });
      addKit(tl, kit, 0);
    });
  }

  revealElements(".equipment__included p, .equipment__included li", {
    grouped: true,
    trigger: ".equipment__included",
    distance: 16,
    stagger: 0.12,
    duration: 0.6,
    start: "top 90%",
  });
}

function addKit(tl, kit, at) {
  const photo = kit.querySelector(".equipment__photo");
  const row = kit.querySelector(".equipment__row");

  window.gsap.set(kit, { opacity: 0, y: 40 });
  tl.to(kit, { opacity: 1, y: 0, duration: 0.8, ease: ANIM.ease }, at);

  if (photo) {
    window.gsap.set(photo, { clipPath: "inset(0 100% 0 0)", scale: 1.08, transformOrigin: "center center" });
    tl.to(photo, { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 0.9, ease: ANIM.ease }, at);
  }

  if (row) {
    window.gsap.set(row, { opacity: 0 });
    tl.to(row, { opacity: 1, duration: 0.5, ease: ANIM.ease }, at + 0.28);
  }
}

function settleKits(kits) {
  kits.forEach((kit) => {
    const photo = kit.querySelector(".equipment__photo");
    const row = kit.querySelector(".equipment__row");
    window.gsap.set(kit, { clearProps: "transform,opacity" });
    if (photo) window.gsap.set(photo, { clearProps: "transform,clipPath" });
    if (row) window.gsap.set(row, { clearProps: "opacity" });
  });
  document.querySelector(".equipment")?.classList.add("is-settled");
}
