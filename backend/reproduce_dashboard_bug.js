import prisma from "./prisma/client.js";

async function testGetEvents() {
  const req = {
    user: { id: 1 }, // Assuming any student ID
    query: { filter: "all", category: "", search: "" }
  };
  
  const studentId = req.user.id;
  const { filter, category, search } = req.query;
  const now = new Date();

  console.log("Searching for events with:", { filter, category, search });

  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" } }
        : {}),
    },
    include: {
      registrations: {
        where: { studentId },
      },
      _count: {
        select: { registrations: true }
      }
    },
    orderBy: { date: "asc" },
  });

  console.log(`Found ${events.length} events.`);
  events.forEach(e => {
    console.log(`- ${e.title} (Status: ${e.status}, Category: ${e.category})`);
  });

  await prisma.$disconnect();
}

testGetEvents();
