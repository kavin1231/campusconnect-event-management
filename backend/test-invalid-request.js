async function testInvalidAssetRequest() {
  try {
    // First login
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "organizer@nexora.edu",
        password: "admin123",
      }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
      console.log("Login failed:", loginData);
      return;
    }

    console.log("✓ Admin login successful");

    // Test 1: Empty request body
    console.log("\n=== Test 1: Empty request body ===");
    let requestRes = await fetch(
      "http://localhost:5000/api/logistics/assets/24/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    let data = await requestRes.json();
    console.log("Status:", requestRes.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // Test 2: Missing required fields
    console.log("\n=== Test 2: Only quantity ===");
    requestRes = await fetch(
      "http://localhost:5000/api/logistics/assets/24/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
        }),
      },
    );

    data = await requestRes.json();
    console.log("Status:", requestRes.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // Test 3: Bad dates
    console.log("\n=== Test 3: Bad date format ===");
    requestRes = await fetch(
      "http://localhost:5000/api/logistics/assets/24/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
          neededDate: "invalid",
          returnDate: "invalid",
          purpose: "Test event setup for campus",
        }),
      },
    );

    data = await requestRes.json();
    console.log("Status:", requestRes.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testInvalidAssetRequest();
