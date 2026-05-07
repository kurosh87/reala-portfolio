"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Building2,
  CheckSquare,
  ChevronDown,
  Ellipsis,
  Info,
  Mail,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topMetrics = [
  {
    icon: Users,
    label: "Total contact",
    value: "162",
    suffix: "Contacts",
    delta: "-1.1%",
    tone: "down" as const,
  },
  {
    icon: Building2,
    label: "Active company",
    value: "43",
    suffix: "Company",
    delta: "-1.7%",
    tone: "down" as const,
  },
  {
    icon: CheckSquare,
    label: "Ongoing task",
    value: "5",
    suffix: "Task",
    delta: "+1.7%",
    tone: "up" as const,
  },
  {
    icon: Mail,
    label: "Email sent",
    value: "1,251",
    suffix: "Mail",
    delta: "+8.7%",
    tone: "up" as const,
  },
] as const;

const revenueForecastData = [
  { month: "Jan", revenue: 10400, target: 5400 },
  { month: "Feb", revenue: 12800, target: 8400 },
  { month: "Mar", revenue: 11400, target: 5800 },
  { month: "Apr", revenue: 16600, target: 7200 },
  { month: "May", revenue: 13800, target: 12200 },
  { month: "Jun", revenue: 17100, target: 7800 },
  { month: "Jul", revenue: 17300, target: 9200 },
  { month: "Aug", revenue: 11300, target: 7200 },
  { month: "Sep", revenue: 15400, target: 10400 },
];

const sourceMixData = [
  { source: "Website", value: 38 },
  { source: "Email", value: 24 },
  { source: "Social Media", value: 19 },
  { source: "Portal", value: 13 },
  { source: "Open house", value: 6 },
];

const sourceDetailRows = [
  { label: "Acquisition", metric: "$12.01", change: "+1.1%", tone: "up" as const },
  { label: "Conversion", metric: "1.2 days", change: "-2.0%", tone: "down" as const },
  { label: "ROI", metric: "98%", change: "+1.7%", tone: "up" as const },
];

