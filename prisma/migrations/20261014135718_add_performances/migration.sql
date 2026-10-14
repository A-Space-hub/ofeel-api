-- CreateTable
CREATE TABLE "Performance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" "WeightUnit" NOT NULL,
    "reps" INTEGER NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Performance_userId_performedAt_idx" ON "Performance"("userId", "performedAt");

-- CreateIndex
CREATE INDEX "Performance_exerciseId_idx" ON "Performance"("exerciseId");

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
