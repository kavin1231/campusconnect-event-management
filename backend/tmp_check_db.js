import prisma from './prisma/client.js';

async function check() {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, image: true, status: true }
    });
    console.log('--- DATABASE EVENTS START ---');
    console.log(JSON.stringify(events, null, 2));
    console.log('--- DATABASE EVENTS END ---');
  } catch (err) {
    console.error('Prisma Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
