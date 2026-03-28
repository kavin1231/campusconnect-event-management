import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting manual migration...');

        // 1. Add profileImage to User if not exists
        await client.query(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileImage" TEXT;
        `);
        console.log('✓ Added profileImage to User');

        // 2. Add profileImage to Student if not exists
        await client.query(`
            ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "profileImage" TEXT;
        `);
        console.log('✓ Added profileImage to Student');

        // 3. Add CLUB_PRESIDENT to Role enum if not exists
        // Check if it already exists first
        const roleCheck = await client.query(`
            SELECT enumlabel FROM pg_enum 
            JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
            WHERE pg_type.typname = 'Role' AND enumlabel = 'CLUB_PRESIDENT'
        `);
        if (roleCheck.rows.length === 0) {
            await client.query(`ALTER TYPE "Role" ADD VALUE 'CLUB_PRESIDENT';`);
            console.log('✓ Added CLUB_PRESIDENT to Role enum');
        } else {
            console.log('✓ CLUB_PRESIDENT already exists in Role enum');
        }

        // 4. Create AssetStatus enum if not exists
        const assetStatusCheck = await client.query(`
            SELECT typname FROM pg_type WHERE typname = 'AssetStatus'
        `);
        if (assetStatusCheck.rows.length === 0) {
            await client.query(`CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');`);
            console.log('✓ Created AssetStatus enum');
        } else {
            console.log('✓ AssetStatus enum already exists');
        }

        // 5. Create BookingStatus enum if not exists
        const bookingStatusCheck = await client.query(`
            SELECT typname FROM pg_type WHERE typname = 'BookingStatus'
        `);
        if (bookingStatusCheck.rows.length === 0) {
            await client.query(`CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHECKED_OUT', 'RETURNED', 'DAMAGED');`);
            console.log('✓ Created BookingStatus enum');
        } else {
            console.log('✓ BookingStatus enum already exists');
        }

        // 6. Create Asset table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Asset" (
                "id" SERIAL NOT NULL,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "ownerId" INTEGER NOT NULL,
                "status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✓ Created Asset table');

        // 5. Create AssetBooking table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS "AssetBooking" (
                "id" SERIAL NOT NULL,
                "assetId" INTEGER NOT NULL,
                "requesterId" INTEGER NOT NULL,
                "startDate" TIMESTAMP(3) NOT NULL,
                "endDate" TIMESTAMP(3) NOT NULL,
                "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
                "damageReport" TEXT,
                "penalty" DOUBLE PRECISION,
                "approvedById" INTEGER,
                CONSTRAINT "AssetBooking_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✓ Created AssetBooking table');

        // 6. Create ApplicationStatus enum if not exists
        const appStatusCheck = await client.query(`
            SELECT typname FROM pg_type WHERE typname = 'ApplicationStatus'
        `);
        if (appStatusCheck.rows.length === 0) {
            await client.query(`
                CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
            `);
            console.log('✓ Created ApplicationStatus enum');
        } else {
            console.log('✓ ApplicationStatus enum already exists');
        }

        // 7. Create PresidentApplication table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS "PresidentApplication" (
                "id" SERIAL NOT NULL,
                "studentId" INTEGER NOT NULL,
                "clubName" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
                "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "approvedById" INTEGER,
                CONSTRAINT "PresidentApplication_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✓ Created PresidentApplication table');

        // 8. Create StudentEventRegistration if not exists (schema maps to StudentRegistration, but also check)
        // The existing table is StudentRegistration - schema maps to it, so this should be fine

        // 9. Add foreign keys
        try {
            await client.query(`
                ALTER TABLE "Asset" DROP CONSTRAINT IF EXISTS "Asset_ownerId_fkey";
                ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" 
                    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
            console.log('✓ Asset FK added');
        } catch (e) { console.log('Asset FK already exists or error:', e.message); }

        try {
            await client.query(`
                ALTER TABLE "AssetBooking" DROP CONSTRAINT IF EXISTS "AssetBooking_assetId_fkey";
                ALTER TABLE "AssetBooking" ADD CONSTRAINT "AssetBooking_assetId_fkey" 
                    FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
                ALTER TABLE "AssetBooking" DROP CONSTRAINT IF EXISTS "AssetBooking_requesterId_fkey";
                ALTER TABLE "AssetBooking" ADD CONSTRAINT "AssetBooking_requesterId_fkey" 
                    FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
            console.log('✓ AssetBooking FKs added');
        } catch (e) { console.log('AssetBooking FK error:', e.message); }

        try {
            await client.query(`
                ALTER TABLE "PresidentApplication" DROP CONSTRAINT IF EXISTS "PresidentApplication_studentId_fkey";
                ALTER TABLE "PresidentApplication" ADD CONSTRAINT "PresidentApplication_studentId_fkey" 
                    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
            console.log('✓ PresidentApplication FK added');
        } catch (e) { console.log('PresidentApplication FK error:', e.message); }

        // Verify final table list
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        `);
        console.log('\nFinal tables in DB:');
        tables.rows.forEach(r => console.log(' -', r.table_name));

        console.log('\n✅ Migration complete!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
