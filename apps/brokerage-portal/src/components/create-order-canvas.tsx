"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BathIcon,
  BedDoubleIcon,
  Building2Icon,
  CalendarDaysIcon,
  CarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  EyeIcon,
  FilterIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PencilIcon,
  ReceiptTextIcon,
  SaveIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  SquareIcon,
  UserRoundIcon,
  WalletCardsIcon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { EventManager, type Event } from "@/components/ui/event-manager"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { BlurFade } from "@/components/ui/blur-fade"
import { submitPortalOrderForReviewAction } from "@/app/actions/portal-intake"
import { getTimeTapAvailabilityEvents } from "@/lib/timetap-parity"

const steps = [
  "Listing",
  "Property Facts",
  "Services",
  "Schedule",
  "Job Instructions",
  "Estimate",
  "Payment / Terms",
  "Review & Submit",
]

const stepIcons = [
  HomeIcon,
  InfoIcon,
  PackageIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  ReceiptTextIcon,
  CreditCardIcon,
  CheckIcon,
] as const

const listings = [
  {
    address: "1238 Homer St",
    area: "Vancouver, BC V6B 2X7",
    mls: "R2865478",
    price: "$2,498,000",
    status: "Active Listing",
    match: "98% match",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=720&q=80",
    beds: "4 Beds",
    baths: "5.5 Baths",
    garage: "2 Car Garage",
    size: "3,240 sq ft",
  },
  {
    address: "456 Oak Avenue",
    area: "Coquitlam, BC V3J 3N2",
    mls: "R2869101",
    price: "$1,185,000",
    status: "Active",
    match: "92% match",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=480&q=80",
    beds: "3 Beds",
    baths: "3 Baths",
    garage: "1 Garage",
    size: "2,180 sq ft",
  },
  {
    address: "789 Pine Drive",
    area: "North Vancouver, BC V7R 1Z4",
    mls: "R2871123",
    price: "$3,175,000",
    status: "Active",
    match: "88% match",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=480&q=80",
    beds: "5 Beds",
    baths: "4.5 Baths",
    garage: "3 Car Garage",
    size: "4,480 sq ft",
  },
  {
    address: "321 Cedar Lane",
    area: "West Vancouver, BC V7T 1B1",
    mls: "R2863305",
    price: "$1,875,000",
    status: "Active",
    match: "82% match",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=480&q=80",
    beds: "4 Beds",
    baths: "3.5 Baths",
    garage: "2 Car Garage",
    size: "2,960 sq ft",
  },
]

type OrderListing = (typeof listings)[number] & {
  listingInventoryId?: string | null
  sourceId?: string | null
  sourceSlug?: string | null
  sourceListingKey?: string | null
  source?: "demo" | "mls_supabase"
  publicUrl?: string | null
  title?: string | null
  priceValue?: number | null
  currency?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  propertyType?: string | null
  livingAreaDisplay?: string | null
  neighborhood?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
  mediaCount?: number
  primaryMediaUrl?: string | null
  lastImportedAt?: string | null
}

type MlsLookupMatch = {
  listingInventoryId: string
  sourceId: string | null
  sourceSlug: string | null
  sourceListingKey: string | null
  mls: string | null
  address: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  publicUrl: string | null
  listingStatus: string | null
  title: string | null
  description: string | null
  priceDisplay: string | null
  priceValue: number | null
  currency: string | null
  bedrooms: number | null
  bathrooms: number | null
  propertyType: string | null
  livingAreaDisplay: string | null
  neighborhood: string | null
  latitude: number | null
  longitude: number | null
  mediaCount: number
  primaryMediaUrl: string | null
  firstSeenAt: string | null
  lastSeenAt: string | null
  lastImportedAt: string | null
  matchedOn: "mls" | "address" | "query"
  source: "mls_supabase"
}

type MlsLookupResponse = {
  configured: boolean
  query: string
  matches: MlsLookupMatch[]
  error?: string
}

type ListingFactDraft = {
  address: string
  area: string
  mlsNumber: string
  unitType: string
  unitNumber: string
  publicUrl: string
  title: string
  priceDisplay: string
  priceValue: string
  currency: string
  bedrooms: string
  bathrooms: string
  propertyType: string
  livingArea: string
  nonLivableArea: string
  neighborhood: string
  latitude: string
  longitude: string
  description: string
  verifyNotes: string
}

type ServiceDetailDraft = {
  floorplanType: string
  simplifiedMatterport: string
  levels3d: string
  matterportType: string
  matterportVirtualStaging: string
  matterportPhotoEmbedding: string
  photographyType: string
  photoCount: string
  dronePhotos: string
  drone360: string
  virtualStagingPhotoCount: string
  dayToTwilight: string
  image360Tour: string
  videographyType: string
  videographyLength: string
  videoDrone: string
  videoSocial: string
  videoNarration: string
  videoMap3d: string
  printedMaterialNotes: string
}

type JobInstructionDraft = {
  lockboxOnSite: string
  lockboxLocation: string
  accessCode: string
  callOnArrival: string
  contactName: string
  contactPhone: string
  occupancyStatus: string
  petsOnSite: string
  alarmSecurity: string
  parkingNotes: string
  requiredPhotoCount: string
  twilightRequested: string
  mustCaptureRooms: string
  stagingNotes: string
  photoNotes: string
  squareFootageSource: string
  measurementNotes: string
  restrictedAreas: string
  matterportNotes: string
  featureSheetNotes: string
}

type OrderReadinessWarning = {
  category: string
  label: string
  detail: string
  severity: "blocking" | "review" | "info"
}

const defaultServiceDetails: ServiceDetailDraft = {
  floorplanType: "standard",
  simplifiedMatterport: "false",
  levels3d: "0",
  matterportType: "standard",
  matterportVirtualStaging: "false",
  matterportPhotoEmbedding: "0",
  photographyType: "standard",
  photoCount: "25",
  dronePhotos: "0",
  drone360: "0",
  virtualStagingPhotoCount: "0",
  dayToTwilight: "0",
  image360Tour: "0",
  videographyType: "standard",
  videographyLength: "60",
  videoDrone: "false",
  videoSocial: "false",
  videoNarration: "false",
  videoMap3d: "false",
  printedMaterialNotes: "",
}

const defaultJobInstructions: JobInstructionDraft = {
  lockboxOnSite: "yes",
  lockboxLocation: "Front door, left side",
  accessCode: "",
  callOnArrival: "yes",
  contactName: "",
  contactPhone: "",
  occupancyStatus: "vacant",
  petsOnSite: "no",
  alarmSecurity: "no_alarm",
  parkingNotes: "",
  requiredPhotoCount: "25",
  twilightRequested: "yes",
  mustCaptureRooms: "Kitchen, Living room, Primary bedroom, Bathrooms, Exterior",
  stagingNotes: "partially_staged",
  photoNotes: "Capture street view and neighbourhood context.",
  squareFootageSource: "mls",
  measurementNotes: "Include detached structures only if requested by Reala staff.",
  restrictedAreas: "",
  matterportNotes: "",
  featureSheetNotes: "",
}

const serviceKeywordGroups = {
  floorPlan: ["floor plan"],
  matterport: ["matterport"],
  photography: ["photography", "drone"],
  video: ["video", "social launch"],
  featureSheetPrint: ["feature sheet", "print"],
  virtualStaging: ["virtual staging"],
} as const

function buildListingFactDraft(listing: OrderListing): ListingFactDraft {
  return {
    address: listing.address,
    area: listing.area,
    mlsNumber: listing.mls,
    unitType: "none",
    unitNumber: "",
    publicUrl: listing.publicUrl ?? "",
    title: listing.title ?? "",
    priceDisplay: listing.price || "",
    priceValue: listing.priceValue ? String(listing.priceValue) : "",
    currency: listing.currency ?? "",
    bedrooms: listing.bedrooms ? String(listing.bedrooms) : extractNumberLabel(listing.beds),
    bathrooms: listing.bathrooms ? String(listing.bathrooms) : extractNumberLabel(listing.baths),
    propertyType: listing.propertyType ?? "",
    livingArea: listing.livingAreaDisplay || listing.size || "",
    nonLivableArea: "",
    neighborhood: listing.neighborhood ?? "",
    latitude: listing.latitude ? String(listing.latitude) : "",
    longitude: listing.longitude ? String(listing.longitude) : "",
    description: listing.description ?? "",
    verifyNotes: "",
  }
}

function extractNumberLabel(value: string) {
  const match = value.match(/[\d.]+/)
  return match?.[0] ?? ""
}


function mlsMatchToOrderListing(match: MlsLookupMatch): OrderListing {
  return {
    address: match.address || "MLS listing",
    area: [match.city, match.region, match.postalCode]
      .filter(Boolean)
      .join(", "),
    mls: match.mls || match.sourceListingKey || "MLS pending",
    price: match.priceDisplay || "Price pending",
    title: match.title,
    priceValue: match.priceValue,
    currency: match.currency,
    bedrooms: match.bedrooms,
    bathrooms: match.bathrooms,
    status: match.listingStatus || "MLS match",
    match:
      match.matchedOn === "mls"
        ? "MLS exact match"
        : match.matchedOn === "address"
          ? "Address match"
          : "MLS query match",
    image:
      match.primaryMediaUrl ||
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=720&q=80",
    beds:
      typeof match.bedrooms === "number"
        ? `${match.bedrooms} Beds`
        : "Beds pending",
    baths:
      typeof match.bathrooms === "number"
        ? `${match.bathrooms} Baths`
        : "Baths pending",
    garage: "Parking pending",
    size: match.livingAreaDisplay || "Sq ft pending",
    listingInventoryId: match.listingInventoryId,
    sourceId: match.sourceId,
    sourceSlug: match.sourceSlug,
    sourceListingKey: match.sourceListingKey,
    source: "mls_supabase",
    publicUrl: match.publicUrl,
    propertyType: match.propertyType,
    livingAreaDisplay: match.livingAreaDisplay,
    neighborhood: match.neighborhood,
    latitude: match.latitude,
    longitude: match.longitude,
    description: match.description,
    mediaCount: match.mediaCount,
    primaryMediaUrl: match.primaryMediaUrl,
    lastImportedAt: match.lastImportedAt,
  }
}


const serviceCatalog = [
  {
    name: "Photography Package",
    detail: "25 photos + twilight",
    price: "$245.00",
    icon: CameraGlyph,
    category: "media",
    turnaround: "Next-day edits",
    tag: "Most booked",
  },
  {
    name: "Floor Plan (Premium)",
    detail: "2D + dimensions",
    price: "$85.00",
    icon: FileTextIcon,
    category: "floor plans",
    turnaround: "24 hr delivery",
    tag: "Add-on",
  },
  {
    name: "Matterport 3D Tour",
    detail: "Full property",
    price: "$175.00",
    icon: PackageIcon,
    category: "media",
    turnaround: "48 hr delivery",
    tag: "Premium",
  },
  {
    name: "Feature Sheet (Premium)",
    detail: "Branded, 4 pages",
    price: "$69.00",
    icon: FileTextIcon,
    category: "marketing",
    turnaround: "Draft same day",
    tag: "Selected",
  },
  {
    name: "Virtual Staging (6 images)",
    detail: "Contemporary Light",
    price: "$180.00",
    icon: HomeIcon,
    category: "editing",
    turnaround: "2 business days",
    tag: "Popular",
  },
  {
    name: "Single Property Website",
    detail: "Branded landing page",
    price: "$595.00",
    icon: ExternalLinkIcon,
    category: "web",
    turnaround: "3 business days",
    tag: "Launch",
  },
  {
    name: "Drone Exterior Add-on",
    detail: "Aerial stills for lot and neighbourhood",
    price: "$220.00",
    icon: EyeIcon,
    category: "media",
    turnaround: "Weather dependent",
    tag: "Outdoor",
  },
  {
    name: "Social Launch Kit",
    detail: "Instagram carousel, story cuts, and captions",
    price: "$145.00",
    icon: SparklesIcon,
    category: "marketing",
    turnaround: "Next-day draft",
    tag: "Campaign",
  },
] as const

