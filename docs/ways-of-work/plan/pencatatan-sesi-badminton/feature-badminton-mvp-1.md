---
goal: "Deliver the Badminton Session Tracking MVP on Vercel"
version: "1.0"
date_created: "2026-11-19"
last_updated: "2026-11-19"
owner: "Badminton MVP delivery"
status: "Planned"
tags: [feature, architecture, infrastructure]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan delivers the badminton-session and PB-finance MVP in the existing Next.js App Router repository. The application uses one Google Spreadsheet as its business-data source, Google OAuth for user identity and spreadsheet permissions, and Vercel as its deployment target. Financial write implementation is gated on successful completion of the Google Sheets concurrency and OAuth technical spikes.

## 1. Requirements & Constraints

- **REQ-001**: Require Google sign-in and server-side verification of access to the configured spreadsheet before returning application data.
- **REQ-002**: Allow spreadsheet viewers to read application data and spreadsheet editors to mutate data; verify write permission on the server for every mutation.
- **REQ-003**: Keep all business records in one spreadsheet with `Config`, `Players`, `Sessions`, `Participants`, `Payments`, `Expenses`, and `CashAdjustments` tabs.
- **REQ-004**: Persist every accepted mutation to Google Sheets before returning success; surface errors and retain unsaved form input on failure.
- **REQ-005**: Use stable generated IDs, never row numbers, for players, sessions, participants, transactions, and idempotent operations.
- **REQ-006**: Calculate participant charge as court fee once per participant plus ball price multiplied by that participant's ball count; games played are statistical only.
- **REQ-007**: Calculate player balance as net payments minus session charges; a negative balance is owed, a positive balance is player credit, and zero is settled.
- **REQ-008**: Record payments as positive Rupiah integers at any time for registered players; support optional session attribution and append-only full reversals.
- **REQ-009**: Calculate PB cash as opening balance plus net payments minus net expenses plus net cash adjustments; permit and label negative cash.
- **REQ-010**: Provide Dashboard, Players, Sessions, and Transactions views; include PB-finance controls in Transactions or a clearly linked finance view.
- **REQ-011**: Generate a session report from the latest persisted data; keep session charges separate from session-linked net payments.
- **REQ-012**: Show a report preview before sharing; WhatsApp text must exclude cumulative player balances, unlinked payments, OAuth data, Spreadsheet ID, and PB cash; the user must press Send in WhatsApp.
- **SEC-001**: Keep OAuth client secrets, session secrets, access tokens, and refresh tokens server-side; never expose or log them.
- **SEC-002**: Use the user's delegated Google authorization; do not use a shared service account to bypass spreadsheet permissions.
- **SEC-003**: Apply authentication and authorization checks in the server-side data access layer and each Route Handler; UI visibility is not an authorization control.
- **CON-001**: The repository currently contains a Next.js starter app, not the badminton feature modules or a test suite.
- **CON-002**: Vercel may execute requests in different runtime instances; process-local locks, queues, and session state are not cross-instance coordination.
- **CON-003**: Do not implement financial writes for production until the write-coordination spike proves an acceptable retry, concurrency, timeout, and restart strategy for Vercel.
- **CON-004**: The installed project uses Next.js 16.4.6 with `cacheComponents: true`; follow the version-matched guides under `node_modules/next/dist/docs/` and keep request-time session access within the documented Cache Components patterns.
- **CON-005**: Keep monetary values as integer IDR; do not add payment processing, multi-PB tenancy, offline writes, or a second business-data store.
- **CON-006**: Run Google OAuth, Drive, and Sheets Route Handlers in the Node.js runtime; do not use the Edge runtime for Node-specific Google client code.
- **GUD-001**: Implement a server-only Data Access Layer that authorizes requests and returns minimal DTOs; do not pass OAuth tokens or broad spreadsheet rows to client components.
- **GUD-002**: Use append-only payment, reversal, expense, and cash-adjustment records; corrections must retain the original record and reference it.
- **GUD-003**: Use shared domain functions for all UI and API calculations; do not duplicate financial formulas in components.
- **PAT-001**: Use the repository's Next.js App Router and Route Handler conventions; keep domain logic independent of UI and Google API clients.
- **PAT-002**: Use the existing Yarn 1 package manager and TypeScript strict mode; do not introduce a monorepo or an ORM.

