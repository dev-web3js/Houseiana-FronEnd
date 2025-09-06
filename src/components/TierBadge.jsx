import { TIER_META } from "@/lib/tier";

export default function TierBadge({ tier = "standard" }) {
  const meta = TIER_META[tier] || TIER_META.standard;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-neutral-card ring-1 ${meta.ring} ${meta.accent}`}>
      {meta.label}
    </span>
  );
}
