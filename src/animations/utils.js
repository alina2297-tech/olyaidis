/** Параметры анимаций. Длительности, смещения и stagger настраиваются здесь. */
export const ANIM = {
  ease: "power2.out",
  easeHero: "power3.out",
  heroImage: 1.35,
  text: 0.9,
  stagger: 0.15,
  reveal: 0.8,
  revealY: 22,
  start: "top 85%",
  parallax: {
    desktop: { hero: 36, heroScale: 1.08, about: 40, contacts: 28 },
    mobile: { hero: 12, heroScale: 1.05, about: 12, contacts: 10 },
  },
  galleryShift: [22, 16, -20, -26, 24, 18, -22, -16, 28, 20],
};

let epoch = 0;
let activeContext = null;

export function startEpoch() {
  epoch += 1;
  return epoch;
}

export function epochIs(id) {
  return id === epoch;
}

export function setActiveContext(context) {
  activeContext = context;
}

export function track(callback) {
  if (activeContext?.add) activeContext.add(callback);
  else callback();
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDesktop() {
  return window.matchMedia("(min-width: 801px)").matches;
}

export function releaseHidden() {
  document.documentElement.classList.remove("is-motion");
  window.gsap?.set?.(
    ".hero__visual, .header, .hero__heading h1, .hero__ornament, .hero__panel .services, .hero__note, .hero__panel .hero__actions, .hero__panel .crumbs, .about__photo, .about__copy, .catalog__copy, .catalog__list, .catalog__stage, .equipment__kit, .gallery__shot, .contacts__copy, .contacts__photo",
    { clearProps: "all" },
  );
}

export function revealElements(selector, options = {}) {
  const gsap = window.gsap;
  const items = gsap.utils.toArray(selector);
  if (!items.length) return;

  const axis = options.axis ?? "y";
  const distance = options.distance ?? ANIM.revealY;
  const sign = options.reverse ? -1 : 1;
  const ease = options.ease ?? ANIM.ease;

  const hidden = () => {
    const state = { opacity: 0 };
    if (distance) state[axis] = distance * sign;
    if (options.scaleFrom != null) state.scale = options.scaleFrom;
    return state;
  };

  const shown = () => {
    const state = {
      opacity: 1,
      duration: options.duration ?? ANIM.reveal,
      ease,
      overwrite: "auto",
    };
    if (distance) state[axis] = 0;
    if (options.scaleFrom != null) state.scale = options.scaleTo ?? 1;
    if (options.clearProps) state.clearProps = options.clearProps;
    return state;
  };

  const play = (targets, trigger, staggerValue, delay) => {
    gsap.set(targets, hidden());
    return gsap.to(targets, {
      ...shown(),
      delay: delay ?? 0,
      stagger: staggerValue,
      scrollTrigger: {
        trigger,
        start: options.start ?? ANIM.start,
        once: options.once !== false,
      },
      onComplete: options.onComplete,
    });
  };

  if (options.grouped) {
    return play(items, options.trigger ?? items[0], options.stagger ?? ANIM.stagger, options.delay ?? 0);
  }

  items.forEach((element) => {
    play(element, options.trigger ?? element, 0, options.delay ?? 0);
  });
}
