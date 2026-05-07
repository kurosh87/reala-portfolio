"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronFirst,
  ChevronLast,
  ChevronRight,
  Command,
  Ellipsis,
  EyeOff,
  Filter,
  KanbanSquare,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Line, LineChart } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChartContainer } from "@/components/ui/chart";
import {
  leadStageQueryToValue,
  leadStageValueToQuery,
} from "@/components/chat/lead-filter-state";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ChatLaunchContext } from "@/lib/chat-launch";
import { cn } from "@/lib/utils";

type LeadStage = "Requested" | "Qualified" | "In Review" | "Needs follow-up";
type LeadPriority = "Hot" | "Warm" | "Cold";
type LeadLabel =
  | "showing"
  | "seller"
  | "buyer"
  | "valuation"
  | "consult";
type LeadSource =
  | "Realtor.ca"
  | "Website"
  | "Referral"
  | "Instagram"
  | "Open house";

type LeadRow = {
  id: string;
  code: string;
  label: LeadLabel;
  name: string;
  title: string;
  stage: LeadStage;
  priority: LeadPriority;
  source: LeadSource;
  responseSeconds: number;
  createdAt: Date;
  channel: "SMS" | "Email" | "Phone";
};

type LeadViewMode = "list" | "board" | "pipeline";
type LeadSourceTab = "all" | "website" | "socials" | "rew";

const sourceTabs = [
  { label: "All", value: "all" },
  { label: "Website", value: "website" },
  { label: "Socials", value: "socials" },
  { label: "REW", value: "rew" },
] as const satisfies { label: string; value: LeadSourceTab }[];

const leads: LeadRow[] = [
  {
    id: "maya-chen",
    code: "LEAD-2041",
    label: "showing",
    name: "Maya Chen",
    title: "Confirm the 6:30 PM Oakridge showing and partner attendance",
    stage: "Requested",
    priority: "Hot",
    source: "Realtor.ca",
    responseSeconds: 23,
    createdAt: new Date(2026, 3, 17),
    channel: "SMS",
  },
  {
    id: "avery-singh",
    code: "LEAD-1983",
    label: "buyer",
    name: "Avery Singh",
    title: "Relocation buyer narrowing to two west-end condo buildings",
    stage: "Qualified",
    priority: "Warm",
    source: "Instagram",
    responseSeconds: 31,
    createdAt: new Date(2026, 3, 17),
    channel: "Email",
  },
  {
    id: "jordan-velasco",
    code: "LEAD-1874",
    label: "buyer",
    name: "Jordan Velasco",
    title: "Offer strategy follow-up after back-to-back condo showings",
    stage: "Needs follow-up",
    priority: "Hot",
    source: "Website",
    responseSeconds: 52,
    createdAt: new Date(2026, 3, 16),
    channel: "Phone",
  },
  {
    id: "priya-daniel",
    code: "LEAD-1762",
    label: "seller",
    name: "Priya & Daniel",
    title: "Downsizing consultation and timing plan for a Rosedale listing",
    stage: "In Review",
    priority: "Warm",
    source: "Referral",
    responseSeconds: 28,
    createdAt: new Date(2026, 3, 16),
    channel: "Email",
  },
  {
    id: "sophie-lam",
    code: "LEAD-1710",
    label: "valuation",
    name: "Sophie Lam",
    title: "Pre-list valuation request for a semi-detached in Leslieville",
    stage: "Requested",
    priority: "Warm",
    source: "Website",
    responseSeconds: 35,
    createdAt: new Date(2026, 3, 15),
    channel: "Email",
  },
  {
    id: "omar-haddad",
    code: "LEAD-1688",
    label: "consult",
    name: "Omar Haddad",
    title: "First-time buyer financing consult before booking weekend tours",
    stage: "Qualified",
    priority: "Cold",
    source: "Referral",
    responseSeconds: 44,
    createdAt: new Date(2026, 3, 15),
    channel: "Phone",
  },
  {
    id: "claire-bennett",
    code: "LEAD-1655",
    label: "showing",
    name: "Claire Bennett",
    title: "Open house walk-in asking for a second private visit on Sunday",
    stage: "Needs follow-up",
    priority: "Warm",
    source: "Open house",
    responseSeconds: 61,
    createdAt: new Date(2026, 3, 14),
    channel: "SMS",
  },
  {
    id: "marcus-cho",
    code: "LEAD-1599",
    label: "seller",
    name: "Marcus Cho",
    title: "Seller wants staging, photography, and launch timeline options",
    stage: "In Review",
    priority: "Hot",
    source: "Instagram",
    responseSeconds: 27,
    createdAt: new Date(2026, 3, 14),
    channel: "Phone",
  },
  {
    id: "nina-patel",
    code: "LEAD-1542",
    label: "buyer",
    name: "Nina Patel",
    title: "School-focused family search with a May move target",
    stage: "Qualified",
    priority: "Warm",
    source: "Website",
    responseSeconds: 29,
    createdAt: new Date(2026, 3, 13),
    channel: "Email",
  },
  {
    id: "kevin-andrews",
    code: "LEAD-1507",
    label: "valuation",
    name: "Kevin Andrews",
    title: "Curious owner exploring price expectations before renovating",
    stage: "Requested",
    priority: "Cold",
    source: "Realtor.ca",
    responseSeconds: 48,
    createdAt: new Date(2026, 3, 13),
    channel: "Email",
  },
  {
    id: "amelia-frost",
    code: "LEAD-1491",
    label: "consult",
    name: "Amelia Frost",
    title: "Buyer consultation after losing in multiple-offer competition",
    stage: "Needs follow-up",
    priority: "Hot",
    source: "Referral",
    responseSeconds: 39,
    createdAt: new Date(2026, 3, 12),
    channel: "Phone",
  },
  {
    id: "hugo-martin",
    code: "LEAD-1456",
    label: "showing",
    name: "Hugo Martin",
    title: "Requests twilight showing slot and parking notes for detached home",
    stage: "Requested",
    priority: "Warm",
    source: "Website",
    responseSeconds: 33,
    createdAt: new Date(2026, 3, 12),
    channel: "SMS",
  },
];

