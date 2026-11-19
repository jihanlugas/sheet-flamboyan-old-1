---
title: "WhatsApp Session Report Sharing Across Devices"
category: "User Experience"
status: "🔴 Not Started"
priority: "High"
timebox: "1 week"
created: 2026-11-19
updated: 2026-11-19
owner: "Unassigned"
tags: ["technical-spike", "user-experience", "research"]
---

# WhatsApp Session Report Sharing Across Devices

## Summary

**Spike Objective:** Determine the most reliable way to let an authorized user preview and share a session report to WhatsApp on desktop and mobile, with correct text encoding, a safe fallback, and no automatic message sending.

**Why This Matters:** The session report is intended to be shared with a group, but browser support and WhatsApp availability differ across devices. A broken or truncated share flow would make the feature unreliable, while an incorrect payload could expose cumulative player balances or PB cash that the product explicitly excludes from WhatsApp messages.

**Timebox:** 1 week.

**Decision Deadline:** Before implementing the session-report sharing flow.

## Research Question(s)

**Primary Question:** Should the application use a WhatsApp Click-to-Chat URL, the Web Share API, or a combination with clipboard fallback to share a reviewed report reliably across supported browsers?

**Secondary Questions:**

- How should the report text be encoded so Indonesian text, line breaks, currency formatting, ampersands, and other special characters survive each handoff?
- What happens when WhatsApp is not installed, the user is not signed in, a browser blocks a popup, or the report is too long for a URL/deep link?
- Does the Web Share API expose WhatsApp as a share target consistently, and is that behavior predictable enough for a WhatsApp-specific action?
- Which fallback works when Web Share or clipboard access is unavailable or denied?
- How can the implementation guarantee the user previews and confirms the message, while requiring the user to press Send in WhatsApp?

## Investigation Plan

### Research Tasks

- [ ] Review the session-report PRD's required fields and explicit exclusions for WhatsApp messages.
- [ ] Compare WhatsApp Click-to-Chat links, `navigator.share`, and Clipboard API behavior and constraints in official browser/platform documentation.
- [ ] Build a small client-side proof of concept that shares a synthetic report using each candidate method.
- [ ] Test desktop browsers (Chrome/Edge, Firefox, and Safari where available) and mobile browsers (Android Chrome and iOS Safari where available).
- [ ] Test Unicode names, Indonesian text, Rupiah formatting, line breaks, punctuation, and URL-encoded characters in the shared message.
- [ ] Test short, typical, and large synthetic reports; record any link/message length failures and define graceful fallback behavior.
- [ ] Verify a preview-and-cancel flow, popup blocking, missing WhatsApp, denied clipboard permission, and return-to-app behavior.
- [ ] Assert that the share payload includes only the selected session's costs and linked payments, and excludes player cumulative balances, unrelated payments, and PB cash balance.
- [ ] Document the recommended mechanism, browser/platform support matrix, privacy checks, and fallback behavior.

### Success Criteria

**This spike is complete when:**

- [ ] The chosen share flow works in the tested desktop and mobile browsers or has a defined, usable fallback for each unsupported case.
- [ ] Special characters, newlines, player names, and Rupiah values arrive in the previewed text without corruption.
- [ ] The user can cancel before WhatsApp opens, and the application never sends a message automatically.
- [ ] The user must explicitly press Send in WhatsApp to deliver the message.
- [ ] Automated payload checks confirm that cumulative player balances, PB cash, unlinked payments, OAuth tokens, and spreadsheet identifiers are not included.
- [ ] Maximum tested report size and any link/share-target constraints are recorded.
- [ ] A clear recommendation and implementation notes are documented for the report feature.

## Technical Context

**Related Components:**

- Session report generation service and report preview UI.
- Client-side WhatsApp share link, Web Share API, and Clipboard API.
- Session, participant, and session-linked payment data.
- Privacy rules that exclude cumulative player balances and PB cash from WhatsApp text.

**Dependencies:**

- The session report must already be generated from current saved data.
- Test content must use synthetic session/player data and must not include real financial records.
- Browser/device testing is required before selecting a platform-specific default behavior.
- Findings inform the [session report feature PRD](../ways-of-work/plan/pencatatan-sesi-badminton/session-reports/prd.md) and [epic architecture](../ways-of-work/plan/pencatatan-sesi-badminton/arch.md).

**Constraints:**

- No WhatsApp Business API or automated message delivery is in scope.
- The application must show a preview and require a deliberate user action before opening a share target.
- The user must retain the final opportunity to cancel or press Send in WhatsApp.
- WhatsApp text may contain only the selected session's details, participant usage/costs, and payments explicitly linked to that session.
- Cumulative player balances, payments not linked to the session, PB cash balance, OAuth data, and Spreadsheet ID must not be shared.
- The report is text-first and must remain readable without rich-text or table support.

## Research Findings

### Investigation Results

**Not started.** The current PRD requires a user-controlled preview, WhatsApp sharing, copy fallback, and exclusion of cumulative player balances and PB cash. The cross-browser behavior, URL/message size limits, and best default mechanism have not yet been validated.

### Prototype/Testing Notes

Not started. Use synthetic reports with varying participant counts and special characters. Do not send messages to real people or groups; validate the generated link and preview, and stop before sending.

### External Resources

- [MDN: Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN: Clipboard `writeText`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
- [MDN: `URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [WhatsApp Web](https://web.whatsapp.com/)
- [Session report feature PRD](../ways-of-work/plan/pencatatan-sesi-badminton/session-reports/prd.md)

## Decision

### Recommendation

**Pending spike results.** Do not choose a single share mechanism until the prototype confirms its behavior for the supported browser/device matrix and report sizes.

### Rationale

A WhatsApp-specific link may target WhatsApp more directly, while the Web Share API delegates target selection to the operating system/browser and may not expose WhatsApp. Clipboard support is a useful recovery path but may require a secure context and a user gesture. The preferred flow must balance a direct WhatsApp handoff, predictable preview, message integrity, and accessible fallback behavior.

### Implementation Notes

- Build report text from an explicit allowlist of session-scoped fields rather than serializing a broad report object.
- Encode the complete text with a standards-based URL builder; do not concatenate untrusted text into a URL manually.
- Open external destinations only after a user gesture and use safe window-opening options where applicable.
- Preserve a visible copy action even if WhatsApp or the Web Share API is available.
- Handle popup blocking, unsupported APIs, permission denial, and long text without presenting a false success state.
- Keep the preview content identical to the message handed to the share target.

### Follow-up Actions

- [ ] Select the default sharing mechanism and fallback order.
- [ ] Record the tested browser/device support matrix and practical report-size guidance.
- [ ] Add automated tests that assert the share payload excludes prohibited data.
- [ ] Update the session report PRD and architecture with verified platform behavior.
- [ ] Create implementation tasks for preview, WhatsApp handoff, and clipboard fallback.

## Status History

| Date | Status | Notes |
|---|---|---|
| 2026-11-19 | 🔴 Not Started | Spike created and scoped; research and proof of concept not yet run. |

---

_Last updated: 2026-11-19 by Unassigned_
