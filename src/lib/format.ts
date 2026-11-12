import { EVENT } from "@/config/event";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: EVENT.timezone,
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "To be announced";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "To be announced";
  return dateFmt.format(d);
}

export function formatRange(start: string | null, end?: string): string {
  if (!start) return "To be announced";
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  if (sameMonth) {
    const day = new Intl.DateTimeFormat("en-IN", { day: "numeric", timeZone: EVENT.timezone });
    return `${day.format(s)}–${formatDate(end)}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: EVENT.prizes.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `H+${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Returns true if an ISO deadline exists and is in the past. */
export function isPast(iso: string | null | undefined, now: Date = new Date()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t < now.getTime();
}
