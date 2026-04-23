import prisma from "./prisma/client.js";

async function main() {
  try {
    // Check for Euphoria event
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: "Euphoria",
          mode: "insensitive",
        },
      },
    });

    console.log("=== Events containing 'Euphoria' ===");
    console.log(JSON.stringify(events, null, 2));

    // Check all EventRequests
    const eventRequests = await prisma.eventRequest.findMany({
      where: {
        title: {
          contains: "Euphoria",
          mode: "insensitive",
        },
      },
      include: {
        submitter: { select: { name: true, email: true } },
        reviewer: { select: { name: true, email: true } },
      },
    });

    console.log("\n=== EventRequests containing 'Euphoria' ===");
    console.log(JSON.stringify(eventRequests, null, 2));

    // Check all published events
    const publishedEvents = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
      },
    });

    console.log("\n=== All Published Events ===");
    console.log(JSON.stringify(publishedEvents, null, 2));

    // Check all event requests
    const allRequests = await prisma.eventRequest.findMany();
    console.log("\n=== Total EventRequests Count: ===", allRequests.length);
    console.log(allRequests.map(r => ({ id: r.id, title: r.title, status: r.status })));

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
