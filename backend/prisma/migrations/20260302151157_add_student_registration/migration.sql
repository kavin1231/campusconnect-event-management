-- CreateTable
CREATE TABLE "StudentRegistration" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentRegistration_studentId_eventId_key" ON "StudentRegistration"("studentId", "eventId");

-- AddForeignKey
ALTER TABLE "StudentRegistration" ADD CONSTRAINT "StudentRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRegistration" ADD CONSTRAINT "StudentRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
