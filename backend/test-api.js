import axios from "axios";

async function testEventRequestAPI() {
  try {
    console.log("\n🧪 Testing Event Request API...\n");

    // Generate a simple JWT token (for testing)
    const token = require("jsonwebtoken").sign(
      { userId: 1 },
      "your_secret_key",
      { expiresIn: "1h" },
    );

    const API_URL = "http://localhost:5000/api";

    // Test 1: Get all pending event requests
    console.log("📋 Test 1: Fetching PENDING event requests...");
    const response = await axios.get(
      `${API_URL}/event-requests?status=PENDING`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`✅ Status: ${response.status}`);
    console.log(
      `📊 Found ${response.data.data?.length || 0} pending requests\n`,
    );

    if (response.data.data && response.data.data.length > 0) {
      response.data.data.forEach((req, index) => {
        console.log(`Request ${index + 1}:`);
        console.log(`  - Title: ${req.title}`);
        console.log(`  - Status: ${req.status}`);
        console.log(`  - Budget: ₹${req.estimatedBudget}`);
        console.log(`  - Submitted By: ${req.submitter?.name || "Unknown"}\n`);
      });
    }

    // Test 2: Get all event requests with no filter
    console.log("📋 Test 2: Fetching ALL event requests (no status filter)...");
    const allResponse = await axios.get(`${API_URL}/event-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Status: ${allResponse.status}`);
    console.log(
      `📊 Found ${allResponse.data.data?.length || 0} total requests\n`,
    );

    console.log("✅ API is working correctly!");
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testEventRequestAPI();
