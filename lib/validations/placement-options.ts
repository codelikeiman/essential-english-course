import { programSlugs } from "@/content/programs";

/**
 * Runtime values shared by the form (client) and the schema (server + lazy
 * client validation). Kept free of Zod so importing them costs nothing.
 */

export const scheduleOptions = ["afternoon", "evening", "flexible"] as const;
export type ScheduleOption = (typeof scheduleOptions)[number];

/** Every program, plus "not sure yet — help me choose". */
export const programChoices = [...programSlugs, "unsure"] as const;
export type ProgramChoice = (typeof programChoices)[number];

export function isProgramChoice(value: string | null | undefined): value is ProgramChoice {
  return !!value && (programChoices as readonly string[]).includes(value);
}

/**
 * Accepts Indonesian mobile numbers written the way people actually type
 * them: "0812 3456 7890", "0812-3456-7890", "+62 812 3456 7890", "62812…".
 * Returns the wa.me-ready form ("62812…") or null when invalid.
 */
export function normalizeIndonesianPhone(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  let local = compact;
  if (compact.startsWith("+62")) local = `0${compact.slice(3)}`;
  else if (compact.startsWith("62")) local = `0${compact.slice(2)}`;

  // 08 + operator digit + 7–10 more digits → 10 to 13 digits in total.
  if (!/^08[1-9]\d{7,10}$/.test(local)) return null;
  return `62${local.slice(1)}`;
}
