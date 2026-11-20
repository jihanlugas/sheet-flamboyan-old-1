---
title: "Project Foundation UI Component Strategy"
category: "Architecture & Design"
status: "🔴 Not Started"
priority: "High"
timebox: "1 working day"
created: 2026-11-20
updated: 2026-11-20
owner: "Badminton MVP delivery"
tags: ["technical-spike", "architecture-design", "ui-foundation"]
---

# Project Foundation UI Component Strategy

## Summary

**Spike Objective:** Decide whether the project foundation should implement a small set of UI primitives directly with the existing Tailwind CSS 4 setup or adopt shadcn/ui for the primitives required by the badminton MVP.

**Why This Matters:** Foundation task `FND-003` establishes shared form, table, layout, and feedback components. Selecting the implementation approach affects dependency changes, accessibility work, component ownership, and how much shared abstraction is introduced across every feature.

**Timebox:** 1 working day.

**Decision Deadline:** Complete before `FND-003` starts.

## Research Question(s)

**Primary Question:** For the MVP's required Button, Input, Select, Textarea, FormField, Table, Card, StatusBadge, LoadingState, ErrorState, and EmptyState primitives, should the project use small project-owned Tailwind components or adopt shadcn/ui?

**Secondary Questions:**

- Can both approaches build and lint with the repository's existing Next.js 16.4.6, React 19.3.0, and Tailwind CSS 4.3.3 configuration without framework upgrades?
- Which approach meets the MVP's keyboard, labeling, focus, error-message, non-color status, and narrow-screen table requirements with less project-specific code?
- What direct dependencies and configuration changes does each option require, and how much component code must the project own and maintain?

## Investigation Plan

### Research Tasks

- [ ] Inspect `package.json`, `next.config.ts`, `app/globals.css`, and the Foundation requirements in `docs/ways-of-work/plan/pencatatan-sesi-badminton/feature-badminton-mvp-1.md`.
- [ ] Review the official Tailwind CSS Next.js guide and the official shadcn/ui Next.js installation guide for compatibility and setup implications.
- [ ] In a disposable local prototype, implement the same three representative patterns for each option: an accessible form field with an error message, a responsive data table, and loading/error/empty feedback states.
- [ ] Record for each option: build/lint result, direct dependency changes, configuration files changed, project-owned component files, keyboard/focus behavior, labeling/error behavior, and narrow-screen behavior.
- [ ] Compare both prototypes against the same acceptance checklist; do not connect them to feature APIs or add them to production routes.
- [ ] Document findings, select one approach using the decision rule below, and list the exact follow-up changes for `FND-003`.

### Success Criteria

**This spike is complete when:**

- [ ] Both prototypes have been evaluated against the current locked framework and styling versions; neither evaluation requires an unrelated framework upgrade.
- [ ] The form field exposes a programmatic label and visible error text, supports keyboard use, and has a visible focus state.
- [ ] The table remains usable at a narrow viewport without hiding required content or making the page unusable.
- [ ] Loading, error, and empty states are distinguishable by text/semantics, not color alone.
- [ ] A comparison table records build/lint results, direct dependency/configuration changes, project-owned component count, and accessibility/responsive observations for both options.
- [ ] The recommendation is explicit and supported by the prototype evidence.
- [ ] `FND-003` in the project plan is updated to use the selected approach before production UI primitives are implemented.

**Decision rule:** Reject any option that fails the current-version build/lint gate or any accessibility/responsive requirement above. Among the remaining options, select the option with fewer new direct dependencies and configuration changes if both provide the required behavior. If still tied, select the option requiring fewer project-specific abstraction layers. Do not select based on visual preference alone.

## Technical Context

**Related Components:**

- Existing project: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `app/globals.css`, and `app/layout.tsx`.
- Planned foundation: `FND-003` design system and reusable UI primitives; `FND-004` application layout; `FND-005` page skeletons.

**Dependencies:**

- `FND-001` must verify the project baseline and conventions.
- `FND-002` must establish the component folder and environment conventions.
- `FND-003` is blocked until this spike's recommendation is recorded.

**Constraints:**

- Preserve the current Next.js 16.4.6, React 19.3.0, Tailwind CSS 4.3.3, and Yarn 1.22.22 baseline unless the prototype proves a concrete compatibility blocker.
- The repository currently imports Tailwind with `@import "tailwindcss";` in `app/globals.css` and uses the Tailwind CSS 4 Turbopack integration in `next.config.ts`.
- Keep components small and directly reusable; avoid building a general-purpose design-system framework.
- Do not add a component package or change production pages while the spike is in progress.
- Run all experiments locally with disposable files and dependencies. Do not use Vercel as a development or test environment.

## Research Findings

### Investigation Results

Not started. No implementation approach is approved until the comparison and success criteria are complete.

### Prototype/Testing Notes

No prototype has been created. The spike must keep both alternatives isolated from production routes and remove disposable prototype artifacts when the comparison is recorded.

### External Resources

- [Tailwind CSS: Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui: Installation for Next.js](https://ui.shadcn.com/docs/installation/next)

## Decision

### Recommendation

Pending completion of the investigation. Do not treat either option as selected before the success criteria pass.

### Rationale

Pending prototype evidence. The decision must use the documented decision rule and comparison table.

### Implementation Notes

- Update only the UI-foundation approach and relevant dependencies/configuration in `FND-003`; preserve the feature requirements and page coverage.
- If project-owned Tailwind primitives are selected, implement only the required small components under `src/components/ui/`.
- If shadcn/ui is selected, record the exact generator command, component base, added dependencies, and generated files; review generated code into the repository and keep it consistent with the shared tokens.
- Do not import prototype code into production routes.

### Follow-up Actions

- [ ] Complete the prototype comparison and record results.
- [ ] Update `FND-003` with the selected approach, exact component scope, and dependency changes.
- [ ] Update `package.json` and `yarn.lock` only if the selected approach requires new dependencies.
- [ ] Update the project plan dependency link and proceed with `FND-003`.

## Status History

| Date       | Status          | Notes                                  |
| ---------- | --------------- | -------------------------------------- |
| 2026-11-20 | 🔴 Not Started  | Spike created and scoped before FND-003 |

---

_Last updated: 2026-11-20 by Badminton MVP delivery_
