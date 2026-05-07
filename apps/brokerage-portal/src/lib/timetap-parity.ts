import type { Event } from "@/components/ui/event-manager"
import { getProfile } from "@/lib/workspace-access"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

export type TimeTapMirrorStatus =
  | "TimeTap matched"
  | "No TimeTap match"
  | "Scheduling mismatch"
  | "Bridge pending"
  | "Manually entered"

export type TimeTapMismatchState =
  | "clear"
  | "portal-only"
  | "sheet-only"
  | "service-mismatch"
  | "vendor-mismatch"
  | "cancelled-visible"

export type DailyDraftingMatch = {
  workbookTitle: string
  spreadsheetId: string
  sheetTitle: string
  sheetId: string
  row: number | null
  status: "matched" | "missing" | "pending-upload" | "not-applicable"
  uploadMarker?: string
  draftedBy?: string
  checkedBy?: string
  livableSqft?: string
  extraSqft?: string
  billableSqft?: string
}

export type SchedulerProductFields = {
  photoType?: string
  floorPlanType?: string
  videoType?: string
  matterportType?: string
  printedMaterialType?: string
  matterportUrl?: string
  printQuantity?: string
  printPaperWeight?: string
  printTracking?: string
  folderStatus: "mirrored" | "missing-signal" | "needs-review" | "not-applicable"
}

export type TimeTapParityRecord = {
  id: string
  listingId?: string
  orderId?: string
  title: string
  address: string
  unit?: string
  client: string
  realtor: string
  staff: string
  vendorCompany: string
  startTime: Date
  endTime: Date
  category: string
  color: Event["color"]
  status: string
  timeTapAppointmentId: string | null
  timeTapCalendarId: string | null
  calendarName: string
  serviceTypes: string[]
  additionalServices: string[]
  source: "TimeTap mirror" | "Legacy appointment mirror" | "Portal job"
  mirrorStatus: TimeTapMirrorStatus
  mismatchState: TimeTapMismatchState
  bridgeState: "read-only" | "dry-run-ready" | "needs-staff-review"
  dailyDrafting: DailyDraftingMatch
  schedulerFields: SchedulerProductFields
  exceptions: string[]
  bridgeChecklist: string[]
}

export type TimeTapCalendarException = {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "monitoring" | "blocked"
  source: string
  detail: string
  nextStep: string
}

export type TimeTapBridgePreview = {
  id: string
  title: string
  target: string
  mode: "dry-run"
  sourceRecord: string
  payloadPreview: Record<string, string>
  checklist: string[]
}

const dailyDraftingBase = {
  workbookTitle: "Daily drafting jobs",
  spreadsheetId: "1l9nXipLIBTzl8L4ZkTTbS_NCp2_oAljqJt1SboQBbkg",
  sheetTitle: "Daily Drafting",
  sheetId: "523487603",
} satisfies Omit<DailyDraftingMatch, "row" | "status">

