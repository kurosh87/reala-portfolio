import {
  ArrowLeft,
  Building2,
  Camera,
  CalendarPlus,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Globe2,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  NotebookPen,
  Phone,
  Plus,
  Send,
  Sparkles,
  Smartphone,
  Timer,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChatHeader } from "@/components/chat/chat-header";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ChatLaunchContext } from "@/lib/chat-launch";
import { cn } from "@/lib/utils";

const readonlyVisibility: VisibilityType = "private";

const detailTabs = [
  { label: "SMS", value: "sms" },
  { label: "Deal Info", value: "deal-info" },
  { label: "Documents", value: "documents" },
  { label: "Assessment", value: "assessment" },
  { label: "Notes", value: "notes" },
  { label: "Tasks", value: "tasks" },
  { label: "Emails", value: "emails" },
] as const;

type DetailTab = (typeof detailTabs)[number]["value"];

const smsTranscript = [
  {
    speaker: "Alex",
    time: "09:00:08 AM",
    body: "Hi Amelia, this is Alex with Reala. I saw your request come in about Oakridge. Are you hoping to see it this week or compare similar homes first?",
  },
  {
    speaker: "Amelia Frost",
    time: "09:01:14 AM",
    body: "Hi Alex. We want to see it as soon as possible, ideally today after work.",
  },
  {
    speaker: "Alex",
    time: "09:01:39 AM",
    body: "Got it. I can look for a 6:30 PM slot. Before I ask for the showing, are you already pre-approved or still working through financing?",
  },
  {
    speaker: "Amelia Frost",
    time: "09:03:02 AM",
    body: "Pre-approved up to about 1.25, but we'd like to stay lower if possible.",
  },
  {
    speaker: "Alex",
    time: "09:03:28 AM",
    body: "That helps. Oakridge is within range. Are schools and commute the main reasons you're looking there?",
  },
  {
    speaker: "Amelia Frost",
    time: "09:05:10 AM",
    body: "Schools, commute, and we need a finished basement. My partner may need to join by video if that is allowed.",
  },
  {
    speaker: "Alex",
    time: "09:05:36 AM",
    body: "Perfect. I’ll flag the video question for approval and hold the next step until we confirm. If approved, I’ll send the address, parking notes, and the showing confirmation here.",
  },
] as const;

const speedToLeadCadence = [
  { label: "First reply", value: "8 sec" },
  { label: "Qualification question", value: "91 sec" },
  { label: "Budget captured", value: "3 min" },
  { label: "Motivation captured", value: "5 min" },
  { label: "Approval pause", value: "5m 36s" },
] as const;

const leadNotes = [
  {
    author: "You",
    body: "Keep the showing focused on finished basement quality, commute timing, and school catchment. Amelia wants speed, but she is budget-sensitive.",
    source: "Manual note",
    time: "Today 09:18 AM",
    type: "realtor",
  },
  {
    author: "Alex",
    body: "From SMS: Amelia is pre-approved up to $1.25M and wants to stay lower if possible. Partner may need to join the showing by video.",
    source: "Extracted from SMS",
    time: "Today 09:06 AM",
    type: "ai",
  },
  {
    author: "Alex",
    body: "Suggested next move: confirm whether video attendance is allowed before sending showing details. Hold the 6:30 PM slot if available.",
    source: "AI recommendation",
    time: "Today 09:05 AM",
    type: "ai",
  },
  {
    author: "You",
    body: "If the showing lands well, prepare a below-max offer range and comparable sales note before the second follow-up.",
    source: "Manual note",
    time: "Today 08:58 AM",
    type: "realtor",
  },
] as const;

