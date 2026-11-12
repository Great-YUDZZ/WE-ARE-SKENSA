"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

/**
 * Shared hook untuk transisi halaman kartu bergaya menumpuk / mengambil kartu (tactile card deck).
 * Aman terhadap prefers-reduced-motion dan selalu membersihkan inline transform setelah selesai.
 */
export function useCardDeckTransition(
  cardSelector: string,
  safePage: number,
  resetKey: string
) {
  const gridRef = useRef<HTMLDivElement>(null);
  const pageDirectionRef = useRef<1 | -1>(1);
  const hasPaginatedRef = useRef<boolean>(false);
  const outgoingTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (!hasPaginatedRef.current || !gridRef.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(cardSelector, gridRef.current);
      if (cards.length === 0) return;

      gsap.killTweensOf(cards);
      const mm = gsap.matchMedia();
      const dir = pageDirectionRef.current;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          cards,
          {
            x: dir > 0 ? 44 : -44,
            y: dir > 0 ? 22 : -18,
            rotate: dir > 0 ? 2.1 : -2.1,
            scale: dir > 0 ? 0.93 : 1.03,
            opacity: 0,
            transformOrigin: dir > 0 ? "right bottom" : "left top",
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.34,
            stagger: 0.045,
            ease: dir > 0 ? "back.out(1.2)" : "power3.out",
            clearProps: "transform,opacity,transformOrigin",
          }
        );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: gridRef, dependencies: [cardSelector, safePage, resetKey] }
  );

  const transitionToPage = useCallback(
    (nextPage: number, dir: 1 | -1, commitPage: (page: number) => void) => {
      hasPaginatedRef.current = true;
      pageDirectionRef.current = dir;

      if (outgoingTweenRef.current) {
        outgoingTweenRef.current.kill();
        outgoingTweenRef.current = null;
      }

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const gridEl = gridRef.current;
      const cards = gridEl
        ? gsap.utils.toArray<HTMLElement>(cardSelector, gridEl)
        : [];

      const applyAndScroll = () => {
        commitPage(nextPage);
        if (gridEl && typeof window !== "undefined") {
          const rect = gridEl.getBoundingClientRect();
          if (rect.top < 110 || rect.top > window.innerHeight * 0.65) {
            const targetY = Math.max(0, rect.top + window.scrollY - 120);
            window.scrollTo({
              top: targetY,
              behavior: reduceMotion ? "auto" : "smooth",
            });
          }
        }
      };

      if (reduceMotion || cards.length === 0) {
        applyAndScroll();
        return;
      }

      gsap.killTweensOf(cards);
      outgoingTweenRef.current = gsap.to(cards, {
        x: dir > 0 ? -36 : 36,
        y: dir > 0 ? 16 : -16,
        rotate: dir > 0 ? -1.8 : 1.8,
        scale: 0.96,
        opacity: 0,
        duration: 0.14,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          outgoingTweenRef.current = null;
          applyAndScroll();
        },
      });
    },
    [cardSelector]
  );

  return { gridRef, transitionToPage };
}
