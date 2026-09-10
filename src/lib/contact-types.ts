/**
 * Shared state shape for the contact Server Action.
 *
 * This lives here rather than in app/actions.ts because every export from a
 * `'use server'` module must be an async function — a plain object constant
 * there is a build error.
 */

export type ContactState = {
  ok: boolean;
  /** Keyed by field name; only present when validation failed. */
  errors?: Record<string, string>;
  /** A single human-readable message shown next to the SEND button. */
  message?: string;
};

export const INITIAL_CONTACT_STATE: ContactState = { ok: false };
