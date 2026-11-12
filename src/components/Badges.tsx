import { STATUS_LABEL, type DetailStatus, type TrackId } from "@/config/event";

export function TrackBadge({ track }: { track: TrackId | "open" }) {
  const label = track === "hardware" ? "Hardware" : track === "software" ? "Software" : "Open Innovation";
  return <span className={`vc-badge vc-badge-${track}`}>{label}</span>;
}

/** Visibly distinguishes confirmed, proposed and to-be-announced details. */
export function StatusBadge({ status, className = "" }: { status: DetailStatus; className?: string }) {
  return (
    <span className={`vc-badge vc-badge-${status} ${className}`}>
      <span aria-hidden="true">{status === "confirmed" ? "■" : status === "proposed" ? "◆" : "?"}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 max-w-3xl" data-reveal>
      <p className="vc-eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-bold text-parchment sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-lg text-muted">{children}</div> : null}
    </div>
  );
}
