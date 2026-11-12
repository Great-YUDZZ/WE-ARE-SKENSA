import React from "react";

interface KertaMargaLogoProps {
  /**
   * "full" menampilkan emblem lengkap beserta cincin sirkuit orbit (ideal untuk >= 40px).
   * "compact" menyederhanakan cincin luar agar tetap tajam pada ukuran kecil (navbar & favicon).
   */
  variant?: "full" | "compact";
  className?: string;
  label?: string;
}

const COMPASS_INTERCARDINAL: Array<{
  pointsLeft: string;
  pointsRight: string;
}> = [
  {
    pointsLeft: "100,100 110.33,75.06 148.79,51.21",
    pointsRight: "100,100 148.79,51.21 124.94,89.67",
  },
  {
    pointsLeft: "100,100 124.94,110.33 148.79,148.79",
    pointsRight: "100,100 148.79,148.79 110.33,124.94",
  },
  {
    pointsLeft: "100,100 89.67,124.94 51.21,148.79",
    pointsRight: "100,100 51.21,148.79 75.06,110.33",
  },
  {
    pointsLeft: "100,100 75.06,89.67 51.21,51.21",
    pointsRight: "100,100 51.21,51.21 89.67,75.06",
  },
];

const COMPASS_CARDINAL: Array<{
  pointsLeft: string;
  pointsRight: string;
}> = [
  {
    pointsLeft: "100,100 89.67,75.06 100,16",
    pointsRight: "100,100 100,16 110.33,75.06",
  },
  {
    pointsLeft: "100,100 124.94,89.67 184,100",
    pointsRight: "100,100 184,100 124.94,110.33",
  },
  {
    pointsLeft: "100,100 110.33,124.94 100,184",
    pointsRight: "100,100 100,184 89.67,124.94",
  },
  {
    pointsLeft: "100,100 75.06,110.33 16,100",
    pointsRight: "100,100 16,100 75.06,89.67",
  },
];

const COMPACT_INTERCARDINAL: Array<{
  pointsLeft: string;
  pointsRight: string;
}> = [
  {
    pointsLeft: "100,100 111.1,73.21 151.62,48.38",
    pointsRight: "100,100 151.62,48.38 126.79,88.9",
  },
  {
    pointsLeft: "100,100 126.79,111.1 151.62,151.62",
    pointsRight: "100,100 151.62,151.62 111.1,126.79",
  },
  {
    pointsLeft: "100,100 88.9,126.79 48.38,151.62",
    pointsRight: "100,100 48.38,151.62 73.21,111.1",
  },
  {
    pointsLeft: "100,100 73.21,88.9 48.38,48.38",
    pointsRight: "100,100 48.38,48.38 88.9,73.21",
  },
];

const COMPACT_CARDINAL: Array<{
  pointsLeft: string;
  pointsRight: string;
}> = [
  {
    pointsLeft: "100,100 88.9,73.21 100,13",
    pointsRight: "100,100 100,13 111.1,73.21",
  },
  {
    pointsLeft: "100,100 126.79,88.9 187,100",
    pointsRight: "100,100 187,100 126.79,111.1",
  },
  {
    pointsLeft: "100,100 111.1,126.79 100,187",
    pointsRight: "100,100 100,187 88.9,126.79",
  },
  {
    pointsLeft: "100,100 73.21,111.1 13,100",
    pointsRight: "100,100 13,100 73.21,88.9",
  },
];

const PETAL_ANGLES = [-10, 62, 134, 206, 278];
const OUTER_PETAL_PATH =
  "M 0,0 C -5,-12 -19,-22 -14,-35 C -9,-45 5,-44 12,-33 C 19,-22 10,-9 0,0 Z";
const INNER_GOLD_PATH =
  "M 0,0 C -3,-8 -10,-14 -7,-22 C -4,-28 4,-26 7,-19 C 10,-12 5,-5 0,0 Z";
const SWIRL_LINE_PATH = "M 0,0 C -3,-9 -10,-16 -13,-23";

