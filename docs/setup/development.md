# Development Setup

## Verified baseline

- Node.js: 24.18.0 in the verified development environment; Next.js 16.4.6 requires Node.js 20.9 or newer.
- Package manager: Yarn 1.22.22.
- Framework: Next.js 16.4.6 App Router with React 19.3.0.
- Language and styling: strict TypeScript and Tailwind CSS 4.3.3.
- Baseline checks: `yarn lint` and `yarn build`.

Keep the existing framework and styling versions unless a documented compatibility blocker requires a change. Do not create another Next.js application or a monorepo.

## Code conventions

- Keep the root `app/` directory as the App Router. Use route groups to separate layouts without changing URL paths.
- Default to Server Components. Add `"use client"` only for browser interactions, and keep client components small.
- Use semantic HTML, associated form labels, visible keyboard focus, and accessible text for status and errors.
- Keep business rules out of presentation components. Put domain logic in `src/domain/` and server-only integrations in `src/server/`.
- Use `@/src/...` imports for files under `src/`; the existing TypeScript alias maps `@/*` to the repository root.
- Keep reusable visual primitives in `src/components/ui/`, application framing in `src/components/layout/`, and feature-specific UI in `src/components/<feature>/`.
- Keep synthetic fixtures in `src/mocks/`; label sample data in the UI and never treat it as persisted business data.

## Environment variables

The foundation currently requires no environment variables. `.env.example` is a safe, tracked placeholder. When a later feature introduces configuration:

- Add variable names and non-secret example values to `.env.example`; never put real credentials there.
- Store local values in an ignored `.env.local` file.
- Keep credentials and spreadsheet identifiers server-only. Add a `NEXT_PUBLIC_` prefix only to values explicitly safe for browser exposure.
- Add feature-specific OAuth and Google Sheets variables when that feature is implemented.

## Tests

- Unit tests live in `tests/unit/` and run with `yarn test:unit`.
- Browser tests live in `tests/e2e/` and run locally with `yarn test:e2e`. On first use, install the configured local browser with `yarn playwright install chromium`.
- Tests use local fixtures and must not require Vercel or write to a production service.
