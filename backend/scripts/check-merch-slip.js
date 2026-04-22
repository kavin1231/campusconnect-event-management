import prisma from "../prisma/client.js";

async function main() {
  const rows = await prisma.$queryRaw`
    SELECT id, "buyerEmail", "paymentSlipUrl", "createdAt"
    FROM "MerchandiseOrder"
    ORDER BY id DESC
    LIMIT 5
  `;

  console.table(rows);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