const defaultSelectedServiceNames = [
  "Photography Package",
  "Floor Plan (Premium)",
  "Matterport 3D Tour",
  "Feature Sheet (Premium)",
  "Virtual Staging (6 images)",
]

type SelectedService = Pick<
  (typeof serviceCatalog)[number],
  "name" | "detail" | "price" | "icon"
>

const orderIntakeDefaults = {
  brokerageName: "North Star Realty",
  requesterName: "Sarah Johnson",
  requesterEmail: "sarah@northstarrealty.com",
  requesterRole: "Brokerage Admin",
  requestedDate: "2026-05-14",
  requestedWindow: "9:00 AM - 12:00 PM",
  paymentMode: "Card Authorization Hold - staff review only",
  specialInstructions:
    "Front door, side gate, call on arrival. Do not move items. Close windows and lock up after visit.",
}

const scheduleEvents: Event[] = getTimeTapAvailabilityEvents()

function getSelectedServices(serviceNames: string[]): SelectedService[] {
  const selected = new Set(serviceNames)

  return serviceCatalog
    .filter((service) => selected.has(service.name))
    .map(({ name, detail, price, icon }) => ({ name, detail, price, icon }))
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100)
}

function priceToCents(price: string) {
  const amount = Number.parseFloat(price.replace(/[^\d.-]/g, ""))

  if (!Number.isFinite(amount)) return 0

  return Math.round(amount * 100)
}

function buildEstimateLines(services: SelectedService[]) {
  const subtotalCents = services.reduce(
    (total, service) => total + priceToCents(service.price),
    0
  )
  const discountCents = Math.round(subtotalCents * 0.1)
  const taxableCents = Math.max(subtotalCents - discountCents, 0)
  const taxCents = Math.round(taxableCents * 0.0825)
  const creditsCents = services.length ? Math.min(25000, taxableCents) : 0
  const totalCents = Math.max(taxableCents + taxCents - creditsCents, 0)

  return {
    subtotal: formatCurrency(subtotalCents),
    discount: `-${formatCurrency(discountCents)}`,
    taxes: formatCurrency(taxCents),
    credits: `-${formatCurrency(creditsCents)}`,
    total: formatCurrency(totalCents),
  }
}

