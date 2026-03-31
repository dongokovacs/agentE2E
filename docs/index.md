# Agentic QA E2E Flow

This GitHub Pages document describes a small end-to-end QA flow built with AI agents and MCP servers.

## Overview

The flow is driven from natural language user instructions in `QAe2ePromtFile.md`, and then translated into:

- AI Planner
- AI Generator
- AI Healer
- Playwright MCP automation
- GitHub MCP repository actions
- Browser-level observation

## System diagram

```text
+-------------------------------------------------------+
|             Natural Language Instructions             |
+-------------------------------------------------------+
                            |
                            v
+-------------------------------------------------------+
|                    AI Orchestrator                    |
|               (GitHub Copilot / Claude)               |
+-------------------------------------------------------+
                            |
            +---------------+---------------+
            |                               |
            v                               v
+-----------------------+       +-----------------------+
|       AI Agents       |       |      MCP Servers      |
+-----------------------+       +-----------------------+
|  * Planner            |<----->|  * Playwright         |
|  * Generator          |       |  * GitHub             |
|  * Healer             |       |  * Browser            |
+-----------------------+       +-----------------------+
```

## Repo structure

- `QAe2ePromtFile.md` — workflow prompt file
- `user-stories/` — source stories that drive test generation
- `specs/` — generated test plans
- `tests/` — Playwright tests and page objects
- `reports/` — generated QA reports
- `screenshots/` — manual observation artifacts

## How it works

1. User story is selected from `user-stories/`
2. `QAe2ePromtFile.md` defines the full QA workflow
3. AI agents generate the test plan and automated test code
4. Playwright executes tests and MCP servers capture manual observations
5. Results are saved into `reports/` and `screenshots/`

## Run locally

```bash
npm install
npx playwright test tests/e2e101-checkout.spec.ts --project=chromium
```

## Key files

- `tests/pageObjects/checkoutFlowPO.ts`
- `tests/e2e101-checkout.spec.ts`
- `tests/test-options.ts`
- `specs/E2E-101 - E-commerce Checkout Process-plan.md`
- `QAe2ePromtFile.md`

## Why this is useful

This repo shows how a small E2E automation project can be built using:

- natural language workflow definitions
- AI-assisted planning and code generation
- Playwright test automation
- MCP server orchestration

---

> Use this repo as a blueprint for agent-led QA workflows with a real checkout use case.