## 2. Implementation Steps

### Implementation Phase 1 — Resolve technical gates and establish tests

- **GOAL-001**: Resolve the outstanding platform, OAuth, concurrency, and WhatsApp decisions and create repeatable unit and browser-test commands.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Complete `docs/spikes/architecture-google-sheets-write-concurrency-spike.md`. Run the disposable-sheet proof of concept against a Vercel Preview deployment; document API guarantees, duplicate retry, concurrent requests, lost response, restart behavior, the selected cross-instance coordinator, and a pass/fail decision. Do not proceed to financial write tasks unless all spike success criteria pass; otherwise mark this plan On Hold and revise `arch.md`. |  |  |
| TASK-002 | Complete `docs/spikes/security-google-oauth-spreadsheet-permissions-spike.md` with disposable owner/editor, viewer, and no-access accounts. Record tested scopes, effective edit detection, token/session handling, revocation behavior, consent requirements, and Vercel redirect URI requirements before implementing authentication. |  |  |
| TASK-003 | Complete `docs/spikes/ux-whatsapp-session-report-sharing-spike.md` using synthetic reports. Record tested desktop/mobile behavior, selected share mechanism, encoding and length limits, preview/cancel behavior, and copy fallback before implementing sharing. |  |  |
| TASK-004 | Add Vitest and `@playwright/test` as development dependencies in `package.json` and `yarn.lock`; add `vitest.config.mts`, `playwright.config.ts`, and `test:unit`/`test:e2e` scripts. Create `tests/unit/smoke.test.ts` and `tests/e2e/smoke.spec.ts`, configure the Playwright `webServer`, and verify both scripts run. Keep Vitest tests focused on synchronous domain functions and use Playwright for asynchronous Server Components and browser flows. This task may run in parallel with TASK-001 through TASK-003. |  |  |

**Completion criteria:**

- TASK-001, TASK-002, and TASK-003 have completed findings, tested recommendations, and no unresolved blocker for the selected MVP scope.
- `yarn test:unit` and `yarn test:e2e` execute successfully.
- If any technical gate fails, implementation stops before production financial writes and the architecture is updated before this plan resumes.

### Implementation Phase 2 — Build secure runtime, Google access, and persistence foundation

