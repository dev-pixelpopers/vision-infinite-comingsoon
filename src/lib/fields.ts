/**
 * Field definitions and dropdown options.
 *
 * PURE DATA — this module crosses into the client bundle, so it must never
 * import zod (or anything server-only). The validation schema that consumes
 * these option lists lives in ./schema.ts, which is server-only.
 */

export type FieldKind = "text" | "email" | "select" | "date" | "textarea";

export type FieldDef = {
  readonly name: string;
  readonly label: string;
  readonly kind: FieldKind;
  readonly required?: boolean;
  readonly wide?: boolean;
  readonly options?: readonly string[];
  readonly autoComplete?: string;
};

export const EVENT_TYPE_OPTIONS = [
  "Wedding Photography",
  "Elopement",
  "Engagement",
  "Proposal",
  "Photoshoot",
  "Birthday Party",
  "Vendor Partnership",
  "Commercial",
] as const;

export const ROLE_OPTIONS = ["Bride", "Groom", "Wedding planner", "other"] as const;

export const GUEST_COUNT_OPTIONS = [
  "less than 100",
  "100 - 200",
  "200 - 300",
  "more than 300",
] as const;

export const COVERAGE_OPTIONS = ["1 Day", "2 Days", "3 Days", "4+ Days"] as const;

/**
 * Source order matters: the two-column grid fills col 1 / col 2 alternately,
 * so items 1,3,5,7,9 land on the left and 2,4,6,8,10 on the right — matching
 * the reference layout. `message` carries `wide` (grid-column: 1 / 3).
 */
export const FIELDS = [
  { name: "fullName", label: "Full name", kind: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", kind: "email", required: true, autoComplete: "email" },
  {
    name: "location",
    label: "Where do you live?",
    kind: "text",
    autoComplete: "address-level2",
  },
  {
    name: "eventType",
    label: "Event type",
    kind: "select",
    required: true,
    options: EVENT_TYPE_OPTIONS,
  },
  { name: "role", label: "What is your role?", kind: "select", options: ROLE_OPTIONS },
  { name: "date", label: "Date", kind: "date" },
  { name: "eventLocation", label: "Event location", kind: "text" },
  { name: "guestCount", label: "Guest count", kind: "select", options: GUEST_COUNT_OPTIONS },
  {
    name: "coverage",
    label: "Photography coverage",
    kind: "select",
    options: COVERAGE_OPTIONS,
  },
  { name: "instagram", label: "Instagram", kind: "text" },
  { name: "message", label: "Message", kind: "textarea", wide: true },
] as const satisfies readonly FieldDef[];

export type FieldName = (typeof FIELDS)[number]["name"];

export const FIELD_NAMES = FIELDS.map((f) => f.name) as readonly FieldName[];

export const EMPTY_VALUES = Object.fromEntries(
  FIELDS.map((f) => [f.name, ""]),
) as Record<FieldName, string>;

export const CONSENT_TEXT =
  "I consent for the information submitted above to be recorded and stored for the purposes of providing services relating to my inquiry. I agree that registration on or use of the Vision infinie site constitutes agreement to its User Agreement & Privacy Policy";
