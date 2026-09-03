# Agent Instructions — Bridle & Birch

## Shared Instructions

- Follow the workspace-level `AGENTS.md` supplied by the local environment for
  shared profile, output, and workflow rules.
- `CLAUDE.md` imports this file for Claude compatibility; keep one rulebook.
- Treat old session reports under `docs/` as historical context, not proof of
  current deployment or readiness.

## Project

- Early-stage personalized-gift storefront.
- Do not describe the store as launched or production-ready without current
  deployment and acceptance evidence.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Prisma 7.
- Routes and Server Actions live under `src/app/`; shared UI is under
  `src/components/`; the data model is in `prisma/schema.prisma`.

## Next.js

- This Next.js version differs from older training examples.
- Before changing framework APIs, read the relevant versioned guide under
  `node_modules/next/dist/docs/` and heed deprecation notices.
## Commerce and Customer Safety

- Treat accounts, orders, custom requests, newsletter signups, and uploaded
  artwork as sensitive customer data.
- Never use real customer data in local development or previews.
- Do not treat the current auth, file upload, or checkout flow as launch-ready.
- Before public launch, require an environment-provided session secret,
  server-authoritative product pricing, validated order inputs, secure upload
  storage, and a focused security review.
- Payments, order fulfillment, email sending, analytics, and public launch are
  separate product decisions; do not add or activate them without Chaz's scope.

## Database

- Inspect `DATABASE_URL`, `src/lib/prisma.ts`, and `prisma/schema.prisma` before
  database work; do not assume local and hosted adapters behave identically.
- Schema changes, migrations, seeds, destructive queries, and hosted database
  writes require explicit approval and a stated rollback.
- Never commit environment files, credentials, or customer data.

## Commands

- Use npm and preserve `package-lock.json`.
- Development: `npm run dev`
- Focused lint: `npx eslint <file>`
- Type check: `npx tsc --noEmit`
- Full verification: `npm run lint`, then `npm run build`

## Git and Deployment

- Preserve the dirty main checkout; use a focused branch or isolated worktree.
- Use a pull request for `main` and verify the matching deployment before
  reporting anything as live.
- AI-authored commits include the agent's own `Co-Authored-By` line.
