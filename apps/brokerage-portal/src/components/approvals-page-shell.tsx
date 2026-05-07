"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  FilterIcon,
  Maximize2Icon,
  MessageSquareIcon,
  SearchIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
import { cn } from "@/lib/utils"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type ApprovalStatus = "Pending" | "Changes Requested" | "Approved"

type Approval = {
  id: string
  type: string
  version: string
  listing: string
  city: string
  mls: string
  image: string
  requester: {
    name: string
    email: string
    phone: string
    image: string
  }
  owner: string
  team: string
  status: ApprovalStatus
  submitted: string
  due: string
  dueTone: "default" | "urgent" | "late"
  preview: string
  notes: string
  activity: Array<{ time: string; label: string; actor: string }>
}

const initialApprovals: Approval[] = [
  {
    id: "apr-1001",
    type: "Feature Sheet Proof",
    version: "Proof v2",
    listing: "123 Main Street",
    city: "Dallas, TX 75201",
    mls: "MLS 20567890",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Jamie Smith",
      email: "jamie@smithgroup.com",
      phone: "214.555.0198",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Sarah Johnson",
    team: "The Smith Group",
    status: "Pending",
    submitted: "May 10, 2026 10:24 AM",
    due: "May 12, 2026",
    dueTone: "urgent",
    preview:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=420&q=80",
    notes: "Updated pricing and open house information. Please review.",
    activity: [
      { time: "May 10, 10:24 AM", label: "Submitted for review", actor: "Jamie Smith" },
      { time: "May 10, 10:10 AM", label: "Proof v2 generated", actor: "System" },
    ],
  },
  {
    id: "apr-1002",
    type: "Virtual Staging Output",
    version: "Living Room",
    listing: "456 Oak Avenue",
    city: "Plano, TX 75024",
    mls: "MLS 20568122",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Riley Kim",
      email: "riley@cityviewrealty.com",
      phone: "214.555.0142",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Chris Davis",
    team: "Cityview Realty",
    status: "Changes Requested",
    submitted: "May 10, 2026 9:14 AM",
    due: "May 12, 2026",
    dueTone: "urgent",
    preview:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=420&q=80",
    notes: "Swap the sofa to a lighter fabric and remove the floor lamp.",
    activity: [
      { time: "May 10, 9:14 AM", label: "Changes requested", actor: "Riley Kim" },
      { time: "May 10, 8:42 AM", label: "Staging output uploaded", actor: "Studio Ops" },
    ],
  },
  {
    id: "apr-1003",
    type: "Gallery Publish",
    version: "32 Photos",
    listing: "789 Pine Drive",
    city: "Frisco, TX 75034",
    mls: "MLS 20568431",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Taylor Cole",
      email: "taylor@coleteam.com",
      phone: "214.555.0188",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Alice Morgan",
    team: "Morgan & Co.",
    status: "Pending",
    submitted: "May 9, 2026 4:32 PM",
    due: "May 11, 2026",
    dueTone: "late",
    preview:
      "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&fit=crop&w=420&q=80",
    notes: "Final photo order is ready for MLS and social launch.",
    activity: [
      { time: "May 9, 4:32 PM", label: "Gallery submitted", actor: "Taylor Cole" },
      { time: "May 9, 3:48 PM", label: "Retouching completed", actor: "Studio Ops" },
    ],
  },
  {
    id: "apr-1004",
    type: "Website Publish",
    version: "Single Property Site",
    listing: "321 Cedar Lane",
    city: "Dallas, TX 75205",
    mls: "MLS 20568644",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "James Wilson",
      email: "james@lifestyleliving.com",
      phone: "214.555.0176",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Bruce Lee",
    team: "Elevate Living",
    status: "Pending",
    submitted: "May 9, 2026 2:11 PM",
    due: "May 13, 2026",
    dueTone: "default",
    preview:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=420&q=80",
    notes: "Landing page copy, photos, and lead capture are ready.",
    activity: [
      { time: "May 9, 2:11 PM", label: "Website submitted", actor: "James Wilson" },
      { time: "May 9, 1:35 PM", label: "Domain preview generated", actor: "System" },
    ],
  },
  {
    id: "apr-1005",
    type: "Print Proof",
    version: "Brochure - Front/Back",
    listing: "654 Maple Court",
    city: "McKinney, TX 75071",
    mls: "MLS 20569001",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Maria Garcia",
      email: "maria@oakavenue.com",
      phone: "214.555.0131",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Maria Garcia",
    team: "Oak Avenue Realty",
    status: "Changes Requested",
    submitted: "May 9, 2026 11:03 AM",
    due: "May 11, 2026",
    dueTone: "late",
    preview:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=420&q=80",
    notes: "Needs brokerage disclosure updated before print.",
    activity: [
      { time: "May 9, 11:03 AM", label: "Revision requested", actor: "Maria Garcia" },
      { time: "May 9, 10:18 AM", label: "Print proof uploaded", actor: "Print Shop" },
    ],
  },
  {
    id: "apr-1006",
    type: "Virtual Staging Output",
    version: "Primary Bedroom",
    listing: "987 Lakeview Blvd",
    city: "Southlake, TX 76092",
    mls: "MLS 20569355",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "David Chen",
      email: "david.chen@smithgroup.com",
      phone: "214.555.0165",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "David Chen",
    team: "The Smith Group",
    status: "Approved",
    submitted: "May 8, 2026 5:42 PM",
    due: "-",
    dueTone: "default",
    preview:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=420&q=80",
    notes: "Approved staging output for delivery package.",
    activity: [
      { time: "May 8, 5:42 PM", label: "Approved", actor: "David Chen" },
      { time: "May 8, 4:55 PM", label: "Staging output uploaded", actor: "Studio Ops" },
    ],
  },
  {
    id: "apr-1007",
    type: "Feature Sheet Proof",
    version: "Proof v1",
    listing: "111 Sunset Drive",
    city: "Allen, TX 75013",
    mls: "MLS 20570018",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Sophie Lee",
      email: "sophie@coastviewrealty.com",
      phone: "214.555.0120",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "James Wilson",
    team: "Lifestyle Living",
    status: "Approved",
    submitted: "May 8, 2026 1:27 PM",
    due: "-",
    dueTone: "default",
    preview:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=420&q=80",
    notes: "Approved for email and flyer distribution.",
    activity: [
      { time: "May 8, 1:27 PM", label: "Approved", actor: "Sophie Lee" },
      { time: "May 8, 12:50 PM", label: "Proof generated", actor: "System" },
    ],
  },
  {
    id: "apr-1008",
    type: "Gallery Publish",
    version: "28 Photos",
    listing: "222 River Road",
    city: "Plano, TX 75093",
    mls: "MLS 20570564",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Brian Ray",
      email: "brian@elevateliving.com",
      phone: "214.555.0119",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Riley Kim",
    team: "Elevate Living",
    status: "Pending",
    submitted: "May 8, 2026 10:16 AM",
    due: "May 12, 2026",
    dueTone: "urgent",
    preview:
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=420&q=80",
    notes: "Gallery is ready after twilight photo replacement.",
    activity: [
      { time: "May 8, 10:16 AM", label: "Gallery submitted", actor: "Brian Ray" },
      { time: "May 8, 9:44 AM", label: "Twilight image replaced", actor: "Studio Ops" },
    ],
  },
  {
    id: "apr-1009",
    type: "Print Proof",
    version: "Postcard",
    listing: "890 Hillcrest Road",
    city: "Prosper, TX 75078",
    mls: "MLS 20570788",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Jamie Smith",
      email: "jamie@smithgroup.com",
      phone: "214.555.0198",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Taylor Cole",
    team: "The Cole Team",
    status: "Approved",
    submitted: "May 7, 2026 3:48 PM",
    due: "-",
    dueTone: "default",
    preview:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=420&q=80",
    notes: "Approved postcard proof.",
    activity: [
      { time: "May 7, 3:48 PM", label: "Approved", actor: "Jamie Smith" },
      { time: "May 7, 2:58 PM", label: "Postcard proof uploaded", actor: "Print Shop" },
    ],
  },
  {
    id: "apr-1010",
    type: "Website Publish",
    version: "Property Landing",
    listing: "751 Market Street",
    city: "Dallas, TX 75202",
    mls: "MLS 20571043",
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=560&q=80",
    requester: {
      name: "Michael Brown",
      email: "michael@smithgroup.com",
      phone: "214.555.0107",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=96&h=96&q=80",
    },
    owner: "Sarah Johnson",
    team: "The Smith Group",
    status: "Changes Requested",
    submitted: "May 7, 2026 9:05 AM",
    due: "May 10, 2026",
    dueTone: "late",
    preview:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=420&q=80",
    notes: "Hero copy needs the new offer deadline.",
    activity: [
      { time: "May 7, 9:05 AM", label: "Changes requested", actor: "Michael Brown" },
      { time: "May 7, 8:30 AM", label: "Website preview generated", actor: "System" },
    ],
  },
]

