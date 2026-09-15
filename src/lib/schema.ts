/**
 * SERVER ONLY. Nothing under src/components may import this file — zod would
 * be pulled into the client bundle. It is imported by src/app/actions.ts only.
 *
 * The shape here must track ./fields.ts: `required: true` there means a rule
 * with no empty escape hatch here, and every rendered field needs an entry or
 * it is silently dropped. A rule for a field that is NOT rendered is worse
 * still — it fails every submit with an error that has no input to land on.
 */

import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

/**
 * A required whole number, kept as a string so ContactInput stays all-string
 * and ./email.ts can print it unchanged.
 *
 * The pattern is a literal, not `new RegExp(\`...\`)` — inside a template
 * literal `\d` collapses to a bare `d` and the rule silently matches nothing
 * but the letter itself.
 */
const count = (max: number, message: string) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .refine((v) => Number(v) > 0 && Number(v) <= max, message);

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
  fiance: optionalText(120),
  email: z.string().trim().toLowerCase().max(254).pipe(
    z.email("Please enter a valid email address"),
  ),
  // Deliberately permissive: international formats vary far too much to pin
  // down, and a rejected real number costs more than an accepted junk one.
  phone: z
    .string()
    .trim()
    .max(32, "Please enter a valid phone number")
    // Allowed characters, then a digit count — anchoring on `+`-or-digit would
    // throw out "(408) 921-4713", and a length check counts the punctuation.
    .regex(/^[\d+\s\-().]+$/, "Please enter a valid phone number")
    .refine(
      (v) => (v.match(/\d/g) ?? []).length >= 7,
      "Please enter a valid phone number",
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
    .refine((v) => Number.isFinite(Date.parse(v)), "Please enter a valid date"),
  eventLocation: optionalText(200),
  guestCount: count(100_000, "Please enter the number of guests"),
  coverage: count(30, "Please enter the number of days"),
  weddingPlanner: optionalText(120),
  instagram: optionalText(120),
  message: optionalText(5000),
  consent: z.literal("on", { message: "Please accept the consent statement" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
