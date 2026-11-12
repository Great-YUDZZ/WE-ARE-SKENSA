"use client";

import React from "react";

interface AuthAbstractArtworkProps {
  compact?: boolean;
}

/**
 * Minimalist Neo-Pop abstract geometric vector artwork with Scroll-Craft
 * multi-depth planes (`data-depth`) driven by GSAP intro, ambient orbit, and pointer parallax.
 */
export default function AuthAbstractArtwork({
  compact = false,
}: AuthAbstractArtworkProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Plane 1: Architectural Dot Matrix & Coordinate Ticks (0.2x depth) */}
      <div
        data-depth="grid"
        className="absolute -inset-6 will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(rgba(250, 247, 242, 0.14) 1px, transparent 1px)",
          backgroundSize: compact ? "18px 18px" : "24px 24px",
        }}
      >
        <svg
          className="w-full h-full opacity-25"
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <line
            x1="76"
            y1="0"
            x2="76"
            y2="900"
            stroke="#FAF7F2"
            strokeWidth="0.75"
            strokeDasharray="4 10"
          />
          <line
            x1="724"
            y1="0"
            x2="724"
            y2="900"
            stroke="#FAF7F2"
            strokeWidth="0.75"
            strokeDasharray="4 10"
          />
          <path
            d="M120 140 h14 M127 133 v14 M666 760 h14 M673 753 v14"
            stroke="#B8F348"
            strokeWidth="1.25"
            strokeOpacity="0.55"
          />
        </svg>
      </div>

      {/* Plane 2: Abstract Parametric Flowing Ribbons & Orbital Arcs (0.55x depth) */}
      <div data-depth="waves" className="absolute -inset-8 will-change-transform">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle
            className="abstract-draw-path"
            pathLength={1}
            cx="690"
            cy="150"
            r={compact ? 110 : 185}
            stroke="#FAF7F2"
            strokeWidth="1.25"
            strokeOpacity="0.16"
          />
          <circle
            className="abstract-draw-path"
            pathLength={1}
            cx="690"
            cy="150"
            r={compact ? 74 : 132}
            stroke="#B8F348"
            strokeWidth="1.5"
            strokeOpacity="0.28"
            strokeDasharray="8 6"
          />

          <path
            className="abstract-draw-path"
            pathLength={1}
            d="M-60,650 C140,565 310,730 500,635 C655,558 760,665 880,610"
            stroke="#B8F348"
            strokeWidth={compact ? "1.6" : "2"}
            strokeOpacity="0.34"
          />
          <path
            className="abstract-draw-path"
            pathLength={1}
            d="M-50,705 C160,620 330,785 520,690 C675,612 780,720 890,665"
            stroke="#FAF7F2"
            strokeWidth="1.2"
            strokeOpacity="0.2"
          />
          <path
            className="abstract-draw-path"
            pathLength={1}
            d="M-40,760 C180,675 350,840 540,745 C695,668 800,775 900,720"
            stroke="#FFBE2E"
            strokeWidth={compact ? "1.5" : "1.8"}
            strokeOpacity="0.3"
          />

          {!compact && (
            <path
              className="abstract-draw-path"
              pathLength={1}
              d="M-40,210 C150,150 280,260 460,185"
              stroke="#3B66FF"
              strokeWidth="1.5"
              strokeOpacity="0.32"
            />
          )}
        </svg>
      </div>

      {/* Plane 3: Bauhaus / Neo-Pop Abstract Geometric Shards (0.95x depth) */}
      <div data-depth="shards" className="absolute -inset-8 will-change-transform">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Top-right floating abstract Bauhaus wedge + node */}
          <g className="abstract-float-a" opacity={compact ? 0.55 : 0.72}>
            <path
              d="M610 190 A95 95 0 0 1 705 285 L610 285 Z"
              fill="#B8F348"
              fillOpacity="0.1"
              stroke="#B8F348"
              strokeWidth="1.6"
              strokeOpacity="0.45"
            />
            <circle
              cx="566"
              cy="226"
              r="11"
              fill="#FFBE2E"
              fillOpacity="0.85"
            />
          </g>

          {/* Mid-right offset geometric ring cluster */}
          {!compact && (
            <g className="abstract-float-b" opacity={0.68}>
              <rect
                x="592"
                y="458"
                width="108"
                height="108"
                rx="24"
                transform="rotate(-14 592 458)"
                fill="#1D1D1B"
                fillOpacity="0.45"
                stroke="#FAF7F2"
                strokeWidth="1.5"
                strokeOpacity="0.24"
              />
              <rect
                x="616"
                y="482"
                width="64"
                height="64"
                rx="16"
                transform="rotate(10 616 482)"
                stroke="#FFBE2E"
                strokeWidth="1.8"
                strokeOpacity="0.52"
              />
              <circle
                cx="704"
                cy="444"
                r="8"
                fill="#FF5E4D"
                fillOpacity="0.85"
              />
            </g>
          )}

          {/* Bottom-left abstract capsule & geometric diamond */}
          <g className="abstract-float-c" opacity={compact ? 0.45 : 0.65}>
            <rect
              x="74"
              y={compact ? "640" : "710"}
              width="124"
              height="38"
              rx="19"
              stroke="#FAF7F2"
              strokeWidth="1.5"
              strokeOpacity="0.28"
            />
            <polygon
              points="160,656 176,672 160,688 144,672"
              fill="#3B66FF"
              fillOpacity="0.65"
              stroke="#FAF7F2"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