const leads = [
  {
    id: "maya-chen",
    code: "LEAD-2041",
    name: "Maya Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
    createdOn: "17 Apr, 2026",
    lastActivity: "20 Apr, 2026 at 09:00AM",
    stage: "Requested",
    label: "Showing",
    channel: "SMS",
    source: "Realtor.ca",
    priority: "Hot",
    responseSeconds: 23,
    loanPurpose: "Oakridge showing",
    amount: "$1,250,000",
    recentActivity: [
      {
        avatar: "AA",
        isAi: true,
        title: "Alex tagged you in a comment",
        time: "Today 12:00 PM",
        detail: "Needs approval to confirm whether Maya's partner can join by video.",
      },
      {
        avatar: "MC",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
        title: "Maya shared offer-timing context",
        time: "Today 10:30 AM",
        detail: "New -> In progress",
      },
      {
        avatar: "AI",
        isAi: true,
        title: "Alex drafted the confirmation",
        time: "Today 09:00 AM",
        detail: "Ready for review",
      },
    ],
    tasks: [
      {
        done: true,
        title: "Share showing confirmation",
        detail: "Confirm the 6:30 PM slot and add parking notes.",
        owner: "You",
        due: "Today 12:00 PM",
        action: "Priority",
      },
      {
        done: false,
        title: "Confirm remote partner attendance",
        detail: "Check whether video attendance works for this listing.",
        owner: "Alex",
        due: "Today 12:00 PM",
        action: "Important",
      },
      {
        done: false,
        title: "Prepare offer strategy handoff",
        detail: "Have a short next-step plan ready if the showing goes well.",
        owner: "You",
        due: "Tomorrow 09:00 AM",
        action: "Reminder",
      },
    ],
  },
  {
    id: "avery-singh",
    code: "LEAD-1983",
    name: "Avery Singh",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
    createdOn: "17 Apr, 2026",
    lastActivity: "20 Apr, 2026 at 08:48AM",
    stage: "Qualified",
    label: "Buyer",
    channel: "Email",
    source: "Instagram",
    priority: "Warm",
    responseSeconds: 31,
    loanPurpose: "Relocation buyer",
    amount: "$900,000",
    recentActivity: [
      {
        avatar: "AA",
        isAi: true,
        title: "Alex qualified budget and timing",
        time: "Today 08:48 AM",
        detail: "Pre-approved and moving in June.",
      },
    ],
    tasks: [
      {
        done: true,
        title: "Send neighborhood shortlist",
        detail: "Narrow to two west-end condo buildings.",
        owner: "Alex",
        due: "Today 11:00 AM",
        action: "Priority",
      },
    ],
  },
  {
    id: "jordan-velasco",
    code: "LEAD-1874",
    name: "Jordan Velasco",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80",
    createdOn: "16 Apr, 2026",
    lastActivity: "20 Apr, 2026 at 08:35AM",
    stage: "Needs follow-up",
    label: "Buyer",
    channel: "Phone",
    source: "Website",
    priority: "Hot",
    responseSeconds: 52,
    loanPurpose: "Condo offer strategy",
    amount: "$650,000",
    recentActivity: [
      {
        avatar: "JV",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
        title: "Jordan asked about offer terms",
        time: "Today 08:35 AM",
        detail: "Needs a financing-aware answer before next showing.",
      },
    ],
    tasks: [
      {
        done: false,
        title: "Call Jordan about financing conditions",
        detail: "Walk through lender-friendly building constraints.",
        owner: "You",
        due: "Today 12:00 PM",
        action: "Important",
      },
    ],
  },
] as const;

const fallbackLead = {
  recentActivity: [
    {
      avatar: "AI",
      isAi: true,
      title: "Alex captured the lead",
      time: "Today 09:00 AM",
      detail: "Lead context is ready for review.",
    },
  ],
  tasks: [
    {
      done: false,
      title: "Review lead context",
      detail: "Open the thread and decide the next best action.",
      owner: "You",
      due: "Today 12:00 PM",
      action: "Reminder",
    },
  ],
};

