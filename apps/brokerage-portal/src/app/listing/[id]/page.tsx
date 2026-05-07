import Link from "next/link"
import { notFound } from "next/navigation"
import type { CSSProperties, ReactElement, ReactNode } from "react"
import {
  ArrowLeftIcon,
  BathIcon,
  BedIcon,
  CameraIcon,
  CarIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CheckSquareIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  ClipboardListIcon,
  CopyIcon,
  CuboidIcon,
  DollarSignIcon,
  DownloadIcon,
  Edit3Icon,
  ExternalLinkIcon,
  EyeIcon,
  FileCheckIcon,
  FileTextIcon,
  GlobeIcon,
  Grid2X2Icon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  ListIcon,
  MessageSquareIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PlusIcon,
  PrinterIcon,
  RulerIcon,
  SearchIcon,
  SendIcon,
  Share2Icon,
  SparklesIcon,
  StarIcon,
  TabletIcon,
  UploadIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LegacyListingDetailShell } from "@/components/legacy-listing-detail-shell"
import { Textarea } from "@/components/ui/textarea"
import { submitFeatureSheetPrintDraftAction } from "@/app/actions/portal-intake"
import { findLegacyAppointmentByListingId, legacyListingRows } from "@/lib/legacy-listing-adapter"
import { listingData } from "@/lib/listings-data"
import {
  getListingProductParity,
  type ProductParitySummary,
} from "@/lib/server/product-parity"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import {
  getTimeTapParityForListing,
  type TimeTapParityRecord,
} from "@/lib/timetap-parity"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return [
    ...listingData.map((listing) => ({
      id: listing.id.toString(),
    })),
    ...legacyListingRows().map((listing) => ({
      id: listing.id.toString(),
    })),
  ]
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const access = await requireWorkspaceAccess({ pathname: `/listing/${id}` })
  const legacyAppointment = findLegacyAppointmentByListingId(id)

  if (legacyAppointment) {
    return (
      <LegacyListingDetailShell
        appointment={legacyAppointment}
        initialAccess={access}
      />
    )
  }

  const listing = listingData.find((item) => item.id.toString() === id)

  if (!listing) {
    notFound()
  }

  const productParity = await getListingProductParity(id, access)
  const timeTapParity = getTimeTapParityForListing(id)

  return (
    <RoleProvider initialAccess={access}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader
            title={listing.listing}
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Listings", href: "/listing" },
            ]}
          />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/listing" />}>
                  <ArrowLeftIcon />
                  Back to listings
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit3Icon />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2Icon />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <UsersIcon />
                    Team
                  </Button>
                  <Button variant="outline" size="icon-sm" aria-label="More actions">
                    <MoreHorizontalIcon />
                  </Button>
                </div>
              </div>

              <section className="mt-4">
                <div className="flex min-w-0 gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listing.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 self-center">
                    <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal">
                      {listing.address}
                    </h1>
                    <div className="mt-1 flex flex-nowrap items-center gap-3 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {listing.status}
                      </Badge>
                      <span className="text-base text-muted-foreground">
                        MLS # {listing.mls}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <PropertyFact
                        icon={<CircleIcon className="size-3 fill-green-500 text-green-500" />}
                        label="Active Listing"
                      />
                      <PropertyFact icon={<HomeIcon />} label="Single Family" />
                      <PropertyFact icon={<RulerIcon />} label="3,240 sq ft" />
                      <PropertyFact icon={<BedIcon />} label="4 Beds" />
                      <PropertyFact icon={<BathIcon />} label="3.5 Baths" />
                      <PropertyFact icon={<CarIcon />} label="2 Car Garage" />
                    </div>
                  </div>
                </div>
              </section>

              <ProductParityStrip records={productParity} />

              <Tabs defaultValue="overview" className="mt-5 gap-0">
                <TabsList
                  variant="line"
                  className="-mx-4 w-auto justify-start gap-8 overflow-x-auto border-b border-border px-4 py-0 lg:-mx-6 lg:px-6"
                >
                  {[
                    ["overview", "Overview"],
                    ["services", "Services"],
                    ["schedule", "Schedule"],
                    ["media", "Media"],
                    ["feature-sheet", "Feature Sheet"],
                    ["virtual-staging", "Virtual Staging"],
                    ["website", "Website"],
                    ["approvals", "Approvals"],
                    ["billing", "Billing"],
                    ["activity", "Activity"],
                  ].map(([value, label]) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="h-12 flex-none px-0 after:-bottom-px after:bg-red-600"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="pt-6">
                  <ListingOverview timeTapParity={timeTapParity} />
                </TabsContent>

                <TabsContent value="services" className="pt-6">
                  <ListingServices />
                </TabsContent>

                <TabsContent value="schedule" className="pt-6">
                  <ListingScheduleTab timeTapParity={timeTapParity} />
                </TabsContent>

                <TabsContent value="media" className="pt-6">
                  <Tabs
                    defaultValue="all-media"
                    orientation="vertical"
                    className="gap-0"
                  >
                    <aside className="border-r pr-5">
                      <TabsList className="h-auto w-full items-stretch justify-start gap-1 bg-transparent p-0">
                        {mediaLibrary.map((item) => (
                          <TabsTrigger
                            key={item.label}
                            value={item.value}
                            className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-3 py-2.5 text-left data-active:bg-muted data-active:shadow-none"
                          >
                            <span className="min-w-0 truncate text-left">
                              {item.label}
                            </span>
                            <span className="min-w-8 justify-self-end rounded-full bg-background px-2 py-0.5 text-center text-xs font-medium tabular-nums text-muted-foreground shadow-xs ring-1 ring-border">
                              {item.count}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </aside>

                    <TabsContent value="all-media" className="min-w-0 border-l-0 pl-6">
                      <div className="-ml-6 flex flex-wrap items-center justify-between gap-3 border-b pl-6 pb-4">
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <UploadIcon />
                            Upload
                          </Button>
                          <Button variant="outline">
                            <Share2Icon />
                            Share Gallery
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm" aria-label="List view">
                            <ListIcon />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="Grid view">
                            <Grid2X2Icon />
                          </Button>
                        </div>
                      </div>

                      <MediaSection
                        title="Photos"
                        viewAll="View all 43"
                        items={photoAssets}
                      />
                      <MediaSection
                        title="Floor Plans"
                        viewAll="View all 6"
                        items={floorPlanAssets}
                        compact
                      />
                      <MediaSection
                        title="Virtual Staging"
                        viewAll="View all 18"
                        items={stagingAssets}
                      />
                    </TabsContent>
                    <TabsContent value="photos" className="min-w-0 pl-6">
                      <MediaToolbar />
                      <MediaSection
                        title="Photos"
                        viewAll="View all 43"
                        items={photoAssets}
                      />
                    </TabsContent>
                    <TabsContent value="floor-plans" className="min-w-0 pl-6">
                      <MediaToolbar />
                      <MediaSection
                        title="Floor Plans"
                        viewAll="View all 6"
                        items={floorPlanAssets}
                        compact
                      />
                    </TabsContent>
                    <TabsContent value="virtual-staging" className="min-w-0 pl-6">
                      <MediaToolbar />
                      <MediaSection
                        title="Virtual Staging"
                        viewAll="View all 18"
                        items={stagingAssets}
                      />
                    </TabsContent>
                    {["video", "matterport", "print-files", "documents"].map(
                      (value) => (
                        <TabsContent
                          key={value}
                          value={value}
                          className="min-w-0 pl-6"
                        >
                          <MediaToolbar />
                          <StubPanel
                            title={
                              mediaLibrary.find((item) => item.value === value)
                                ?.label ?? "Media"
                            }
                            body="This media category is stubbed and ready for its assets, approvals, and delivery controls."
                          />
                        </TabsContent>
                      )
                    )}
                  </Tabs>
                </TabsContent>

                <TabsContent value="feature-sheet" className="pt-6">
                  <FeatureSheetTab
                    listingId={id}
                    listingAddress={listing.address}
                    listingArea={listing.cityLine}
                  />
                </TabsContent>
                <TabsContent value="virtual-staging" className="pt-6">
                  <VirtualStagingTab />
                </TabsContent>
                <TabsContent value="website" className="pt-6">
                  <WebsiteTab />
                </TabsContent>
                <TabsContent value="approvals" className="pt-6">
                  <ApprovalsTab />
                </TabsContent>
                <TabsContent value="billing" className="pt-6">
                  <BillingTab />
                </TabsContent>
                <TabsContent value="activity" className="pt-6">
                  <StubPanel title="Activity" body="Timeline updates, vendor notes, and listing events will appear here." />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function PropertyFact({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-6 items-center justify-center rounded-md border bg-background text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  )
}

function ProductParityStrip({ records }: { records: ProductParitySummary[] }) {
  return (
    <section className="mt-5 rounded-2xl border bg-muted/20 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-medium">Product parity mirror</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Feature sheet, virtual staging, print, exception, and bridge context
            connected to this listing. This does not write to legacy.
          </p>
        </div>
        <Badge variant="outline">
          {records.length ? `${records.length} linked records` : "No linked records yet"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {records.length ? (
          records.slice(0, 3).map((record) => (
            <Link
              key={`${record.kind}-${record.id}`}
              href={record.href}
              className="rounded-xl border bg-background p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{record.title}</span>
                <Badge variant="secondary">{record.kind.replace("-", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                {record.safetyBoundary}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                Status: {record.status.replaceAll("_", " ")}
              </div>
            </Link>
          ))
        ) : (
          <>
            <ProductParityEmptyCard title="Feature sheets" />
            <ProductParityEmptyCard title="Virtual staging" />
            <ProductParityEmptyCard title="Print shop" />
          </>
        )}
      </div>
    </section>
  )
}

function ProductParityEmptyCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-background p-3">
      <div className="font-medium">{title}</div>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">
        Ready for Supabase mirror records. Legacy remains untouched until a
        staff-reviewed handoff or approved bridge exists.
      </p>
    </div>
  )
}

function ListingOverview({
  timeTapParity = [],
}: {
  timeTapParity?: TimeTapParityRecord[]
}) {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewSummaryCard
          icon={<HomeIcon />}
          title="Listing Status"
          badge="Active"
          badgeClassName="bg-green-100 text-green-700 hover:bg-green-100"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
            <InfoMetric label="Listed" value="Apr 28, 2026" />
            <InfoMetric label="Days on Market" value="5" />
            <InfoMetric label="Price" value="$2,498,000" strong />
            <InfoMetric label="Status" value="Active" strong />
          </div>
        </OverviewSummaryCard>

        <OverviewSummaryCard icon={<PackageIcon />} title="Ordered Services">
          <div className="grid grid-cols-[1fr_auto] items-center gap-5">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-semibold">7</span>
                <span className="text-muted-foreground">Total services</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <LegendItem color="bg-green-600" label="4 Completed" />
                <LegendItem color="bg-blue-600" label="2 In Progress" />
                <LegendItem color="bg-sky-400" label="1 Scheduled" />
              </div>
            </div>
            <ProgressRing value="71" />
          </div>
          <CardLink label="View all services" />
        </OverviewSummaryCard>

        <OverviewSummaryCard icon={<FileCheckIcon />} title="Pending Approvals">
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-semibold">3</span>
            <span className="text-muted-foreground">Items awaiting review</span>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <LegendItem color="bg-green-600" label="1 Feature Sheet Proof" />
            <LegendItem color="bg-blue-600" label="1 Virtual Staging (6 images)" />
            <LegendItem color="bg-sky-400" label="1 Gallery Publish" />
          </div>
          <CardLink label="View approvals" />
        </OverviewSummaryCard>

        <OverviewSummaryCard
          icon={<DollarSignIcon />}
          title="Balance / Billing"
          badge="Payment Due"
          badgeClassName="bg-red-100 text-red-700 hover:bg-red-100"
        >
          <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-4 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">$1,431.07</span>
            <span className="text-muted-foreground">Paid</span>
            <span className="font-medium">$0.00</span>
            <span className="text-muted-foreground">Balance Due</span>
            <span className="font-semibold text-red-600">$1,431.07</span>
          </div>
          <CardLink label="View billing" />
        </OverviewSummaryCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.55fr_1.12fr]">
        <DashboardCard title="Next Steps">
          <div className="grid gap-1">
            <NextStepRow
              icon={<CheckSquareIcon />}
              title="Approve feature sheet proof"
              subtitle="Draft v2 ready for review"
              due="Due May 12"
              priority="High"
              tone="red"
            />
            <NextStepRow
              icon={<CameraIcon />}
              title="Confirm shoot window"
              subtitle="Photography shoot"
              due="Due May 13"
              priority="High"
              tone="red"
            />
            <NextStepRow
              icon={<CuboidIcon />}
              title="Review staged images"
              subtitle="Living Room (6 variants)"
              due="Due May 15"
              priority="Medium"
              tone="amber"
            />
            <NextStepRow
              icon={<FileTextIcon />}
              title="Website content review"
              subtitle="Draft site ready"
              due="Due May 16"
              priority="Medium"
              tone="amber"
            />
          </div>
          <CardLink label="View all tasks" />
        </DashboardCard>

        <DashboardCard title="Ordered Services Snapshot">
          <div className="grid gap-1">
            <ServiceSnapshotRow
              icon={<CameraIcon />}
              title="Photography Package"
              subtitle="25 photos + twilight"
              status="Completed"
              statusClassName="bg-green-100 text-green-700"
              note="Delivered"
              date="May 10, 2026"
            />
            <ServiceSnapshotRow
              icon={<ImageIcon />}
              title="Floor Plan (Premium)"
              subtitle="2D + dimensions"
              status="In Progress"
              statusClassName="bg-blue-100 text-blue-700"
              note="Draft ready"
              date="May 12, 2026"
            />
            <ServiceSnapshotRow
              icon={<CuboidIcon />}
              title="Matterport 3D Tour"
              subtitle="Full property"
              status="In Progress"
              statusClassName="bg-blue-100 text-blue-700"
              note="Capture scheduled"
              date="May 13, 2026"
            />
            <ServiceSnapshotRow
              icon={<FileTextIcon />}
              title="Feature Sheet (Premium)"
              subtitle="Branded, 4 pages"
              status="Proof Ready"
              statusClassName="bg-amber-100 text-amber-700"
              note="Awaiting review"
              date="May 11, 2026"
            />
            <ServiceSnapshotRow
              icon={<CuboidIcon />}
              title="Virtual Staging"
              subtitle="6 images"
              status="In Progress"
              statusClassName="bg-blue-100 text-blue-700"
              note="Draft ready"
              date="May 15, 2026"
            />
            <ServiceSnapshotRow
              icon={<HomeIcon />}
              title="Single Property Website"
              subtitle="Branded"
              status="In Production"
              statusClassName="bg-purple-100 text-purple-700"
              note="Draft site"
              date="May 16, 2026"
            />
            <ServiceSnapshotRow
              icon={<FileTextIcon />}
              title="Print Brochures"
              subtitle="100 qty, 8.5x11"
              status="Scheduled"
              statusClassName="bg-purple-100 text-purple-700"
              note="Queued"
              date="May 18, 2026"
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Upcoming Schedule">
          <div className="grid gap-1">
            {timeTapParity.length ? (
              timeTapParity.map((record) => (
                <ScheduleRow
                  key={record.id}
                  icon={iconForServices(record.serviceTypes)}
                  title={record.title}
                  subtitle={`${record.staff} · ${record.mirrorStatus}`}
                  date={formatScheduleDate(record.startTime)}
                  time={formatScheduleWindow(record.startTime, record.endTime)}
                />
              ))
            ) : (
              <>
                <ScheduleRow
                  icon={<CameraIcon />}
                  title="Photography Shoot"
                  subtitle="Sample schedule row"
                  date="Tue, May 13, 2026"
                  time="10:00 AM - 12:00 PM"
                />
                <ScheduleRow
                  icon={<CuboidIcon />}
                  title="Matterport Capture"
                  subtitle="Sample schedule row"
                  date="Tue, May 13, 2026"
                  time="1:00 PM - 3:00 PM"
                />
                <ScheduleRow
                  icon={<FileTextIcon />}
                  title="Feature Sheet Delivery"
                  subtitle="Sample schedule row"
                  date="Mon, May 18, 2026"
                  time="EOD"
                />
              </>
            )}
          </div>
          <CardLink label="View full schedule" />
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.45fr_1.1fr]">
        <DashboardCard title="Team & Ownership">
          <div className="grid gap-1">
            <TeamRow
              name="Jamie Smith"
              role="Owner / Lead Agent"
              team="The Smith Group"
              email="jamie@smithgroup.com"
              phone="214.555.0198"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80"
            />
            <TeamRow
              name="Taylor Cole"
              role="Assistant"
              team="The Smith Group"
              email="taylor@smithgroup.com"
              phone="214.555.0189"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
            />
            <TeamRow
              name="Patricia Nguyen"
              role="Listing Coordinator"
              team="The Smith Group"
              email="patricia@smithgroup.com"
              phone="214.555.0112"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80"
            />
            <TeamRow
              name="Jamie Smith"
              role="Preferred Photographer"
              team="In-house"
              email=""
              phone="-"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80"
            />
          </div>
          <CardLink label="View team details" />
        </DashboardCard>

        <DashboardCard title="Recent Activity">
          <div className="grid gap-1">
            <ActivityRow
              icon={<FileCheckIcon />}
              title="Feature sheet proof v2 uploaded"
              source="DesignHouse"
              date="May 10, 2026"
              time="10:24 AM"
            />
            <ActivityRow
              icon={<CheckSquareIcon />}
              title="Virtual staging draft (6 images) generated"
              source="AI Studio"
              date="May 10, 2026"
              time="9:41 AM"
            />
            <ActivityRow
              icon={<ImageIcon />}
              title="Photography delivery completed (25 photos)"
              source="Jamie Smith"
              date="May 10, 2026"
              time="8:15 AM"
            />
            <ActivityRow
              icon={<CheckCircle2Icon />}
              title="Order O-2026-1217 confirmed"
              source="Sarah Johnson"
              date="May 9, 2026"
              time="2:15 PM"
            />
            <ActivityRow
              icon={<HomeIcon />}
              title="Listing activated on Reala"
              source="System"
              date="Apr 28, 2026"
              time="11:32 AM"
            />
          </div>
          <CardLink label="View all activity" />
        </DashboardCard>

        <DashboardCard title="Quick Links">
          <div className="grid gap-1">
            <QuickLinkRow
              icon={<CameraIcon />}
              title="Gallery Link"
              subtitle="Branded"
              url="reala.com/gallery/1238homer"
            />
            <QuickLinkRow
              icon={<CuboidIcon />}
              title="Matterport Tour"
              subtitle="Branded"
              url="my.matterport.com/show/?m=7mAxQDTcXkA"
            />
            <QuickLinkRow
              icon={<HomeIcon />}
              title="Website (Draft)"
              subtitle="Branded"
              url="1238homer.reala.site"
            />
            <QuickLinkRow
              icon={<Share2Icon />}
              title="Share Package"
              subtitle="Branded"
              url="reala.com/share/1238homer"
            />
          </div>
          <CardLink label="View all links & options" />
        </DashboardCard>
      </section>
    </div>
  )
}

function ListingScheduleTab({
  timeTapParity,
}: {
  timeTapParity: TimeTapParityRecord[]
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard title="TimeTap appointment timeline">
        {timeTapParity.length ? (
          <div className="grid gap-1">
            {timeTapParity.map((record) => (
              <ScheduleRow
                key={record.id}
                icon={iconForServices(record.serviceTypes)}
                title={record.title}
                subtitle={`${record.calendarName} · ${record.staff}`}
                date={formatScheduleDate(record.startTime)}
                time={formatScheduleWindow(record.startTime, record.endTime)}
              />
            ))}
          </div>
        ) : (
          <StubPanel
            title="No TimeTap match"
            body="This listing does not have a linked TimeTap mirror record yet. Staff can use bridge approvals to match by address, date, realtor, service, or Daily Drafting row."
          />
        )}
      </DashboardCard>

      <DashboardCard title="Legacy Mirror">
        <div className="grid gap-3">
          {timeTapParity.length ? (
            timeTapParity.map((record) => (
              <div key={record.id} className="rounded-xl border bg-muted/20 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{record.mirrorStatus}</Badge>
                  <Badge variant="outline">{record.mismatchState}</Badge>
                  <Badge variant="outline">{record.bridgeState}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <MirrorFact label="TimeTap appointment" value={record.timeTapAppointmentId ?? "No appointment match"} />
                  <MirrorFact label="Calendar ID" value={record.timeTapCalendarId ?? "No calendar match"} />
                  <MirrorFact
                    label="Daily Drafting"
                    value={
                      record.dailyDrafting.row
                        ? `Row ${record.dailyDrafting.row} · ${record.dailyDrafting.status}`
                        : record.dailyDrafting.status
                    }
                  />
                  <MirrorFact label="Services" value={record.serviceTypes.join(", ")} />
                  <MirrorFact label="Photo" value={record.schedulerFields.photoType} />
                  <MirrorFact label="Floor plan" value={record.schedulerFields.floorPlanType} />
                  <MirrorFact label="Matterport" value={record.schedulerFields.matterportType} />
                  <MirrorFact label="Video" value={record.schedulerFields.videoType} />
                  <MirrorFact label="Print" value={record.schedulerFields.printedMaterialType} />
                  <MirrorFact label="Folder / delivery" value={record.schedulerFields.folderStatus} />
                </div>
                {record.exceptions.length ? (
                  <div className="mt-3 grid gap-2">
                    {record.exceptions.map((exception) => (
                      <div key={exception} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {exception}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
              Legacy mirror fields will appear here once a TimeTap appointment,
              Daily Drafting row, or Scheduler product record is linked.
            </div>
          )}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
            Read-only mirror only. This page does not write to TimeTap, Google
            Sheets, folders, Matterport, Stripe, print systems, or legacy MySQL.
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

function MirrorFact({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "Not mirrored"}</span>
    </div>
  )
}

function iconForServices(services: string[]) {
  if (services.includes("Matterport")) return <CuboidIcon />
  if (services.includes("Printing")) return <PrinterIcon />
  if (services.includes("Floor Plan")) return <RulerIcon />
  if (services.includes("Photography")) return <CameraIcon />
  return <CalendarIcon />
}

function formatScheduleDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatScheduleWindow(start: Date, end: Date) {
  return `${start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`
}

function OverviewSummaryCard({
  icon,
  title,
  badge,
  badgeClassName,
  children,
}: {
  icon: ReactNode
  title: string
  badge?: string
  badgeClassName?: string
  children: ReactNode
}) {
  return (
    <Card className="h-full rounded-lg" size="sm">
      <CardHeader className="grid-cols-[1fr_auto] items-start gap-4">
        <div className="flex items-center gap-3">
          <IconTile>{icon}</IconTile>
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        {badge ? <Badge className={badgeClassName}>{badge}</Badge> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function DashboardCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card className="flex h-full flex-col rounded-lg" size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
      {children}
    </span>
  )
}

function InfoMetric({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="grid gap-2 border-l pl-4 first:border-l-0 first:pl-0 odd:first:border-l-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={strong ? "text-base font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`size-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

function ProgressRing({ value }: { value: string }) {
  return (
    <div
      className="grid size-20 place-items-center rounded-full"
      style={{
        background:
          "conic-gradient(rgb(21 128 61) 0 71%, rgb(229 231 235) 71% 100%)",
      }}
    >
      <div className="grid size-14 place-items-center rounded-full bg-background text-center">
        <span className="text-lg font-semibold">{value}%</span>
      </div>
      <span className="sr-only">{value}% complete</span>
    </div>
  )
}

function CardLink({ label }: { label: string }) {
  return (
    <Button variant="link" size="sm" className="mt-auto justify-start px-0 pt-4">
      {label}
      <span aria-hidden>→</span>
    </Button>
  )
}

function PriorityBadge({ tone, label }: { tone: "red" | "amber"; label: string }) {
  return (
    <Badge
      className={
        tone === "red"
          ? "bg-red-100 text-red-700 hover:bg-red-100"
          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
      }
    >
      {label}
    </Badge>
  )
}

function NextStepRow({
  icon,
  title,
  subtitle,
  due,
  priority,
  tone,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  due: string
  priority: string
  tone: "red" | "amber"
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b py-3 last:border-b-0">
      <IconTile>{icon}</IconTile>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-muted-foreground">{due}</span>
        <PriorityBadge tone={tone} label={priority} />
      </div>
    </div>
  )
}

function ServiceSnapshotRow({
  icon,
  title,
  subtitle,
  status,
  statusClassName,
  note,
  date,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  status: string
  statusClassName: string
  note: string
  date: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b py-2.5 last:border-b-0">
      <IconTile>{icon}</IconTile>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <Badge className={statusClassName}>{status}</Badge>
      <div className="min-w-24 text-xs text-muted-foreground">
        <div>{note}</div>
        <div>{date}</div>
      </div>
    </div>
  )
}

function ScheduleRow({
  icon,
  title,
  subtitle,
  date,
  time,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  date: string
  time: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b py-3 last:border-b-0">
      <IconTile>{icon}</IconTile>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="text-right text-xs">
        <div className="font-medium">{date}</div>
        <div className="text-muted-foreground">{time}</div>
      </div>
    </div>
  )
}

function TeamRow({
  name,
  role,
  team,
  email,
  phone,
  image,
}: {
  name: string
  role: string
  team: string
  email: string
  phone: string
  image: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3 border-b py-2.5 last:border-b-0">
      <div className="size-9 overflow-hidden rounded-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="size-full object-cover" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{role}</div>
        <div className="font-medium">{name}</div>
      </div>
      <div className="min-w-0 text-xs">
        <div className="truncate font-medium">{team}</div>
        <div className="truncate text-muted-foreground">{email}</div>
      </div>
      <div className="text-xs text-muted-foreground">{phone}</div>
    </div>
  )
}

function ActivityRow({
  icon,
  title,
  source,
  date,
  time,
}: {
  icon: ReactNode
  title: string
  source: string
  date: string
  time: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b py-2.5 last:border-b-0">
      <IconTile>{icon}</IconTile>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{source}</div>
      </div>
      <div className="text-right text-xs text-muted-foreground">
        <div>{date}</div>
        <div>{time}</div>
      </div>
    </div>
  )
}

function QuickLinkRow({
  icon,
  title,
  subtitle,
  url,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  url: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b py-2.5 last:border-b-0">
      <IconTile>{icon}</IconTile>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {subtitle} · {url}
        </div>
      </div>
      <Button variant="outline" size="sm">
        <CopyIcon />
        Copy
      </Button>
    </div>
  )
}

function ListingServices() {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ServiceMetric
              icon={<PackageIcon />}
              label="Ordered"
              value="7"
              detail="$1,931 est."
            />
            <ServiceMetric
              icon={<CircleIcon className="fill-blue-100 text-blue-600" />}
              label="In Production"
              value="3"
              detail="43%"
            />
            <ServiceMetric
              icon={<ClockIcon />}
              label="Awaiting"
              value="1"
              detail="14%"
            />
            <ServiceMetric
              icon={<FileCheckIcon />}
              label="Review"
              value="1"
              detail="14%"
            />
          </div>

          <Card className="rounded-lg" size="sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Turnaround / Next Milestone</TableHead>
                  <TableHead>Price / Coverage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedServices.map((service) => (
                  <TableRow key={service.title}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <IconTile>{service.icon}</IconTile>
                        <div>
                          <div className="font-medium">{service.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {service.subtitle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.category}
                    </TableCell>
                    <TableCell>
                      <Badge className={service.statusClassName}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{service.assignee}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.vendor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{service.milestone}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-700">
                        {service.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.coverage}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        {service.action}
                        <ChevronDownIcon data-icon="inline-end" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase">
                Package & Add-ons
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[260px_1fr]">
              <div className="rounded-lg border p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  Package Applied
                </div>
                <div className="mt-2 font-semibold">Marketing Plus Package</div>
                <div className="text-sm text-muted-foreground">
                  Includes 5 core services
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  {[
                    "Photography",
                    "Floor Plan (Premium)",
                    "Matterport Tour",
                    "Feature Sheet (Premium)",
                    "Virtual Staging (6 images)",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2Icon className="text-green-700" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm font-medium text-green-700">
                  You save 15% with this package
                </div>
              </div>

              <div>
                <div className="mb-3 font-medium">Add-ons for This Listing</div>
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {serviceAddOns.map((addOn) => (
                    <div key={addOn.title} className="rounded-lg border p-4">
                      <IconTile>{addOn.icon}</IconTile>
                      <div className="mt-3 font-medium">{addOn.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {addOn.subtitle}
                      </div>
                      <div className="mt-4 font-semibold">{addOn.price}</div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Add to Order
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <DashboardCard title="Scheduling / Coordination">
            <div className="grid gap-1">
              <ScheduleRow
                icon={<CameraIcon />}
                title="Photography Shoot"
                subtitle="May 6, 2026"
                date="Completed"
                time="10:00 AM - 12:00 PM"
              />
              <ScheduleRow
                icon={<CuboidIcon />}
                title="Matterport Capture"
                subtitle="May 13, 2026"
                date="Scheduled"
                time="1:00 PM - 3:00 PM"
              />
              <ScheduleRow
                icon={<ImageIcon />}
                title="Floor Plan Measurement"
                subtitle="No slot selected"
                date="Awaiting"
                time=""
              />
            </div>
            <CardLink label="View full schedule" />
          </DashboardCard>

          <DashboardCard title="Service Requirements">
            <div className="grid gap-4 text-sm">
              <RequirementRow title="Access" body="Lockbox: 1234 · Front door, side gate" />
              <RequirementRow title="Floor Plan" body="All levels · Include garage & deck" />
              <RequirementRow title="Photography" body="25+ photos · Show yard & skyline" />
              <RequirementRow title="Occupancy" body="Occupied · Staged furniture" />
              <RequirementRow title="Special Instructions" body="Capture sunset exterior if possible" />
            </div>
            <CardLink label="View all requirements" />
          </DashboardCard>

          <DashboardCard title="Quick Links">
            <div className="grid gap-2">
              {["Gallery Link", "Matterport Tour", "Website (Draft)", "Share Package"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium">{item}</div>
                      <div className="text-xs text-muted-foreground">Branded</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </div>
                )
              )}
            </div>
          </DashboardCard>
        </aside>
      </section>

      <FloatingActionBar columns="md:grid-cols-3">
        <Button>
          <PlusIcon data-icon="inline-start" />
          Add Service
        </Button>
        <Button variant="outline">
          <SparklesIcon data-icon="inline-start" />
          Reorder Similar Package
        </Button>
        <Button variant="outline">
          <PackageIcon data-icon="inline-start" />
          Open Order Details
        </Button>
      </FloatingActionBar>
    </div>
  )
}

function ServiceMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card className="h-full rounded-lg" size="sm">
      <CardContent className="grid h-full grid-cols-[auto_1fr] items-start gap-4">
        <IconTile>{icon}</IconTile>
        <div className="grid min-w-0 gap-1">
          <div className="min-h-4 text-xs font-semibold uppercase leading-none text-muted-foreground">
            {label}
          </div>
          <div className="text-3xl font-semibold leading-none">{value}</div>
          <div className="text-sm leading-tight text-muted-foreground">{detail}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function RequirementRow({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-muted-foreground">{body}</div>
    </div>
  )
}

function FeatureSheetTab({
  listingId,
  listingAddress,
  listingArea,
}: {
  listingId: string
  listingAddress: string
  listingArea: string
}) {
  const featureSheetContext = {
    listingId,
    listingAddress,
    listingArea,
    pathname: `/listing/${listingId}`,
    templateName: "Modern Classic",
    featureSheetProduct: 'Feature Sheet 17" x 11" (4 page 8.5" x 11")',
    featureSheetStyle: "My style is on file",
    paperWeight: "100lb gloss text (standard)",
    hoodReportOrMlsPage: "No",
    proofVersion: "Proof v2",
    proofStatus: "Proof Ready",
    printedMaterialStatus: "Proof Sent",
    proofSource: "Portal proof preview",
    selectedPhotos: "12 selected photos",
    floorPlanStatus: "Attached (2D)",
    existingFloorPlan: "Attached (2D)",
    listingFactsStatus: "MLS + Manual Overrides",
    copyTemplateNotes:
      "Modern Classic 4-page feature sheet with brokerage-safe property highlights and verified listing facts.",
  }

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.6fr]">
        <FeatureStatusCard
          icon={<FileCheckIcon />}
          label="Feature Sheet Status"
          value="Proof Ready"
          detail="Awaiting your review"
          tone="amber"
        />
        <FeatureStatusCard
          icon={<FileTextIcon />}
          label="Template"
          value="Modern Classic"
          detail="4 pages"
        />
        <FeatureStatusCard
          icon={<CalendarIcon />}
          label="Last Updated"
          value="May 10, 2026 · 9:41 AM"
          detail="by Jamie Smith"
        />
        <FeatureStatusCard
          icon={<CheckCircle2Icon />}
          label="Print Readiness"
          value="Ready for print"
          detail="All content & images verified"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <Card className="rounded-lg" size="sm">
            <CardContent className="grid gap-4 p-0 md:grid-cols-[120px_1fr]">
              <div className="border-r p-4">
                <ScrollArea className="h-[660px] pr-3">
                  <div className="grid gap-4">
                  {[1, 2, 3, 4].map((page) => (
                    <button
                      key={page}
                      type="button"
                      className="grid gap-2 text-center text-sm"
                    >
                      <div
                        className={
                          page === 1
                            ? "rounded-md border-2 border-red-500 bg-background p-1"
                            : "rounded-md border bg-background p-1"
                        }
                      >
                        <FeaturePageThumb page={page} />
                      </div>
                      <span>{page}</span>
                    </button>
                  ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="p-6">
                <FeatureSheetPreview />
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button variant="outline" size="icon-sm" aria-label="Previous page">
                    ‹
                  </Button>
                  <span className="text-sm font-medium">1 / 4</span>
                  <Button variant="outline" size="icon-sm" aria-label="Next page">
                    ›
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm">−</Button>
                  <span className="text-sm text-muted-foreground">78%</span>
                  <Button variant="outline" size="sm">+</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase">
                  Selected Photos (12)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {photoAssets.slice(0, 4).map((item, index) => (
                    <div
                      key={item.title}
                      className="relative aspect-[.75/1] overflow-hidden rounded-md border bg-muted"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : null}
                      {index === 3 ? (
                        <div className="absolute inset-0 grid place-items-center bg-background/80 text-sm font-medium">
                          +7 more
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase">
                  Floor Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="aspect-[.72/1] w-20 rounded-md border bg-[linear-gradient(90deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%),linear-gradient(0deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%)]" />
                <div className="grid gap-2 text-sm">
                  <div className="font-medium">Main Level + Upper Level</div>
                  <div className="text-muted-foreground">2D Floor Plan</div>
                  <Badge className="w-fit bg-green-100 text-green-700 hover:bg-green-100">
                    Attached
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase">
                  Listing Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <FactRow label="Lot Size" value="5,100 sq ft" />
                <FactRow label="Year Built" value="2018" />
                <FactRow label="Property Type" value="Single Family" />
                <FactRow label="MLS Source" value="R2865478" />
              </CardContent>
            </Card>

            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase">
                  Property Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Beautifully designed home in the heart of Mount Pleasant. Open
                plan layout, high-end finishes, and exceptional indoor/outdoor
                living.
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <DashboardCard title="Proof Details">
            <div className="grid gap-3 text-sm">
              <FactRow label="Template" value="Modern Classic" />
              <FactRow label="Pages" value="4" />
              <FactRow label="Printed product" value={featureSheetContext.featureSheetProduct} />
              <FactRow label="Paper weight" value={featureSheetContext.paperWeight} />
              <FactRow label="Data Source" value="MLS + Manual Overrides" />
              <FactRow label="Selected Photos" value="12" />
              <FactRow label="Floor Plan" value="Attached (2D)" />
              <FactRow label="Copy Status" value="AI Draft + Edited" />
              <FactRow label="Printed material status" value={featureSheetContext.printedMaterialStatus} />
              <FactRow label="Requested By" value="Jamie Smith" />
              <FactRow label="Approver" value="Sarah Johnson" />
            </div>
          </DashboardCard>

          <DashboardCard title="Workflow Status">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {["Draft", "Proof Ready", "Approved", "Delivered"].map(
                (step, index) => (
                  <div key={step} className="grid gap-2">
                    <div
                      className={
                        index < 2
                          ? "mx-auto grid size-8 place-items-center rounded-full bg-foreground text-background"
                          : "mx-auto size-8 rounded-full border bg-background"
                      }
                    >
                      {index < 2 ? <CheckCircle2Icon /> : null}
                    </div>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                )
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Revision History">
            <div className="grid gap-4">
              <RevisionItem
                author="Sarah Johnson"
                status="Changes Requested"
                body="Please update the primary ensuite photo and revise the legal suite remark."
                time="May 10, 2026 · 10:32 AM"
              />
              <RevisionItem
                author="Jamie Smith"
                status="Proof Submitted"
                body="First proof ready for review."
                time="May 10, 2026 · 9:41 AM"
              />
              <RevisionItem
                author="Jamie Smith"
                status="Draft Created"
                body="Initial draft generated from MLS."
                time="May 9, 2026 · 4:18 PM"
              />
            </div>
            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
              Add a comment...
              <SendIcon className="ml-auto" />
            </div>
          </DashboardCard>
        </aside>
      </section>

      <FloatingActionBar columns="md:grid-cols-5">
        <FeatureSheetAction
          context={featureSheetContext}
          actionKind="proof_edit"
          title="Edit Proof"
          description="Update template content, photo selections, and listing copy."
          action="Save proof changes"
          button={
            <Button variant="outline">
              <Edit3Icon data-icon="inline-start" />
              Edit Proof
            </Button>
          }
        />
        <FeatureSheetAction
          context={featureSheetContext}
          actionKind="revision_request"
          title="Request Changes"
          description="Send proof feedback to the design team with priority and notes."
          action="Send request"
          button={
            <Button variant="outline">
              <MessageSquareIcon data-icon="inline-start" />
              Request Changes
            </Button>
          }
        />
        <FeatureSheetAction
          context={featureSheetContext}
          actionKind="approval_request"
          title="Approve Feature Sheet"
          description="Create a portal approval draft for staff review before any legacy status or print handoff changes."
          action="Approve proof"
          button={
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <CheckCircle2Icon data-icon="inline-start" />
              Approve
            </Button>
          }
        />
        <FeatureSheetAction
          context={featureSheetContext}
          actionKind="print_intent"
          printIntent
          title="Send to Print"
          description="Create a dry-run print intent for staff review; this does not start live print fulfillment."
          action="Submit print intent"
          button={
            <Button>
              <PrinterIcon data-icon="inline-start" />
              Send to Print
            </Button>
          }
        />
        <FeatureSheetAction
          context={featureSheetContext}
          actionKind="pdf_review"
          title="Download PDF"
          description="Create a PDF review draft for staff to verify before any legacy storage or delivery action."
          action="Request PDF review"
          button={
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              Download PDF
            </Button>
          }
        />
      </FloatingActionBar>
    </div>
  )
}

function FeatureStatusCard({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
  tone?: "amber"
}) {
  return (
    <Card className="rounded-lg" size="sm">
      <CardContent className="flex items-center gap-4">
        <span
          className={
            tone === "amber"
              ? "flex size-10 items-center justify-center rounded-md bg-amber-100 text-amber-700"
              : "flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
          }
        >
          {icon}
        </span>
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-base font-semibold">{value}</div>
          <div className="text-sm text-muted-foreground">{detail}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturePageThumb({ page }: { page: number }) {
  return (
    <div className="aspect-[.72/1] rounded-sm bg-muted p-1">
      <div className="h-2 w-12 rounded bg-foreground/15" />
      <div className="mt-2 aspect-video rounded bg-background" />
      <div className="mt-2 grid gap-1">
        {Array.from({ length: page === 1 ? 4 : 7 }).map((_, index) => (
          <div key={index} className="h-1 rounded bg-foreground/10" />
        ))}
      </div>
    </div>
  )
}

function FeatureSheetPreview() {
  return (
    <div className="mx-auto max-w-4xl rounded-sm border bg-background p-8 shadow-sm">
      <div className="grid gap-8 md:grid-cols-[1.2fr_.9fr]">
        <div>
          <div className="text-2xl font-semibold tracking-wide">
            1238 HOMER ST
          </div>
          <div className="text-muted-foreground">VANCOUVER, BC</div>
        </div>
        <div className="text-right text-lg font-semibold tracking-[0.25em]">
          NORTH STAR
          <div className="text-xs font-normal tracking-[0.35em] text-muted-foreground">
            REALTY
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1.25fr_.85fr]">
        <div className="overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoAssets[2].image}
            alt=""
            className="aspect-[1.45/1] w-full object-cover"
          />
        </div>
        <div>
          <div className="border-b pb-3 text-sm font-semibold uppercase">
            Property Highlights
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {[
              "3,240 sq ft of refined living space",
              "4 bedrooms + den, 3.5 bathrooms",
              "Gourmet kitchen with premium appliances",
              "Open concept living with 10' ceilings",
              "Legal suite with private entrance",
              "Landscaped yard with covered patio",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3">
        {photoAssets.slice(0, 4).map((item) => (
          <div key={item.title} className="overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="aspect-[1.25/1] w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-4 border-t pt-4 text-xs font-medium text-muted-foreground">
        <span>4 BEDS</span>
        <span>3.5 BATHS</span>
        <span>3,240 SQ FT</span>
        <span>2 CAR GARAGE</span>
        <span>reala.com</span>
      </div>
    </div>
  )
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function RevisionItem({
  author,
  status,
  body,
  time,
}: {
  author: string
  status: string
  body: string
  time: string
}) {
  return (
    <div className="grid gap-2 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-muted" />
        <div className="font-medium">{author}</div>
        <Badge variant="secondary">{status}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">{body}</div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  )
}

function FeatureSheetAction({
  context,
  actionKind,
  title,
  description,
  action,
  button,
  printIntent = false,
}: {
  context: {
    listingId: string
    listingAddress: string
    listingArea: string
    pathname: string
    templateName: string
    featureSheetProduct: string
    featureSheetStyle: string
    paperWeight: string
    hoodReportOrMlsPage: string
    proofVersion: string
    proofStatus: string
    printedMaterialStatus: string
    proofSource: string
    selectedPhotos: string
    floorPlanStatus: string
    existingFloorPlan: string
    listingFactsStatus: string
    copyTemplateNotes: string
  }
  actionKind:
    | "proof_edit"
    | "revision_request"
    | "approval_request"
    | "print_intent"
    | "pdf_review"
  title: string
  description: string
  action: string
  button: ReactElement
  printIntent?: boolean
}) {
  return (
    <Sheet>
      <SheetTrigger render={button} />
      <SheetContent className="w-[min(560px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <form action={submitFeatureSheetPrintDraftAction}>
          <input type="hidden" name="pathname" value={context.pathname} />
          <input type="hidden" name="listingId" value={context.listingId} />
          <input type="hidden" name="listingAddress" value={context.listingAddress} />
          <input type="hidden" name="listingArea" value={context.listingArea} />
          <input type="hidden" name="templateName" value={context.templateName} />
          <input
            type="hidden"
            name="featureSheetProduct"
            value={context.featureSheetProduct}
          />
          <input
            type="hidden"
            name="featureSheetStyle"
            value={context.featureSheetStyle}
          />
          <input type="hidden" name="paperWeight" value={context.paperWeight} />
          <input
            type="hidden"
            name="hoodReportOrMlsPage"
            value={context.hoodReportOrMlsPage}
          />
          <input type="hidden" name="proofVersion" value={context.proofVersion} />
          <input type="hidden" name="proofStatus" value={context.proofStatus} />
          <input
            type="hidden"
            name="printedMaterialStatus"
            value={context.printedMaterialStatus}
          />
          <input type="hidden" name="proofSource" value={context.proofSource} />
          <input type="hidden" name="selectedPhotos" value={context.selectedPhotos} />
          <input type="hidden" name="floorPlanStatus" value={context.floorPlanStatus} />
          <input type="hidden" name="existingFloorPlan" value={context.existingFloorPlan} />
          <input
            type="hidden"
            name="listingFactsStatus"
            value={context.listingFactsStatus}
          />
          <input
            type="hidden"
            name="copyTemplateNotes"
            value={context.copyTemplateNotes}
          />
          <input type="hidden" name="actionKind" value={actionKind} />
          <input type="hidden" name="actionLabel" value={title} />

          <SheetHeader className="border-b p-6 pr-14">
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-6">
            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle>Feature Sheet Proof</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <FactRow label="Listing" value={context.listingAddress} />
                <FactRow label="Template" value={context.templateName} />
                <FactRow label="Version" value={context.proofVersion} />
                <FactRow label="Status" value={context.proofStatus} />
                <FactRow label="Printed status" value={context.printedMaterialStatus} />
                <FactRow label="Selected photos" value={context.selectedPhotos} />
                <FactRow label="Floor plan" value={context.floorPlanStatus} />
                <FactRow label="Style" value={context.featureSheetStyle} />
                <FactRow label="Paper weight" value={context.paperWeight} />
              </CardContent>
            </Card>

            {printIntent ? (
              <Card className="rounded-lg" size="sm">
                <CardHeader>
                  <CardTitle>Print Intent</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`${actionKind}-product`}>
                      Legacy printed material product
                    </label>
                    <Input
                      id={`${actionKind}-product`}
                      name="printProduct"
                      defaultValue={context.featureSheetProduct}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`${actionKind}-style`}>
                      Style / template source
                    </label>
                    <Input
                      id={`${actionKind}-style`}
                      name="featureSheetStyle"
                      defaultValue={context.featureSheetStyle}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${actionKind}-quantity`}
                      >
                        Quantity
                      </label>
                      <Input
                        id={`${actionKind}-quantity`}
                        name="printQuantity"
                        defaultValue="50"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${actionKind}-paper`}
                      >
                        Paper weight
                      </label>
                      <Input
                        id={`${actionKind}-paper`}
                        name="paperWeight"
                        defaultValue={context.paperWeight}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${actionKind}-hood-report`}
                      >
                        Hood report / MLS page
                      </label>
                      <Input
                        id={`${actionKind}-hood-report`}
                        name="hoodReportOrMlsPage"
                        defaultValue={context.hoodReportOrMlsPage}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${actionKind}-delivery-method`}
                      >
                        Drop off / deliver to
                      </label>
                      <Input
                        id={`${actionKind}-delivery-method`}
                        name="printDeliveryMethod"
                        defaultValue="Reala office / brokerage front counter review"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor={`${actionKind}-delivery-notes`}
                    >
                      Delivery / pickup notes
                    </label>
                    <Textarea
                      id={`${actionKind}-delivery-notes`}
                      name="printDeliveryNotes"
                      placeholder="Pickup timing, delivery constraints, paper stock, or production notes for staff review."
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <input type="hidden" name="printProduct" value="" />
                <input type="hidden" name="printQuantity" value="" />
                <input type="hidden" name="printDeliveryMethod" value="" />
                <input type="hidden" name="printDeliveryNotes" value="" />
              </>
            )}

            <Card className="rounded-lg" size="sm">
              <CardHeader>
                <CardTitle>Staff Review Notes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Textarea
                  name="notes"
                  placeholder="Add instructions, approval comments, print notes, or revision details for Reala staff review."
                />
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                  Portal-native draft only. This creates a bridge ledger row for
                  dry-run review and does not write to legacy, generate an
                  invoice, charge a card, upload to legacy storage, or start
                  print fulfillment.
                </div>
              </CardContent>
            </Card>
          </div>
          <SheetFooter className="border-t p-6">
            <Button type="submit">{action}</Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function VirtualStagingTab() {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <Card className="rounded-lg" size="sm">
          <CardHeader>
            <CardTitle className="text-xs font-semibold uppercase">
              Source Photos (6)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {stagingRooms.map((room, index) => (
              <button
                key={room}
                type="button"
                className={
                  index === 0
                    ? "grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-md border-l-2 border-red-500 bg-muted p-2 text-left"
                    : "grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
                }
              >
                <div className="size-12 overflow-hidden rounded-md border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoAssets[index % photoAssets.length].image}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">
                  {index + 1}. {room}
                </span>
                {index === 0 ? <CheckCircle2Icon className="text-muted-foreground" /> : null}
              </button>
            ))}
            <Button variant="outline" className="mt-2">
              Manage Photos
            </Button>
          </CardContent>
        </Card>

        <div className="grid min-h-[720px] gap-4">
          <Card className="flex h-full flex-col rounded-lg" size="sm">
            <CardHeader className="grid-cols-[1fr_auto] items-center">
              <CardTitle className="text-xs font-semibold uppercase">
                Living Room · Source Photo 1
              </CardTitle>
              <Button variant="link" size="sm">
                View full gallery →
              </Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="grid flex-1 gap-4 lg:grid-cols-[1.1fr_2fr]">
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Original
                  </div>
                  <div className="overflow-hidden rounded-lg border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoAssets[0].image}
                      alt=""
                      className="aspect-[.95/1] w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Staged Variants (4)
                  </div>
                  <Carousel opts={{ align: "start" }} className="px-8">
                    <CarouselContent>
                      {stagingVariants.map((variant, index) => (
                        <CarouselItem
                          key={variant.name}
                          className="basis-56"
                        >
                          <div
                            className={
                              index === 0
                                ? "overflow-hidden rounded-lg border-2 border-red-400 bg-background"
                                : "overflow-hidden rounded-lg border bg-background"
                            }
                          >
                            <div className="relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={variant.image}
                                alt=""
                                className="aspect-[.9/1] w-full object-cover"
                              />
                              {index === 0 ? (
                                <Badge className="absolute right-2 top-2 bg-green-100 text-green-700 hover:bg-green-100">
                                  Approved
                                </Badge>
                              ) : null}
                            </div>
                            <div className="grid gap-1 p-3 text-sm">
                              <div className="font-medium">Variant {index + 1}</div>
                              <div className="text-muted-foreground">
                                {variant.name}
                              </div>
                              <Badge className={variant.badgeClassName}>
                                {variant.status}
                              </Badge>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                  </Carousel>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
                <span>
                  AI staging generated on May 10, 2026 · All variants are 4K
                  renderings
                </span>
                <Button variant="outline">Compare Variants</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <DashboardCard title="Staging Settings">
            <div className="grid gap-4 text-sm">
              <FactRow label="Room Type" value="Living Room" />
              <FactRow label="Design Style" value="Modern Light" />
              <FactRow label="Remove Furniture" value="Enabled" />
              <FactRow label="Keep Fixed Elements" value="Fireplace" />
              <div>
                <div className="font-medium">Notes / Instructions</div>
                <div className="mt-2 rounded-md border p-3 text-muted-foreground">
                  Keep the neutral palette and add contemporary furnishings with
                  natural textures.
                </div>
              </div>
              <FactRow label="Credit Usage" value="4 images · -4 credits" />
            </div>
          </DashboardCard>
          <DashboardCard title="Credit Info">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <IconTile>
                  <ZapIcon />
                </IconTile>
                <div>
                  <div className="text-xl font-semibold">824 / 1,200</div>
                  <div className="text-muted-foreground">Credits remaining this month</div>
                </div>
              </div>
              <Progress value={824} max={1200} />
              <div className="flex items-center justify-between text-muted-foreground">
                <span>376 used</span>
                <span>68% remaining</span>
              </div>
              <Separator />
              <FactRow label="This request" value="4 images · -4 credits" />
              <FactRow label="Pending outputs" value="6 across 3 rooms" />
              <FactRow label="Approved this month" value="18 images" />
            </div>
          </DashboardCard>
          <DashboardCard title="Activity & Comments">
            <RevisionItem
              author="Jamie Smith"
              status="Changes Requested"
              body="Variant 4 feels too sparse. Please add a larger area rug and a statement art piece."
              time="May 10, 2026 · 11:02 AM"
            />
            <RevisionItem
              author="Sarah Johnson"
              status="Approved"
              body="Variant 1 for Living Room approved. Looks great."
              time="May 10, 2026 · 10:15 AM"
            />
            <RevisionItem
              author="AI Studio"
              status="Generation Complete"
              body="Generated 4 variants for Living Room (Source Photo 1)."
              time="May 10, 2026 · 9:41 AM"
            />
            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
              Add a comment...
              <SendIcon className="ml-auto" />
            </div>
          </DashboardCard>
        </aside>
      </section>

      <FloatingActionBar columns="md:grid-cols-6">
        <StagingActionSheet
          title="Generate Staging"
          description="Create a new set of staged variants from selected source photos."
          action="Generate variants"
          button={
            <Button>
              <SparklesIcon data-icon="inline-start" />
              Generate Staging
            </Button>
          }
        />
        <StagingActionSheet
          title="Regenerate Variant"
          description="Regenerate the selected variant with updated instructions."
          action="Regenerate"
          button={<Button variant="outline">Regenerate Variant</Button>}
        />
        <StagingActionSheet
          title="Approve Selected"
          description="Approve the selected staged image and mark it ready for gallery."
          action="Approve selected"
          button={
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <CheckCircle2Icon data-icon="inline-start" />
              Approve Selected
            </Button>
          }
        />
        <StagingActionSheet
          title="Request Changes"
          description="Send revision notes for this staging output."
          action="Send request"
          button={
            <Button variant="outline">
              <MessageSquareIcon data-icon="inline-start" />
              Request Changes
            </Button>
          }
        />
        <StagingActionSheet
          title="Send to Gallery"
          description="Publish the approved staged output to the listing gallery."
          action="Send to gallery"
          button={
            <Button variant="outline">
              <UploadIcon data-icon="inline-start" />
              Send to Gallery
            </Button>
          }
        />
        <StagingActionSheet
          title="Download All"
          description="Download all current staged outputs as a production-ready bundle."
          action="Download bundle"
          button={
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              Download All
            </Button>
          }
        />
      </FloatingActionBar>
    </div>
  )
}

function FloatingActionBar({
  children,
  columns,
}: {
  children: ReactNode
  columns: string
}) {
  return (
    <div className="sticky bottom-4 rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className={`grid gap-3 ${columns} [&_button]:w-full`}>
        {children}
      </div>
    </div>
  )
}

function StagingActionSheet({
  title,
  description,
  action,
  button,
}: {
  title: string
  description: string
  action: string
  button: ReactElement
}) {
  return (
    <Sheet>
      <SheetTrigger render={button} />
      <SheetContent className="w-[min(600px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-6">
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle>Living Room Staging</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <FactRow label="Source Photo" value="Living Room · Photo 1" />
              <FactRow label="Style" value="Modern Light" />
              <FactRow label="Variant" value="Variant 1" />
              <FactRow label="Status" value="Approved" />
            </CardContent>
          </Card>
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="min-h-28 rounded-md border p-3 text-sm text-muted-foreground">
              Add generation notes, approval context, gallery publishing options,
              or download settings here.
            </CardContent>
          </Card>
        </div>
        <SheetFooter className="border-t p-6">
          <Button>{action}</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function WebsiteTab() {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-6 py-4 text-xs font-semibold uppercase tracking-wide">
              <span>North Star Realty</span>
              <div className="hidden gap-6 text-muted-foreground md:flex">
                <span>Overview</span>
                <span>Gallery</span>
                <span>Features</span>
                <span>Floor Plan</span>
                <span>Location</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="relative min-h-[520px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoAssets[2].image} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-black/35" />
              <div className="relative flex min-h-[520px] flex-col justify-end p-8 text-white">
                <h3 className="max-w-xl text-4xl font-semibold">1238 Homer Street</h3>
                <p className="mt-3 text-xl">Vancouver, BC V6B 2Y5</p>
                <p className="mt-4 max-w-xl text-lg">Elegant living in the heart of Vancouver.</p>
                <div className="mt-8 grid max-w-2xl grid-cols-4 gap-4 text-sm">
                  <WebsiteFact value="4" label="Bedrooms" />
                  <WebsiteFact value="3.5" label="Bathrooms" />
                  <WebsiteFact value="3,240" label="Sq Ft" />
                  <WebsiteFact value="2" label="Garage" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 border-t p-3">
              <MonitorIcon />
              <TabletIcon className="text-muted-foreground" />
              <WebsiteActionSheet
                title="Preview Site"
                description="Preview the draft public page before publishing."
                action="Open preview"
                button={
                  <Button variant="outline" size="sm" className="ml-auto">
                    Preview Site
                    <ExternalLinkIcon data-icon="inline-end" />
                  </Button>
                }
              />
            </div>
          </div>

          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase">Content Source</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-5">
              {websiteSources.map((source) => (
                <div key={source.title} className="grid gap-2 border-r pr-4 last:border-r-0">
                  <IconTile>{source.icon}</IconTile>
                  <div className="font-medium">{source.title}</div>
                  <div className="text-xs text-muted-foreground">{source.detail}</div>
                  <Badge className="w-fit bg-green-100 text-green-700 hover:bg-green-100">{source.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <DashboardCard title="Website Configuration">
            <div className="grid gap-4 text-sm">
              <FactRow label="Website URL" value="1238homer.reala.site" />
              <FactRow label="Publish Status" value="Draft" />
              <div>
                <div className="mb-2 text-muted-foreground">Branding</div>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border">
                  <div className="bg-foreground px-3 py-2 text-center text-background">Branded</div>
                  <div className="px-3 py-2 text-center text-muted-foreground">Unbranded</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md border p-3">
                <div className="size-14 overflow-hidden rounded-md bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoAssets[2].image} alt="" className="size-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">Exterior - Dusk Front</div>
                  <div className="text-xs text-muted-foreground">Primary hero image</div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <FactRow label="Gallery Order" value="Custom order" />
            </div>
          </DashboardCard>

          <DashboardCard title="Site Sections">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {["Overview", "Gallery", "Features", "Floor Plan", "Matterport Tour", "Contact"].map((item) => (
                <div key={item} className="flex items-center justify-between gap-3">
                  <span>{item}</span>
                  <span className="h-5 w-9 rounded-full bg-green-600 p-0.5">
                    <span className="block size-4 translate-x-4 rounded-full bg-white" />
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Actions & Links">
            <div className="grid grid-cols-2 gap-2">
              {websiteActions.map((item) => (
                <WebsiteActionSheet
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  action={item.action}
                  button={item.button}
                />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Website Activity">
            <div className="grid gap-3 text-sm">
              <ActivityLine title="Draft URL updated" meta="May 10, 2026 · 10:24 AM" />
              <ActivityLine title="Gallery order updated" meta="May 8, 2026 · 2:15 PM" />
              <ActivityLine title="Published draft created" meta="May 2, 2026 · 2:14 PM" />
            </div>
          </DashboardCard>
        </aside>
      </section>
    </div>
  )
}

function WebsiteFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/30 pl-4 first:border-l-0 first:pl-0">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-white/75">{label}</div>
    </div>
  )
}

function ActivityLine({
  title,
  meta,
}: {
  icon?: ReactNode
  title: string
  meta: string
  time?: string
}) {
  return (
    <div className="grid gap-1 border-b pb-3 last:border-b-0 last:pb-0">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{meta}</div>
    </div>
  )
}

function WebsiteActionSheet({
  title,
  description,
  action,
  button,
}: {
  title: string
  description: string
  action: string
  button: ReactElement
}) {
  return (
    <Sheet>
      <SheetTrigger render={button} />
      <SheetContent className="w-[min(560px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-6">
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle>Website Draft</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <FactRow label="URL" value="1238homer.reala.site" />
              <FactRow label="Status" value="Draft" />
              <FactRow label="Gallery Items" value="43 synced" />
              <FactRow label="Branding" value="North Star Realty" />
            </CardContent>
          </Card>
        </div>
        <SheetFooter className="border-t p-6">
          <Button>{action}</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ApprovalsTab() {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_200px_180px_auto]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search approvals..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="changes">Changes requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="review">In review</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="feature-sheet">Feature sheet</SelectItem>
                  <SelectItem value="virtual-staging">Virtual staging</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="print">Print</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="due">Due soon</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="ghost">Clear</Button>
          </div>

          <Card className="rounded-lg" size="sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Approval Type</TableHead>
                  <TableHead>Item / Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRows.map((approval, index) => (
                  <TableRow key={approval.type} className={index === 0 ? "border-l-2 border-l-red-500 bg-red-50/30" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <IconTile>{approval.icon}</IconTile>
                        <div>
                          <div className="font-medium">{approval.type}</div>
                          <div className="text-xs text-muted-foreground">{approval.subtype}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{approval.item}</div>
                      <div className="text-xs text-muted-foreground">{approval.description}</div>
                    </TableCell>
                    <TableCell><Badge className={approval.badgeClassName}>{approval.status}</Badge></TableCell>
                    <TableCell>
                      <div>{approval.date}</div>
                      <div className="text-xs text-muted-foreground">{approval.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-muted" />
                        <div>
                          <div className="font-medium">{approval.requestedBy}</div>
                          <div className="text-xs text-muted-foreground">{approval.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-12 w-20 overflow-hidden rounded-md border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={approval.preview} alt="" className="size-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ApprovalDetailSheet approval={approval} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="rounded-lg" size="sm">
            <CardHeader className="grid-cols-[1fr_auto] items-center">
              <CardTitle className="text-xs font-semibold uppercase">Recent Decisions</CardTitle>
              <Button variant="link" size="sm">View all decisions →</Button>
            </CardHeader>
            <CardContent className="grid gap-1">
              {recentDecisions.map((decision) => (
                <div key={decision.item} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b py-3 text-sm last:border-b-0">
                  <IconTile>{decision.icon}</IconTile>
                  <div className="font-medium">{decision.item}</div>
                  <Badge className={decision.badgeClassName}>{decision.status}</Badge>
                  <div className="text-muted-foreground">{decision.date}</div>
                  <div className="text-right">
                    <div className="font-medium">{decision.by}</div>
                    <div className="text-xs text-muted-foreground">Brokerage Admin</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <ApprovalSidePreview approval={approvalRows[0]} />
        </aside>
      </section>
    </div>
  )
}

function ApprovalSidePreview({ approval }: { approval: ApprovalRow }) {
  return (
    <Card className="rounded-lg" size="sm">
      <CardHeader className="grid-cols-[1fr_auto] items-start">
        <div>
          <CardTitle className="text-xl">{approval.type}</CardTitle>
          <div className="text-sm text-muted-foreground">{approval.subtype}</div>
        </div>
        <Badge className={approval.badgeClassName}>{approval.status}</Badge>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Separator />
        <div>
          <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Listing</div>
          <div className="flex items-center gap-3">
            <div className="size-20 overflow-hidden rounded-md border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoAssets[2].image} alt="" className="size-full object-cover" />
            </div>
            <div>
              <div className="font-semibold">1238 Homer St</div>
              <div className="text-sm text-muted-foreground">Vancouver, BC V6B 2Y5</div>
              <div className="text-sm text-muted-foreground">MLS # R2865478</div>
            </div>
          </div>
        </div>
        <FactRow label="Requested By" value={approval.requestedBy} />
        <div>
          <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Notes</div>
          <p className="text-sm text-muted-foreground">Updated pricing and open house info on page 2. Please review and approve.</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Proof Preview</div>
          <div className="overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoAssets[2].image} alt="" className="aspect-[1.4/1] w-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {["Submitted", "In Review", "Approved", "Delivered"].map((step, index) => (
            <div key={step} className="grid gap-2">
              <div className={index === 0 ? "mx-auto grid size-7 place-items-center rounded-full border border-amber-500 text-amber-600" : "mx-auto size-7 rounded-full border bg-background"}>
                {index === 0 ? <ClockIcon /> : null}
              </div>
              <span className="text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
        <ApprovalDetailSheet approval={approval} trigger={<Button className="w-full bg-green-600 text-white hover:bg-green-700">Approve</Button>} />
        <ApprovalDetailSheet approval={approval} trigger={<Button variant="outline" className="w-full"><MessageSquareIcon data-icon="inline-start" />Request Changes</Button>} />
      </CardContent>
    </Card>
  )
}

function ApprovalDetailSheet({ approval, trigger }: { approval: ApprovalRow; trigger?: ReactElement }) {
  return (
    <Sheet>
      <SheetTrigger render={trigger ?? <Button variant="outline" size="sm">Review <ChevronDownIcon data-icon="inline-end" /></Button>} />
      <SheetContent className="w-[min(560px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle className="text-xl">{approval.type}</SheetTitle>
          <SheetDescription>{approval.subtype}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-5 p-6">
          <Card className="rounded-lg" size="sm">
            <CardHeader><CardTitle>Approval Details</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <FactRow label="Status" value={approval.status} />
              <FactRow label="Submitted" value={`${approval.date} ${approval.time}`} />
              <FactRow label="Requested By" value={approval.requestedBy} />
              <FactRow label="Item" value={approval.item} />
            </CardContent>
          </Card>
          <Card className="rounded-lg" size="sm">
            <CardHeader><CardTitle>Review Notes</CardTitle></CardHeader>
            <CardContent className="min-h-28 rounded-md border p-3 text-sm text-muted-foreground">
              Add approval comments, requested changes, or delivery notes here.
            </CardContent>
          </Card>
        </div>
        <SheetFooter className="border-t p-6">
          <Button className="bg-green-600 text-white hover:bg-green-700">Approve</Button>
          <Button variant="outline">Request Changes</Button>
          <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function BillingTab() {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-3">
        <BillingSummaryCard
          icon={<FileTextIcon />}
          label="Estimate Total"
          value="$1,931.07"
          detail="Includes taxes"
          action="View estimate details"
        />
        <BillingSummaryCard
          icon={<DollarSignIcon />}
          label="Outstanding Balance"
          value="$1,431.07"
          detail="Due May 18, 2026"
          action="View invoice"
          tone="danger"
        />
        <BillingSummaryCard
          icon={<ClockIcon />}
          label="Payment Status"
          value="Payment Due"
          detail="Invoice not paid"
          action="Pay balance"
          badge="Payment Due"
          tone="amber"
        />
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle className="text-sm uppercase text-muted-foreground">
                Service Line Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty / Unit</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount / Coverage</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingLineItems.map((item) => (
                      <TableRow key={item.service}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <IconTile>{item.icon}</IconTile>
                            <span className="font-medium">{item.service}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                        <TableCell>
                          <div className="font-medium text-green-700">{item.coverage}</div>
                          <div className="text-xs text-muted-foreground">{item.coverageDetail}</div>
                        </TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          <Badge className={item.statusClassName}>{item.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <BillingActionSheet
                  title="Add Service"
                  description="Add another listing service or billable add-on to this estimate."
                  action="Add service"
                  trigger={
                    <Button variant="outline" size="sm">
                      <PlusIcon data-icon="inline-start" />
                      Add Service
                    </Button>
                  }
                />
                <div className="w-full text-sm md:w-64">
                  <FactRow label="Subtotal" value="$1,931.07" />
                  <FactRow label="Tax (GST 5%)" value="$0.00" />
                  <Separator className="my-2" />
                  <FactRow label="Estimate Total" value="$1,931.07" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <DashboardCard title="Upcoming Billing">
              <div className="flex items-start gap-3">
                <IconTile>
                  <CalendarIcon />
                </IconTile>
                <div>
                  <div className="font-medium">Next invoice will be issued upon delivery completion</div>
                  <div className="text-sm text-muted-foreground">Invoice expected: May 18, 2026</div>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard title="Billing Activity">
              <div className="grid gap-3">
                {billingActivity.map((item) => (
                  <ActivityLine
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    meta={item.meta}
                    time={item.time}
                  />
                ))}
              </div>
              <Button variant="link" className="mt-3 px-0">
                View all billing activity
                <ArrowLeftIcon className="rotate-180" data-icon="inline-end" />
              </Button>
            </DashboardCard>
          </div>
        </div>

        <div className="grid gap-4">
          <DashboardCard title="Invoice">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <FactRow label="Invoice #" value="INV-1217" />
              <FactRow label="Issue Date" value="May 10, 2026" />
              <FactRow label="Due Date" value="May 18, 2026" />
            </div>
            <Separator className="my-4" />
            <FactRow label="Invoice Total" value="$1,931.07" />
            <FactRow label="Amount Paid" value="$500.00" />
            <FactRow label="Balance Due" value="$1,431.07" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <BillingActionSheet
                title="Invoice INV-1217"
                description="Preview the invoice PDF, service lines, taxes, and payment history."
                action="Open invoice"
                trigger={<Button variant="outline">View Invoice</Button>}
              />
              <BillingActionSheet
                title="Download Receipt"
                description="Download the latest payment receipt for this listing."
                action="Download receipt"
                trigger={
                  <Button variant="outline">
                    <DownloadIcon data-icon="inline-start" />
                    Download Receipt
                  </Button>
                }
              />
            </div>
            <BillingActionSheet
              title="Pay Balance"
              description="Collect the outstanding balance for INV-1217."
              action="Pay balance"
              trigger={<Button className="mt-2 w-full bg-red-600 text-white hover:bg-red-700">Pay Balance</Button>}
            />
          </DashboardCard>

          <DashboardCard title="Payment Method / Terms">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Account Terms</div>
                <div className="text-sm text-muted-foreground">
                  Current term period: May 3 - Jun 1, 2026
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Net 30</Badge>
            </div>
            <Separator className="my-4" />
            <FactRow label="Billing Contact" value="Jamie Smith" />
            <FactRow label="Email" value="jamie@smithgroup.com" />
            <BillingActionSheet
              title="Billing Details"
              description="Manage account terms, billing contacts, payment method, and invoice delivery."
              action="Save billing details"
              trigger={<Button variant="outline" className="mt-4 w-full">View billing details</Button>}
            />
          </DashboardCard>

          <DashboardCard title="Credits & Discounts">
            <FactRow label="Package Coverage" value="-$1,395.00" />
            <FactRow label="Additional Credits Applied" value="-$0.00" />
            <FactRow label="Tax (GST 5%)" value="$0.00" />
            <FactRow label="Overages / Add-ons" value="$315.00" />
            <Separator className="my-3" />
            <FactRow label="Estimated Total" value="$1,931.07" />
            <div className="mt-2 text-xs text-muted-foreground">
              Final charges may adjust based on actuals.
            </div>
          </DashboardCard>
        </div>
      </section>
    </div>
  )
}

function BillingSummaryCard({
  icon,
  label,
  value,
  detail,
  action,
  badge,
  tone,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
  action: string
  badge?: string
  tone?: "amber" | "danger"
}) {
  return (
    <Card className="rounded-lg" size="sm">
      <CardContent className="flex items-start gap-4">
        <span
          className={
            tone === "danger"
              ? "flex size-10 items-center justify-center rounded-md bg-red-100 text-red-700"
              : tone === "amber"
                ? "flex size-10 items-center justify-center rounded-md bg-amber-100 text-amber-700"
                : "flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
          }
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
            {badge ? <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{badge}</Badge> : null}
          </div>
          <div className={tone === "danger" ? "mt-2 text-xl font-semibold text-red-600" : "mt-2 text-xl font-semibold"}>
            {value}
          </div>
          <div className="text-sm text-muted-foreground">{detail}</div>
          <BillingActionSheet
            title={label}
            description={`${action} for 1238 Homer St.`}
            action={action}
            trigger={
              <Button variant="link" className="mt-2 h-auto px-0">
                {action}
                <ArrowLeftIcon className="rotate-180" data-icon="inline-end" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

function BillingActionSheet({
  title,
  description,
  action,
  trigger,
}: {
  title: string
  description: string
  action: string
  trigger: ReactElement
}) {
  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent className="w-[min(640px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-6">
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle>Billing Context</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <FactRow label="Listing" value="1238 Homer St" />
              <FactRow label="Invoice" value="INV-1217" />
              <FactRow label="Balance Due" value="$1,431.07" />
              <FactRow label="Account Terms" value="Net 30" />
            </CardContent>
          </Card>
          <Card className="rounded-lg" size="sm">
            <CardHeader>
              <CardTitle>Workflow Stub</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This sheet is ready for invoice preview, payment collection, receipt download, term edits, and audit notes.
            </CardContent>
          </Card>
        </div>
        <SheetFooter className="border-t p-6">
          <Button>{action}</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function MediaToolbar() {
  return (
    <div className="-ml-6 flex flex-wrap items-center justify-between gap-3 border-b pl-6 pb-4">
      <div className="flex gap-2">
        <Button variant="outline">
          <UploadIcon />
          Upload
        </Button>
        <Button variant="outline">
          <Share2Icon />
          Share Gallery
        </Button>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="List view">
          <ListIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Grid view">
          <Grid2X2Icon />
        </Button>
      </div>
    </div>
  )
}

function MediaSection({
  title,
  viewAll,
  items,
  compact,
}: {
  title: string
  viewAll: string
  items: MediaAsset[]
  compact?: boolean
}) {
  return (
    <section className="border-b py-5 last:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="link" size="sm">
          {viewAll}
        </Button>
      </div>
      <div
        className={`grid gap-3 ${
          compact
            ? "grid-cols-2 md:grid-cols-3 2xl:grid-cols-5"
            : "grid-cols-1 md:grid-cols-3 2xl:grid-cols-5"
        }`}
      >
        {items.map((item) => (
          <div
            key={item.title}
            className={`overflow-hidden rounded-md border bg-muted ${
              compact ? "aspect-[1.8/1]" : "aspect-[1.45/1]"
            }`}
          >
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.title}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-background">
                <div className="h-2/3 w-4/5 rounded-sm border border-dashed border-muted-foreground/50 bg-[linear-gradient(90deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%),linear-gradient(0deg,transparent_24%,hsl(var(--border))_25%,transparent_26%,transparent_74%,hsl(var(--border))_75%,transparent_76%)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function StubPanel({ title, body }: { title: string; body: string }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{body}</CardContent>
    </Card>
  )
}

type MediaAsset = {
  title: string
  image?: string
}

type ApprovalRow = {
  icon: ReactNode
  type: string
  subtype: string
  item: string
  description: string
  status: string
  badgeClassName: string
  date: string
  time: string
  requestedBy: string
  role: string
  preview: string
}

const mediaLibrary = [
  { value: "all-media", label: "All Media", count: "89" },
  { value: "photos", label: "Photos", count: "43" },
  { value: "floor-plans", label: "Floor Plans", count: "6" },
  { value: "video", label: "Video", count: "3" },
  { value: "matterport", label: "Matterport", count: "1" },
  { value: "virtual-staging", label: "Virtual Staging", count: "18" },
  { value: "print-files", label: "Print Files", count: "6" },
  { value: "documents", label: "Documents", count: "7" },
]

const orderedServices = [
  {
    icon: <CameraIcon />,
    title: "Standard Photography",
    subtitle: "25 photos + twilight",
    category: "Photography",
    status: "Completed",
    statusClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    assignee: "Jamie Smith",
    vendor: "Smith Media",
    milestone: "Delivered",
    date: "May 10, 2026",
    price: "Included",
    coverage: "Standard Package",
    action: "View Details",
  },
  {
    icon: <ImageIcon />,
    title: "Premium Floor Plan",
    subtitle: "2D + dimensions",
    category: "Floor Plans",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    assignee: "FloorPlan Pros",
    vendor: "Measured plans",
    milestone: "Draft ready",
    date: "May 12, 2026",
    price: "Included",
    coverage: "Marketing Plus",
    action: "View Details",
  },
  {
    icon: <CuboidIcon />,
    title: "Matterport Tour",
    subtitle: "Full property",
    category: "Matterport & Tours",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    assignee: "3D Spaces",
    vendor: "Capture team",
    milestone: "Capture scheduled",
    date: "May 13, 2026",
    price: "Included",
    coverage: "Marketing Plus",
    action: "View Details",
  },
  {
    icon: <FileTextIcon />,
    title: "Feature Sheet Creation",
    subtitle: "Branded, 4 pages",
    category: "Feature Sheets",
    status: "Proof Ready",
    statusClassName: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    assignee: "DesignHouse",
    vendor: "Print design",
    milestone: "Awaiting review",
    date: "May 11, 2026",
    price: "Included",
    coverage: "Marketing Plus",
    action: "Review Proof",
  },
  {
    icon: <BedIcon />,
    title: "Virtual Staging",
    subtitle: "6 images",
    category: "Virtual Staging",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    assignee: "Visual Space 3D",
    vendor: "AI Studio",
    milestone: "Draft ready",
    date: "May 15, 2026",
    price: "Included",
    coverage: "Marketing Plus",
    action: "View Details",
  },
  {
    icon: <HomeIcon />,
    title: "Single Property Website",
    subtitle: "Branded",
    category: "Websites",
    status: "In Production",
    statusClassName: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    assignee: "Reala Studio",
    vendor: "Web team",
    milestone: "Draft site",
    date: "May 16, 2026",
    price: "Add-on",
    coverage: "+$195",
    action: "View Details",
  },
  {
    icon: <FileTextIcon />,
    title: "Print Brochures",
    subtitle: "100 qty, 8.5x11",
    category: "Print",
    status: "Scheduled",
    statusClassName: "bg-muted text-muted-foreground hover:bg-muted",
    assignee: "Print Shop",
    vendor: "Production",
    milestone: "In print",
    date: "May 18, 2026",
    price: "Add-on",
    coverage: "+$120",
    action: "View Details",
  },
]

const billingLineItems = [
  {
    icon: <CameraIcon />,
    service: "Photography Package",
    description: "25 photos + twilight",
    quantity: "1",
    unitPrice: "$495.00",
    coverage: "Included",
    coverageDetail: "Marketing Plus Package",
    amount: "$0.00",
    status: "Completed",
    statusClassName: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  {
    icon: <ImageIcon />,
    service: "Floor Plan (Premium)",
    description: "2D + dimensions",
    quantity: "1",
    unitPrice: "$250.00",
    coverage: "Included",
    coverageDetail: "Marketing Plus Package",
    amount: "$0.00",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: <CuboidIcon />,
    service: "Matterport 3D Tour",
    description: "Full property capture",
    quantity: "1",
    unitPrice: "$300.00",
    coverage: "Included",
    coverageDetail: "Marketing Plus Package",
    amount: "$0.00",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: <FileTextIcon />,
    service: "Feature Sheet (Premium)",
    description: "Branded, 4 pages",
    quantity: "1",
    unitPrice: "$175.00",
    coverage: "Included",
    coverageDetail: "Marketing Plus Package",
    amount: "$0.00",
    status: "Proof Ready",
    statusClassName: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  {
    icon: <BedIcon />,
    service: "Virtual Staging (6 images)",
    description: "Contemporary Light",
    quantity: "1",
    unitPrice: "$180.00",
    coverage: "Included",
    coverageDetail: "Marketing Plus Package",
    amount: "$0.00",
    status: "In Progress",
    statusClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: <GlobeIcon />,
    service: "Single Property Website",
    description: "Branded",
    quantity: "1",
    unitPrice: "$595.00",
    coverage: "Add-on",
    coverageDetail: "+$195",
    amount: "$195.00",
    status: "In Production",
    statusClassName: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  {
    icon: <PrinterIcon />,
    service: "Print Brochures",
    description: "100 qty, 8.5x11",
    quantity: "1",
    unitPrice: "$120.00",
    coverage: "Add-on",
    coverageDetail: "Print quantity",
    amount: "$120.00",
    status: "Scheduled",
    statusClassName: "bg-muted text-muted-foreground hover:bg-muted",
  },
]

const billingActivity = [
  {
    icon: <FileTextIcon />,
    title: "Invoice INV-1217 sent",
    meta: "System",
    time: "May 10, 2026  10:24 AM",
  },
  {
    icon: <CheckCircle2Icon />,
    title: "Payment authorized",
    meta: "Jamie Smith",
    time: "May 10, 2026  10:10 AM",
  },
  {
    icon: <FileCheckIcon />,
    title: "Estimate EST-1283 created",
    meta: "System",
    time: "May 9, 2026  3:15 PM",
  },
  {
    icon: <LinkIcon />,
    title: "Order O-2026-1217 confirmed",
    meta: "Sarah Johnson",
    time: "May 9, 2026  2:03 PM",
  },
]

const serviceAddOns = [
  {
    icon: <SparklesIcon />,
    title: "Twilight Photos",
    subtitle: "5 exterior photos",
    price: "+$175",
  },
  {
    icon: <CameraIcon />,
    title: "Drone Add-on",
    subtitle: "5 aerial photos",
    price: "+$195",
  },
  {
    icon: <CircleIcon />,
    title: "Social Clip (Reel)",
    subtitle: "30-60 sec video",
    price: "+$125",
  },
  {
    icon: <ZapIcon />,
    title: "Rush Delivery",
    subtitle: "24-48 hr turnaround",
    price: "+$150",
  },
]

const stagingRooms = [
  "Living Room",
  "Primary Bedroom",
  "Kitchen",
  "Dining Room",
  "Office",
  "Lower Level",
]

const stagingVariants = [
  {
    name: "Modern Light",
    status: "Approved",
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    image:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Contemporary",
    status: "Pending Review",
    badgeClassName: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Luxury",
    status: "Pending Review",
    badgeClassName: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Minimal",
    status: "Changes Requested",
    badgeClassName: "bg-red-100 text-red-700 hover:bg-red-100",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80",
  },
]

const websiteSources = [
  {
    icon: <HomeIcon />,
    title: "Listing Facts",
    detail: "MLS + Manual Overrides",
    status: "Synced",
  },
  {
    icon: <ImageIcon />,
    title: "Media Gallery",
    detail: "43 Photos, 6 Floor Plans",
    status: "Synced",
  },
  {
    icon: <FileTextIcon />,
    title: "Feature Sheet",
    detail: "Proof Ready",
    status: "Synced",
  },
  {
    icon: <CuboidIcon />,
    title: "Matterport Tour",
    detail: "3D Spaces Tour",
    status: "Synced",
  },
  {
    icon: <StarIcon />,
    title: "Branding",
    detail: "North Star Realty",
    status: "Active",
  },
]

const websiteActions = [
  {
    title: "Preview Site",
    description: "Preview the draft public page before publishing.",
    action: "Open preview",
    button: (
      <Button variant="outline">
        <EyeIcon data-icon="inline-start" />
        Preview Site
      </Button>
    ),
  },
  {
    title: "Publish Changes",
    description: "Publish synced listing content, gallery media, and section settings.",
    action: "Publish changes",
    button: (
      <Button>
        <UploadIcon data-icon="inline-start" />
        Publish Changes
      </Button>
    ),
  },
  {
    title: "Copy Link",
    description: "Copy the branded website URL.",
    action: "Copy link",
    button: (
      <Button variant="outline">
        <LinkIcon data-icon="inline-start" />
        Copy Link
      </Button>
    ),
  },
  {
    title: "Open Public Page",
    description: "Open the public page once published.",
    action: "Open page",
    button: (
      <Button variant="outline">
        <ExternalLinkIcon data-icon="inline-start" />
        Open Public Page
      </Button>
    ),
  },
]

const approvalPreviewImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=700&q=80",
]

const approvalRows: ApprovalRow[] = [
  {
    icon: <ClockIcon />,
    type: "Feature Sheet Proof",
    subtype: "Proof v2",
    item: "Property brochure",
    description: "4 pages",
    status: "Pending",
    badgeClassName: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    date: "May 10, 2026",
    time: "10:24 AM",
    requestedBy: "Jamie Smith",
    role: "Listing Agent",
    preview: approvalPreviewImages[0],
  },
  {
    icon: <FileTextIcon />,
    type: "Virtual Staging Variant",
    subtype: "Living Room (6 images)",
    item: "Contemporary Light",
    description: "Variant set 1",
    status: "Changes Requested",
    badgeClassName: "bg-red-100 text-red-700 hover:bg-red-100",
    date: "May 9, 2026",
    time: "11:22 AM",
    requestedBy: "Jamie Smith",
    role: "Listing Agent",
    preview: approvalPreviewImages[1],
  },
  {
    icon: <ClipboardListIcon />,
    type: "Gallery Publish",
    subtype: "32 Photos",
    item: "MLS & Website gallery",
    description: "Publish queue",
    status: "Pending",
    badgeClassName: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    date: "May 9, 2026",
    time: "10:15 AM",
    requestedBy: "Taylor Cole",
    role: "Marketing Coordinator",
    preview: approvalPreviewImages[2],
  },
  {
    icon: <GlobeIcon />,
    type: "Website Publish",
    subtype: "Single Property Site",
    item: "1238homer.reala.site",
    description: "Branded",
    status: "In Review",
    badgeClassName: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    date: "May 8, 2026",
    time: "2:11 PM",
    requestedBy: "James Wilson",
    role: "Marketing Manager",
    preview: approvalPreviewImages[3],
  },
  {
    icon: <FileCheckIcon />,
    type: "Print Proof",
    subtype: "Brochures (100 qty)",
    item: "Tri-fold brochure",
    description: "Front / Back",
    status: "Approved",
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    date: "May 7, 2026",
    time: "3:48 PM",
    requestedBy: "Maria Garcia",
    role: "Design Team",
    preview: approvalPreviewImages[4],
  },
  {
    icon: <CuboidIcon />,
    type: "Matterport Publish",
    subtype: "3D Tour",
    item: "Public share link",
    description: "MLS & Website",
    status: "Approved",
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    date: "May 6, 2026",
    time: "9:05 AM",
    requestedBy: "David Chen",
    role: "Media Specialist",
    preview: approvalPreviewImages[5],
  },
]

const recentDecisions = [
  {
    icon: <CheckCircle2Icon />,
    item: "Gallery Publish (32 Photos)",
    status: "Approved",
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    date: "May 8, 2026",
    by: "Sarah Johnson",
  },
  {
    icon: <MessageSquareIcon />,
    item: "Virtual Staging Variant",
    status: "Changes Requested",
    badgeClassName: "bg-red-100 text-red-700 hover:bg-red-100",
    date: "May 7, 2026",
    by: "Sarah Johnson",
  },
  {
    icon: <CheckCircle2Icon />,
    item: "Feature Sheet Proof v1",
    status: "Approved",
    badgeClassName: "bg-green-100 text-green-700 hover:bg-green-100",
    date: "May 6, 2026",
    by: "Sarah Johnson",
  },
]

const photoAssets: MediaAsset[] = [
  {
    title: "Living room",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Exterior",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Dining",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Kitchen detail",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=700&q=80",
  },
]

const floorPlanAssets: MediaAsset[] = [
  { title: "Main floor" },
  { title: "Upper floor" },
  { title: "Lower floor" },
  { title: "Site plan" },
  { title: "Garage plan" },
]

const stagingAssets: MediaAsset[] = [
  {
    title: "Staged living",
    image:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Staged bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Staged office",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Staged family room",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80",
  },
]
