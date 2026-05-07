# Reala

Portfolio monorepo for a real-estate operations product suite: marketing, AI intake, and brokerage workflow software.

![Reala dashboard preview](public/portfolio/marketing-dashboard.webp)

## Apps

- `.`: marketing site for the Reala product story.
- `apps/chatbot`: AI chat and lead workflow app with agent routing, inbox surfaces, and database-backed conversation flows.
- `apps/brokerage-portal`: brokerage operations dashboard for listings, orders, agents, approvals, vendor jobs, billing, and workspace access.

## Case Study

- [Case study](CASE_STUDY.md)
- [Architecture](docs/architecture.md)
- [Demo status](docs/demo-status.md)
- [ChronoGuesser case study](docs/chronoguesser-portfolio.md)
- [Security](SECURITY.md)

## Portfolio Preview

| Marketing | AI intake | Brokerage portal |
| --- | --- | --- |
| ![Marketing dashboard](public/portfolio/marketing-dashboard.webp) | ![Chatbot preview](public/portfolio/chatbot-preview.png) | ![Brokerage brand](public/portfolio/brokerage-brand.png) |

## Why This Exists

Reala is presented as a product-design-to-engineering case study. The repo shows product thinking, frontend systems, data modeling, auth-aware app structure, and operational workflow design across multiple surfaces.

## Run

```bash
pnpm install
pnpm dev:marketing
pnpm dev:chatbot
pnpm dev:brokerage
pnpm lint:all
pnpm build:brokerage
```

## Portfolio Notes

This repository is cleaned for demo use. Local secrets, copied credentials, build output, research dumps, and internal scratch docs are intentionally excluded.

## Active Portfolio Work

- Aerobase / Jetlag public demo: public-safe travel platform demo prepared separately as `aerobase-public-demo`. The private source repo was preserved untouched, the public copy was reduced to a source-only demo, and supplier integrations, scraping targets, backend code, and proprietary scoring were replaced by deterministic fixtures/stubs.
- ChronoGuesser: standalone portfolio case study for a historical-location guessing game with generated panoramas, catalog enrichment, Supabase-backed content operations, and mobile client wiring. It is documentation-only here so copying this repo does not provide a runnable implementation.
- Job poster tooling: markdown-resume is installed under the job posting workspace as supporting portfolio/resume infrastructure.
