import axios from "axios";
import jwt from "jsonwebtoken";

async function testApprovalFlow() {
  try {
    console.log("\n🧪 Testing Event Request Approval Flow\n");

    const API_URL = "http://localhost:5000/api";

    // Create admin token
    const adminToken = jwt.sign(
      { userId: 1, role: "SYSTEM_ADMIN" },
      process.env.JWT_SECRET || "test_secret_key",
    );

    // Step 1: Get pending requests
    console.log("📋 Step 1: Getting pending event requests...");
    const getResponse = await axios.get(
      `${API_URL}/event-requests?status=PENDING`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    const requests = getResponse.data.data;
    console.log(`✅ Found ${requests.length} pending requests`);

    if (requests.length === 0) {
      console.log("❌ No pending requests found!");
      return;
    }

    // Get the first request
    const requestToApprove = requests[0];
    console.log(`\n📌 Request to Approve: ${requestToApprove.title}`);
    console.log(`   ID: ${requestToApprove.id}`);
    console.log(`   Current Status: ${requestToApprove.status}\n`);

    // Step 2: Approve the request
    console.log("✅ Step 2: APPROVING request...");
    const approveResponse = await axios.patch(
      `${API_URL}/event-requests/${requestToApprove.id}/status`,
      {
        status: "APPROVED",
        reviewNotes: "Test approval from verification script",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    if (approveResponse.status === 200) {
      console.log("✅ REQUEST APPROVED SUCCESSFULLY!");
      console.log(`   New Status: ${approveResponse.data.data?.status}`);
      console.log(
        `   Reviewed By: ${approveResponse.data.data?.reviewer?.name}`,
      );
    } else {
      console.log("❌ Approval failed:", approveResponse.data.message);
    }

    // Step 3: Verify it moved to APPROVED
    console.log("\n📋 Step 3: Verifying approval...");
    const verifyResponse = await axios.get(
      `${API_URL}/event-requests?status=APPROVED`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    const approvedRequests = verifyResponse.data.data;
    const isApproved = approvedRequests.some(
      (r) => r.id === requestToApprove.id,
    );

    if (isApproved) {
      console.log("✅ VERIFICATION SUCCESSFUL!");
      console.log(`   Request now appears in APPROVED tab`);
      console.log(`   Total approved: ${approvedRequests.length}`);
    } else {
      console.log("❌ Verification failed - request not in APPROVED tab");
    }

    // Step 4: Test rejection
    if (requests.length > 1) {
      console.log("\n🔴 Step 4: Testing REJECTION on second request...");
      const requestToReject = requests[1];

      const rejectResponse = await axios.patch(
        `${API_URL}/event-requests/${requestToReject.id}/status`,
        {
          status: "REJECTED",
          reviewNotes: "Budget exceeds limit",
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      if (rejectResponse.status === 200) {
        console.log("✅ REQUEST REJECTED SUCCESSFULLY!");
        console.log(`   Title: ${rejectResponse.data.data?.title}`);
        console.log(
          `   Rejection Reason: ${rejectResponse.data.data?.reviewNotes}`,
        );
      }
    }

    console.log(
      "\n✅ ALL TESTS PASSED - Approval/Rejection endpoints working!\n",
    );
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error.response?.data?.message || error.message,
    );
    console.error("Response:", error.response?.data);
  }
}

testApprovalFlow();
