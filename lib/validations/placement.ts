// zod/mini: the same Zod v4 engine with a tree-shakable API — the form ships
// a fraction of the bytes of the classic API, which matters on mobile.
import * as z from "zod/mini";
import {
  normalizeIndonesianPhone,
  programChoices,
  scheduleOptions,
} from "./placement-options";

export * from "./placement-options";

/**
 * Error messages are translation keys: the form shows
 * t(`form.errors.${message}`) from messages/{id,en}.json.
 */
export const placementSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "name"), z.maxLength(80, "name")),
  parentName: z._default(
    z.optional(z.string().check(z.trim(), z.maxLength(80, "parentName"))),
    "",
  ),
  whatsapp: z
    .string()
    .check(
      z.trim(),
      z.refine((value) => normalizeIndonesianPhone(value) !== null, "whatsapp"),
    ),
  email: z._default(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(120, "email"),
        z.refine((value) => value === "" || z.email().safeParse(value).success, "email"),
      ),
    ),
    "",
  ),
  program: z.enum(programChoices, "program"),
  schedule: z.enum(scheduleOptions, "schedule"),
  message: z._default(z.optional(z.string().check(z.trim(), z.maxLength(500, "message"))), ""),
  /** Honeypot — hidden from people, bots tend to fill it. */
  website: z._default(z.optional(z.string()), ""),
});

export type PlacementInput = z.input<typeof placementSchema>;
export type PlacementData = z.output<typeof placementSchema>;
export type PlacementField = keyof PlacementInput;
