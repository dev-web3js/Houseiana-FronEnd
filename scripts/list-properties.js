const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listProperties() {
  try {
    const listings = await prisma.listing.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        slug: true
      }
    });
    
    console.log('Available listings:');
    listings.forEach(listing => {
      console.log(`ID: ${listing.id}`);
      console.log(`Title: ${listing.title}`);
      console.log(`Slug: ${listing.slug}`);
      console.log(`Status: ${listing.status}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listProperties();