const leadRows = [
  {
    id: "jane-cooper",
    name: "Jane Cooper",
    email: "lesliealx01@mail.com",
    phone: "(406) 555-0120",
    location: "2972 Westheimer Rd. Santa Ana",
    status: "New",
    owner: "Female",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "wade-warren",
    name: "Wade Warren",
    email: "floydmiles@mail.com",
    phone: "(480) 555-0103",
    location: "1901 Thornridge Cir. Shiloh",
    status: "Bad Timing",
    owner: "Male",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "esther-howard",
    name: "Esther Howard",
    email: "jromebell@mail.com",
    phone: "(603) 555-0123",
    location: "4140 Parker Rd. Allentown",
    status: "Customers",
    owner: "Male",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
] as const;

const revenueChartConfig = {
  revenue: {
    label: "This period",
    color: "hsl(0 0% 88%)",
  },
  target: {
    label: "Last period",
    color: "hsl(0 0% 58%)",
  },
} satisfies ChartConfig;

const sourceChartConfig = {
  value: {
    label: "Lead share",
    color: "hsl(0 0% 80%)",
  },
} satisfies ChartConfig;

function changeBadge(tone: "up" | "down", value: string) {
  return (
    <Badge
      className="rounded-md border border-border/60 bg-muted px-2.5 text-foreground/75"
      variant="secondary"
    >
      {tone === "up" ? <TrendingUp data-icon="inline-start" /> : <TrendingDown data-icon="inline-start" />}
      {value}
    </Badge>
  );
}

function statusBadge(status: string) {
  return (
    <Badge className="rounded-md border border-border/60 bg-muted px-2.5 text-foreground/75" variant="secondary">
      {status}
    </Badge>
  );
}

function formatRevenueTick(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

export function InsightsResponseSpeed() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="grid gap-4 xl:grid-cols-4">
          {topMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card
                className="rounded-[28px] border-border/60 bg-muted/20 shadow-none"
                key={metric.label}
              >
                <CardContent className="p-4">
                  <div className="rounded-[24px] border border-border/60 bg-background px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex size-14 items-center justify-center rounded-[18px] border border-border/60 bg-background">
                          <Icon className="size-6 text-foreground/70" />
                        </div>
                        <div className="flex items-start gap-2 pt-1">
                          <div className="max-w-[7.5rem] text-lg font-medium leading-snug text-foreground">
                            {metric.label}
                          </div>
                          <Info className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        </div>
                      </div>
                      <Badge
                        className="rounded-full border border-border/60 bg-muted px-3 py-1 text-foreground/75"
                        variant="secondary"
                      >
                        {metric.tone === "up" ? (
                          <TrendingUp data-icon="inline-start" />
                        ) : (
                          <TrendingDown data-icon="inline-start" />
                        )}
                        {metric.delta}
                      </Badge>
                    </div>

                    <div className="mt-8 text-4xl font-semibold tracking-tight text-foreground">
                      {metric.value}
                      <span className="ml-2 text-2xl font-medium text-foreground/90">
                        {metric.suffix}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="items-center justify-between px-6 pb-5 pt-2">
                  <div className="text-sm text-muted-foreground">From last month</div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground/75">
                    View Details
                    <ArrowRight className="size-4" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <Card className="overflow-hidden rounded-xl border-border/60 shadow-none">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-xl">Revenue forecast</CardTitle>
              </div>
              <Tabs defaultValue="monthly">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-semibold text-foreground">
                  $23,569.00
                </div>
                {changeBadge("up", "5.2%")}
                <div className="text-muted-foreground text-sm">from last period</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[var(--color-revenue)]" />
                  This period
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[var(--color-target)]" />
                  Last period
                </span>
              </div>
            </div>

            <ChartContainer className="min-h-[320px] w-full" config={revenueChartConfig}>
              <AreaChart
                accessibilityLayer
                data={revenueForecastData}
                margin={{ left: 12, right: 12, top: 8 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={true} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={10} />
                <YAxis
                  axisLine={false}
                  tickFormatter={formatRevenueTick}
                  tickLine={false}
                  tickMargin={10}
                  width={60}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value, name) => (
                        <div className="flex min-w-[170px] items-center justify-between gap-3">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-medium text-foreground">
                            ${Number(value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  fill="url(#revenueFill)"
                  stroke="var(--color-revenue)"
                  strokeWidth={3}
                  type="natural"
                />
                <Line
                  dataKey="target"
                  dot={false}
                  stroke="var(--color-target)"
                  strokeWidth={2.5}
                  type="natural"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/60 shadow-none">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-xl">Source</CardTitle>
              <Select defaultValue="weekly">
                <SelectTrigger size="sm" className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Source range</SelectLabel>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-semibold text-foreground">
                12,569
              </div>
              {changeBadge("up", "2.1%")}
            </div>

            <ChartContainer className="mx-auto min-h-[220px] w-full max-w-[300px]" config={sourceChartConfig}>
              <RadarChart
                accessibilityLayer
                data={sourceMixData}
                margin={{ top: 6, right: 20, bottom: 6, left: 20 }}
              >
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="source"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  axisLine={false}
                  domain={[0, 40]}
                  tick={false}
                  tickCount={5}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex min-w-[160px] items-center justify-between gap-3">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-medium text-foreground">{value}%</span>
                        </div>
                      )}
                    />
                  }
                />
                <Radar
                  dataKey="value"
                  fill="var(--color-value)"
                  fillOpacity={0.3}
                  stroke="var(--color-value)"
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ChartContainer>

            <div className="grid gap-4 border-t border-border/60 pt-4">
              {sourceDetailRows.map((row) => (
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm" key={row.label}>
                  <div className="text-foreground">{row.label}</div>
                  <div className="text-muted-foreground">{row.metric}</div>
                  <div>{changeBadge(row.tone, row.change)}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center font-medium text-foreground">
              View reports
            </div>
          </CardFooter>
        </Card>
      </section>

      <Card className="rounded-xl border-border/60 shadow-none">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl">Contacts</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                <span>Search contact...</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                <ChevronDown className="size-4 rotate-90" />
                Filter
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="h-12 px-4 text-muted-foreground">Name</TableHead>
                  <TableHead className="h-12 px-4 text-muted-foreground">Email</TableHead>
                  <TableHead className="h-12 px-4 text-muted-foreground">Phone</TableHead>
                  <TableHead className="h-12 px-4 text-muted-foreground">Location</TableHead>
                  <TableHead className="h-12 px-4 text-muted-foreground">Lead Status</TableHead>
                  <TableHead className="h-12 px-4 text-muted-foreground">Gender</TableHead>
                  <TableHead className="h-12 px-4 text-right text-muted-foreground" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadRows.map((lead) => (
                  <TableRow
                    className="h-[72px] border-border bg-background hover:bg-muted/35"
                    key={lead.id}
                  >
                    <TableCell className="px-4">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage alt={lead.name} src={lead.avatar} />
                          <AvatarFallback>
                            {lead.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-foreground">{lead.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-foreground">{lead.email}</TableCell>
                    <TableCell className="px-4 text-foreground">{lead.phone}</TableCell>
                    <TableCell className="px-4 text-foreground">{lead.location}</TableCell>
                    <TableCell className="px-4">{statusBadge(lead.status)}</TableCell>
                    <TableCell className="px-4 text-foreground">{lead.owner}</TableCell>
                    <TableCell className="px-4 text-right">
                      <Ellipsis className="ml-auto size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
