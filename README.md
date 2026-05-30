# ResearchBridge — High-Fidelity Prototype

> **Paste your findings. Choose your audience. Communicate — without losing the science.**

A web-based prototype that helps PhD researchers in health sciences communicate their
findings to non-specialist audiences — policymakers, clinical teams, funders & stakeholders,
patient groups, and the general public.

**Live demo:** https://researchbridge-prototype.vercel.app

Developed for the **HI.PRESENT** curricular unit of the **HEADS PhD Programme in Health Data
Science** at MEDCIDS / Faculdade de Medicina da Universidade do Porto (FMUP), by
**Daniel Rodrigues**, following a User-Centred Design (UCD) methodology.

---

## What it does

A **four-step wizard**:

1. **Input** — paste an abstract or research findings
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

## Round-2, survey-driven features

This version was iterated on a second round of user research (N=11). New, evidence-led additions:
- a **5th audience (Funders & Stakeholders)** — frequent in the survey but missing from v1;
- **rule-based abstract analysis** — flags jargon and pulls out numbers from the pasted text;
- an **Audience profile** card (researchers asked to "see the audience profile");
- a **Likely Questions** panel (researchers asked to "prepare for questions after the talk");
- **prerequisite concepts** generalised to every audience ("what they need to know first");
- a generated **key-message diagram** (researchers asked for visual schemas/storytelling).

## Demo scenarios

Two pre-loaded scenarios from the validated persona (Sofia, 29, PhD researcher):

- **Scenario 1 — Policy brief for the DGS:** colorectal cancer screening → policymaker
- **Scenario 2 — Clinical presentation:** cardiac risk model → cardiology clinical team

## Tech

Static site — no backend, no build step, no dependencies:

```
index.html        markup
css/styles.css     styles + design tokens
js/data.js         content + rule-based dictionaries (RECS, OBJS, JARGON_DICT, AUD_PROFILE)
js/app.js          state, navigation, analyzer, rendering
```

The abstract analysis is **deterministic, client-side rule-based detection** (a jargon
dictionary + number extraction) — not an LLM. All statistics in the demo scenarios are illustrative.

## Design

Follows the project design system: DM Serif Display / DM Sans typography; navy / orange /
cream palette. Interaction design applies Donald Norman's principles (visibility, feedback,
constraints, consistency, affordance, mapping). Cards and panels are keyboard-accessible.

## Run locally

```bash
python3 -m http.server 8082
# then open http://localhost:8082
```

---

*Academic prototype — not a production tool.*
