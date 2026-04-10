import L from "leaflet";

/**
 * UT registrar building abbreviations → substrings to match OpenStreetMap `name` (lowercase).
 * Add codes as you encounter misses in the wild.
 */
const UT_BUILDING_CODE_PATTERNS: Record<string, readonly string[]> = {
  GDC: ["gates-dell", "gates dell", "gates computer", "bill & melinda gates", "gdc"],
  UTC: ["university teaching center", "teaching center"],
  CPE: [
    "chemical and petroleum",
    "chemical & petroleum",
    "petroleum engineering",
    "cpe",
  ],
  WEL: ["welch hall", "welch", "wel"],
  MRH: ["music recital hall", "mrh"],
  RLM: ["robert lee moore hall", "rlm"],
  PMA: ["physics mathematics astronomy", "pma"],
  ENS: ["engineering sciences", "ernest cockrell", "ens"],
  EER: ["engineering education", "eer"],
  ETC: ["engineering teaching center", "etc"],
  ECJ: ["ernest cockrell jr", "ecj"],
  FAC: ["fine arts building", "fine arts", "fac"],
  BIO: ["biology", "bio"],
  PHR: ["pharmacy", "phr"],
  SAC: ["student activity center", "sac"],
  SSB: ["student services", "ssb"],
  WMB: ["william james", "wmb"],
  CAL: ["calhoun hall", "cal"],
  GEA: ["george i sanchez", "gea"],
  MAI: ["main building", "main hall", "mai"],
  PAR: ["parlin hall", "par"],
  PAT: ["patterson", "pat"],
  RSC: ["rec sports", "rsc"],
  SEA: ["sutton", "sea"],
  SRH: ["sid richardson", "srh"],
  TAY: ["taylor hall", "tay"],
  WAG: ["waggener hall", "wag"],
  WIN: ["williams", "win"],
  BEL: ["belo center", "bel"],
  BMC: ["biomedical", "bmc"],
  DFA: ["doty fine arts", "dfa"],
  HMA: ["hogg memorial", "hma"],
  JGB: ["jackson geological", "jgb"],
  JHH: ["james hogg", "jhh"],
  MBB: ["molecular biology", "mbb"],
  NMS: ["neural", "nms"],
  RLP: ["research laboratory", "rlp"],
};

function patternsForCode(code: string): string[] {
  const u = code.trim().toUpperCase();
  const fromMap = UT_BUILDING_CODE_PATTERNS[u];
  if (fromMap?.length) return [...fromMap];
  return [u.toLowerCase()];
}

/**
 * Pick a building polygon whose `name` matches registrar-style abbreviations / known expansions.
 */
export function lngLatForBuildingCode(
  code: string,
  features: GeoJSON.Feature[]
): { lng: number; lat: number; matchedName: string } | null {
  const patterns = patternsForCode(code);
  for (const f of features) {
    const name = String(f.properties?.name ?? "").trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    if (patterns.some((p) => lower.includes(p))) {
      const gj = L.geoJSON(f as GeoJSON.Feature);
      const c = gj.getBounds().getCenter();
      return { lng: c.lng, lat: c.lat, matchedName: name };
    }
  }
  return null;
}
