// Monitor network requests to see what's being sent
async function monitorAssetRequests() {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const [resource, config] = args;

    // Log all POST requests to the request endpoint
    if (
      resource.includes("/logistics/assets") &&
      resource.includes("/request") &&
      config?.method === "POST"
    ) {
      console.log("🔍 Asset Request POST Attempt:");
      console.log("URL:", resource);
      console.log("Body:", config.body);
      try {
        const bodyObj = JSON.parse(config.body);
        console.log("Parsed Body:", bodyObj);
        console.log("Validation:");
        console.log(
          "  - quantity:",
          bodyObj.quantity,
          bodyObj.quantity > 0 ? "✓" : "✗",
        );
        console.log("  - neededDate:", bodyObj.neededDate ? "✓" : "✗");
        console.log("  - returnDate:", bodyObj.returnDate ? "✓" : "✗");
        console.log(
          "  - purpose:",
          bodyObj.purpose ? `✓ (${bodyObj.purpose.length} chars)` : "✗",
        );
      } catch (e) {}
    }

    return originalFetch.apply(this, args);
  };

  console.log(
    "✅ Network monitoring enabled. Check console when making requests.",
  );
}

// Enable monitoring
monitorAssetRequests();
