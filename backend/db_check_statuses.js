import prisma from "./prisma/client.js";

async function main() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        date: true
      }
    });
    console.log(JSON.stringify(events, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
