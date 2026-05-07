"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import {
  CalendarDaysIcon,
  DownloadIcon,
  Edit3Icon,
  EllipsisIcon,
  ListFilterIcon,
  MailIcon,
  MapPinIcon,
  PauseCircleIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  UserRoundCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  createVendorOnboardingAccessRequestAction,
  type AccessRequestActionState,
} from "@/app/actions/access-requests"
import {
  createVendorAssignmentDraftAction,
} from "@/app/actions/portal-intake"
import type { PortalIntakeActionState } from "@/lib/portal-intake-requests"
import type { VendorAssignmentCandidate } from "@/lib/server/live-portal-data"
import { AppSidebar } from "@/components/app-sidebar"
import {
  RoleProvider,
  type WorkspaceAccessSnapshot,
} from "@/components/role-context"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"

type BridgeAttempt = {
  integration: string
  action: string
  status: string
  reason: string
}

type VendorStatus = "Available" | "Scheduled" | "Overloaded" | "Pending"
type VendorType = "Internal" | "External"
type Specialty =
  | "Photography"
  | "Videography"
  | "Drone"
  | "Twilight"
  | "Floor Plans"
  | "Matterport"
  | "3D Tours"
  | "Sign Installation"
  | "Virtual Staging"
  | "AI Design"
  | "Print"

export type Vendor = {
  name: string
  company: string
  email: string
  phone: string
  image: string
  title: string
  region: string
  serviceArea: string
  type: VendorType
  status: VendorStatus
  specialties: Specialty[]
  todayLoad: number
  capacity: number
  openJobs: number
  reliability: number
  nextAvailability: string
  jobsCompleted: number
  onTimeRate: number
  qualityScore: string
  billingTerms: string
  bridgeAttempts?: BridgeAttempt[]
}

const initialVendors: Vendor[] = [
  {
    name: "Jamie Smith",
    company: "Smith Media Co.",
    email: "jamie@smithmedia.co",
    phone: "604.555.0198",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80",
    title: "Photographer & Videographer",
    region: "Vancouver, BC",
    serviceArea: "Lower Mainland",
    type: "External",
    status: "Available",
    specialties: ["Photography", "Videography", "Drone", "Twilight"],
    todayLoad: 2,
    capacity: 5,
    openJobs: 1,
    reliability: 96,
    nextAvailability: "Tomorrow",
    jobsCompleted: 148,
    onTimeRate: 97,
    qualityScore: "4.9 / 5",
    billingTerms: "Net 15 / ACH on file",
  },
  {
    name: "Taylor Cole",
    company: "Taylor Cole Studio",
    email: "taylor@colephoto.com",
    phone: "512.555.0142",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
    title: "Photographer",
    region: "Austin, TX",
    serviceArea: "Central TX",
    type: "External",
    status: "Scheduled",
    specialties: ["Photography", "Drone"],
    todayLoad: 4,
    capacity: 5,
    openJobs: 2,
    reliability: 92,
    nextAvailability: "May 13",
    jobsCompleted: 91,
    onTimeRate: 94,
    qualityScore: "4.7 / 5",
    billingTerms: "Net 30 / ACH on file",
  },
  {
    name: "FloorPlan Pros",
    company: "FloorPlan Pros",
    email: "dispatch@floorplanpros.com",
    phone: "888.555.0111",
    image: "",
    title: "Drafting Partner",
    region: "Nationwide",
    serviceArea: "Remote",
    type: "External",
    status: "Available",
    specialties: ["Floor Plans"],
    todayLoad: 1,
    capacity: 5,
    openJobs: 0,
    reliability: 98,
    nextAvailability: "Today",
    jobsCompleted: 212,
    onTimeRate: 99,
    qualityScore: "4.8 / 5",
    billingTerms: "Net 15 / monthly invoice",
  },
  {
    name: "Visual Space 3D",
    company: "Visual Space 3D",
    email: "jobs@visualspace3d.ca",
    phone: "604.555.0109",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
    title: "Matterport Specialist",
    region: "Vancouver, BC",
    serviceArea: "Lower Mainland",
    type: "External",
    status: "Overloaded",
    specialties: ["Matterport", "3D Tours"],
    todayLoad: 6,
    capacity: 5,
    openJobs: 4,
    reliability: 88,
    nextAvailability: "May 16",
    jobsCompleted: 76,
    onTimeRate: 88,
    qualityScore: "4.6 / 5",
    billingTerms: "Net 30 / wire",
  },
  {
    name: "SignCo Installations",
    company: "SignCo",
    email: "schedule@signco.com",
    phone: "604.555.0188",
    image: "",
    title: "Sign Installation",
    region: "Vancouver, BC",
    serviceArea: "Lower Mainland",
    type: "Internal",
    status: "Available",
    specialties: ["Sign Installation"],
    todayLoad: 0,
    capacity: 4,
    openJobs: 0,
    reliability: 95,
    nextAvailability: "Today",
    jobsCompleted: 123,
    onTimeRate: 96,
    qualityScore: "4.8 / 5",
    billingTerms: "Internal transfer",
  },
  {
    name: "DesignHouse",
    company: "DesignHouse",
    email: "studio@designhouse.ai",
    phone: "415.555.0167",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=80",
    title: "Virtual Staging Studio",
    region: "Remote",
    serviceArea: "Worldwide",
    type: "External",
    status: "Pending",
    specialties: ["Virtual Staging", "AI Design"],
    todayLoad: 2,
    capacity: 4,
    openJobs: 1,
    reliability: 90,
    nextAvailability: "May 15",
    jobsCompleted: 64,
    onTimeRate: 91,
    qualityScore: "4.5 / 5",
    billingTerms: "Prepaid credits",
  },
]

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function statusClass(status: VendorStatus) {
  if (status === "Available") return "border-green-200 bg-green-50 text-green-700"
  if (status === "Scheduled") return "border-blue-200 bg-blue-50 text-blue-700"
  if (status === "Overloaded") return "border-red-200 bg-red-50 text-red-700"
  return "border-amber-200 bg-amber-50 text-amber-700"
}

