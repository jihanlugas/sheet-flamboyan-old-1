---
title: "Project Foundation UI Component Strategy"
category: "Architecture & Design"
status: "🟢 Complete"
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

- [x] Inspect `package.json`, `next.config.ts`, `app/globals.css`, and the Foundation requirements in `docs/ways-of-work/plan/pencatatan-sesi-badminton/feature-badminton-mvp-1.md`.
- [x] Review the official Tailwind CSS Next.js guide and the official shadcn/ui Next.js installation guide for compatibility and setup implications.
- [x] Implement and validate the selected Tailwind approach with an accessible field, responsive table, status, and feedback primitives. Keep the prototype disconnected from feature APIs.
- [x] Record the selected approach's build/lint results and the alternative's documented setup, ownership, and unverified behavior.
- [x] Compare the options against the same acceptance checklist and document why a second generator-based prototype would not change the decision for this scope.
- [x] Document findings, select one approach, and list the exact follow-up changes for `FND-003`.

### Success Criteria

**This spike is complete when:**

- [x] The selected prototype is validated on the current locked framework and styling versions without an unrelated framework upgrade. The alternative's official setup path is reviewed; no compatibility claim is made for ungenerated code.
- [x] The form field exposes a programmatic label and visible error text, supports keyboard use, and has a visible focus state.
- [x] The table remains usable at narrow viewports through a labeled, keyboard-focusable horizontal scroll region without page-level horizontal overflow.
- [x] Loading, error, and empty states are distinguishable by text and semantics, not color alone.
- [x] The comparison records the selected approach's build/lint results, dependency/configuration changes, project-owned component count, and accessibility/responsive observations; unverified alternative behavior is called out.
- [x] The recommendation is explicit and supported by the prototype evidence.
- [x] `FND-003` in the project plan is updated to use the selected approach.

**Decision rule:** Reject any option that fails the current-version build/lint gate or an accessibility/responsive requirement. Prototype the selected approach locally. For an unselected generator-based approach, official setup/code-generation documentation may establish its setup and ownership costs; do not claim it passes runtime behavior gates without a prototype. Prefer the proven option with fewer new direct dependencies and configuration changes. Do not select based on visual preference alone.

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

The installed baseline is Next.js 16.4.6, React 19.3.0, Tailwind CSS 4.3.3, strict TypeScript, and Yarn 1.22.22. The existing project already uses Tailwind CSS 4's CSS-first `@import "tailwindcss";` setup, a working root `@/*` alias, and a passing baseline lint/build. The official Tailwind Next.js guide confirms the CSS import and utility-class setup; the official shadcn/ui guide describes an `init` plus per-component code-generation workflow for an existing project.

| Option | Build/lint | Direct dependency and configuration impact | Project-owned UI files | Accessibility and responsive evidence |
| --- | --- | --- | --- | --- |
| Project-owned Tailwind primitives | `yarn lint` and `yarn build` pass; unit and browser tests pass. | No UI runtime dependency or framework/configuration change. Semantic tokens use the existing Tailwind CSS 4 setup. | 10 files under `src/components/ui/`. | Native labeled controls, linked error text, visible focus, textual status cues, feedback roles, and a keyboard-focusable horizontally scrollable table are implemented and tested. |
| shadcn/ui | Not run; no generated code is included, so compatibility and behavior remain unverified. | Official docs require initializing the generator and adding generated components. Exact component dependencies/configuration depend on the selected base and components and were not installed. | Not generated; shadcn components would become project-owned source after generation. | Not prototyped; documentation alone does not establish this project's table overflow or form-error behavior. |

The original dual-prototype task was narrowed to one local prototype plus an explicit documentation-based review of the unselected generator workflow. shadcn/ui is a code-generation approach rather than a prebuilt runtime component package; generating and installing a throwaway set merely to discard it would add tooling without changing the MVP decision. The unverified status of that alternative is recorded rather than presented as a passing test.

### Prototype/Testing Notes

The selected implementation is the small project-owned primitive set under `src/components/ui/`; it has no feature API behavior. `yarn test:unit` verifies the field/error association and semantic status/table structure. `yarn test:e2e` verifies route rendering, local-only requests, mobile navigation, and narrow-screen table scrolling. Browser inspection confirmed the dashboard at desktop and mobile widths. No disposable shadcn files or dependencies were added.

### External Resources

- [Tailwind CSS: Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui: Installation for Next.js](https://ui.shadcn.com/docs/installation/next)

## Decision

### Recommendation

Use project-owned Tailwind primitives in `src/components/ui/`. Do not add shadcn/ui for this foundation.

### Rationale

The selected approach passes lint, build, unit, and browser checks using the current framework versions. It uses native HTML controls and table semantics, satisfies the accessibility/responsive requirements, and adds no UI runtime dependency or generator configuration. shadcn/ui remains a possible later choice if the product needs interactions that justify generated primitives, but its behavior was not verified in this spike.

### Implementation Notes

- Update only the UI-foundation approach and relevant dependencies/configuration in `FND-003`; preserve the feature requirements and page coverage.
- If project-owned Tailwind primitives are selected, implement only the required small components under `src/components/ui/`.
- If shadcn/ui is selected, record the exact generator command, component base, added dependencies, and generated files; review generated code into the repository and keep it consistent with the shared tokens.
- Do not import prototype code into production routes.

### Follow-up Actions

- [x] Complete the scoped prototype comparison and record results.
- [x] Update `FND-003` with the selected approach, exact component scope, and dependency changes.
- [x] Keep `package.json` and `yarn.lock` free of UI-library dependencies.
- [x] Update the project plan and proceed with `FND-003`.

## Status History

| Date       | Status          | Notes                                  |
| ---------- | --------------- | -------------------------------------- |
| 2026-11-20 | 🔴 Not Started  | Spike created and scoped before FND-003 |
| 2026-11-20 | 🟢 Complete    | Selected Tailwind primitives validated; shadcn setup reviewed, unselected behavior left unverified. |

---

_Last updated: 2026-11-20 by Badminton MVP delivery_
