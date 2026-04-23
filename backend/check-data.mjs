import prisma from "./prisma/client.js";

async function main() {
  try {
    console.log('\n=== EVENT TABLE (what shows on home page) ===');
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        category: true,
        location: true,
        registeredCount: true,
        createdAt: true
      }
    });
    console.log(`Found ${events.length} events:`);
    events.forEach(e => {
      console.log(`  - ${e.title} (date: ${e.date.toISOString().split('T')[0]}, category: ${e.category})`);
    });
    
    console.log('\n=== EVENT REQUEST TABLE (workflow tracking) ===');
    const requests = await prisma.eventRequest.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        eventDate: true,
        venue: true
      }
    });
    console.log(`Found ${requests.length} event requests:`);
    requests.forEach(r => {
      console.log(`  - ${r.title} (status: ${r.status}, date: ${r.eventDate.toISOString().split('T')[0]})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
