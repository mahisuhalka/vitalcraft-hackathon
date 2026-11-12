import { z } from "zod";
import { EVENT } from "@/config/event";
import { ALL_CHALLENGES } from "@/data/challenges";

const { min, max } = EVENT.teamSize.value;
const challengeIds = ALL_CHALLENGES.map((c) => c.id) as [string, ...string[]];

const name = (label: string) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(2, `${label} must be at least 2 characters.`)
    .max(80, `${label} must be 80 characters or fewer.`);

/**
 * Shared registration schema. Used by the browser form now and by the
 * server action in the live milestone — the server always re-validates.
 */
export const registrationSchema = z
  .object({
    teamName: name("Team name").max(60, "Team name must be 60 characters or fewer."),
    leaderName: name("Leader name"),
    leaderEmail: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
    college: name("College").max(120, "College must be 120 characters or fewer."),
    track: z.enum(["hardware", "software"], {
      errorMap: () => ({ message: "Choose the Hardware or Software track." }),
    }),
    challengeId: z.enum(challengeIds).optional(),
    teamSize: z.coerce
      .number({ invalid_type_error: "Choose a team size." })
      .int()
      .min(min, `Teams need at least ${min} members.`)
      .max(max, `Teams can have at most ${max} members.`),
    members: z.array(name("Member name")),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Consent is required to coordinate the event with your team." }),
    }),
  })
  .superRefine((data, ctx) => {
    const expected = data.teamSize - 1;
    if (data.members.length !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["members"],
        message: `Add ${expected} other member name${expected === 1 ? "" : "s"}.`,
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;

export type FieldErrors = Partial<Record<string, string>>;

/** Flattens Zod issues into `field` / `members.0` keyed messages. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