const defaultLeadForm = {
  name: "",
  title: "",
  label: "buyer" as LeadLabel,
  stage: "Requested" as LeadStage,
  priority: "Warm" as LeadPriority,
  source: "Website" as LeadSource,
  channel: "Email" as LeadRow["channel"],
  responseSeconds: "30",
};

const multiValueFilter: FilterFn<LeadRow> = (row, id, value: string[]) => {
  if (!Array.isArray(value) || value.length === 0) {
    return true;
  }

  return value.includes(String(row.getValue(id)));
};

const sortOptions = [
  { id: "name-asc", label: "Name A-Z", column: "name", desc: false },
  { id: "name-desc", label: "Name Z-A", column: "name", desc: true },
  { id: "responseSeconds-asc", label: "Fastest responses", column: "responseSeconds", desc: false },
  { id: "responseSeconds-desc", label: "Slowest responses", column: "responseSeconds", desc: true },
];

const stageOrder: Record<LeadStage, number> = {
  Requested: 0,
  "In Review": 1,
  Qualified: 2,
  "Needs follow-up": 3,
};

const stageColumns: LeadStage[] = [
  "Requested",
  "In Review",
  "Qualified",
  "Needs follow-up",
];

function getLeadContact(lead: LeadRow) {
  const slug = lead.name.toLowerCase().replaceAll(" ", ".").replaceAll("&", "and");
  const phoneSuffix = lead.code.slice(-3);

  return {
    email: `${slug}@gmail.com`,
    phone: `(603) 555-${phoneSuffix.padStart(4, "0")}`,
  };
}

function getLeadPurpose(lead: LeadRow) {
  switch (lead.label) {
    case "showing":
      return "Home Loan";
    case "seller":
      return "Property Loan";
    case "valuation":
      return "Gold Loan";
    case "consult":
      return "Business Loan";
    case "buyer":
      return "Home Loan";
  }
}

function getLeadAmount(lead: LeadRow) {
  switch (lead.priority) {
    case "Hot":
      return "$978,878";
    case "Warm":
      return "$13,324";
    case "Cold":
      return "$9,878";
  }
}

function getLeadAmountNumber(lead: LeadRow) {
  return Number(getLeadAmount(lead).replace(/[$,]/g, ""));
}

function getLeadProgress(lead: LeadRow) {
  return Math.max(20, Math.min(96, 100 - lead.responseSeconds));
}

