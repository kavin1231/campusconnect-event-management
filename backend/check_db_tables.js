import prisma from "./prisma/client.js";

async function main() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log("Existing tables:");
    console.log(JSON.stringify(tables, null, 2));

    for (const table of tables) {
      if (['EventStall', 'event_stall', 'StallSlot', 'stall_slot', 'VendorPartner', 'vendor_partner'].some(n => table.table_name.toLowerCase().includes(n.toLowerCase()))) {
        console.log(`\nColumns for ${table.table_name}:`);
        const columns = await prisma.$queryRawUnsafe(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${table.table_name}';
        `);
        console.log(JSON.stringify(columns, null, 2));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
