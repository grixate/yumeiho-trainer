-- AlterTable
ALTER TABLE "PracticeSequence" ADD COLUMN "blocks" JSONB;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "sequenceRole" TEXT,
ADD COLUMN "relatedExercises" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "preview" JSONB;