function titleizeLeadId(id: string) {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export default async function LeadDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = detailTabs.some((item) => item.value === tab)
    ? (tab as DetailTab)
    : "sms";
  const lead =
    leads.find((item) => item.id === id) ??
    {
      ...leads[0],
      ...fallbackLead,
      id,
      code: `LEAD-${id.slice(-4).toUpperCase()}`,
      name: id.startsWith("manual-") ? "Manual lead" : titleizeLeadId(id),
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
      label: "Buyer",
      source: "Website",
      stage: "Requested",
    };
  const leadLaunchContext: ChatLaunchContext = {
    scopeType: "record",
    entityType: "lead",
    entityId: lead.id,
    title: lead.name,
    route: `/leads/${lead.id}`,
    snapshot: {
      code: lead.code,
      source: lead.source,
      stage: lead.stage,
      channel: lead.channel,
      label: lead.label,
      inquiry: lead.loanPurpose,
      lastActivity: lead.lastActivity,
    },
    filters: null,
    timeRange: null,
    selectedView: activeTab,
    sourceApp: "crm",
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/leads", label: "Leads" },
          { label: lead.name },
        ]}
        chatId={`lead-${lead.id}`}
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-muted/40 text-foreground md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 dark:bg-background">
        <div className="min-h-full w-full bg-background dark:bg-[#090909]">
          <header className="border-border border-b bg-muted/20 px-5 py-2.5 md:px-8 dark:bg-[#111111]">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 text-sm">
                <Button asChild className="size-9 rounded-full" size="icon-sm" variant="ghost">
                  <Link href="/leads">
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
                <span className="font-semibold">Active Leads</span>
                <span className="text-muted-foreground">›</span>
                <span className="text-muted-foreground">{lead.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Last Activity</span>
                <span className="font-semibold">{lead.lastActivity}</span>
              </div>
            </div>
          </header>

          <section className="border-border border-b bg-card px-5 py-8 md:px-8 dark:bg-[#101010]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div
                  aria-label={`Change ${lead.name} image`}
                  className="group/avatar-edit relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  role="button"
                  tabIndex={0}
                  title="Change lead image"
                >
                  <Avatar className="border border-border bg-muted text-foreground" size="lg">
                    <AvatarImage alt={lead.name} src={lead.avatarUrl} />
                    <AvatarFallback>{lead.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    <AvatarBadge />
                  </Avatar>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover/avatar-edit:opacity-100 group-focus-visible/avatar-edit:opacity-100">
                    <Camera className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="-bottom-1 -right-1 absolute flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors group-hover/avatar-edit:bg-foreground group-hover/avatar-edit:text-background">
                    <Camera className="size-3.5" strokeWidth={1.8} />
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Created On: <span className="font-semibold text-foreground">{lead.createdOn}</span>
                  </p>
                </div>
              </div>

              <ButtonGroup aria-label={`${lead.name} contact actions`} className="flex-wrap">
                <ContextualChatLauncher
                  buttonLabel="Ask Alex"
                  buttonVariant="default"
                  context={leadLaunchContext}
                />
                <Button className="min-w-28" size="lg" variant="outline">
                  <Mail data-icon="inline-start" />
                  Mail
                </Button>
                <Button className="min-w-28" size="lg" variant="outline">
                  <Phone data-icon="inline-start" />
                  Call
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="More lead actions"
                      size="icon-lg"
                      title="More lead actions"
                      variant="outline"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Send />
                        Draft next SMS
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CalendarPlus />
                        Schedule showing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ClipboardCheck />
                        Create follow-up task
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Users />
                        Assign owner
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ChartNoAxesColumnIncreasing />
                        View lead score
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            </div>
          </section>

          <div className="overflow-x-auto border-border border-b bg-muted/30 px-5 md:px-8 dark:bg-[#0c0c0c]">
            <Tabs value={activeTab}>
              <TabsList className="min-w-max border-b-0" variant="line">
                {detailTabs.map((item) => {
                  const href =
                    item.value === "sms"
                      ? `/leads/${lead.id}`
                      : `/leads/${lead.id}?tab=${item.value}`;

                  return (
                    <TabsTrigger asChild key={item.value} value={item.value}>
                      <Link href={href}>
                        {item.label}
                        {item.value === "tasks" ? (
                          <span className="ml-1.5 rounded-full bg-foreground px-2 py-0.5 text-background text-xs">
                            7
                          </span>
                        ) : null}
                      </Link>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid min-h-[680px] bg-background dark:bg-[#080808] lg:grid-cols-[320px_1fr]">
            <aside className="border-border border-r bg-muted/20 px-5 py-8 md:px-8 dark:bg-[#0d0d0d]">
              <p className="text-muted-foreground text-xs uppercase">Recent Activity</p>
              <div className="mt-6 space-y-7">
                {lead.recentActivity.map((item) => (
                  <div className="flex gap-4" key={item.title}>
                    <Avatar className="border border-border bg-muted text-foreground" size="sm">
                      {"avatarUrl" in item && item.avatarUrl ? (
                        <AvatarImage alt={item.title} src={item.avatarUrl} />
                      ) : null}
                      <AvatarFallback
                        className={
                          "isAi" in item && item.isAi
                            ? "bg-[linear-gradient(135deg,#1f2937,#312e81)] text-white"
                            : undefined
                        }
                      >
                        {"isAi" in item && item.isAi ? (
                          <Sparkles className="size-4" strokeWidth={1.8} />
                        ) : (
                          item.avatar
                        )}
                      </AvatarFallback>
                      {"isAi" in item && item.isAi ? (
                        <AvatarBadge className="bg-sky-400" />
                      ) : null}
                    </Avatar>
                    <div>
                      <p className="font-medium leading-6">{item.title}</p>
                      <p className="mt-1 text-muted-foreground text-sm">{item.time}</p>
                      <p className="mt-3 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-border border-t pt-8">
                <p className="text-muted-foreground text-xs uppercase">Lead Info</p>
                <InfoRow icon={Building2} label="Lead Purpose" value={lead.loanPurpose} />
                <InfoRow icon={CircleDollarSign} label="Budget" value={lead.amount} />
                <InfoRow icon={Globe2} label="Source" value={lead.source} />
                <InfoRow icon={Smartphone} label="Channel" value={lead.channel} />
              </div>
            </aside>

            <section className="bg-background px-5 py-8 md:px-8 dark:bg-[#0a0a0a]">
              {activeTab === "sms" ? <SmsPanel leadName={lead.name} /> : null}
              {activeTab === "notes" ? <NotesPanel /> : null}
              {activeTab === "tasks" ? <TasksPanel tasks={lead.tasks} /> : null}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function SmsPanel({ leadName }: { leadName: string }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-border bg-card shadow-sm dark:bg-[#111111]">
        <div className="border-border border-b bg-muted/20 px-6 py-5 dark:bg-[#151515]">
          <p className="text-muted-foreground text-sm">Primary conversation</p>
          <h2 className="mt-2 text-2xl font-semibold">SMS transcript</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            Speed-to-lead cadence from Alex, including the qualification loop and the approval pause.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          {smsTranscript.map((message) => {
            const isAlex = message.speaker === "Alex";

            return (
              <div
                className={cn("flex", isAlex ? "justify-end" : "justify-start")}
                key={`${message.speaker}-${message.time}`}
              >
                <div
                  className={cn(
                    "max-w-[720px] rounded-lg border px-5 py-4",
                    isAlex
                      ? "border-blue-500/20 bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--muted)/0.72)_48%,rgba(99,102,241,0.16))] text-foreground shadow-sm dark:border-blue-400/20 dark:bg-[linear-gradient(135deg,#202020,#171923_52%,rgba(88,80,236,0.24))]"
                      : "border-border bg-muted/55 text-foreground shadow-sm dark:bg-[#171717]"
                  )}
                >
                  <div className="flex items-center justify-between gap-5 text-xs">
                    <span className="font-semibold">{message.speaker}</span>
                    <span className="text-muted-foreground">
                      {message.time}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6">{message.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-border border-t bg-muted/20 px-6 py-5 dark:bg-[#121212]">
          <Button className="rounded-lg" variant="outline">
            <Send className="size-4" />
            Draft next SMS
          </Button>
        </div>
      </section>

      <aside className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
        <p className="text-muted-foreground text-xs uppercase">Speed to lead</p>
        <h3 className="mt-2 text-xl font-semibold">{leadName}</h3>
        <div className="mt-6 space-y-4">
          {speedToLeadCadence.map((item) => (
            <div className="flex items-center justify-between border-border border-b pb-4" key={item.label}>
              <span className="text-muted-foreground text-sm">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="font-semibold text-emerald-600 dark:text-emerald-300">
            5 back-and-forth touches completed
          </p>
          <p className="mt-2 text-muted-foreground text-sm">
            Alex captured timing, budget, motivation, and video-attendance needs before pausing for approval.
          </p>
        </div>
      </aside>
    </div>
  );
}

function TasksPanel({
  tasks,
}: {
  tasks: ReadonlyArray<{
    action: string;
    detail: string;
    done: boolean;
    due: string;
    owner: string;
    title: string;
  }>;
}) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Upcoming Tasks</h2>
        <Button className="rounded-lg border-foreground bg-card text-foreground hover:bg-muted dark:bg-[#161616]" variant="outline">
          <Plus className="size-4" />
          Create Task
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.title} task={task} />
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold">Task History</h2>
      <p className="mt-1 text-muted-foreground text-sm">12th November, 2024</p>
      <div className="mt-6">
        <TaskCard
          task={{
            done: true,
            title: "Confirmation of property tax payment made up to date",
            detail: "Completed during document review.",
            owner: "Alex",
            due: "Today 12:00 PM",
            action: "Reminder",
          }}
        />
      </div>
    </>
  );
}

function NotesPanel() {
  const alexCount = leadNotes.filter((note) => note.type === "ai").length;
  const realtorCount = leadNotes.length - alexCount;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-border bg-card shadow-sm dark:bg-[#111111]">
        <div className="border-border border-b bg-muted/20 px-6 py-5 dark:bg-[#151515]">
          <p className="text-muted-foreground text-sm">Lead workspace</p>
          <h2 className="mt-2 text-2xl font-semibold">Notes</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            Keep realtor notes and Alex’s AI summaries together, with source context from the SMS correspondence.
          </p>
        </div>

        <div className="border-border border-b p-6">
          <div className="rounded-lg border border-border bg-background p-4 dark:bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <Avatar className="border border-border bg-muted text-foreground" size="sm">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">Add realtor note</p>
                <p className="text-muted-foreground text-xs">Private to your workspace</p>
              </div>
            </div>
            <Textarea
              className="mt-4 min-h-28 rounded-lg bg-muted/30 dark:bg-[#151515]"
              placeholder="Add showing context, negotiation notes, or follow-up reminders..."
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="outline">
                <Sparkles data-icon="inline-start" />
                Ask Alex to summarize
              </Button>
              <Button>
                <NotebookPen data-icon="inline-start" />
                Save note
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {leadNotes.map((note) => (
            <NoteCard key={`${note.author}-${note.time}`} note={note} />
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
          <p className="text-muted-foreground text-xs uppercase">Notes mix</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/25 p-4 dark:bg-[#171717]">
              <p className="text-2xl font-semibold">{realtorCount}</p>
              <p className="mt-1 text-muted-foreground text-sm">Realtor notes</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/25 p-4 dark:bg-[#171717]">
              <p className="text-2xl font-semibold">{alexCount}</p>
              <p className="mt-1 text-muted-foreground text-sm">Alex notes</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-blue-500/20 bg-[linear-gradient(135deg,#202020,#171923_52%,rgba(88,80,236,0.2))] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white">
              <Sparkles className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-semibold text-white">Alex can add notes</p>
              <p className="text-sm text-white/60">From SMS, email, and task updates</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-6">
            Alex tags extracted facts separately from your manual notes, so the source of each insight stays clear.
          </p>
          <Button className="mt-5 w-full" variant="secondary">
            <MessageSquareText data-icon="inline-start" />
            Review SMS insights
          </Button>
        </section>
      </aside>
    </div>
  );
}

function NoteCard({
  note,
}: {
  note: (typeof leadNotes)[number];
}) {
  const isAi = note.type === "ai";

  return (
    <article className="rounded-lg border border-border bg-background p-5 dark:bg-[#0d0d0d]">
      <div className="flex items-start gap-4">
        <Avatar
          className={cn(
            "border border-border bg-muted text-foreground",
            isAi ? "border-blue-500/30" : ""
          )}
          size="sm"
        >
          <AvatarFallback
            className={
              isAi
                ? "bg-[linear-gradient(135deg,#1f2937,#312e81)] text-white"
                : undefined
            }
          >
            {isAi ? <Sparkles className="size-4" strokeWidth={1.8} /> : "You"}
          </AvatarFallback>
          {isAi ? <AvatarBadge className="bg-sky-400" /> : null}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{note.author}</span>
              <Badge variant={isAi ? "default" : "outline"}>
                {note.source}
              </Badge>
            </div>
            <span className="text-muted-foreground text-sm">{note.time}</span>
          </div>
          <p className="mt-4 text-sm leading-6">{note.body}</p>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="mt-6 flex items-start gap-4">
      <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground dark:bg-[#171717]">
        <Icon className="size-4" strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function TaskCard({
  task,
}: {
  task: {
    action: string;
    detail: string;
    done: boolean;
    due: string;
    owner: string;
    title: string;
  };
}) {
  return (
    <article className="rounded-lg border border-border bg-card px-6 py-6 shadow-sm dark:bg-[#111111]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <span
            className={cn(
              "mt-1 flex size-5 items-center justify-center rounded-full border",
              task.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border"
            )}
          >
            {task.done ? <CheckCircle2 className="size-4" /> : null}
          </span>
          <div>
            <h3 className="text-lg font-medium">{task.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{task.detail}</p>
            <p className="mt-7 text-sm">
              Created by <span className="font-semibold">{task.owner}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-6 lg:items-end">
          <p className="text-muted-foreground text-sm">
            Due Date: <span className="font-semibold text-foreground">{task.due}</span>
          </p>
          <div className="flex gap-2">
            <Button
              className={cn(
                "rounded-lg border-border text-foreground",
                task.action === "Important" ? "bg-pink-100 text-black dark:bg-pink-400/20 dark:text-pink-100" : "bg-card dark:bg-[#151515]"
              )}
              variant="outline"
            >
              {task.action === "Priority" ? <Timer className="size-4" /> : null}
              {task.action}
            </Button>
            <Button className="rounded-lg border-border bg-card text-foreground dark:bg-[#151515]" variant="outline">
              <Timer className="size-4" />
              Reminder
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
