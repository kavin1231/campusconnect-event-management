import prisma from "../prisma/client.js";

const normalizeOrganizerId = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const FACULTY_ORGANIZERS = [
  "Faculty of Computing",
  "Faculty of Engineering",
  "Faculty of Business",
  "Faculty of Humanities & Sciences",
  "Faculty of Graduate Studies",
  "School of Architecture",
  "SLIIT Academy",
  "Faculty of Hospitality & Culinary",
];

const CLUB_ORGANIZERS = [
  "SLIIT FOSS Community",
  "SLIIT Robotics Club",
  "SLIIT Mozi Club",
  "Rotaract Club of SLIIT",
  "SLIIT Leo Club",
  "SLIIT IEEE Student Branch",
  "SLIIT Gavel Club",
  "SLIIT AIESEC",
  "SLIIT Sports Council",
  "SLIIT Arts Society",
  "SLIIT Music Club",
  "SLIIT Drama Society",
  "SLIIT Photography Club",
  "SLIIT Nature Club",
  "SLIIT Media Unit",
  "SLIIT Gaming Community",
  "Software Engineering Community (SEC)",
  "Interactive Media Association (IMA)",
  "Cyber Security Community (CSC)",
  "Data Science Community (DSC)",
];

const KNOWN_ORGANIZERS = [...FACULTY_ORGANIZERS, ...CLUB_ORGANIZERS];

const findKnownOrganizer = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized) return null;

  const exact = KNOWN_ORGANIZERS.find((name) => name === normalized);
  if (exact) return exact;

  const lower = normalized.toLowerCase();
  return KNOWN_ORGANIZERS.find((name) => name.toLowerCase() === lower) || null;
};

const resolveOrganizerFromSelection = (organizingBody) => {
  const matched = findKnownOrganizer(organizingBody);
  if (!matched) {
    return { organizerType: null, organizerId: null, organizerName: null };
  }

  const organizerType = FACULTY_ORGANIZERS.includes(matched)
    ? "FACULTY"
    : "CLUB";

  return {
    organizerType,
    organizerId: normalizeOrganizerId(matched),
    organizerName: matched,
  };
};

async function backfillEventOrganizer() {
  console.log("Starting Event Organizer backfill from EventRequest.organizingBody...");

  const publishedEvents = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      date: true,
      submittedBy: true,
      organizerType: true,
      organizerId: true,
    },
  });

  console.log(`Found ${publishedEvents.length} published events to evaluate`);

  let updated = 0;
  let skipped = 0;

  for (const event of publishedEvents) {
    try {
      if (!event.submittedBy) {
        console.log(`[SKIP] Event ${event.id} (${event.title}) - no submittedBy user`);
        skipped += 1;
        continue;
      }

      const sourceRequest = await prisma.eventRequest.findFirst({
        where: {
          submittedBy: event.submittedBy,
          title: event.title,
          eventDate: event.date,
        },
        orderBy: { id: "desc" },
        select: {
          id: true,
          organizingBody: true,
          submitter: {
            select: {
              clubOrFacultyType: true,
              clubOrFacultyName: true,
            },
          },
        },
      });

      if (!sourceRequest) {
        console.log(`[SKIP] Event ${event.id} (${event.title}) - source event request not found`);
        skipped += 1;
        continue;
      }

      let organizer = resolveOrganizerFromSelection(sourceRequest.organizingBody);

      // Fallback for legacy requests without organizingBody.
      if (!organizer.organizerType || !organizer.organizerId) {
        const fallbackType = ["CLUB", "FACULTY"].includes(
          String(sourceRequest.submitter?.clubOrFacultyType || "").toUpperCase(),
        )
          ? String(sourceRequest.submitter?.clubOrFacultyType || "").toUpperCase()
          : null;

        const fallbackId = normalizeOrganizerId(
          sourceRequest.submitter?.clubOrFacultyName,
        );

        organizer = {
          organizerType: fallbackType,
          organizerId: fallbackId || null,
          organizerName: sourceRequest.submitter?.clubOrFacultyName || null,
        };
      }

      if (!organizer.organizerType || !organizer.organizerId) {
        console.log(
          `[SKIP] Event ${event.id} (${event.title}) - no valid organizer mapping from request ${sourceRequest.id}`
        );
        skipped += 1;
        continue;
      }

      if (
        event.organizerType === organizer.organizerType &&
        event.organizerId === organizer.organizerId
      ) {
        skipped += 1;
        continue;
      }

      await prisma.event.update({
        where: { id: event.id },
        data: {
          organizer: organizer.organizerName || sourceRequest.organizingBody || null,
          organizerType: organizer.organizerType,
          organizerId: organizer.organizerId,
        },
      });

      console.log(
        `[✓] Updated Event ${event.id} (${event.title}) - ${organizer.organizerType}/${organizer.organizerId}`
      );
      updated += 1;
    } catch (error) {
      console.error(
        `[ERROR] Event ${event.id} (${event.title}):`,
        error.message
      );
      skipped += 1;
    }
  }

  console.log("\n=== Backfill Summary ===");
  console.log(`Total processed: ${publishedEvents.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log("Backfill complete!");
}

backfillEventOrganizer()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
