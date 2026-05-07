# ChronoGuesser Portfolio Case Study

ChronoGuesser is presented here as a standalone portfolio case study, not as a portable source release. It is intentionally documented without runnable setup instructions, service identifiers, credentials, storage paths, or generation scripts.

## Product

ChronoGuesser is a historical-location guessing game built around immersive generated panoramas, event metadata, and progressive clue design. The product work combines game mechanics, editorial content systems, image-generation operations, and mobile client integration.

## Role

- Designed the end-to-end game loop: scene reveal, guessing, scoring, feedback, and historical context.
- Built and operated the content pipeline for historical events, metadata enrichment, generated panorama assets, and publication readiness.
- Connected catalog fields into the client experience so players see useful scene cues, source context, and result explanations.
- Balanced content quality, production throughput, and safety review for generated historical imagery.

## System Shape

- Native app experience for the playable game surface.
- Supabase-backed catalog for historical events, visibility state, generated-scene records, and enrichment metadata.
- Batch image-generation workflow for panorama assets with quality checks, retry handling, and storage publication.
- Editorial enrichment workflow for significance, historical context, matching candidates, and scene cues.
- Client-side model and view wiring for catalog-driven game rounds and result screens.

## Portfolio-Safe Boundaries

This repo does not include ChronoGuesser source code. The case study avoids:

- Hosted backend refs, keys, bucket paths, or admin scripts.
- Prompt templates, generation scripts, or scoring internals.
- Production data dumps, event catalogs, or image manifests.
- App build files, entitlement settings, or deployment configuration.

The goal is to show product and engineering judgment without making the implementation copyable.

## Evidence Summary

- Generated and verified a top-300 panorama asset set for active game content.
- Added catalog fields and client wiring for richer scene metadata and result context.
- Built enrichment tooling around significance, historical context, and source matching.
- Separated content/editorial quality from generation mechanics so the product can be reviewed and improved safely.

## Interview Framing

ChronoGuesser is the portfolio example for systems thinking beyond standard web dashboards: content operations, AI image generation, mobile UX, data modeling, and production validation all have to work together for the game to feel coherent.
