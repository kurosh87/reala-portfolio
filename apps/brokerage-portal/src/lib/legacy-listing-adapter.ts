import {
  completionLabel,
  formatMoney,
  legacyCockpitSample,
  type LegacyAppointmentSample,
} from "@/lib/legacy-cockpit-data"
import { listingData } from "@/lib/listings-data"

const LEGACY_LISTING_ID_OFFSET = 9000

export function legacyListingId(appointment: Pick<LegacyAppointmentSample, "id">) {
  return LEGACY_LISTING_ID_OFFSET + appointment.id
}

export function isLegacyListingId(id: string | number) {
  return Number(id) >= LEGACY_LISTING_ID_OFFSET
}

export function legacyListingRows() {
  return legacyCockpitSample.samples.appointments.map((appointment) => ({
    id: legacyListingId(appointment),
    header: appointment.legacyId,
    type: "Legacy mirror",
    listing: appointment.listingLabel,
    address: appointment.addressLabel,
    cityLine: `TimeTap ${appointment.legacyId} / ${appointment.date}`,
    mls: appointment.legacyId,
    image: "",
    status: appointment.status,
    dueDate: appointment.date,
    services: Math.max(appointment.totalServices, 1),
    serviceStatus: completionLabel(appointment),
    vendorStatus: appointment.totalServices === appointment.deliveredServices ? "Delivered" : "Needs review",
    billing: appointment.invoice.generated
      ? `${appointment.invoice.paymentStatus} / ${formatMoney(appointment.invoice.amount)}`
      : appointment.invoice.paymentStatus,
    target: "",
    limit: "",
    reviewer: "",
  }))
}

export function combinedListingRows() {
  return [...listingData, ...legacyListingRows()]
}

export function findLegacyAppointmentByListingId(id: string | number) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null
  const appointmentId = numericId - LEGACY_LISTING_ID_OFFSET
  return (
    legacyCockpitSample.samples.appointments.find(
      (appointment) => appointment.id === appointmentId
    ) ?? null
  )
}
