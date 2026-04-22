import prisma from "../prisma/client.js";

async function main() {
  const where = { buyerEmail: "student@nexora.edu" };
  const orders = await prisma.merchandiseOrder.findMany({
    where,
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length) {
    const slipResults = await Promise.all(
      orders.map((order) =>
        prisma.$queryRaw`
          SELECT "paymentSlipUrl"
          FROM "MerchandiseOrder"
          WHERE id = ${Number(order.id)}
          LIMIT 1
        `,
      ),
    );

    orders.forEach((order, index) => {
      const row = Array.isArray(slipResults[index]) ? slipResults[index][0] : null;
      order.paymentSlipUrl = row?.paymentSlipUrl || null;
    });
  }

  console.log(JSON.stringify(orders.map((o) => ({ id: o.id, paymentSlipUrl: o.paymentSlipUrl })), null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
