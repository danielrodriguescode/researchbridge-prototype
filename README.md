# ResearchBridge — High-Fidelity Prototype

> **Upload your findings. Choose your audience. Communicate with confidence.**

A web-based prototype that helps PhD researchers in health sciences communicate their
findings to non-specialist audiences — policymakers, clinical teams, patient groups, and
the general public.

**Live demo:** https://researchbridge-prototype.vercel.app

This prototype was developed for the **HI.PRESENT** curricular unit of the **HEADS PhD
Programme in Health Data Science** at MEDCIDS / Faculdade de Medicina da Universidade do
Porto (FMUP), by **Daniel Rodrigues**, following a User-Centred Design (UCD) methodology.

---

## What it does

ResearchBridge guides a researcher through a **four-step wizard**:

1. **Input** — paste an abstract or research findings
2. **Audience** — pick the target (policymaker / clinical team / patient group / general public)
3. **Objective** — choose the communication goal
4. **Recommendations** — receive tailored guidance:
   - **Key message structure** (lead → support → ask)
   - **Data to highlight** (the 3 most impactful numbers)
   - **Plain language suggestions** (jargon → plain replacements)
   - **Format & channel** advice
   - An **export preview** (PDF brief, slide outline, copy, share link)

## Demo scenarios

Two pre-loaded scenarios from the validated persona (Sofia, 29, PhD researcher):

- **Scenario 1 — Policy brief for the DGS:** colorectal cancer screening → policymaker
- **Scenario 2 — Clinical presentation:** cardiac risk model → cardiology clinical team

## Tech

Single static `index.html` — HTML, CSS, and vanilla JavaScript. No build step, no
dependencies. Deployed on Vercel.

## Design

Follows the project design system: DM Serif Display / DM Sans typography; navy / orange /
cream palette. Interaction design applies Donald Norman's principles (visibility, feedback,
constraints, consistency, affordance, mapping).

## Run locally

```bash
# any static server, e.g.
python3 -m http.server 8082
# then open http://localhost:8082
```

---

*Academic prototype — not a production tool. All statistics in the demo scenarios are
illustrative.*
