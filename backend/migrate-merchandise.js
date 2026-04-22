import prisma from "./prisma/client.js";

async function createTables() {
  try {
    console.log("Creating merchandise tables...");
    
    // Create MerchandiseProduct table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MerchandiseProduct" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "imageUrl" TEXT,
        "status" VARCHAR(50),
        "inventory" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ MerchandiseProduct table created");

    // Create MerchandiseOrder table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MerchandiseOrder" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "buyerName" VARCHAR(255) NOT NULL,
        "buyerEmail" VARCHAR(255),
        "buyerPhone" VARCHAR(20),
        "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "status" VARCHAR(50),
        "notes" TEXT,
        "paymentSlipUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ MerchandiseOrder table created");

    // Create MerchandiseOrderItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MerchandiseOrderItem" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "orderId" INTEGER NOT NULL REFERENCES "MerchandiseOrder"("id") ON DELETE CASCADE,
        "productId" INTEGER NOT NULL REFERENCES "MerchandiseProduct"("id") ON DELETE CASCADE,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "size" VARCHAR(50),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ MerchandiseOrderItem table created");

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MerchandiseProduct_status_idx" ON "MerchandiseProduct"("status")
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MerchandiseOrder_status_idx" ON "MerchandiseOrder"("status")
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MerchandiseOrderItem_orderId_idx" ON "MerchandiseOrderItem"("orderId")
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MerchandiseOrderItem_productId_idx" ON "MerchandiseOrderItem"("productId")
    `);

    // Add paymentSlipUrl column to MerchandiseOrder if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "MerchandiseOrder" ADD COLUMN IF NOT EXISTS "paymentSlipUrl" TEXT
      `);
      console.log("✓ Added paymentSlipUrl column to MerchandiseOrder");
    } catch (error) {
      if (!error.message.includes("already exists")) {
        console.log("✓ Column paymentSlipUrl already exists or skipped");
      }
    }

    console.log("✓ Indexes created");
    console.log("✅ All tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    if (error.code === "42P07") {
      console.log("Tables already exist, skipping creation.");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
