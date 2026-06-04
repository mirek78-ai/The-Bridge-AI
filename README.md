# The AI Bridge

The AI Bridge is a lightweight Enterprise Architecture and AI governance workspace. It helps teams define how humans and AI work together while preserving clear accountability, infrastructure security, digital resilience, practical guardrails, and meaningful human agency.

The visual identity uses the official public logo and banner from [The AI Bridge YouTube channel](https://www.youtube.com/@TheAIBridgeAI).

## What it includes

- AI impact and autonomy assessment
- Human/AI accountability matrix
- Guardrail implementation register
- Eight-domain Enterprise Architecture framework
- Digital resilience capability and control model
- Infrastructure security capability and control model
- Connected architecture inventory and dependency map
- Architecture disruption scenario simulator
- Technology, people, and process worst-case scenario library
- Day 0, Day 1, and Day 2 technology readiness tracker
- Architecture Decision Records with review dates
- Evidence-based assurance with evidence expiry
- Executive architecture intelligence signals
- Shared governance principles
- Live governance readiness indicators
- Downloadable governance brief
- Browser-local persistence with no backend required

The detailed operating model is documented in [EA-FRAMEWORK.md](EA-FRAMEWORK.md). The application now demonstrates the full framework lifecycle:

```text
Discover → Assess → Decide → Assure → Adapt
```

## Run locally

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. The included workflow will publish the site after each push to `main`.

## Product direction

This MVP is intentionally dependency-free. A future enterprise version can add identity and role-based access, evidence attachments, approval workflows, architecture repository integrations, critical service mapping, model inventory, policy mapping, and audit reporting.

## Core commitment

> AI can act. Humans remain accountable. Critical outcomes remain secure and resilient.
