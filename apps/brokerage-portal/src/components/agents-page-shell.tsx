"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  BotIcon,
  Building2Icon,
  CheckIcon,
  DownloadIcon,
  EllipsisIcon,
  Grid2X2Icon,
  GripVerticalIcon,
  ListIcon,
  MailIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Sheet,
  SheetClose,
  SheetContent,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type Agent = {
  name: string
  email: string
  image: string
  role: "Agent" | "Team Lead" | "Assistant" | "Coordinator"
  team: string
  scope: "Brokerage" | "Team"
  plan: "Gold Plan" | "Silver Plan" | "Bronze Plan"
  credits: string
  usage: string
  approvals: number
  purchases: string
  listings: number
  status: "Active" | "Invited" | "Suspended"
  lastActive: string
}

type Team = {
  name: string
  lead: string
  members: number
  listings: number
  approvals: number
  plan: "Gold Plan" | "Silver Plan" | "Bronze Plan"
  credits: string
  usage: string
  purchases: string
  status: "Active" | "Planning"
}

type AIAgent = {
  name: string
  purpose: string
  ownerTeam: string
  model: string
  workflows: number
  automations: number
  successRate: string
  lastRun: string
  status: "Active" | "Paused" | "Draft"
}

const initialAgents: Agent[] = [
  {
    name: "Jamie Smith",
    email: "jamie@smithgroup.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Agent",
    team: "The Smith Group",
    scope: "Brokerage",
    plan: "Gold Plan",
    credits: "Unlimited staging",
    usage: "42%",
    approvals: 3,
    purchases: "$4,820",
    listings: 12,
    status: "Active",
    lastActive: "Today, 10:24 AM",
  },
  {
    name: "David Chen",
    email: "david.chen@smithgroup.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Team Lead",
    team: "The Smith Group",
    scope: "Team",
    plan: "Gold Plan",
    credits: "28 / 40 credits",
    usage: "70%",
    approvals: 1,
    purchases: "$6,140",
    listings: 18,
    status: "Active",
    lastActive: "Today, 8:15 AM",
  },
  {
    name: "Maria Garcia",
    email: "maria@oakavenue.com",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Agent",
    team: "Oak Avenue Realty",
    scope: "Brokerage",
    plan: "Gold Plan",
    credits: "22 / 30 credits",
    usage: "73%",
    approvals: 2,
    purchases: "$3,280",
    listings: 9,
    status: "Active",
    lastActive: "Yesterday, 4:35 PM",
  },
  {
    name: "James Wilson",
    email: "james@lifestyleliving.com",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Assistant",
    team: "Lifestyle Living",
    scope: "Team",
    plan: "Silver Plan",
    credits: "7 / 15 credits",
    usage: "47%",
    approvals: 0,
    purchases: "$940",
    listings: 5,
    status: "Active",
    lastActive: "Yesterday, 2:11 PM",
  },
  {
    name: "Sophie Lee",
    email: "sophie@coastviewrealty.com",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Agent",
    team: "Coastview Realty",
    scope: "Brokerage",
    plan: "Silver Plan",
    credits: "Pending allocation",
    usage: "0%",
    approvals: 1,
    purchases: "$0",
    listings: 6,
    status: "Invited",
    lastActive: "--",
  },
  {
    name: "Ryan Patel",
    email: "ryan@urbanhome.com",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Coordinator",
    team: "Urban Homes",
    scope: "Team",
    plan: "Bronze Plan",
    credits: "5 / 10 credits",
    usage: "50%",
    approvals: 0,
    purchases: "$620",
    listings: 3,
    status: "Active",
    lastActive: "May 8, 2026",
  },
  {
    name: "Laura Martinez",
    email: "laura@lifegroup.com",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&h=96&q=80",
    role: "Assistant",
    team: "The Smith Group",
    scope: "Team",
    plan: "Silver Plan",
    credits: "2 / 15 credits",
    usage: "13%",
    approvals: 0,
    purchases: "$280",
    listings: 2,
    status: "Suspended",
    lastActive: "Apr 12, 2026",
  },
]