function getStagePillClasses(stage: LeadStage) {
  switch (stage) {
    case "Requested":
      return "bg-violet-500/12 text-violet-700 dark:text-violet-300";
    case "Qualified":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "In Review":
      return "bg-amber-500/18 text-amber-800 dark:text-amber-300";
    case "Needs follow-up":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }
}

function getStageLabel(stage: LeadStage) {
  switch (stage) {
    case "Requested":
      return "New";
    case "Qualified":
      return "Loan Granted";
    case "In Review":
      return "In progress";
    case "Needs follow-up":
      return "New";
  }
}

function getLeadStatusLabel(stage: LeadStage) {
  switch (stage) {
    case "Requested":
      return "Pre-sale";
    case "In Review":
      return "Closing";
    case "Qualified":
      return "Closed";
    case "Needs follow-up":
      return "Lost";
  }
}

function getProbability(lead: LeadRow) {
  switch (lead.priority) {
    case "Hot":
      return "High";
    case "Warm":
      return "Mid";
    case "Cold":
      return "Low";
  }
}

function getProbabilityClasses(priority: LeadPriority) {
  switch (priority) {
    case "Hot":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "Warm":
      return "bg-amber-500/18 text-amber-800 dark:text-amber-300";
    case "Cold":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }
}

function LeadSourceBadge({ source }: { source: LeadSource }) {
  return (
    <Badge className="rounded-md px-2.5 font-medium" variant="outline">
      {source}
    </Badge>
  );
}

function LeadStatusBadge({ stage }: { stage: LeadStage }) {
  return (
    <Badge
      className={cn("rounded-md px-2.5 font-medium", getStagePillClasses(stage))}
      variant="secondary"
    >
      {getLeadStatusLabel(stage)}
    </Badge>
  );
}

function LeadProbabilityBadge({ lead }: { lead: LeadRow }) {
  return (
    <Badge
      className={cn(
        "rounded-md px-2.5 font-medium",
        getProbabilityClasses(lead.priority)
      )}
      variant="secondary"
    >
      {getProbability(lead)}
    </Badge>
  );
}

function getTrendData(lead: LeadRow) {
  const base = getLeadProgress(lead);
  const direction = lead.priority === "Cold" ? -1 : 1;

  return Array.from({ length: 9 }, (_, index) => ({
    index,
    value: Math.max(
      8,
      Math.min(
        96,
        base + direction * (index - 4) * 3 + ((lead.responseSeconds + index) % 5)
      )
    ),
  }));
}

function LeadSparkline({ lead }: { lead: LeadRow }) {
  const color =
    lead.priority === "Cold"
      ? "var(--destructive)"
      : lead.priority === "Warm"
        ? "var(--chart-4)"
        : "var(--chart-2)";

  return (
    <ChartContainer
      aria-label={`${lead.name} interest trend`}
      className="h-7 w-28 rounded-md bg-muted/30 px-1 py-0.5"
      config={{
        trend: {
          label: "Interest",
          color,
        },
      }}
      initialDimension={{ width: 96, height: 32 }}
    >
      <LineChart accessibilityLayer data={getTrendData(lead)}>
        <Line
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-trend)"
          strokeWidth={1.7}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}

function MiniAvatar({ label, index = 0 }: { label: string; index?: number }) {
  const palette = ["bg-[#d8eef7]", "bg-[#d7f0d2]", "bg-[#ffe5bd]"];

  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border border-background text-[10px] font-semibold text-black",
        index > 0 ? "-ml-2" : "",
        palette[index % palette.length]
      )}
    >
      {label}
    </span>
  );
}

function SortButton({
  column,
  children,
}: {
  column: {
    getCanSort: () => boolean;
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  };
  children: React.ReactNode;
}) {
  if (!column.getCanSort()) {
    return <span>{children}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <Button
      className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
      onClick={() => column.toggleSorting(sorted === "asc")}
      size="sm"
      variant="ghost"
    >
      <span>{children}</span>
      <Icon data-icon="inline-end" />
    </Button>
  );
}

