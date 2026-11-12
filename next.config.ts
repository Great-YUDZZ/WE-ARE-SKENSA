import type { NextConfig } from "next";

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.trim() ||
  "https://kertamarga-bali.vercel.app";

const BASE_CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const PAGE_CSP = [...BASE_CSP_DIRECTIVES, "frame-ancestors 'none'"].join("; ");
const PDF_EMBED_CSP = [...BASE_CSP_DIRECTIVES, "frame-ancestors 'self'"].join(
  "; "
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: PAGE_CSP,
          },
          {
            key: "Access-Control-Allow-Origin",
            value: APP_ORIGIN,
          },
          {
            key: "Vary",
            value: "Origin",
          },
        ],
      },
      {
        source: "/pustaka-modul/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: PDF_EMBED_CSP,
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