const initialTeams: Team[] = [
  {
    name: "The Smith Group",
    lead: "David Chen",
    members: 14,
    listings: 28,
    approvals: 6,
    plan: "Gold Plan",
    credits: "40 monthly credits",
    usage: "70%",
    purchases: "$10,960",
    status: "Active",
  },
  {
    name: "Oak Avenue Realty",
    lead: "Maria Garcia",
    members: 9,
    listings: 16,
    approvals: 3,
    plan: "Gold Plan",
    credits: "30 monthly credits",
    usage: "73%",
    purchases: "$3,280",
    status: "Active",
  },
  {
    name: "Lifestyle Living",
    lead: "Amanda Clark",
    members: 7,
    listings: 11,
    approvals: 1,
    plan: "Silver Plan",
    credits: "15 monthly credits",
    usage: "47%",
    purchases: "$940",
    status: "Active",
  },
  {
    name: "Urban Homes",
    lead: "Kevin Wong",
    members: 6,
    listings: 9,
    approvals: 2,
    plan: "Bronze Plan",
    credits: "10 monthly credits",
    usage: "50%",
    purchases: "$620",
    status: "Active",
  },
  {
    name: "Coastview Realty",
    lead: "Sophie Lee",
    members: 8,
    listings: 12,
    approvals: 1,
    plan: "Silver Plan",
    credits: "Pending allocation",
    usage: "0%",
    purchases: "$0",
    status: "Planning",
  },
]

const initialAIAgents: AIAgent[] = [
  {
    name: "Listing Intake Agent",
    purpose: "Reads listing requests and drafts production scopes.",
    ownerTeam: "The Smith Group",
    model: "GPT-4.1",
    workflows: 8,
    automations: 14,
    successRate: "96%",
    lastRun: "Today, 11:42 AM",
    status: "Active",
  },
  {
    name: "Approval Follow-up Agent",
    purpose: "Nudges agents when proofs or deliverables are waiting.",
    ownerTeam: "Oak Avenue Realty",
    model: "GPT-4.1 mini",
    workflows: 5,
    automations: 9,
    successRate: "91%",
    lastRun: "Today, 9:18 AM",
    status: "Active",
  },
  {
    name: "Vendor Dispatch Agent",
    purpose: "Suggests vendors from availability, market, and service type.",
    ownerTeam: "Lifestyle Living",
    model: "GPT-4.1",
    workflows: 6,
    automations: 11,
    successRate: "88%",
    lastRun: "Yesterday, 5:08 PM",
    status: "Paused",
  },
  {
    name: "MLS Copy Agent",
    purpose: "Creates first-pass property descriptions and social captions.",
    ownerTeam: "Urban Homes",
    model: "GPT-4.1 mini",
    workflows: 4,
    automations: 7,
    successRate: "94%",
    lastRun: "Apr 27, 2026",
    status: "Active",
  },
  {
    name: "Plan Usage Analyst",
    purpose: "Finds credit overuse, stale invites, and allocation drift.",
    ownerTeam: "Brokerage",
    model: "GPT-4.1",
    workflows: 3,
    automations: 5,
    successRate: "--",
    lastRun: "--",
    status: "Draft",
  },
]

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function statusClass(status: string) {
  if (status === "Active") return "border-green-200 bg-green-50 text-green-700"
  if (status === "Invited" || status === "Planning") {
    return "border-blue-200 bg-blue-50 text-blue-700"
  }
  if (status === "Paused") return "border-amber-200 bg-amber-50 text-amber-700"
  if (status === "Draft") return "border-slate-200 bg-slate-50 text-slate-700"
  return "border-slate-200 bg-slate-50 text-slate-700"
}

function roleClass(role: string) {
  if (role === "Team Lead") return "border-blue-200 bg-blue-50 text-blue-700"
  if (role === "Coordinator") return "border-amber-200 bg-amber-50 text-amber-700"
  if (role === "Assistant") return "border-violet-200 bg-violet-50 text-violet-700"
  return "border-slate-200 bg-slate-50 text-slate-700"
}

function percentValue(value: string) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, 100)) : 0
}

