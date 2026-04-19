import prisma from "../prisma/client.js";

async function main() {
  const before = await prisma.$queryRaw`
    SELECT id, "buyerEmail", "paymentSlipUrl", "createdAt"
    FROM "MerchandiseOrder"
    ORDER BY id ASC
  `;

  console.log("Before cleanup:");
  console.table(
    before.map((row) => ({
      id: row.id,
      buyerEmail: row.buyerEmail,
      hasSlip: Boolean(row.paymentSlipUrl && row.paymentSlipUrl.trim()),
      paymentSlipUrl: row.paymentSlipUrl,
      createdAt: row.createdAt,
    })),
  );

  const deleteResult = await prisma.$executeRaw`
    DELETE FROM "MerchandiseOrder"
    WHERE COALESCE("paymentSlipUrl", '') = ''
  `;

  const after = await prisma.$queryRaw`
    SELECT id, "buyerEmail", "paymentSlipUrl", "createdAt"
    FROM "MerchandiseOrder"
    ORDER BY id ASC
  `;

  console.log("\nDeleted rows:", deleteResult);
  console.log("After cleanup:");
  console.table(
    after.map((row) => ({
      id: row.id,
      buyerEmail: row.buyerEmail,
      paymentSlipUrl: row.paymentSlipUrl,
      createdAt: row.createdAt,
    })),
  );
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
