# Agentic QA E2E Flow

This repository demonstrates a small end-to-end QA workflow built with AI agents and MCP servers around Playwright.

## Architecture

The flow is driven from natural language instructions in `QAe2ePromtFile.md`, which coordinates:

- AI Orchestrator (GitHub Copilot / Claude)
- AI Agents
- MCP Servers

Diagram:

```text
+-------------------------------------------------------+
|             Natural Language Instructions             |
+-------------------------------------------------------+
                            |
                            v
+-------------------------------------------------------+
|                    AI Orchestrator                    |
|                        (GitHub Copilot)               |
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

## What is in this repo

- `QAe2ePromtFile.md` — main prompt that guides the workflow
- `user-stories/` — source user stories for test generation
- `specs/` — generated test plan outputs
- `tests/` — Playwright test code and page objects
- `reports/` — generated QA reports
- `screenshots/` — placeholder for manual MCP observations and screenshots

## Workflow

1. Select a user story from `user-stories/`
2. Read the story and extract acceptance criteria
3. Generate a Playwright test plan in `specs/`
4. Execute manual observation via MCP servers and document findings in `screenshots/`
5. Generate automated Playwright tests in `tests/`
6. Run tests, heal failures, and stabilize the flow
7. Produce a test report in `reports/`

## Key files

- `QAe2ePromtFile.md` — workflow orchestration prompt
- `tests/pageObjects/checkoutFlowPO.ts` — POM-style page objects
- `tests/e2e101-checkout.spec.ts` — generated checkout test suite
- `tests/test-options.ts` — custom Playwright fixtures for page objects
- `specs/E2E-101 - E-commerce Checkout Process-plan.md` — generated test plan

## Setup

```bash
npm install
```

## Run the test

```bash
npx playwright test tests/e2e101-checkout.spec.ts --project=chromium
```

## Notes

- The repository is built around `https://www.saucedemo.com`
- The AI prompt file and instruction file are the main source of truth for generating tests
- The workflow is intentionally small but illustrates agent-led planning, generation, and healing

## GitHub Pages

This repository includes a docs page for GitHub Pages at `docs/index.md`.

---

### How to use this repository

1. Update or add a new user story under `user-stories/`
2. Update `QAe2ePromtFile.md` if you want to change workflow behavior
3. Generate or improve tests under `tests/`
4. Run the tests and review outputs in `reports/`

### When to use AI agents

- Use the Planner agent to create structured test scenarios
- Use the Generator agent to write Playwright test code
- Use the Healer agent to fix failing selectors and stabilize tests

### When to use MCP servers

- Use Playwright MCP for manual browser exploration
- Use GitHub MCP for repository actions and commit workflows
- Use browser MCP for UI observation and screenshot capture