- **GOAL-002**: Provide server-only configuration, delegated OAuth, spreadsheet permission enforcement, schema validation, and Vercel-compatible write coordination.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Add `googleapis` as a runtime dependency in `package.json` and `yarn.lock`. Create `src/server/env.ts` to validate required server-only variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_SPREADSHEET_ID`, and `SESSION_SECRET` (at least 32 bytes of cryptographically random key material). Add coordinator-specific variables only if TASK-001 selected a provider that requires them. Add `.env.example` with variable names only and no secret values; reject missing/invalid configuration at server startup without logging secrets. |  |  |
| TASK-006 | Implement `src/server/auth/google-oauth.ts` and `src/server/auth/session.ts`, plus `app/api/auth/google/route.ts`, `app/api/auth/google/callback/route.ts`, and `app/api/auth/logout/route.ts`. Use the Google OAuth client from `googleapis`; implement the authorization-code flow, state validation, the token/session strategy selected by TASK-002, secure cookie attributes, refresh/re-consent handling, and logout. Declare Node.js runtime for routes using Node-specific Google client code. Add `server-only` boundaries and tests proving tokens are absent from client responses and logs. |  |  |
| TASK-007 | Implement `src/server/auth/authorization.ts` with `getCurrentUser`, `requireSpreadsheetReadAccess`, and `requireSpreadsheetEditAccess`. Determine effective access using the method verified by TASK-002; deny unknown, revoked, or insufficient access and distinguish permission errors from temporary Google API failures. Protect all application data reads and writes through these functions. Depends on TASK-006. |  |  |
| TASK-008 | Implement `src/server/sheets/client.ts` and `src/server/sheets/schema.ts`. Use the `googleapis` Sheets/Drive clients in Node.js runtime; the Sheets client must use the current user's delegated token, access only `GOOGLE_SPREADSHEET_ID`, validate required tab names and headers, map API errors explicitly, and never cache financial data as authoritative. Schema metadata must define the columns and stable IDs for all seven required tabs. Depends on TASK-005 and TASK-006. |  |  |
| TASK-009 | Implement `src/server/sheets/write-coordinator.ts` and `src/server/sheets/operation-ids.ts` using only the mechanism proven by TASK-001. Provide `runIdempotentWrite` with a stable operation ID, persisted outcome lookup, and explicit handling for ambiguous timeouts; do not use module-level mutexes or in-memory queues as the cross-instance guarantee. Add retry, duplicate, concurrency, and restart tests. Depends on TASK-001 and TASK-008. |  |  |
| TASK-010 | Add `src/server/errors.ts` and `src/server/http.ts` with a typed error-to-HTTP mapping for unauthenticated, forbidden, validation, not-found, conflict, Google API, and temporary service failures. Ensure Route Handlers return no secret or raw spreadsheet data in error payloads. Add tests for each mapping. Depends on TASK-007 and TASK-008. |  |  |

**Completion criteria:**

- Every data operation is server-only and restricted to the configured spreadsheet and the signed-in user's delegated Google access.
- Viewer writes and no-access reads are rejected server-side.
- Required spreadsheet tabs and headers are validated before feature services use them.
- A same-ID retry cannot create or apply a second write under the coordinator selected in TASK-001.

### Implementation Phase 3 — Implement domain calculations, players, and sessions

- **GOAL-003**: Deliver reusable financial rules and the complete player/session workflow with stable references and verified persistence.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Create `src/domain/types.ts` and `src/domain/validation.ts` for Player, Session, Participant, Payment, Expense, CashAdjustment, and Config DTOs. Validate names, stable IDs, integer IDR amounts, nonnegative ball/game counts, optional session references, active-player rules, and duplicate participants without trusting client-calculated values. |  |  |
| TASK-012 | Create `src/domain/charges.ts`, `src/domain/player-balance.ts`, and `src/domain/pb-cash.ts` exporting `calculateParticipantCharge`, `calculatePlayerBalance`, and `calculatePbCash`. Use integer Rupiah arithmetic; calculate court fee once per participant; ignore games in cost; calculate balances using net reversed transactions; and distinguish an unset opening balance from zero. Add focused Vitest cases for zero prices, zero balls, owed/settled/credit balances, reversals, negative PB cash, and unconfigured opening balance. Depends on TASK-011. |  |  |
| TASK-013 | Implement `src/server/sheets/repositories/players.ts`, `src/server/services/players.ts`, `app/api/players/route.ts`, and `app/api/players/[playerId]/route.ts`. Support list/search/filter, create, update, and active-state changes; preserve player IDs and history; warn on duplicate active names; reject permanent deletion. Enforce TASK-007 and return minimal DTOs. Depends on TASK-007, TASK-008, and TASK-011. |  |  |
| TASK-014 | Implement `app/(auth)/login/page.tsx`, `app/(protected)/layout.tsx`, `src/components/app-shell.tsx`, `src/components/main-navigation.tsx`, `app/layout.tsx`, `app/globals.css`, and `app/page.tsx`. Replace starter content, set Indonesian document language and application metadata, expose Dashboard/Players/Sessions/Transactions navigation, show viewer read-only state, and follow the installed Cache Components authentication guide for request-time session reads and Suspense boundaries. Depends on TASK-006 and TASK-007. |  |  |
| TASK-015 | Implement `src/server/sheets/repositories/sessions.ts`, `src/server/sheets/repositories/participants.ts`, `src/server/services/sessions.ts`, `app/api/sessions/route.ts`, `app/api/sessions/[sessionId]/route.ts`, and `app/api/sessions/[sessionId]/participants/route.ts`. Require a persisted session before participant writes; accept zero prices and zero counts; require active registered players; reject duplicate session/player pairs; recalculate charge from TASK-012; preserve payments when participants are removed; and coordinate all mutations through TASK-009. Depends on TASK-009, TASK-012, and TASK-013. |  |  |
| TASK-016 | Implement `app/(protected)/players/page.tsx`, `app/(protected)/players/[playerId]/page.tsx`, `app/(protected)/sessions/page.tsx`, `app/(protected)/sessions/new/page.tsx`, `app/(protected)/sessions/[sessionId]/page.tsx`, `src/components/players/player-form.tsx`, `src/components/players/player-list.tsx`, `src/components/sessions/session-form.tsx`, and `src/components/sessions/participant-editor.tsx`. Provide responsive CRUD and session entry screens; show validation, saved, loading, read-only, empty, and error states; retain unsaved inputs after failures. Depends on TASK-013, TASK-014, and TASK-015. |  |  |

**Completion criteria:**

- Players can be registered, searched, updated, deactivated/reactivated, and viewed without breaking historical IDs.
- A session must persist before participants can be added; only active registered players can join it.
- Charges match the specified formula for all tested values, and game counts never affect cost.
- Viewer requests cannot mutate players, sessions, or participants.

### Implementation Phase 4 — Implement payments, reversals, and PB finance

- **GOAL-004**: Record the complete append-only financial ledger and expose correct player and PB balances.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-017 | Implement `src/server/sheets/repositories/payments.ts` and `src/server/services/payments.ts` with `recordPayment`, `reversePayment`, and `listPayments`. Add `app/api/payments/route.ts` and `app/api/payments/[paymentId]/reverse/route.ts`. Require a registered player, positive integer IDR, and a persisted optional session reference; permit inactive players; preserve attribution without allocating payments to individual charges; prohibit edit/delete and duplicate full reversals; use TASK-009 for idempotent writes. Depends on TASK-009, TASK-012, and TASK-015. |  |  |
| TASK-018 | Implement `src/server/sheets/repositories/expenses.ts`, `src/server/sheets/repositories/cash-adjustments.ts`, `src/server/sheets/repositories/config.ts`, and `src/server/services/pb-finance.ts`. Add `app/api/pb-finance/opening-balance/route.ts`, `app/api/expenses/route.ts`, `app/api/expenses/[expenseId]/reverse/route.ts`, and `app/api/cash-adjustments/route.ts`. Set opening balance once (zero is valid), append reasoned signed adjustments, allow zero or over-balance expenses, reverse expenses once, and calculate cash using TASK-012. Coordinate every write through TASK-009. Depends on TASK-009, TASK-012, and TASK-017. |  |  |
| TASK-019 | Implement `app/(protected)/transactions/page.tsx`, `app/(protected)/pb-finance/page.tsx`, `src/components/transactions/payment-form.tsx`, `src/components/transactions/payment-history.tsx`, `src/components/finance/expense-form.tsx`, and `src/components/finance/cash-summary.tsx`. Show payments, reversals, expenses, adjustments, opening-balance setup state, cash components, and negative-cash deficit; keep viewer controls read-only and preserve form values after write failures. Depends on TASK-017 and TASK-018. |  |  |

**Completion criteria:**

- Payments and expenses are append-only and their full reversals remain visible and auditable.
- Payment attribution affects session reporting only; all net payments affect player balance and PB cash.
- Opening balance cannot be overwritten after setup; adjustments require a reason.
- Cash and player balances match the shared domain calculations after every successful write and reload.

### Implementation Phase 5 — Implement dashboard and session reports

- **GOAL-005**: Deliver current, accurate summaries and a user-controlled, privacy-safe WhatsApp report flow.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-020 | Implement `src/server/services/dashboard.ts` and `app/api/dashboard/route.ts`. Aggregate active player count; separate owed and credit totals across active and inactive players; configured/unconfigured PB cash; and up to five sessions sorted by session date/time descending with session ID as tie-breaker, participant count, charge total, and net session-linked payments. Return the last successful data-load time. Reject incomplete financial source data rather than presenting partial totals as final. Depends on TASK-012, TASK-013, TASK-015, TASK-017, and TASK-018. |  |  |
| TASK-021 | Implement `src/domain/session-report.ts` and `src/server/services/session-reports.ts` with `buildSessionReport` and `buildWhatsAppReportText`. The in-app report must include each participant's cumulative balance separately from session-linked payments, and retain linked payments for a player no longer on the participant list with a clear label. Build WhatsApp text from an allowlist of selected-session fields; include session charges and linked net payments; exclude cumulative player balances, unlinked payments, PB cash, OAuth data, and Spreadsheet ID. Record the data retrieval time and calculate all values through TASK-012. Depends on TASK-012, TASK-015, and TASK-017. |  |  |
| TASK-022 | Implement `app/api/sessions/[sessionId]/report/route.ts`, `app/(protected)/dashboard/page.tsx`, `app/(protected)/sessions/[sessionId]/report/page.tsx`, `src/components/dashboard/summary-cards.tsx`, `src/components/dashboard/recent-sessions.tsx`, `src/components/reports/report-preview.tsx`, and `src/components/reports/share-controls.tsx`. Render current dashboard sections with explicit partial-error states; preview the exact WhatsApp payload; apply the sharing order selected by TASK-003; require explicit user action; keep a copy-text fallback and never trigger sending automatically. Depends on TASK-003, TASK-020, and TASK-021. |  |  |

**Completion criteria:**

- Dashboard balances, debt and credit totals, and recent-session summaries match persisted data and established formulas.
- Incomplete source reads produce visible errors and never yield a success-shaped final financial total.
- The WhatsApp preview is identical to the shared text and excludes every field prohibited by REQ-012.
- Canceling the preview opens no share target; delivery always requires the user to press Send in WhatsApp.

### Implementation Phase 6 — Verify MVP end to end and deploy through Vercel

- **GOAL-006**: Prove the acceptance criteria across roles and failure cases, then deploy with production-safe configuration.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-023 | Add Playwright tests under `tests/e2e/` for Google login success/cancel, editor versus viewer access, no-access denial, player creation, session creation before participant entry, charge calculation, payment and reversal, opening balance, expense and reversal, dashboard summaries, report preview privacy, cancel, and copy fallback. Use disposable Google test accounts and synthetic spreadsheet data; do not send real WhatsApp messages. Depends on TASK-014 through TASK-022. |  |  |
| TASK-024 | Add `docs/setup/google-sheets.md` documenting the seven tab names, exact headers, ID and money formats, setup checks, permissions, and disposable test-sheet procedure. Add `docs/setup/vercel.md` documenting production and preview environments, required server-only variables, Google OAuth callback URLs, consent-screen prerequisites, and rollout gate for the selected write coordinator. Depends on TASK-001, TASK-002, TASK-005, and TASK-008. |  |  |
| TASK-025 | Update `README.md` with the app purpose, Yarn commands, environment setup links, test commands, and Vercel deployment link; remove create-next-app starter wording. Depends on TASK-014 and TASK-024. |  |  |
| TASK-026 | Run `yarn lint`, `yarn test:unit`, `yarn test:e2e`, and `yarn build`; deploy a Vercel Preview with test-only OAuth credentials and a disposable spreadsheet; verify OAuth callback, viewer/editor enforcement, Sheets reads/writes, coordinator retry behavior, and no secret in client assets/logs. Promote to Production only after all checks pass and production Vercel variables and Google OAuth redirect URIs are configured. Depends on TASK-001, TASK-002, TASK-003, TASK-023, TASK-024, and TASK-025. |  |  |

**Completion criteria:**

- All domain, repository, authorization, UI, and end-to-end tests pass.
- `yarn lint` and `yarn build` pass on the same Next.js version used by the repository.
- Vercel Preview proves environment separation and all critical user flows using test-only credentials and data.
- Production promotion is blocked until the OAuth, spreadsheet, and cross-instance write gates pass.

## 3. Alternatives

- **ALT-001**: Use a shared Google service account for all spreadsheet access. Rejected because it bypasses the requirement that each user's Google Sheets permission governs access.
- **ALT-002**: Let browser code call Google Sheets directly. Rejected because it exposes OAuth tokens and cannot enforce viewer/editor permissions at a trusted server boundary.
- **ALT-003**: Use process-local queues or mutexes for financial writes. Rejected because Vercel can route requests to different instances and instances can restart.
- **ALT-004**: Move business records to a database. Rejected for the MVP because one Google Spreadsheet is the required business-data source; reconsider only if the concurrency spike proves no acceptable Vercel-compatible coordination strategy.
- **ALT-005**: Send session reports through WhatsApp Business API. Rejected because the product requires preview and manual user send, not automated delivery.

## 4. Dependencies

- **DEP-001**: Existing repository baseline: Next.js 16.4.6, React 19.3.0, TypeScript strict mode, Tailwind CSS 4.3.3, and Yarn 1.22.22.
- **DEP-002**: Google Cloud project with OAuth consent configured, Google Sheets API enabled, required Drive API capability enabled if selected by the OAuth spike, and separate test editor/viewer/no-access accounts.
- **DEP-003**: Disposable Google Spreadsheet with synthetic records and the seven required tabs; never use production financial data for tests.
- **DEP-004**: Completed security spike with an approved OAuth scope, session/token strategy, permission check, and tested revocation handling.
- **DEP-005**: Completed concurrency spike with a proven Vercel-compatible, cross-instance idempotency and write-coordination decision.
- **DEP-006**: Completed WhatsApp spike with a tested sharing mechanism, encoding rules, length guidance, and fallback order.
- **DEP-007**: Vercel project with separate Preview and Production environment variables and a production domain registered as an OAuth redirect URI.
- **DEP-008**: Vitest and Playwright installed and configured using the guides shipped with the installed Next.js version.

## 5. Files

- **FILE-001**: `package.json` and `yarn.lock` for runtime dependencies, test dependencies, and test scripts.
- **FILE-002**: `vitest.config.mts`, `playwright.config.ts`, and `tests/unit/` plus `tests/e2e/` for automated verification.
- **FILE-003**: `src/server/env.ts` and `.env.example` for server-only runtime configuration.
- **FILE-004**: `src/server/auth/google-oauth.ts`, `src/server/auth/session.ts`, `src/server/auth/authorization.ts`, and `app/api/auth/google/route.ts`, `app/api/auth/google/callback/route.ts`, `app/api/auth/logout/route.ts` for delegated authentication and authorization.
- **FILE-005**: `src/server/sheets/client.ts`, `src/server/sheets/schema.ts`, `src/server/sheets/operation-ids.ts`, `src/server/sheets/write-coordinator.ts`, and `src/server/sheets/repositories/` for validated Google Sheets access and the proven write strategy.
- **FILE-006**: `src/domain/types.ts`, `src/domain/validation.ts`, `src/domain/charges.ts`, `src/domain/player-balance.ts`, `src/domain/pb-cash.ts`, and `src/domain/session-report.ts` for typed business rules.
- **FILE-007**: `src/server/services/players.ts`, `src/server/services/sessions.ts`, `src/server/services/payments.ts`, `src/server/services/pb-finance.ts`, `src/server/services/dashboard.ts`, and `src/server/services/session-reports.ts` for domain application services.
- **FILE-008**: `app/api/players/`, `app/api/sessions/`, `app/api/payments/`, `app/api/expenses/`, `app/api/cash-adjustments/`, `app/api/pb-finance/`, and `app/api/dashboard/` for authenticated Route Handlers.
- **FILE-009**: `app/(auth)/login/page.tsx`, `app/(protected)/layout.tsx`, `app/(protected)/dashboard/`, `app/(protected)/players/`, `app/(protected)/sessions/`, `app/(protected)/transactions/`, and `app/(protected)/pb-finance/` for user-facing pages.
- **FILE-010**: `src/components/app-shell.tsx`, `src/components/main-navigation.tsx`, and feature components under `src/components/{dashboard,players,sessions,transactions,finance,reports}/` for shared responsive UI.
- **FILE-011**: `app/layout.tsx`, `app/globals.css`, and `app/page.tsx` to replace starter metadata and content with the Indonesian badminton application shell.
- **FILE-012**: `docs/spikes/architecture-google-sheets-write-concurrency-spike.md`, `docs/spikes/security-google-oauth-spreadsheet-permissions-spike.md`, and `docs/spikes/ux-whatsapp-session-report-sharing-spike.md` for completed evidence and decisions.
- **FILE-013**: `docs/setup/google-sheets.md`, `docs/setup/vercel.md`, and `README.md` for operational setup, deployment, and contributor instructions.
- **FILE-014**: `docs/ways-of-work/plan/pencatatan-sesi-badminton/epic.md`, `arch.md`, and feature PRDs for updates required by verified spike outcomes.

## 6. Testing

- **TEST-001**: Unit-test `calculateParticipantCharge`, `calculatePlayerBalance`, `calculatePbCash`, and `buildWhatsAppReportText` in `tests/unit/domain/`; cover zero values, integer validation, reversals, positive/negative balances, and prohibited report fields.
- **TEST-002**: Test every Google Sheets repository and `runIdempotentWrite` in `tests/unit/server/` with mocked API responses; cover duplicate retries, concurrent distinct writes, lost responses, restart recovery, missing tabs/headers, permission errors, quotas, and temporary failures.
- **TEST-003**: Test `getCurrentUser`, `requireSpreadsheetReadAccess`, and `requireSpreadsheetEditAccess` in `tests/unit/server/auth/`; prove no-access denial, viewer read-only behavior, editor writes, revoked access, invalid OAuth state, expired tokens, and secret redaction.
- **TEST-004**: Use Playwright to verify player and session workflows, including that sessions persist before participant entry, inactive players are excluded from new sessions, duplicate participants are rejected, and charges match the pricing rule.
- **TEST-005**: Use Playwright to verify payment/expense recording and reversals, one-time opening balance setup, required adjustment reasons, negative PB cash, and balance refresh after persisted changes.
- **TEST-006**: Use Playwright to verify the report preview exactly matches the generated text, contains only allowed session data, omits cumulative balances and PB cash, requires manual WhatsApp send, and provides copy fallback.
- **TEST-007**: On a Vercel Preview deployment, verify separate test environment variables, OAuth redirect behavior, authenticated data access, no production spreadsheet writes, no token in client bundles, and coordinator behavior under concurrent requests.
- **TEST-008**: Run the final gates `yarn lint`, `yarn test:unit`, `yarn test:e2e`, and `yarn build`; record command results before Production promotion.

## 7. Risks & Assumptions

- **RISK-001**: Google Sheets does not provide general transactions, unique constraints, or cross-instance locks; if the concurrency spike cannot prove an acceptable coordinator, hold financial write implementation and update the architecture rather than silently accepting duplicate risk.
- **RISK-002**: OAuth scope approval, effective Drive permission detection, or refresh-token handling may require Google consent-screen verification or additional persistent infrastructure; do not expose production access until TASK-002 documents and validates the approach.
- **RISK-003**: Vercel preview hostnames and production OAuth redirect URIs may differ; use separate environment values and explicitly register the production callback before Production deployment.
- **RISK-004**: Manual spreadsheet edits can violate expected headers or relationships; validate schema on access and fail clearly rather than treating malformed records as valid financial totals.
- **RISK-005**: Next.js 16 Cache Components can make request-time session access incompatible with static-shell rendering when placed incorrectly; follow the installed authentication-with-Cache-Components guide and cover protected pages with browser tests.
- **ASSUMPTION-001**: MVP serves one PB, one configured spreadsheet, and integer Indonesian Rupiah amounts.
- **ASSUMPTION-002**: Google test accounts, a disposable spreadsheet, and Vercel Preview access can be provisioned before feature implementation reaches its deployment phase.
- **ASSUMPTION-003**: The user must confirm and send WhatsApp messages manually; the application only prepares and hands off text.

## 8. Related Specifications / Further Reading

- [Epic PRD](./epic.md)
- [Epic architecture](./arch.md)
- [Google Sheets access PRD](./google-sheets-access/prd.md)
- [Player management and balances PRD](./player-management-and-balances/prd.md)
- [Session management PRD](./session-management/prd.md)
- [Player payments PRD](./player-payments/prd.md)
- [PB finance PRD](./pb-finance/prd.md)
- [Dashboard PRD](./dashboard/prd.md)
- [Session reports PRD](./session-reports/prd.md)
- [Google Sheets concurrency spike](../../../../docs/spikes/architecture-google-sheets-write-concurrency-spike.md)
- [Google OAuth permission spike](../../../../docs/spikes/security-google-oauth-spreadsheet-permissions-spike.md)
- [WhatsApp sharing spike](../../../../docs/spikes/ux-whatsapp-session-report-sharing-spike.md)
- [Installed Next.js Route Handlers guide](../../../../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md)
- [Installed Next.js authentication with Cache Components guide](../../../../node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md)
- [Installed Next.js data security guide](../../../../node_modules/next/dist/docs/01-app/02-guides/data-security.md)
- [Installed Next.js environment variables guide](../../../../node_modules/next/dist/docs/01-app/02-guides/environment-variables.md)
- [Installed Next.js Vitest guide](../../../../node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md)
- [Installed Next.js Playwright guide](../../../../node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md)
- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Sheets API](https://developers.google.com/workspace/sheets/api)
- [Vercel Functions](https://vercel.com/docs/functions)
