/**
 * Program structure. All visible text (audience, summaries, level goals…)
 * lives in messages/{id,en}.json under `programs.items.<slug>`.
 */

export const programSlugs = [
  "kindergarten",
  "standard",
  "primary",
  "elementary",
  "intermediate",
  "pre-toefl",
] as const;

export type ProgramSlug = (typeof programSlugs)[number];

export type Program = {
  slug: ProgramSlug;
  /** Display number, e.g. "01". */
  number: string;
  /** Program name — kept identical in both languages. */
  name: string;
  /** Levels inside the program (empty = single stage, e.g. Pre-TOEFL). */
  levels: readonly number[];
  /** Children's programs show the optional parent-name field in the form. */
  forKids: boolean;
  image: { src: string; width: number; height: number };
};

/**
 * Pricing rule from the owner: Kindergarten costs Rp 200.000 per month and
 * every step up adds Rp 20.000.
 *
 * ASSUMPTION: a "step" ("naik tingkatan") is the next PROGRAM
 * (KG → Standard → Primary …), so all levels inside one program share a fee.
 * If a step means the next LEVEL (KG 1 → KG 2 → KG 3 → Standard 1 …),
 * change PRICE_STEP_MODE to "level" — every price on the site, the FAQ,
 * metadata and JSON-LD update automatically.
 */
export const PRICE_STEP_MODE: "program" | "level" = "program";
export const BASE_MONTHLY_FEE = 200_000;
export const FEE_STEP = 20_000;

/** Each level lasts six months. */
export const LEVEL_DURATION_MONTHS = 6;

// TODO: replace the placeholder photos in /public/images (same file names,
// same aspect ratio) with real photos of each class.
export const programs: readonly Program[] = [
  {
    slug: "kindergarten",
    number: "01",
    name: "Kindergarten",
    levels: [1, 2, 3],
    forKids: true,
    image: { src: "/images/program-kindergarten.jpg", width: 1500, height: 1000 },
  },
  {
    slug: "standard",
    number: "02",
    name: "Standard",
    levels: [1, 2, 3],
    forKids: true,
    image: { src: "/images/program-standard.jpg", width: 1500, height: 1000 },
  },
  {
    slug: "primary",
    number: "03",
    name: "Primary",
    levels: [1, 2, 3],
    forKids: true,
    image: { src: "/images/program-primary.jpg", width: 1500, height: 1000 },
  },
  {
    slug: "elementary",
    number: "04",
    name: "Elementary",
    levels: [1, 2, 3],
    forKids: false,
    image: { src: "/images/program-elementary.jpg", width: 1500, height: 1000 },
  },
  {
    slug: "intermediate",
    number: "05",
    name: "Intermediate",
    levels: [1, 2, 3],
    forKids: false,
    image: { src: "/images/program-intermediate.jpg", width: 1500, height: 1000 },
  },
  {
    slug: "pre-toefl",
    number: "06",
    name: "Pre-TOEFL",
    levels: [],
    forKids: false,
    image: { src: "/images/program-pre-toefl.jpg", width: 1500, height: 1000 },
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function isProgramSlug(value: string): value is ProgramSlug {
  return (programSlugs as readonly string[]).includes(value);
}

/** Total number of levels across all programs (a single-stage program counts as one). */
export const totalLevels = programs.reduce(
  (sum, p) => sum + Math.max(p.levels.length, 1),
  0,
);

export type LevelFee = { level: number | null; fee: number };

/** Monthly fee for every level of a program, following PRICE_STEP_MODE. */
export function getLevelFees(slug: ProgramSlug): LevelFee[] {
  const index = programs.findIndex((p) => p.slug === slug);
  const program = programs[index];
  const stages = program.levels.length > 0 ? program.levels : [null];

  if (PRICE_STEP_MODE === "program") {
    const fee = BASE_MONTHLY_FEE + FEE_STEP * index;
    return stages.map((level) => ({ level, fee }));
  }

  const levelsBefore = programs
    .slice(0, index)
    .reduce((sum, p) => sum + Math.max(p.levels.length, 1), 0);
  return stages.map((level, i) => ({
    level,
    fee: BASE_MONTHLY_FEE + FEE_STEP * (levelsBefore + i),
  }));
}

export function getFeeRange(slug: ProgramSlug) {
  const fees = getLevelFees(slug).map((l) => l.fee);
  return { min: Math.min(...fees), max: Math.max(...fees) };
}

export const allFees = programs.flatMap((p) =>
  getLevelFees(p.slug).map((l) => l.fee),
);
export const minMonthlyFee = Math.min(...allFees);
export const maxMonthlyFee = Math.max(...allFees);
