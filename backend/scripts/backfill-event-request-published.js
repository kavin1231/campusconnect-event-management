import prisma from "../prisma/client.js";

async function backfillPublishedEventRequests() {
  console.log("Starting EventRequest PUBLISHED backfill...");

  const approvedRequests = await prisma.eventRequest.findMany({
    where: { status: "APPROVED" },
    select: { id: true, title: true, eventDate: true, submittedBy: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const req of approvedRequests) {
    const event = await prisma.event.findFirst({
      where: {
        submittedBy: req.submittedBy,
        title: req.title,
        date: req.eventDate,
      },
      select: { id: true },
    });

    if (!event) {
      skipped += 1;
      continue;
    }

    await prisma.eventRequest.update({
      where: { id: req.id },
      data: { status: "PUBLISHED" },
    });

    updated += 1;
  }

  console.log(`Backfill complete. Updated: ${updated}, Skipped: ${skipped}`);
}

backfillPublishedEventRequests()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
