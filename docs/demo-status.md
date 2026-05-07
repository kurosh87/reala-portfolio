# Demo Status

## Reala

| Surface | Status | Notes |
| --- | --- | --- |
| Marketing site | Demo-ready | Runs from the root app. Lint passes with existing image optimization warnings. |
| AI intake app | In progress | `apps/chatbot` is included as the selected AI intake/workflow surface. Runtime secrets are required for full provider-backed behavior. |
| Brokerage portal | Build-verified | `pnpm build:brokerage` passes. Runtime database workflows require environment variables. |

## Related Portfolio Work

| Project | Status | Portfolio framing |
| --- | --- | --- |
| Aerobase / Jetlag public demo | Public-safe demo prepared on Mac mini | reduced from the private 8.5G source to a source-only demo. No private git history. Backend calls are stubbed with deterministic fixtures for cash search, award search, trip/result selection, jetlag scoring, and recovery-plan generation. |
| Aerobase Concierge VPS demo | Public-safe infrastructure demo published | Separate repo showing dry-run VPS provisioning, DNS record creation, cloud-init bootstrap shape, and OpenClaw travel-agent runtime events for air-travel research, booking management, award redemption strategy, jetlag recovery scheduling, calendar coordination, and knowledge-graph-backed recommendations. No real provider API calls, runtime tokens, domains, or production provisioning code are included. |
| ChronoGuesser | Portfolio-only case study | Standalone documentation at `docs/chronoguesser-portfolio.md`. No source code, setup path, hosted refs, generation scripts, prompt templates, or production data are included, so copying the Reala repo does not produce a runnable ChronoGuesser implementation. |
| Loungebase | Portfolio-only case study | Standalone documentation at `docs/loungebase-portfolio.md`. No source code, signing assets, App Store Connect identifiers, RevenueCat products, backend refs, reviewer accounts, IPA paths, or submission artifacts are included, so copying the Reala repo does not produce a runnable Loungebase app. |
| Job poster / resume tooling | Installed under job posting workspace | `markdown-resume` was installed under the job poster project as supporting tooling for resume/profile workflows. This is supporting infrastructure, not part of the Reala monorepo. |

## Aerobase / Jetlag Demo Evidence

- Private source was preserved untouched and not reused as public history.
- Public demo copy prepared as the separate `aerobase-public-demo` repo.
- Removed private git history, `.env*`, MCP config, deploy/infra, agents, internal docs, screenshots, caches, build output, supplier/scraper/backend code, and proprietary algorithm packages.
- Added public-facing `README.md` and `docs/public-demo.md`.
- Verified clean for known live-key patterns.
- Verified `pnpm typecheck`, `pnpm test` with 6/6 passing, and `pnpm build` on Node v25.9.0.
- Publishing note: rotate credentials from the private Mac mini source before making any related public repo visible.

## Aerobase Concierge VPS Demo Evidence

- Found the private travel runtime under `/Users/pejman/Projects/jetlag-revweb/infra/travel-runtime` on the Mac mini.
- Confirmed the older Concierge build notes describe VPS provisioning for Aerobase with provider, DNS, cloud-init, runtime, billing, and persistence boundaries.
- Published a fresh public repo as `aerobase-concierge-vps-demo` with no private history.
- Expanded the portfolio framing around OpenClaw travel-agent capabilities: booking/arrangement management, fare research, awards pricing, best-redemption analysis, jetlag recovery scheduling, calendar management, and a travel entity-page knowledge graph.
- Replaced live providers with dry-run Hetzner and Cloudflare adapters.
- Verified `pnpm test` and `pnpm build`.

## Publish Checklist

- Keep only `.env.example`; never commit real env files.
- Run `pnpm lint:all`.
- Run `pnpm build:brokerage`.
- Run a secret scan on the current tree before making the repo public.
- Use a fresh public repository for any sanitized demo copied from a private repo.
