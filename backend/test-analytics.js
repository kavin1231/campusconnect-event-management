async function testAnalytics() {
  try {
    // First login to get a valid token
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@nexora.edu",
        password: "admin123",
      }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
      console.log("Login failed:", loginData);
      return;
    }

    console.log("✓ Login successful");

    // Now test the analytics endpoint
    const analyticsRes = await fetch(
      "http://localhost:5000/api/analytics/user-activity",
      {
        headers: { Authorization: `Bearer ${loginData.token}` },
      },
    );

    const analyticsData = await analyticsRes.json();
    console.log("✓ Analytics endpoint status:", analyticsRes.status);
    console.log("Analytics response:", JSON.stringify(analyticsData, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAnalytics();
