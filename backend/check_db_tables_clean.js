import prisma from "./prisma/client.js";

async function main() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log("TABLES FOUND:", tables.map(t => t.table_name).join(", "));

    const targetTables = ['EventStall', 'event_stall', 'StallSlot', 'stall_slot', 'VendorPartner', 'vendor_partner', 'Organization', 'organization', 'SponsorshipLead', 'sponsorship_lead', 'OrganizationBudget', 'organization_budget', 'SponsorContribution', 'sponsor_contribution'];
    
    for (const t of tables) {
      const tableName = t.table_name;
      if (targetTables.some(name => tableName.toLowerCase() === name.toLowerCase())) {
        console.log(`\n--- TABLE: ${tableName} ---`);
        const columns = await prisma.$queryRawUnsafe(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = '${tableName}';
        `);
        for (const col of columns) {
          console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
