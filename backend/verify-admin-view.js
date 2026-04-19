import prisma from "./prisma/client.js";

async function main() {
  try {
    // Get the admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@nexora.edu" },
    });

    // Get all pending event requests (what admin sees)
    const pendingRequests = await prisma.eventRequest.findMany({
      where: { status: "PENDING" },
      include: {
        submitter: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    console.log("\n📊 ADMIN APPROVAL DASHBOARD - EVENT REQUESTS");
    console.log("==========================================\n");
    console.log(`Admin: ${admin?.name} (${admin?.email})\n`);

    console.log(`📋 PENDING REQUESTS (${pendingRequests.length} total):`);
    console.log("-------------------------------------------\n");

    if (pendingRequests.length === 0) {
      console.log("❌ No pending requests");
    } else {
      pendingRequests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.title}`);
        console.log(`   📧 Submitted by: ${req.submitter.name}`);
        console.log(
          `   📅 Event: ${new Date(req.eventDate).toLocaleDateString()}`,
        );
        console.log(`   👥 Expected: ${req.expectedAttendance} people`);
        console.log(`   💰 Budget: ₹${req.estimatedBudget?.toLocaleString()}`);
        console.log(
          `   ⏰ Submitted: ${new Date(req.submittedAt).toLocaleString()}`,
        );
        console.log(`   🏷️  Status: ${req.status}`);
        console.log(`   ID: ${req.id} (use for approve/reject operations)\n`);
      });
    }

    // Show what the admin can do
    console.log("\n✅ ADMIN ACTIONS AVAILABLE:");
    console.log("===============================");
    console.log("1. View details of any request");
    console.log("2. APPROVE - moves request to APPROVED tab");
    console.log("3. REJECT - moves request to REJECTED tab with reason");
    console.log("4. REQUEST REVISION - asks organizer to modify request\n");
  } finally {
    await prisma.$disconnect();
  }
}

main();
