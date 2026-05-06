import { prisma } from "@/lib/prisma";

export async function getGlobalSearchResults(query: string) {
  const q = query.trim();
  if (!q) return { exercises: [], theoryCards: [], sequences: [] };

  const [exercises, theoryCards, sequences] = await Promise.all([
    prisma.exercise.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { expectedEffect: { contains: q, mode: "insensitive" } },
          { bodyZones: { has: q } },
          { goals: { has: q } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.theoryCard.findMany({
      where: {
        OR: [
          { topic: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
          { question: { contains: q, mode: "insensitive" } },
          { answer: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.practiceSequence.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { useCase: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
  ]);

  return { exercises, theoryCards, sequences };
}
