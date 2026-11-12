"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import PasswordField from "./PasswordField";
import AuthAbstractArtwork from "./AuthAbstractArtwork";
import KertaMargaLogo from "@/components/KertaMargaLogo";
import { saveUserToStorage } from "@/lib/useAuth";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText);
}

/**
 * Full-Viewport Dual-Pane Sliding Auth Portal built with Neo-Pop geometry,
 * GSAP choreography (SplitText, quickTo pointer parallax, timeline transitions),
 * and Scroll-Craft dimensional plane separation.
 */
export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(mode === "register");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Shared UI states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // GSAP refs & quickTo setters
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayHeadlineRef = useRef<HTMLHeadingElement>(null);
  const overlaySubRef = useRef<HTMLParagraphElement>(null);
  const overlayBtnRef = useRef<HTMLButtonElement>(null);
  const loginBoxRef = useRef<HTMLDivElement>(null);
  const registerBoxRef = useRef<HTMLDivElement>(null);
  const slideTlRef = useRef<gsap.core.Timeline | null>(null);
  const prevModePropRef = useRef(mode);
  const reducedMotionRef = useRef(false);

  const parallaxRef = useRef<{
    gridX?: gsap.QuickToFunc;
    gridY?: gsap.QuickToFunc;
    wavesX?: gsap.QuickToFunc;
    wavesY?: gsap.QuickToFunc;
    shardsX?: gsap.QuickToFunc;
    shardsY?: gsap.QuickToFunc;
  }>({});

  // Initial mount choreography + Scroll-Craft multi-depth pointer parallax
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      reducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          xPercent: isRegister ? 0 : 100,
        });
      }

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Draw parametric waves and orbital arcs on mount
        gsap.fromTo(
          ".abstract-draw-path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.35,
            stagger: 0.08,
            ease: "power2.out",
          }
        );

        // Gentle continuous ambient drift on abstract shards (composited transforms only)
        gsap.to(".abstract-float-a", {
          y: -10,
          rotation: 3,
          transformOrigin: "center center",
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".abstract-float-b", {
          y: 12,
          rotation: -4,
          transformOrigin: "center center",
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".abstract-float-c", {
          x: 10,
          y: -6,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Stagger active form elements on mount
        const activeSelector = isRegister
          ? "[data-reg-stagger]"
          : "[data-login-stagger]";
        gsap.fromTo(
          activeSelector,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.045,
            ease: "power3.out",
            clearProps: "transform",
          }
        );

        // Setup GPU-composited quickTo parallax layers inside desktop overlay
        if (overlayRef.current) {
          const gridEl = overlayRef.current.querySelector('[data-depth="grid"]');
          const wavesEl = overlayRef.current.querySelector('[data-depth="waves"]');
          const shardsEl = overlayRef.current.querySelector('[data-depth="shards"]');

          if (gridEl) {
            parallaxRef.current.gridX = gsap.quickTo(gridEl, "x", {
              duration: 0.55,
              ease: "power3.out",
            });
            parallaxRef.current.gridY = gsap.quickTo(gridEl, "y", {
              duration: 0.55,
              ease: "power3.out",
            });
          }
          if (wavesEl) {
            parallaxRef.current.wavesX = gsap.quickTo(wavesEl, "x", {
              duration: 0.5,
              ease: "power3.out",
            });
            parallaxRef.current.wavesY = gsap.quickTo(wavesEl, "y", {
              duration: 0.5,
              ease: "power3.out",
            });
          }
          if (shardsEl) {
            parallaxRef.current.shardsX = gsap.quickTo(shardsEl, "x", {
              duration: 0.42,
              ease: "power3.out",
            });
            parallaxRef.current.shardsY = gsap.quickTo(shardsEl, "y", {
              duration: 0.42,
              ease: "power3.out",
            });
          }
        }
      });

      return () => {
        mm.revert();
        slideTlRef.current?.kill();
      };
    },
    { scope: rootRef }
  );

  // SplitText kinetic headline animation synced cleanly with React element key
  useLayoutEffect(() => {
    const headlineEl = overlayHeadlineRef.current;
    if (!headlineEl || reducedMotionRef.current) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(headlineEl, {
        type: "words,chars",
        mask: "words",
      });
      gsap.from(split.chars, {
        yPercent: 110,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.015,
        ease: "power3.out",
      });
    }, overlayRef);

    return () => ctx.revert();
  }, [isRegister]);

  // Persistent non-reverting Dual-Pane slide animation so BOTH directions animate smoothly
  const runSlideTransition = contextSafe((nextIsRegister: boolean) => {
    slideTlRef.current?.kill();

    if (reducedMotionRef.current) {
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { xPercent: nextIsRegister ? 0 : 100 });
      }
      return;
    }

    const tl = gsap.timeline();
    slideTlRef.current = tl;

    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        {
          xPercent: nextIsRegister ? 0 : 100,
          duration: 0.72,
          ease: "power3.inOut",
        },
        0
      );

      const wavesEl = overlayRef.current.querySelector('[data-depth="waves"]');
      const shardsEl = overlayRef.current.querySelector('[data-depth="shards"]');
      const shiftDir = nextIsRegister ? -1 : 1;

      if (wavesEl) {
        tl.fromTo(
          wavesEl,
          { x: shiftDir * 22 },
          { x: 0, duration: 0.82, ease: "power3.out" },
          0.06
        );
      }
      if (shardsEl) {
        tl.fromTo(
          shardsEl,
          { x: shiftDir * 36, rotation: shiftDir * 3, scale: 1.04 },
          { x: 0, rotation: 0, scale: 1, duration: 0.88, ease: "power3.out" },
          0.06
        );
      }
    }

    if (overlaySubRef.current) {
      tl.fromTo(
        overlaySubRef.current,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
        0.16
      );
    }

    if (overlayBtnRef.current) {
      tl.fromTo(
        overlayBtnRef.current,
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "transform",
        },
        0.22
      );
    }

    const targetStagger = nextIsRegister
      ? "[data-reg-stagger]"
      : "[data-login-stagger]";
    tl.fromTo(
      targetStagger,
      { y: 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.48,
        stagger: 0.04,
        ease: "power3.out",
        clearProps: "transform",
      },
      0.18
    );
  });

  // Sync if URL query prop (?mode=daftar <-> /login) changes externally
  useEffect(() => {
    if (prevModePropRef.current === mode) return;
    prevModePropRef.current = mode;
    const nextIsRegister = mode === "register";
    setIsRegister(nextIsRegister);
    setError(null);
    setShowForgotHelp(false);
    runSlideTransition(nextIsRegister);
  }, [mode, runSlideTransition]);

  const handleOverlayPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    parallaxRef.current.gridX?.(nx * 6);
    parallaxRef.current.gridY?.(ny * 6);
    parallaxRef.current.wavesX?.(nx * 14);
    parallaxRef.current.wavesY?.(ny * 12);
    parallaxRef.current.shardsX?.(nx * 24);
    parallaxRef.current.shardsY?.(ny * 18);
  };

  const handleOverlayPointerLeave = () => {
    parallaxRef.current.gridX?.(0);
    parallaxRef.current.gridY?.(0);
    parallaxRef.current.wavesX?.(0);
    parallaxRef.current.wavesY?.(0);
    parallaxRef.current.shardsX?.(0);
    parallaxRef.current.shardsY?.(0);
  };

  const triggerErrorShake = (targetEl: HTMLDivElement | null) => {
    if (!targetEl || reducedMotionRef.current) return;
    gsap.fromTo(
      targetEl,
      { x: -6 },
      { x: 0, duration: 0.42, ease: "elastic.out(1, 0.3)", clearProps: "transform" }
    );
  };

  const switchSide = (nextIsRegister: boolean) => {
    if (nextIsRegister === isRegister) return;
    setIsRegister(nextIsRegister);
    setError(null);
    setShowForgotHelp(false);
    runSlideTransition(nextIsRegister);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginEmail.trim().length < 3) {
      triggerErrorShake(loginBoxRef.current);
      return setError("Masukkan email atau username akun Anda");
    }
    if (loginPassword.length < 6) {
      triggerErrorShake(loginBoxRef.current);
      return setError("Kata sandi minimal 6 karakter");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerErrorShake(loginBoxRef.current);
        setError(data.error ?? "Email atau kata sandi tidak sesuai");
        return;
      }
      if (data.user) {
        saveUserToStorage(data.user);
      }
      router.push("/eksplorasi");
      router.refresh();
    } catch {
      triggerErrorShake(loginBoxRef.current);
      setError("Tidak dapat terhubung ke server, periksa koneksi lalu coba kembali");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regName.trim().length < 2) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Nama lengkap minimal 2 karakter");
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(regEmail.trim());
    if (!emailOk) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Format email tidak valid");
    }
    if (regPassword.length < 8) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Kata sandi minimal 8 karakter");
    }
    if (!/[a-zA-Z]/.test(regPassword) || !/[0-9]/.test(regPassword)) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Kata sandi wajib mengandung kombinasi huruf dan angka");
    }
    if (regPassword !== regPasswordConfirm) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Konfirmasi kata sandi tidak sama");
    }
    if (!agreed) {
      triggerErrorShake(registerBoxRef.current);
      return setError("Centang persetujuan privasi data minimal untuk melanjutkan");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          passwordConfirm: regPasswordConfirm,
          agreed,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        triggerErrorShake(registerBoxRef.current);
        setError(data.error ?? "Gagal membuat akun, silakan periksa kembali data Anda");
        return;
      }
      if (data.user) {
        saveUserToStorage(data.user);
      }
      router.push("/eksplorasi");
      router.refresh();
    } catch {
      triggerErrorShake(registerBoxRef.current);
      setError("Tidak dapat terhubung ke server, periksa koneksi lalu coba kembali");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen md:h-screen relative flex flex-col bg-[#FAF7F2] overflow-x-hidden md:overflow-hidden"
    >
      {/* MOBILE ARCHITECTURAL TOP STRIP (Art-directed separately for < md) */}
      <header className="md:hidden relative overflow-hidden bg-[#141413] text-[#FAF7F2] border-b-2 border-[#141413] px-5 pt-5 pb-5 shrink-0">
        <AuthAbstractArtwork compact />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <KertaMargaLogo
              variant="compact"
              className="w-10 h-10 shrink-0 drop-shadow-[2px_2px_0px_#FFBE2E]"
            />
            <span className="font-display font-black text-lg tracking-tight text-white">
              KertaMarga
            </span>
          </Link>

          <Link
            href="/"
            className="min-h-[40px] px-3.5 py-2 rounded-xl border-2 border-[#FAF7F2]/35 bg-white/10 hover:bg-white/15 text-[#FAF7F2] font-mono font-bold text-xs inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Beranda</span>
          </Link>
        </div>

        <div className="relative z-10 mt-4">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#1F1F1D] border-2 border-[#FAF7F2]/20">
            <button
              type="button"
              onClick={() => switchSide(false)}
              className={`min-h-[40px] rounded-lg font-display font-extrabold text-xs transition-colors cursor-pointer ${
                !isRegister
                  ? "bg-[#FF5E4D] text-white border border-[#FAF7F2]"
                  : "text-[#FAF7F2]/75 hover:text-white"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchSide(true)}
              className={`min-h-[40px] rounded-lg font-display font-extrabold text-xs transition-colors cursor-pointer ${
                isRegister
                  ? "bg-[#B8F348] text-[#141413] border border-[#141413]"
                  : "text-[#FAF7F2]/75 hover:text-white"
              }`}
            >
              Buat Akun
            </button>
          </div>
        </div>
      </header>

      {/* FULL-VIEWPORT DUAL-PANE GRID: Left = Form Masuk, Right = Form Buat Akun */}
      <div className="flex-1 md:h-full w-full grid grid-cols-1 md:grid-cols-2 relative">
        {/* LEFT PANE: FORM MASUK */}
        <section
          aria-hidden={isRegister}
          className={`relative flex flex-col justify-center p-6 sm:p-10 lg:px-14 lg:py-10 neopop-canvas-subtle overflow-y-auto transition-opacity duration-200 ${
            isRegister
              ? "hidden md:flex md:opacity-0 md:pointer-events-none select-none"
              : "flex opacity-100"
          }`}
        >
          {/* Integrated Corner Navigation (Desktop) */}
          <div className="hidden md:block md:absolute md:top-8 md:left-10 lg:left-14 z-10">
            <Link
              href="/"
              tabIndex={isRegister ? -1 : 0}
              className="neo-btn inline-flex items-center gap-1.5 text-xs font-mono font-bold border-2 border-[#141413] bg-white hover:bg-[#F0ECE1] shadow-[3px_3px_0px_#141413] rounded-xl px-3.5 py-2 text-[#141413]"
            >
              <span>&larr;</span>
              <span>Beranda</span>
            </Link>
          </div>

          <div
            ref={loginBoxRef}
            className="w-full max-w-md mx-auto py-4 md:py-0"
          >
            <div data-login-stagger className="mb-6">
              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-[#141413]">
                Masuk
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#52514E] font-medium">
                Masuk dengan email dan kata sandi akun KertaMarga Anda.
              </p>
            </div>

            {!isRegister && error && (
              <div
                role="alert"
                className="mb-4 border-2 border-[#141413] rounded-xl bg-[#FFE5E0] text-[#7A1A12] text-xs font-bold px-3.5 py-2.5"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              <div data-login-stagger>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold text-[#141413] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  tabIndex={isRegister ? -1 : 0}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              <div data-login-stagger>
                <PasswordField
                  id="login-password"
                  label="Kata Sandi"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  minLength={6}
                  autoComplete="current-password"
                  tabIndex={isRegister ? -1 : 0}
                />
              </div>

              <div data-login-stagger className="flex items-center justify-end">
                <button
                  type="button"
                  tabIndex={isRegister ? -1 : 0}
                  onClick={() => setShowForgotHelp((v) => !v)}
                  className="text-xs font-bold text-[#3B66FF] hover:underline underline-offset-2 cursor-pointer"
                >
                  {showForgotHelp ? "Tutup bantuan" : "Lupa kata sandi?"}
                </button>
              </div>

              {showForgotHelp && !isRegister && (
                <div className="p-3 rounded-xl bg-white border-2 border-[#141413] text-xs text-[#52514E] leading-relaxed">
                  Hubungi Guru BK atau administrator sekolah untuk reset kata sandi, atau lanjutkan sementara lewat mode tamu di bawah.
                </div>
              )}

              <div data-login-stagger>
                <button
                  type="submit"
                  disabled={loading || isRegister}
                  tabIndex={isRegister ? -1 : 0}
                  className="neo-btn w-full h-12 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-[#FF5E4D] hover:bg-[#ff4936] text-white font-display font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <span>{loading ? "Memproses..." : "Masuk"}</span>
                  <span className="font-mono">&rarr;</span>
                </button>
              </div>
            </form>

            <div
              data-login-stagger
              className="mt-6 pt-4 border-t border-[#141413]/15 flex flex-col items-center gap-2.5 text-xs"
            >
              <Link
                href="/eksplorasi"
                tabIndex={isRegister ? -1 : 0}
                className="font-mono font-bold text-[#52514E] hover:text-[#141413] underline underline-offset-4"
              >
                Lanjutkan sebagai tamu tanpa login &rarr;
              </Link>

              <p className="md:hidden text-[#52514E] font-medium">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchSide(true)}
                  className="font-display font-bold text-[#3B66FF] hover:underline cursor-pointer"
                >
                  Buat Akun
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT PANE: FORM BUAT AKUN */}
        <section
          aria-hidden={!isRegister}
          className={`relative flex flex-col justify-center p-6 sm:p-10 lg:px-14 lg:py-10 neopop-canvas-subtle overflow-y-auto transition-opacity duration-200 ${
            !isRegister
              ? "hidden md:flex md:opacity-0 md:pointer-events-none select-none"
              : "flex opacity-100"
          }`}
        >
          {/* Integrated Corner Navigation (Desktop) */}
          <div className="hidden md:block md:absolute md:top-8 md:right-10 lg:right-14 z-10">
            <Link
              href="/"
              tabIndex={!isRegister ? -1 : 0}
              className="neo-btn inline-flex items-center gap-1.5 text-xs font-mono font-bold border-2 border-[#141413] bg-white hover:bg-[#F0ECE1] shadow-[3px_3px_0px_#141413] rounded-xl px-3.5 py-2 text-[#141413]"
            >
              <span>&larr;</span>
              <span>Beranda</span>
            </Link>
          </div>

          <div
            ref={registerBoxRef}
            className="w-full max-w-md mx-auto py-4 md:py-0"
          >
            <div data-reg-stagger className="mb-5">
              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-[#141413]">
                Buat Akun
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#52514E] font-medium">
                Daftar singkat untuk menyimpan hasil asesmen dan modul belajar Anda.
              </p>
            </div>

            {isRegister && error && (
              <div
                role="alert"
                className="mb-4 border-2 border-[#141413] rounded-xl bg-[#FFE5E0] text-[#7A1A12] text-xs font-bold px-3.5 py-2.5"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3" noValidate>
              <div data-reg-stagger>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-bold text-[#141413] mb-1.5"
                >
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  tabIndex={!isRegister ? -1 : 0}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Putu Raditya"
                  autoComplete="name"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              <div data-reg-stagger>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-bold text-[#141413] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  tabIndex={!isRegister ? -1 : 0}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              <div data-reg-stagger>
                <PasswordField
                  id="reg-password"
                  label="Kata Sandi"
                  value={regPassword}
                  onChange={setRegPassword}
                  autoComplete="new-password"
                  tabIndex={!isRegister ? -1 : 0}
                />
              </div>

              <div data-reg-stagger>
                <PasswordField
                  id="reg-password-confirm"
                  label="Konfirmasi Kata Sandi"
                  value={regPasswordConfirm}
                  onChange={setRegPasswordConfirm}
                  autoComplete="new-password"
                  tabIndex={!isRegister ? -1 : 0}
                />
              </div>

              <div data-reg-stagger>
                <label className="flex items-start gap-2.5 text-xs font-medium text-[#52514E] leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    tabIndex={!isRegister ? -1 : 0}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#FF5E4D] border-2 border-[#141413]"
                  />
                  <span>
                    Saya menyetujui kebijakan privasi data minimal KertaMarga Bali.
                  </span>
                </label>
              </div>

              <div data-reg-stagger className="pt-1">
                <button
                  type="submit"
                  disabled={loading || !isRegister}
                  tabIndex={!isRegister ? -1 : 0}
                  className="neo-btn w-full h-12 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] font-display font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <span>{loading ? "Memproses..." : "Buat Akun"}</span>
                  <span className="font-mono">&rarr;</span>
                </button>
              </div>
            </form>

            <div
              data-reg-stagger
              className="mt-5 pt-4 border-t border-[#141413]/15 flex flex-col items-center gap-2.5 text-xs"
            >
              <Link
                href="/eksplorasi"
                tabIndex={!isRegister ? -1 : 0}
                className="font-mono font-bold text-[#52514E] hover:text-[#141413] underline underline-offset-4"
              >
                Lanjutkan sebagai tamu tanpa login &rarr;
              </Link>

              <p className="md:hidden text-[#52514E] font-medium">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchSide(false)}
                  className="font-display font-bold text-[#3B66FF] hover:underline cursor-pointer"
                >
                  Masuk
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* DESKTOP FULL-HEIGHT SLIDING ARCHITECTURAL OVERLAY PANEL */}
        <aside
          ref={overlayRef}
          onMouseMove={handleOverlayPointerMove}
          onMouseLeave={handleOverlayPointerLeave}
          className={`hidden md:flex flex-col justify-center p-10 lg:p-14 absolute inset-y-0 left-0 w-1/2 z-20 bg-[#141413] text-[#FAF7F2] will-change-transform overflow-hidden ${
            isRegister ? "border-r-2 border-[#141413]" : "border-l-2 border-[#141413]"
          }`}
        >
          <AuthAbstractArtwork />

          {/* Integrated Top Brand Lockup inside the Dark Architectural Stage */}
          <div className="relative z-10 md:absolute md:top-8 md:left-10 lg:left-14">
            <Link href="/" className="flex items-center gap-3 group">
              <KertaMargaLogo
                variant="full"
                className="w-12 h-12 shrink-0 drop-shadow-[3px_3px_0px_#FFBE2E] group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-display font-black text-xl tracking-tight text-white">
                KertaMarga
              </span>
            </Link>
          </div>

          {/* Focal Kinetic Typography & Mode Switch CTA */}
          <div className="relative z-10 max-w-md space-y-6">
            <div className="space-y-3">
              <h2
                key={isRegister ? "hl-reg" : "hl-log"}
                ref={overlayHeadlineRef}
                className="font-display font-black text-4xl lg:text-5xl tracking-tight text-white leading-[1.06]"
              >
                {isRegister
                  ? "Sudah Punya Akun KertaMarga?"
                  : "Baru Pertama ke KertaMarga?"}
              </h2>

              <p
                ref={overlaySubRef}
                className="text-sm lg:text-base text-[#FAF7F2]/75 leading-relaxed max-w-sm"
              >
                {isRegister
                  ? "Masuk kembali untuk mengakses hasil pemetaan jurusan dan progres modul sertifikasi Anda."
                  : "Buat akun gratis dalam hitungan detik untuk menyimpan hasil rekomendasi jurusan dan modul belajar Anda."}
              </p>
            </div>

            <button
              ref={overlayBtnRef}
              type="button"
              onClick={() => switchSide(!isRegister)}
              className="px-7 h-12 rounded-xl border-2 border-[#FAF7F2] bg-[#FFBE2E] hover:bg-[#ffd05b] text-[#141413] font-display font-black text-sm shadow-[4px_4px_0px_#B8F348] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#B8F348] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_#B8F348] transition-all cursor-pointer inline-flex items-center gap-2.5"
            >
              <span>{isRegister ? "Masuk Sekarang" : "Buat Akun Baru"}</span>
              <span className="font-mono">&rarr;</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