export const timeTapParityRecords: TimeTapParityRecord[] = [
  {
    id: "tt-parity-124610",
    listingId: "1",
    orderId: "ORD-24018",
    title: "Photography, floor plan, and video launch package",
    address: "1238 Homer St, Vancouver, BC",
    client: "Reala Client",
    realtor: "Maya Chen",
    staff: "Sofia Alvarez",
    vendorCompany: "Pixlworks",
    startTime: new Date(2026, 4, 14, 9, 0),
    endTime: new Date(2026, 4, 14, 12, 0),
    category: "Photography",
    color: "green",
    status: "Crew confirmed",
    timeTapAppointmentId: "appointment-124610",
    timeTapCalendarId: "TT-124610",
    calendarName: "Sofia Alvarez field calendar",
    serviceTypes: ["Photography", "Floor Plan", "Video"],
    additionalServices: ["Website", "Social Media Photos"],
    source: "TimeTap mirror",
    mirrorStatus: "TimeTap matched",
    mismatchState: "clear",
    bridgeState: "read-only",
    dailyDrafting: {
      ...dailyDraftingBase,
      row: 36,
      status: "matched",
      draftedBy: "A. Drafting",
      checkedBy: "Ops Check",
      livableSqft: "2,840",
      extraSqft: "420",
      billableSqft: "3,260",
    },
    schedulerFields: {
      photoType: "HDR Photography",
      floorPlanType: "Standard Floor Plan",
      videoType: "Standard Video",
      folderStatus: "mirrored",
    },
    exceptions: [],
    bridgeChecklist: [
      "Confirm preferred slot against live TimeTap before any booking.",
      "Confirm Daily Drafting sqft values before TimeTap field update.",
      "Keep folder creation in legacy until bridge approval.",
    ],
  },
  {
    id: "tt-parity-124611",
    listingId: "2",
    orderId: "ORD-24021",
    title: "Photos and feature sheet appointment",
    address: "456 W 14th Ave, Vancouver, BC",
    client: "Reala Client",
    realtor: "Evan Brooks",
    staff: "Reala Studio",
    vendorCompany: "Reala",
    startTime: new Date(2026, 4, 15, 10, 0),
    endTime: new Date(2026, 4, 15, 11, 30),
    category: "Photography",
    color: "blue",
    status: "Scheduled",
    timeTapAppointmentId: "appointment-124611",
    timeTapCalendarId: "TT-124611",
    calendarName: "Reala Studio production calendar",
    serviceTypes: ["Photography", "Printing"],
    additionalServices: ["Feature Sheet"],
    source: "TimeTap mirror",
    mirrorStatus: "Bridge pending",
    mismatchState: "service-mismatch",
    bridgeState: "needs-staff-review",
    dailyDrafting: {
      ...dailyDraftingBase,
      row: 42,
      status: "pending-upload",
      uploadMarker: "pending",
      draftedBy: "M. Drafting",
      checkedBy: "Needs check",
      livableSqft: "1,960",
      extraSqft: "210",
      billableSqft: "2,170",
    },
    schedulerFields: {
      photoType: "Standard Photography",
      printedMaterialType: "Feature Sheets printed",
      printQuantity: "100",
      printPaperWeight: "100 lb gloss",
      folderStatus: "needs-review",
    },
    exceptions: [
      "Daily Drafting has upload-ready fields, but TimeTap write bridge is disabled.",
      "Print quantity needs staff confirmation before invoice or fulfillment.",
    ],
    bridgeChecklist: [
      "Review feature sheet proof and print quantity.",
      "Preview TimeTap field update for sqft/drafter/checker only.",
      "Do not generate invoice or print fulfillment from this view.",
    ],
  },
  {
    id: "tt-parity-124612",
    listingId: "3",
    orderId: "ORD-24027",
    title: "Virtual staging production queue",
    address: "789 Arbutus St, Vancouver, BC",
    client: "Reala Client",
    realtor: "Priya Shah",
    staff: "Jon Bell",
    vendorCompany: "North Shore Media",
    startTime: new Date(2026, 4, 18, 13, 0),
    endTime: new Date(2026, 4, 18, 15, 0),
    category: "Review",
    color: "purple",
    status: "Portal job without TimeTap match",
    timeTapAppointmentId: null,
    timeTapCalendarId: null,
    calendarName: "Portal production queue",
    serviceTypes: ["Virtual Staging"],
    additionalServices: ["6 images"],
    source: "Portal job",
    mirrorStatus: "No TimeTap match",
    mismatchState: "portal-only",
    bridgeState: "needs-staff-review",
    dailyDrafting: {
      ...dailyDraftingBase,
      row: null,
      status: "not-applicable",
    },
    schedulerFields: {
      folderStatus: "not-applicable",
    },
    exceptions: ["Portal virtual staging job is not expected to have a field calendar slot."],
    bridgeChecklist: [
      "Keep this as production queue work, not a TimeTap appointment.",
      "Link to product parity detail before provider handoff.",
    ],
  },
  {
    id: "tt-parity-124613",
    listingId: "4",
    orderId: "ORD-24033",
    title: "Print shop order requires scheduling review",
    address: "3210 Cambie St, Vancouver, BC",
    client: "Reala Client",
    realtor: "Noah Kim",
    staff: "Print Desk",
    vendorCompany: "Reala",
    startTime: new Date(2026, 4, 20, 9, 0),
    endTime: new Date(2026, 4, 20, 10, 0),
    category: "Delivery",
    color: "orange",
    status: "Print bridge pending",
    timeTapAppointmentId: null,
    timeTapCalendarId: null,
    calendarName: "Print production queue",
    serviceTypes: ["Printing", "Sign Post"],
    additionalServices: ["Postcards", "Booklets"],
    source: "Portal job",
    mirrorStatus: "No TimeTap match",
    mismatchState: "portal-only",
    bridgeState: "dry-run-ready",
    dailyDrafting: {
      ...dailyDraftingBase,
      row: null,
      status: "missing",
    },
    schedulerFields: {
      printedMaterialType: "Print Sign, Postcards, Booklets",
      printQuantity: "Needs staff review",
      folderStatus: "missing-signal",
    },
    exceptions: [
      "Print job has no TimeTap appointment match.",
      "Folder/delivery signal is missing from mirrored Scheduler fields.",
    ],
    bridgeChecklist: [
      "Confirm whether this needs TimeTap or should stay print-only.",
      "Preview print/folder bridge requirements.",
      "Do not create invoice or folders from dry-run preview.",
    ],
  },
  {
    id: "tt-parity-124614",
    listingId: "5",
    orderId: "ORD-24039",
    title: "Matterport capture",
    address: "6547 Cypress St, Vancouver, BC",
    client: "Reala Client",
    realtor: "Olivia Grant",
    staff: "Marcus Reid",
    vendorCompany: "Pixlworks",
    startTime: new Date(2026, 4, 14, 13, 0),
    endTime: new Date(2026, 4, 14, 15, 0),
    category: "Matterport",
    color: "purple",
    status: "Delivered",
    timeTapAppointmentId: "appointment-124614",
    timeTapCalendarId: "TT-124614",
    calendarName: "Marcus Reid Matterport calendar",
    serviceTypes: ["Matterport"],
    additionalServices: ["3D tour"],
    source: "TimeTap mirror",
    mirrorStatus: "Manually entered",
    mismatchState: "clear",
    bridgeState: "read-only",
    dailyDrafting: {
      ...dailyDraftingBase,
      row: 51,
      status: "matched",
    },
    schedulerFields: {
      matterportType: "Standard Matterport",
      matterportUrl: "Matterport URL mirrored from Scheduler field",
      folderStatus: "mirrored",
    },
    exceptions: [],
    bridgeChecklist: [
      "Confirm canonical Matterport URL before client-facing delivery.",
      "Record manual legacy entry evidence only.",
    ],
  },
]

