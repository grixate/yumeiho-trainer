-- AlterTable
ALTER TABLE "Exercise"
ADD COLUMN "intensity" TEXT,
ADD COLUMN "requiresPreparation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "relatedTheory" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
