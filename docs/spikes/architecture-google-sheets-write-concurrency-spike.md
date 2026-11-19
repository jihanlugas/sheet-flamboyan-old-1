---
title: "Google Sheets Write Concurrency and Idempotency"
category: "Architecture & Design"
status: "🔴 Not Started"
priority: "High"
timebox: "1 week"
created: 2026-11-19
updated: 2026-11-19
owner: "Unassigned"
tags: ["technical-spike", "architecture", "research"]
---

# Google Sheets Write Concurrency and Idempotency

## Summary

**Spike Objective:** Determine whether Google Sheets can safely remain the sole business-data store for concurrent financial writes and retries when the Next.js application is deployed to Vercel, and define the minimum cross-instance write-coordination strategy that prevents duplicate payments, expenses, reversals, or lost updates.

**Why This Matters:** The application records player balances and PB cash in Google Sheets, which does not provide database-style unique constraints or general transactions. Concurrent operators, retries, process restarts, or a request timeout after Google has accepted a write could otherwise cause duplicate or inconsistent financial entries. Vercel may handle requests using different runtime instances, so process-local serialization cannot be assumed to coordinate all writes. The result determines whether Vercel can support the required guarantees with the MVP constraints or whether another coordination mechanism or hosting/storage decision is required.

**Timebox:** 1 week.

**Decision Deadline:** Before implementing the session, payment, and PB-finance write paths.

## Research Question(s)

**Primary Question:** Can the Vercel-hosted Next.js application, with its runtime and concurrency behavior, provide an acceptable no-duplicate/no-lost-write guarantee for financial mutations in one Google Spreadsheet, including concurrent instances, retries, restarts, and ambiguous timeouts?

**Secondary Questions:**

- What atomicity and ordering guarantees apply to the Sheets API write operations used by this application, including batched writes?
- How should the application detect a previously committed operation when the caller timed out before receiving confirmation?
- What happens when two distinct operations update related financial data concurrently across Vercel runtime instances, or when an instance restarts during a write?
- Does Vercel provide a supported deployment configuration or primitive that can guarantee a single active writer, or is durable external coordination required?
- At what request rate or sheet size do API quotas and read-before-write idempotency checks become a practical limit?
- If process-local serialization is insufficient, what is the smallest viable alternative: Google Apps Script locking, a dedicated coordination service, or changing the persistence model?

## Investigation Plan

### Research Tasks

- [ ] Review official Sheets API documentation for `spreadsheets.batchUpdate`, values writes, append behavior, and usage limits; distinguish documented guarantees from assumptions.
- [ ] Review Vercel documentation for function execution, concurrency, instance reuse, and deployment limits; identify which properties are guarantees and which are not.
- [ ] Map each financial mutation (payment, payment reversal, expense, expense reversal, cash adjustment, participant change) to its required read/write operations and related rows.
- [ ] Compare process-local serialization with persisted operation IDs, Apps Script `LockService`, and external durable coordination or transactional storage for the Vercel deployment target.
- [ ] Build a small TypeScript proof of concept against a disposable, non-production spreadsheet using synthetic data only.
- [ ] Exercise simultaneous distinct writes routed through separate application instances where possible, repeated requests with the same operation ID, instance restart, and a simulated lost response after a write is accepted.
- [ ] Test whether retries can determine the prior operation outcome without creating a duplicate and whether related balances remain derivable from the journal.
- [ ] Measure end-to-end latency and API calls for the tested write path at expected community-PB volume; record quota assumptions.
- [ ] Document findings, guarantees, failure cases, recommended deployment topology, and any required architecture changes.

### Success Criteria

**This spike is complete when:**

- [ ] The actual Sheets API guarantees relied upon by the proposed write path are documented with official references.
- [ ] The proof of concept demonstrates behavior for concurrent writes, duplicate retries, a lost response after commit, and restart/recovery.
- [ ] No tested retry with the same operation ID creates a second financial entry or applies its balance impact twice.
- [ ] Distinct concurrent financial operations are either preserved correctly or a reproducible failure and its required mitigation are documented.
- [ ] The spike establishes whether Vercel can meet the write-coordination requirement without relying on process-local state or an unsupported single-instance assumption.
- [ ] Latency and API call count are recorded for the tested approach, with comparison to the MVP's p95 target.
- [ ] A clear recommendation states the guarantee, limitations, deployment constraints, and whether Google Sheets remains adequate for MVP.
- [ ] Follow-up architecture and implementation changes are identified.

