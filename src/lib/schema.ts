/**
 * SERVER ONLY. Nothing under src/components may import this file — zod would
 * be pulled into the client bundle. It is imported by src/app/actions.ts only.
 */

import { z } from "zod";
import {
  COVERAGE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  GUEST_COUNT_OPTIONS,
  ROLE_OPTIONS,
} from "./fields";

/** An optional dropdown: one of the known options, or not answered at all. */
const optionalEnum = <T extends readonly [string, ...string[]]>(options: T) =>
  z.union([z.enum(options), z.literal("")]).optional().default("");

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
  fiance: optionalText(120),
  email: z.string().trim().toLowerCase().max(254).pipe(
    z.email("Please enter a valid email address"),
  ),
  location: optionalText(160),
  eventType: z.enum(EVENT_TYPE_OPTIONS, {
    message: "Please choose an event type",
  }),
  role: optionalEnum(ROLE_OPTIONS),
  date: z
    .union([
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
        .refine((v) => Number.isFinite(Date.parse(v)), "Please enter a valid date"),
      z.literal(""),
    ])
    .optional()
    .default(""),
  eventLocation: optionalText(200),
  guestCount: optionalEnum(GUEST_COUNT_OPTIONS),
  coverage: optionalEnum(COVERAGE_OPTIONS),
  instagram: optionalText(120),
  message: optionalText(5000),
  consent: z.literal("on", { message: "Please accept the consent statement" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
