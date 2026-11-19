---
title: "Google OAuth and Spreadsheet Permission Enforcement"
category: "Security & Compliance"
status: "🔴 Not Started"
priority: "High"
timebox: "1 week"
created: 2026-11-19
updated: 2026-11-19
owner: "Unassigned"
tags: ["technical-spike", "security", "research"]
---

# Google OAuth and Spreadsheet Permission Enforcement

## Summary

**Spike Objective:** Verify whether delegated Google OAuth and the Google Sheets/Drive APIs can reliably restrict the application to users with access to one configured spreadsheet, distinguish viewer from editor access, and enforce read/write behavior with the minimum practical OAuth scopes.

**Why This Matters:** The application uses Google Sheets permissions as its access-control source. If identity, effective file permission, OAuth scope, or permission revocation is interpreted incorrectly, a viewer could be given write controls or an unauthorized account could see player and financial data. The result determines the production login flow, permission check, scope/consent strategy, and handling of revoked access.

**Timebox:** 1 week.

**Decision Deadline:** Before implementing Google login and protected data routes.

## Research Question(s)

**Primary Question:** Can the application use each user's Google identity and delegated API token to reliably determine access to the configured spreadsheet and enforce viewer/read-only versus editor/read-write access, including after permissions change?

**Secondary Questions:**

- Which minimum OAuth scopes allow a user to read the existing shared spreadsheet and, for an editor, write to it?
- Can Google Drive API file capabilities (for example, `canEdit`) reliably identify effective edit access for direct, group, domain, and link-based sharing?
- Is incremental consent for write access practical, or should the application request read/write scopes at initial login while relying on file permissions to prevent writes?
- How should the application distinguish no file access, read-only permission, missing OAuth scope, revoked consent, expired token, and temporary Google API failure?
- What Google OAuth consent-screen verification or organization-policy constraints apply to production users?

## Investigation Plan

### Research Tasks

- [ ] Review official Google OAuth documentation for user identity, authorization-code flow, consent, refresh tokens, incremental authorization, and token revocation.
- [ ] Review Google Sheets API scopes and Google Drive API `files.get`/capabilities documentation; map each required operation to a scope.
- [ ] Compare the narrowest viable scope approach for a pre-existing shared spreadsheet with the broader Sheets read/write scope approach.
- [ ] Build a small TypeScript proof of concept using a disposable spreadsheet and test accounts representing owner/editor, viewer, and no-access user.
- [ ] Verify whether the viewer can read the configured spreadsheet and whether every write attempt is denied by Google and by the application's server-side authorization guard.
- [ ] Verify whether the editor can read and write only after granting the needed scope and having effective edit permission on the configured spreadsheet.
- [ ] Test edit-capability detection for direct sharing and, where available, group/domain or link-based sharing; record unsupported or ambiguous cases.
- [ ] Remove a test user's spreadsheet permission while the user has an active application session; test the next read and write request.
- [ ] Revoke OAuth consent or expire a test token; test refresh, re-consent, and safe session termination behavior.
- [ ] Document scope choice, permission-check strategy, consent UX, production setup requirements, and unresolved limitations.

### Success Criteria

**This spike is complete when:**

- [ ] A test user with no access to the configured spreadsheet is denied before any sheet data is returned.
- [ ] A viewer can read the sheet but cannot write through either the UI or a direct server request.
- [ ] An editor can write only when both the spreadsheet permission and required OAuth scope are present.
- [ ] The chosen method for detecting read-only versus editor status is demonstrated and its behavior for tested sharing modes is recorded.
- [ ] Revoked spreadsheet access and revoked OAuth consent are detected on a subsequent operation and do not produce success-shaped fallbacks.
- [ ] Minimum scopes, token lifecycle, and any consent-screen verification or deployment constraints are documented with official references.
- [ ] A clear recommendation is made for login, access verification, and read/write enforcement, with alternatives and residual risks.