export function getTimeTapParityRecords(access?: WorkspaceAccessSnapshot) {
  if (!access) return timeTapParityRecords

  const activeProfile = getProfile(access.activeRole)

  if (activeProfile.workspaceType === "vendor-workspace") {
    return timeTapParityRecords.filter((record) =>
      ["Sofia Alvarez", "Marcus Reid", "Jon Bell", "Reala Studio"].includes(record.staff)
    )
  }

  if (activeProfile.workspaceType === "client-workspace") {
    return timeTapParityRecords.filter((record) => record.listingId === "1")
  }

  return timeTapParityRecords
}

export function projectTimeTapRecordsToEvents(records: TimeTapParityRecord[]): Event[] {
  return records.map((record) => ({
    id: record.id,
    title: record.title,
    description: [
      record.realtor,
      record.serviceTypes.join(", "),
      record.timeTapCalendarId ? `TimeTap ${record.timeTapCalendarId}` : record.mirrorStatus,
    ]
      .filter(Boolean)
      .join(" · "),
    startTime: record.startTime,
    endTime: record.endTime,
    color: record.color,
    category: record.category,
    attendees: [record.staff, record.vendorCompany].filter(Boolean),
    tags: [
      record.source,
      record.mirrorStatus,
      record.mismatchState,
      ...record.serviceTypes,
      record.dailyDrafting.status === "matched" ? "Daily Drafting" : "",
    ].filter(Boolean),
    location: record.address,
    status: record.status,
    source: record.source,
    serviceTypes: record.serviceTypes,
    staff: record.staff,
    vendorCompany: record.vendorCompany,
    mismatchState: record.mismatchState,
    bridgeState: record.bridgeState,
    legacy: {
      timeTapAppointmentId: record.timeTapAppointmentId,
      timeTapCalendarId: record.timeTapCalendarId,
      calendarName: record.calendarName,
      client: record.client,
      realtor: record.realtor,
      unit: record.unit,
      dailyDrafting: record.dailyDrafting,
      schedulerFields: record.schedulerFields,
      exceptions: record.exceptions,
      bridgeChecklist: record.bridgeChecklist,
      noWriteNote:
        "Read-only mirror only. This view does not write to TimeTap, Google Sheets, folders, Stripe, Matterport, or legacy MySQL.",
    },
  }))
}

export function getTimeTapParityEvents(access?: WorkspaceAccessSnapshot) {
  return projectTimeTapRecordsToEvents(getTimeTapParityRecords(access))
}

export function getTimeTapAvailabilityEvents() {
  const liveEvents = projectTimeTapRecordsToEvents(
    timeTapParityRecords.filter((record) =>
      ["Photography", "Floor Plan", "Matterport"].some((service) =>
        record.serviceTypes.includes(service)
      )
    )
  )

  return [
    ...liveEvents,
    {
      id: "availability-manual-coordination",
      title: "Manual coordination lane",
      description: "Ops review lane when live TimeTap has no safe match.",
      startTime: new Date(2026, 4, 16, 9, 0),
      endTime: new Date(2026, 4, 16, 12, 0),
      color: "red",
      category: "Coordination",
      location: "Scheduling desk",
      status: "Staff review required",
      attendees: ["Reala Ops"],
      tags: ["TimeTap mirror", "No safe match", "Read-only"],
      source: "TimeTap mirror",
      serviceTypes: ["Coordination"],
      staff: "Reala Ops",
      vendorCompany: "Reala",
      mismatchState: "service-mismatch",
      bridgeState: "needs-staff-review",
    } satisfies Event,
  ]
}

