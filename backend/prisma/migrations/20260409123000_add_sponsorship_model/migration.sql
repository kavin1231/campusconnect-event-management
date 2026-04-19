-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "eventName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sponsorship_eventName_idx" ON "Sponsorship"("eventName");

-- CreateIndex
CREATE INDEX "Sponsorship_date_idx" ON "Sponsorship"("date");
