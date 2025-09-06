import TierBadge from "@/components/TierBadge";

export default function ListingCard({ listing, stay = "monthly" }) {
  const price =
    stay === "daily"
      ? listing.nightlyPrice
      : stay === "weekly"
      ? listing.weeklyPrice
      : listing.monthlyPrice;

  const priceLabel = stay === "daily" ? "/night" : stay === "weekly" ? "/week" : "/month";

  return (
    <article className="rounded-xl border border-neutral-border bg-neutral-card p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <TierBadge tier={listing.tier} />
      </div>
      <p className="text-sm text-neutral-mutetext">{listing.city}, {listing.country}</p>
      <div className="mt-3 text-xl font-bold">
        {price ? <>${Number(price).toLocaleString()} <span className="text-sm font-normal">{priceLabel}</span></> : "—"}
      </div>
      <div className="mt-3 text-sm text-neutral-mutetext">
        Min stay: {listing.minNights} nights
      </div>
    </article>
  );
}
