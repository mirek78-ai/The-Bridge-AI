# Governed AI-Ready Data Center Fabric Lifecycle

**A public, independent enterprise-architecture example and microsite.**

> Prepare broadly. Validate selectively. Invest deliberately. Scale based on evidence.

This project explains a governance-first approach to preparing enterprise data centers for AI. It helps leaders and architects distinguish today's necessary investments from capabilities best evaluated through pilots or deferred until workload demand is proven.

## Explore

- [Public microsite](./index.html)
- [White paper (web edition)](./whitepaper.html)
- [Printable one-page framework](./one-pager.html)
- [NotebookLM infographic prompt](./NOTEBOOKLM_PROMPT.md)
- [Reference links](./SOURCES.md)

### Eight-stage lifecycle

**Align → Assess → Architect → Validate → Deploy → Operate → Improve → Scale**

Every stage has decisions, evidence, owners, risk gates, and measurable exit criteria.

### Four coordinated domains

1. **Enterprise front-end fabric:** Applications, APIs, management, and services.
2. **Optional AI back-end fabric:** High-performance GPU networking where workload evidence justifies it.
3. **Storage and data services:** Ingestion, throughput, checkpoints, governance, and recovery.
4. **Cross-cutting controls:** Security, resilience, observability, automation, and lifecycle.

## Publishing with GitHub Pages

This microsite is a static HTML/CSS/JavaScript subdirectory inside [The-Bridge-AI](https://github.com/mirek78-ai/The-Bridge-AI) repository. It uses no build tools, external frameworks, cookies, or data collection.

If the parent repository's GitHub Pages deployment is enabled and its included workflow succeeds, the published path is:

`https://mirek78-ai.github.io/The-Bridge-AI/ai-ready-data-center/`

If Pages is not yet active, open **Repository Settings → Pages → Build and deployment → GitHub Actions**. Then review the **Actions** tab for the workflow named **Deploy to GitHub Pages**.

To preview locally, serve the repository root and open `/ai-ready-data-center/`:

```bash
python3 -m http.server 8000
```

## Scope and safeguards

- Public material is **illustrative** and high-level, not a customer-specific low-level design or implementation manual.
- No proprietary customer artifacts, internal workbooks, confidential project details, secrets, or customer deployment templates are included.
- Cisco products and third-party standards are referenced for context, not represented as required components.
- Any model, hardware, feature, software release, interop claim, or security capability must be validated against current vendor documentation for the target environment.
- This is an **independent perspective** and is **not an official Cisco publication** or a claim of Cisco endorsement.

## Source and reuse

Public source code is visible for transparency. **No separate license has been granted** for reuse of the framework text, artwork, or site design. Please link to the published page when sharing.

© 2026. All rights reserved.
