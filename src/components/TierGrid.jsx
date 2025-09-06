import TierCard from "@/components/TierCard";

export default function TierGrid() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose your comfort level</h2>
        <p className="text-lg text-muted-foreground">
          Three clear tiers. Same transparency and monthly pricing.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TierCard
          tier="standard"
          bullets={[
            "Essential amenities (kitchen, laundry, Wi-Fi)",
            "Budget-friendly in most areas",
            "Good ratings from recent guests",
          ]}
          hint="Typical monthly: QAR 1,200–2,500"
        />
        <TierCard
          tier="gold"
          bullets={[
            "Workspace + fast Wi-Fi + parking",
            "Family-friendly touches available",
            "Higher ratings & reliable hosts",
          ]}
          hint="Typical monthly: QAR 2,000–4,000"
          featured={true}
        />
        <TierCard
          tier="premium"
          bullets={[
            "Top locations & best amenities",
            "Gym/pool or building facilities",
            "Excellent ratings and service",
          ]}
          hint="Typical monthly: QAR 3,500+"
        />
      </div>
    </div>
  );
}