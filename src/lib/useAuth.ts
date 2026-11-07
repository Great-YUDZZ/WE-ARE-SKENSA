"use client";

import { useState, useEffect, useCallback } from "react";
import type { SafeUser } from "./schema";

const STORAGE_KEY = "kertamarga_user";
const AUTH_EVENT = "kertamarga-auth-change";

export function getCachedUser(): SafeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SafeUser) : null;
  } catch {
    return null;
  }
}

export function saveUserToStorage(user: SafeUser | null) {
  if (typeof window === "undefined") return;
  try {
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
      setUser(cached);
    }

    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
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
      // Pertahankan cached jika network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAuth();

    const handleAuthChange = () => {
      const cached = getCachedUser();
      setUser(cached);
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
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