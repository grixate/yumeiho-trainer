import { readFile } from "node:fs/promises";
import { ZodError } from "zod";
import { importReviewedContent, parseImportJson } from "../lib/import-content";
import { prisma } from "../lib/prisma";

const filePath = process.argv.at(-1) ?? "data/reviewed/book-content.reviewed.json";

try {
  const raw = await readFile(filePath, "utf8");
  const data = parseImportJson(raw);
  const summary = await prisma.$transaction((tx) => importReviewedContent(tx, data));

  console.log(`Imported reviewed content: ${filePath}`);
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  console.error(`Failed to import reviewed content: ${filePath}`);
  if (error instanceof SyntaxError) {
    console.error(error.message);
  } else if (error instanceof ZodError) {
    for (const issue of error.issues) {
      console.error(`- ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
