# Loungebase Portfolio Case Study

Loungebase is presented here as a standalone iOS portfolio case study, not as a portable source release. It is intentionally documented without runnable setup instructions, App Store Connect identifiers, RevenueCat product IDs, Supabase refs, reviewer credentials, IPA paths, signing settings, or build artifacts.

## Product

Loungebase is an airport lounge companion for travelers who need fast, trustworthy lounge discovery, access guidance, and trip-day context. The product work combines mobile UX, travel content quality, subscription readiness, App Store submission prep, and operational fallback design.

## Role

- Designed the mobile product shape around travel-day decisions: find lounges, understand access, compare amenities, and reduce uncertainty before departure.
- Built and hardened SwiftUI app flows for reviewability, content browsing, entitlement-aware experiences, and graceful degraded states.
- Prepared App Store submission materials, review notes, metadata, privacy documentation, and preflight evidence.
- Kept the app usable while monetization infrastructure was incomplete by prioritizing a reviewable free-build fallback over a broken paywall.

## System Shape

- Native iOS app surface with SwiftUI screens for lounge discovery, details, trip context, and account/subscription states.
- Content and data-quality workflow for lounge records, amenities, imagery, and review-facing metadata.
- RevenueCat/App Store subscription integration plan, with fallback behavior when the purchase catalog is unavailable.
- Submission-readiness workflow covering archive/export, IPA inspection, App Store metadata, privacy manifests, review notes, and physical-device smoke testing.
- Backend/storage integration boundaries for content, entitlement checks, and app configuration.

## Portfolio-Safe Boundaries

This repo does not include Loungebase source code. The case study avoids:

- Bundle identifiers, signing assets, provisioning profiles, IPA exports, or App Store Connect records.
- RevenueCat product IDs, API keys, entitlement configuration, or paywall internals.
- Supabase project refs, database dumps, storage bucket paths, or admin scripts.
- Reviewer accounts, local config files, device identifiers, or submission-only artifacts.

The goal is to show mobile product engineering and release-readiness judgment without making the implementation copyable.

## Evidence Summary

- Kept the app reviewable with a free-build fallback while subscription setup was incomplete.
- Exported and inspected an IPA package to verify app configuration and privacy artifacts were included while local-secret files were excluded.
- Maintained submission documentation around App Store metadata, review notes, RevenueCat setup, data/image quality, and physical-device smoke testing.
- Identified the App Store Connect app-record gap as the real external submission blocker instead of continuing to churn local build work.

## Interview Framing

Loungebase is the portfolio example for mobile launch discipline: product UX, SwiftUI implementation, subscription architecture, app review constraints, privacy packaging, and fallback design all have to be treated as one release system.
