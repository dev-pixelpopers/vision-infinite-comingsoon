/** Minimal class-name joiner — avoids pulling in clsx for six components. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
