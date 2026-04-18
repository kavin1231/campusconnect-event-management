import prisma from "./prisma/client.js";
import jwt from "jsonwebtoken";

async function verifyAPI() {
  try {
    console.log("\n🔍 VERIFYING API DATA:\n");

    // 1. Check event requests in database
    const eventRequests = await prisma.eventRequest.findMany({
      where: { status: "PENDING" },
      include: {
        submitter: { select: { name: true, email: true } },
      },
    });

    console.log("✅ DATABASE RECORDS:");
    console.log(`   Found ${eventRequests.length} PENDING event requests`);
    eventRequests.forEach((req) => {
      console.log(`   - ${req.title}`);
    });

    // 2. Create a valid test token
    const token = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET || "test_secret_key",
    );

    console.log("\n✅ TEST TOKEN GENERATED");
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // 3. Verify component should fetch from:
    console.log("\n✅ FRONTEND WILL FETCH FROM:");
    console.log("   Endpoint: GET /api/event-requests?status=PENDING");
    console.log("   Headers: Authorization: Bearer <token>");
    console.log("   Expected response: { success: true, data: [...] }");

    console.log("\n✅ TO VIEW IN ADMIN DASHBOARD:");
    console.log("   1. Login as: admin@nexora.edu / admin123");
    console.log("   2. Go to: Dashboard → Governance → Event Approvals");
    console.log("   3. Click: 'Event Requests' TAB (top section)");
    console.log("   4. Click: 'Pending' TAB");
    console.log(`   5. Should see: ${eventRequests.length} pending requests\n`);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAPI();
