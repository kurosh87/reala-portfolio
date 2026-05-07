"use client"

import * as React from "react"
import {
  BadgePercentIcon,
  BotIcon,
  BoxIcon,
  Building2Icon,
  CalendarClockIcon,
  CheckIcon,
  ClockIcon,
  CrownIcon,
  FlameIcon,
  ImageIcon,
  LayersIcon,
  MapIcon,
  PackageCheckIcon,
  PlusIcon,
  PrinterIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type ServiceCategory =
  | "Photography"
  | "Floor Plans"
  | "Matterport & Tours"
  | "Video & Drone"
  | "Feature Sheets"
  | "Virtual Staging"
  | "Print"
  | "Signs"
  | "Websites"
  | "Creative Assets"
  | "AI Services"

type Service = {
  name: string
  category: ServiceCategory
  description: string
  image: string
  price: string
  delivery: string
  creditEligible?: boolean
  scheduling?: boolean
  popular?: boolean
  discount?: string
  included: string[]
}

const categoryTabs: { label: ServiceCategory; icon: React.ReactNode }[] = [
  { label: "Photography", icon: <ImageIcon /> },
  { label: "Floor Plans", icon: <MapIcon /> },
  { label: "Matterport & Tours", icon: <BoxIcon /> },
  { label: "Video & Drone", icon: <VideoIcon /> },
  { label: "Feature Sheets", icon: <LayersIcon /> },
  { label: "Virtual Staging", icon: <SparklesIcon /> },
  { label: "Print", icon: <PrinterIcon /> },
  { label: "Signs", icon: <Building2Icon /> },
  { label: "Websites", icon: <PackageCheckIcon /> },
  { label: "Creative Assets", icon: <CrownIcon /> },
  { label: "AI Services", icon: <BotIcon /> },
]

const services: Service[] = [
  {
    name: "Standard Photography",
    category: "Photography",
    description: "High-quality interior and exterior photos.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=640&q=80",
    price: "$245",
    delivery: "24-48 hrs",
    creditEligible: true,
    popular: true,
    discount: "20% off",
    included: [
      "Up to 25 professionally edited photos",
      "Interior, exterior, and key detail shots",
      "Color correction and exposure balancing",
      "MLS-ready high resolution images",
    ],
  },
  {
    name: "Twilight Photography",
    category: "Photography",
    description: "Dusk exterior photos with balanced lighting.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=640&q=80",
    price: "$175",
    delivery: "24-48 hrs",
    scheduling: true,
    included: ["Front exterior twilight set", "Window glow edits", "MLS-ready exports"],
  },
  {
    name: "Drone Photography",
    category: "Photography",
    description: "Aerial photos showcasing property and area.",
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=640&q=80",
    price: "$195",
    delivery: "24-48 hrs",
    creditEligible: true,
    included: ["Aerial property angles", "Neighborhood context", "Edited image set"],
  },
  {
    name: "Standard Floor Plan",
    category: "Floor Plans",
    description: "Accurate 2D floor plan with dimensions.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=640&q=80",
    price: "$85",
    delivery: "2-3 days",
    creditEligible: true,
    included: ["Measured room labels", "Dimensioned layout", "PDF and image exports"],
  },
  {
    name: "Premium Floor Plan",
    category: "Floor Plans",
    description: "Detailed floor plan with room labels.",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=640&q=80",
    price: "$145",
    delivery: "3-4 days",
    creditEligible: true,
    included: ["Premium styling", "Room measurements", "MLS and print exports"],
  },
  {
    name: "Matterport Tour",
    category: "Matterport & Tours",
    description: "Immersive 3D tour with 4K imagery.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=640&q=80",
    price: "$175",
    delivery: "2-3 days",
    scheduling: true,
    included: ["Matterport scan", "Tour link", "Dollhouse view"],
  },
  {
    name: "Listing Video",
    category: "Video & Drone",
    description: "Professional cinematic property video.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80",
    price: "$350",
    delivery: "3-4 days",
    creditEligible: true,
    included: ["Cinematic edit", "Licensed music", "Social cutdown"],
  },
  {
    name: "Social Clip (Reel)",
    category: "Video & Drone",
    description: "30-60s vertical video for social media.",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=640&q=80",
    price: "$125",
    delivery: "24-48 hrs",
    included: ["Vertical edit", "Captions", "Agent-ready export"],
  },
  {
    name: "Feature Sheet Standard",
    category: "Feature Sheets",
    description: "Clean branded one-page feature sheet for MLS and open houses.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=640&q=80",
    price: "$49",
    delivery: "24 hrs",
    creditEligible: true,
    included: ["Brokerage branding", "Property highlights", "Print and PDF exports"],
  },
  {
    name: "Feature Sheet Premium",
    category: "Feature Sheets",
    description: "Expanded four-page brochure with property story and amenities.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80",
    price: "$69",
    delivery: "24-48 hrs",
    popular: true,
    included: ["Four-page layout", "Photo-led design", "Editable proof round"],
  },
  {
    name: "Virtual Staging Starter",
    category: "Virtual Staging",
    description: "Stage vacant rooms with clean contemporary furniture.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=640&q=80",
    price: "$120",
    delivery: "2 days",
    creditEligible: true,
    included: ["3 staged images", "Contemporary style", "MLS-ready exports"],
  },
  {
    name: "Virtual Staging Full Home",
    category: "Virtual Staging",
    description: "A complete staging pass for key living, dining, and bedroom spaces.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=640&q=80",
    price: "$280",
    delivery: "3 days",
    included: ["8 staged images", "One revision round", "Style-matched room set"],
  },
  {
    name: "Open House Print Bundle",
    category: "Print",
    description: "Printed collateral bundle for launch weekends and open houses.",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=640&q=80",
    price: "$185",
    delivery: "3-5 days",
    included: ["Feature sheets", "Neighbourhood inserts", "Pickup-ready print pack"],
  },
  {
    name: "Postcard Mailer",
    category: "Print",
    description: "Just-listed postcard design and print coordination.",
    image:
      "https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=640&q=80",
    price: "$240",
    delivery: "5-7 days",
    included: ["Postcard design", "Print setup", "Mail-ready file package"],
  },
  {
    name: "For Sale Sign Install",
    category: "Signs",
    description: "Sign installation with brokerage rider and photo confirmation.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=640&q=80",
    price: "$95",
    delivery: "1-2 days",
    scheduling: true,
    included: ["Install coordination", "Rider placement", "Completion photo"],
  },
  {
    name: "Open House Sign Kit",
    category: "Signs",
    description: "Directional sign kit for weekend traffic routing.",
    image:
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=640&q=80",
    price: "$75",
    delivery: "Same week",
    included: ["Directional signs", "Pickup checklist", "Weekend routing map"],
  },
  {
    name: "Single Property Website",
    category: "Websites",
    description: "Branded listing landing page with media, map, and inquiry capture.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=640&q=80",
    price: "$595",
    delivery: "3 days",
    popular: true,
    included: ["Custom property page", "Lead capture form", "Analytics-ready launch"],
  },
  {
    name: "Agent Landing Page",
    category: "Websites",
    description: "Reusable campaign page for farming, buyer guides, or valuation offers.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=640&q=80",
    price: "$750",
    delivery: "5 days",
    included: ["Campaign page", "CRM handoff fields", "Mobile-first layout"],
  },
  {
    name: "Listing Social Kit",
    category: "Creative Assets",
    description: "Social post set for launch, open house, and sold campaigns.",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=640&q=80",
    price: "$145",
    delivery: "24-48 hrs",
    included: ["Carousel posts", "Story frames", "Caption starter set"],
  },
  {
    name: "Neighbourhood Guide",
    category: "Creative Assets",
    description: "Reusable lifestyle guide for schools, commute, and local amenities.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=640&q=80",
    price: "$320",
    delivery: "4 days",
    included: ["Guide layout", "Amenity callouts", "PDF and web exports"],
  },
  {
    name: "AI Workflow Audit",
    category: "AI Services",
    description: "Assessment of lead intake, CRM gaps, follow-up speed, and automation opportunities.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=640&q=80",
    price: "$999",
    delivery: "1 week",
    popular: true,
    included: ["Speed-to-lead scorecard", "CRM workflow map", "Prioritized automation roadmap"],
  },
  {
    name: "Speed-to-Lead Agent",
    category: "AI Services",
    description: "Managed AI follow-up layer for website, ad, and portal leads.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80",
    price: "Custom",
    delivery: "Managed monthly",
    included: ["Instant lead response", "Qualification prompts", "Agent routing rules"],
  },
  {
    name: "CRM Automation Setup",
    category: "AI Services",
    description: "Pipeline, task, and follow-up automations for solo agents, teams, or brokerages.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=640&q=80",
    price: "Custom",
    delivery: "2-4 weeks",
    included: ["CRM stage cleanup", "Follow-up automations", "Reporting workflow setup"],
  },
]

const packages = [
  {
    name: "Standard Listing Package",
    description: "Everything you need to launch a listing.",
    image: services[0].image,
    delivery: "2-3 days delivery",
    items: ["Photos (25)", "Floor Plan (Standard)", "Feature Sheet (Standard)"],
  },
  {
    name: "Marketing Plus Package",
    description: "Elevated media for greater impact.",
    image: services[2].image,
    delivery: "3-4 days delivery",
    items: ["Photos (35)", "Floor Plan (Premium)", "Matterport Tour", "Feature Sheet"],
  },
  {
    name: "Luxury Launch Package",
    description: "Premium storytelling for luxury listings.",
    image: services[6].image,
    delivery: "4-5 days delivery",
    items: ["Photos (40+)", "Floor Plan (Premium)", "Matterport Tour", "Listing Video"],
  },
]

function categoryAnchor(category: ServiceCategory) {
  return `catalog-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
}

export function ServiceCatalogShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const [activeCategory, setActiveCategory] = React.useState<ServiceCategory>("Photography")
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    services[0]
  )

  function scrollToCategory(category: ServiceCategory) {
    setActiveCategory(category)
    document
      .getElementById(categoryAnchor(category))
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
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
          <SiteHeader title="Service Catalog" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    Service Catalog
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Procure professional listing marketing services for your properties.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button>
                    <PlusIcon data-icon="inline-start" />
                    New Order
                  </Button>
                  <Button variant="outline">
                    <PackageCheckIcon data-icon="inline-start" />
                    Compare Packages
                  </Button>
                </div>
              </section>

              <section className="rounded-lg border bg-card">
                <div className="grid gap-3 border-b p-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_180px_180px] 2xl:grid-cols-[minmax(280px,1fr)_180px_180px_180px_auto_auto]">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search services..." />
                  </div>
                  <CatalogSelect label="Category" value="All" />
                  <CatalogSelect label="Delivery Time" value="Any" />
                  <CatalogSelect label="Credit Eligible" value="All" />
                  <Button variant="outline">
                    <FlameIcon data-icon="inline-start" />
                    Popular
                  </Button>
                  <Button variant="ghost">Clear</Button>
                </div>

                <div className="overflow-x-auto border-b px-3">
                  <Tabs value={activeCategory} onValueChange={(value) => scrollToCategory(value as ServiceCategory)}>
                    <TabsList variant="line" className="h-12">
                      {categoryTabs.map((tab) => (
                        <TabsTrigger
                          key={tab.label}
                          value={tab.label}
                          render={<a href={`#${categoryAnchor(tab.label)}`} />}
                        >
                          {tab.icon}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex flex-col gap-8 p-4 lg:p-5">
                  <div>
                    <SectionLabel>Featured Packages</SectionLabel>
                    <div className="mt-4 grid gap-5 min-[1180px]:grid-cols-2">
                      {packages.map((item) => (
                        <PackageCard key={item.name} item={item} />
                      ))}
                    </div>
                  </div>

                  {categoryTabs.map((tab) => {
                    const categoryServices = services.filter(
                      (service) => service.category === tab.label
                    )

                    return (
                      <section
                        key={tab.label}
                        id={categoryAnchor(tab.label)}
                        className="scroll-mt-32"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <SectionLabel>{tab.label}</SectionLabel>
                          <Badge variant="secondary">
                            {categoryServices.length} services
                          </Badge>
                        </div>
                        <div className="mt-4 grid gap-4 lg:grid-cols-2 min-[1500px]:grid-cols-3">
                          {categoryServices.map((service) => (
                            <ServiceCard
                              key={service.name}
                              service={service}
                              selected={selectedService?.name === service.name}
                              onDetails={() => setSelectedService(service)}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </section>
            </div>
          </main>

          <Sheet
            open={Boolean(selectedService)}
            onOpenChange={(open) => {
              if (!open) setSelectedService(null)
            }}
          >
            <SheetContent className="w-full overflow-y-auto p-0 data-[side=right]:sm:max-w-md">
              {selectedService ? (
                <ServiceDetails service={selectedService} />
              ) : null}
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function CatalogSelect({ label, value }: { label: string; value: string }) {
  return (
    <Select defaultValue="all" items={[{ label: value, value: "all" }]}>
      <SelectTrigger className="w-full">
        <span className="text-xs text-muted-foreground">{label}</span>
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">{value}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex border-b-2 border-primary pb-2 text-xs font-semibold uppercase">
      {children}
    </div>
  )
}

function PackageCard({ item }: { item: (typeof packages)[number] }) {
  return (
    <Card className="overflow-hidden rounded-lg py-0 shadow-none transition hover:bg-muted/20">
      <div className="grid min-h-72 lg:grid-cols-[minmax(220px,0.9fr)_minmax(260px,1fr)]">
        <div
          className="min-h-60 bg-cover bg-center lg:min-h-full"
          style={{ backgroundImage: `url(${item.image})` }}
        />
        <div className="flex min-w-0 flex-col gap-5 p-5 lg:p-6">
          <div>
            <h3 className="max-w-64 text-lg font-semibold leading-snug">
              {item.name}
            </h3>
            <p className="mt-2 max-w-72 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
          <div className="grid gap-2.5 text-sm">
            {item.items.map((included) => (
              <div key={included} className="flex items-center gap-2">
                <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
                <span>{included}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-2">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4" />
              {item.delivery}
              </span>
              <span className="flex items-center gap-1.5 text-green-700">
                <ShieldCheckIcon className="size-4" />
                Credit eligible
              </span>
            </div>
            <Button variant="outline" className="w-full border-red-200 text-red-600 sm:w-auto">
              Start Order
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ServiceCard({
  service,
  selected,
  onDetails,
}: {
  service: Service
  selected: boolean
  onDetails: () => void
}) {
  return (
    <Card
      className={cn(
        "rounded-lg py-0 shadow-none transition hover:bg-muted/20",
        selected && "ring-2 ring-red-200"
      )}
    >
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
          <div
            className="aspect-[4/3] rounded-md bg-cover bg-center sm:size-auto"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          <div className="min-w-0">
            <h3 className="font-semibold">{service.name}</h3>
            <Badge variant="secondary" className="mt-2">
              {service.category}
            </Badge>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ClockIcon className="size-4" />
            {service.delivery}
          </span>
          {service.creditEligible ? (
            <span className="flex items-center gap-1">
              <BadgePercentIcon className="size-4" />
              Credit eligible
            </span>
          ) : null}
          {service.scheduling ? (
            <span className="flex items-center gap-1">
              <CalendarClockIcon className="size-4" />
              Scheduling
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold">{service.price}</span>
          </div>
          <div className="grid gap-2 sm:flex">
            <Button variant="outline" size="sm" onClick={onDetails}>
              View Details
            </Button>
            <Button size="sm">Add to Order</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <>
      <SheetHeader className="border-b p-5 pr-12">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SheetTitle className="text-xl">{service.name}</SheetTitle>
            <SheetDescription className="mt-2">
              {service.description}
            </SheetDescription>
          </div>
          <Badge variant="secondary">{service.category}</Badge>
        </div>
      </SheetHeader>
      <div className="flex flex-col gap-5 p-5">
        <div
          className="relative h-52 overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        >
          <div className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-center text-sm font-medium text-white">
            1 / 6
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <InfoRow label="Turnaround Time" value={service.delivery} icon={<ClockIcon />} />
          <InfoRow label="Scheduling Required" value={service.scheduling ? "Yes" : "No"} icon={<CalendarClockIcon />} />
          <InfoRow label="Credit Eligible" value={service.creditEligible ? "Yes" : "No"} icon={<BadgePercentIcon />} />
          <InfoRow label="Included in Packages" value="Standard, Plus, Luxury" icon={<PackageCheckIcon />} />
        </div>

        <Separator />

        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            What&apos;s Included
          </h3>
          <div className="mt-3 grid gap-2 text-sm">
            {service.included.map((item) => (
              <div key={item} className="flex gap-2">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            Common Add-ons
          </h3>
          <div className="mt-3 grid gap-3 text-sm">
            {[
              ["Twilight Photos (5)", "$175"],
              ["Drone Photos (8)", "$195"],
              ["Floor Plan (Standard)", "$85"],
              ["Virtual Staging (3 images)", "$120"],
            ].map(([label, price]) => (
              <label key={label} className="flex items-center gap-3">
                <input type="checkbox" className="size-4 rounded border-input" />
                <span className="flex-1">{label}</span>
                <span className="font-medium">{price}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            Notes
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ensure property is photo-ready. Access to all areas is required for
            best results.
          </p>
        </div>

        <div className="grid gap-2">
          <Button className="bg-red-600 text-white hover:bg-red-700">
            Start Order for This Service
          </Button>
          <Button variant="outline">View All {service.category} Services</Button>
        </div>
      </div>
    </>
  )
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="[&_svg]:size-4">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}