function ToolbarFilter({
  label,
  values,
  selectedValues,
  onToggle,
}: {
  label: string;
  values: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-transparent"
          size="sm"
          variant="outline"
        >
          <Filter data-icon="inline-start" />
          {label}
          {selectedValues.length > 0 ? (
            <Badge className="ml-1" variant="secondary">
              {selectedValues.length}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {values.map((value) => (
          <DropdownMenuCheckboxItem
            checked={selectedValues.includes(value)}
            key={value}
            onCheckedChange={() => onToggle(value)}
          >
            {value}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LeadsMetricCard({
  label,
  value,
  change,
  tone = "up",
}: {
  label: string;
  value: string;
  change?: string;
  tone?: "up" | "down" | "flat";
}) {
  return (
    <div className="min-h-[92px] border-border border-r bg-card px-6 py-5 last:border-r-0">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="font-semibold text-2xl text-foreground tabular-nums">
          {value}
        </div>
        {change ? (
          <Badge
            className={cn(
              "rounded-md",
              tone === "up" &&
                "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
              tone === "down" &&
                "bg-rose-500/15 text-rose-700 dark:text-rose-300",
              tone === "flat" && "bg-muted text-muted-foreground"
            )}
            variant="secondary"
          >
            {change}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function LeadsBoard({
  rows,
  mode,
  onOpenLead,
}: {
  rows: LeadRow[];
  mode: Exclude<LeadViewMode, "list">;
  onOpenLead: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto px-5 py-6 md:px-8">
      <div
        className={cn(
          "grid min-w-[980px] gap-4",
          mode === "pipeline" ? "grid-cols-4" : "grid-cols-4"
        )}
      >
        {stageColumns.map((stage) => {
          const stageRows = rows.filter((lead) => lead.stage === stage);

          return (
            <div
              className="flex min-h-[560px] flex-col rounded-lg border border-border bg-card/75"
              key={stage}
            >
              <div className="flex items-center justify-between border-border border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-foreground/70" />
                  <h2 className="font-semibold text-foreground text-sm">
                    {mode === "pipeline" ? getStageLabel(stage) : stage}
                  </h2>
                  <Badge className="rounded-md tabular-nums" variant="outline">
                    {stageRows.length}
                  </Badge>
                </div>
                <Button size="icon-sm" variant="ghost">
                  <Plus />
                </Button>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-3">
                {stageRows.map((lead) => (
                  <button
                    className="rounded-lg border border-border bg-background p-4 text-left shadow-xs transition hover:border-foreground/30 hover:bg-muted/45"
                    key={lead.id}
                    onClick={() => onOpenLead(lead.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-muted-foreground text-xs">
                          {lead.code}
                        </div>
                        <div className="mt-1 font-semibold text-foreground">
                          {lead.name}
                        </div>
                      </div>
                      <MiniAvatar label={lead.name.slice(0, 2).toUpperCase()} />
                    </div>
                    <p className="mt-3 line-clamp-2 text-muted-foreground text-sm">
                      {lead.title}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <LeadSourceBadge source={lead.source} />
                      <LeadProbabilityBadge lead={lead} />
                    </div>
                  </button>
                ))}

                {stageRows.length === 0 ? (
                  <div className="flex min-h-48 flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
                    Drop to change status
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LeadsDataGrid() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leadRows, setLeadRows] = useState<LeadRow[]>(leads);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(defaultLeadForm);
  const [viewMode, setViewMode] = useState<LeadViewMode>("list");
  const [sourceTab, setSourceTab] = useState<LeadSourceTab>("all");

  const sourceScopedRows = useMemo(() => {
    switch (sourceTab) {
      case "website":
        return leadRows.filter((lead) => lead.source === "Website");
      case "socials":
        return leadRows.filter((lead) => lead.source === "Instagram");
      case "rew":
        return leadRows.filter((lead) => lead.source === "Realtor.ca");
      case "all":
      default:
        return leadRows;
    }
  }, [leadRows, sourceTab]);

  const columns = useMemo<ColumnDef<LeadRow>[]>(
    () => [
      {
        id: "select",
        cell: ({ row }) => (
          <input
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            className="size-4 rounded border border-border bg-background/40 accent-foreground"
            onChange={(event) => row.toggleSelected(event.target.checked)}
            type="checkbox"
          />
        ),
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <input
            aria-label="Select all leads on page"
            checked={table.getIsAllPageRowsSelected()}
            className="size-4 rounded border border-border bg-background/40 accent-foreground"
            onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
            type="checkbox"
          />
        ),
        size: 36,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <SortButton column={column}>Lead</SortButton>,
        cell: ({ row }) => (
          <div className="flex min-w-[250px] items-center gap-3">
            <div>
              <div className="font-semibold text-foreground">{row.original.name}</div>
              <div className="mt-1 text-muted-foreground text-sm">
                {getLeadContact(row.original).email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "source",
        filterFn: multiValueFilter,
        header: ({ column }) => (
          <div className="flex items-center justify-between gap-2">
            <SortButton column={column}>Source</SortButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={(event) => event.stopPropagation()}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem>
                  <Sparkles />
                  AI analyze
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArrowUp />
                  Sort ascending
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowDown />
                  Sort descending
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Filter />
                  Filter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <EyeOff />
                  Hide column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        cell: ({ row }) => (
          <LeadSourceBadge source={row.original.source} />
        ),
      },
      {
        accessorKey: "stage",
        filterFn: multiValueFilter,
        header: ({ column }) => <SortButton column={column}>Status</SortButton>,
        cell: ({ row }) => (
          <LeadStatusBadge stage={row.original.stage} />
        ),
        sortingFn: (rowA, rowB, id) =>
          stageOrder[rowA.getValue(id) as LeadStage] -
          stageOrder[rowB.getValue(id) as LeadStage],
      },
      {
        accessorFn: getLeadAmountNumber,
        id: "size",
        header: ({ column }) => <SortButton column={column}>Size</SortButton>,
        cell: ({ row }) => (
          <div className="min-w-[110px] text-foreground tabular-nums">
            {getLeadAmount(row.original)}
          </div>
        ),
      },
      {
        id: "interest",
        header: "Interest",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <LeadSparkline lead={row.original} />
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => <SortButton column={column}>Probability</SortButton>,
        cell: ({ row }) => (
          <LeadProbabilityBadge lead={row.original} />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortButton column={column}>Last action</SortButton>,
        cell: ({ row }) => (
          <div className="min-w-[130px] text-foreground">
            {row.original.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={(event) => event.stopPropagation()}
                size="icon-sm"
                variant="ghost"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={() => router.push(`/leads/${row.original.id}`)}
              >
                Open details
              </DropdownMenuItem>
              <DropdownMenuItem>Assign to Alex</DropdownMenuItem>
              <DropdownMenuItem>Schedule showing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mark qualified</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: sourceScopedRows,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    globalFilterFn: (row, _columnId, value) => {
      const query = String(value).trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [
        row.original.name,
        row.original.title,
        row.original.source,
        getLeadContact(row.original).email,
        getLeadPurpose(row.original),
      ].some((item) => item.toLowerCase().includes(query));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;
  const visibleRows = table.getFilteredRowModel().rows.map((row) => row.original);
  const newRows = visibleRows.filter((lead) => lead.stage === "Requested").length;
  const closedRows = visibleRows.filter((lead) => lead.stage === "Qualified").length;
  const lostRows = visibleRows.filter(
    (lead) => lead.stage === "Needs follow-up"
  ).length;
  const totalClosed = visibleRows
    .filter((lead) => lead.stage === "Qualified")
    .reduce((sum, lead) => sum + getLeadAmountNumber(lead), 0);
  const sortValue =
    sorting[0] ? `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}` : "";
  const stageFilter = (table.getColumn("stage")?.getFilterValue() as string[]) ?? [];
  const sourceFilter = (table.getColumn("source")?.getFilterValue() as string[]) ?? [];
  const hasFilters =
    stageFilter.length > 0 ||
    sourceFilter.length > 0 ||
    globalFilter.length > 0;
  const stageParam = searchParams.get("stage") ?? "";
  const leadsLaunchContext: ChatLaunchContext = {
    scopeType: "section",
    entityType: "leads",
    title: "Leads pipeline",
    route: "/leads",
    snapshot: {
      totalRows,
      newRows,
      closedRows,
      lostRows,
      sourceTab,
      viewMode,
      visibleLeadNames: visibleRows.slice(0, 5).map((lead) => lead.name),
    },
    filters: hasFilters
      ? {
          stage: stageFilter,
          source: sourceFilter,
          search: globalFilter || undefined,
          sort: sortValue || undefined,
        }
      : null,
    timeRange: null,
    selectedView: viewMode,
    sourceApp: "crm",
  };
  const urlStageValues = stageParam
    .split(",")
    .map((value) => leadStageQueryToValue[value as keyof typeof leadStageQueryToValue])
    .filter(Boolean);

  useEffect(() => {
    const currentValue = [...stageFilter].sort().join("|");
    const urlValue = [...urlStageValues].sort().join("|");

    if (currentValue === urlValue) {
      return;
    }

    table
      .getColumn("stage")
      ?.setFilterValue(urlStageValues.length > 0 ? urlStageValues : undefined);
  }, [stageFilter, table, urlStageValues]);

  useEffect(() => {
    table.resetRowSelection();
    table.setPageIndex(0);
  }, [sourceTab, table]);

  const updateStageQuery = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.length > 0) {
      const nextStageParam = values
        .map(
          (value) =>
            leadStageValueToQuery[value as keyof typeof leadStageValueToQuery]
        )
        .filter(Boolean)
        .join(",");

      params.set("stage", nextStageParam);
    } else {
      params.delete("stage");
    }

    const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(href);
  };

  const toggleFilter = (columnId: "stage" | "priority" | "source", value: string) => {
    const column = table.getColumn(columnId);
    const activeValues = (column?.getFilterValue() as string[]) ?? [];

    const nextValues = activeValues.includes(value)
      ? activeValues.filter((item) => item !== value)
      : [...activeValues, value];

    column?.setFilterValue(nextValues.length > 0 ? nextValues : undefined);

    if (columnId === "stage") {
      updateStageQuery(nextValues);
    }
  };

  const resetLeadForm = () => {
    setLeadForm(defaultLeadForm);
  };

  const handleAddLead = () => {
    const trimmedName = leadForm.name.trim();
    const trimmedTitle = leadForm.title.trim();

    if (!trimmedName || !trimmedTitle) {
      return;
    }

    const timestamp = Date.now();
    const nextLead: LeadRow = {
      id: `manual-${timestamp}`,
      code: `LEAD-${String(timestamp).slice(-4)}`,
      name: trimmedName,
      title: trimmedTitle,
      label: leadForm.label,
      stage: leadForm.stage,
      priority: leadForm.priority,
      source: leadForm.source,
      channel: leadForm.channel,
      responseSeconds: Number.parseInt(leadForm.responseSeconds, 10) || 0,
      createdAt: new Date(),
    };

    setLeadRows((currentRows) => [nextLead, ...currentRows]);
    setIsAddLeadOpen(false);
    resetLeadForm();
  };

  return (
    <>
      <section className="flex flex-col">
        <div className="pt-8">
          <div className="flex flex-col gap-5 px-4 md:flex-row md:items-start md:justify-between md:px-6">
            <div>
              <p className="text-muted-foreground text-sm">Contacts</p>
              <div className="mt-3 flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  My Leads
                </h1>
                <Badge className="rounded-md px-3 py-1 text-sm" variant="outline">
                  {totalRows} Leads
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <ContextualChatLauncher
                buttonLabel="Ask Alex about leads"
                context={leadsLaunchContext}
              />
              <Button variant="outline">
                Settings
              </Button>
              <Button onClick={() => setIsAddLeadOpen(true)}>
                <Plus data-icon="inline-start" />
                New lead
              </Button>
            </div>
          </div>

          <Tabs
            className="mt-9 gap-0 border-border border-b"
            onValueChange={(value) => setSourceTab(value as LeadSourceTab)}
            value={sourceTab}
          >
            <TabsList
              className="w-full overflow-x-auto border-b-0 px-4 md:px-6"
              variant="line"
            >
              {sourceTabs.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid border-border border-b bg-card shadow-xs md:grid-cols-4">
            <LeadsMetricCard change="+24%" label="New" value={String(newRows)} />
            <LeadsMetricCard
              change="-4%"
              label="Closed"
              tone="down"
              value={String(closedRows)}
            />
            <LeadsMetricCard label="Lost" tone="flat" value={String(lostRows)} />
            <LeadsMetricCard
              change="+3%"
              label="Total closed"
              value={totalClosed.toLocaleString("en-US", {
                currency: "USD",
                maximumFractionDigits: 0,
                style: "currency",
              })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-border border-b bg-background px-4 py-4 lg:flex-row lg:items-center lg:justify-between md:px-6">
          <ButtonGroup className="rounded-lg border border-border bg-muted/35 p-1">
            {[
              { id: "list" as const, label: "List", icon: List },
              { id: "board" as const, label: "Board", icon: LayoutGrid },
              { id: "pipeline" as const, label: "Pipeline", icon: KanbanSquare },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  className={cn(
                    "h-8 rounded-md border-0 px-3 text-muted-foreground shadow-none",
                    viewMode === item.id &&
                      "bg-background text-foreground shadow-xs"
                  )}
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  size="sm"
                  variant="ghost"
                >
                  <Icon data-icon="inline-start" />
                  {item.label}
                </Button>
              );
            })}
          </ButtonGroup>

          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <InputGroup className="h-10 w-full bg-background lg:max-w-md">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search..."
                value={globalFilter}
              />
            </InputGroup>

            <div className="flex items-center gap-2 rounded-lg px-2 py-1 text-muted-foreground text-sm">
              <span className="h-4 w-7 rounded-full border border-border bg-background">
                <span className="block size-4 rounded-full bg-muted-foreground/35" />
              </span>
              Group
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="h-10 rounded-lg" variant="outline">
              <SlidersHorizontal data-icon="inline-start" />
              Advanced filters
            </Button>
            <Button className="h-10 rounded-lg" variant="outline">
              <Command data-icon="inline-start" />
              Command filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-10 rounded-lg bg-background px-4 text-foreground shadow-none"
                  variant="outline"
                >
                  <Filter data-icon="inline-start" />
                  {stageFilter.length + sourceFilter.length || 1}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter leads</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Stage</DropdownMenuLabel>
                {["Requested", "Qualified", "In Review", "Needs follow-up"].map((value) => (
                  <DropdownMenuCheckboxItem
                    checked={stageFilter.includes(value)}
                    key={value}
                    onCheckedChange={() => toggleFilter("stage", value)}
                  >
                    {value}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Source</DropdownMenuLabel>
                {["Realtor.ca", "Website", "Referral", "Instagram", "Open house"].map((value) => (
                  <DropdownMenuCheckboxItem
                    checked={sourceFilter.includes(value)}
                    key={value}
                    onCheckedChange={() => toggleFilter("source", value)}
                  >
                    {value}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-10 rounded-lg bg-background px-5 text-foreground shadow-none"
                  variant="outline"
                >
                  Options
                  <ChevronRight className="size-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Sort leads</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  onValueChange={(value) => {
                    const match = sortOptions.find((option) => option.id === value);

                    if (!match) {
                      return;
                    }

                    setSorting([{ id: match.column, desc: match.desc }]);
                  }}
                  value={sortValue}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {hasFilters ? (
              <Button
                className="text-foreground"
                onClick={() => {
                  table.resetColumnFilters();
                  table.resetRowSelection();
                  setGlobalFilter("");
                  updateStageQuery([]);
                }}
                size="sm"
                variant="ghost"
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        <div className="px-5 py-6 md:px-8">
        {viewMode === "list" ? (
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
            <Table className="min-w-[1180px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="border-border" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className="h-12 border-border border-r bg-background px-4 text-muted-foreground text-xs tracking-wide uppercase last:border-r-0"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="h-[72px] cursor-pointer border-border bg-background hover:bg-muted/35 data-[state=selected]:bg-muted/60"
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      key={row.id}
                      onClick={() => router.push(`/leads/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className="border-border border-r px-4 last:border-r-0"
                          key={cell.id}
                          onClick={
                            cell.column.id === "select"
                              ? (event) => event.stopPropagation()
                              : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-32 text-center text-muted-foreground"
                      colSpan={table.getAllColumns().length}
                    >
                      No leads match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
            <div className="flex flex-col gap-4 border-border border-t px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-muted-foreground text-sm">
                {selectedRows} of {totalRows} row(s) selected.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Rows per page</span>
                  <Select
                    onValueChange={(value) => table.setPageSize(Number(value))}
                    value={String(table.getState().pagination.pageSize)}
                  >
                    <SelectTrigger className="h-9 w-[76px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40].map((pageSize) => (
                        <SelectItem key={pageSize} value={String(pageSize)}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {Math.max(table.getPageCount(), 1)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.setPageIndex(0)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronFirst />
                    <span className="sr-only">First page</span>
                  </Button>
                  <Button
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronRight className="rotate-180" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronRight />
                    <span className="sr-only">Next page</span>
                  </Button>
                  <Button
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronLast />
                    <span className="sr-only">Last page</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LeadsBoard
            mode={viewMode}
            onOpenLead={(id) => router.push(`/leads/${id}`)}
            rows={visibleRows}
          />
        )}
        </div>
      </section>

      {selectedRows > 0 ? (
        <div className="fixed bottom-7 left-1/2 z-40 flex -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-foreground text-background shadow-2xl dark:bg-zinc-100 dark:text-zinc-950">
          <div className="border-background/20 border-r px-5 py-3 font-medium tabular-nums">
            {selectedRows} selected leads
          </div>
          {["Engage", "Create group", "Download as .CSV", "Delete leads"].map(
            (action) => (
              <button
                className="border-background/20 border-r px-5 py-3 font-medium transition last:border-r-0 hover:bg-background/10 dark:hover:bg-zinc-300"
                key={action}
                type="button"
              >
                {action}
              </button>
            )
          )}
        </div>
      ) : null}

      <Sheet onOpenChange={setIsAddLeadOpen} open={isAddLeadOpen}>
        <SheetContent className="w-full sm:max-w-md" side="right">
          <SheetHeader>
            <SheetTitle>Add lead manually</SheetTitle>
            <SheetDescription>
              Capture a buyer or seller directly in the pipeline and drop them into Alex&apos;s queue.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-6">
            <div className="grid gap-2">
              <Label htmlFor="lead-name">Lead name</Label>
              <Input
                id="lead-name"
                onChange={(event) =>
                  setLeadForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Jordan Velasco"
                value={leadForm.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lead-title">Inquiry or note</Label>
              <Textarea
                id="lead-title"
                onChange={(event) =>
                  setLeadForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Buyer looking for a detached home near good schools with a June timeline."
                rows={4}
                value={leadForm.title}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-label">Lead type</Label>
                <Select
                  onValueChange={(value: LeadLabel) =>
                    setLeadForm((current) => ({ ...current, label: value }))
                  }
                  value={leadForm.label}
                >
                  <SelectTrigger id="lead-label">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="showing">Showing</SelectItem>
                    <SelectItem value="valuation">Valuation</SelectItem>
                    <SelectItem value="consult">Consult</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-stage">Stage</Label>
                <Select
                  onValueChange={(value: LeadStage) =>
                    setLeadForm((current) => ({ ...current, stage: value }))
                  }
                  value={leadForm.stage}
                >
                  <SelectTrigger id="lead-stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Requested">Requested</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Needs follow-up">Needs follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-priority">Priority</Label>
                <Select
                  onValueChange={(value: LeadPriority) =>
                    setLeadForm((current) => ({ ...current, priority: value }))
                  }
                  value={leadForm.priority}
                >
                  <SelectTrigger id="lead-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hot">Hot</SelectItem>
                    <SelectItem value="Warm">Warm</SelectItem>
                    <SelectItem value="Cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-source">Source</Label>
                <Select
                  onValueChange={(value: LeadSource) =>
                    setLeadForm((current) => ({ ...current, source: value }))
                  }
                  value={leadForm.source}
                >
                  <SelectTrigger id="lead-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Realtor.ca">Realtor.ca</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Open house">Open house</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead-channel">Channel</Label>
                <Select
                  onValueChange={(value: LeadRow["channel"]) =>
                    setLeadForm((current) => ({ ...current, channel: value }))
                  }
                  value={leadForm.channel}
                >
                  <SelectTrigger id="lead-channel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-sla">Response SLA (seconds)</Label>
                <Input
                  id="lead-sla"
                  inputMode="numeric"
                  onChange={(event) =>
                    setLeadForm((current) => ({
                      ...current,
                      responseSeconds: event.target.value.replace(/[^0-9]/g, ""),
                    }))
                  }
                  placeholder="30"
                  value={leadForm.responseSeconds}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border/60">
            <Button
              onClick={() => {
                setIsAddLeadOpen(false);
                resetLeadForm();
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button onClick={handleAddLead}>
              <Plus data-icon="inline-start" />
              Add lead
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
