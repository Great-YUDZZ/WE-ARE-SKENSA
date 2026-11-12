"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

/**
 * Transisi pergantian rute berbasis efek mengambil / menumpuk lembar kartu Neo-Pop.
 * Membersihkan properti transform setelah selesai agar navbar/modal position:fixed tetap akurat.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const deckGhostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (sheetRef.current) {
          gsap.fromTo(
            sheetRef.current,
            {
              y: 26,
              scale: 0.985,
              rotate: 0.35,
              opacity: 0.85,
              transformOrigin: "center top",
            },
            {
              y: 0,
              scale: 1,
              rotate: 0,
              opacity: 1,
              duration: 0.38,
              ease: "power3.out",
              clearProps: "transform,opacity,transformOrigin",
            }
          );
        }

        if (deckGhostRef.current) {
          gsap.fromTo(
            deckGhostRef.current,
            {
              opacity: 0.45,
              y: 8,
              scale: 0.97,
              rotate: -0.6,
            },
            {
              opacity: 0,
              y: -6,
              scale: 1,
              rotate: 0,
              duration: 0.42,
              ease: "power2.out",
              clearProps: "transform,opacity",
            }
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: wrapperRef, dependencies: [pathname] }
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={deckGhostRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-4 top-20 bottom-6 z-0 rounded-3xl border-2 border-[#141413]/25 bg-[#F0ECE1] opacity-0"
      />
      <div ref={sheetRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