function loadClass(vendor: Vendor) {
  if (vendor.todayLoad > vendor.capacity) return "text-red-600"
  if (vendor.todayLoad === vendor.capacity) return "text-amber-600"
  return ""
}

export function VendorsPageShell({
  initialAccess,
  liveVendors = [],
  liveSourceLabel,
  liveEmptyReason,
  assignmentCandidates = [],
}: {
  initialAccess?: WorkspaceAccessSnapshot
  liveVendors?: Vendor[]
  liveSourceLabel?: string
  liveEmptyReason?: string | null
  assignmentCandidates?: VendorAssignmentCandidate[]
}) {
  const startingVendors = liveVendors.length ? liveVendors : initialVendors
  const vendors = startingVendors
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(
    startingVendors[0] ?? null
  )
  const [activeSpecialty, setActiveSpecialty] = React.useState("All")
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [regionFilter, setRegionFilter] = React.useState("all")
  const [availabilityFilter, setAvailabilityFilter] = React.useState("any")
  const [typeFilter, setTypeFilter] = React.useState("all")

  const specialties = [
    ["All", vendors.length],
    ["Photography", vendors.filter((vendor) => vendor.specialties.includes("Photography")).length],
    ["Drafters", vendors.filter((vendor) => vendor.specialties.includes("Floor Plans")).length],
    ["Editors", vendors.filter((vendor) => vendor.specialties.some((item) => ["Virtual Staging", "AI Design"].includes(item))).length],
    ["Sign Installers", vendors.filter((vendor) => vendor.specialties.includes("Sign Installation")).length],
    ["Print", vendors.filter((vendor) => vendor.specialties.includes("Print")).length],
  ] as const

  const filteredVendors = vendors.filter((vendor) => {
    const haystack = `${vendor.name} ${vendor.company} ${vendor.title} ${vendor.region} ${vendor.serviceArea} ${vendor.specialties.join(" ")}`.toLowerCase()
    const matchesSpecialty =
      activeSpecialty === "All" ||
      (activeSpecialty === "Drafters" &&
        vendor.specialties.includes("Floor Plans")) ||
      (activeSpecialty === "Editors" &&
        vendor.specialties.some((item) => ["Virtual Staging", "AI Design"].includes(item))) ||
      (activeSpecialty === "Sign Installers" &&
        vendor.specialties.includes("Sign Installation")) ||
      vendor.specialties.includes(activeSpecialty as Specialty)

    return (
      haystack.includes(query.toLowerCase()) &&
      matchesSpecialty &&
      (statusFilter === "all" || vendor.status === statusFilter) &&
      (regionFilter === "all" || vendor.region === regionFilter) &&
      (availabilityFilter === "any" ||
        (availabilityFilter === "today" && vendor.nextAvailability === "Today") ||
        (availabilityFilter === "overloaded" && vendor.todayLoad > vendor.capacity)) &&
      (typeFilter === "all" || vendor.type === typeFilter)
    )
  })

  return (
    <RoleProvider initialAccess={initialAccess}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Vendors" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    Vendors
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage portal-native vendor drafts, assignments,
                    specialties, upload scope, and dry-run bridge review
                    without touching TimeTap or Stripe.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <AddVendorDialog />
                  <Button variant="outline">
                    <UserRoundCheckIcon />
                    Assign Work
                  </Button>
                  <Button variant="outline">
                    <DownloadIcon />
                    Export
                  </Button>
                </div>
              </section>

              <section className="rounded-lg border bg-card">
                <div className="flex flex-col gap-2 border-b bg-muted/20 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">
                      {liveVendors.length
                        ? "Live Supabase vendor mirror"
                        : "Prototype vendor workspace"}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {liveSourceLabel ??
                        "Static sample data only; no legacy system is contacted."}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {liveVendors.length ? "read-only" : "sample"}
                  </Badge>
                </div>
                {liveEmptyReason ? (
                  <div className="border-b bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
                    {liveEmptyReason} The local prototype examples remain visible
                    so the workspace can still be reviewed safely.
                  </div>
                ) : null}
                <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(240px,1fr)_repeat(4,150px)]">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by name or company"
                    />
                  </div>
                  <FilterSelect
                    label="Status"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={[
                      ["all", "All"],
                      ["Available", "Available"],
                      ["Scheduled", "Scheduled"],
                      ["Overloaded", "Overloaded"],
                      ["Pending", "Pending"],
                    ]}
                  />
                  <FilterSelect
                    label="Region"
                    value={regionFilter}
                    onValueChange={setRegionFilter}
                    options={[
                      ["all", "All regions"],
                      ...Array.from(new Set(vendors.map((vendor) => vendor.region))).map(
                        (region) => [region, region] as const
                      ),
                    ]}
                  />
                  <FilterSelect
                    label="Availability"
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                    options={[
                      ["any", "Any"],
                      ["today", "Today"],
                      ["overloaded", "Overloaded"],
                    ]}
                  />
                  <FilterSelect
                    label="Type"
                    value={typeFilter}
                    onValueChange={setTypeFilter}
                    options={[
                      ["all", "All"],
                      ["Internal", "Internal"],
                      ["External", "External"],
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <Tabs value={activeSpecialty} onValueChange={setActiveSpecialty}>
                    <TabsList className="flex-wrap justify-start">
                      {specialties.map(([label, count]) => (
                        <TabsTrigger key={label} value={label}>
                          {label}
                          <Badge variant="secondary">{count}</Badge>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Button variant="outline" size="sm">
                      Name A-Z
                    </Button>
                    <Button variant="outline" size="icon" className="size-8">
                      <ListFilterIcon />
                      <span className="sr-only">Toggle list view</span>
                    </Button>
                  </div>
                </div>

                <VendorLoadTable
                  vendors={filteredVendors}
                  onSelectVendor={setSelectedVendor}
                />

                <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
                  <span>
                    Showing 1 to {filteredVendors.length} of {vendors.length} vendors
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((page) => (
                      <Button
                        key={page}
                        variant={page === 1 ? "default" : "outline"}
                        size="icon"
                        className="size-8"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          </main>

          <Sheet
            open={Boolean(selectedVendor)}
            onOpenChange={(open) => {
              if (!open) setSelectedVendor(null)
            }}
          >
            <SheetContent className="w-full overflow-y-auto p-0 data-[side=right]:sm:max-w-xl">
              {selectedVendor ? (
                <VendorDetails
                  vendor={selectedVendor}
                  assignmentCandidates={assignmentCandidates}
                />
              ) : null}
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function VendorLoadTable({
  vendors,
  onSelectVendor,
}: {
  vendors: Vendor[]
  onSelectVendor: (vendor: Vendor) => void
}) {
  return (
    <div className="overflow-auto border-t">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="min-w-64">Vendor</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Today&apos;s Load</TableHead>
            <TableHead>Open Jobs</TableHead>
            <TableHead>Reliability</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow
              key={vendor.email}
              className="cursor-pointer hover:bg-muted/40"
              onClick={() => onSelectVendor(vendor)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={vendor.image} alt={vendor.name} />
                    <AvatarFallback>{initialsFor(vendor.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">{vendor.company}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{vendor.specialties.slice(0, 2).join(", ")}</TableCell>
              <TableCell>{vendor.region}</TableCell>
              <TableCell className={loadClass(vendor)}>
                {vendor.todayLoad} / {vendor.capacity}
              </TableCell>
              <TableCell>{vendor.openJobs}</TableCell>
              <TableCell>{vendor.reliability}%</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClass(vendor.status)}>
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell>{vendor.nextAvailability}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function VendorDetails({
  vendor,
  assignmentCandidates,
}: {
  vendor: Vendor
  assignmentCandidates: VendorAssignmentCandidate[]
}) {
  return (
    <>
      <SheetHeader className="border-b p-5 pr-12">
        <div className="flex items-start gap-4">
          <Avatar className="size-20">
            <AvatarImage src={vendor.image} alt={vendor.name} />
            <AvatarFallback>{initialsFor(vendor.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-xl">{vendor.name}</SheetTitle>
              <Badge variant="outline" className={statusClass(vendor.status)}>
                {vendor.status}
              </Badge>
            </div>
            <SheetDescription className="mt-1">{vendor.title}</SheetDescription>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="size-4" />
              <span>{vendor.region}</span>
              <span>/</span>
              <span>{vendor.serviceArea}</span>
            </div>
          </div>
        </div>
      </SheetHeader>
      <div className="grid gap-4 p-5">
        <SideSection
          title="Contact"
          action={
            <Button variant="ghost" size="icon-sm">
              <EllipsisIcon />
              <span className="sr-only">Contact actions</span>
            </Button>
          }
        >
          <InfoRow icon={<MailIcon />} value={vendor.email} />
          <InfoRow icon={<PhoneIcon />} value={vendor.phone} />
        </SideSection>
        <SideSection title="Specialties">
          <div className="flex flex-wrap gap-2">
            {vendor.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </SideSection>
        <SideSection title="Service Area">
          <InfoRow icon={<MapPinIcon />} value={`${vendor.serviceArea} / ${vendor.region}`} />
        </SideSection>
        <SideSection title="Performance (Last 90 Days)">
          <div className="grid gap-3 sm:grid-cols-4">
            <PerformanceStat value={`${vendor.jobsCompleted}`} label="Jobs Completed" />
            <PerformanceStat value={`${vendor.onTimeRate}%`} label="On-Time Rate" />
            <PerformanceStat value={vendor.qualityScore} label="Quality Score" />
            <PerformanceStat value={`${vendor.reliability}%`} label="Reliability" ring />
          </div>
        </SideSection>
        <SideSection
          title="Current Assignments (2)"
          action={<Button variant="link" className="h-auto px-0">View all</Button>}
        >
          <AssignmentRow address="1238 Homer St, Vancouver, BC" service="Photography" date="May 10, 2026 / 10:00 AM" status="Scheduled" />
          <AssignmentRow address="456 W 14th Ave, Vancouver, BC" service="Videography" date="May 11, 2026 / 1:00 PM" status="Scheduled" />
        </SideSection>
        <SideSection
          title="Recently Completed"
          action={<Button variant="link" className="h-auto px-0">View all</Button>}
        >
          <AssignmentRow address="789 Arbutus St, Vancouver, BC" service="Completed May 4, 2026" date="" status="Completed" />
          <AssignmentRow address="2408 Point Grey Rd, Vancouver, BC" service="Completed May 2, 2026" date="" status="Completed" />
        </SideSection>
        <SideSection title="Billing & Terms">
          <div className="text-sm">{vendor.billingTerms}</div>
          <div className="text-sm text-muted-foreground">Payout email: payments@{vendor.email.split("@")[1]}</div>
          <Button variant="outline" className="mt-2 w-full">View portal billing notes</Button>
        </SideSection>
        {vendor.bridgeAttempts?.length ? (
          <SideSection title="Dry-run Bridge Queue">
            <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3 text-xs leading-5 text-blue-900">
              These sanitized payloads are for Reala review only. They do
              not create TimeTap staff, Stripe customers, payouts, cards, or
              legacy records.
            </div>
            {vendor.bridgeAttempts.map((attempt) => (
              <div key={`${attempt.integration}-${attempt.action}`} className="rounded-md border bg-muted/25 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">
                    {attempt.integration} · {attempt.action}
                  </div>
                  <Badge variant="outline">{attempt.status}</Badge>
                </div>
                <div className="mt-2 text-xs leading-5 text-muted-foreground">
                  {attempt.reason}
                </div>
              </div>
            ))}
          </SideSection>
        ) : null}
      </div>
      <div className="sticky bottom-0 grid gap-2 border-t bg-background p-5">
        <CreatePortalAssignmentDialog
          vendor={vendor}
          assignmentCandidates={assignmentCandidates}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">
            <CalendarDaysIcon />
            View Schedule
          </Button>
          <Button variant="outline">
            <Edit3Icon />
            Edit Profile
          </Button>
          <Button variant="outline" className="col-span-2">
            <PauseCircleIcon />
            Pause Vendor
          </Button>
        </div>
      </div>
    </>
  )
}

function CreatePortalAssignmentDialog({
  vendor,
  assignmentCandidates,
}: {
  vendor: Vendor
  assignmentCandidates: VendorAssignmentCandidate[]
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = React.useState(
    assignmentCandidates[0]?.id ?? "manual"
  )
  const [state, formAction] = React.useActionState(
    createVendorAssignmentDraftAction,
    initialPortalIntakeActionState
  )
  const lastRequestId = React.useRef<string | undefined>(undefined)
  const selectedCandidate = assignmentCandidates.find(
    (candidate) => candidate.id === selectedCandidateId
  )

  React.useEffect(() => {
    if (!state.publicRequestId || state.publicRequestId === lastRequestId.current) {
      return
    }

    lastRequestId.current = state.publicRequestId
    setOpen(false)

    if (state.ok) {
      toast.success("Assignment draft sent for review", {
        description:
          "Created a portal-only job draft. TimeTap, legacy jobs, folders, vendor notifications, and Stripe were not touched.",
      })
    } else {
      toast.warning("Assignment draft needs persistence setup", {
        description: state.message,
      })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 text-white hover:bg-red-700">
          Create Portal Assignment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create Portal Assignment</DialogTitle>
            <DialogDescription>
              Draft an assignment for Reala staff review. This does not
              create a TimeTap appointment, legacy job, folder, vendor
              notification, or payment action.
            </DialogDescription>
          </DialogHeader>
          <input type="hidden" name="vendorName" value={vendor.name} />
          <input type="hidden" name="vendorEmail" value={vendor.email} />
          <input type="hidden" name="vendorCompany" value={vendor.company} />
          <input
            type="hidden"
            name="vendorSpecialty"
            value={vendor.specialties[0] ?? vendor.title}
          />
          <input
            type="hidden"
            name="selectedCandidateId"
            value={selectedCandidate?.id ?? ""}
          />
          <input
            type="hidden"
            name="listingId"
            value={selectedCandidate?.listingId ?? ""}
          />
          <input
            type="hidden"
            name="orderId"
            value={selectedCandidate?.orderId ?? ""}
          />
          <input
            type="hidden"
            name="orderItemId"
            value={selectedCandidate?.orderItemId ?? ""}
          />
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <div className="font-medium">{vendor.name}</div>
            <div className="mt-1 text-muted-foreground">
              {vendor.company} · {vendor.specialties.join(", ")}
            </div>
          </div>
          {assignmentCandidates.length ? (
            <Field label="Portal listing/order candidate">
              <Select
                value={selectedCandidateId}
                onValueChange={(nextValue) => {
                  if (nextValue) setSelectedCandidateId(nextValue)
                }}
                items={[
                  ...assignmentCandidates.map((candidate) => ({
                    value: candidate.id,
                    label: `${candidate.listingAddress} / ${candidate.serviceName}`,
                  })),
                  {
                    value: "manual",
                    label: "Manual portal draft / not linked yet",
                  },
                ]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a portal order item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {assignmentCandidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        <div className="grid gap-0.5">
                          <span>{candidate.listingAddress}</span>
                          <span className="text-xs text-muted-foreground">
                            {candidate.serviceName} · {candidate.orderStatus} ·{" "}
                            {candidate.estimateLabel}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="manual">
                      Manual portal draft / not linked yet
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          {selectedCandidate ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 text-xs leading-5 text-emerald-900">
              Linked to portal order {selectedCandidate.orderId.slice(0, 8)} and
              listing {selectedCandidate.listingAddress}. This is still a
              review draft; no live assignment is created.
            </div>
          ) : null}
          <Field label={selectedCandidate ? "Listing / job address" : "Listing / job address"}>
            <Input
              key={`address-${selectedCandidate?.id ?? "manual"}`}
              name="listingAddress"
              defaultValue={selectedCandidate?.listingAddress ?? ""}
              placeholder="1238 Homer St, Vancouver, BC"
              readOnly={Boolean(selectedCandidate)}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Service type">
              <Input
                key={`service-${selectedCandidate?.id ?? "manual"}`}
                name="serviceType"
                defaultValue={
                  selectedCandidate?.serviceName ??
                  vendor.specialties[0] ??
                  "Photography"
                }
                readOnly={Boolean(selectedCandidate)}
              />
            </Field>
            <Field label="Requested date">
              <Input name="requestedDate" type="date" />
            </Field>
          </div>
          <Field label="Preferred scheduling window">
            <Input name="requestedWindow" placeholder="Morning, afternoon, or staff-confirmed time" />
          </Field>
          <Field label="Requirements">
            <Textarea
              name="requirements"
              placeholder="Access notes, shot list, floor-plan scope, upload requirements, or staff instructions"
            />
          </Field>
          <div className="rounded-md border border-blue-200 bg-blue-50/70 p-3 text-xs leading-5 text-blue-900">
            The assignment appears in Portal Intake Review as a dry-run item.
            Staff can approve manual entry later, but this form itself cannot
            write to legacy systems.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitPortalAssignmentButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubmitPortalAssignmentButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating draft..." : "Send for review"}
    </Button>
  )
}

function AddVendorDialog() {
  const [open, setOpen] = React.useState(false)
  const [state, formAction] = React.useActionState(
    createVendorOnboardingAccessRequestAction,
    initialActionState
  )
  const lastRequestId = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    if (!state.publicRequestId || state.publicRequestId === lastRequestId.current) {
      return
    }

    lastRequestId.current = state.publicRequestId
    setOpen(false)

    if (state.ok) {
      toast.success("Vendor draft sent for admin review", {
        description:
          "Created a portal-native request only. TimeTap, Stripe, legacy records, folders, and payouts were not touched.",
      })
    } else {
      toast.warning("Vendor draft needs persistence setup", {
        description: state.message,
      })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusIcon />
          Create Draft Vendor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create Draft Vendor</DialogTitle>
            <DialogDescription>
              Create a portal-native vendor onboarding request and dry-run
              TimeTap/Stripe payloads for Reala review. This does not touch
              TimeTap, Stripe, legacy MySQL, payouts, folders, or appointments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vendor name">
              <Input name="vendorName" placeholder="Jordan Media" required />
            </Field>
            <Field label="Company">
              <Input name="companyName" placeholder="Jordan Media Co." />
            </Field>
            <Field label="Email">
              <Input
                name="vendorEmail"
                type="email"
                placeholder="dispatch@vendor.com"
                required
              />
            </Field>
            <Field label="Region">
              <Input name="region" defaultValue="Vancouver, BC" />
            </Field>
            <Field label="Specialty">
              <SimpleSelect
                name="specialty"
                defaultValue="Photography"
                options={[
                  ["Photography", "Photography"],
                  ["Videography", "Videography"],
                  ["Floor Plans", "Floor Plans"],
                  ["Matterport", "Matterport"],
                  ["Sign Installation", "Sign Installation"],
                  ["Virtual Staging", "Virtual Staging"],
                  ["Print", "Print"],
                ]}
              />
            </Field>
          </div>
          <Field label="Billing notes">
            <Textarea
              name="billingNotes"
              placeholder="Net terms, payout method, insurance, capacity, or onboarding notes"
            />
          </Field>
          <div className="rounded-md border border-blue-200 bg-blue-50/70 p-3 text-xs leading-5 text-blue-900">
            Submit creates an Access Requests queue item. A Reala admin can
            review the vendor, inspect sanitized TimeTap/Stripe would-write
            payloads, and decide on manual setup later.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitVendorButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubmitVendorButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating draft..." : "Send for admin review"}
    </Button>
  )
}

function SideSection({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card size="sm" className="gap-3 rounded-lg py-0 shadow-none">
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto] px-4 pt-4">
        <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </CardTitle>
        {action ? <div className="justify-self-end">{action}</div> : null}
      </CardHeader>
      <CardContent className="grid gap-3 px-4 pb-4">{children}</CardContent>
    </Card>
  )
}

function PerformanceStat({
  value,
  label,
  ring = false,
}: {
  value: string
  label: string
  ring?: boolean
}) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/20 px-3 py-3 text-center">
      <div
        className={
          ring
            ? "mx-auto flex size-14 items-center justify-center rounded-full border-2 border-green-600 text-base font-semibold text-foreground"
            : "min-h-14 content-center text-xl font-semibold text-foreground"
        }
      >
        {value}
      </div>
      <div className="mt-2 text-xs leading-snug text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <span>{value}</span>
    </div>
  )
}

function AssignmentRow({
  address,
  service,
  date,
  status,
}: {
  address: string
  service: string
  date: string
  status: "Scheduled" | "Completed"
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-muted/40 p-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{address}</div>
        <div className="truncate text-xs text-muted-foreground">
          {[service, date].filter(Boolean).join(" / ")}
        </div>
      </div>
      <Badge variant="outline" className={status === "Completed" ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-blue-50 text-blue-700"}>
        {status}
      </Badge>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: readonly (readonly [string, string])[]
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onValueChange(nextValue)
        }
      }}
      items={options.map(([optionValue, optionLabel]) => ({
        value: optionValue,
        label: optionLabel,
      }))}
    >
      <SelectTrigger>
        <span className="text-xs text-muted-foreground">{label}</span>
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
  )
}

function SimpleSelect({
  name,
  defaultValue,
  options,
}: {
  name?: string
  defaultValue: string
  options: readonly (readonly [string, string])[]
}) {
  return (
    <Select
      name={name}
      defaultValue={defaultValue}
      items={options.map(([optionValue, optionLabel]) => ({
        value: optionValue,
        label: optionLabel,
      }))}
    >
      <SelectTrigger>
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
  )
}

const initialActionState: AccessRequestActionState = {
  ok: false,
}

const initialPortalIntakeActionState: PortalIntakeActionState = {
  ok: false,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