## Technical Context

**Related Components:**

- Google OAuth callback and server-side session management.
- Access guard for Next.js App Router pages and Route Handlers.
- Google Sheets repository using delegated user tokens.
- Configured Spreadsheet ID and spreadsheet tabs containing player and financial data.
- Viewer/read-only and editor/read-write behavior.

**Dependencies:**

- The Google OAuth client and test users must be configured for a non-production environment.
- A disposable spreadsheet with separate editor, viewer, and no-access test accounts is required.
- Production OAuth consent-screen configuration and any Workspace administrator policies must be reviewed before rollout.
- The result informs implementation of the [authentication feature PRD](../ways-of-work/plan/pencatatan-sesi-badminton/google-sheets-access/prd.md) and [epic architecture](../ways-of-work/plan/pencatatan-sesi-badminton/arch.md).

**Constraints:**

- The configured Google Spreadsheet remains the source of truth for access and business data.
- The application must not use a shared service account to bypass a user's file permission.
- Tokens and OAuth client secrets must remain server-side and must not be written to logs, URLs, or the spreadsheet.
- Only one spreadsheet is supported in the MVP; users cannot provide an arbitrary Spreadsheet ID through a request.
- Read-only users may view data, while only editors may mutate it.
- Test accounts and synthetic data must be used; do not use production financial or player data.

## Research Findings

### Investigation Results

**Not started.** The current PRD requires Google login, per-user access to one configured spreadsheet, read-only access for viewers, write access for editors, and server-side authorization. It does not yet verify the exact scope combination, edit-capability check, sharing-mode behavior, or consent-screen requirements.

### Prototype/Testing Notes

Not started. Use a disposable spreadsheet shared separately with test editor and viewer accounts. Test no-access and permission-revocation cases. No production spreadsheet, real player data, or financial transactions may be used.

### External Resources

- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google OAuth 2.0 scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Google Sheets API authorization scopes](https://developers.google.com/workspace/sheets/api/scopes)
- [Google Drive API `files.get`](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get)
- [Google Drive API file resource capabilities](https://developers.google.com/workspace/drive/api/reference/rest/v3/files#File)
- [Google OAuth app verification](https://support.google.com/cloud/answer/13463073)

## Decision

### Recommendation

**Pending spike results.** Do not finalize production OAuth scopes or viewer/editor detection until the test accounts and API calls confirm the intended behavior for the configured spreadsheet.

### Rationale

Google identity proves who signed in but does not, by itself, prove access to a particular spreadsheet or distinguish its effective read/write permission. OAuth scopes also govern what the application may request while spreadsheet sharing governs what the user may do. Both layers must be tested and enforced server-side.

### Implementation Notes

- Keep the configured Spreadsheet ID server-side and reject arbitrary IDs supplied by clients.
- Treat Google API operations as the final enforcement boundary; UI read-only state is not sufficient.
- Never infer editor status solely from an email address, OAuth scope, or client-provided role.
- Test whether Drive capabilities or an equivalent server-side mechanism can safely drive read-only UI before choosing the check.
- Handle a Google `403` according to the failed operation and do not reinterpret a temporary API failure as permission.
- Keep OAuth state, refresh tokens, and session data server-side and redact them from logs.

### Follow-up Actions

- [ ] Select the OAuth scopes and consent flow for read-only users and editors.
- [ ] Document how the server determines and revalidates effective spreadsheet access.
- [ ] Update the authentication feature PRD and parent architecture with verified behavior.
- [ ] Add tests for viewer writes, no-access users, permission revocation, expired tokens, and consent revocation.
- [ ] Record OAuth consent-screen and Google Workspace setup steps for deployment.

## Status History

| Date | Status | Notes |
|---|---|---|
| 2026-11-19 | 🔴 Not Started | Spike created and scoped; research and proof of concept not yet run. |

---

_Last updated: 2026-11-19 by Unassigned_
