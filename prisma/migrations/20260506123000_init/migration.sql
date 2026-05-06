-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('exercise', 'theory');

-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('again', 'hard', 'good', 'easy');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalNumber" TEXT,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'basic',
    "bodyZones" TEXT[],
    "goals" TEXT[],
    "clientPosition" TEXT,
    "practitionerPosition" TEXT,
    "steps" JSONB NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "commonMistakes" JSONB NOT NULL,
    "contraindications" JSONB NOT NULL,
    "expectedEffect" TEXT,
    "clientFeeling" TEXT,
    "theoryLinks" JSONB,
    "sourceReference" TEXT,
    "personalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheoryCard" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "practicalMeaning" TEXT,
    "tags" TEXT[],
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "sourceReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheoryCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSequence" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "useCase" TEXT NOT NULL,
    "exerciseIds" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewResult" (
    "id" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "cardId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "rating" "ReviewRating" NOT NULL,
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeLog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientContext" TEXT,
    "sessionNotes" TEXT NOT NULL,
    "exerciseIds" TEXT[],
    "whatWorked" TEXT,
    "whatWasDifficult" TEXT,
    "followUpIdeas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_slug_key" ON "Exercise"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeSequence_slug_key" ON "PracticeSequence"("slug");