## Technical Context

**Related Components:**

- Next.js App Router Route Handlers and domain services running on Vercel.
- Google Sheets repository and the `Payments`, `Expenses`, `CashAdjustments`, `Participants`, and `Sessions` tabs.
- Player-balance and PB-cash calculations.
- Vercel deployment and Google OAuth delegated access.

**Dependencies:**

- The write strategy must be decided before implementing financial mutations.
- OAuth and the configured Spreadsheet ID must be available for the isolated proof of concept.
- A disposable spreadsheet and non-production Google account with appropriate permissions are required for live API experiments.
- If an external coordination service is required, a separate architecture/deployment decision must be made before implementation.

**Constraints:**

- One Google Spreadsheet remains the MVP business-data source of truth.
- Vercel is the intended hosting platform; its runtime may execute requests in multiple instances and does not provide shared process memory.
- The current architecture excludes PostgreSQL, Redis, and background queues for MVP; if cross-instance coordination needs one of these or another service, the architecture decision must be surfaced explicitly.
- Writes must be reflected in Google Sheets before the application reports success.
- Financial entries are append-only; corrections use reversals or adjustment entries.
- Operation retries must be idempotent, and Google API errors or ambiguous outcomes must not become success-shaped fallbacks.
- Google Sheets provides no general-purpose transaction, unique constraint, or cross-instance lock; process-local locks do not coordinate Vercel instances. The spike must verify any narrower API guarantees it relies on.
- Experiments must use synthetic data in a disposable spreadsheet, never production player or financial data.

## Research Findings

### Investigation Results

**Not started.** Existing architecture documentation states that Google Sheets is not a transactional database and has no general unique constraint or cross-instance lock. The app is now targeted for Vercel, where a single active application process and process-local serialization cannot be assumed. The spike must establish a viable write strategy for this deployment target before financial writes are implemented. See [the epic architecture](../ways-of-work/plan/pencatatan-sesi-badminton/arch.md).

### Prototype/Testing Notes

Not started. The proof of concept must use a disposable spreadsheet and synthetic rows. It must not write to the spreadsheet configured for the application.

### External Resources

- [Google Sheets API: `spreadsheets.batchUpdate`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)
- [Google Sheets API: `spreadsheets.values.batchUpdate`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate)
- [Google Sheets API: `spreadsheets.values.append`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)
- [Google Sheets API usage limits](https://developers.google.com/workspace/sheets/api/limits)
- [Google Apps Script: Lock Service](https://developers.google.com/apps-script/reference/lock/lock-service)
- [Vercel Functions](https://vercel.com/docs/functions)

## Decision

### Recommendation

**Pending spike results.** Do not treat process-local serialization and a read-before-append idempotency check as a proven cross-request or restart-safe guarantee until the prototype and API guarantee review are complete.

### Rationale

Vercel is the intended hosting target, and the application cannot assume one active process or shared in-memory state. Even with cross-instance coordination, the spike must establish how to handle a committed write whose response is lost and whether retries can safely identify that commit. Financial write paths must not depend on an unverified deployment or API guarantee.

### Implementation Notes

- Keep all test data synthetic and use an isolated spreadsheet.
- Record the API method, request shape, operation-ID persistence point, and observable result for every experiment.
- Distinguish application-level serialization from guarantees made by Google APIs.
- Treat timeouts as ambiguous until the operation's persisted outcome can be checked.
- Include recovery behavior for a restarted process and an operation that may have committed before the failure.
- If the proposed approach depends on one active instance, establish whether Vercel can guarantee that topology; otherwise identify the required cross-instance coordination or hosting change.

### Follow-up Actions

- [ ] Select and document the write-coordination and idempotency strategy.
- [ ] Record explicit retry, timeout, restart, and concurrency handling in the Google Sheets repository design.
- [ ] Update the parent architecture with verified guarantees and deployment constraints.
- [ ] Create focused tests for duplicate retry, concurrent financial writes, and ambiguous write outcomes.
- [ ] Create implementation tasks for the selected write path and any required deployment guard.

## Status History

| Date | Status | Notes |
|---|---|---|
| 2026-11-19 | 🔴 Not Started | Spike created and scoped; research and proof of concept not yet run. |

---

_Last updated: 2026-11-19 by Unassigned_
