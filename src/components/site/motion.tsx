"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/*
 * Every scroll-driven effect on the public site runs from this one frame
 * loop, so the page reads layout once per frame instead of once per widget:
 *
 *   [data-reveal]     gets [data-in] the first time it enters the viewport
 *   [data-lean]       --lean follows scroll velocity — type tips into the
 *                     brand's -12° when you move fast and settles upright
 *   [data-parallax]   drifts against the scroll (value = range in px)
 *   [data-scrub]      --p runs 0→1 as the block crosses the viewport
 *   [data-rail]       pins and turns vertical scroll into a horizontal track
 *   .site-marquee-track  speeds up with scroll velocity
 */

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: { offset: -8 },
      stopInertiaOnNavigate: true,
    });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 1024px)");
    const all = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "";
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    all("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));

    const lean = all("[data-lean]");
    const parallax = reduce ? [] : all("[data-parallax]");
    const scrub = all("[data-scrub]");
    const rails = all("[data-rail]");
    const marquees = reduce
      ? []
      : all(".site-marquee-track").flatMap((el) => el.getAnimations());

    const sizeRails = () => {
      for (const rail of rails) {
        const track = rail.querySelector<HTMLElement>("[data-rail-track]");
        if (!track) continue;
        if (!wide.matches) {
          rail.style.height = "";
          rail.dataset.dist = "0";
          track.style.transform = "";
          continue;
        }
        const dist = Math.max(0, track.offsetWidth - window.innerWidth);
        rail.dataset.dist = String(dist);
        rail.style.height = `${dist + window.innerHeight}px`;
      }
      lenis?.resize();
    };
    sizeRails();
    document.fonts?.ready.then(sizeRails);

    let frame = 0;
    let leanNow = 0;
    let leanSet = 0;
    let rateSet = 1;
    let lastY = -1;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const velocity = lenis?.velocity ?? 0;

      if (!reduce) {
        const target = clamp(-velocity * 0.22, -9, 9);
        leanNow += (target - leanNow) * 0.12;
        if (Math.abs(leanNow - leanSet) > 0.02) {
          leanSet = leanNow;
          const value = `${leanNow.toFixed(2)}deg`;
          for (const el of lean) el.style.setProperty("--lean", value);
        }

        const rate = 1 + Math.min(Math.abs(velocity) * 0.07, 4);
        if (Math.abs(rate - rateSet) > 0.03) {
          rateSet = rate;
          for (const anim of marquees) anim.playbackRate = rate;
        }
      }

      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const vh = window.innerHeight;

      for (const el of parallax) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        const progress = (vh - box.top) / (vh + box.height);
        const range = Number(el.dataset.parallax) || 60;
        el.style.translate = `0 ${((0.5 - progress) * 2 * range).toFixed(1)}px`;
      }

      for (const el of scrub) {
        const box = el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue;
        const p = clamp((vh * 0.82 - box.top) / (box.height + vh * 0.25), 0, 1);
        el.style.setProperty("--p", p.toFixed(3));
      }

      for (const rail of rails) {
        const dist = Number(rail.dataset.dist);
        const track = rail.querySelector<HTMLElement>("[data-rail-track]");
        if (!dist || !track) continue;
        const box = rail.getBoundingClientRect();
        const p = clamp(-box.top / (box.height - vh), 0, 1);
        track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
        rail.style.setProperty("--rail-p", p.toFixed(4));
      }
    };
    frame = requestAnimationFrame(tick);

    const onResize = () => {
      sizeRails();
      lastY = -1;
    };
    window.addEventListener("resize", onResize);
    wide.addEventListener("change", onResize);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", onResize);
    };
  }, [pathname]);

  return null;
}
