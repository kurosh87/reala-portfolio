"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  CommandIcon,
  MessageSquareIcon,
  SlidersHorizontalIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  leadsRows,
  liveConversationRows,
  performanceRows,
  selectedConversation,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type RouteStubProps = {
  pathname: string;
};

type LiveConversationRow = (typeof liveConversationRows)[number];
type LeadsRow = (typeof leadsRows)[number];
type PerformanceRow = (typeof performanceRows)[number];

type TimelineMessage = {
  speaker: string;
  body: string;
  time: string;
  channel: string;
  tone: string;
};

type ConversationDetail = {
  lead: string;
  title: string;
  subtitle: string;
  source: string;
  stage: string;
  stageDot: string;
  context: string;
  inquiry: string;
  generatedAt: string;
  leadInput: string;
  journey: string;
  channels: string;
  responseTime: string;
  exchangeCount: string;
  agentAction: string;
  lastActivity: string;
  messages: TimelineMessage[];
};

const toneByStage: Record<string, string> = {
  Requested: "bg-sky-400",
  Qualified: "bg-emerald-400",
  Qualifying: "bg-amber-400",
  "Needs follow-up": "bg-rose-400",
};

const conversationDetails: ConversationDetail[] = liveConversationRows.map((row) => ({
  lead: row.lead,
  title: row.lead,
  subtitle: `${row.source} · ${row.context} · ${row.inquiry}`,
  source: row.source,
  stage: row.stage,
  stageDot: row.stageDot,
  context: row.context,
  inquiry: row.inquiry,
  generatedAt: row.generatedAt,
  leadInput: row.leadInput,
  journey: row.journey,
  channels: row.channels,
  responseTime: row.responseTime,
  exchangeCount: row.exchangeCount,
  agentAction: row.agentAction,
  lastActivity: row.lastActivity,
  messages:
    row.lead === selectedConversation.lead
      ? selectedConversation.messages.map((message) => ({
          speaker: message.speaker,
          body: message.body,
          time: message.time,
          channel:
            message.speaker === "Maya"
              ? "Incoming SMS"
              : message.speaker === "AI Alex"
                ? "Automated SMS"
                : "Internal note",
          tone: message.tone,
        }))
      : [
          {
            speaker: row.lead,
            body: row.leadInput,
            time: row.generatedAt.replace(/^[^0-9]*/, ""),
            channel: row.channels.includes("Email") ? "Incoming email" : "Incoming SMS",
            tone: "border-border/60 bg-background/60 text-foreground",
          },
          {
            speaker: row.aiOwner,
            body: row.journey.split(" -> ")[1] ?? row.summary,
            time: "Moments later",
            channel: row.channels.includes("SMS") ? "Automated SMS" : "Automated email",
            tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
          },
          {
            speaker: "Realtor note",
            body: row.agentAction,
            time: row.lastActivity,
            channel: "Internal note",
            tone: "border-border/60 bg-muted/30 text-foreground",
          },
        ],
}));

function getConversationDetail(lead: string) {
  return (
    conversationDetails.find((detail) => detail.lead === lead) ??
    ({
      lead,
      title: lead,
      subtitle: "Lead context",
      source: "Unknown",
      stage: "Requested",
      stageDot: toneByStage.Requested,
      context: "Lead",
      inquiry: "Conversation",
      generatedAt: "Captured recently",
      leadInput: "Lead message unavailable in the demo seed data.",
      journey: "Captured -> queued for follow-up",
      channels: "SMS only",
      responseTime: "N/A",
      exchangeCount: "0 messages",
      agentAction: "Select this lead and respond manually.",
      lastActivity: "Just now",
      messages: [],
    } satisfies ConversationDetail)
  );
}

function StageBadge({
  label,
  dotClassName,
}: {
  label: string;
  dotClassName: string;
}) {
  return (
    <Badge className="gap-2 rounded-md border-border/60 bg-background/50 px-2.5 text-xs text-foreground" variant="outline">
      <span className={cn("size-2 rounded-full", dotClassName)} />
      {label}
    </Badge>
  );
}

