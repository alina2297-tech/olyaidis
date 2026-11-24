import { ANIM, epochIs, track } from "./utils.js";

let epochId = 0;
let introDone = false;
let pending = null;
let nodes = null;
let scrollTweens = [];

function collect() {
  return {
    visual: document.querySelector(".hero__visual"),
    header: document.querySelector(".header"),
    title: document.querySelector(".hero__heading h1"),
    ornament: document.querySelector(".hero__ornament"),
    services: document.querySelector(".hero__panel .services"),
    note: document.querySelector(".hero__note"),
    actions: document.querySelector(".hero__panel .hero__actions"),
    buttons: window.gsap.utils.toArray(".hero__panel .hero__actions .hero__btn"),
    crumbs: document.querySelector(".hero__panel .crumbs"),
  };
}

function textNodes() {
  return [nodes?.title, nodes?.ornament, nodes?.services, nodes?.note, nodes?.actions, nodes?.crumbs].filter(Boolean);
}

function fadeNodes() {
  return [nodes?.ornament, nodes?.services, nodes?.note, nodes?.actions, nodes?.crumbs].filter(Boolean);
}

export function initHeroIntro(epoch) {
  introDone = false;
  pending = null;
  epochId = epoch;
  nodes = collect();

  const { visual, header, title, ornament, services, note, buttons, crumbs } = nodes;
  if (!visual || !title) {
    document.documentElement.classList.remove("is-motion");
    return;
  }

  const tl = window.gsap.timeline({
    defaults: { ease: ANIM.easeHero },
    onComplete: finishIntro,
  });

  tl.fromTo(
    visual,
    { opacity: 0, scale: 1.08 },
    { opacity: 1, scale: 1, duration: ANIM.heroImage, transformOrigin: "center center", force3D: true },
    0,
  );

  tl.fromTo(title, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: ANIM.text }, 0.35);

  if (header) {
    tl.fromTo(header, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: ANIM.ease }, 0.35);
  }

  if (ornament) {
    tl.fromTo(ornament, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.75, ease: ANIM.ease }, 0.62);
  }

  if (services) {
    tl.fromTo(services, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.85, ease: ANIM.ease }, 0.82);
  }

  if (note) {
    tl.fromTo(note, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.85, ease: ANIM.ease }, 1.05);
  }

  if (buttons.length) {
    tl.fromTo(
      buttons,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.16, ease: ANIM.ease },
      1.22,
    );
  }

  if (crumbs) {
    tl.fromTo(crumbs, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: ANIM.ease }, 1.55);
  }

  visual.style.willChange = "transform";
}

function finishIntro() {
  if (!epochIs(epochId) || !nodes?.visual) return;
  nodes.visual.style.willChange = "auto";
  introDone = true;
  if (pending) applyScroll(pending);
}

export function setHeroScroll(options) {
  pending = options;
  if (introDone && epochIs(epochId)) applyScroll(options);
}

export function killHeroScroll() {
  scrollTweens.forEach((tween) => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
  scrollTweens = [];

  if (!introDone || !nodes?.visual) return;
  window.gsap.set(nodes.visual, { y: 0, scale: 1 });
  window.gsap.set(textNodes(), { y: 0, opacity: 1 });
}

function applyScroll(options) {
  killHeroScroll();
  const epoch = epochId;
  const visual = nodes?.visual;
  const title = nodes?.title;
  const fading = fadeNodes();
  if (!visual) return;

  track(() => {
    if (!epochIs(epoch)) return;

    scrollTweens.push(
      window.gsap.fromTo(
        visual,
        { y: 0, scale: 1 },
        {
          y: options.hero,
          scale: options.heroScale,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onToggle(self) {
              visual.style.willChange = self.isActive ? "transform" : "auto";
            },
          },
        },
      ),
    );

    if (title) {
      scrollTweens.push(
        window.gsap.fromTo(
          title,
          { opacity: 1, y: 0 },
          {
            opacity: 0.2,
            y: -12,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
    }

    if (fading.length) {
      scrollTweens.push(
        window.gsap.fromTo(
          fading,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -18,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "68% top",
              scrub: 1,
            },
          },
        ),
      );
    }
  });
}
