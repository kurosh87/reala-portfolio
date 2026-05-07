# Reala Architecture

## Monorepo Map

```txt
reala/
├─ src/                         Marketing site
├─ apps/chatbot/                AI intake and lead workflow app
├─ apps/brokerage-portal/       Brokerage operations dashboard
├─ public/portfolio/            Portfolio presentation assets
└─ docs/architecture.md         Product and technical map
```

## Product Flow

```txt
Marketing site
  -> explains product value and captures demand

AI intake app
  -> turns conversations and requests into structured workflow context

Brokerage portal
  -> manages listings, orders, approvals, vendors, agents, billing, and workspace access
```

## App Responsibilities

| Surface | Purpose | Primary Audience |
| --- | --- | --- |
| Marketing | Product story, positioning, conversion | Prospects and evaluators |
| Chatbot | AI intake, lead workflow, managed routing | Agents and operators |
| Brokerage portal | Operations command center | Brokerage admins, agents, vendors |

## Technical Boundaries

- Root app owns the marketing experience.
- `apps/chatbot` owns conversational workflow and agent-facing inbox surfaces.
- `apps/brokerage-portal` owns brokerage operations and workspace-scoped dashboards.
- Environment values live outside git; `.env.example` documents only placeholders.
- Portfolio assets live under `public/portfolio`.

## Verification

Useful commands:

```bash
pnpm install
pnpm lint
pnpm lint:brokerage
pnpm build:brokerage
```
