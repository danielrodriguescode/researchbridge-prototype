# ResearchBridge — High-Fidelity Prototype

> **Make your research reach the right audience — without losing the science.**

A web-based tool that helps researchers in health sciences communicate their findings to
non-specialist audiences — policymakers, clinical teams, funders & stakeholders, patient
groups, and the general public.

**Live demo:** https://researchbridge-prototype.vercel.app

---

## What it does

A **four-step wizard**:

1. **Research summary** — choose one of the example studies to work with
2. **Audience** — pick the target (policymaker / clinical team / funder / patient group / public)
3. **Objective** — choose the communication goal (3 per audience)
4. **Recommendations** — tailored guidance:
   - **Audience profile** — what they care about, prior knowledge, what convinces them, red flags
   - **Key message structure** (lead → support → ask) + a generated **SVG diagram**
   - **What they need to know first** — prerequisite concepts
   - **Data to highlight** — for a custom abstract, numbers are **detected from your own text**
   - **Plain language suggestions** — rule-based jargon detection on *your* abstract
   - **Format & channel** advice
   - **Likely questions & how to answer** — rehearse the hard questions
   - An **export preview** (PDF brief, slide outline, copy, share link)

## Survey-driven features

This version was iterated on a second round of user research (N=11). Evidence-led additions:
- a **5th audience (Funders & Stakeholders)** — frequent in the survey but missing from v1;
- **rule-based jargon detection** — flags technical terms and surfaces key numbers from the summary;
- an **Audience profile** card (researchers asked to "see the audience profile");
- a **Likely Questions** panel (researchers asked to "prepare for questions after the talk");
- **prerequisite concepts** generalised to every audience ("what they need to know first");
- a generated **key-message diagram** (researchers asked for visual schemas/storytelling).

## Example studies

Two worked examples cover the full flow end to end:

- **Colorectal cancer risk model → policymaker:** turning a screening study into a policy brief
- **Cardiac event early-warning model → clinical team:** introducing a new tool to clinicians

## Tech

Static site — no backend, no build step, no dependencies:

```
index.html        markup
css/styles.css     styles + design tokens
js/data.js         content + rule-based dictionaries (RECS, OBJS, JARGON_DICT, AUD_PROFILE)
js/app.js          state, navigation, analyzer, rendering
```

The jargon analysis is **deterministic, client-side rule-based detection** (a jargon
dictionary + number extraction) — not an LLM. All statistics in the example studies are illustrative.

## Design

DM Serif Display / DM Sans typography; navy / orange / cream palette. Interaction design applies
Donald Norman's principles (visibility, feedback, constraints, consistency, affordance, mapping).
Cards and panels are keyboard-accessible.

## Run locally

```bash
python3 -m http.server 8082
# then open http://localhost:8082
```

---

*Prototype — not a production tool. Developed as part of a User-Centred Design study.*
