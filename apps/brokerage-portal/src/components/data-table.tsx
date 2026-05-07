"use client"

import * as React from "react"
import Link from "next/link"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Separator } from "@/components/ui/separator"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { GripVerticalIcon, CircleCheckIcon, LoaderIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, TrendingUpIcon, FilterIcon, CameraIcon, VideoIcon, RulerIcon, FileTextIcon, CuboidIcon, PrinterIcon, GlobeIcon, SparklesIcon, CalendarSyncIcon } from "lucide-react"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
  listing: z.string().optional(),
  address: z.string().optional(),
  dueDate: z.string().optional(),
  serviceStatus: z.string().optional(),
  vendorStatus: z.string().optional(),
  billing: z.string().optional(),
  cityLine: z.string().optional(),
  mls: z.string().optional(),
  image: z.string().optional(),
  services: z.number().optional(),
  orderName: z.string().optional(),
  orderType: z.string().optional(),
  invoiceUrl: z.string().optional(),
  invoiceStatus: z.string().optional(),
  invoiceTotal: z.string().optional(),
  purchaser: z.string().optional(),
  purchaserImage: z.string().optional(),
  vendorName: z.string().optional(),
  vendorCompany: z.string().optional(),
  vendorRole: z.string().optional(),
  vendorImage: z.string().optional(),
  serviceNames: z.array(z.string()).optional(),
  timeTapStatus: z.string().optional(),
  timeTapStatusDetail: z.string().optional(),
  timeTapCalendarId: z.string().optional(),
  timeTapAppointmentId: z.string().optional(),
  bridgeState: z.string().optional(),
})
type TableItem = z.infer<typeof schema>

