import sample from "@/data/legacy-cockpit-sample.json"

type CountMap = Record<string, number>

export type LegacyService = {
  name: string
  status: string
}

export type LegacyAppointmentSample = {
  id: number
  legacyId: string
  clientLabel: string
  listingLabel: string
  addressLabel: string
  status: string
  date: string
  serviceName: string
  services: LegacyService[]
  deliveredServices: number
  totalServices: number
  invoice: {
    generated: boolean
    amount: number
    paymentStatus: string
    hasStripeReference: boolean
    hasOtherPaymentDetails: boolean
  }
  shareableEnabled: boolean
  hasSubfolder: boolean
}

export type LegacyClientSample = {
  id: number
  legacyId: string
  clientLabel: string
  accountType: string
  industry: string
  brokeragePresent: boolean
  hasStripeReference: boolean
  hasSubfolder: boolean
  hasSubAccounts: boolean
  entitlements: Record<string, boolean>
}

export type LegacyPrintOrderSample = {
  id: number
  legacyId: string
  clientLabel: string
  addressLabel: string
  status: string
  quantity: number
  total: number
  payment: string
  hasTracking: boolean
  hasStripeReference: boolean
  createdAt: string | null
}

export type LegacyFieldEventSample = {
  id: number
  legacyId: string
  title: string
  locationLabel: string
  startDate: string
  endDate: string
  archived: boolean
  archivedWebApp: boolean
}

export type LegacyException = {
  type: string
  severity: "high" | "medium" | "low"
  count: number
  recommendation: string
}

export type LegacyCockpitSample = {
  generatedAt: string
  source: {
    mode: string
    deliverablesDump: string
    fieldtechDump: string
    piiPolicy: string
  }
  counts: {
    clients: number
    appointments: number
    invoices: number
    printProducts: number
    printOrders: number
    fieldTechUsers: number
    fieldTechEvents: number
    fieldTechEntries: number
  }
  serviceFlags: {
    photos: number
    floorPlans: number
    videos: number
    matterport: number
    printedMaterial: number
  }
  appointmentStatusCounts: CountMap
  invoiceStatusCounts: CountMap
  printStatusCounts: CountMap
  samples: {
    appointments: LegacyAppointmentSample[]
    clients: LegacyClientSample[]
    printOrders: LegacyPrintOrderSample[]
    fieldEvents: LegacyFieldEventSample[]
  }
  exceptions: LegacyException[]
}

export const legacyCockpitSample = sample as LegacyCockpitSample

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function topCounts(counts: CountMap, limit = 5) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }))
}

export function completionLabel(appointment: LegacyAppointmentSample) {
  if (appointment.totalServices === 0) return "No services flagged"
  return `${appointment.deliveredServices}/${appointment.totalServices} delivered`
}