export function AgentsPageShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const [agents, setAgents] = React.useState<Agent[]>(initialAgents)
  const [teams, setTeams] = React.useState<Team[]>(initialTeams)
  const [view, setView] = React.useState<"people" | "teams" | "ai">("people")
  const [displayMode, setDisplayMode] = React.useState<"list" | "grid">("list")
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [teamFilter, setTeamFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [accessFilter, setAccessFilter] = React.useState("all")
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(initialTeams[0])

  const filteredAgents = agents.filter((agent) => {
    const haystack = `${agent.name} ${agent.email} ${agent.team} ${agent.plan}`.toLowerCase()
    return (
      haystack.includes(query.toLowerCase()) &&
      (roleFilter === "all" || agent.role === roleFilter) &&
      (teamFilter === "all" || agent.team === teamFilter) &&
      (statusFilter === "all" || agent.status === statusFilter) &&
      (accessFilter === "all" || agent.scope === accessFilter)
    )
  })

  const filteredTeams = teams.filter((team) => {
    const haystack = `${team.name} ${team.lead} ${team.plan}`.toLowerCase()
    return (
      haystack.includes(query.toLowerCase()) &&
      (teamFilter === "all" || team.name === teamFilter) &&
      (statusFilter === "all" || team.status === statusFilter)
    )
  })

  const filteredAIAgents = initialAIAgents.filter((agent) => {
    const haystack = `${agent.name} ${agent.purpose} ${agent.ownerTeam} ${agent.model}`.toLowerCase()
    return (
      haystack.includes(query.toLowerCase()) &&
      (teamFilter === "all" || agent.ownerTeam === teamFilter || agent.ownerTeam === "Brokerage") &&
      (statusFilter === "all" || agent.status === statusFilter)
    )
  })

  const activeMembers = agents.filter((agent) => agent.status === "Active").length
  const openInvites = agents.filter((agent) => agent.status === "Invited").length
  const usedSeats = agents.length
  const seatLimit = 60
  const usedSeatPercent = Math.round((usedSeats / seatLimit) * 100)

  function handleInvite(agent: Agent) {
    setAgents((current) => [agent, ...current])
    setView("people")
  }

  function handleCreateTeam(team: Team) {
    setTeams((current) => [team, ...current])
    setSelectedTeam(team)
    setView("teams")
  }

  function handleSelectTeam(team: Team) {
    setSelectedTeam(team)
    setTeamFilter(team.name)
    setView("teams")
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
          <SiteHeader title="Agents" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <BlurFade>
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-normal">
                      Agents
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Manage brokerage members, teams, marketing purchases, plan
                      allocation, and usage.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <InviteMemberDialog
                      teams={teams}
                      onInvite={handleInvite}
                    />
                    <CreateTeamDialog onCreateTeam={handleCreateTeam} />
                  </div>
                </section>
              </BlurFade>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    icon: <UsersIcon className="size-5 text-red-600" />,
                    label: "Active Members",
                    value: `${activeMembers}`,
                    detail: `of ${seatLimit} seats`,
                    onClick: () => {
                      setStatusFilter("Active")
                      setView("people")
                    },
                  },
                  {
                    icon: <Building2Icon className="size-5 text-slate-700" />,
                    label: "Teams",
                    value: `${teams.length}`,
                    detail: "Across brokerage",
                    onClick: () => setView("teams"),
                  },
                  {
                    icon: <MailIcon className="size-5 text-amber-700" />,
                    label: "Open Invites",
                    value: `${openInvites}`,
                    detail: "Invitations pending",
                    onClick: () => {
                      setStatusFilter("Invited")
                      setView("people")
                    },
                  },
                  {
                    icon: <ShieldCheckIcon className="size-5 text-green-700" />,
                    label: "Seat Usage",
                    value: `${usedSeats} / ${seatLimit}`,
                    detail: `${usedSeatPercent}% utilized`,
                  },
                ].map((metric, index) => (
                  <BlurFade key={metric.label} delay={0.04 + index * 0.04}>
                    <MetricCard {...metric} />
                  </BlurFade>
                ))}
              </section>

              <BlurFade delay={0.12}>
                <section>
                <div className="min-w-0 rounded-lg border bg-card">
                  <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(220px,1fr)_repeat(4,150px)]">
                    <div className="relative">
                      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by name, email, team, or plan..."
                      />
                    </div>
                    <FilterSelect
                      label="Role"
                      value={roleFilter}
                      onValueChange={setRoleFilter}
                      options={[
                        ["all", "All roles"],
                        ["Agent", "Agents"],
                        ["Team Lead", "Team Leads"],
                        ["Assistant", "Assistants"],
                        ["Coordinator", "Coordinators"],
                      ]}
                      disabled={view !== "people"}
                    />
                    <FilterSelect
                      label="Team"
                      value={teamFilter}
                      onValueChange={setTeamFilter}
                      options={[
                        ["all", "All teams"],
                        ...teams.map((team) => [team.name, team.name] as const),
                      ]}
                    />
                    <FilterSelect
                      label="Status"
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      options={[
                        ["all", "All status"],
                        ["Active", "Active"],
                        ["Invited", "Invited"],
                        ["Suspended", "Suspended"],
                        ["Planning", "Planning"],
                        ["Paused", "Paused"],
                        ["Draft", "Draft"],
                      ]}
                    />
                    <FilterSelect
                      label="Access"
                      value={accessFilter}
                      onValueChange={setAccessFilter}
                      options={[
                        ["all", "All access"],
                        ["Brokerage", "Brokerage"],
                        ["Team", "Team"],
                      ]}
                      disabled={view !== "people"}
                    />
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <Tabs
                      value={view}
                      onValueChange={(nextValue) =>
                        setView(nextValue as "people" | "teams" | "ai")
                      }
                    >
                      <TabsList>
                        <TabsTrigger value="people">
                          People
                          <Badge variant="secondary">{filteredAgents.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="teams">
                          Teams
                          <Badge variant="secondary">{filteredTeams.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="ai">
                          AI Agents
                          <Badge variant="secondary">{filteredAIAgents.length}</Badge>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-2">
                      {view !== "ai" ? (
                        <ToggleGroup
                          multiple={false}
                          value={[displayMode]}
                          onValueChange={(value) => {
                            const nextValue = value[0]
                            if (nextValue === "list" || nextValue === "grid") {
                              setDisplayMode(nextValue)
                            }
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <ToggleGroupItem value="list" aria-label="List view">
                            <ListIcon data-icon="inline-start" />
                            List
                          </ToggleGroupItem>
                          <ToggleGroupItem value="grid" aria-label="Grid view">
                            <Grid2X2Icon data-icon="inline-start" />
                            Grid
                          </ToggleGroupItem>
                        </ToggleGroup>
                      ) : null}
                      <Button variant="outline" size="sm">
                        <DownloadIcon data-icon="inline-start" />
                        Export {view === "people" ? "people" : view === "teams" ? "teams" : "AI agents"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery("")
                          setRoleFilter("all")
                          setTeamFilter("all")
                          setStatusFilter("all")
                          setAccessFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                      <Button variant="outline" size="icon" className="size-8">
                        <EllipsisIcon />
                        <span className="sr-only">Open table actions</span>
                      </Button>
                    </div>
                  </div>

                  {view === "people" && displayMode === "grid" ? (
                    <PeopleGrid agents={filteredAgents} />
                  ) : view === "people" ? (
                    <PeopleTable agents={filteredAgents} />
                  ) : view === "teams" && displayMode === "grid" ? (
                    <TeamsGrid
                      teams={filteredTeams}
                      selectedTeam={selectedTeam}
                      onSelectTeam={setSelectedTeam}
                    />
                  ) : view === "teams" ? (
                    <TeamsTable
                      teams={filteredTeams}
                      selectedTeam={selectedTeam}
                      onSelectTeam={setSelectedTeam}
                    />
                  ) : (
                    <AIAgentsTable agents={filteredAIAgents} />
                  )}
                  <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
                    <span>
                      Showing{" "}
                      {view === "people"
                        ? filteredAgents.length
                        : view === "teams"
                          ? filteredTeams.length
                          : filteredAIAgents.length}{" "}
                      of{" "}
                      {view === "people"
                        ? agents.length
                        : view === "teams"
                          ? teams.length
                          : initialAIAgents.length}{" "}
                      {view === "people" ? "members" : view === "teams" ? "teams" : "AI agents"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-8">
                        1
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        2
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        3
                      </Button>
                    </div>
                  </div>
                </div>
                </section>
              </BlurFade>

              <BlurFade delay={0.18} inView>
                <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-normal">
                    Team Structure
                  </h2>
                  <Button variant="link" className="h-auto px-0" onClick={() => setView("teams")}>
                    Open teams tab
                    <ArrowRightIcon />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.name}
                      team={team}
                      selected={selectedTeam.name === team.name}
                      onSelect={handleSelectTeam}
                    />
                  ))}
                </div>
                </section>
              </BlurFade>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function PeopleTable({ agents }: { agents: Agent[] }) {
  const [selected, setSelected] = React.useState<string[]>([])
  const allSelected = agents.length > 0 && selected.length === agents.length

  function toggleAll(checked: boolean) {
    setSelected(checked ? agents.map((agent) => agent.email) : [])
  }

  function toggleRow(email: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, email] : current.filter((item) => item !== email)
    )
  }

  return (
    <div className="overflow-auto border-t">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="w-10" />
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                aria-label="Select all members"
              />
            </TableHead>
            <TableHead className="min-w-64">Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="min-w-40">Team</TableHead>
            <TableHead className="min-w-36">Plan Access</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Approvals</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="min-w-32">Last Active</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.email} className="cursor-pointer hover:bg-muted/40">
              <TableCell>
                <RowDragHandle label={`Drag ${agent.name}`} />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selected.includes(agent.email)}
                  onCheckedChange={(checked) =>
                    toggleRow(agent.email, Boolean(checked))
                  }
                  aria-label={`Select ${agent.name}`}
                />
              </TableCell>
              <TableCell>
                <AgentDetailSheet agent={agent}>
                  <button className="flex w-full items-center gap-3 text-left">
                    <Avatar>
                      <AvatarImage src={agent.image} alt={agent.name} />
                      <AvatarFallback>{initialsFor(agent.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-semibold underline-offset-4 hover:underline">
                        {agent.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {agent.email}
                      </div>
                    </div>
                  </button>
                </AgentDetailSheet>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={roleClass(agent.role)}>
                  {agent.role}
                </Badge>
              </TableCell>
              <TableCell>{agent.team}</TableCell>
              <TableCell>
                <div className="font-medium">{agent.scope}</div>
                <div className="text-xs text-muted-foreground">{agent.plan}</div>
              </TableCell>
              <TableCell>{agent.credits}</TableCell>
              <TableCell>
                <UsageBar value={agent.usage} />
              </TableCell>
              <TableCell>
                <span className={agent.approvals > 0 ? "font-medium text-red-600" : undefined}>
                  {agent.approvals}
                </span>
              </TableCell>
              <TableCell>{agent.purchases}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClass(agent.status)}>
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{agent.lastActive}</TableCell>
              <TableCell>
                <AgentDetailSheet agent={agent}>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open member details</span>
                  </Button>
                </AgentDetailSheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PeopleGrid({ agents }: { agents: Agent[] }) {
  return (
    <div className="grid gap-3 border-t p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {agents.map((agent) => (
        <AgentDetailSheet key={agent.email} agent={agent}>
          <button className="flex min-h-56 flex-col rounded-lg border bg-card p-4 text-left transition hover:bg-muted/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-11">
                  <AvatarImage src={agent.image} alt={agent.name} />
                  <AvatarFallback>{initialsFor(agent.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{agent.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {agent.email}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={statusClass(agent.status)}>
                {agent.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" className={roleClass(agent.role)}>
                  {agent.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Team</span>
                <span className="truncate font-medium">{agent.team}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Access</span>
                <span className="font-medium">{agent.scope}</span>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-3 pt-5 text-sm">
              <TeamStat label="Listings" value={`${agent.listings}`} />
              <TeamStat
                label="Approvals"
                value={`${agent.approvals}`}
                alert={agent.approvals > 0}
              />
              <TeamStat label="Usage" value={agent.usage} />
            </div>
          </button>
        </AgentDetailSheet>
      ))}
    </div>
  )
}

function TeamsTable({
  teams,
  selectedTeam,
  onSelectTeam,
}: {
  teams: Team[]
  selectedTeam: Team
  onSelectTeam: (team: Team) => void
}) {
  const [selected, setSelected] = React.useState<string[]>([])
  const allSelected = teams.length > 0 && selected.length === teams.length

  function toggleAll(checked: boolean) {
    setSelected(checked ? teams.map((team) => team.name) : [])
  }

  function toggleRow(name: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, name] : current.filter((item) => item !== name)
    )
  }

  return (
    <div className="overflow-auto border-t">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="w-10" />
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                aria-label="Select all teams"
              />
            </TableHead>
            <TableHead className="min-w-64">Team</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Listings</TableHead>
            <TableHead>Approvals</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow
              key={team.name}
              className={`cursor-pointer hover:bg-muted/40 ${
                selectedTeam.name === team.name ? "bg-red-50/60" : ""
              }`}
              onClick={() => onSelectTeam(team)}
            >
              <TableCell>
                <RowDragHandle label={`Drag ${team.name}`} />
              </TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  checked={selected.includes(team.name)}
                  onCheckedChange={(checked) =>
                    toggleRow(team.name, Boolean(checked))
                  }
                  aria-label={`Select ${team.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initialsFor(team.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{team.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      Marketing plan allocation
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{team.lead}</TableCell>
              <TableCell>{team.members}</TableCell>
              <TableCell>{team.listings}</TableCell>
              <TableCell>
                <span className={team.approvals > 0 ? "font-medium text-red-600" : undefined}>
                  {team.approvals}
                </span>
              </TableCell>
              <TableCell>{team.plan}</TableCell>
              <TableCell>{team.credits}</TableCell>
              <TableCell>
                <UsageBar value={team.usage} />
              </TableCell>
              <TableCell>{team.purchases}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClass(team.status)}>
                  {team.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open team details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TeamsGrid({
  teams,
  selectedTeam,
  onSelectTeam,
}: {
  teams: Team[]
  selectedTeam: Team
  onSelectTeam: (team: Team) => void
}) {
  return (
    <div className="grid gap-3 border-t p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {teams.map((team) => (
        <TeamCard
          key={team.name}
          team={team}
          selected={selectedTeam.name === team.name}
          onSelect={onSelectTeam}
        />
      ))}
    </div>
  )
}

function TeamCard({
  team,
  selected,
  onSelect,
}: {
  team: Team
  selected: boolean
  onSelect: (team: Team) => void
}) {
  return (
    <button
      className={`h-full min-h-48 rounded-lg border bg-card p-4 text-left transition hover:bg-muted/40 ${
        selected ? "border-red-300 bg-red-50/60" : ""
      }`}
      onClick={() => onSelect(team)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            <AvatarFallback>{initialsFor(team.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-semibold">{team.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              Team Lead: {team.lead}
            </div>
          </div>
        </div>
        <Badge variant="outline" className={statusClass(team.status)}>
          {team.status}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <TeamStat label="Members" value={`${team.members}`} />
        <TeamStat label="Listings" value={`${team.listings}`} />
        <TeamStat
          label="Approvals"
          value={`${team.approvals}`}
          alert={team.approvals > 0}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{team.plan}</span>
        <span className="inline-flex items-center gap-1 font-medium">
          View team
          <ArrowRightIcon data-icon="inline-end" />
        </span>
      </div>
    </button>
  )
}

function AIAgentsTable({ agents }: { agents: AIAgent[] }) {
  const [selected, setSelected] = React.useState<string[]>([])
  const allSelected = agents.length > 0 && selected.length === agents.length

  function toggleAll(checked: boolean) {
    setSelected(checked ? agents.map((agent) => agent.name) : [])
  }

  function toggleRow(name: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, name] : current.filter((item) => item !== name)
    )
  }

  return (
    <div className="overflow-auto border-t">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="w-10" />
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                aria-label="Select all AI agents"
              />
            </TableHead>
            <TableHead className="min-w-72">AI Agent</TableHead>
            <TableHead className="min-w-40">Owner</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Workflows</TableHead>
            <TableHead>Automations</TableHead>
            <TableHead>Success</TableHead>
            <TableHead className="min-w-32">Last Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.name} className="cursor-pointer hover:bg-muted/40">
              <TableCell>
                <RowDragHandle label={`Drag ${agent.name}`} />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selected.includes(agent.name)}
                  onCheckedChange={(checked) =>
                    toggleRow(agent.name, Boolean(checked))
                  }
                  aria-label={`Select ${agent.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <BotIcon className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{agent.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {agent.purpose}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{agent.ownerTeam}</TableCell>
              <TableCell>{agent.model}</TableCell>
              <TableCell>{agent.workflows}</TableCell>
              <TableCell>{agent.automations}</TableCell>
              <TableCell>
                <div className="flex min-w-24 items-center gap-2">
                  <UsageBar value={agent.successRate} />
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{agent.lastRun}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClass(agent.status)}>
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open AI agent details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RowDragHandle({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 cursor-grab text-muted-foreground hover:bg-transparent active:cursor-grabbing"
      aria-label={label}
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
    </Button>
  )
}

function InviteMemberDialog({
  teams,
  onInvite,
}: {
  teams: Team[]
  onInvite: (agent: Agent) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [team, setTeam] = React.useState(teams[0]?.name ?? "")
  const [role, setRole] = React.useState<Agent["role"]>("Agent")
  const [plan, setPlan] = React.useState<Agent["plan"]>("Silver Plan")
  const [scope, setScope] = React.useState<Agent["scope"]>("Team")
  const [credits, setCredits] = React.useState("10 monthly credits")
  const selectedTeam = teams.some((item) => item.name === team)
    ? team
    : teams[0]?.name ?? ""

  function submitInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !email.trim()) return

    onInvite({
      name: name.trim(),
      email: email.trim(),
      image: "",
      role,
      team: selectedTeam,
      scope,
      plan,
      credits,
      usage: "0%",
      approvals: 0,
      purchases: "$0",
      listings: 0,
      status: "Invited",
      lastActive: "--",
    })
    setName("")
    setEmail("")
    setCredits("10 monthly credits")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlusIcon />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitInvite} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Add an agent, assistant, or coordinator and allocate marketing access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" />
            </Field>
            <Field label="Email">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="alex@brokerage.com" />
            </Field>
            <Field label="Team">
              <SimpleSelect
                value={selectedTeam}
                onValueChange={setTeam}
                options={teams.map((item) => [item.name, item.name] as const)}
              />
            </Field>
            <Field label="Role">
              <SimpleSelect
                value={role}
                onValueChange={(value) => setRole(value as Agent["role"])}
                options={[
                  ["Agent", "Agent"],
                  ["Team Lead", "Team Lead"],
                  ["Assistant", "Assistant"],
                  ["Coordinator", "Coordinator"],
                ]}
              />
            </Field>
            <Field label="Plan">
              <SimpleSelect
                value={plan}
                onValueChange={(value) => setPlan(value as Agent["plan"])}
                options={[
                  ["Gold Plan", "Gold Plan"],
                  ["Silver Plan", "Silver Plan"],
                  ["Bronze Plan", "Bronze Plan"],
                ]}
              />
            </Field>
            <Field label="Access scope">
              <SimpleSelect
                value={scope}
                onValueChange={(value) => setScope(value as Agent["scope"])}
                options={[
                  ["Brokerage", "Brokerage"],
                  ["Team", "Team"],
                ]}
              />
            </Field>
            <Field label="Credits">
              <Input value={credits} onChange={(event) => setCredits(event.target.value)} />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateTeamDialog({ onCreateTeam }: { onCreateTeam: (team: Team) => void }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [lead, setLead] = React.useState("")
  const [plan, setPlan] = React.useState<Team["plan"]>("Gold Plan")
  const [credits, setCredits] = React.useState("25 monthly credits")
  const [notes, setNotes] = React.useState("")

  function submitTeam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !lead.trim()) return

    onCreateTeam({
      name: name.trim(),
      lead: lead.trim(),
      members: 1,
      listings: 0,
      approvals: 0,
      plan,
      credits,
      usage: "0%",
      purchases: "$0",
      status: "Planning",
    })
    setName("")
    setLead("")
    setCredits("25 monthly credits")
    setNotes("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <UsersIcon />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitTeam} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Set up a team-level marketing budget, plan, and usage tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team name">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Harbor Estates" />
            </Field>
            <Field label="Team lead">
              <Input value={lead} onChange={(event) => setLead(event.target.value)} placeholder="Jordan Lee" />
            </Field>
            <Field label="Plan">
              <SimpleSelect
                value={plan}
                onValueChange={(value) => setPlan(value as Team["plan"])}
                options={[
                  ["Gold Plan", "Gold Plan"],
                  ["Silver Plan", "Silver Plan"],
                  ["Bronze Plan", "Bronze Plan"],
                ]}
              />
            </Field>
            <Field label="Credits">
              <Input value={credits} onChange={(event) => setCredits(event.target.value)} />
            </Field>
          </div>
          <Field label="Allocation notes">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Team launch budget, print approvals, or special plan terms"
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border bg-card p-5 text-left transition hover:bg-muted/40 disabled:pointer-events-none"
      disabled={!onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <div className="text-xs font-medium uppercase text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
      </div>
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: readonly (readonly [string, string])[]
  disabled?: boolean
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onValueChange(nextValue)
        }
      }}
      items={options.map(([optionValue, optionLabel]) => ({
        value: optionValue,
        label: optionLabel,
      }))}
    >
      <SelectTrigger disabled={disabled}>
        <span className="text-xs text-muted-foreground">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SimpleSelect({
  value,
  onValueChange,
  options,
}: {
  value: string
  onValueChange: (value: string) => void
  options: readonly (readonly [string, string])[]
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onValueChange(nextValue)
        }
      }}
      items={options.map(([optionValue, optionLabel]) => ({
        value: optionValue,
        label: optionLabel,
      }))}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function AgentDetailSheet({
  agent,
  children,
}: {
  agent: Agent
  children: React.ReactElement
}) {
  return (
    <Sheet>
      <SheetTrigger render={children} />
      <SheetContent className="w-[min(520px,calc(100vw-2rem))] rounded-l-3xl sm:max-w-none">
        <SheetHeader className="border-b p-6">
          <div className="flex items-start gap-4 pr-8">
            <Avatar className="size-16">
              <AvatarImage src={agent.image} alt={agent.name} />
              <AvatarFallback>{initialsFor(agent.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl">{agent.name}</SheetTitle>
                <Badge variant="outline" className={statusClass(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {agent.role} / Member since Feb 14, 2023
              </p>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <DetailSection
            title="Contact"
            rows={[
              ["Email", agent.email],
              ["Phone", "214.555.0198"],
              ["Market", "Dallas, TX"],
            ]}
          />
          <DetailSection
            title="Team & Role"
            rows={[
              ["Team", agent.team],
              ["Role", agent.role],
              ["Reports to", agent.role === "Team Lead" ? "Brokerage Admin" : "David Chen"],
            ]}
          />
          <DetailSection
            title="Plan & Access"
            rows={[
              ["Access scope", agent.scope],
              ["Plan", agent.plan],
              ["Assigned credits", agent.credits],
              ["Account terms", "60 days"],
            ]}
          />
          <div className="border-t p-6">
            <h3 className="text-xs font-medium uppercase text-muted-foreground">
              Permissions
            </h3>
            <div className="mt-3 grid gap-2 text-sm">
              {[
                "Place and manage orders",
                "Access media and deliverables",
                "Approve proofs and deliverables",
                "Manage team members",
              ].map((permission) => (
                <div key={permission} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-green-700" />
                  <span>{permission}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-3 h-auto px-0">
              View full permissions
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
        <SheetFooter className="border-t p-6">
          <Button variant="outline">Edit Access</Button>
          <Button variant="destructive">Deactivate</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function DetailSection({
  title,
  rows,
}: {
  title: string
  rows: [string, string][]
}) {
  return (
    <div className="border-t p-5">
      <h3 className="text-xs font-medium uppercase text-muted-foreground">
        {title}
      </h3>
      <div className="mt-3 grid gap-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageBar({ value }: { value: string }) {
  return (
    <div className="flex min-w-24 items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${percentValue(value)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  )
}

function TeamStat({
  label,
  value,
  alert = false,
}: {
  label: string
  value: string
  alert?: boolean
}) {
  return (
    <div>
      <div className={`text-xl font-semibold ${alert ? "text-red-600" : ""}`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