function initialsFor(name?: string) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}
const columns: ColumnDef<TableItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status === "Done" ? (
          <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
        ) : (
          <LoaderIcon
          />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"
      if (isAssigned) {
        return row.original.reviewer
      }
      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select
            items={[
              { label: "Eddie Lake", value: "Eddie Lake" },
              { label: "Jamik Tashpulatov", value: "Jamik Tashpulatov" },
            ]}
          >
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                <SelectItem value="Jamik Tashpulatov">
                  Jamik Tashpulatov
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-open:bg-muted"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon
          />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const statusTone = (value: string) => {
  if (
    [
      "In Progress",
      "Editing",
      "New",
      "On Track",
      "Paid",
      "Ready",
      "Delivered",
      "Confirmed",
      "TimeTap matched",
      "Manually entered",
    ].includes(value)
  ) {
    return "border-green-200 bg-green-50 text-green-700"
  }
  if (
    [
      "Field Scheduled",
      "Pending Req.",
      "Ready for Review",
      "Not Assigned",
      "Invoiced",
      "Payment Due",
      "Scheduled",
      "Bridge pending",
    ].includes(value)
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }
  if (
    ["Delayed", "Blocked", "Unpaid", "Overdue", "Scheduling mismatch"].includes(value)
  ) {
    return "border-red-200 bg-red-50 text-red-700"
  }
  return "border-slate-200 bg-slate-50 text-slate-700"
}

const serviceDefinitions = [
  {
    name: "Gallery",
    product: "HDR Photography",
    level: "Media",
    icon: CameraIcon,
    summary: "Curate delivered photos, labels, visibility, and downloads.",
    primaryAction: "Save gallery",
    sections: [
      {
        title: "Gallery Controls",
        items: ["Select visible photos", "Custom image labels", "Download all"],
      },
      {
        title: "Delivery",
        items: ["High-res ZIP", "MLS size export", "Public gallery visibility"],
      },
    ],
  },
  {
    name: "Video",
    product: "Listing Video",
    level: "Media",
    icon: VideoIcon,
    summary: "Manage video files, hosting links, revisions, and delivery notes.",
    primaryAction: "Save video",
    sections: [
      {
        title: "Assets",
        items: ["Branded video", "Unbranded video", "Social cutdown"],
      },
      {
        title: "Revision",
        items: ["Editor notes", "Upload replacement", "Approve final"],
      },
    ],
  },
  {
    name: "Floor Plans",
    product: "Standard Floor Plan",
    level: "Plans",
    icon: RulerIcon,
    summary: "Review property measurements and download plan deliverables.",
    primaryAction: "Send edit request",
    sections: [
      {
        title: "Property Details",
        items: ["Livable sq ft", "Non-livable sq ft", "Discounted sq ft"],
      },
      {
        title: "Download",
        items: ["Download PDF", "Download JPG", "Request correction"],
      },
    ],
  },
  {
    name: "Matterport",
    product: "Virtual Tour",
    level: "Tour",
    icon: CuboidIcon,
    summary: "Manage branded and unbranded tour links plus edit requests.",
    primaryAction: "Request tour edit",
    sections: [
      {
        title: "Tour Links",
        items: ["Branded tour URL", "Unbranded tour URL", "Copy share link"],
      },
      {
        title: "Corrections",
        items: ["Matterport note", "Hide room", "Refresh public page"],
      },
    ],
  },
  {
    name: "Feature Sheets",
    product: "Feature Sheet Creator",
    level: "Print",
    icon: FileTextIcon,
    summary: "Build the sheet from template, copy, photos, and floor plans.",
    primaryAction: "Open creator",
    sections: [
      {
        title: "Template",
        items: ["Choose layout", "Pick listing photos", "Pick floor plan"],
      },
      {
        title: "Content",
        items: ["Property facts", "Brand colors", "Print-ready proof"],
      },
    ],
  },
  {
    name: "Print Sign",
    product: "Print Shop",
    level: "Print",
    icon: PrinterIcon,
    summary: "Select print products, options, quantities, and order status.",
    primaryAction: "View print options",
    sections: [
      {
        title: "Products",
        items: ["Feature sheets", "Booklets", "Postcards"],
      },
      {
        title: "Production",
        items: ["Paper stock", "Quantity", "Pickup or delivery"],
      },
    ],
  },
  {
    name: "One Page Website",
    product: "Listing Microsite",
    level: "Web",
    icon: GlobeIcon,
    summary: "Control listing page URL, colors, gallery order, and details.",
    primaryAction: "Save website",
    sections: [
      {
        title: "Link",
        items: ["Copy microsite URL", "Open preview", "Publish status"],
      },
      {
        title: "Page Content",
        items: ["Hero image", "Gallery order", "Realtor details"],
      },
    ],
  },
  {
    name: "Virtual Staging",
    product: "AI Image",
    level: "Creative",
    icon: SparklesIcon,
    summary: "Choose source photos, room type, style, and generation notes.",
    primaryAction: "Submit staging",
    sections: [
      {
        title: "Photo Setup",
        items: ["Source image", "Room type", "Remove furniture"],
      },
      {
        title: "Generation",
        items: ["Staging style", "Edit request", "Rendered variants"],
      },
    ],
  },
] as const

function ListingServiceSheet({
  listing,
  service,
}: {
  listing?: string
  service: (typeof serviceDefinitions)[number]
}) {
  const Icon = service.icon

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-md text-muted-foreground"
          />
        }
      >
        <Icon className="size-3.5" />
        <span className="sr-only">
          Open {service.name} for {listing}
        </span>
      </SheetTrigger>
      <SheetContent className="w-full rounded-l-2xl sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{service.name}</SheetTitle>
          <SheetDescription>
            {listing} / {service.product}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-2">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-medium">
              <Icon className="size-4" />
              {service.level}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {service.summary}
            </p>
          </div>
          {service.sections.map((section) => (
            <div key={section.title} className="rounded-2xl border p-4">
              <div className="font-medium">{section.title}</div>
              <div className="mt-3 grid gap-2">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span>{item}</span>
                    <Badge variant="outline">Stub</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor={`${service.name}-notes`}>Service notes</Label>
            <Input id={`${service.name}-notes`} placeholder="Add context or revision notes" />
          </div>
        </div>
        <SheetFooter>
          <Button>{service.primaryAction}</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ServicesCell({ row }: { row: Row<TableItem> }) {
  const serviceCount = Math.min(row.original.services ?? 0, 8)
  const services = serviceDefinitions.slice(0, serviceCount)

  return (
    <div className="w-32">
      <div className="grid grid-cols-4 gap-1">
        {services.map((service) => (
          <ListingServiceSheet
            key={service.name}
            listing={row.original.listing}
            service={service}
          />
        ))}
      </div>
    </div>
  )
}

const listingColumns: ColumnDef<TableItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "listing",
    header: "Listing",
    cell: ({ row }) => (
      <div className="flex w-64 items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
          {row.original.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.original.image}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="truncate font-semibold text-foreground">
            <Link
              href={`/listing/${row.original.id}`}
              className="underline-offset-4 hover:underline"
            >
              {row.original.listing}
            </Link>
          </div>
          <div className="truncate text-sm font-medium text-foreground/80">
            {row.original.cityLine}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            MLS # {row.original.mls}
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => <ServicesCell row={row} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2 py-1 ${statusTone(row.original.status)}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "serviceStatus",
    header: "Service Status",
  },
  {
    accessorKey: "vendorStatus",
    header: "Vendor Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2 py-1 ${statusTone(row.original.vendorStatus ?? "")}`}
      >
        {row.original.vendorStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "billing",
    header: "Billing",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2 py-1 ${statusTone(row.original.billing ?? "")}`}
      >
        {row.original.billing}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-open:bg-muted"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem>Open listing</DropdownMenuItem>
          <DropdownMenuItem>Assign vendor</DropdownMenuItem>
          <DropdownMenuItem>View billing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const orderColumns: ColumnDef<TableItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderName",
    header: "Order",
    cell: ({ row }) => <OrderCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "listing",
    header: "Listing",
    cell: ({ row }) => (
      <div className="flex w-44 items-center gap-2">
        <div className="size-9 shrink-0 overflow-hidden rounded-md border bg-muted">
          {row.original.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.original.image}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            <Link
              href={`/listing/${row.original.id}`}
              className="underline-offset-4 hover:underline"
            >
              {row.original.listing}
            </Link>
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {row.original.cityLine}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "purchaser",
    header: "Purchaser",
    cell: ({ row }) => (
      <div className="flex w-36 items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src={row.original.purchaserImage}
            alt={row.original.purchaser ?? ""}
          />
          <AvatarFallback className="font-medium">
            {initialsFor(row.original.purchaser)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {row.original.purchaser}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            Buyer
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => <ServicesCell row={row} />,
  },
  {
    accessorKey: "status",
    header: "Fulfillment",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2 py-1 ${statusTone(row.original.status)}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "timeTapStatus",
    header: "TimeTap",
    cell: ({ row }) => (
      <div className="w-36">
        <Badge
          variant="outline"
          className={`px-2 py-1 ${statusTone(row.original.timeTapStatus ?? "")}`}
        >
          {row.original.timeTapStatus ?? "No TimeTap match"}
        </Badge>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {row.original.timeTapStatusDetail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due",
  },
  {
    accessorKey: "vendorName",
    header: "Vendor",
    cell: ({ row }) => (
      <div className="flex w-44 items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src={row.original.vendorImage}
            alt={row.original.vendorName ?? ""}
          />
          <AvatarFallback className="font-medium">
            {initialsFor(row.original.vendorName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {row.original.vendorName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {row.original.vendorCompany}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {row.original.vendorRole}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vendorStatus",
    header: "Vendor Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2 py-1 ${statusTone(row.original.vendorStatus ?? "")}`}
      >
        {row.original.vendorStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "invoiceStatus",
    header: "Invoice",
    cell: ({ row }) => (
      <div className="w-24">
        <a
          href={row.original.invoiceUrl ?? "#"}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {row.original.invoiceStatus}
        </a>
        <div className="text-xs text-muted-foreground">
          {row.original.invoiceTotal}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-open:bg-muted"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Open order</DropdownMenuItem>
          <DropdownMenuItem>Copy invoice link</DropdownMenuItem>
          <DropdownMenuItem>Manage services</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function columnWidthClass(id: string, variant?: "sections" | "listings" | "orders") {
  if (variant === "orders") {
    if (id === "orderName") return "w-48 max-w-48 px-1.5"
    if (id === "listing") return "w-48 max-w-48 px-1.5"
    if (id === "purchaser") return "w-36 max-w-36 px-1.5"
    if (id === "services") return "w-28 max-w-28 px-1.5"
    if (id === "status") return "w-28 max-w-28 px-1.5"
    if (id === "dueDate") return "w-16 max-w-16 px-1.5"
    if (id === "vendorName") return "w-48 max-w-48 px-1.5"
    if (id === "vendorStatus") return "w-28 max-w-28 px-1.5"
    if (id === "invoiceStatus") return "w-24 max-w-24 px-1.5"
  }
  if (id === "listing") return "w-72 max-w-72"
  if (id === "orderName") return "w-72 max-w-72"
  if (id === "drag") return "w-6 px-1"
  if (id === "select") return "w-7 px-1"
  if (id === "actions") return "w-9 px-1"
  return ""
}

function DraggableRow({
  row,
  variant,
}: {
  row: Row<TableItem>
  variant?: "sections" | "listings" | "orders"
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={columnWidthClass(cell.column.id, variant)}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
export function DataTable({
  data: initialData,
  wide = false,
  variant = "sections",
  itemLabel = "Listings",
}: {
  data: TableItem[]
  wide?: boolean
  variant?: "sections" | "listings" | "orders"
  itemLabel?: string
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )
  const activeColumns =
    variant === "orders"
      ? orderColumns
      : variant === "listings"
        ? listingColumns
        : columns
  const ownedViewLabel = `My ${itemLabel}`
  const viewTabs =
    variant === "orders"
      ? [
          { label: "All", value: "all" },
          { label: ownedViewLabel, value: "my-orders", count: 12 },
          { label: "Needs Attention", value: "needs-attention", count: 4 },
          { label: "Scheduled", value: "scheduled", count: 8 },
          { label: "In Production", value: "in-production", count: 16 },
          { label: "Delivered", value: "delivered", count: 21 },
          { label: "Unpaid", value: "unpaid", count: 3 },
        ]
      : [
          { label: "All", value: "all" },
          { label: ownedViewLabel, value: "my-listings", count: 32 },
          { label: "Team", value: "team", count: 48 },
          { label: "Brokerage", value: "brokerage" },
          { label: "At Risk", value: "at-risk", count: 9 },
          { label: "Ready to Launch", value: "ready-to-launch", count: 16 },
        ]
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: activeColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }
  return (
    <Tabs
      defaultValue="all"
      className="w-full flex-col justify-start gap-4 pt-4"
    >
      <div
        className={`flex items-center justify-between border-b pb-3 ${
          wide ? "px-0" : "px-4 lg:px-6"
        }`}
      >
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          defaultValue="all"
          items={viewTabs.map(({ label, value }) => ({ label, value }))}
        >
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {viewTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList
          variant="line"
          className="hidden h-10 gap-6 p-0 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex"
        >
          {viewTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-0">
              {tab.label}
              {typeof tab.count === "number" ? (
                <Badge variant="secondary">{tab.count}</Badge>
              ) : null}
            </TabsTrigger>
          ))}
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FilterIcon />
              Filters
              <ChevronDownIcon />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
            >
              <Columns3Icon data-icon="inline-start" />
              Columns
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="all"
        className={`relative flex flex-col gap-4 overflow-auto ${
          wide ? "px-0" : "px-4 lg:px-6"
        }`}
      >
        <BlurFade delay={0.04}>
          <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className={variant === "orders" ? "table-fixed" : ""}>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={columnWidthClass(
                            header.column.id,
                            variant
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} variant={variant} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={activeColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
          </div>
        </BlurFade>
        <div
          className={`flex items-center justify-between ${
            wide ? "px-0" : "px-4"
          }`}
        >
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
                items={[10, 20, 30, 40, 50].map((pageSize) => ({
                  label: `${pageSize}`,
                  value: `${pageSize}`,
                }))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon
                />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon
                />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      {viewTabs
        .filter((tab) => tab.value !== "all")
        .map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex flex-col px-4 lg:px-6"
          >
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
          </TabsContent>
        ))}
    </Tabs>
  )
}
const chartData = [
  {
    month: "January",
    desktop: 186,
    mobile: 80,
  },
  {
    month: "February",
    desktop: 305,
    mobile: 200,
  },
  {
    month: "March",
    desktop: 237,
    mobile: 120,
  },
  {
    month: "April",
    desktop: 73,
    mobile: 190,
  },
  {
    month: "May",
    desktop: 209,
    mobile: 130,
  },
  {
    month: "June",
    desktop: 214,
    mobile: 140,
  },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig
function OrderCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="h-auto w-52 justify-start px-0 text-left text-foreground"
        >
          <span className="block min-w-0">
            <span className="block truncate font-semibold">
              {item.orderName}
            </span>
            <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{item.header}</span>
              <span>/</span>
              <span>{item.orderType}</span>
            </span>
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.orderName}</DrawerTitle>
          <DrawerDescription>
            TimeTap, Daily Drafting, and bridge parity summary for this order.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={statusTone(item.timeTapStatus ?? "")}>
                <CalendarSyncIcon data-icon="inline-start" />
                {item.timeTapStatus ?? "No TimeTap match"}
              </Badge>
              <Badge variant="outline">{item.bridgeState ?? "needs-staff-review"}</Badge>
            </div>
            <div className="mt-3 grid gap-2">
              <OrderMirrorFact label="Listing" value={item.listing} />
              <OrderMirrorFact label="Address" value={item.address} />
              <OrderMirrorFact label="TimeTap calendar" value={item.timeTapCalendarId || "No calendar match"} />
              <OrderMirrorFact label="TimeTap appointment" value={item.timeTapAppointmentId || "No appointment match"} />
              <OrderMirrorFact label="Mirror detail" value={item.timeTapStatusDetail} />
              <OrderMirrorFact label="Services" value={item.serviceNames?.join(", ")} />
            </div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
            <div className="font-medium">Bridge posture</div>
            <p className="mt-2 leading-6">
              This order drawer is a read-only parity view. It can preview a
              future TimeTap or Daily Drafting bridge, but it does not book
              appointments, update sheets, create folders, invoice, charge, or
              mutate legacy records.
            </p>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline">Preview bridge payload</Button>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function OrderMirrorFact({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "Not mirrored"}</span>
    </div>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select
                  defaultValue={item.type}
                  items={[
                    { label: "Table of Contents", value: "Table of Contents" },
                    { label: "Executive Summary", value: "Executive Summary" },
                    {
                      label: "Technical Approach",
                      value: "Technical Approach",
                    },
                    { label: "Design", value: "Design" },
                    { label: "Capabilities", value: "Capabilities" },
                    { label: "Focus Documents", value: "Focus Documents" },
                    { label: "Narrative", value: "Narrative" },
                    { label: "Cover Page", value: "Cover Page" },
                  ]}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem value="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem value="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue={item.status}
                  items={[
                    { label: "Done", value: "Done" },
                    { label: "In Progress", value: "In Progress" },
                    { label: "Not Started", value: "Not Started" },
                  ]}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select
                defaultValue={item.reviewer}
                items={[
                  { label: "Eddie Lake", value: "Eddie Lake" },
                  { label: "Jamik Tashpulatov", value: "Jamik Tashpulatov" },
                  { label: "Emily Whalen", value: "Emily Whalen" },
                ]}
              >
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Jamik Tashpulatov">
                      Jamik Tashpulatov
                    </SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
