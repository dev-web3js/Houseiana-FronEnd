import { prisma } from "@/lib/prisma";

// simple distance function in SQL using Haversine formula
function whereByGeo(lat, lng, radiusKm = 20) {
  const r = Number(radiusKm);
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return {};

  // We'll filter approximately by a bounding box for performance, then let client map refine.
  const degLat = r / 111;                   // ~111km per degree latitude
  const degLng = r / (111 * Math.cos(latNum * (Math.PI / 180)) || 1);

  return {
    lat: { gte: latNum - degLat, lte: latNum + degLat },
    lng: { gte: lngNum - degLng, lte: lngNum + degLng },
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location") || "";
    const stay = (searchParams.get("stay") || "monthly").toLowerCase();
    const tier = searchParams.get("tier") || ""; // optional
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radiusKm = searchParams.get("radiusKm") || "20";

    // price filter by cadence
    let priceNotNullFilter = {};
    if (stay === "daily") priceNotNullFilter = { nightlyPrice: { not: null } };
    else if (stay === "weekly") priceNotNullFilter = { weeklyPrice: { not: null } };
    else priceNotNullFilter = { monthlyPrice: { not: null } };

    // tier filter (optional)
    let tierFilter = {};
    if (tier && ["standard", "gold", "premium"].includes(tier)) {
      tierFilter = { tier };
    }

    // location filter (simple: matches city OR country)
    let locationFilter = {};
    if (location) {
      locationFilter = {
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { country: { contains: location, mode: "insensitive" } },
        ],
      };
    }

    // geo filter (optional)
    let geoFilter = {};
    if (lat && lng) {
      geoFilter = whereByGeo(lat, lng, radiusKm);
    }

    const listings = await prisma.listing.findMany({
      where: {
        ...priceNotNullFilter,
        ...tierFilter,
        ...locationFilter,
        ...geoFilter,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return Response.json({ ok: true, count: listings.length, listings });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: "Search failed" }), { status: 500 });
  }
}
