import type { LegacyWriteMode } from "@/lib/legacy-bridge-safety"

export type BridgeTestingPhase = {
  phase: string
  title: string
  environment: string
  writeMode: LegacyWriteMode
  allowedWork: string[]
  blockedWork: string[]
  acceptance: string
}

export type BridgeProtectedSystem = {
  name: string
  productionRisk: string
  safeTestMethod: string
}

export const bridgeModeDescriptions: Record<
  LegacyWriteMode,
  {
    label: string
    posture: string
    description: string
  }
> = {
  off: {
    label: "Off",
    posture: "Hard stop",
    description:
      "No legacy writes are allowed. This is the safest default for local development and first review.",
  },
  dry_run: {
    label: "Dry run",
    posture: "Would-write logging",
    description:
      "Bridge actions can produce sanitized payloads and audit records, but do not mutate legacy systems.",
  },
  sandbox: {
    label: "Sandbox",
    posture: "Cloned fixtures only",
    description:
      "Bridge actions can write only to restored dumps, staging databases, or synthetic test fixtures.",
  },
  admin_approved_live: {
    label: "Admin-approved live",
    posture: "Synthetic live fixture",
    description:
      "Live bridge writes require an approval id and clearly marked TEST-PORTAL data.",
  },
}

export const bridgeTestingPhases: BridgeTestingPhase[] = [
  {
    phase: "Phase 1",
    title: "Offline clone testing",
    environment: "Local legacy clone from DigitalOcean dumps",
    writeMode: "sandbox",
    allowedWork: [
      "Restore Deliverables and field tech dumps into a local or staging database.",
      "Run account, order, entitlement, and status bridge logic against clones.",
      "Verify idempotency and duplicate detection.",
    ],
    blockedWork: [
      "No live Reala admin portal clicks.",
      "No production TimeTap, Stripe, folder, Matterport, or print mutations.",
    ],
    acceptance:
      "Synthetic accounts and orders can be created in the clone repeatedly without duplicating records.",
  },
  {
    phase: "Phase 2",
    title: "Dry-run production simulation",
    environment: "Production-shaped reads, dry-run writes",
    writeMode: "dry_run",
    allowedWork: [
      "Read safe mirror inputs where access is approved.",
      "Generate would-write payloads for account and order bridge actions.",
      "Store sanitized attempt logs for operator review.",
    ],
    blockedWork: [
      "No live database writes.",
      "No folder creation, invoice generation, payment authorization, or TimeTap changes.",
    ],
    acceptance:
      "Every proposed write has a visible sanitized payload and can be rejected before it touches legacy.",
  },
  {
    phase: "Phase 3",
    title: "Operator ghost mode",
    environment: "Real records, read-only comparison",
    writeMode: "off",
    allowedWork: [
      "Compare new portal views to legacy admin screens.",
      "Capture mismatches as tickets.",
      "Confirm labels, statuses, entitlements, and deep links with Reala admins.",
    ],
    blockedWork: [
      "No save/update clicks in live admin tools.",
      "No sync jobs or current-day folder automation tests.",
    ],
    acceptance:
      "Admins can review sampled records without changing daily production operations.",
  },
  {
    phase: "Phase 4",
    title: "Synthetic live test",
    environment: "Live legacy with one approved test fixture",
    writeMode: "admin_approved_live",
    allowedWork: [
      "Create a single TEST-PORTAL client/order only after written approval.",
      "Run during a quiet window.",
      "Verify the synthetic fixture appears in both legacy and the new portal.",
    ],
    blockedWork: [
      "No real client data writes.",
      "No broad syncs, billing captures, or folder actions outside the synthetic fixture.",
    ],
    acceptance:
      "The one approved live fixture is traceable, reversible, and cannot be confused with a real customer.",
  },
  {
    phase: "Phase 5",
    title: "Limited admin-approved bridge",
    environment: "Production gated by super-admin review",
    writeMode: "admin_approved_live",
    allowedWork: [
      "Client-facing users create portal requests.",
      "Super admins review and push approved requests to legacy.",
      "Every push records actor, source, target, payload, response, and rollback notes.",
    ],
    blockedWork: [
      "No automatic client-facing live writes.",
      "No replacement of TimeTap, invoicing, folder automation, or payments without a separate rollout.",
    ],
    acceptance:
      "Portal requests can move into legacy only through an audited admin gate.",
  },
]

export const protectedLegacySystems: BridgeProtectedSystem[] = [
  {
    name: "Legacy MySQL",
    productionRisk: "Accidental account, order, entitlement, or invoice drift.",
    safeTestMethod: "Restore DigitalOcean dumps locally and run cloned DB checks first.",
  },
  {
    name: "TimeTap",
    productionRisk: "Unexpected appointment changes or duplicate scheduling records.",
    safeTestMethod: "Use dry-run payloads and compare against operator-approved examples.",
  },
  {
    name: "Stripe",
    productionRisk: "Unintended authorization, capture, customer, or payment-method changes.",
    safeTestMethod: "Use Stripe test mode only until business rules are approved.",
  },
  {
    name: "Dropbox / Wasabi folders",
    productionRisk: "Incorrect folder creation, duplicate paths, or asset placement errors.",
    safeTestMethod: "Use detector-only reports before any one-record repair flow.",
  },
  {
    name: "Matterport",
    productionRisk: "Client-visible tour links can point to the wrong canonical URL.",
    safeTestMethod: "Compare generated, delivered, and override links before saving changes.",
  },
  {
    name: "WordPress",
    productionRisk: "Live marketing pages, forms, or client signup paths can be disrupted.",
    safeTestMethod: "Keep WordPress as production and mirror only the needed signup context.",
  },
]

export const syntheticIdentityRules = [
  "Use the TEST-PORTAL- prefix on client names, listing addresses, and external references.",
  "Use non-customer test email addresses only.",
  "Never reuse a real client name, property address, card, appointment, or invoice.",
  "Leave approved live fixtures clearly marked or document the cleanup path.",
]
