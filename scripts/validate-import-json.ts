import { readFile } from "node:fs/promises";
import { ZodError } from "zod";
import { parseImportJson } from "../lib/import-content";

const filePath = process.argv.at(-1) ?? "data/reviewed/book-content.reviewed.json";

try {
  const raw = await readFile(filePath, "utf8");
  const data = parseImportJson(raw);

  console.log(`Valid import JSON: ${filePath}`);
  console.log(
    JSON.stringify(
      {
        exercises: data.exercises.length,
        theoryCards: data.theoryCards.length,
        practiceSequences: data.practiceSequences.length,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(`Invalid import JSON: ${filePath}`);
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
  process.exit(1);
}
