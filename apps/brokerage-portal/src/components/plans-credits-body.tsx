"use client"

import {
  CalendarCheckIcon,
  CrownIcon,
  FileTextIcon,
  GlobeIcon,
  ImageIcon,
  PrinterIcon,
  RefreshCcwIcon,
  Settings2Icon,
  SparklesIcon,
  TimerResetIcon,
  UserPlusIcon,
  UsersIcon,
  WalletCardsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CardAction,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const credits = [
  { label: "Virtual Staging", used: 824, total: 1200 },
  { label: "Feature Sheets", used: 340, total: 500 },
  { label: "AI Enhancements", used: 1210, total: 1800 },
  { label: "Print Credits", used: 605, total: 1000 },
]

const plans = [
  {
    name: "Bronze",
    discount: "10%",
    details: ["Up to 20 seats", "7 days terms", "Standard support"],
    description: "Essential coverage for growing teams.",
    tone: "bg-muted-foreground/50",
  },
  {
    name: "Silver",
    discount: "15%",
    details: ["Up to 40 seats", "30 days terms", "Priority support"],
    description: "Balanced plan for active brokerages.",
    tone: "bg-muted-foreground/30",
  },
  {
    name: "Gold",
    discount: "20%",
    details: ["Up to 60 seats", "60 days terms", "Priority+ support"],
    description: "Maximum value with extended terms.",
    tone: "bg-primary/70",
    active: true,
  },
]

const quotas = [
  {
    icon: ImageIcon,
    title: "Virtual staging",
    value: "1,200 / month",
  },
  {
    icon: FileTextIcon,
    title: "Feature sheets",
    value: "500 / month",
  },
  {
    icon: SparklesIcon,
    title: "AI enhancements",
    value: "1,800 / month",
  },
  {
    icon: PrinterIcon,
    title: "Print credits",
    value: "1,000 / month",
  },
  {
    icon: GlobeIcon,
    title: "Website access",
    value: "Included",
  },
  {
    icon: CalendarCheckIcon,
    title: "Account terms",
    value: "60 days",
  },
]

const policies = [
  {
    icon: RefreshCcwIcon,
    title: "Credits reset monthly",
    description: "All credits refresh on the 1st of each month.",
  },
  {
    icon: TimerResetIcon,
    title: "Unused credits roll over",
    description: "Up to 20% of unused credits roll over monthly.",
  },
  {
    icon: WalletCardsIcon,
    title: "Overage charges",
    description: "Overage charges appear before checkout.",
  },
]

export function PlansCreditsBody() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Plans & Credits
            </h1>
            <p className="text-muted-foreground">
              Brokerage-level package management, credits, and usage.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Settings2Icon data-icon="inline-start" />
              Manage Plan
            </Button>
            <Button variant="outline">
              <UserPlusIcon data-icon="inline-start" />
              Assign Plan
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.45fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <CrownIcon />
                </div>
                <div className="flex min-w-0 flex-col items-start gap-2 text-left">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    Current Plan
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 text-left">
                    <CardTitle className="text-2xl leading-tight">
                      Gold Plan
                    </CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardDescription>
                    Renews Jun 1, 2026 (in 21 days)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Plan
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <UsersIcon />
                </div>
                <div className="flex min-w-0 flex-col items-start gap-2 text-left">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    Seats
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    48{" "}
                    <span className="text-xl font-normal text-muted-foreground">
                      / 60
                    </span>
                  </CardTitle>
                  <CardDescription>80% of seats in use</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-start gap-4 text-left text-sm text-muted-foreground">
              <span>36 Agents</span>
              <span>12 Assistants</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Credits Remaining This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {credits.map((credit) => (
                <div key={credit.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span>{credit.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {credit.used.toLocaleString()} /{" "}
                      {credit.total.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={credit.used} max={credit.total} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="brokerage" className="gap-5">
          <TabsList className="**:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="brokerage">Brokerage</TabsTrigger>
          </TabsList>

          {["agent", "team", "brokerage"].map((scope) => (
            <TabsContent key={scope} value={scope} className="mt-0">
              <div className="grid gap-4 lg:grid-cols-3">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(plan.active && "border-destructive/70")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-base uppercase tracking-wide">
                        <span
                          className={cn("size-3 rounded-full", plan.tone)}
                        />
                        {plan.name}
                      </CardTitle>
                      {plan.active ? (
                        <CardAction>
                          <Badge variant="destructive">Current Plan</Badge>
                        </CardAction>
                      ) : null}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      <div className="grid grid-cols-[1fr_auto_1.2fr] gap-5">
                        <div className="flex flex-col gap-3">
                          <p className="text-3xl font-semibold">
                            {plan.discount}
                          </p>
                          <CardDescription>Service discount</CardDescription>
                        </div>
                        <Separator orientation="vertical" />
                        <div className="flex flex-col gap-2 text-sm">
                          {plan.details.map((detail) => (
                            <span key={detail}>{detail}</span>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <CardDescription>{plan.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant={plan.active ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.active ? "Manage This Plan" : "View Details"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Included Quotas & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {quotas.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-center gap-3",
                    index > 0 && "lg:border-l lg:pl-5"
                  )}
                >
                  <Icon />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-5 p-6 lg:grid-cols-3">
            {policies.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-center gap-4",
                    index > 0 && "lg:border-l lg:pl-6"
                  )}
                >
                  <Icon className="size-9" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
