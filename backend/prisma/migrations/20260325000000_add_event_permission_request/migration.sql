-- CreateEnum
CREATE TYPE "EventPermissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "EventPermissionRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "expectedAttendees" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "organizingClub" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "status" "EventPermissionStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedById" INTEGER,

    CONSTRAINT "EventPermissionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventPermissionRequest_requesterId_idx" ON "EventPermissionRequest"("requesterId");

-- CreateIndex
CREATE INDEX "EventPermissionRequest_status_idx" ON "EventPermissionRequest"("status");

-- AddForeignKey
ALTER TABLE "EventPermissionRequest" ADD CONSTRAINT "EventPermissionRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPermissionRequest" ADD CONSTRAINT "EventPermissionRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