function TablecnShell({
  children,
  search,
  onSearchChange,
  stage,
  onStageChange,
  source,
  onSourceChange,
  searchPlaceholder,
  sourceOptions,
  stageOptions,
  selectionLabel,
}: {
  children: React.ReactNode;
  search: string;
  onSearchChange: (value: string) => void;
  stage: string;
  onStageChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  searchPlaceholder: string;
  sourceOptions: string[];
  stageOptions: string[];
  selectionLabel: string;
}) {
  return (
    <div className="flex w-full flex-col gap-4 pt-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button className="rounded-md" size="sm" variant="outline">
          <SlidersHorizontalIcon />
          Advanced filters
        </Button>
        <Button className="rounded-md" size="sm" variant="outline">
          <CommandIcon />
          Command filters
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/5">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-4">
          <Input
            className="h-10 w-full rounded-md md:max-w-[260px]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            value={search}
          />

          <Select onValueChange={onStageChange} value={stage}>
            <SelectTrigger className="h-10 w-full rounded-md md:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {stageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {sourceOptions.length > 0 ? (
            <Select onValueChange={onSourceChange} value={source}>
              <SelectTrigger className="h-10 w-full rounded-md md:w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sourceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <div className="ml-auto flex items-center gap-2">
            <Button className="rounded-md" size="sm" variant="outline">
              <ArrowUpDownIcon />
              Sort
              <Badge className="ml-1 rounded-sm px-1 text-[10px]" variant="outline">
                1
              </Badge>
            </Button>
            <Button className="rounded-md" size="sm" variant="outline">
              View
            </Button>
          </div>
        </div>

        <div className="px-4 py-0">{children}</div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
          <span>{selectionLabel}</span>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-[76px] rounded-md px-2.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <Button size="icon-xs" variant="outline">
                <ChevronsLeftIcon />
              </Button>
              <Button size="icon-xs" variant="outline">
                <ChevronLeftIcon />
              </Button>
              <Button size="icon-xs" variant="outline">
                <ChevronRightIcon />
              </Button>
              <Button size="icon-xs" variant="outline">
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationSheet({
  detail,
  open,
  onOpenChange,
}: {
  detail: ConversationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const [draftsByLead, setDraftsByLead] = useState<Record<string, TimelineMessage[]>>({});

  const messages = detail
    ? [...detail.messages, ...(draftsByLead[detail.lead] ?? [])]
    : [];

  const appendMessage = (channel: "Manual SMS" | "Internal note") => {
    if (!detail || !draft.trim()) {
      return;
    }

    const nextMessage: TimelineMessage = {
      speaker: channel === "Manual SMS" ? "Realtor" : "Realtor note",
      body: draft.trim(),
      time: "Now",
      channel,
      tone:
        channel === "Manual SMS"
          ? "border-sky-500/20 bg-sky-500/10 text-sky-100"
          : "border-border/60 bg-muted/30 text-foreground",
    };

    setDraftsByLead((current) => ({
      ...current,
      [detail.lead]: [...(current[detail.lead] ?? []), nextMessage],
    }));
    setDraft("");
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="w-full overflow-y-auto border-border/60 bg-background/95 sm:max-w-2xl">
        {detail ? (
          <>
            <SheetHeader className="border-b border-border/60 pb-4">
              <SheetTitle>{detail.title}</SheetTitle>
              <SheetDescription>{detail.subtitle}</SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <StageBadge dotClassName={detail.stageDot} label={detail.stage} />
                    <Badge className="rounded-md border-border/60 bg-background/50 px-2.5 text-xs text-foreground" variant="outline">
                      {detail.context}
                    </Badge>
                    <Badge className="rounded-md border-border/60 bg-background/50 px-2.5 text-xs text-foreground" variant="outline">
                      {detail.inquiry}
                    </Badge>
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Source</dt>
                      <dd>{detail.source}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Generated</dt>
                      <dd>{detail.generatedAt}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Lead input</dt>
                      <dd className="text-muted-foreground">{detail.leadInput}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">What happened</dt>
                      <dd>{detail.journey}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Channels</dt>
                        <dd>{detail.channels}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">First reply</dt>
                        <dd>{detail.responseTime}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Back and forth</dt>
                        <dd>{detail.exchangeCount}</dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Agent can do next</dt>
                      <dd>{detail.agentAction}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Conversation stream</h3>
                  <span className="text-xs text-muted-foreground">{detail.lastActivity}</span>
                </div>

                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      className={cn(
                        "rounded-xl border p-4",
                        message.tone
                      )}
                      key={`${message.speaker}-${message.time}-${index}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{message.speaker}</p>
                          <p className="text-xs text-muted-foreground">{message.channel}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="leading-6">{message.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Add to thread</h3>
                  <span className="text-xs text-muted-foreground">Send directly as the realtor</span>
                </div>
                <Textarea
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Reply about ${detail.lead}, add context, or take over the SMS thread...`}
                  value={draft}
                />
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                  <Button onClick={() => appendMessage("Internal note")} size="sm" variant="outline">
                    <StickyNoteIcon />
                    Add note
                  </Button>
                  <Button onClick={() => appendMessage("Manual SMS")} size="sm">
                    <MessageSquareIcon />
                    Send SMS
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function useLiveConversationTable() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [source, setSource] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLead, setSelectedLead] = useState<ConversationDetail | null>(null);

  const filtered = useMemo(() => {
    return liveConversationRows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.lead, row.source, row.leadInput, row.journey, row.channels]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStage = stage === "all" || row.stage === stage;
      const matchesSource = source === "all" || row.source === source;
      return matchesSearch && matchesStage && matchesSource;
    });
  }, [search, source, stage]);

  const columns = useMemo<ColumnDef<LiveConversationRow>[]>(
    () => [
      {
        accessorKey: "lead",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Lead" />
        ),
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <div className="font-medium">{row.original.lead}</div>
            <div className="mt-1 text-xs text-muted-foreground">{row.original.source}</div>
          </div>
        ),
      },
      {
        accessorKey: "stage",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Stage" />
        ),
        cell: ({ row }) => (
          <StageBadge dotClassName={row.original.stageDot} label={row.original.stage} />
        ),
      },
      {
        accessorKey: "generatedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Generated" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[180px] text-sm text-muted-foreground">
            {row.original.generatedAt}
          </div>
        ),
      },
      {
        accessorKey: "leadInput",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Lead input" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[320px] text-sm text-muted-foreground line-clamp-2">
            {row.original.leadInput}
          </div>
        ),
      },
      {
        accessorKey: "journey",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="What happened" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[320px] text-sm text-muted-foreground line-clamp-2">
            {row.original.journey}
          </div>
        ),
      },
      {
        accessorKey: "channels",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Channels" />
        ),
        cell: ({ row }) => (
          <div className="min-w-[120px] text-sm">{row.original.channels}</div>
        ),
      },
      {
        accessorKey: "responseTime",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="First reply" />
        ),
      },
      {
        accessorKey: "exchangeCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Back & forth" />
        ),
      },
      {
        accessorKey: "lastActivity",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Last touch" />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    search,
    setSearch,
    stage,
    setStage,
    source,
    setSource,
    table,
    selectedLead,
    setSelectedLead,
  };
}

function LiveConversationsTable() {
  const {
    search,
    setSearch,
    stage,
    setStage,
    source,
    setSource,
    table,
    selectedLead,
    setSelectedLead,
  } = useLiveConversationTable();

  const rowsCount = table.getRowModel().rows.length;

  return (
    <>
      <TablecnShell
        onSearchChange={setSearch}
        onSourceChange={setSource}
        onStageChange={setStage}
        search={search}
        searchPlaceholder="Search threads..."
        selectionLabel={`0 of ${rowsCount} row(s) selected.`}
        source={source}
        sourceOptions={[...new Set(liveConversationRows.map((row) => row.source))]}
        stage={stage}
        stageOptions={[...new Set(liveConversationRows.map((row) => row.stage))]}
      >
        <DataTable
          className="gap-0"
          getRowProps={(row: Row<LiveConversationRow>) => ({
            className:
              "cursor-pointer transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/30",
            onClick: () => setSelectedLead(getConversationDetail(row.original.lead)),
          })}
          table={table}
          unstyledContainer
        />
      </TablecnShell>

      <ConversationSheet
        detail={selectedLead}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null);
          }
        }}
        open={Boolean(selectedLead)}
      />
    </>
  );
}

function LeadsTable() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [source, setSource] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLead, setSelectedLead] = useState<ConversationDetail | null>(null);

  const filtered = useMemo(() => {
    return leadsRows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.lead, row.source, row.category, row.location, row.approval]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStage = stage === "all" || row.stage === stage;
      const matchesSource = source === "all" || row.source === source;
      return matchesSearch && matchesStage && matchesSource;
    });
  }, [search, source, stage]);

  const columns = useMemo<ColumnDef<LeadsRow>[]>(
    () => [
      {
        accessorKey: "lead",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Lead" />
        ),
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <div className="font-medium">{row.original.lead}</div>
            <div className="mt-1 text-xs text-muted-foreground">{row.original.source}</div>
          </div>
        ),
      },
      {
        accessorKey: "stage",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Stage" />
        ),
        cell: ({ row }) => (
          <StageBadge
            dotClassName={row.original.stageDot}
            label={row.original.stage}
          />
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Category" />
        ),
      },
      {
        accessorKey: "approval",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Approval" />
        ),
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Location" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[220px] text-sm text-muted-foreground">
            {row.original.location}
          </div>
        ),
      },
      {
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
      },
      {
        accessorKey: "updated",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Updated" />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowsCount = table.getRowModel().rows.length;

  return (
    <>
      <TablecnShell
        onSearchChange={setSearch}
        onSourceChange={setSource}
        onStageChange={setStage}
        search={search}
        searchPlaceholder="Search leads..."
        selectionLabel={`0 of ${rowsCount} row(s) selected.`}
        source={source}
        sourceOptions={[...new Set(leadsRows.map((row) => row.source))]}
        stage={stage}
        stageOptions={[...new Set(leadsRows.map((row) => row.stage))]}
      >
        <DataTable
          className="gap-0"
          getRowProps={(row: Row<LeadsRow>) => ({
            className:
              "cursor-pointer transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/30",
            onClick: () => setSelectedLead(getConversationDetail(row.original.lead)),
          })}
          table={table}
          unstyledContainer
        />
      </TablecnShell>

      <ConversationSheet
        detail={selectedLead}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null);
          }
        }}
        open={Boolean(selectedLead)}
      />
    </>
  );
}

function PerformanceTable() {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filtered = useMemo(() => {
    return performanceRows.filter((row) =>
      row.source.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<ColumnDef<PerformanceRow>[]>(
    () => [
      {
        accessorKey: "source",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Source" />
        ),
      },
      {
        accessorKey: "leads",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Leads" />
        ),
      },
      {
        accessorKey: "qualified",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Qualified" />
        ),
      },
      {
        accessorKey: "qualificationRate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Qualification Rate" />
        ),
      },
      {
        accessorKey: "avgResponse",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Avg Response" />
        ),
      },
      {
        accessorKey: "booked",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Calls Booked" />
        ),
      },
      {
        accessorKey: "sellerLeads",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Seller Leads" />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowsCount = table.getRowModel().rows.length;

  return (
    <TablecnShell
      onSearchChange={setSearch}
      onSourceChange={() => {}}
      onStageChange={() => {}}
      search={search}
      searchPlaceholder="Search sources..."
      selectionLabel={`0 of ${rowsCount} row(s) selected.`}
      source="all"
      sourceOptions={[]}
      stage="all"
      stageOptions={[]}
    >
      <DataTable className="gap-0" table={table} unstyledContainer />
    </TablecnShell>
  );
}

export function RouteStub({ pathname }: RouteStubProps) {
  if (pathname === "/inbox" || pathname === "/live-conversations") {
    return <LiveConversationsTable />;
  }

  if (pathname === "/leads") {
    return <LeadsTable />;
  }

  if (pathname === "/performance") {
    return <PerformanceTable />;
  }

  return null;
}
