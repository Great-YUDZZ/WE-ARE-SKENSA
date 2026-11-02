"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { FieldGroup, GROUP_CONFIG } from "@/data/fields";

export interface CampusLocation {
  id: string;
  name: string;
  prodi: string;
  district: string;
  kabupaten: string;
  lat: number;
  lng: number;
  group: FieldGroup;
  isTopThree: boolean;
  fieldId: string;
  accreditation: string;
}

export const BALI_CAMPUS_LOCATIONS: CampusLocation[] = [
  // 1. Badung (Bukit Jimbaran) - PNB (Teknologi)
  {
    id: "pnb-trpl",
    name: "Politeknik Negeri Bali (PNB)",
    prodi: "D4 Teknologi Rekayasa Perangkat Lunak",
    district: "Bukit Jimbaran",
    kabupaten: "Badung",
    lat: -8.7981,
    lng: 115.1613,
    group: "teknologi",
    isTopThree: true,
    fieldId: "informatika",
    accreditation: "Baik Sekali",
  },
  // 2. Denpasar Timur - ISI Denpasar (Teknologi & Desain)
  {
    id: "isi-dkv",
    name: "Institut Seni Indonesia (ISI) Denpasar",
    prodi: "S1 Desain Komunikasi Visual",
    district: "Denpasar Timur",
    kabupaten: "Kota Denpasar",
    lat: -8.6534,
    lng: 115.2345,
    group: "teknologi",
    isTopThree: true,
    fieldId: "dkv",
    accreditation: "Unggul",
  },
  // 3. Badung (Nusa Dua) - Poltekpar Bali (Usaha & Pariwisata)
  {
    id: "poltekpar-perhotelan",
    name: "Politeknik Pariwisata Bali (Poltekpar)",
    prodi: "D4 Pengelolaan Perhotelan",
    district: "Nusa Dua",
    kabupaten: "Badung",
    lat: -8.8005,
    lng: 115.2281,
    group: "usaha",
    isTopThree: true,
    fieldId: "pariwisata",
    accreditation: "Unggul",
  },
  // 4. Denpasar Utara - SMKN 1 Denpasar (Teknologi)
  {
    id: "smkn1-dps",
    name: "SMKN 1 Denpasar",
    prodi: "SMK Rekayasa Perangkat Lunak & TJKT",
    district: "Denpasar Utara",
    kabupaten: "Kota Denpasar",
    lat: -8.6368,
    lng: 115.2081,
    group: "teknologi",
    isTopThree: false,
    fieldId: "informatika",
    accreditation: "A (Unggul)",
  },
  // 5. Denpasar Barat - Unud Kampus Sudirman (Manusia)
  {
    id: "unud-kesehatan",
    name: "Universitas Udayana (Kampus Sudirman)",
    prodi: "S1 Ilmu Keperawatan & Kedokteran",
    district: "Denpasar Barat",
    kabupaten: "Kota Denpasar",
    lat: -8.6705,
    lng: 115.2155,
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Unggul",
  },
  // 6. Denpasar Selatan - Poltekkes Kemenkes (Manusia)
  {
    id: "poltekkes-dps",
    name: "Poltekkes Kemenkes Denpasar",
    prodi: "D4 Keperawatan & Sanitasi Lingkungan",
    district: "Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    lat: -8.6828,
    lng: 115.2392,
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Unggul",
  },
  // 7. Denpasar Selatan - Undiknas University (Usaha)
  {
    id: "undiknas-bisnis",
    name: "Universitas Pendidikan Nasional (Undiknas)",
    prodi: "S1 Bisnis Digital & Manajemen",
    district: "Sideling, Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    lat: -8.6942,
    lng: 115.2288,
    group: "usaha",
    isTopThree: false,
    fieldId: "bisnis",
    accreditation: "Unggul",
  },
  // 8. Gianyar (Batubulan) - SMKN 3 Sukawati KOKAR (Manusia)
  {
    id: "smkn3-sukawati",
    name: "SMKN 3 Sukawati (KOKAR)",
    prodi: "SMK Seni Karawitan, Tari & Pedalangan",
    district: "Batubulan, Sukawati",
    kabupaten: "Gianyar",
    lat: -8.6015,
    lng: 115.2678,
    group: "manusia",
    isTopThree: false,
    fieldId: "budaya",
    accreditation: "A (Unggul)",
  },
  // 9. Buleleng (Singaraja) - Undiksha (Manusia)
  {
    id: "undiksha-singaraja",
    name: "Universitas Pendidikan Ganesha (Undiksha)",
    prodi: "S1 Bimbingan Konseling & Kependidikan",
    district: "Singaraja Kota",
    kabupaten: "Buleleng",
    lat: -8.1187,
    lng: 115.0886,
    group: "manusia",
    isTopThree: false,
    fieldId: "pendidikan",
    accreditation: "Unggul",
  },
  // 10. Tabanan - PNB Kampus Tabanan (Alam)
  {
    id: "pnb-tabanan",
    name: "Politeknik Negeri Bali (Kampus Tabanan)",
    prodi: "D4 Pengelolaan Tanaman Perkebunan Subak",
    district: "Kerambitan",
    kabupaten: "Tabanan",
    lat: -8.5397,
    lng: 115.1235,
    group: "alam",
    isTopThree: false,
    fieldId: "pertanian",
    accreditation: "Baik Sekali",
  },
  // 11. Badung Utara - SMKN 1 Petang (Alam)
  {
    id: "smkn1-petang",
    name: "SMKN 1 Petang",
    prodi: "SMK Agribisnis Organik & Tanaman Pangan",
    district: "Petang",
    kabupaten: "Badung",
    lat: -8.4124,
    lng: 115.2215,
    group: "alam",
    isTopThree: false,
    fieldId: "pertanian",
    accreditation: "A (Unggul)",
  },
  // 12. Karangasem (Abang) - SMKN 1 Abang (Alam)
  {
    id: "smkn1-abang",
    name: "SMKN 1 Abang",
    prodi: "SMK Kemaritiman & Pengolahan Hasil Laut",
    district: "Abang",
    kabupaten: "Karangasem",
    lat: -8.3842,
    lng: 115.6125,
    group: "alam",
    isTopThree: false,
    fieldId: "lingkungan",
    accreditation: "A (Unggul)",
  },
  // 13. Jembrana (Negara) - SMKN 1 Negara (Teknologi & Bisnis)
  {
    id: "smkn1-negara",
    name: "SMKN 1 Negara",
    prodi: "SMK Teknik Komputer Jaringan & Akuntansi",
    district: "Negara Kota",
    kabupaten: "Jembrana",
    lat: -8.3582,
    lng: 114.6247,
    group: "teknologi",
    isTopThree: false,
    fieldId: "informatika",
    accreditation: "A (Unggul)",
  },
  // 14. Bangli - SMKN 1 Bangli (Usaha & Ekowisata)
  {
    id: "smkn1-bangli",
    name: "SMKN 1 Bangli",
    prodi: "SMK Bisnis Manajemen & Ekowisata Bambu",
    district: "Bangli Kota",
    kabupaten: "Bangli",
    lat: -8.4552,
    lng: 115.3562,
    group: "usaha",
    isTopThree: false,
    fieldId: "bisnis",
    accreditation: "A (Unggul)",
  },
  // 15. Klungkung - SMK Kesehatan Panca Atma Jaya (Manusia)
  {
    id: "smk-klungkung",
    name: "SMK Kesehatan Panca Atma Jaya",
    prodi: "SMK Keperawatan & Farmasi Klinis",
    district: "Semarapura",
    kabupaten: "Klungkung",
    lat: -8.5358,
    lng: 115.4042,
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Baik Sekali",
  },
];

