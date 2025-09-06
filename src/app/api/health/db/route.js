import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const listingCount = await prisma.listing.count();
    return Response.json({ ok: true, listingCount });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
