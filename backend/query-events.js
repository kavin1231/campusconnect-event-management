const { PrismaClient } = require('./generated/prisma');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('\n=== EventRequest Records ===');
    const requests = await prisma.eventRequest.findMany();
    console.log(JSON.stringify(requests, null, 2));
    
    console.log('\n=== Event Records ===');
    const events = await prisma.event.findMany();
    console.log(JSON.stringify(events, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
