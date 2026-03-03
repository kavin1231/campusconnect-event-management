/*
  Warnings:

  - The values [CLUB_MEMBER,CLUB_PRESIDENT,FACULTY_ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHECKED_OUT', 'RETURNED', 'DAMAGED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'EVENT_ORGANIZER', 'SYSTEM_ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_presidentId_fkey";

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_ownerClubId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentRequest" DROP CONSTRAINT "EquipmentRequest_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentRequest" DROP CONSTRAINT "EquipmentRequest_requestingClubId_fkey";

-- DropForeignKey
ALTER TABLE "StudentRegistration" DROP CONSTRAINT "StudentRegistration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "StudentRegistration" DROP CONSTRAINT "StudentRegistration_studentId_fkey";

-- DropTable
DROP TABLE "Club";

-- DropTable
DROP TABLE "Equipment";

-- DropTable
DROP TABLE "EquipmentRequest";

-- DropTable
DROP TABLE "StudentRegistration";

-- DropEnum
DROP TYPE "RequestStatus";

-- CreateTable
CREATE TABLE "StudentEventRegistration" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentEventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" INTEGER NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetBooking" (
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

-- CreateIndex
CREATE UNIQUE INDEX "StudentEventRegistration_studentId_eventId_key" ON "StudentEventRegistration"("studentId", "eventId");

-- CreateIndex
CREATE INDEX "AssetBooking_assetId_idx" ON "AssetBooking"("assetId");

-- CreateIndex
CREATE INDEX "AssetBooking_requesterId_idx" ON "AssetBooking"("requesterId");

-- AddForeignKey
ALTER TABLE "StudentEventRegistration" ADD CONSTRAINT "StudentEventRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventRegistration" ADD CONSTRAINT "StudentEventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBooking" ADD CONSTRAINT "AssetBooking_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBooking" ADD CONSTRAINT "AssetBooking_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBooking" ADD CONSTRAINT "AssetBooking_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
