import prisma from "./prisma/client.js";

async function main() {
  try {
    console.log("Adding columns to Event table...");
    await prisma.$executeRaw`ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`;
    await prisma.$executeRaw`ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`;
    console.log("Columns added successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
