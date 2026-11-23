import { initAbout, killAboutParallax, setAboutParallax } from "./about.js";
import { initContacts, killContactsParallax, setContactsParallax } from "./contacts.js";
import { initEquipment } from "./equipment.js";
import { initGallery, killGalleryParallax, setGalleryParallax } from "./gallery.js";
import { initHeroIntro, killHeroScroll, setHeroScroll } from "./hero.js";
import { initServices } from "./services.js";
import { ANIM, reducedMotion, releaseHidden, revealElements, setActiveContext, startEpoch } from "./utils.js";

const DESKTOP = "(min-width: 801px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 800px) and (prefers-reduced-motion: no-preference)";

let motion = null;
let refresh = null;

function bindParallax(amount, withGallery) {
  setHeroScroll(amount);
  setAboutParallax(amount.about);
  setContactsParallax(amount.contacts);
  if (withGallery) setGalleryParallax(ANIM.galleryShift);
  else killGalleryParallax();

  return () => {
    killHeroScroll();
    killAboutParallax();
    killGalleryParallax();
    killContactsParallax();
  };
}

function unbindRefresh() {
  if (!refresh) return;
  window.removeEventListener("load", refresh);
  refresh = null;
}

export function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger || reducedMotion()) {
    releaseHidden();
    return;
  }

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  window.ScrollTrigger.config({ ignoreMobileResize: true });

  try {
    motion?.revert();
    unbindRefresh();

    const epoch = startEpoch();

    motion = gsap.context(function setup() {
      setActiveContext(this);
      initHeroIntro(epoch);
      initAbout(epoch);
      initServices();
      initEquipment();
      initGallery();
      initContacts(epoch);

      revealElements(".footer__brand, .footer__row", {
        grouped: true,
        trigger: ".footer",
        distance: 18,
        stagger: 0.12,
        duration: 0.75,
        start: "top 92%",
      });

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => bindParallax(ANIM.parallax.desktop, true));
      mm.add(MOBILE, () => bindParallax(ANIM.parallax.mobile, false));
    });

    document.documentElement.classList.remove("is-motion");
    document.documentElement.classList.add("is-animated");

    refresh = () => window.ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(() => window.ScrollTrigger.refresh());
  } catch (error) {
    motion?.revert();
    releaseHidden();
    console.error(error);
  }
}
