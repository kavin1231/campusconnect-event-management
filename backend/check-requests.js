import prisma from "./prisma/client.js";

async function main() {
  try {
    const requests = await prisma.eventRequest.findMany({
      where: { status: "PENDING" },
      include: {
        submitter: { select: { name: true, email: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    console.log("\n✅ PENDING EVENT REQUESTS IN DATABASE:");
    console.log("=====================================\n");

    if (requests.length === 0) {
      console.log("❌ No pending requests found");
    } else {
      requests.forEach((req, index) => {
        console.log(`Request #${index + 1}:`);
        console.log(`  Title: ${req.title}`);
        console.log(
          `  Submitted By: ${req.submitter?.name} (${req.submitter?.email})`,
        );
        console.log(`  Event Date: ${req.eventDate}`);
        console.log(`  Status: ${req.status}`);
        console.log(`  Expected Attendance: ${req.expectedAttendance}`);
        console.log(`  Budget: ₹${req.estimatedBudget}`);
        console.log(`  Submitted At: ${req.submittedAt}`);
        console.log("");
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
