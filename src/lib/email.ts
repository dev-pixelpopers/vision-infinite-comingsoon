import type { ContactInput } from "./schema";

/** Form order, so the recipient sees every enquiry laid out identically. */
const ROWS: ReadonlyArray<readonly [string, keyof ContactInput]> = [
  ["Full name", "fullName"],
  ["Fiancé's name", "fiance"],
  ["Email", "email"],
  ["Where do you live?", "location"],
  ["Event type", "eventType"],
  ["What is your role?", "role"],
  ["Date", "date"],
  ["Event location", "eventLocation"],
  ["Guest count", "guestCount"],
  ["Photography coverage", "coverage"],
  ["Instagram", "instagram"],
  ["Message", "message"],
];

/** Empty answers render as an em dash rather than being omitted. */
const show = (v: unknown) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : "—";
};

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function buildPlainText(data: ContactInput): string {
  const lines = ROWS.map(([label, key]) => `${label}: ${show(data[key])}`);
  lines.push("", "Consent: given", `Submitted: ${new Date().toISOString()}`);
  return `New enquiry — Vision infinie\n\n${lines.join("\n")}\n`;
}

export function buildHtml(data: ContactInput): string {
  // Every value is escaped: this arrives from an unauthenticated endpoint.
  const rows = ROWS.map(
    ([label, key]) => `
      <tr>
        <td style="padding:6px 16px 6px 0;vertical-align:top;color:#666;
                   font:12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;
                   text-transform:uppercase;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:6px 0;vertical-align:top;color:#000;
                   font:14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;
                   white-space:pre-wrap;">${escapeHtml(show(data[key]))}</td>
      </tr>`,
  ).join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f2f2f2;">
  <div style="max-width:640px;margin:0 auto;background:#fff;padding:32px;">
    <h1 style="margin:0 0 24px;font:600 20px/1.2 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;
               text-transform:uppercase;letter-spacing:.02em;">New enquiry</h1>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>
    <p style="margin:24px 0 0;color:#999;
              font:11px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
      Consent given · Submitted ${escapeHtml(new Date().toISOString())}
    </p>
  </div>
</body></html>`;
}
