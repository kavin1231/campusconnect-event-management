-- CreateEnum for ReactionType
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'WOW', 'FUNNY', 'SAD');

-- CreateTable for EventReview
CREATE TABLE "EventReview" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "reaction" "ReactionType",
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventReview_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for one reaction per student per event
CREATE UNIQUE INDEX "EventReview_studentId_eventId_key" ON "EventReview"("studentId", "eventId");

-- Create index for efficient event review queries
CREATE INDEX "EventReview_eventId_idx" ON "EventReview"("eventId");

-- Add foreign key constraint to Event
ALTER TABLE "EventReview" ADD CONSTRAINT "EventReview_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraint to Student
ALTER TABLE "EventReview" ADD CONSTRAINT "EventReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
