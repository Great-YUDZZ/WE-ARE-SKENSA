import {
  GeoPoint,
  INSTITUTIONS_CATALOG,
  InstitutionProgram,
  PROGRAM_FIELDS,
  UserLocationOrigin,
  estimateDistanceFromOrigin,
} from "./catalog";
import {
  BALI_EDUCATION_DIRECTORY,
  BaliEntityCategory,
  buildGoogleMapsSearchUrl,
} from "./bali-institutions";

export interface UnifiedKatalogInstitution {
  id: string;
  category: BaliEntityCategory;
  bentuk: string;
  status: string;
  name: string;
  code: string;
  kabupaten: string;
  address: string;
  programs: string[];
  matchedFields: string[];
  estimatedDistanceKm: number;
  mapsUrl: string;
  auditSpotlights: InstitutionProgram[];
  hasAudit: boolean;
}

const PILOT_TO_DIRECTORY_ID: Record<string, string> = {
  "pnb-trpl": "pt-005010-politeknik-negeri-bali-pnb",
  "pnb-tabanan": "pt-005010-politeknik-negeri-bali-pnb",
  "isi-dkv": "pt-002007-institut-seni-indonesia-denpasar",
  "poltekpar-perhotelan": "pt-385005-politeknik-pariwisata-bali-polte",
  "smkn1-dps": "smk-50103118-smkn-1-denpasar",
  "unud-kesehatan": "pt-001013-universitas-udayana-unud",
  "poltekkes-dps": "pt-405018-politeknik-kesehatan-kemenkes-de",
  "undiknas-bisnis": "pt-081004-universitas-pendidikan-nasional-",
  "smkn3-sukawati": "smk-50102150-smkn-3-sukawati",
  "undiksha-singaraja": "pt-001048-universitas-pendidikan-ganesha-u",
  "smkn1-petang": "smk-50103848-smkn-1-petang",
  "smkn1-abang": "smk-50102379-smkn-1-abang",
  "smkn1-negara": "smk-50102715-smkn-1-negara",
  "smkn1-bangli": "smk-50102604-smkn-1-bangli",
};

const FIELD_NAME_MAP: Record<string, string> = Object.fromEntries(
  PROGRAM_FIELDS.map((field) => [field.id, field.name])
);

export function getFieldLabelById(fieldId: string): string {
  return FIELD_NAME_MAP[fieldId] ?? fieldId;
}

export function getUnifiedKatalogInstitutions(
  origin: string | GeoPoint | UserLocationOrigin = "Kota Denpasar"
): UnifiedKatalogInstitution[] {
  const auditsByEntityId = new Map<string, InstitutionProgram[]>();
  const standaloneAudits: InstitutionProgram[] = [];

  for (const audit of INSTITUTIONS_CATALOG) {
    const targetId = PILOT_TO_DIRECTORY_ID[audit.institutionId];
    if (targetId) {
      const existing = auditsByEntityId.get(targetId) ?? [];
      existing.push(audit);
      auditsByEntityId.set(targetId, existing);
    } else {
      standaloneAudits.push(audit);
    }
  }

  const unified: UnifiedKatalogInstitution[] = BALI_EDUCATION_DIRECTORY.map(
    (entity) => {
      const audits = auditsByEntityId.get(entity.id) ?? [];
      return {
        ...entity,
        estimatedDistanceKm: estimateDistanceFromOrigin(
          origin,
          entity.kabupaten,
          entity.address
        ),
        mapsUrl: buildGoogleMapsSearchUrl(entity.name, entity.address),
        auditSpotlights: audits,
        hasAudit: audits.length > 0,
      };
    }
  );

  for (const extra of standaloneAudits) {
    unified.push({
      id: `pilot-${extra.institutionId}`,
      category: extra.level === "SMK" ? "smk" : "perguruan-tinggi",
      bentuk: extra.level === "SMK" ? "SMK" : "Perguruan Tinggi",
      status: extra.tuitionFeeText.toLowerCase().includes("bos")
        ? "Negeri"
        : "Swasta",
      name: extra.institutionName,
      code: "Audit Pilot",
      kabupaten: extra.kabupaten,
      address: `${extra.district}, ${extra.kabupaten}`,
      programs: [extra.programName],
      matchedFields: extra.level === "SMK" && extra.institutionId === "smk-klungkung" ? ["kesehatan"] : [],
      estimatedDistanceKm: estimateDistanceFromOrigin(
        origin,
        extra.kabupaten,
        extra.district
      ),
      mapsUrl: buildGoogleMapsSearchUrl(
        extra.institutionName,
        `${extra.district}, ${extra.kabupaten}`
      ),
      auditSpotlights: [extra],
      hasAudit: true,
    });
  }

  return unified;
}
