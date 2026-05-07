"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  AlertTriangleIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  ExternalLinkIcon,
  FileTextIcon,
  FilterIcon,
  HomeIcon,
  ImageIcon,
  LockIcon,
  MessageSquareIcon,
  TruckIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EventManager, type Event } from "@/components/ui/event-manager"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const jobEvents: Event[] = [
  {
    id: "job-1008",
    title: "Twilight photo shoot",
    description: "Exterior twilight package, drone pass, and amenity stills.",
    startTime: new Date(2026, 3, 27, 17, 0),
    endTime: new Date(2026, 3, 27, 19, 0),
    color: "blue",
    category: "Shoot",
    location: "2149 Beverly Dr, Dallas, TX",
    status: "Crew confirmed",
    attendees: ["Maya Foster", "Skyline Photo"],
    tags: ["Sample data", "Gold Plan", "High priority"],
  },
  {
    id: "job-1012",
    title: "Floor plan scan",
    description: "Matterport capture and measured floor plan for Oak Avenue.",
    startTime: new Date(2026, 3, 28, 9, 0),
    endTime: new Date(2026, 3, 28, 10, 30),
    color: "green",
    category: "Shoot",
    location: "88 Lakewood Ct, Dallas, TX",
    status: "In route",
    attendees: ["Ryan Patel"],
    tags: ["Sample data", "Matterport"],
  },
  {
    id: "job-1017",
    title: "Proof review window",
    description: "Agent proofing deadline before MLS delivery.",
    startTime: new Date(2026, 3, 29, 11, 0),
    endTime: new Date(2026, 3, 29, 12, 0),
    color: "orange",
    category: "Delivery",
    location: "Remote",
    status: "Awaiting approval",
    attendees: ["Jamie Smith"],
    tags: ["Sample data", "Workflow deadline", "Approval"],
  },
  {
    id: "job-1021",
    title: "Virtual staging edit",
    description: "Living room and primary bedroom staging pass.",
    startTime: new Date(2026, 3, 30, 13, 0),
    endTime: new Date(2026, 3, 30, 15, 0),
    color: "purple",
    category: "Edit",
    location: "Production queue",
    status: "Assigned",
    attendees: ["Studio Ops"],
    tags: ["Sample data", "Portal job", "Virtual staging"],
  },
  {
    id: "job-1025",
    title: "Brokerage launch meeting",
    description: "Confirm recurring vendor coverage and billing cadence.",
    startTime: new Date(2026, 4, 1, 10, 0),
    endTime: new Date(2026, 4, 1, 11, 0),
    color: "slate",
    category: "Meeting",
    location: "Zoom",
    status: "Scheduled",
    attendees: ["David Chen", "Pejman A"],
    tags: ["Sample data", "Operations"],
  },
]

