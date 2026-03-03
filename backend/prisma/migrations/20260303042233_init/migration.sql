-- PostgreSQL
-- =========================
-- Create Enum: RequestStatus
-- =========================
CREATE TYPE "RequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CHECKED_OUT',
    'RETURNED',
    'DAMAGED'
);

-- =========================
-- Alter Enum: Role
-- =========================
-- WARNING: Make sure no user has the role 'EVENT_ORGANIZER' before running this
-- Otherwise, the ALTER TABLE will fail.
UPDATE "User" SET "role" = 'STUDENT' WHERE "role" = 'EVENT_ORGANIZER';

BEGIN;
CREATE TYPE "Role_new" AS ENUM (
    'STUDENT',
    'CLUB_MEMBER',
    'CLUB_PRESIDENT',
    'FACULTY_ADMIN',
    'SYSTEM_ADMIN'
);

ALTER TABLE "User"
    ALTER COLUMN "role" TYPE "Role_new"
    USING ("role"::text::"Role_new");

ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- =========================
-- Create Table: Club
-- =========================
CREATE TABLE "Club" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presidentId" INTEGER
);

-- =========================
-- Create Table: Equipment
-- =========================
CREATE TABLE "Equipment" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantityTotal" INTEGER NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerClubId" INTEGER NOT NULL
);

-- =========================
-- Create Table: EquipmentRequest
-- =========================
CREATE TABLE "EquipmentRequest" (
    "id" SERIAL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkoutDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "damageReport" TEXT,
    "penaltyAmount" DOUBLE PRECISION,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "equipmentId" INTEGER NOT NULL,
    "requestingClubId" INTEGER NOT NULL
);

-- =========================
-- Foreign Keys
-- =========================
ALTER TABLE "Club"
    ADD CONSTRAINT "Club_presidentId_fkey"
    FOREIGN KEY ("presidentId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Equipment"
    ADD CONSTRAINT "Equipment_ownerClubId_fkey"
    FOREIGN KEY ("ownerClubId") REFERENCES "Club"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EquipmentRequest"
    ADD CONSTRAINT "EquipmentRequest_equipmentId_fkey"
    FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EquipmentRequest"
    ADD CONSTRAINT "EquipmentRequest_requestingClubId_fkey"
    FOREIGN KEY ("requestingClubId") REFERENCES "Club"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;