const metrics = [
  {
    label: "Pending",
    value: "18",
    detail: "Awaiting your review",
    icon: <Clock3Icon className="size-5 text-orange-600" />,
    tone: "bg-orange-100",
  },
  {
    label: "Needs Changes",
    value: "4",
    detail: "Action required",
    icon: <MessageSquareIcon className="size-5 text-red-600" />,
    tone: "bg-red-100",
  },
  {
    label: "Approved Today",
    value: "12",
    detail: "Across 9 listings",
    icon: <CheckIcon className="size-5 text-green-700" />,
    tone: "bg-green-100",
  },
]

export function ApprovalsPageShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const [approvalItems, setApprovalItems] = React.useState(initialApprovals)
  const [selectedApproval, setSelectedApproval] = React.useState<Approval | null>(
    null
  )
  const [query, setQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("All types")
  const [statusFilter, setStatusFilter] = React.useState("All status")
  const [ownerFilter, setOwnerFilter] = React.useState("All owners")
  const [sortBy, setSortBy] = React.useState("Newest first")

  const approvalTypes = React.useMemo(
    () => ["All types", ...Array.from(new Set(approvalItems.map((item) => item.type)))],
    [approvalItems]
  )
  const owners = React.useMemo(
    () => ["All owners", ...Array.from(new Set(approvalItems.map((item) => item.owner)))],
    [approvalItems]
  )
  const displayedApprovals = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return approvalItems
      .filter((approval) => {
        const matchesQuery =
          !normalizedQuery ||
          [approval.type, approval.version, approval.listing, approval.city, approval.requester.name, approval.owner]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        const matchesType = typeFilter === "All types" || approval.type === typeFilter
        const matchesStatus = statusFilter === "All status" || approval.status === statusFilter
        const matchesOwner = ownerFilter === "All owners" || approval.owner === ownerFilter

        return matchesQuery && matchesType && matchesStatus && matchesOwner
      })
      .sort((a, b) => {
        if (sortBy === "Due soon") {
          return dueRank(a) - dueRank(b)
        }

        if (sortBy === "Status") {
          return statusRank(a.status) - statusRank(b.status)
        }

        return (
          new Date(b.submitted).getTime() - new Date(a.submitted).getTime()
        )
      })
  }, [approvalItems, ownerFilter, query, sortBy, statusFilter, typeFilter])

  const selectedVisibleApproval = selectedApproval
    ? approvalItems.find((approval) => approval.id === selectedApproval.id) ?? selectedApproval
    : null

  function updateApprovalStatus(id: string, status: ApprovalStatus) {
    setApprovalItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              due: status === "Approved" ? "-" : item.due,
              activity: [
                {
                  time: "Just now",
                  label: status === "Approved" ? "Approved" : "Changes requested",
                  actor: "Pejman A",
                },
                ...item.activity,
              ],
            }
          : item
      )
    )
  }

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
          <SiteHeader title="Approvals" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    Approvals
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review and act on pending items across all listings.
                  </p>
                </div>
                <Button variant="outline" className="w-fit">
                  <FilterIcon />
                  Filters
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                {metrics.map((metric) => (
                  <ApprovalMetric key={metric.label} {...metric} />
                ))}
              </section>

              <Separator />

              <section className="grid gap-3 xl:grid-cols-[minmax(260px,1.2fr)_repeat(4,minmax(160px,0.65fr))]">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-12 pl-9"
                    placeholder="Search by listing or address..."
                  />
                </div>
                <FilterSelect
                  label="Approval Type"
                  value={typeFilter}
                  options={approvalTypes}
                  onChange={setTypeFilter}
                />
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  options={["All status", "Pending", "Changes Requested", "Approved"]}
                  onChange={setStatusFilter}
                />
                <FilterSelect
                  label="Owner / Team"
                  value={ownerFilter}
                  options={owners}
                  onChange={setOwnerFilter}
                />
                <FilterSelect
                  label="Sort by"
                  value={sortBy}
                  options={["Newest first", "Due soon", "Status"]}
                  onChange={setSortBy}
                />
              </section>

              <section className="overflow-hidden rounded-lg border bg-card">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="min-w-48">Approval Type</TableHead>
                      <TableHead className="min-w-48">Listing / Address</TableHead>
                      <TableHead className="min-w-44">Requested By</TableHead>
                      <TableHead className="min-w-44">Owner / Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="min-w-36">Submitted</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedApprovals.map((approval) => (
                      <ApprovalRow
                        key={approval.id}
                        approval={approval}
                        selected={selectedVisibleApproval?.id === approval.id}
                        onSelect={() => setSelectedApproval(approval)}
                      />
                    ))}
                  </TableBody>
                </Table>
                {displayedApprovals.length === 0 && (
                  <div className="grid place-items-center gap-2 border-t p-10 text-center">
                    <SearchIcon className="size-5 text-muted-foreground" />
                    <div className="font-medium">No approvals match those filters</div>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Clear a filter or search by listing, requester, owner, or proof type.
                    </p>
                  </div>
                )}
              </section>

              <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {displayedApprovals.length} of {approvalItems.length} approvals
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon-sm" disabled>
                    <ChevronLeftIcon />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button size="icon-sm">1</Button>
                  <Button variant="outline" size="icon-sm">
                    2
                  </Button>
                  <Button variant="outline" size="icon-sm">
                    <ChevronRightIcon />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            </div>
          </main>

          <Sheet
            open={Boolean(selectedVisibleApproval)}
            onOpenChange={(open) => {
              if (!open) setSelectedApproval(null)
            }}
          >
            <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg lg:max-w-xl">
              {selectedVisibleApproval && (
                <ApprovalDetails
                  approval={selectedVisibleApproval}
                  onApprove={() => updateApprovalStatus(selectedVisibleApproval.id, "Approved")}
                  onRequestChanges={() =>
                    updateApprovalStatus(selectedVisibleApproval.id, "Changes Requested")
                  }
                />
              )}
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function ApprovalMetric({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
  tone: string
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-5">
        <div className={cn("flex size-14 items-center justify-center rounded-full", tone)}>
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-3xl font-semibold">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
        </div>
      </div>
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
    <label className="relative flex h-12 items-center justify-between gap-3 rounded-md border bg-background px-3 text-left text-sm shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted">
      <span>
        <span className="block text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
        <span className="font-medium">{value}</span>
      </span>
      <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      <select
        aria-label={label}
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ApprovalRow({
  approval,
  selected,
  onSelect,
}: {
  approval: Approval
  selected: boolean
  onSelect: () => void
}) {
  const submitted = formatSubmitted(approval.submitted)

  return (
    <TableRow
      tabIndex={0}
      aria-selected={selected}
      className={cn(
        "cursor-pointer focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected && "border-l-2 border-l-red-600 bg-red-50/70 hover:bg-red-50"
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
          <div>
            <div className="font-medium">{approval.type}</div>
            <div className="text-muted-foreground">{approval.version}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{approval.listing}</div>
        <div className="text-muted-foreground">{approval.city}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={approval.requester.image} alt="" />
            <AvatarFallback>{initials(approval.requester.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{approval.requester.name}</div>
            <div className="text-muted-foreground">
              {submitted.short}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{approval.owner}</div>
        <div className="text-muted-foreground">{approval.team}</div>
      </TableCell>
      <TableCell>
        <StatusBadge status={approval.status} />
      </TableCell>
      <TableCell>
        <div>{submitted.date}</div>
        <div className="text-muted-foreground">{submitted.time}</div>
      </TableCell>
      <TableCell>
        <div>{approval.due}</div>
        <div
          className={cn(
            "font-medium",
            approval.dueTone === "urgent" && "text-red-500",
            approval.dueTone === "late" && "text-red-600"
          )}
        >
          {approval.due === "-" ? "-" : approval.dueTone === "late" ? "1 day" : approval.dueTone === "urgent" ? "2 days" : "3 days"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="h-12 w-16 rounded-md border bg-cover bg-center"
          style={{ backgroundImage: `url(${approval.preview})` }}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
        >
          {approval.status === "Approved" ? "View" : "Review"}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function ApprovalDetails({
  approval,
  onApprove,
  onRequestChanges,
}: {
  approval: Approval
  onApprove: () => void
  onRequestChanges: () => void
}) {
  return (
    <>
      <SheetHeader className="border-b p-6 pr-14">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-xl">{approval.type}</SheetTitle>
              <StatusBadge status={approval.status} />
            </div>
            <SheetDescription>{approval.version}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col">
        <section className="grid gap-5 p-6">
          <SideSheetSection title="Listing">
            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4">
              <div
                className="h-20 rounded-md bg-cover bg-center"
                style={{ backgroundImage: `url(${approval.image})` }}
              />
              <div className="min-w-0">
                <div className="font-semibold">{approval.listing}</div>
                <div className="text-muted-foreground">{approval.city}</div>
                <div className="text-muted-foreground">{approval.mls}</div>
                <Button variant="outline" className="mt-3 w-full">
                  Open listing
                  <ExternalLinkIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Requested By">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={approval.requester.image} alt="" />
                <AvatarFallback>{initials(approval.requester.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{approval.requester.name}</div>
                <div className="text-muted-foreground">{approval.requester.email}</div>
                <div className="text-muted-foreground">{approval.requester.phone}</div>
              </div>
            </div>
          </SideSheetSection>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <SideSheetSection title="Submitted">
              <div>{approval.submitted}</div>
            </SideSheetSection>
            <SideSheetSection title="Due Date">
              <div>
                {approval.due}
                {approval.due !== "-" && (
                  <span className="ml-1 font-medium text-red-500">
                    ({approval.dueTone === "late" ? "today" : "in 2 days"})
                  </span>
                )}
              </div>
            </SideSheetSection>
          </div>

          <Separator />

          <SideSheetSection title="Notes">
            <p className="leading-6 text-foreground">{approval.notes}</p>
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Proof Preview">
            <ProofPreview approval={approval} />
          </SideSheetSection>

          <Separator />

          <SideSheetSection title="Activity">
            <div className="grid gap-3">
              {approval.activity.map((item) => (
                <div
                  key={`${item.time}-${item.label}`}
                  className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 text-sm"
                >
                  <span className="text-muted-foreground">{item.time}</span>
                  <span>
                    {item.label}
                    <span className="block text-muted-foreground">{item.actor}</span>
                  </span>
                </div>
              ))}
            </div>
          </SideSheetSection>
        </section>

        <div className="sticky bottom-0 mt-auto grid gap-3 border-t bg-popover p-6">
          <Button className="h-11 bg-red-600 hover:bg-red-700" onClick={onApprove}>
            <CheckIcon />
            Approve
          </Button>
          <Button variant="outline" className="h-11" onClick={onRequestChanges}>
            <MessageSquareIcon />
            Request Changes
          </Button>
          <Button variant="outline" className="h-11">
            Open Listing
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </>
  )
}

function ProofPreview({ approval }: { approval: Approval }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="grid grid-cols-[1.25fr_1fr] gap-4 p-4">
        <div>
          <div className="text-xl font-semibold uppercase tracking-normal">
            {approval.listing}
          </div>
          <div className="text-xs uppercase text-muted-foreground">
            {approval.city}
          </div>
          <div
            className="mt-4 aspect-[4/3] rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${approval.image})` }}
          />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
            <span>4 beds</span>
            <span>3.5 baths</span>
            <span>3,240 sq ft</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase">
            Property Highlights
          </div>
          <ul className="mt-3 grid gap-2 text-[11px] leading-4 text-muted-foreground">
            <li>Premium finish selections throughout.</li>
            <li>Open kitchen with oversized island.</li>
            <li>Covered outdoor living and pool-ready yard.</li>
            <li>Primary suite with spa-inspired bath.</li>
            <li>Minutes from shopping and commuter routes.</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 border-t p-2">
        <Button variant="ghost" size="icon-sm">
          <SearchIcon />
          <span className="sr-only">Zoom proof</span>
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Maximize2Icon />
          <span className="sr-only">Expand proof</span>
        </Button>
        <Button variant="ghost" size="icon-sm">
          <DownloadIcon />
          <span className="sr-only">Download proof</span>
        </Button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "Approved") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Approved
      </Badge>
    )
  }

  if (status === "Changes Requested") {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Changes Requested
      </Badge>
    )
  }

  return (
    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
      Pending
    </Badge>
  )
}

function SideSheetSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3">
      <h3 className="text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

function dueRank(approval: Approval) {
  if (approval.due === "-") return 999
  if (approval.dueTone === "late") return 0
  if (approval.dueTone === "urgent") return 1
  return 2
}

function statusRank(status: ApprovalStatus) {
  return {
    Pending: 0,
    "Changes Requested": 1,
    Approved: 2,
  }[status]
}

function formatSubmitted(value: string) {
  const [date = value, time = ""] = value.split(" 2026 ")
  const cleanDate = date.replace(/,$/, "")

  return {
    date: `${cleanDate}, 2026`,
    time,
    short: `${cleanDate}, ${time}`.trim(),
  }
}