function JepunCenter({
  scale,
  strokeWidth,
}: {
  scale: number;
  strokeWidth: number;
}) {
  return (
    <g transform={`translate(100,100) scale(${scale})`}>
      {PETAL_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            d={OUTER_PETAL_PATH}
            fill="#F8F4E6"
            stroke="#111622"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d={INNER_GOLD_PATH} fill="#E2A218" />
        </g>
      ))}

      {/* Menutup sambungan kelopak terakhir dengan sisi kiri kelopak pertama */}
      <g transform="rotate(-10)">
        <path
          d="M 0,0 C -5,-12 -19,-22 -14,-35 C -9,-45 2,-43 6,-37 L 1,-18 Z"
          fill="#F8F4E6"
        />
        <path
          d="M 0,0 C -3,-8 -10,-14 -7,-22 C -4,-27 1,-25 4,-22 L 0,-11 Z"
          fill="#E2A218"
        />
        <path
          d="M 0,0 C -5,-12 -19,-22 -14,-35 C -9,-45 2,-43 8,-37"
          fill="none"
          stroke="#111622"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>

      {PETAL_ANGLES.map((angle) => (
        <path
          key={`swirl-${angle}`}
          d={SWIRL_LINE_PATH}
          transform={`rotate(${angle})`}
          fill="none"
          stroke="#111622"
          strokeWidth={strokeWidth * 0.72}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/**
 * Logo resmi KertaMarga Bali: perpaduan Bunga Jepun Bali, kompas 8 arah,
 * dan cincin orbit teknologi.
 */
export default function KertaMargaLogo({
  variant = "compact",
  className = "w-9 h-9",
  label = "Logo KertaMarga Bali",
}: KertaMargaLogoProps) {
  const isCompact = variant === "compact";
  const intercardinal = isCompact ? COMPACT_INTERCARDINAL : COMPASS_INTERCARDINAL;
  const cardinal = isCompact ? COMPACT_CARDINAL : COMPASS_CARDINAL;
  const facetStroke = isCompact ? 3.8 : 2.4;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      {isCompact ? (
        <>
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="#FFFFFF"
            stroke="#111622"
            strokeWidth="7"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="#00AEEC"
            strokeWidth="5.5"
          />
          <circle
            cx="100"
            cy="100"
            r="53"
            fill="none"
            stroke="#00AEEC"
            strokeWidth="5"
          />
        </>
      ) : (
        <>
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="#FFFFFF"
            stroke="#112257"
            strokeWidth="3.6"
          />
          <circle
            cx="100"
            cy="100"
            r="88.5"
            fill="none"
            stroke="#00AEEC"
            strokeWidth="3.2"
          />
          <circle
            cx="100"
            cy="100"
            r="61.5"
            fill="none"
            stroke="#111622"
            strokeWidth="2.2"
          />
          <circle
            cx="100"
            cy="100"
            r="55.5"
            fill="none"
            stroke="#111622"
            strokeWidth="2.6"
            strokeDasharray="4.5 5.5"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r="49"
            fill="none"
            stroke="#111622"
            strokeWidth="7.2"
          />
          <circle
            cx="100"
            cy="100"
            r="49"
            fill="none"
            stroke="#00AEEC"
            strokeWidth="3.4"
          />

          {/* Cincin orbit dan node sirkuit */}
          <path
            d="M 21.27 88.94 A 79.50 79.50 0 0 1 80.77 22.86"
            stroke="#111622"
            strokeWidth="5.6"
            strokeLinecap="round"
          />
          <path
            d="M 21.27 88.94 A 79.50 79.50 0 0 1 80.77 22.86"
            stroke="#00AEEC"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle
            cx="21.27"
            cy="88.94"
            r="4.2"
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth="2"
          />
          <circle
            cx="80.77"
            cy="22.86"
            r="4.2"
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth="2"
          />

          <path
            d="M 117.88 22.54 A 79.50 79.50 0 0 1 177.76 83.47"
            stroke="#112257"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 178.91 90.31 A 79.50 79.50 0 0 1 179.45 97.23"
            stroke="#112257"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle
            cx="162.65"
            cy="51.05"
            r="4.4"
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth="2"
          />

          <path
            d="M 175.61 124.57 A 79.50 79.50 0 0 1 124.57 175.61"
            stroke="#111622"
            strokeWidth="5.6"
            strokeLinecap="round"
          />
          <path
            d="M 175.61 124.57 A 79.50 79.50 0 0 1 124.57 175.61"
            stroke="#00AEEC"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle
            cx="175.61"
            cy="124.57"
            r="4.2"
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth="2"
          />
          <circle
            cx="124.57"
            cy="175.61"
            r="4.2"
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth="2"
          />

          <path
            d="M 80.77 177.14 A 79.50 79.50 0 0 1 34.88 145.60"
            stroke="#112257"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 29.81 137.32 A 79.50 79.50 0 0 1 25.29 127.19"
            stroke="#112257"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 22.86 119.23 A 79.50 79.50 0 0 1 21.09 109.69"
            stroke="#112257"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="80.77" cy="177.14" r="4.2" fill="#112257" />
        </>
      )}

      {/* Bintang kompas interkardinal */}
      {intercardinal.map((item, idx) => (
        <React.Fragment key={`ic-${idx}`}>
          <polygon
            points={item.pointsLeft}
            fill="#112257"
            stroke="#111622"
            strokeWidth={facetStroke}
            strokeLinejoin="round"
          />
          <polygon
            points={item.pointsRight}
            fill="#00AEEC"
            stroke="#111622"
            strokeWidth={facetStroke}
            strokeLinejoin="round"
          />
        </React.Fragment>
      ))}

      {/* Bintang kompas kardinal utama */}
      {cardinal.map((item, idx) => (
        <React.Fragment key={`cd-${idx}`}>
          <polygon
            points={item.pointsLeft}
            fill="#EBF7FC"
            stroke="#111622"
            strokeWidth={facetStroke}
            strokeLinejoin="round"
          />
          <polygon
            points={item.pointsRight}
            fill="#112257"
            stroke="#111622"
            strokeWidth={facetStroke}
            strokeLinejoin="round"
          />
        </React.Fragment>
      ))}

      <JepunCenter
        scale={isCompact ? 1.1 : 1.02}
        strokeWidth={isCompact ? 3.4 : 2.3}
      />
    </svg>
  );
}