export function CreateOrderCanvas() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [activeListingIndex, setActiveListingIndex] = React.useState(0)
  const [mlsLookupListing, setMlsLookupListing] =
    React.useState<OrderListing | null>(null)
  const [selectedServiceNames, setSelectedServiceNames] = React.useState(
    defaultSelectedServiceNames
  )
  const [requestedDate, setRequestedDate] = React.useState(
    orderIntakeDefaults.requestedDate
  )
  const [requestedWindow, setRequestedWindow] = React.useState(
    orderIntakeDefaults.requestedWindow
  )
  const [staffPreference, setStaffPreference] = React.useState(
    "Lead Photographer"
  )
  const [paymentMode, setPaymentMode] = React.useState(
    orderIntakeDefaults.paymentMode
  )
  const [specialInstructions, setSpecialInstructions] = React.useState(
    orderIntakeDefaults.specialInstructions
  )
  const [serviceDetails, setServiceDetails] =
    React.useState<ServiceDetailDraft>(defaultServiceDetails)
  const [jobInstructions, setJobInstructions] =
    React.useState<JobInstructionDraft>(defaultJobInstructions)
  const activeListing: OrderListing = mlsLookupListing ?? listings[activeListingIndex]
  const [listingFacts, setListingFacts] = React.useState<ListingFactDraft>(() =>
    buildListingFactDraft(activeListing)
  )

  const selectedOrderServices = React.useMemo(
    () => getSelectedServices(selectedServiceNames),
    [selectedServiceNames]
  )
  const estimate = React.useMemo(
    () => buildEstimateLines(selectedOrderServices),
    [selectedOrderServices]
  )
  const selectedServicesPayload = React.useMemo(
    () =>
      selectedOrderServices.map((service) => ({
        name: service.name,
        detail: service.detail,
        price: service.price,
      })),
    [selectedOrderServices]
  )
  const readinessWarnings = React.useMemo(
    () =>
      buildOrderReadinessWarnings({
        listingFacts,
        serviceDetails,
        jobInstructions,
        selectedServiceNames,
        requestedDate,
        requestedWindow,
        paymentMode,
      }),
    [
      listingFacts,
      serviceDetails,
      jobInstructions,
      selectedServiceNames,
      requestedDate,
      requestedWindow,
      paymentMode,
    ]
  )
  const toggleService = React.useCallback((serviceName: string) => {
    setSelectedServiceNames((current) =>
      current.includes(serviceName)
        ? current.filter((name) => name !== serviceName)
        : [...current, serviceName]
    )
  }, [])
  const stepContent = getStepContent({
    currentStep,
    activeListing,
    activeListingIndex,
    listingFacts,
    serviceDetails,
    jobInstructions,
    readinessWarnings,
    selectedServiceNames,
    selectedServices: selectedOrderServices,
    estimate,
    requestedDate,
    requestedWindow,
    staffPreference,
    paymentMode,
    specialInstructions,
    onStepChange: setCurrentStep,
    onListingSelect: (index) => {
      const listing = listings[index]
      setMlsLookupListing(null)
      setActiveListingIndex(index)
      setListingFacts(buildListingFactDraft(listing))
    },
    onMlsListingSelect: (listing) => {
      setMlsLookupListing(listing)
      setListingFacts(buildListingFactDraft(listing))
      setCurrentStep(1)
    },
    onListingFactChange: (key, value) => {
      setListingFacts((current) => ({ ...current, [key]: value }))
    },
    onServiceDetailChange: (key, value) => {
      setServiceDetails((current) => ({ ...current, [key]: value }))
    },
    onJobInstructionChange: (key, value) => {
      setJobInstructions((current) => ({ ...current, [key]: value }))
    },
    onToggleService: toggleService,
    onRequestedDateChange: setRequestedDate,
    onRequestedWindowChange: setRequestedWindow,
    onStaffPreferenceChange: setStaffPreference,
    onPaymentModeChange: setPaymentMode,
    onSpecialInstructionsChange: setSpecialInstructions,
  })

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden bg-background">
      <main className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <BlurFade>
          <PageHeader currentStep={currentStep} />
        </BlurFade>
        <BlurFade
          delay={0.05}
          className="sticky top-[calc(var(--header-height)+0.75rem)] z-10"
        >
          <OrderStepper currentStep={currentStep} onStepChange={setCurrentStep} />
        </BlurFade>

        <BlurFade
          key={currentStep}
          delay={0.1}
          className="grid min-w-0 max-w-full gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div className="min-w-0">{stepContent}</div>
          <OrderSummary
            currentStep={currentStep}
            listing={currentStep === 0 ? null : activeListing}
            selectedServices={selectedOrderServices}
            estimate={estimate}
            requestedDate={requestedDate}
            requestedWindow={requestedWindow}
            staffPreference={staffPreference}
            paymentMode={paymentMode}
          />
        </BlurFade>

        <div className="grid gap-3 border-t pt-4 sm:grid-cols-[180px_1fr_minmax(220px,280px)]">
          <Button
            variant="outline"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Back
          </Button>
          <div className="hidden sm:block" />
          {currentStep === steps.length - 1 ? (
            <form action={submitPortalOrderForReviewAction}>
              <input type="hidden" name="listingAddress" value={listingFacts.address} />
              <input type="hidden" name="listingArea" value={listingFacts.area} />
              <input type="hidden" name="mlsNumber" value={listingFacts.mlsNumber} />
              <input type="hidden" name="listingSource" value={activeListing.source ?? "demo"} />
              <input type="hidden" name="listingPublicUrl" value={listingFacts.publicUrl} />
              <input type="hidden" name="listingTitle" value={listingFacts.title} />
              <input type="hidden" name="listingPriceDisplay" value={listingFacts.priceDisplay} />
              <input type="hidden" name="listingPriceValue" value={listingFacts.priceValue} />
              <input type="hidden" name="listingCurrency" value={listingFacts.currency} />
              <input type="hidden" name="listingBedrooms" value={listingFacts.bedrooms} />
              <input type="hidden" name="listingBathrooms" value={listingFacts.bathrooms} />
              <input type="hidden" name="listingPropertyType" value={listingFacts.propertyType} />
              <input type="hidden" name="listingLivingArea" value={listingFacts.livingArea} />
              <input type="hidden" name="listingNonLivableArea" value={listingFacts.nonLivableArea} />
              <input type="hidden" name="listingNeighborhood" value={listingFacts.neighborhood} />
              <input type="hidden" name="listingLatitude" value={listingFacts.latitude} />
              <input type="hidden" name="listingLongitude" value={listingFacts.longitude} />
              <input type="hidden" name="listingDescription" value={listingFacts.description} />
              <input type="hidden" name="listingUnitType" value={listingFacts.unitType} />
              <input type="hidden" name="listingUnitNumber" value={listingFacts.unitNumber} />
              <input type="hidden" name="listingVerifyNotes" value={listingFacts.verifyNotes} />
              <input
                type="hidden"
                name="mlsListingInventoryId"
                value={activeListing.listingInventoryId ?? ""}
              />
              <input
                type="hidden"
                name="mlsSourceId"
                value={activeListing.sourceId ?? ""}
              />
              <input
                type="hidden"
                name="mlsSourceSlug"
                value={activeListing.sourceSlug ?? ""}
              />
              <input
                type="hidden"
                name="mlsSourceListingKey"
                value={activeListing.sourceListingKey ?? ""}
              />
              <input
                type="hidden"
                name="brokerageName"
                value={orderIntakeDefaults.brokerageName}
              />
              <input
                type="hidden"
                name="requesterName"
                value={orderIntakeDefaults.requesterName}
              />
              <input
                type="hidden"
                name="requesterEmail"
                value={orderIntakeDefaults.requesterEmail}
              />
              <input
                type="hidden"
                name="requesterRole"
                value={orderIntakeDefaults.requesterRole}
              />
              <input
                type="hidden"
                name="servicesJson"
                value={JSON.stringify(selectedServicesPayload)}
              />
              <input
                type="hidden"
                name="serviceDetailsJson"
                value={JSON.stringify(serviceDetails)}
              />
              <input
                type="hidden"
                name="jobInstructionsJson"
                value={JSON.stringify(jobInstructions)}
              />
              <input
                type="hidden"
                name="readinessWarningsJson"
                value={JSON.stringify(readinessWarnings)}
              />
              <input
                type="hidden"
                name="estimateTotal"
                value={estimate.total}
              />
              <input
                type="hidden"
                name="estimateSubtotal"
                value={estimate.subtotal}
              />
              <input
                type="hidden"
                name="requestedDate"
                value={requestedDate}
              />
              <input
                type="hidden"
                name="requestedWindow"
                value={requestedWindow}
              />
              <input
                type="hidden"
                name="staffPreference"
                value={staffPreference}
              />
              <input
                type="hidden"
                name="paymentMode"
                value={paymentMode}
              />
              <input
                type="hidden"
                name="specialInstructions"
                value={specialInstructions}
              />
              <Button
                type="submit"
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Submit for Reala review
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </form>
          ) : (
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
            >
              Next: {steps[Math.min(currentStep + 1, steps.length - 1)]}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

type OrderDraftState = {
  currentStep: number
  activeListing: OrderListing
  activeListingIndex: number
  listingFacts: ListingFactDraft
  serviceDetails: ServiceDetailDraft
  jobInstructions: JobInstructionDraft
  readinessWarnings: OrderReadinessWarning[]
  selectedServiceNames: string[]
  selectedServices: SelectedService[]
  estimate: ReturnType<typeof buildEstimateLines>
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  paymentMode: string
  specialInstructions: string
  onStepChange: React.Dispatch<React.SetStateAction<number>>
  onListingSelect: (index: number) => void
  onMlsListingSelect: (listing: OrderListing) => void
  onListingFactChange: (key: keyof ListingFactDraft, value: string) => void
  onServiceDetailChange: (key: keyof ServiceDetailDraft, value: string) => void
  onJobInstructionChange: (key: keyof JobInstructionDraft, value: string) => void
  onToggleService: (serviceName: string) => void
  onRequestedDateChange: (date: string) => void
  onRequestedWindowChange: (window: string) => void
  onStaffPreferenceChange: (staff: string) => void
  onPaymentModeChange: (paymentMode: string) => void
  onSpecialInstructionsChange: (instructions: string) => void
}

function getStepContent(draft: OrderDraftState) {
  switch (draft.currentStep) {
    case 0:
      return (
        <ListingSearchPanel
          activeListingIndex={draft.activeListingIndex}
          onSelectListing={(index) => {
            draft.onListingSelect(index)
            draft.onStepChange(1)
          }}
          onSelectMlsListing={draft.onMlsListingSelect}
        />
      )
    case 1:
      return (
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <PropertyFactsPanel
            listing={draft.activeListing}
            facts={draft.listingFacts}
            onFactChange={draft.onListingFactChange}
          />
          <PropertyConfidence
            listing={draft.activeListing}
            facts={draft.listingFacts}
          />
        </div>
      )
    case 2:
      return (
        <ServicesStep
          selectedServiceNames={draft.selectedServiceNames}
          serviceDetails={draft.serviceDetails}
          onToggleService={draft.onToggleService}
          onServiceDetailChange={draft.onServiceDetailChange}
        />
      )
    case 3:
      return (
        <ScheduleStep
          requestedDate={draft.requestedDate}
          requestedWindow={draft.requestedWindow}
          staffPreference={draft.staffPreference}
          onRequestedDateChange={draft.onRequestedDateChange}
          onRequestedWindowChange={draft.onRequestedWindowChange}
          onStaffPreferenceChange={draft.onStaffPreferenceChange}
        />
      )
    case 4:
      return (
        <JobInstructionsStep
          jobInstructions={draft.jobInstructions}
          onJobInstructionChange={draft.onJobInstructionChange}
          specialInstructions={draft.specialInstructions}
          onSpecialInstructionsChange={draft.onSpecialInstructionsChange}
        />
      )
    case 5:
      return (
        <EstimateStep
          selectedServices={draft.selectedServices}
          estimate={draft.estimate}
        />
      )
    case 6:
      return (
        <PaymentTermsStep
          paymentMode={draft.paymentMode}
          estimate={draft.estimate}
          onPaymentModeChange={draft.onPaymentModeChange}
        />
      )
    default:
      return (
        <ReviewSubmitStep
          listing={draft.activeListing}
          listingFacts={draft.listingFacts}
          serviceDetails={draft.serviceDetails}
          jobInstructions={draft.jobInstructions}
          readinessWarnings={draft.readinessWarnings}
          selectedServices={draft.selectedServices}
          estimate={draft.estimate}
          requestedDate={draft.requestedDate}
          requestedWindow={draft.requestedWindow}
          staffPreference={draft.staffPreference}
          paymentMode={draft.paymentMode}
          onEdit={draft.onStepChange}
        />
      )
  }
}

function PageHeader({ currentStep }: { currentStep: number }) {
  const descriptions = [
    "Select or create a listing for this order.",
    "Confirm property details before services are booked.",
    "Choose the deliverables and package for this listing.",
    "Choose a preferred date and window for Reala ops review.",
    "Configure vendor access, photo requirements, and special notes.",
    "Review the running estimate before payment terms.",
    "Select payment method or billing terms.",
    "Confirm all order details before submission.",
  ]

  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create New Order
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Step {currentStep + 1} of 8: {descriptions[currentStep]}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline">
          <SaveIcon data-icon="inline-start" />
          Save draft
        </Button>
        <Button nativeButton={false} variant="outline" size="icon" render={<Link href="/orders" />}>
          <XIcon />
          <span className="sr-only">Close order flow</span>
        </Button>
      </div>
    </div>
  )
}

function OrderStepper({
  currentStep,
  onStepChange,
}: {
  currentStep: number
  onStepChange: (step: number) => void
}) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border bg-card/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <Tabs
        value={String(currentStep)}
        onValueChange={(value) => onStepChange(Number(value))}
        className="min-w-[1040px]"
      >
        <TabsList className="grid h-auto w-full grid-cols-8 gap-1 bg-transparent p-0">
          {steps.map((step, index) => {
            const Icon = stepIcons[index]
            const isActive = index === currentStep
            const isComplete = index < currentStep

            return (
              <TabsTrigger
                key={step}
                value={String(index)}
                className={cn(
                  "h-11 min-w-0 justify-start gap-2 px-3 text-left",
                  "data-active:bg-background data-active:shadow-sm",
                  isComplete && "text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium",
                    isActive && "border-destructive bg-destructive text-destructive-foreground",
                    isComplete && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {isComplete ? <CheckIcon /> : <Icon />}
                </span>
                <span className="min-w-0 truncate">
                  {step}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}

function ListingSearchPanel({
  activeListingIndex,
  onSelectListing,
  onSelectMlsListing,
}: {
  activeListingIndex: number
  onSelectListing: (index: number) => void
  onSelectMlsListing: (listing: OrderListing) => void
}) {
  const [query, setQuery] = React.useState("R2865478")
  const [lookup, setLookup] = React.useState<MlsLookupResponse | null>(null)
  const [lookupLoading, setLookupLoading] = React.useState(false)
  const queryReady = query.trim().length >= 3
  const visibleLookup = queryReady ? lookup : null

  React.useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 3) {
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setLookupLoading(true)

      try {
        const response = await fetch(
          `/api/mls/search?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`MLS lookup failed with ${response.status}`)
        }

        setLookup((await response.json()) as MlsLookupResponse)
      } catch (error) {
        if (!controller.signal.aborted) {
          setLookup({
            configured: true,
            query: trimmed,
            matches: [],
            error:
              error instanceof Error
                ? error.message
                : "MLS lookup failed",
          })
        }
      } finally {
        if (!controller.signal.aborted) {
          setLookupLoading(false)
        }
      }
    }, 250)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  return (
    <Card className="min-w-0 max-w-full py-0">
      <CardHeader className="border-b py-4">
        <Tabs defaultValue="search-mls" className="min-w-0">
          <TabsList variant="line" className="h-10 max-w-full gap-6 overflow-x-auto">
            <TabsTrigger value="search-mls">Search MLS</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_112px]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 pl-9"
              placeholder="Search by address, MLS ID, or client name"
            />
          </div>
          <Button variant="outline">
            <FilterIcon data-icon="inline-start" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">Search Results</h2>
            <Badge variant="secondary">
              {visibleLookup?.configured
                ? `${visibleLookup.matches.length || listings.length} matches`
                : `${listings.length} demo matches`}
            </Badge>
          </div>
          <Button variant="ghost">
            Sort by: Best match
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        </div>

        <MlsLookupPanel
          lookup={visibleLookup}
          loading={queryReady && lookupLoading}
          onSelectMatch={(match) => onSelectMlsListing(mlsMatchToOrderListing(match))}
        />

        <BlurFade delay={0.04} inView>
          <FeaturedListingCard
            listing={listings[0]}
            selected={activeListingIndex === 0}
            onContinue={() => onSelectListing(0)}
          />
        </BlurFade>

        <div className="overflow-hidden rounded-lg border bg-card">
          {listings.slice(1).map((listing, index) => {
            const listingIndex = index + 1
            const selected = activeListingIndex === listingIndex

            return (
            <BlurFade key={listing.address} delay={0.05 + index * 0.035} inView>
              <button
                type="button"
                onClick={() => onSelectListing(listingIndex)}
                className={cn(
                  "grid w-full min-w-0 gap-3 border-b p-3 text-left transition last:border-b-0 hover:bg-muted/35 active:translate-y-px sm:grid-cols-[112px_minmax(0,1fr)_auto]",
                  selected && "bg-red-50/45"
                )}
              >
                <div
                  className="aspect-[4/3] rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${listing.image})` }}
                />
                <div className="min-w-0 self-center">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <div className="truncate text-base font-medium">{listing.address}</div>
                    <Badge variant="secondary">{listing.match}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{listing.area}</div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>MLS® {listing.mls}</span>
                    <span>{listing.status}</span>
                  </div>
                </div>
                <span className="flex size-9 items-center justify-center self-center rounded-md border">
                  {selected ? <CheckIcon /> : <ChevronDownIcon />}
                </span>
              </button>
            </BlurFade>
            )
          })}
        </div>

        <BlurFade delay={0.12} inView>
          <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <span className="flex size-10 items-center justify-center rounded-full border">
              <SlidersHorizontalIcon />
            </span>
            <div>
              <div className="font-medium">Can&apos;t find the right listing?</div>
              <p className="text-sm text-muted-foreground">
                Create a new listing manually.
              </p>
            </div>
            <Button variant="outline">Create New Listing</Button>
          </div>
        </BlurFade>
      </CardContent>
    </Card>
  )
}

function FeaturedListingCard({
  listing,
  selected,
  onContinue,
}: {
  listing: (typeof listings)[number]
  selected: boolean
  onContinue: () => void
}) {
  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(220px,0.72fr)_minmax(0,1fr)]">
          <div className="relative min-h-64 bg-cover bg-center xl:min-h-full" style={{ backgroundImage: `url(${listing.image})` }}>
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
              <Badge className="bg-destructive text-destructive-foreground">Top Match</Badge>
              <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                {listing.match}
              </Badge>
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold">{listing.address}</h3>
                <p className="text-muted-foreground">{listing.area}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>MLS® {listing.mls}</span>
                  <span>Listed Apr 28, 2026</span>
                  <span>MLS Feed</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <ChevronDownIcon />
                  <span className="sr-only">Expand listing details</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b p-4 text-sm text-muted-foreground md:grid-cols-5">
              <ListingMeta icon={HomeIcon} value="Single Family" />
              <ListingMeta icon={SquareIcon} value={listing.size} />
              <ListingMeta icon={BedDoubleIcon} value={listing.beds} />
              <ListingMeta icon={BathIcon} value={listing.baths} />
              <ListingMeta icon={CarIcon} value={listing.garage} />
            </div>

            <div className="grid gap-0 divide-y text-sm md:grid-cols-2">
              <SummaryBlock
                title="Listing Summary"
                lines={["Neighbourhood: Yaletown", "Lot Size: 5,100 sq ft", "Year Built: 2018", "Source: MLS® Feed"]}
              />
              <SummaryBlock
                title="Last Sync"
                lines={["May 10, 2026", "9:32 AM", "Next sync", "In 2 hours"]}
              />
              <SummaryBlock
                title="Agent / Team"
                lines={["Jamie Smith", "The Smith Group", "jamie@smithgroup.com", "214.555.0198"]}
              />
              <SummaryBlock
                title="Listing Assets"
                lines={["43 Photos", "2D Floor Plan", "Matterport Tour", "Feature Sheet (Draft)"]}
              />
            </div>

            <div className="flex flex-col gap-2 border-t p-4 sm:flex-row">
              <Button className="sm:w-56" onClick={onContinue}>
                {selected ? "Selected Listing" : "Select This Listing"}
              </Button>
              <Button variant="outline" className="sm:w-36">
                View Listing
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MlsLookupPanel({
  lookup,
  loading,
  onSelectMatch,
}: {
  lookup: MlsLookupResponse | null
  loading: boolean
  onSelectMatch: (match: MlsLookupMatch) => void
}) {
  if (loading) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/45 p-3 text-sm text-blue-900">
        Searching read-only MLS Supabase...
      </div>
    )
  }

  if (!lookup) {
    return (
      <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
        MLS lookup is preserved here for the post-MVP path. Search by address or
        MLS number to query the read-only MLS adapter when configured.
      </div>
    )
  }

  if (!lookup.configured) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm text-amber-900">
        MLS Supabase adapter is wired but not configured locally yet. Add
        server-only `MLS_SUPABASE_URL` and `MLS_SUPABASE_SERVICE_ROLE_KEY` to
        enable live lookup. The demo listings below remain available for MVP
        order flow work.
      </div>
    )
  }

  if (lookup.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 text-sm text-red-900">
        MLS lookup returned an adapter error: {lookup.error}
      </div>
    )
  }

  if (!lookup.matches.length) {
    return (
      <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
        No MLS Supabase matches for “{lookup.query}”. Use a demo listing below
        or create the listing manually.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-blue-200 bg-blue-50/35">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-background/80 px-3 py-2">
        <div className="text-sm font-medium">Live MLS Supabase matches</div>
        <Badge variant="secondary">{lookup.matches.length} found</Badge>
      </div>
      <div className="grid divide-y">
        {lookup.matches.map((match) => (
          <button
            key={match.listingInventoryId}
            type="button"
            onClick={() => onSelectMatch(match)}
            className="grid gap-3 p-3 text-left transition hover:bg-background/70 active:translate-y-px md:grid-cols-[88px_minmax(0,1fr)_auto]"
          >
            <div
              className="min-h-20 rounded-md bg-muted bg-cover bg-center"
              style={{
                backgroundImage: match.primaryMediaUrl
                  ? `url(${match.primaryMediaUrl})`
                  : undefined,
              }}
            >
              {!match.primaryMediaUrl ? (
                <div className="flex h-full min-h-20 items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium">
                {match.address || "Unnamed MLS listing"}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>MLS {match.mls || match.sourceListingKey || "unknown"}</span>
                <span>{[match.city, match.region].filter(Boolean).join(", ")}</span>
                <span>{match.priceDisplay || "Price unavailable"}</span>
                <span>Matched on {match.matchedOn}</span>
                <span>
                  {match.mediaCount
                    ? `${match.mediaCount} MLS photos found`
                    : "No MLS photos found"}
                </span>
              </div>
              {match.mediaCount ? (
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/70 px-2 py-1 text-xs text-amber-900">
                  Thumbnail preview only. Order details come from MLS facts,
                  not MLS media reuse.
                </div>
              ) : null}
            </div>
            <Badge variant="outline">
              {match.lastImportedAt
                ? `Imported ${new Date(match.lastImportedAt).toLocaleDateString()}`
                : "Import date unknown"}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}

function PropertyFactsPanel({
  listing,
  facts,
  onFactChange,
}: {
  listing: OrderListing
  facts: ListingFactDraft
  onFactChange: (key: keyof ListingFactDraft, value: string) => void
}) {
  const update = (key: keyof ListingFactDraft) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFactChange(key, event.target.value)
    }

  const mlsPrefillRows = [
    ["Address", facts.address || "Needs manual entry", facts.address ? "MLS" : "Manual"],
    ["Living area", facts.livingArea || "Needs manual entry", facts.livingArea ? "MLS" : "Manual"],
    ["Property type", facts.propertyType || "Needs manual entry", facts.propertyType ? "MLS" : "Manual"],
    ["Neighborhood", facts.neighborhood || "Needs manual entry", facts.neighborhood ? "MLS" : "Manual"],
  ]

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex flex-wrap items-center gap-2">
            Confirm Listing Facts
            <Badge variant="secondary">{listing.source === "mls_supabase" ? "MLS prefilled" : "Manual draft"}</Badge>
          </CardTitle>
          <CardDescription className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex min-w-0 flex-wrap items-center gap-2 text-lg text-foreground">
              <MapPinIcon />
              {facts.address || listing.address}
              <span className="text-sm text-muted-foreground">{facts.area}</span>
            </span>
            {facts.publicUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  window.open(facts.publicUrl, "_blank", "noopener,noreferrer")
                }
              >
                View listing
                <ExternalLinkIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button variant="outline" disabled>
                No listing URL
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-sm text-blue-950">
              MLS is used to prefill listing facts only. The realtor still confirms non-livable area, unit/access details, service options, and scheduling before anything reaches legacy ops.
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="listing-address">Listing address</FieldLabel>
                <Input id="listing-address" value={facts.address} onChange={update("address")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="listing-area">City / province / postal</FieldLabel>
                <Input id="listing-area" value={facts.area} onChange={update("area")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="listing-mls">MLS number</FieldLabel>
                <Input id="listing-mls" value={facts.mlsNumber} onChange={update("mlsNumber")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="unit-type">Unit / suite type</FieldLabel>
                <Select
                  value={facts.unitType}
                  onValueChange={(value) => onFactChange("unitType", value ?? "none")}
                >
                  <SelectTrigger id="unit-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">No unit</SelectItem>
                      <SelectItem value="unit">Unit</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="ph">Penthouse</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="unit-number">Unit / suite number</FieldLabel>
                <Input
                  id="unit-number"
                  value={facts.unitNumber}
                  onChange={update("unitNumber")}
                  placeholder="Optional"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="living-area">Living area / sqft</FieldLabel>
                <Input
                  id="living-area"
                  value={facts.livingArea}
                  onChange={update("livingArea")}
                  placeholder="e.g. 1338 Sqft"
                />
                <FieldDescription>Prefilled from MLS when available. Used as the starting point for Reala pricing.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="non-livable-area">Non-livable sqft</FieldLabel>
                <Input
                  id="non-livable-area"
                  value={facts.nonLivableArea}
                  onChange={update("nonLivableArea")}
                  placeholder="Garage, storage, patios, unfinished areas"
                />
                <FieldDescription>MLS often does not supply this. Realtor/admin confirmation is required.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                <Input id="bedrooms" value={facts.bedrooms} onChange={update("bedrooms")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                <Input id="bathrooms" value={facts.bathrooms} onChange={update("bathrooms")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="property-type">Property type</FieldLabel>
                <Input id="property-type" value={facts.propertyType} onChange={update("propertyType")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="neighborhood">Neighborhood / community</FieldLabel>
                <Input id="neighborhood" value={facts.neighborhood} onChange={update("neighborhood")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="price-display">Listing price</FieldLabel>
                <Input id="price-display" value={facts.priceDisplay} onChange={update("priceDisplay")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="public-url">Public listing URL</FieldLabel>
                <Input id="public-url" value={facts.publicUrl} onChange={update("publicUrl")} />
              </Field>
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="listing-title">Listing title</FieldLabel>
                <Input id="listing-title" value={facts.title} onChange={update("title")} />
              </Field>
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="listing-description">Listing description / marketing context</FieldLabel>
                <Textarea
                  id="listing-description"
                  value={facts.description}
                  onChange={update("description")}
                  placeholder="Optional listing context for feature sheets, websites, and staff review"
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Verify / Override</CardTitle>
          <CardDescription>
            These notes explain anything MLS could not know or anything the realtor corrected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="override-notes">Confirmation notes</FieldLabel>
            <Textarea
              id="override-notes"
              value={facts.verifyNotes}
              onChange={update("verifyNotes")}
              placeholder="Example: MLS sqft excludes detached garage; use 450 sqft as non-livable. Seller wants neighborhood shown as Edgemont."
            />
            <FieldDescription>Stored on the portal intake for Reala admin review.</FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prefill Coverage</CardTitle>
          <CardDescription>What MLS helped with and what still requires human confirmation.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {mlsPrefillRows.map(([label, value, source]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-muted-foreground">{value}</div>
              </div>
              <Badge variant={source === "MLS" ? "secondary" : "outline"}>{source}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function PropertyConfidence({
  listing,
  facts,
}: {
  listing: OrderListing
  facts: ListingFactDraft
}) {
  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="text-primary" />
            Source Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FactRow label="Data Source" value="MLS + Listing Details" />
          <div className="flex items-center gap-3">
            <Progress value={95} />
            <span className="text-sm font-medium">95%</span>
          </div>
          <FactRow label="Last Synced" value={listing.lastImportedAt ? new Date(listing.lastImportedAt).toLocaleString() : "Demo data"} />
          <FactRow label="Manual Overrides" value={facts.verifyNotes || facts.nonLivableArea ? "Pending admin review" : "None"} />
          <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            High confidence. Please confirm all facts are accurate before proceeding.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="aspect-video rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${listing.image})` }} />
          <div className="aspect-[2/1] rounded-lg border bg-[linear-gradient(90deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%),linear-gradient(0deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%)] bg-size-[44px_44px]">
            <div className="flex size-full items-center justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <MapPinIcon />
              </span>
            </div>
          </div>
          <FactRow label="Living Area" value={facts.livingArea || "Needs confirmation"} icon={SquareIcon} />
          <FactRow label="Non-livable Area" value={facts.nonLivableArea || "Manual confirmation needed"} icon={HomeIcon} />
          <FactRow label="Property Type" value={facts.propertyType || "Needs confirmation"} icon={Building2Icon} />
          <Button variant="ghost" className="justify-start px-0">
            View on map
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}

function ServicesStep({
  selectedServiceNames,
  serviceDetails,
  onToggleService,
  onServiceDetailChange,
}: {
  selectedServiceNames: string[]
  serviceDetails: ServiceDetailDraft
  onToggleService: (serviceName: string) => void
  onServiceDetailChange: (key: keyof ServiceDetailDraft, value: string) => void
}) {
  const [serviceQuery, setServiceQuery] = React.useState("")
  const [serviceCategory, setServiceCategory] = React.useState("all")
  const aiPackages = [
    {
      name: "AI Workflow Audit",
      audience: "Solo, team, brokerage",
      detail: "Map lead intake, CRM stages, handoffs, and follow-up gaps before implementation.",
      price: "$999",
      badge: "Assessment first",
      icon: ShieldCheckIcon,
      points: ["Speed-to-lead scorecard", "CRM workflow gap report", "90-day automation roadmap"],
    },
    {
      name: "Speed-to-Lead Agent",
      audience: "Solo agents + teams",
      detail: "Capture, qualify, and route inbound website, ad, and portal leads within seconds.",
      price: "Managed monthly",
      badge: "Lead response",
      icon: MailIcon,
      points: ["Instant SMS and email reply", "Hot lead routing", "Night and weekend coverage"],
    },
    {
      name: "CRM Automation System",
      audience: "Teams + brokerages",
      detail: "Keep follow-up, pipeline stages, tasks, and reporting consistent across the business.",
      price: "Custom",
      badge: "Operations",
      icon: SlidersHorizontalIcon,
      points: ["Follow-up sequences", "Task and handoff rules", "Pipeline hygiene reporting"],
    },
    {
      name: "Managed AI Brokerage Ops",
      audience: "Brokerage level",
      detail: "A managed layer for AI agents, CRM automations, SLA tracking, and office-level workflows.",
      price: "Custom",
      badge: "Brokerage",
      icon: Building2Icon,
      points: ["Multi-team routing", "Admin visibility", "Automation governance"],
    },
  ] as const

  const serviceCategories = ["all", "media", "floor plans", "marketing", "editing", "web"] as const

  const filteredServices = serviceCatalog.filter((service) => {
    const matchesCategory =
      serviceCategory === "all" || service.category === serviceCategory
    const matchesQuery = [service.name, service.detail, service.category, service.tag]
      .join(" ")
      .toLowerCase()
      .includes(serviceQuery.toLowerCase())

    return matchesCategory && matchesQuery
  })

  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <CardTitle>Search service catalog</CardTitle>
              <CardDescription>
                Find packages, media add-ons, launch assets, and production services.
              </CardDescription>
            </div>
            <Badge variant="secondary">{filteredServices.length} results</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_auto] xl:items-center">
            <div className="relative min-w-0">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={serviceQuery}
                onChange={(event) => setServiceQuery(event.target.value)}
                className="pl-9"
                placeholder="Search services, deliverables, categories..."
              />
            </div>
            <Tabs value={serviceCategory} onValueChange={setServiceCategory}>
              <TabsList className="max-w-full overflow-x-auto">
                {serviceCategories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
          {filteredServices.map(({ name, detail, price, icon: Icon, turnaround, tag }, index) => {
            const selected = selectedServiceNames.includes(name)

            return (
            <BlurFade key={name} delay={index * 0.035} inView>
              <button
                type="button"
                onClick={() => onToggleService(name)}
                className={cn(
                  "grid w-full gap-4 rounded-lg border p-4 text-left transition hover:bg-muted/40 active:translate-y-px",
                  selected && "border-red-200 bg-red-50/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Badge variant="outline">{tag}</Badge>
                    {selected ? <Badge variant="secondary">Selected</Badge> : null}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{name}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm">
                  <span className="text-muted-foreground">{turnaround}</span>
                  <span className="font-semibold">{price}</span>
                </div>
              </button>
            </BlurFade>
            )
          })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <CardTitle>Legacy pricing details</CardTitle>
              <CardDescription>
                These fields mirror the old create-request calculator inputs so Reala can review the same service choices before any legacy write happens.
              </CardDescription>
            </div>
            <Badge variant="outline">Dry-run mapping</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 p-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <ServiceDetailSection
              title="Floor plan / measurement"
              description="Maps to floorplan, fpType, simplifiedMatterport, livable, nonLivable, and levels3d."
            >
              <ServiceDetailSelect
                label="Floor plan type"
                value={serviceDetails.floorplanType}
                options={[
                  ["simplified", "Simplified"],
                  ["standard", "Standard"],
                  ["premium", "Premium"],
                  ["none", "No floor plan"],
                ]}
                onChange={(value) => onServiceDetailChange("floorplanType", value)}
              />
              <ServiceDetailSelect
                label="Simplified Matterport add-on"
                value={serviceDetails.simplifiedMatterport}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("simplifiedMatterport", value)}
              />
              <ServiceDetailInput
                label="3D floor plan levels"
                value={serviceDetails.levels3d}
                onChange={(value) => onServiceDetailChange("levels3d", value)}
              />
            </ServiceDetailSection>

            <ServiceDetailSection
              title="Matterport"
              description="Maps to matterport, matterportType, virtualStaging, and photoEmbedding."
            >
              <ServiceDetailSelect
                label="Matterport type"
                value={serviceDetails.matterportType}
                options={[
                  ["standard", "Standard"],
                  ["premium", "Premium"],
                  ["none", "No Matterport"],
                ]}
                onChange={(value) => onServiceDetailChange("matterportType", value)}
              />
              <ServiceDetailSelect
                label="Matterport virtual staging"
                value={serviceDetails.matterportVirtualStaging}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("matterportVirtualStaging", value)}
              />
              <ServiceDetailInput
                label="Photo embedding count"
                value={serviceDetails.matterportPhotoEmbedding}
                onChange={(value) => onServiceDetailChange("matterportPhotoEmbedding", value)}
              />
            </ServiceDetailSection>

            <ServiceDetailSection
              title="Photography and image add-ons"
              description="Maps to photography, photgraphyType, photos, dronePhotos, drone360, virtualStagingPhoto, dayToTwilight, and image360Tour."
            >
              <ServiceDetailSelect
                label="Photography type"
                value={serviceDetails.photographyType}
                options={[
                  ["simplified", "Simplified"],
                  ["standard", "Standard"],
                  ["premium", "Premium"],
                  ["none", "No photography"],
                ]}
                onChange={(value) => onServiceDetailChange("photographyType", value)}
              />
              <ServiceDetailInput
                label="Photo count"
                value={serviceDetails.photoCount}
                onChange={(value) => onServiceDetailChange("photoCount", value)}
              />
              <ServiceDetailInput
                label="Drone photo count"
                value={serviceDetails.dronePhotos}
                onChange={(value) => onServiceDetailChange("dronePhotos", value)}
              />
              <ServiceDetailInput
                label="Drone 360 count"
                value={serviceDetails.drone360}
                onChange={(value) => onServiceDetailChange("drone360", value)}
              />
              <ServiceDetailInput
                label="Virtual staging photo count"
                value={serviceDetails.virtualStagingPhotoCount}
                onChange={(value) => onServiceDetailChange("virtualStagingPhotoCount", value)}
              />
              <ServiceDetailInput
                label="Day-to-twilight count"
                value={serviceDetails.dayToTwilight}
                onChange={(value) => onServiceDetailChange("dayToTwilight", value)}
              />
              <ServiceDetailInput
                label="Image 360 tour count"
                value={serviceDetails.image360Tour}
                onChange={(value) => onServiceDetailChange("image360Tour", value)}
              />
            </ServiceDetailSection>

            <ServiceDetailSection
              title="Video and print"
              description="Maps to videographyType, videographyLength, drone, social, narration, map3D, and printed material review notes."
            >
              <ServiceDetailSelect
                label="Videography type"
                value={serviceDetails.videographyType}
                options={[
                  ["simplified", "Simplified"],
                  ["standard", "Standard"],
                  ["premium", "Premium"],
                  ["none", "No video"],
                ]}
                onChange={(value) => onServiceDetailChange("videographyType", value)}
              />
              <ServiceDetailSelect
                label="Video length"
                value={serviceDetails.videographyLength}
                options={[
                  ["60", "60 seconds"],
                  ["90", "90 seconds"],
                  ["120", "120 seconds"],
                  ["custom", "Custom / staff review"],
                ]}
                onChange={(value) => onServiceDetailChange("videographyLength", value)}
              />
              <ServiceDetailSelect
                label="Drone video"
                value={serviceDetails.videoDrone}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("videoDrone", value)}
              />
              <ServiceDetailSelect
                label="Social cutdowns"
                value={serviceDetails.videoSocial}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("videoSocial", value)}
              />
              <ServiceDetailSelect
                label="Narration"
                value={serviceDetails.videoNarration}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("videoNarration", value)}
              />
              <ServiceDetailSelect
                label="3D map"
                value={serviceDetails.videoMap3d}
                options={[
                  ["false", "No"],
                  ["true", "Yes"],
                ]}
                onChange={(value) => onServiceDetailChange("videoMap3d", value)}
              />
              <Field className="md:col-span-2">
                <FieldLabel>Print / feature sheet notes</FieldLabel>
                <Textarea
                  value={serviceDetails.printedMaterialNotes}
                  onChange={(event) =>
                    onServiceDetailChange("printedMaterialNotes", event.target.value)
                  }
                  placeholder="Feature sheet quantity, template preference, print-shop constraints..."
                  rows={3}
                />
              </Field>
            </ServiceDetailSection>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            MLS can prefill address, MLS number, price, property type, bedrooms,
            bathrooms, area, and square footage. Service choices still need human
            confirmation because they represent what the realtor wants Reala to produce,
            not what the MLS listing already contains.
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <CardTitle>AI add-on services</CardTitle>
              <CardDescription>
                Optional Reala packages for speed-to-lead, managed AI agents, and CRM automations.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href="https://reala.agency" target="_blank" rel="noreferrer" />
              }
            >
              <ExternalLinkIcon data-icon="inline-start" />
              View Reala Offer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 lg:grid-cols-2">
          {aiPackages.map(({ name, audience, detail, price, badge, icon: Icon, points }, index) => (
            <BlurFade key={name} delay={index * 0.04} inView>
              <button
                type="button"
                className={cn(
                  "group flex min-w-0 w-full flex-col gap-3 rounded-lg border p-4 text-left transition hover:bg-muted/35 active:translate-y-px",
                  index === 0 && "border-red-200 bg-red-50/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background text-foreground shadow-sm ring-1 ring-border">
                    <Icon className="size-4" />
                  </span>
                  <Badge variant={index === 0 ? "default" : "secondary"}>{badge}</Badge>
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{name}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {audience}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {points.map((point) => (
                    <span key={point} className="flex items-center gap-2">
                      <CheckIcon className="size-3.5 shrink-0 text-foreground" />
                      {point}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">{index === 0 ? "Flat audit" : "Pricing"}</span>
                  <span className="font-semibold">{price}</span>
                </div>
              </button>
            </BlurFade>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function ServiceDetailSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-4 rounded-xl border bg-background p-4">
      <div>
        <div className="font-medium">{title}</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  )
}

function ServiceDetailInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

function ServiceDetailSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) onChange(nextValue)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(([optionValue, optionLabel]) => (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function ScheduleStep({
  requestedDate,
  requestedWindow,
  staffPreference,
  onRequestedDateChange,
  onRequestedWindowChange,
  onStaffPreferenceChange,
}: {
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  onRequestedDateChange: (date: string) => void
  onRequestedWindowChange: (window: string) => void
  onStaffPreferenceChange: (staff: string) => void
}) {
  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>1. Preferred Schedule</CardTitle>
          <CardDescription>
            Choose your preferred date and window. Reala ops will confirm availability before anything is changed in TimeTap.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <Field>
            <FieldLabel>Preferred Date</FieldLabel>
            <Input
              type="date"
              value={requestedDate}
              onChange={(event) => onRequestedDateChange(event.target.value)}
            />
            <FieldDescription>You can select a range if your date is flexible.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Preferred Time Window</FieldLabel>
            <Select
              value={requestedWindow}
              onValueChange={(value) => {
                if (value) onRequestedWindowChange(value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    "8:00 AM - 10:00 AM",
                    "9:00 AM - 12:00 PM",
                    "12:00 PM - 3:00 PM",
                    "3:00 PM - 6:00 PM",
                    "Flexible / staff to confirm",
                  ].map((window) => (
                    <SelectItem key={window} value={window}>
                      {window}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Choose your preferred time window.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Staff Preference</FieldLabel>
            <Select
              value={staffPreference}
              onValueChange={(value) => {
                if (value) onStaffPreferenceChange(value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    "Lead Photographer",
                    "Matterport Tech",
                    "Floor Plan Specialist",
                    "No preference",
                  ].map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Choose your staff preference.</FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>2. Live Availability</CardTitle>
              <CardDescription>
                Read-only TimeTap mirror lanes for field crews, scans, and
                coordination holds. Selecting a window records intent only.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">TimeTap read-only</Badge>
              <Badge variant="outline">{scheduleEvents.length} mirror events</Badge>
              <Badge variant="outline">No booking write</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
            <EventManager
              events={scheduleEvents}
              categories={["Photography", "Floor Plan", "Matterport", "Coordination"]}
              defaultView="week"
              initialDate={new Date(2026, 4, 14)}
              className="[&_h2]:text-xl"
            />
          </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <BridgeSignal
            title="Existing TimeTap slot"
            detail="Conflicts are shown from the mirrored event feed before staff confirms anything."
          />
          <BridgeSignal
            title="Vendor assignment"
            detail="Missing or mismatched staff remains a review warning, not an automatic dispatch."
          />
          <BridgeSignal
            title="Daily Drafting"
            detail="Sheet rows can be matched for floor-plan fields, but uploads stay disabled."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[auto_minmax(0,1fr)_260px] lg:items-center">
          <span className="flex size-11 items-center justify-center rounded-lg border">
            <UserRoundIcon />
          </span>
          <div>
            <div className="font-medium">3. Manual Coordination (if needed)</div>
            <p className="text-sm text-muted-foreground">
              If no suitable time is available, a coordinator can confirm availability manually.
            </p>
          </div>
          <Button variant="outline">Request Manual Coordination</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function BridgeSignal({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="font-medium">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}

function JobInstructionsStep({
  jobInstructions,
  specialInstructions,
  onJobInstructionChange,
  onSpecialInstructionsChange,
}: {
  jobInstructions: JobInstructionDraft
  specialInstructions: string
  onJobInstructionChange: (key: keyof JobInstructionDraft, value: string) => void
  onSpecialInstructionsChange: (instructions: string) => void
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-4">
        <InstructionSection title="1. Access Details" icon={<LockIcon />}>
          <div className="grid gap-4 md:grid-cols-3">
            <InstructionSelect
              label="Lockbox on site"
              value={jobInstructions.lockboxOnSite}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
                ["unknown", "Not sure"],
              ]}
              onChange={(value) => onJobInstructionChange("lockboxOnSite", value)}
            />
            <InstructionInput
              label="Lockbox location"
              value={jobInstructions.lockboxLocation}
              onChange={(value) => onJobInstructionChange("lockboxLocation", value)}
            />
            <InstructionInput
              label="Access code"
              value={jobInstructions.accessCode}
              onChange={(value) => onJobInstructionChange("accessCode", value)}
            />
            <InstructionSelect
              label="Call on arrival"
              value={jobInstructions.callOnArrival}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
                ["if_needed", "Only if needed"],
              ]}
              onChange={(value) => onJobInstructionChange("callOnArrival", value)}
            />
            <InstructionInput
              label="Contact name (if any)"
              value={jobInstructions.contactName}
              onChange={(value) => onJobInstructionChange("contactName", value)}
            />
            <InstructionInput
              label="Phone number"
              value={jobInstructions.contactPhone}
              onChange={(value) => onJobInstructionChange("contactPhone", value)}
            />
            <InstructionSelect
              label="Occupant status"
              value={jobInstructions.occupancyStatus}
              options={[
                ["vacant", "Vacant"],
                ["occupied", "Occupied"],
                ["tenant_occupied", "Tenant occupied"],
                ["seller_home", "Seller will be home"],
              ]}
              onChange={(value) => onJobInstructionChange("occupancyStatus", value)}
            />
            <InstructionSelect
              label="Pets on site"
              value={jobInstructions.petsOnSite}
              options={[
                ["no", "No"],
                ["yes", "Yes"],
                ["unknown", "Not sure"],
              ]}
              onChange={(value) => onJobInstructionChange("petsOnSite", value)}
            />
            <InstructionSelect
              label="Alarm / security"
              value={jobInstructions.alarmSecurity}
              options={[
                ["no_alarm", "No alarm"],
                ["alarm_code_provided", "Alarm code provided"],
                ["contact_owner", "Contact owner first"],
                ["unknown", "Not sure"],
              ]}
              onChange={(value) => onJobInstructionChange("alarmSecurity", value)}
            />
            <Field className="md:col-span-3">
              <FieldLabel>Parking / arrival notes</FieldLabel>
              <Textarea
                value={jobInstructions.parkingNotes}
                onChange={(event) =>
                  onJobInstructionChange("parkingNotes", event.target.value)
                }
                placeholder="Visitor parking, lane access, concierge, loading bay, gate code..."
                rows={2}
              />
            </Field>
          </div>
        </InstructionSection>

        <InstructionSection title="2. Photo Requirements" icon={<CameraGlyph />}>
          <div className="grid gap-4 md:grid-cols-3">
            <InstructionSelect
              label="Required photo count"
              value={jobInstructions.requiredPhotoCount}
              options={[
                ["15", "15 photos"],
                ["25", "25 photos"],
                ["35", "35 photos"],
                ["50", "50 photos"],
                ["custom", "Custom / staff review"],
              ]}
              onChange={(value) => onJobInstructionChange("requiredPhotoCount", value)}
            />
            <InstructionSelect
              label="Twilight photos requested"
              value={jobInstructions.twilightRequested}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
                ["staff_review", "Staff review"],
              ]}
              onChange={(value) => onJobInstructionChange("twilightRequested", value)}
            />
            <Field>
              <FieldLabel>Must-capture rooms</FieldLabel>
              <Textarea
                value={jobInstructions.mustCaptureRooms}
                onChange={(event) =>
                  onJobInstructionChange("mustCaptureRooms", event.target.value)
                }
                rows={3}
              />
            </Field>
            <InstructionSelect
              label="Staging notes"
              value={jobInstructions.stagingNotes}
              options={[
                ["not_staged", "Not staged"],
                ["partially_staged", "Partially staged"],
                ["fully_staged", "Fully staged"],
                ["needs_review", "Needs staff review"],
              ]}
              onChange={(value) => onJobInstructionChange("stagingNotes", value)}
            />
            <Field className="md:col-span-2">
              <FieldLabel>Additional notes</FieldLabel>
              <Textarea
                value={jobInstructions.photoNotes}
                onChange={(event) =>
                  onJobInstructionChange("photoNotes", event.target.value)
                }
                rows={3}
              />
            </Field>
          </div>
        </InstructionSection>

        <InstructionSection title="3. Floor Plan / Measurement Notes" icon={<FileTextIcon />}>
          <div className="grid gap-4 md:grid-cols-3">
            <InstructionSelect
              label="Square footage source"
              value={jobInstructions.squareFootageSource}
              options={[
                ["mls", "MLS"],
                ["seller", "Seller/client supplied"],
                ["previous_plan", "Previous plan"],
                ["unknown", "Unknown"],
              ]}
              onChange={(value) => onJobInstructionChange("squareFootageSource", value)}
            />
            <Field>
              <FieldLabel>Special measurement notes</FieldLabel>
              <Textarea
                value={jobInstructions.measurementNotes}
                onChange={(event) =>
                  onJobInstructionChange("measurementNotes", event.target.value)
                }
              />
            </Field>
            <Field className="md:col-span-2">
              <FieldLabel>Restricted areas</FieldLabel>
              <Textarea
                value={jobInstructions.restrictedAreas}
                onChange={(event) =>
                  onJobInstructionChange("restrictedAreas", event.target.value)
                }
                placeholder="Locked rooms, tenant areas, garage, storage, outbuildings..."
                rows={2}
              />
            </Field>
            <Field className="md:col-span-3">
              <FieldLabel>Matterport / scan notes</FieldLabel>
              <Textarea
                value={jobInstructions.matterportNotes}
                onChange={(event) =>
                  onJobInstructionChange("matterportNotes", event.target.value)
                }
                placeholder="Scan exclusions, private areas, required start point, URL/canonical concerns..."
                rows={2}
              />
            </Field>
          </div>
        </InstructionSection>

        <InstructionSection title="4. Feature Sheet / Print Notes" icon={<FileTextIcon />}>
          <Textarea
            value={jobInstructions.featureSheetNotes}
            onChange={(event) =>
              onJobInstructionChange("featureSheetNotes", event.target.value)
            }
            placeholder="Feature sheet copy, brochure quantity, print delivery notes, proofing constraints..."
            rows={3}
          />
        </InstructionSection>

        <InstructionSection title="5. Special Instructions" icon={<FileTextIcon />}>
          <Textarea
            value={specialInstructions}
            onChange={(event) => onSpecialInstructionsChange(event.target.value)}
            rows={4}
          />
        </InstructionSection>
      </div>

      <Card className="self-start py-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="flex items-center gap-2">
            <EyeIcon />
            What the vendor will see
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-0 p-0">
          {buildVendorPreview(jobInstructions).map(([title, line1, line2, Icon]) => (
            <div key={title as string} className="grid grid-cols-[32px_minmax(0,1fr)_auto] gap-3 border-b p-4 last:border-b-0">
              <Icon className="mt-1 size-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{title as string}</div>
                <p className="text-sm text-muted-foreground">{line1 as string}</p>
                <p className="text-sm text-muted-foreground">{line2 as string}</p>
              </div>
              <CheckIcon className="size-4 text-green-700" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function buildVendorPreview(jobInstructions: JobInstructionDraft) {
  return [
    [
      "Access",
      selectLabel(jobInstructions.lockboxOnSite, {
        yes: "Lockbox on site",
        no: "No lockbox confirmed",
        unknown: "Lockbox not confirmed",
      }),
      jobInstructions.accessCode
        ? `Code: ${jobInstructions.accessCode}`
        : jobInstructions.lockboxLocation || "Location not provided",
      KeyRoundIcon,
    ],
    [
      "Contact",
      selectLabel(jobInstructions.callOnArrival, {
        yes: "Call on arrival",
        no: "No call required",
        if_needed: "Call only if needed",
      }),
      [jobInstructions.contactName, jobInstructions.contactPhone]
        .filter(Boolean)
        .join(" · ") || "No contact provided",
      UserRoundIcon,
    ],
    [
      "Occupancy",
      humanizeToken(jobInstructions.occupancyStatus),
      `${humanizeToken(jobInstructions.petsOnSite)} pets · ${humanizeToken(jobInstructions.alarmSecurity)}`,
      HomeIcon,
    ],
    [
      "Photo Requirements",
      jobInstructions.requiredPhotoCount === "custom"
        ? "Custom photo count"
        : `${jobInstructions.requiredPhotoCount} photos`,
      selectLabel(jobInstructions.twilightRequested, {
        yes: "Twilight requested",
        no: "No twilight",
        staff_review: "Twilight needs staff review",
      }),
      CameraGlyph,
    ],
    [
      "Floor Plan Notes",
      `Sq ft source: ${humanizeToken(jobInstructions.squareFootageSource)}`,
      jobInstructions.measurementNotes || "No measurement note",
      FileTextIcon,
    ],
    [
      "Special Instructions",
      jobInstructions.parkingNotes || "No parking note",
      jobInstructions.restrictedAreas || "No restricted areas noted",
      FileTextIcon,
    ],
  ] as const
}

function buildOrderReadinessWarnings({
  listingFacts,
  serviceDetails,
  jobInstructions,
  selectedServiceNames,
  requestedDate,
  requestedWindow,
  paymentMode,
}: {
  listingFacts: ListingFactDraft
  serviceDetails: ServiceDetailDraft
  jobInstructions: JobInstructionDraft
  selectedServiceNames: string[]
  requestedDate: string
  requestedWindow: string
  paymentMode: string
}) {
  const warnings: OrderReadinessWarning[] = []
  const hasFloorPlan = serviceMatches(selectedServiceNames, serviceKeywordGroups.floorPlan)
  const hasMatterport = serviceMatches(selectedServiceNames, serviceKeywordGroups.matterport)
  const hasPhotography = serviceMatches(selectedServiceNames, serviceKeywordGroups.photography)
  const hasVideo = serviceMatches(selectedServiceNames, serviceKeywordGroups.video)
  const hasFeatureSheetPrint = serviceMatches(
    selectedServiceNames,
    serviceKeywordGroups.featureSheetPrint
  )
  const hasVirtualStaging = serviceMatches(
    selectedServiceNames,
    serviceKeywordGroups.virtualStaging
  )

  if (!listingFacts.address.trim()) {
    warnings.push({
      category: "Listing",
      label: "Address missing",
      detail: "Legacy appointment, folder naming, and staff handoff need a confirmed address.",
      severity: "blocking",
    })
  }

  if (!selectedServiceNames.length) {
    warnings.push({
      category: "Services",
      label: "No services selected",
      detail: "Reala staff cannot price or schedule a request without at least one service.",
      severity: "blocking",
    })
  }

  if (!requestedDate || !requestedWindow) {
    warnings.push({
      category: "Schedule",
      label: "Preferred timing incomplete",
      detail: "The new portal still keeps TimeTap manual, but staff need a preferred date and window.",
      severity: "review",
    })
  }

  if ((hasFloorPlan || hasMatterport) && !listingFacts.livingArea.trim()) {
    warnings.push({
      category: "Pricing",
      label: "Living area missing",
      detail: "Floor plan and Matterport pricing depend on livable square footage.",
      severity: "review",
    })
  }

  if ((hasFloorPlan || hasMatterport) && !listingFacts.nonLivableArea.trim()) {
    warnings.push({
      category: "Pricing",
      label: "Non-livable area not confirmed",
      detail: "Legacy pricing supports non-livable area; staff should confirm basement, garage, storage, or excluded areas.",
      severity: "review",
    })
  }

  if (hasFloorPlan && serviceDetails.floorplanType === "none") {
    warnings.push({
      category: "Floor plan",
      label: "Floor plan service selected but type is none",
      detail: "Pick simplified, standard, or premium before staff maps this to legacy pricing.",
      severity: "blocking",
    })
  }

  if (hasMatterport && serviceDetails.matterportType === "none") {
    warnings.push({
      category: "Matterport",
      label: "Matterport service selected but type is none",
      detail: "Pick the Matterport type so staff can avoid the current URL/workflow confusion.",
      severity: "blocking",
    })
  }

  if (hasPhotography && serviceDetails.photographyType === "none") {
    warnings.push({
      category: "Photography",
      label: "Photography service selected but type is none",
      detail: "Choose the photography package type before review.",
      severity: "blocking",
    })
  }

  if (hasPhotography && !jobInstructions.mustCaptureRooms.trim()) {
    warnings.push({
      category: "Photography",
      label: "Must-capture rooms missing",
      detail: "Field crews need a room/shot priority list for reliable upload and delivery.",
      severity: "review",
    })
  }

  if (hasVideo && serviceDetails.videographyType === "none") {
    warnings.push({
      category: "Video",
      label: "Video service selected but type is none",
      detail: "Pick the video package type or remove the video service.",
      severity: "blocking",
    })
  }

  if (hasVirtualStaging && serviceDetails.virtualStagingPhotoCount === "0") {
    warnings.push({
      category: "Virtual staging",
      label: "Virtual staging count not set",
      detail: "Virtual staging needs a target image count before provider handoff.",
      severity: "review",
    })
  }

  if (hasFeatureSheetPrint && !jobInstructions.featureSheetNotes.trim()) {
    warnings.push({
      category: "Feature sheet / print",
      label: "Feature sheet or print notes missing",
      detail: "Staff should confirm product, copy/proofing needs, print quantity, or delivery constraints.",
      severity: "review",
    })
  }

  if (jobInstructions.lockboxOnSite === "yes" && !jobInstructions.lockboxLocation.trim()) {
    warnings.push({
      category: "Access",
      label: "Lockbox location missing",
      detail: "The field crew preview needs enough access detail to avoid day-of-job delays.",
      severity: "review",
    })
  }

  if (
    (jobInstructions.callOnArrival === "yes" ||
      jobInstructions.callOnArrival === "if_needed") &&
    !jobInstructions.contactName.trim() &&
    !jobInstructions.contactPhone.trim()
  ) {
    warnings.push({
      category: "Access",
      label: "Arrival contact missing",
      detail: "Call-on-arrival is selected but no contact name or phone was provided.",
      severity: "review",
    })
  }

  if (jobInstructions.petsOnSite === "unknown" || jobInstructions.alarmSecurity === "unknown") {
    warnings.push({
      category: "Access",
      label: "Site safety details uncertain",
      detail: "Pets or alarm/security are unknown; staff should confirm before scheduling.",
      severity: "info",
    })
  }

  if (paymentMode === "Card Authorization Hold") {
    warnings.push({
      category: "Payment",
      label: "Card hold is staff-review only",
      detail: "The portal captures card-hold intent, but no live Stripe authorization happens from this flow.",
      severity: "info",
    })
  }

  return warnings
}

function serviceMatches(serviceNames: string[], keywords: readonly string[]) {
  return serviceNames.some((name) => {
    const normalizedName = name.toLowerCase()
    return keywords.some((keyword) => normalizedName.includes(keyword))
  })
}

function EstimateStep({
  selectedServices,
  estimate,
}: {
  selectedServices: SelectedService[]
  estimate: ReturnType<typeof buildEstimateLines>
}) {
  const estimateLines = [
    ["Subtotal", estimate.subtotal],
    ["Account Discount (10%)", estimate.discount],
    ["Taxes (8.25%)", estimate.taxes],
    ["Credits Applied", estimate.credits],
  ]

  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Estimate</CardTitle>
          <CardDescription>
            Review selected services, credits, discount, and tax before payment terms.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {selectedServices.map((service) => (
            <ServiceEstimateRow key={service.name} service={service} />
          ))}
          <Separator />
          <div className="ml-auto grid w-full max-w-md gap-3">
            {estimateLines.map(([label, value]) => (
              <FactRow key={label} label={label} value={value} />
            ))}
            <Separator />
            <FactRow label="Estimated Total" value={estimate.total} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentTermsStep({
  paymentMode,
  estimate,
  onPaymentModeChange,
}: {
  paymentMode: string
  estimate: ReturnType<typeof buildEstimateLines>
  onPaymentModeChange: (paymentMode: string) => void
}) {
  const paymentOptions = [
    {
      icon: <CreditCardIcon />,
      title: "Card Authorization Hold",
      badge: "Recommended",
      description:
        "Review the card-hold policy design. Stripe manual-capture remains test-mode until approved.",
      detailTitle: estimate.total,
      detail: "Estimated authorization amount · staff review only",
    },
    {
      icon: <Building2Icon />,
      title: "Account Terms (Net 30)",
      description: "Bill this order to approved account terms.",
      detailTitle: "Approved",
      detail: "Terms expire Jun 1, 2026",
    },
    {
      icon: <WalletCardsIcon />,
      title: "Direct Deposit / ACH",
      description: "Pay via direct deposit or ACH transfer.",
      detailTitle: "Details provided after order submission",
      detail: "",
    },
    {
      icon: <MailIcon />,
      title: "Cheque / Mail",
      description: "Send payment by cheque.",
      detailTitle: "Payable to Reala Inc.",
      detail: "Details provided after order submission",
    },
  ]

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-xl font-semibold">Select payment method or billing terms</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your selection determines what happens after this order is submitted.
        </p>
      </div>
      {paymentOptions.map((option) => (
        <PaymentOption
          key={option.title}
          selected={paymentMode === option.title}
          onSelect={() => onPaymentModeChange(option.title)}
          {...option}
        />
      ))}
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <div className="flex gap-3">
          <InfoIcon className="mt-0.5 size-5 text-amber-700" />
          <div>
            <div className="font-medium">Important payment notice</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Authorization holds are temporary and only captured after final delivery and approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewSubmitStep({
  listing,
  listingFacts,
  serviceDetails,
  jobInstructions,
  readinessWarnings,
  selectedServices,
  estimate,
  requestedDate,
  requestedWindow,
  staffPreference,
  paymentMode,
  onEdit,
}: {
  listing: OrderListing
  listingFacts: ListingFactDraft
  serviceDetails: ServiceDetailDraft
  jobInstructions: JobInstructionDraft
  readinessWarnings: OrderReadinessWarning[]
  selectedServices: SelectedService[]
  estimate: ReturnType<typeof buildEstimateLines>
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  paymentMode: string
  onEdit: (step: number) => void
}) {
  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Review & Submit</CardTitle>
          <CardDescription>
            Confirm the complete draft before sending it to Reala admin review.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ReadinessWarningsPanel warnings={readinessWarnings} />
          </div>
          <BlurFade delay={0.02} inView>
            <ReviewBlock
              title="Listing"
              badge="MLS verified"
              lines={[
                ["Address", listingFacts.address || listing.address],
                ["MLS", `# ${listingFacts.mlsNumber || listing.mls}`],
                ["Living area", listingFacts.livingArea || "Needs confirmation"],
                ["Non-livable area", listingFacts.nonLivableArea || "Not provided"],
                ["Property", listingFacts.propertyType || "Needs confirmation"],
              ]}
              onEdit={() => onEdit(1)}
            />
          </BlurFade>
          <BlurFade delay={0.06} inView>
            <ReviewBlock
              title="Services"
              badge={`${selectedServices.length} selected`}
              lines={[
                ...selectedServices
                  .slice(0, 4)
                  .map((item) => [item.name, item.price] as const),
                ["Photo count", serviceDetails.photoCount || "Staff review"],
                ["Floor plan", serviceDetails.floorplanType],
                ["Matterport", serviceDetails.matterportType],
                ["Video", `${serviceDetails.videographyLength} sec`],
              ]}
              onEdit={() => onEdit(2)}
            />
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <ReviewBlock
              title="Schedule & Access"
              badge="Staff review"
              lines={[
                ["Date", requestedDate],
                ["Window", requestedWindow],
                ["Staff", staffPreference],
                ["Lockbox", humanizeToken(jobInstructions.lockboxOnSite)],
                ["Occupancy", humanizeToken(jobInstructions.occupancyStatus)],
              ]}
              onEdit={() => onEdit(4)}
            />
          </BlurFade>
          <BlurFade delay={0.14} inView>
            <ReviewBlock
              title="Payment"
              badge="Staff review"
              lines={[
                ["Method", paymentMode],
                ["Legacy action", "No automatic write"],
                ["Estimate", estimate.total],
              ]}
              onEdit={() => onEdit(6)}
            />
          </BlurFade>
        </CardContent>
      </Card>
    </div>
  )
}

function ReadinessWarningsPanel({
  warnings,
}: {
  warnings: OrderReadinessWarning[]
}) {
  const blockingCount = warnings.filter(
    (warning) => warning.severity === "blocking"
  ).length
  const reviewCount = warnings.filter(
    (warning) => warning.severity === "review"
  ).length

  if (!warnings.length) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex gap-3">
          <CheckIcon className="mt-0.5 size-5 text-emerald-700" />
          <div>
            <div className="font-medium text-emerald-950">
              No handoff gaps detected
            </div>
            <p className="mt-1 text-sm text-emerald-900/80">
              This draft has the core listing, service, schedule, access, and
              payment-review fields needed for Reala staff review.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <InfoIcon className="mt-0.5 size-5 text-amber-700" />
          <div>
            <div className="font-medium text-amber-950">
              Handoff warnings before staff review
            </div>
            <p className="mt-1 text-sm text-amber-900/80">
              These do not write to legacy. They show what Reala staff may
              need to confirm before manual entry, dry-run bridge work, or future
              automation.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Badge variant={blockingCount ? "destructive" : "outline"}>
            {blockingCount} blocking
          </Badge>
          <Badge variant="outline">{reviewCount} review</Badge>
          <Badge variant="secondary">{warnings.length} total</Badge>
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {warnings.map((warning) => (
          <div
            key={`${warning.category}-${warning.label}`}
            className="rounded-xl border bg-background px-3 py-2 text-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{warning.label}</span>
              <Badge
                variant={
                  warning.severity === "blocking"
                    ? "destructive"
                    : warning.severity === "review"
                      ? "outline"
                      : "secondary"
                }
              >
                {warning.severity}
              </Badge>
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {warning.category}
            </div>
            <p className="mt-1 text-muted-foreground">{warning.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function InstructionSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="[&_svg]:size-4">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

function InstructionInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

function InstructionSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) onChange(nextValue)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(([optionValue, optionLabel]) => (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function selectLabel(value: string, labels: Record<string, string>) {
  return labels[value] ?? humanizeToken(value)
}

function humanizeToken(value: string) {
  if (!value) return "Not provided"

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function ServiceEstimateRow({
  service,
}: {
  service: SelectedService
}) {
  const Icon = service.icon

  return (
    <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <span className="flex size-10 items-center justify-center rounded-md bg-muted">
        <Icon className="size-5" />
      </span>
      <div>
        <div className="font-medium">{service.name}</div>
        <p className="text-sm text-muted-foreground">{service.detail}</p>
      </div>
      <div className="font-semibold">{service.price}</div>
    </div>
  )
}

function PaymentOption({
  selected,
  onSelect,
  icon,
  title,
  badge,
  description,
  detailTitle,
  detail,
}: {
  selected?: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  badge?: string
  description: string
  detailTitle: string
  detail: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid gap-4 rounded-lg border p-4 text-left transition hover:bg-muted/35 active:translate-y-px lg:grid-cols-[auto_minmax(0,1fr)_minmax(240px,0.8fr)] lg:items-center",
        selected && "border-destructive bg-red-50/30"
      )}
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border",
          selected && "border-destructive"
        )}
      >
        {selected ? <span className="size-2 rounded-full bg-destructive" /> : null}
      </span>
      <div className="grid gap-3 sm:grid-cols-[40px_minmax(0,1fr)]">
        <span className="flex size-10 items-center justify-center rounded-md border">
          {icon}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium">{title}</div>
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="border-t pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className={cn("font-medium", title.includes("Account") && "text-green-700")}>
          {detailTitle}
        </div>
        {detail ? <p className="mt-1 text-sm text-muted-foreground">{detail}</p> : null}
      </div>
    </button>
  )
}

function ReviewBlock({
  title,
  badge,
  lines,
  onEdit,
}: {
  title: string
  badge: string
  lines: readonly (readonly [string, string])[]
  onEdit: () => void
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div className="min-w-0">
          <div className="font-medium">{title}</div>
          <Badge variant="secondary" className="mt-2">
            {badge}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon data-icon="inline-start" />
          Edit
        </Button>
      </div>
      <dl className="grid text-sm">
        {lines.map(([label, value]) => (
          <div
            key={`${title}-${label}`}
            className="grid gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[110px_minmax(0,1fr)]"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="min-w-0 font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SummaryService({
  service,
}: {
  service: SelectedService
}) {
  const Icon = service.icon

  return (
    <div className="grid grid-cols-[24px_minmax(0,1fr)_auto] gap-2 text-sm">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="min-w-0">
        <div className="truncate font-medium">{service.name}</div>
        <div className="truncate text-xs text-muted-foreground">{service.detail}</div>
      </div>
      <span className="font-medium">{service.price}</span>
    </div>
  )
}

function CameraGlyph(props: React.SVGProps<SVGSVGElement>) {
  return <SquareIcon {...props} />
}

function OrderSummary({
  currentStep,
  listing,
  selectedServices,
  estimate,
  requestedDate,
  requestedWindow,
  staffPreference,
  paymentMode,
}: {
  currentStep: number
  listing: (typeof listings)[number] | null
  selectedServices: SelectedService[]
  estimate: ReturnType<typeof buildEstimateLines>
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  paymentMode: string
}) {
  const hasSelection = Boolean(listing)

  return (
    <Card className="min-w-0 self-start py-0 xl:sticky xl:top-[calc(var(--header-height)+0.75rem)] xl:max-h-[calc(100dvh-var(--header-height)-1.5rem)] xl:overflow-y-auto">
      <CardHeader className="border-b py-4">
        <CardTitle>Order Summary</CardTitle>
        <CardAction>
          <Badge variant="secondary">
            {hasSelection ? `Step ${currentStep + 1} of 8` : "Draft"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {listing ? (
          <div className="grid gap-3 border-b pb-4 sm:grid-cols-[72px_1fr] xl:grid-cols-[72px_1fr]">
            <div className="h-16 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${listing.image})` }} />
            <div className="min-w-0">
              <div className="font-medium">{listing.address}</div>
              <p className="text-sm text-muted-foreground">{listing.area}</p>
              <p className="text-xs text-muted-foreground">MLS # {listing.mls}</p>
            </div>
          </div>
        ) : null}

        <SummarySection title="Brokerage">
          <FactRow label="North Star Realty" value="Enterprise Brokerage" />
        </SummarySection>
        <SummarySection title="Requesting User">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-9 rounded-full bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80')] bg-cover bg-center" />
              <div className="min-w-0">
                <div className="font-medium">Sarah Johnson</div>
                <p className="text-sm text-muted-foreground">Brokerage Admin</p>
                <p className="text-sm text-muted-foreground">sarah@northstarrealty.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              <UserRoundIcon data-icon="inline-start" />
              Change
            </Button>
          </div>
          <div className="mt-3 rounded-md border bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
            Requesting on behalf of assigned agent or client-facing assistant.
          </div>
        </SummarySection>
        <SummarySection title="Selected Listing">
          <p className="text-sm text-muted-foreground">
            {listing ? listing.address : "None selected"}
          </p>
        </SummarySection>
        <SummarySection title="Services">
          {hasSelection ? (
            <div className="grid gap-3">
              {selectedServices.slice(0, currentStep >= 4 ? 5 : 4).map((service) => (
                <SummaryService key={service.name} service={service} />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No services selected yet</p>
              <Button variant="outline" className="mt-2 w-full">
                Browse Services
              </Button>
            </>
          )}
        </SummarySection>
        <SummarySection title={listing ? "Preliminary Estimate" : "Estimate"}>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold">
              {hasSelection ? estimate.total : "$0.00"}
            </span>
            <span className="text-sm text-muted-foreground">
              Subtotal {hasSelection ? estimate.subtotal : "$0.00"}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasSelection
              ? "Includes discount, taxes, and applied credits."
              : "Estimate will update after selecting services."}
          </p>
        </SummarySection>
        {currentStep >= 3 && hasSelection ? (
          <SummarySection title="Schedule">
            <FactRow label="Preferred Date" value={requestedDate} />
            <FactRow label="Window" value={requestedWindow} />
            <FactRow label="Staff" value={staffPreference} />
          </SummarySection>
        ) : null}
        {listing ? (
          <SummarySection title="Payment / Terms">
            <FactRow
              label={currentStep >= 6 ? paymentMode : "Payment posture"}
              value={currentStep >= 6 ? "Staff review only" : "Not selected"}
            />
          </SummarySection>
        ) : (
          <SummarySection title="Order Notes">
            <Textarea placeholder="Add an internal note for this order..." />
          </SummarySection>
        )}
      </CardContent>
    </Card>
  )
}

function ListingMeta({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-4 shrink-0" />
      {value}
    </span>
  )
}

function SummaryBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-1 p-4 md:[&:nth-child(even)]:border-l">
      <div className="text-xs font-semibold uppercase text-muted-foreground">{title}</div>
      {lines.map((line) => (
        <div key={line} className="text-sm text-muted-foreground">
          {line}
        </div>
      ))}
    </div>
  )
}

function SummarySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b pb-4 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      {children}
    </section>
  )
}

function FactRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
        {Icon ? <Icon /> : null}
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-right font-medium">{value}</span>
    </div>
  )
}
