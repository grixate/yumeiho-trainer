# Yumeiho Knowledge Trainer

A private, self-hosted Yumeiho practice library and study trainer built with Next.js App Router, TypeScript, Bun, PostgreSQL, Prisma, Tailwind CSS, shadcn-style UI components, and lucide-react.

## Local Development

```bash
bun install
bun run db:deploy
bun run db:seed
bun run dev
```

The app uses:

```bash
DATABASE_URL="postgresql://yumeiho:yumeiho@localhost:5432/yumeiho?schema=public"
```

If the `yumeiho` role or database does not exist locally, create them first:

```bash
psql -d postgres -c "CREATE ROLE yumeiho LOGIN PASSWORD 'yumeiho';"
createdb -O yumeiho yumeiho
```

## Useful Commands

```bash
bun run lint
bun run build
bun run db:migrate
bun run db:deploy
bun run db:seed
bun run db:studio
```

## Reviewed Book JSON Import

Book-derived content is imported from reviewed JSON, not directly from a PDF. Use `data/examples/book-content.example.json` as the canonical shape:

```json
{
  "exercises": [],
  "theoryCards": [],
  "practiceSequences": []
}
```

Validate a reviewed file without writing to the database:

```bash
bun run book:validate data/reviewed/book-content.reviewed.json
```

Import a reviewed file into PostgreSQL:

```bash
bun run book:import data/reviewed/book-content.reviewed.json
```

The default reviewed path is `data/reviewed/book-content.reviewed.json`; both scripts accept a custom file path. Exercise imports upsert by `slug`, sequence imports upsert by `slug`, and theory cards create new records unless an `id` is supplied. Keep warnings and caution text in `contraindications` so they remain visible on exercise pages.

## Docker Compose

```bash
docker compose up --build
```

The compose setup starts PostgreSQL and the app on `http://localhost:3000`. Seed data is not run automatically in the production container; run `bun run db:seed` against the target database when you want demo content.
