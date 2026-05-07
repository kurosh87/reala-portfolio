# Security

## Public Demo Scope

This repository is prepared as a portfolio/demo codebase. It should not contain production secrets, private customer data, copied credential screenshots, local machine paths, deployment tokens, or private research dumps.

## Environment Variables

Use `.env.example` for documentation only. Real `.env`, `.env.local`, and other environment files are ignored by git.

Before publishing or pushing a public version:

1. Run a current-tree secret scan.
2. Review `git status --short` for unexpected files.
3. Review `git ls-files` for credential screenshots, private docs, and local artifacts.
4. Do not push private repository history into public demo repositories.

## Private Integrations

Clerk, Supabase, Stripe, AI provider keys, email providers, and storage providers are represented only by placeholders. Runtime integrations require separate environment configuration outside git.

## Reporting

For a portfolio repository, security issues should be handled by removing the exposed material, rotating any affected credential, and force-replacing the public demo history if a secret was ever pushed.
