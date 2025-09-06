import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const host = await prisma.user.create({
    data: {
      email: "host@example.com",
      passwordHash: hashedPassword,
      firstName: "Ahmed",
      lastName: "Al-Thani",
      name: "Ahmed Al-Thani",
      role: "host"
    }
  });

  const guest = await prisma.user.create({
    data: {
      email: "guest@example.com",
      passwordHash: hashedPassword,
      firstName: "Sarah",
      lastName: "Johnson",
      name: "Sarah Johnson",
      role: "guest"
    }
  });

  // Create listings in Qatar
  const qatarListings = [
    {
      hostId: host.id,
      title: "Modern 2BR Apartment in West Bay",
      description: "Stunning sea view apartment in the heart of Doha's business district",
      city: "Doha",
      country: "Qatar",
      address: "West Bay, Doha",
      lat: 25.3264,
      lng: 51.5266,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      nightlyPrice: 250,
      weeklyPrice: 1500,
      monthlyPrice: 4500,
      cleaningFee: 100,
      minNights: 28,
      tier: "gold",
      isActive: true
    },
    {
      hostId: host.id,
      title: "Luxury Villa in The Pearl",
      description: "Beachfront villa with private pool and garden",
      city: "Doha",
      country: "Qatar",
      address: "The Pearl, Doha",
      lat: 25.3685,
      lng: 51.5513,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      nightlyPrice: 500,
      weeklyPrice: 3000,
      monthlyPrice: 9000,
      cleaningFee: 200,
      minNights: 28,
      tier: "premium",
      isActive: true
    },
    {
      hostId: host.id,
      title: "Cozy 1BR in Al Rayyan",
      description: "Affordable family-friendly apartment near schools",
      city: "Al Rayyan",
      country: "Qatar",
      address: "Al Rayyan",
      lat: 25.2919,
      lng: 51.4244,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      nightlyPrice: 100,
      weeklyPrice: 600,
      monthlyPrice: 2000,
      cleaningFee: 50,
      minNights: 28,
      tier: "standard",
      isActive: true
    },
    {
      hostId: host.id,
      title: "Family Villa in Al Wakrah",
      description: "Spacious villa near beaches and traditional souq",
      city: "Al Wakrah",
      country: "Qatar",
      address: "Al Wakrah",
      lat: 25.1717,
      lng: 51.6067,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      nightlyPrice: 300,
      weeklyPrice: 1800,
      monthlyPrice: 5500,
      cleaningFee: 150,
      minNights: 28,
      tier: "gold",
      isActive: true
    },
    {
      hostId: host.id,
      title: "Executive Studio in Lusail",
      description: "Brand new studio in Lusail City development",
      city: "Lusail",
      country: "Qatar",
      address: "Lusail City",
      lat: 25.4542,
      lng: 51.4908,
      bedrooms: 0,
      bathrooms: 1,
      maxGuests: 2,
      nightlyPrice: 150,
      weeklyPrice: 900,
      monthlyPrice: 2800,
      cleaningFee: 75,
      minNights: 28,
      tier: "standard",
      isActive: true
    }
  ];

  for (const listing of qatarListings) {
    await prisma.listing.create({ data: listing });
  }

  console.log("✅ Database seeded with Qatar listings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });