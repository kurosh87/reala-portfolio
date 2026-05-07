"use client"

import * as React from "react"
import {
  CalendarSyncIcon,
  CheckCircle2Icon,
  Columns3Icon,
  ExternalLinkIcon,
  FileSpreadsheetIcon,
  FilterIcon,
  LockIcon,
  SearchIcon,
  ShieldCheckIcon,
  TablePropertiesIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  LegacySheetCategory,
  LegacySheetFreshness,
  LegacySheetsWorkplaceData,
} from "@/lib/legacy-sheets"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"
import { cn } from "@/lib/utils"

const freshnessStyles = {
  fresh: "border-green-200 bg-green-50 text-green-700",
  recent: "border-blue-200 bg-blue-50 text-blue-700",
  stale: "border-amber-200 bg-amber-50 text-amber-800",
  archived: "border-slate-200 bg-slate-50 text-slate-700",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
} satisfies Record<LegacySheetFreshness, string>

const categoryLabels = {
  primary_ops: "primary ops",
  catalog: "catalog",
  print: "print",
  sensitive: "sensitive",
  testing: "testing",
} satisfies Record<LegacySheetCategory, string>

const pageSize = 12

export function LegacySheetsWorkplaceShell({
  initialAccess,
  data,
}: {
  initialAccess?: WorkspaceAccessSnapshot
  data: LegacySheetsWorkplaceData
}) {
  const allTabs = React.useMemo(
    () =>
      data.workbooks.flatMap((workbook) =>
        workbook.tabs.map((tab) => ({ workbook, tab }))
      ),
    [data.workbooks]
  )
  const [selectedTabId, setSelectedTabId] = React.useState(
    allTabs[0]?.tab.id ?? ""
  )
  const selected = allTabs.find((item) => item.tab.id === selectedTabId) ?? allTabs[0]
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(
    () => new Set()
  )
  const selectedColumns = selected?.tab.columns ?? []
  const visibleColumns = selectedColumns.filter(
    (column) => !hiddenColumns.has(column.id)
  )
  const filteredRows = React.useMemo(() => {
    if (!selected) return []
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return selected.tab.previewRows

    return selected.tab.previewRows.filter((row) =>
      Object.values(row.cells).some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    )
  }, [query, selected])
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const pagedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )
  const bridgeCandidates = data.workbooks.filter((workbook) => workbook.bridgeCandidate)

  const selectTab = React.useCallback((tabId: string | null) => {
    if (!tabId) return
    setSelectedTabId(tabId)
    setQuery("")
    setPage(1)
    setHiddenColumns(new Set())
  }, [])

  const updateQuery = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
      setPage(1)
    },
    []
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
          <SiteHeader title="Legacy Sheets" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    Legacy Sheets
                  </h1>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                    Superadmin read-only tables for every discovered legacy
                    spreadsheet tab. This workplace inspects Google Sheets
                    mirrors only and does not write to Sheets, TimeTap, folders,
                    Stripe, or legacy databases.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      <ShieldCheckIcon />
                      Read-only
                    </Badge>
                    <Badge
                      className={cn(
                        data.mode === "live"
                          ? freshnessStyles.fresh
                          : freshnessStyles.unknown
                      )}
                    >
                      {data.mode === "live" ? "Live Google mirror" : "Fallback metadata"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Generated {formatDateTime(data.generatedAt)}
                    </span>
                  </div>
                </div>
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={<a href="#bridge-candidates" />}
                >
                    <CalendarSyncIcon />
                    Bridge candidates
                </Button>
              </section>

              {data.warning ? (
                <section className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  {data.warning}
                </section>
              ) : null}

              <section className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  icon={<FileSpreadsheetIcon />}
                  label="Workbooks"
                  value={`${data.workbooks.length}`}
                  detail={data.sourceLabel}
                />
                <MetricCard
                  icon={<TablePropertiesIcon />}
                  label="Tabs"
                  value={`${allTabs.length}`}
                  detail="Every discovered tab is visible."
                />
                <MetricCard
                  icon={<LockIcon />}
                  label="Sensitive Tabs"
                  value={`${allTabs.filter((item) => item.tab.sensitive).length}`}
                  detail="Rows and sensitive fields are masked."
                />
                <MetricCard
                  icon={<CheckCircle2Icon />}
                  label="Bridge Candidates"
                  value={`${bridgeCandidates.length}`}
                  detail="Daily, catalog, and print sources only."
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Workbook overview</CardTitle>
                    <CardDescription>
                      Freshness, ownership, category, and bridge confidence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Workbook</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Modified</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Tabs</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Open</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.workbooks.map((workbook) => (
                          <TableRow key={workbook.id}>
                            <TableCell className="min-w-64">
                              <div className="font-medium">{workbook.title}</div>
                              <div className="font-mono text-xs text-muted-foreground">
                                {workbook.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <CategoryBadge category={workbook.category} />
                                <Badge className={freshnessStyles[workbook.freshness]}>
                                  {workbook.freshness}
                                </Badge>
                                {workbook.sensitive ? (
                                  <Badge variant="outline">
                                    <LockIcon />
                                    masked
                                  </Badge>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(workbook.modifiedTime)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {workbook.ownerDisplayName ?? "Unknown"}
                            </TableCell>
                            <TableCell>{workbook.tabs.length}</TableCell>
                            <TableCell className="max-w-64 whitespace-normal text-sm text-muted-foreground">
                              {workbook.sourceConfidence}
                            </TableCell>
                            <TableCell>
                              {workbook.webViewLink ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  render={
                                    <a
                                    href={workbook.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Open ${workbook.title}`}
                                    />
                                  }
                                >
                                  <ExternalLinkIcon />
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tabs</CardTitle>
                    <CardDescription>
                      Select any tab to inspect the masked preview table.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={selected?.tab.id ?? ""} onValueChange={selectTab}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a legacy tab" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {allTabs.map(({ workbook, tab }) => (
                            <SelectItem key={tab.id} value={tab.id}>
                              {workbook.title} / {tab.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tab</TableHead>
                          <TableHead>GID</TableHead>
                          <TableHead>Rows</TableHead>
                          <TableHead>Cols</TableHead>
                          <TableHead>State</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allTabs.map(({ workbook, tab }) => (
                          <TableRow
                            key={tab.id}
                            className={cn(
                              tab.id === selected?.tab.id && "bg-muted/60"
                            )}
                            onClick={() => selectTab(tab.id)}
                          >
                            <TableCell className="min-w-52">
                              <div className="font-medium">{tab.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {workbook.title}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {tab.gid}
                            </TableCell>
                            <TableCell>{formatNumber(tab.rowCount)}</TableCell>
                            <TableCell>{formatNumber(tab.columnCount)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {tab.primary ? (
                                  <Badge className="border-green-200 bg-green-50 text-green-700">
                                    primary ops
                                  </Badge>
                                ) : (
                                  <CategoryBadge category={tab.category} />
                                )}
                                {tab.sensitive ? (
                                  <Badge variant="outline">
                                    <LockIcon />
                                    masked
                                  </Badge>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </section>

              {selected ? (
                <Card>
                  <CardHeader className="gap-3 lg:grid-cols-[1fr_auto]">
                    <div>
                      <CardTitle>{selected.tab.title}</CardTitle>
                      <CardDescription>
                        {selected.workbook.title} · range {selected.tab.previewRange} ·{" "}
                        {formatNumber(selected.tab.previewPopulatedCells)} populated preview cells
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative">
                        <SearchIcon className="pointer-events-none absolute left-2 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          value={query}
                          onChange={updateQuery}
                          placeholder="Search preview..."
                          className="pl-8 sm:w-64"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="outline">
                            <Columns3Icon />
                            Columns
                            </Button>
                          }
                        >
                          <span className="sr-only">Toggle visible columns</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                          {selectedColumns.map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              checked={!hiddenColumns.has(column.id)}
                              onCheckedChange={(checked) => {
                                setHiddenColumns((current) => {
                                  const next = new Set(current)
                                  if (checked) next.delete(column.id)
                                  else next.add(column.id)
                                  return next
                                })
                              }}
                            >
                              {column.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">
                        <FilterIcon />
                        {filteredRows.length} preview rows
                      </Badge>
                      {selected.tab.sensitive ? (
                        <Badge variant="outline">
                          <LockIcon />
                          sensitive values masked
                        </Badge>
                      ) : null}
                      <span>
                        Source stays in Google Sheets; this table is inspection only.
                      </span>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          {visibleColumns.map((column) => (
                            <TableHead key={column.id} className="min-w-36">
                              {column.label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedRows.length ? (
                          pagedRows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {row.rowNumber}
                              </TableCell>
                              {visibleColumns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  className="max-w-72 whitespace-normal text-sm"
                                >
                                  {row.cells[column.id] || (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={visibleColumns.length + 1}
                              className="h-24 text-center text-muted-foreground"
                            >
                              No preview rows match this search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        Page {safePage} of {pageCount}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={safePage <= 1}
                          onClick={() => setPage((value) => Math.max(1, value - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          disabled={safePage >= pageCount}
                          onClick={() =>
                            setPage((value) => Math.min(pageCount, value + 1))
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <section id="bridge-candidates" className="grid gap-4 lg:grid-cols-3">
                {bridgeCandidates.map((workbook) => (
                  <Card key={workbook.id}>
                    <CardHeader>
                      <CardTitle>{workbook.title}</CardTitle>
                      <CardDescription>{workbook.categoryLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {workbook.bridgeUse}
                      </p>
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">dry-run source only</Badge>
                        <Badge className={freshnessStyles[workbook.freshness]}>
                          {workbook.freshness}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function MetricCard({
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
    <Card size="sm">
      <CardContent className="flex items-start gap-3">
        <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold tracking-normal">{value}</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">
            {detail}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryBadge({ category }: { category: LegacySheetCategory }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        category === "sensitive" && "border-red-200 bg-red-50 text-red-700",
        category === "testing" && "border-slate-200 bg-slate-50 text-slate-700",
        category === "primary_ops" && "border-green-200 bg-green-50 text-green-700",
        category === "catalog" && "border-blue-200 bg-blue-50 text-blue-700",
        category === "print" && "border-purple-200 bg-purple-50 text-purple-700"
      )}
    >
      {categoryLabels[category]}
    </Badge>
  )
}

function formatDate(value: string | null) {
  if (!value) return "Unknown"
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-CA").format(value)
}
