async function testAssetRequest() {
  try {
    // First login to get a valid token
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

    console.log("✓ Login successful");

    // Test asset request with valid data
    const requestRes = await fetch(
      "http://localhost:5000/api/logistics/assets/24/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 2,
          neededDate: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0],
          returnDate: new Date(Date.now() + 172800000)
            .toISOString()
            .split("T")[0],
          purpose: "Event setup and decoration for campus festival",
          contact: "9876543210",
        }),
      },
    );

    const requestData = await requestRes.json();
    console.log("✓ Asset request status:", requestRes.status);
    console.log(
      "Asset request response:",
      JSON.stringify(requestData, null, 2),
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAssetRequest();