export function getTimeTapParityForListing(listingId: string) {
  return timeTapParityRecords.filter((record) => record.listingId === listingId)
}

export function getOrderTimeTapStatus(orderId: string) {
  return timeTapParityRecords.find((record) => record.orderId === orderId)
}

export function withOrderTimeTapStatuses<T extends { header: string }>(orders: T[]) {
  return orders.map((order) => {
    const match = getOrderTimeTapStatus(order.header)

    return {
      ...order,
      timeTapStatus: match?.mirrorStatus ?? "No TimeTap match",
      timeTapStatusDetail: match
        ? `${match.timeTapCalendarId ?? "No TimeTap calendar"} · ${match.bridgeState}`
        : "No linked TimeTap mirror record yet",
      timeTapCalendarId: match?.timeTapCalendarId ?? "",
      timeTapAppointmentId: match?.timeTapAppointmentId ?? "",
      bridgeState: match?.bridgeState ?? "needs-staff-review",
    }
  })
}

export function getTimeTapCalendarSummary(access?: WorkspaceAccessSnapshot) {
  const records = getTimeTapParityRecords(access)
  const calendarIds = new Set(records.flatMap((record) => record.timeTapCalendarId ? [record.timeTapCalendarId] : []))
  const mismatches = records.filter((record) => record.mismatchState !== "clear")
  const dailyDraftingMatches = records.filter(
    (record) => record.dailyDrafting.status === "matched"
  )

  return {
    records: records.length,
    calendars: calendarIds.size,
    mismatches: mismatches.length,
    dailyDraftingMatches: dailyDraftingMatches.length,
    sourceLabel: "TimeTap + Daily Drafting read-only parity mirror",
  }
}

export function getTimeTapBridgePreviews(): TimeTapBridgePreview[] {
  return timeTapParityRecords
    .filter((record) => record.bridgeState !== "read-only")
    .map((record) => ({
      id: `bridge-preview-${record.id}`,
      title: record.title,
      target: record.timeTapAppointmentId
        ? `TimeTap appointments/${record.timeTapAppointmentId}`
        : "TimeTap appointment create/update candidate",
      mode: "dry-run",
      sourceRecord: record.dailyDrafting.row
        ? `Daily Drafting row ${record.dailyDrafting.row}`
        : record.orderId ?? record.id,
      payloadPreview: {
        calendarId: record.timeTapCalendarId ?? "new-match-required",
        services: record.serviceTypes.join(", "),
        draftedBy: record.dailyDrafting.draftedBy ?? "not provided",
        checkedBy: record.dailyDrafting.checkedBy ?? "not provided",
        livableSqft: record.dailyDrafting.livableSqft ?? "not provided",
        billableSqft: record.dailyDrafting.billableSqft ?? "not provided",
      },
      checklist: record.bridgeChecklist,
    }))
}

export function getTimeTapCalendarExceptions(): TimeTapCalendarException[] {
  return [
    {
      id: "tt-exception-portal-only",
      title: "Portal job has no TimeTap match",
      severity: "medium",
      status: "open",
      source: "Portal job",
      detail: "Virtual staging and print queue records are visible without a TimeTap calendar id.",
      nextStep: "Decide whether these stay production-only or need a TimeTap reference.",
    },
    {
      id: "tt-exception-sheet-upload",
      title: "Daily Drafting row is upload-ready but writes are blocked",
      severity: "high",
      status: "blocked",
      source: "Daily Drafting",
      detail: "Drafted by, checked by, sqft, and billable fields are present but TimeTap PUT is disabled.",
      nextStep: "Use bridge preview for staff approval; keep live TimeTap writes off.",
    },
    {
      id: "tt-exception-service-mismatch",
      title: "TimeTap services disagree with Scheduler product mirror",
      severity: "medium",
      status: "open",
      source: "Scheduler parity",
      detail: "Feature sheet and print values need staff confirmation before invoice or fulfillment.",
      nextStep: "Compare TimeTap fields, Daily Drafting row, and product parity record.",
    },
    {
      id: "tt-exception-vendor-mismatch",
      title: "Vendor/staff assignment needs review",
      severity: "low",
      status: "monitoring",
      source: "TimeTap mirror",
      detail: "The mirror can show staff/provider names before portal vendor assignment is confirmed.",
      nextStep: "Match TimeTap staff to portal vendor profile before dispatch.",
    },
  ]
}