interface LeafletBaliMapProps {
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
  onSelectCampus?: (campus: CampusLocation) => void;
}

export default function LeafletBaliMap({
  selectedFieldId,
  onSelectField,
  onSelectCampus,
}: LeafletBaliMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center of Bali: Lat -8.45, Lng 115.18
    const map = L.map(mapContainerRef.current, {
      center: [-8.48, 115.15],
      zoom: 9.3,
      minZoom: 8.5,
      maxZoom: 14,
      zoomControl: true,
      scrollWheelZoom: false, // Prevents unintended page scroll capture
    });

    // Clear, clean, high-detail OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> kontributor',
      maxZoom: 18,
    }).addTo(map);

    // Bounding bounds for Bali to keep user focused on Bali Island
    const baliBounds = L.latLngBounds(
      L.latLng(-8.95, 114.35),
      L.latLng(-8.05, 115.75)
    );
    map.setMaxBounds(baliBounds.pad(0.1));

    // Render Markers for all 15 locations
    BALI_CAMPUS_LOCATIONS.forEach((campus) => {
      const groupConf = GROUP_CONFIG[campus.group];

      // Custom HTML Marker using L.divIcon
      // 3 Top locations: Solid colored background with white inner circle
      // Other locations: Crisp white background with colored border
      const markerHtml = campus.isTopThree
        ? `
          <div style="
            width: 26px;
            height: 26px;
            border-radius: 9999px;
            background-color: ${groupConf.colorHex};
            border: 3px solid #FFFFFF;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #FFFFFF;"></div>
          </div>
        `
        : `
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 9999px;
            background-color: #FFFFFF;
            border: 3px solid ${groupConf.colorHex};
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background-color: ${groupConf.colorHex};"></div>
          </div>
        `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-pin",
        html: markerHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([campus.lat, campus.lng], { icon: customIcon }).addTo(map);

      // Popup content with official badge and accreditation
      const popupContent = `
        <div style="font-family: inherit; min-width: 190px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${groupConf.colorHex}; font-family: monospace;">
              ${groupConf.label}
            </span>
            <span style="font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; background: #E8F5E9; color: #1F7A52; border: 1px solid #A5D6A7;">
              ${campus.accreditation}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #1B1B2F; line-height: 1.25; margin-bottom: 2px;">
            ${campus.name}
          </div>
          <div style="font-size: 11px; color: #5A5A70; margin-bottom: 6px;">
            ${campus.prodi}
          </div>
          <div style="font-size: 10px; color: #73738C; border-top: 1px solid #E6E1D6; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>${campus.district}, ${campus.kabupaten}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onSelectField(campus.fieldId);
        if (onSelectCampus) onSelectCampus(campus);
      });

      markersRef.current[campus.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectField, onSelectCampus]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[360px] sm:min-h-[440px] rounded-xl overflow-hidden shadow-inner border border-kmNeutral-garis"
      style={{ zIndex: 1 }}
    />
  );
}
