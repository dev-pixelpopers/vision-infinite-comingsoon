"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import type { ContactState } from "@/lib/contact-types";
import { buildHtml, buildPlainText } from "@/lib/email";
import { contactSchema } from "@/lib/schema";

/**
 * Naive per-instance rate limiter. It resets on cold start and does not see
 * other instances, so it is one layer among three rather than a real limiter.
 * Swap for Upstash / Vercel KV if this ever attracts real abuse.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 3;
/** Nobody fills eleven fields this fast. */
const MIN_FILL_MS = 2_500;

const GENERIC_ERROR = "We couldn't send that right now. Please email us directly.";

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // ── anti-spam 1: honeypot ────────────────────────────────────────────
  // Report success so the bot learns nothing about being caught.
  if (String(formData.get("company") ?? "").length > 0) {
    return { ok: true };
  }

  // ── anti-spam 2: time to submit ──────────────────────────────────────
  const ts = Number(formData.get("ts"));
  if (!Number.isFinite(ts) || Date.now() - ts < MIN_FILL_MS) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  // ── anti-spam 3: rate limit by IP ────────────────────────────────────
  const requestHeaders = await headers(); // must be awaited in Next 16
  const ip = (requestHeaders.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    return { ok: false, message: "Too many submissions. Please try again shortly." };
  }
  hits.set(ip, [...recent, now]);

  // ── validation ───────────────────────────────────────────────────────
  // MANDATORY: Server Functions are reachable by direct POST, so the client's
  // `required` attributes and dropdown constraints guarantee nothing. This is
  // the only real gate.
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, message: "Please check the highlighted fields." };
  }

  // ── send ─────────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[contact] missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL — see .env.example",
    );
    return { ok: false, message: GENERIC_ERROR };
  }

  const data = parsed.data;

  try {
    // Constructed lazily, not at module scope: new Resend(undefined) throws.
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `New enquiry — ${data.fullName} · ${data.date}`,
      text: buildPlainText(data),
      html: buildHtml(data),
    });

    if (error) {
      console.error("[contact] resend error", error);
      return { ok: false, message: GENERIC_ERROR };
    }
  } catch (cause) {
    // Never throw out of the action — in production a thrown error reaches the
    // client as an opaque digest with nothing useful to show the user.
    console.error("[contact] send failed", cause);
    return { ok: false, message: GENERIC_ERROR };
  }

  return { ok: true };
}
