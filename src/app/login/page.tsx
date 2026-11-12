"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";

function LoginPortalContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode =
    modeParam === "daftar" || modeParam === "register" ? "register" : "login";

  return (
    <AuthShell>
      <AuthForm mode={initialMode} />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center neopop-canvas-subtle text-[#141413] font-mono font-bold text-xs">
          Memuat Halaman Masuk KertaMarga...
        </div>
      }
    >
      <LoginPortalContent />
    </Suspense>
  );
}
