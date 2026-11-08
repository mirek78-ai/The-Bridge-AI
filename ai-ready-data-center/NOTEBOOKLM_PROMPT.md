# NotebookLM infographic brief

## Recommended sources

Upload the public white paper and the printable one-page framework, or use the site's [white-paper web edition](./whitepaper.html) and [one-pager](./one-pager.html) as focused source material. Avoid uploading confidential customer playbooks to a public collaboration workspace without explicit authorization.

## Settings

- **Format:** Infographic
- **Language:** English
- **Orientation:** Landscape
- **Detail:** Standard
- **Tone:** Premium, executive-ready enterprise architecture
- **First iteration:** Produce one concise infographic, then validate all labels.

## Prompt

Create a polished executive infographic titled **THE GOVERNED AI-READY DATA CENTER FABRIC LIFECYCLE** with the subtitle **Prepare broadly. Validate selectively. Invest deliberately. Scale based on evidence.**

**Purpose:** Explain that AI-ready infrastructure is a continuous enterprise governance lifecycle rather than a single GPU or networking purchase. The audience includes CIOs, CISOs, CTOs, architects, data-center leaders, and infrastructure and AI platform teams.

**Primary visual:** Use a clear, clockwise circular or infinity-loop design with **exactly eight stages**, in this order:

1. **ALIGN** — Business outcomes, AI use cases, stakeholders, risk appetite, success criteria.
2. **ASSESS** — Current state, dependencies, readiness gaps, capacity, risk posture.
3. **ARCHITECT** — Compare options, choose the lowest-complexity target architecture, plan evolution.
4. **VALIDATE** — Lab tests, physical pilots, security and failure testing, acceptance evidence.
5. **DEPLOY** — Controlled migration, rollback plans, implementation gates, operational handoff.
6. **OPERATE** — Monitor, secure, patch, recover, manage exposure and capacity.
7. **IMPROVE** — Optimize, automate, review governance, adopt validated capabilities.
8. **SCALE** — Expand infrastructure only when business demand and evidence justify investment.

**Central headline:** “AI readiness is a governed enterprise lifecycle — not a hardware purchase.”

**Secondary panel:** Show exactly four coordinated architecture domains:
- **Enterprise front-end fabric:** applications, APIs, access, management, shared services.
- **Optional AI back-end fabric:** GPU-to-GPU communication, RoCEv2, congestion controls, scale-out where justified.
- **Storage and data services:** data ingestion, file and object storage, checkpoints, recovery.
- **Cross-cutting governance:** security, resilience, observability, automation, lifecycle, organizational readiness.

Make **“optional and workload-driven”** visibly associated with the AI back-end fabric. Do not imply that every inference or RAG environment requires a dedicated AI back-end.

**Visual style:** White or very light neutral background, deep navy, cyan and teal accents, spacious layout, consistent minimal icons, restrained gradients, no gimmicky sci-fi imagery. Professional information design with legible typography, high contrast, and meaningful whitespace.

**Content rules:** Preserve the exact stage names and order. Do not introduce extra stages, vendor logos, device models, invented numbers, unverified statistics, IP addresses, CLI commands, or misleading integration arrows. Do not overcrowd the infographic with a product catalog.

**Output quality:** The graphic must remain readable on a letter-sized white-paper page and understandable within 30 seconds.

## QA checklist

- [ ] Exactly eight stages, in the correct order
- [ ] Four domains included
- [ ] AI back-end marked optional and workload-driven
- [ ] No invented statistics or product claims
- [ ] Legible print-size labels
- [ ] No clipped or misspelled text
- [ ] Not presented as an official Cisco infographic

If the first output is crowded, re-run the prompt with the instruction: **“Remove all secondary body text and prioritize the eight lifecycle labels, central thesis, and four domains.”**