export function JobsPageShell({
  initialAccess,
  liveEvents = [],
  pendingReviewCount = 0,
  liveSourceLabel,
  liveEmptyReason,
  timeTapSummary,
}: {
  initialAccess?: WorkspaceAccessSnapshot
  liveEvents?: Event[]
  pendingReviewCount?: number
  liveSourceLabel?: string
  liveEmptyReason?: string | null
  timeTapSummary?: {
    records: number
    calendars: number
    mismatches: number
    dailyDraftingMatches: number
    sourceLabel: string
  }
}) {
  const visibleEvents = liveEvents.length ? liveEvents : jobEvents
  const [selectedJob, setSelectedJob] = React.useState<Event | null>(null)
  const [sourceFilter, setSourceFilter] = React.useState("All")
  const [serviceFilter, setServiceFilter] = React.useState("All")
  const [staffFilter, setStaffFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [mismatchFilter, setMismatchFilter] = React.useState("All")
  const sourceOptions = React.useMemo(
    () => uniqueOptions(visibleEvents.map((event) => event.source ?? event.tags?.[0])),
    [visibleEvents]
  )
  const serviceOptions = React.useMemo(
    () => uniqueOptions(visibleEvents.flatMap((event) => event.serviceTypes ?? [])),
    [visibleEvents]
  )
  const staffOptions = React.useMemo(
    () => uniqueOptions(visibleEvents.map((event) => event.staff ?? event.attendees?.[0])),
    [visibleEvents]
  )
  const statusOptions = React.useMemo(
    () => uniqueOptions(visibleEvents.map((event) => event.status)),
    [visibleEvents]
  )
  const mismatchOptions = React.useMemo(
    () => uniqueOptions(visibleEvents.map((event) => event.mismatchState)),
    [visibleEvents]
  )
  const filteredEvents = React.useMemo(
    () =>
      visibleEvents.filter((event) => {
        const matchesSource = sourceFilter === "All" || event.source === sourceFilter || event.tags?.includes(sourceFilter)
        const matchesService =
          serviceFilter === "All" || event.serviceTypes?.includes(serviceFilter)
        const matchesStaff =
          staffFilter === "All" || event.staff === staffFilter || event.attendees?.includes(staffFilter)
        const matchesStatus = statusFilter === "All" || event.status === statusFilter
        const matchesMismatch =
          mismatchFilter === "All" || event.mismatchState === mismatchFilter

        return (
          matchesSource &&
          matchesService &&
          matchesStaff &&
          matchesStatus &&
          matchesMismatch
        )
      }),
    [
      mismatchFilter,
      serviceFilter,
      sourceFilter,
      staffFilter,
      statusFilter,
      visibleEvents,
    ]
  )

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
          <SiteHeader title="Jobs" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    Jobs
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Schedule shoots, edit windows, delivery deadlines, and vendor
                    handoffs across TimeTap, Daily Drafting, and portal workflow
                    mirrors. This page is read-only and does not mutate TimeTap,
                    Google Sheets, Stripe, folders, or legacy records.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">
                      {liveEvents.length ? "TimeTap parity mirror" : "Sample mode"}
                    </Badge>
                    <span>{liveSourceLabel ?? "Static prototype schedule"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline">
                    <CalendarDaysIcon />
                    Availability
                  </Button>
                  <Button>
                    <TruckIcon />
                    Dispatch job
                  </Button>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <JobMetric
                  icon={<Clock3Icon className="size-5 text-blue-700" />}
                  label="Mirror Events"
                  value={`${filteredEvents.length}`}
                  detail={
                    liveEvents.length
                      ? "TimeTap, Daily Drafting, and portal job projections currently visible."
                      : "Prototype shoots, edits, and delivery examples."
                  }
                />
                <JobMetric
                  icon={<CheckCircle2Icon className="size-5 text-green-700" />}
                  label="Calendars"
                  value={`${timeTapSummary?.calendars ?? 0}`}
                  detail={`${timeTapSummary?.dailyDraftingMatches ?? 0} Daily Drafting row matches.`}
                />
                <JobAttentionCard mismatchCount={timeTapSummary?.mismatches ?? 3} />
                {pendingReviewCount ? (
                  <JobMetric
                    icon={<AlertTriangleIcon className="size-5 text-red-700" />}
                    label="Pending Review"
                    value={`${pendingReviewCount}`}
                    detail="Portal assignment drafts waiting for Reala staff review."
                  />
                ) : null}
              </section>

              <section className="grid gap-3 rounded-lg border bg-card p-3 lg:grid-cols-[auto_repeat(5,minmax(0,1fr))] lg:items-end">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FilterIcon className="size-4 text-muted-foreground" />
                  Mirror filters
                </div>
                <FilterSelect label="Source" value={sourceFilter} options={sourceOptions} onChange={setSourceFilter} />
                <FilterSelect label="Service" value={serviceFilter} options={serviceOptions} onChange={setServiceFilter} />
                <FilterSelect label="Staff / vendor" value={staffFilter} options={staffOptions} onChange={setStaffFilter} />
                <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
                <FilterSelect label="Mismatch" value={mismatchFilter} options={mismatchOptions} onChange={setMismatchFilter} />
              </section>

              <section className="min-w-0 overflow-hidden rounded-lg border bg-card">
                {liveEmptyReason ? (
                  <div className="border-b bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
                    {liveEmptyReason} The sample calendar remains visible for
                    safe product review.
                  </div>
                ) : null}
                <EventManager
                  events={filteredEvents}
                  categories={["Photography", "Floor Plan", "Matterport", "Delivery", "Printing", "Meeting", "Review"]}
                  defaultView="week"
                  onEventClick={setSelectedJob}
                />
              </section>
            </div>
          </main>

          <Sheet
            open={Boolean(selectedJob)}
            onOpenChange={(open) => {
              if (!open) setSelectedJob(null)
            }}
          >
            <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
              {selectedJob && <JobDetails job={selectedJob} />}
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function JobMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          {icon}
        </div>
        <div>
          <div className="text-xs font-medium uppercase text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
        </div>
      </div>
    </div>
  )
}

function JobAttentionCard({ mismatchCount }: { mismatchCount: number }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <AlertTriangleIcon className="text-destructive" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-xs font-medium uppercase text-muted-foreground">
                Needs Attention
              </div>
              <div className="mt-1 text-2xl font-semibold">{mismatchCount}</div>
            </div>
            <Badge variant="outline" className="shrink-0">
              Review
            </Badge>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <span className="truncate text-muted-foreground">
                Proofs waiting
              </span>
              <span className="font-semibold">2</span>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <span className="truncate text-muted-foreground">
                Vendor unconfirmed
              </span>
              <span className="font-semibold">{mismatchCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function JobDetails({ job }: { job: Event }) {
  const listingImage =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=240&h=160&q=80"
  const scheduledDate = job.startTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const scheduledWindow = `${job.startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} - ${job.endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`
  const assignee = job.attendees?.[0] ?? "Unassigned"
  const legacy = job.legacy

  return (
    <>
      <SheetHeader className="border-b p-5 pr-12">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{job.category}</Badge>
              <Badge variant="outline">{job.status ?? "Scheduled"}</Badge>
              {job.source ? <Badge variant="outline">{job.source}</Badge> : null}
            </div>
            <SheetTitle className="text-xl">
              {job.location ?? job.title}
            </SheetTitle>
            <SheetDescription>
              {job.title}
            </SheetDescription>
          </div>
          <div
            role="img"
            aria-label="Modern home exterior"
            className="h-16 w-24 shrink-0 rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${listingImage})` }}
          />
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <section className="flex flex-col gap-4 p-5">
          <SideSheetSection title="Assignee">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {assignee
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{assignee}</div>
                  <div className="text-xs text-muted-foreground">
                    214.555.0198
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm">
                <MessageSquareIcon />
                <span className="sr-only">Message assignee</span>
              </Button>
            </div>
          </SideSheetSection>

          <Separator />

          <SideSheetSection
            title="Schedule"
            action={
              <Button variant="outline" size="sm">
                Review
              </Button>
            }
          >
            <IconRow icon={<CalendarDaysIcon />}>
              <div className="font-medium">{scheduledDate}</div>
              <div className="text-muted-foreground">{scheduledWindow}</div>
            </IconRow>
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Linked Records">
            <LinkedRow
              icon={<FileTextIcon />}
              label="Order"
              value={legacy?.timeTapCalendarId ? `TimeTap ${legacy.timeTapCalendarId}` : "No TimeTap match"}
            />
            <LinkedRow
              icon={<HomeIcon />}
              label="Listing"
              value={job.location ?? "123 Main Street"}
            />
          </SideSheetSection>

          {legacy ? (
            <>
              <Separator />

              <SideSheetSection title="TimeTap / Daily Drafting Mirror">
                <LinkedRow
                  icon={<CalendarDaysIcon />}
                  label="Appointment"
                  value={legacy.timeTapAppointmentId ?? "No appointment id"}
                />
                <LinkedRow
                  icon={<FileTextIcon />}
                  label="Calendar"
                  value={legacy.calendarName ?? "Unknown calendar"}
                />
                <LinkedRow
                  icon={<HomeIcon />}
                  label="Client / realtor"
                  value={[legacy.client, legacy.realtor].filter(Boolean).join(" / ")}
                />
                <LinkedRow
                  icon={<FileTextIcon />}
                  label="Daily Drafting"
                  value={
                    legacy.dailyDrafting?.row
                      ? `Row ${legacy.dailyDrafting.row} · ${legacy.dailyDrafting.status}`
                      : legacy.dailyDrafting?.status ?? "No row match"
                  }
                />
              </SideSheetSection>

              <Separator />

              <SideSheetSection title="Scheduler Product Fields">
                <div className="grid gap-2 text-sm">
                  <FactLine label="Services" value={job.serviceTypes?.join(", ")} />
                  <FactLine label="Photo" value={legacy.schedulerFields?.photoType} />
                  <FactLine label="Floor plan" value={legacy.schedulerFields?.floorPlanType} />
                  <FactLine label="Matterport" value={legacy.schedulerFields?.matterportType} />
                  <FactLine label="Video" value={legacy.schedulerFields?.videoType} />
                  <FactLine label="Print" value={legacy.schedulerFields?.printedMaterialType} />
                  <FactLine label="Folder signal" value={legacy.schedulerFields?.folderStatus} />
                </div>
              </SideSheetSection>

              <Separator />

              <SideSheetSection title="Bridge Readiness">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
                  {legacy.noWriteNote}
                </div>
                {legacy.exceptions?.length ? (
                  <div className="grid gap-2">
                    {legacy.exceptions.map((exception) => (
                      <div key={exception} className="rounded-lg border bg-muted/30 p-2 text-sm">
                        {exception}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No open parity exceptions attached to this event.
                  </div>
                )}
                {legacy.bridgeChecklist?.length ? (
                  <div className="grid gap-2 text-sm">
                    {legacy.bridgeChecklist.map((item) => (
                      <IconRow key={item} icon={<CheckCircle2Icon />}>
                        <div>{item}</div>
                      </IconRow>
                    ))}
                  </div>
                ) : null}
              </SideSheetSection>
            </>
          ) : null}

          {job.tags?.length ? (
            <>
              <Separator />

              <SideSheetSection title="Source / Confidence">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </SideSheetSection>
            </>
          ) : null}

          <Separator />

          <SideSheetSection title="Requirements / Access">
            <IconRow icon={<LockIcon />}>
              <div className="font-medium">Lockbox: 1234</div>
              <div className="text-muted-foreground">Front door, side gate</div>
            </IconRow>
            <IconRow icon={<ImageIcon />}>
              <div className="font-medium">Interior, exterior, twilight</div>
              <div className="text-muted-foreground">
                25+ photos, MLS ready
              </div>
            </IconRow>
            <IconRow icon={<MessageSquareIcon />}>
              <div className="font-medium">Please capture backyard</div>
              <div className="text-muted-foreground">
                Include skyline angle if weather allows.
              </div>
            </IconRow>
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Proof / Delivery">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Photos uploaded</span>
              <span className="text-muted-foreground">18 / 34</span>
            </div>
            <Progress value={18} max={34} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Estimated delivery</span>
              <span>May 6, 2026 6:00 PM</span>
            </div>
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Status">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {["Scheduled", "On Site", "In Review", "Delivered"].map(
                (step, index) => (
                  <div key={step} className="flex flex-col items-center gap-1">
                    <div
                      className={
                        index < 3
                          ? "flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                          : "flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground"
                      }
                    >
                      {index < 2 ? <CheckCircle2Icon className="size-4" /> : index + 1}
                    </div>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                )
              )}
            </div>
          </SideSheetSection>
        </section>

        <div className="mt-auto grid gap-2 border-t p-5">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Preview Reassign</Button>
            <Button variant="outline">Flag Exception</Button>
          </div>
          <Button>
            Open Listing
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline">
            View Assets
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </>
  )
}

function SideSheetSection({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-medium uppercase text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function IconRow({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function LinkedRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <IconRow icon={icon}>
        <div className="text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </IconRow>
      <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground" />
    </div>
  )
}

function FactLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "Not mirrored"}</span>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 min-w-0 rounded-md border bg-background px-2 text-sm font-normal text-foreground"
      >
        {["All", ...options].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function uniqueOptions(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort()
}
