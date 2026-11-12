"use client";

import { useState, useEffect, useCallback } from "react";
import type { SafeUser } from "./schema";

const STORAGE_KEY = "kertamarga_user";
const VAULT_STORAGE_KEY = "kertamarga_vault_token";
const AUTH_EVENT = "kertamarga-auth-change";

export function getStoredVaultToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    return raw && raw.trim().length > 0 ? raw.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function getCachedUser(): SafeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SafeUser>;
    if (
      !parsed ||
      typeof parsed.id !== "number" ||
      typeof parsed.name !== "string" ||
      typeof parsed.identifier !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    // Jangan pernah mempercayai eskalasi role "guru" dari localStorage sebelum diverifikasi /api/auth/me
    return {
      id: parsed.id,
      name: parsed.name.slice(0, 120),
      identifier: parsed.identifier.slice(0, 80),
      email: parsed.email.slice(0, 160),
      role: "siswa",
      interests: Array.isArray(parsed.interests)
        ? parsed.interests.filter((x): x is string => typeof x === "string")
        : [],
      createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
    };
  } catch {
    return null;
  }
}

export function saveUserToStorage(
  user: SafeUser | null,
  vaultToken?: string | null
) {
  if (typeof window === "undefined") return;
  try {
    if (vaultToken && typeof vaultToken === "string" && vaultToken.trim().length > 0) {
      localStorage.setItem(VAULT_STORAGE_KEY, vaultToken.trim());
    }
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch (err) {
    console.error("Gagal menyimpan state user:", err);
  }
}

export function useAuth() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuth = useCallback(async () => {
    const cached = getCachedUser();
    if (cached) {
      setUser((prev) => prev ?? cached);
    }

    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // Server (/api/auth/me via HttpOnly JWT cookie) adalah satu-satunya sumber kebenaran peran & identitas akun
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Pertahankan state minimal jika sedang offline sementara
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void syncAuth();

    const handleInternalAuthChange = () => {
      void syncAuth();
    };

    const handleCrossTabStorage = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEY) {
        void syncAuth();
      }
    };

    window.addEventListener(AUTH_EVENT, handleInternalAuthChange);
    window.addEventListener("storage", handleCrossTabStorage);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleInternalAuthChange);
      window.removeEventListener("storage", handleCrossTabStorage);
    };
  }, [syncAuth]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Gagal request logout:", err);
    }
    saveUserToStorage(null);
    setUser(null);
  };

  return { user, loading, logout, syncAuth };
}
