"use client"

import { Badge } from "@/components/ui/badge"
import { type DashboardRole } from "@/components/role-context"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

const roleMetrics: Record<
  DashboardRole,
  {
    revenue: string
    revenueLabel: string
    customers: string
    customersLabel: string
    accounts: string
    accountsLabel: string
    growth: string
    growthLabel: string
  }
> = {
  "Reala Super Admin": {
    revenue: "8",
    revenueLabel: "Live Droplets",
    customers: "3,967",
    customersLabel: "Legacy Clients",
    accounts: "14",
    accountsLabel: "Ops Exceptions",
    growth: "Dry-run",
    growthLabel: "Bridge Mode",
  },
  "Reala Ops Admin": {
    revenue: "21",
    revenueLabel: "Sync Candidates",
    customers: "7",
    customersLabel: "Matterport Reviews",
    accounts: "12",
    accountsLabel: "Invoice Flags",
    growth: "Manual",
    growthLabel: "Repair Mode",
  },
  "Vendor Admin": {
    revenue: "6",
    revenueLabel: "Active Providers",
    customers: "14",
    customersLabel: "Assigned Jobs",
    accounts: "3",
    accountsLabel: "Capacity Alerts",
    growth: "96%",
    growthLabel: "On-Time Rate",
  },
  "Field Technician": {
    revenue: "4",
    revenueLabel: "Today Jobs",
    customers: "2",
    customersLabel: "Uploads Needed",
    accounts: "1",
    accountsLabel: "Floor Plan Review",
    growth: "Live",
    growthLabel: "Calendar Status",
  },
  "Partner Photographer": {
    revenue: "9",
    revenueLabel: "Client Uploads",
    customers: "3",
    customersLabel: "Processing Jobs",
    accounts: "2",
    accountsLabel: "Feature Sheet Drafts",
    growth: "Draft",
    growthLabel: "Delivery Mode",
  },
  "Brokerage Admin": {
    revenue: "$1,250.00",
    revenueLabel: "Total Revenue",
    customers: "1,234",
    customersLabel: "New Customers",
    accounts: "45,678",
    accountsLabel: "Active Accounts",
    growth: "4.5%",
    growthLabel: "Growth Rate",
  },
  "North Group Team": {
    revenue: "$84,300",
    revenueLabel: "Team Volume",
    customers: "48",
    customersLabel: "Open Orders",
    accounts: "17",
    accountsLabel: "Active Listings",
    growth: "92%",
    growthLabel: "On-Time Jobs",
  },
  "Individual Agent": {
    revenue: "$18,920",
    revenueLabel: "Agent Pipeline",
    customers: "12",
    customersLabel: "Assigned Orders",
    accounts: "6",
    accountsLabel: "Live Listings",
    growth: "8",
    growthLabel: "Approvals Due",
  },
  "New Reala Client": {
    revenue: "$0",
    revenueLabel: "Draft Estimate",
    customers: "1",
    customersLabel: "Open Request",
    accounts: "0",
    accountsLabel: "Approved Orders",
    growth: "Draft",
    growthLabel: "Order Status",
  },
}

export function SectionCards({ role }: { role: DashboardRole }) {
  const metrics = roleMetrics[role]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{metrics.revenueLabel}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.revenue}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{metrics.customersLabel}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.customers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon
              />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{metrics.accountsLabel}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.accounts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{metrics.growthLabel}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.growth}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
