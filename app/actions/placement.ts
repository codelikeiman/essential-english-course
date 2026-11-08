"use server";

import {
  normalizeIndonesianPhone,
  placementSchema,
  type PlacementField,
} from "@/lib/validations/placement";

export type PlacementResult =
  | { ok: true }
  | {
      ok: false;
      /** Translation keys per field (see form.errors in messages). */
      fieldErrors?: Partial<Record<PlacementField, string>>;
      formError?: "server";
    };

/**
 * Receives the placement-test form. Validation runs again here with the same
 * Zod schema as the browser, so the server never trusts client input.
 */
export async function submitPlacement(input: unknown): Promise<PlacementResult> {
  const parsed = placementSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<PlacementField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]) as PlacementField;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const data = parsed.data;

  // Honeypot filled → almost certainly a bot. Pretend it worked, store nothing.
  if (data.website) return { ok: true };

  const lead = {
    name: data.name,
    parentName: data.parentName || null,
    whatsapp: normalizeIndonesianPhone(data.whatsapp),
    email: data.email || null,
    program: data.program,
    schedule: data.schedule,
    message: data.message || null,
    submittedAt: new Date().toISOString(),
  };

  try {
    // TODO: deliver the lead somewhere the team will see it. Two easy options:
    //
    // 1) Email via Resend (npm i resend, set RESEND_API_KEY):
    //    const resend = new Resend(process.env.RESEND_API_KEY);
    //    await resend.emails.send({
    //      from: "Website <web@your-domain.id>",
    //      to: ["admin@your-domain.id"],
    //      subject: `Tes penempatan: ${lead.name} (${lead.program})`,
    //      text: JSON.stringify(lead, null, 2),
    //    });
    //
    // 2) Google Sheets via an Apps Script web app (set SHEETS_WEBHOOK_URL):
    //    await fetch(process.env.SHEETS_WEBHOOK_URL!, {
    //      method: "POST",
    //      headers: { "Content-Type": "application/json" },
    //      body: JSON.stringify(lead),
    //    });
    //
    // Also consider basic rate limiting (e.g. per IP) before going live.
    if (process.env.NODE_ENV !== "production") {
      console.info("[placement-test] new request:", lead.program, lead.schedule);
    }
    return { ok: true };
  } catch {
    return { ok: false, formError: "server" };
  }
}
