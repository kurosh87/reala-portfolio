"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type LeadPill = {
  label: string;
  variant: "outline" | "secondary";
  dotClassName?: string;
};

type LeadChannel = "SMS" | "Email" | "Internal note";

type LeadThreadMessage = {
  id: string;
  speaker: "ai" | "lead" | "realtor";
  via: LeadChannel;
  time: string;
  body: string;
};

type LeadItem = {
  id: string;
  name: string;
  summary: string;
  meta: string;
  responseTime: string;
  exchangeCount: number;
  channels: LeadChannel[];
  isNew?: boolean;
  pills: LeadPill[];
  thread: LeadThreadMessage[];
};

type LeadSection = {
  id: string;
  title: string;
  count: number;
  leads: LeadItem[];
};

const leadSections: LeadSection[] = [
  {
    id: "needs-you",
    title: "Needs You",
    count: 1,
    leads: [
      {
        id: "sarah-kim",
        name: "Sarah Kim",
        summary:
          "Pre-approved $1.4M · first-time buyer · 60-day timeline.",
        meta: "Showing at 2847 Oak St, Kitsilano",
        responseTime: "22 s",
        exchangeCount: 4,
        channels: ["SMS", "Email", "Internal note"],
        pills: [
          {
            label: "Requested",
            variant: "outline" as const,
            dotClassName: "bg-sky-400",
          },
          { label: "Showing", variant: "secondary" as const },
          { label: "Buyer", variant: "secondary" as const },
        ],
        thread: [
          {
            id: "sarah-1",
            speaker: "lead",
            via: "SMS",
            time: "11:42 AM",
            body:
              "Hi, just checking that we're still on for the 2:00 PM showing today at 2847 Oak.",
          },
          {
            id: "sarah-2",
            speaker: "ai",
            via: "SMS",
            time: "11:43 AM",
            body:
              "Yes, you're confirmed for 2:00 PM. I'll send over the address details and parking notes here.",
          },
          {
            id: "sarah-3",
            speaker: "lead",
            via: "Email",
            time: "11:48 AM",
            body:
              "Perfect. I'm pre-approved up to $1.4M and this is my first purchase, so I'll probably have a few questions.",
          },
          {
            id: "sarah-4",
            speaker: "ai",
            via: "Internal note",
            time: "11:49 AM",
            body:
              "Showing confirmed for 2:00 PM with Sarah Kim. First-time buyer, pre-approved, likely to want neighborhood context during the walkthrough.",
          },
        ],
      },
    ],
  },
  {
    id: "handled",
    title: "Handled",
    count: 4,
    leads: [
      {
        id: "avery-singh",
        name: "Avery Singh",
        summary:
          "Shared that they are relocating from Calgary in June, need a three-bedroom near good schools, and are already pre-approved.",
        meta: "Facebook lead ad",
        responseTime: "19 s",
        exchangeCount: 6,
        channels: ["SMS", "Email"],
        isNew: true,
        pills: [
          {
            label: "Qualified",
            variant: "outline" as const,
            dotClassName: "bg-emerald-400",
          },
          { label: "Relocation", variant: "secondary" as const },
          { label: "Pre-approved", variant: "secondary" as const },
        ],
        thread: [
          {
            id: "avery-1",
            speaker: "lead",
            via: "SMS",
            time: "9:08 AM",
            body:
              "We're moving from Calgary in June and need a 3-bedroom near good schools. Already pre-approved.",
          },
          {
            id: "avery-2",
            speaker: "ai",
            via: "SMS",
            time: "9:08 AM",
            body:
              "Thanks, Avery. I can help narrow that down. Do you want detached homes only, or are newer townhomes okay too?",
          },
          {
            id: "avery-3",
            speaker: "lead",
            via: "Email",
            time: "9:15 AM",
            body:
              "Detached preferred, but we'd consider a townhome if it had enough outdoor space.",
          },
          {
            id: "avery-4",
            speaker: "ai",
            via: "Email",
            time: "9:19 AM",
            body:
              "Perfect. I've shared a shortlist with commute and school notes and let them know you'll follow up with next best options.",
          },
        ],
      },
      {
        id: "jordan-velasco",
        name: "Jordan Velasco",
        summary:
          "Asked about a condo listed by another brokerage and the assistant collected timing, budget, and whether they need financing help.",
        meta: "REW inquiry",
        responseTime: "34 s",
        exchangeCount: 5,
        channels: ["SMS"],
        pills: [
          {
            label: "Qualifying",
            variant: "outline" as const,
            dotClassName: "bg-amber-400",
          },
          { label: "Other listing", variant: "secondary" as const },
          { label: "Condo", variant: "secondary" as const },
        ],
        thread: [
          {
            id: "jordan-1",
            speaker: "lead",
            via: "SMS",
            time: "11:04 AM",
            body:
              "I'm interested in the condo on REW. Is there an open house, or can I book a time this weekend?",
          },
          {
            id: "jordan-2",
            speaker: "ai",
            via: "SMS",
            time: "11:05 AM",
            body:
              "I can help with that. What price range are you hoping to stay in, and are you already working with financing?",
          },
          {
            id: "jordan-3",
            speaker: "lead",
            via: "SMS",
            time: "11:06 AM",
            body:
              "Budget is around $720k. We're not fully pre-approved yet, but we're talking to a lender.",
          },
        ],
      },
      {
        id: "nina-patel",
        name: "Nina Patel",
        summary:
          "Came through your WordPress site asking about listing her townhouse this spring and whether now is a good time to sell.",
        meta: "WordPress site",
        responseTime: "27 s",
        exchangeCount: 4,
        channels: ["Email", "SMS"],
        pills: [
          {
            label: "Requested",
            variant: "outline" as const,
            dotClassName: "bg-sky-400",
          },
          { label: "Seller", variant: "secondary" as const },
          { label: "Townhouse", variant: "secondary" as const },
        ],
        thread: [
          {
            id: "nina-1",
            speaker: "lead",
            via: "Email",
            time: "1:12 PM",
            body:
              "We're thinking of listing our townhouse this spring. Do you think now is a good time, or should we wait a bit?",
          },
          {
            id: "nina-2",
            speaker: "ai",
            via: "SMS",
            time: "1:15 PM",
            body:
              "I let Nina know you'll give a market-read with timing options and asked whether they have already bought their next place.",
          },
        ],
      },
      {
        id: "eric-thompson",
        name: "Eric Thompson",
        summary:
          "Submitted through your RealtyNinja site, confirmed they are pre-approved, and asked for homes under $850k with a legal suite.",
        meta: "RealtyNinja site",
        responseTime: "25 s",
        exchangeCount: 5,
        channels: ["SMS", "Email"],
        pills: [
          {
            label: "Qualified",
            variant: "outline" as const,
            dotClassName: "bg-emerald-400",
          },
          { label: "Buyer", variant: "secondary" as const },
          { label: "Suite search", variant: "secondary" as const },
        ],
        thread: [
          {
            id: "eric-1",
            speaker: "lead",
            via: "SMS",
            time: "3:41 PM",
            body:
              "We're pre-approved and looking for a place under $850k with a legal suite. Any areas you recommend?",
          },
          {
            id: "eric-2",
            speaker: "ai",
            via: "Email",
            time: "3:45 PM",
            body:
              "Shared a short neighborhood comparison and asked whether parking or suite privacy matters more.",
          },
        ],
      },
    ],
  },
] as const;

const activityFeed = [
  {
    time: "11:42 AM",
    status: "Paused",
    statusClassName: "text-[#fb923c]",
    summary: "Paused on Jessica Lam — commission question",
  },
  {
    time: "11:38 AM",
    status: "Replied",
    statusClassName: "text-muted-foreground",
    summary: "Replied to new inquiry from Jessica Lam in 14s",
  },
  {
    time: "10:14 AM",
    status: "Replied",
    statusClassName: "text-muted-foreground",
    summary: "Replied to Priya Shah about strata fees",
  },
  {
    time: "9:45 AM",
    status: "Nudged",
    statusClassName: "text-muted-foreground",
    summary: "Nudged Linh Nguyen · 2nd check-in, no reply",
  },
  {
    time: "9:23 AM",
    status: "Booked",
    statusClassName: "text-emerald-300",
    summary: "Booked Sarah Kim · Sat 2pm at 2847 Oak St",
  },
  {
    time: "9:14 AM",
    status: "Replied",
    statusClassName: "text-muted-foreground",
    summary: "Replied to Sarah Kim in 22s",
  },
  {
    time: "8:30 AM",
    status: "Reminded",
    statusClassName: "text-muted-foreground",
    summary: "Sent day-of reminder to Sarah Kim",
  },
  {
    time: "7:15 AM",
    status: "Queued",
    statusClassName: "text-muted-foreground",
    summary: "Queued morning check-in for Michael Tanaka",
  },
] as const;

const riskRadar = [
  {
    lead: "Priya Shah",
    context: "Mon 6:30pm showing",
    detail: "Went quiet 18h after confirming",
    status: "Watch now",
    toneClassName: "text-[#fb923c]",
    iconClassName: "text-[#fb923c]",
    badgeClassName:
      "border-orange-500/25 bg-orange-500/12 text-orange-200",
    glowClassName:
      "from-orange-500/20 via-orange-400/8 to-transparent",
    borderClassName:
      "group-hover:border-orange-400/30 group-hover:shadow-[0_20px_80px_rgba(251,146,60,0.12)]",
  },
  {
    lead: "David Ross",
    context: "Sat showing request",
    detail: "Listing agent hasn't responded in 2h",
    status: "Needs follow-up",
    toneClassName: "text-foreground",
    iconClassName: "text-muted-foreground",
    badgeClassName: "border-border/60 bg-background/50 text-muted-foreground",
    glowClassName:
      "from-white/10 via-white/[0.03] to-transparent",
    borderClassName:
      "group-hover:border-border/80 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)]",
  },
] as const;

const pulseStats = [
  {
    label: "Leads this week",
    value: "11",
    subtext: "+3 vs last",
    subtextClassName: "text-emerald-300",
  },
  {
    label: "Avg response",
    value: "19s",
    subtext: "industry ~6h",
    subtextClassName: "text-emerald-300",
  },
  {
    label: "Qualified rate",
    value: "73%",
    subtext: "+12%",
    subtextClassName: "text-emerald-300",
  },
  {
    label: "Hours saved",
    value: "14.3",
    subtext: "this week",
    subtextClassName: "text-muted-foreground",
  },
] as const;

function channelIcon(via: LeadChannel) {
  switch (via) {
    case "Email":
      return Mail;
    case "Internal note":
      return Sparkles;
    case "SMS":
    default:
      return MessageSquare;
  }
}

function speakerLabel(speaker: LeadThreadMessage["speaker"], leadName: string) {
  switch (speaker) {
    case "ai":
      return "AI Alex";
    case "realtor":
      return "You";
    case "lead":
    default:
      return leadName;
  }
}

export const Greeting = ({
  onHandledEndInViewChange,
}: {
  onHandledEndInViewChange?: (inView: boolean) => void;
}) => {
  const handledEndRef = useRef<HTMLDivElement | null>(null);
  const handledEndInView = useInView(handledEndRef, {
    margin: "0px 0px -180px 0px",
  });
  const [sections, setSections] = useState<LeadSection[]>(leadSections);
  const [showSections, setShowSections] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");

  useEffect(() => {
    onHandledEndInViewChange?.(handledEndInView);
  }, [handledEndInView, onHandledEndInViewChange]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSections(true);
    }, 950);

    return () => window.clearTimeout(timer);
  }, []);

  const activeLead =
    sections.flatMap((section) => section.leads).find((lead) => lead.id === activeLeadId) ??
    null;

  const activeSection =
    sections.find((section) => section.leads.some((lead) => lead.id === activeLeadId)) ?? null;

  const actionLabel = activeSection?.id === "handled" ? "View Thread" : "Open Thread";

  function handleSendMessage() {
    if (!activeLeadId || !draftMessage.trim()) {
      return;
    }

    setSections((currentSections) =>
      currentSections.map((section) => ({
        ...section,
        leads: section.leads.map((lead) =>
          lead.id === activeLeadId
            ? {
                ...lead,
                thread: [
                  ...lead.thread,
                  {
                    id: `${lead.id}-${lead.thread.length + 1}`,
                    speaker: "realtor",
                    via: "SMS",
                    time: "Now",
                    body: draftMessage.trim(),
                  },
                ],
              }
            : lead
        ),
      }))
    );
    setDraftMessage("");
  }

  return (
    <>
      <div className="w-full pt-4 md:pt-6" key="overview">
        <BlurFade
          className="text-sm font-normal tracking-[-0.03em] text-muted-foreground"
          delay={0.35}
        >
          Thursday, April 17
        </BlurFade>
        <BlurFade
          className="mt-5 max-w-4xl text-[2.75rem] font-medium leading-[0.94] tracking-tight text-foreground md:text-[4.5rem]"
          delay={0.5}
        >
          Good afternoon, Sarah.
        </BlurFade>
        <BlurFade
          className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground md:mt-5 md:text-xl md:leading-9"
          delay={0.65}
        >
          <p className="text-pretty">
            You have{" "}
            <span className="font-semibold text-foreground">
              one showing at 2pm
            </span>{" "}
            with Sarah Kim at 2847 Oak. Alex handled 4 inquiries overnight and
            this morning.{" "}
            <span className="font-semibold text-[#f59e0b]">
              3 things are waiting in your inbox.
            </span>
          </p>
        </BlurFade>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full space-y-6"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {showSections ? (
            <motion.div
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              transition={{
                delay: 0.14,
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-medium tracking-[-0.01em] text-muted-foreground">
                    Next up
                  </div>
                  <div className="h-px w-full bg-border/60" />
                </div>
                <div className="group rounded-[24px] border border-border/60 bg-background/20 px-4 py-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-border/80 hover:bg-background/30 hover:shadow-[var(--shadow-float)] md:px-6 md:py-5">
                  <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-start lg:gap-x-6">
                    <div className="space-y-4">
                      <div className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                        2:00 PM
                      </div>
                      <div className="border-l border-border/70 pl-3 text-sm leading-6 text-muted-foreground md:text-base">
                        Pre-approved $1.4M · first-time buyer · 60-day timeline
                      </div>
                    </div>

                    <div className="space-y-3 pt-0.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <AvatarFallback>SK</AvatarFallback>
                        </Avatar>
                        <div className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
                          Sarah Kim
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground md:text-base">
                        <MapPin className="size-3.5 shrink-0" />
                        <span>2847 Oak St, Kitsilano</span>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-muted-foreground transition-colors duration-300 group-hover:border-border/75 group-hover:bg-white/[0.03]">
                        Showing at 2847 Oak with a highly qualified buyer. Good moment to prep neighborhood context and first-time buyer talking points before the walkthrough.
                      </div>
                    </div>

                    <Badge
                      className="gap-1.5 self-start rounded-full border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300"
                      variant="outline"
                    >
                      <Clock3 className="size-3" />
                      in 3h 18m
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-border/50 pt-4">
                    <Button
                      className="rounded-lg border-border/70 bg-background/50 hover:bg-background/70"
                      onClick={() => setActiveLeadId("sarah-kim")}
                      size="xs"
                      type="button"
                      variant="outline"
                    >
                      Open thread
                    </Button>
                    <Button
                      asChild
                      className="rounded-lg border-border/70 bg-background/50 hover:bg-background/70"
                      size="xs"
                      variant="outline"
                    >
                      <a
                        href="https://maps.google.com/?q=2847+Oak+St+Kitsilano"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <MapPin className="size-4" />
                        Directions
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 space-y-10"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-4 text-xs font-medium tracking-[-0.01em] text-muted-foreground">
                What Alex has been doing
              </div>
              <div className="max-w-4xl divide-y divide-border/60">
                {activityFeed.map((entry) => (
                  <div
                    className="grid gap-2 py-4 sm:grid-cols-[72px_74px_minmax(0,1fr)] sm:items-center sm:gap-x-2"
                    key={`${entry.time}-${entry.summary}`}
                  >
                    <div className="text-sm text-muted-foreground">{entry.time}</div>
                    <div className={`text-sm font-medium ${entry.statusClassName}`}>
                      {entry.status}
                    </div>
                    <div className="min-w-0 text-sm leading-7 text-foreground/90">
                      {entry.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="border-b border-border/60 pb-4 text-xs font-medium tracking-[-0.01em] text-muted-foreground">
                Risk radar
              </div>
              <div className="space-y-4">
                {riskRadar.map((item) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={`group relative overflow-hidden rounded-[18px] border border-border/50 bg-card/25 backdrop-blur-xl transition-all duration-300 ${item.borderClassName}`}
                    key={`${item.lead}-${item.context}`}
                    initial={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br ${item.glowClassName} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
                    />
                    <div className="relative rounded-[17px] px-5 py-5">
                      <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:gap-x-3">
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <AlertCircle className={`size-4 ${item.iconClassName}`} />
                        </div>
                        <div className="min-w-0 space-y-1.5">
                          <div className={`text-lg font-semibold tracking-tight ${item.toneClassName}`}>
                            {item.lead}
                          </div>
                          <div className="text-sm leading-6 text-foreground/80">
                            {item.context}
                          </div>
                        </div>
                        <div
                          className={`inline-flex w-fit whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide sm:justify-self-start ${item.badgeClassName}`}
                        >
                          {item.status}
                        </div>
                      </div>

                      <div className="mt-4 h-px bg-gradient-to-r from-white/10 via-white/6 to-transparent" />

                      <div className="mt-4 flex flex-col items-start gap-2">
                        <p className="max-w-[18rem] text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/78">
                          {item.detail}
                        </p>
                        <div className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors duration-300 group-hover:text-foreground/80 hover:text-foreground hover:underline">
                          Escalate
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Alex watches ongoing threads and flags what&apos;s trending sideways.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border-b border-border/60 pb-4 text-xs font-medium tracking-[-0.01em] text-muted-foreground">
              Pulse
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pulseStats.map((stat) => (
                <div
                  className="rounded-xl border border-border/60 bg-background/20 px-6 py-5"
                  key={stat.label}
                >
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="mt-3 text-[2.15rem] font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className={`mt-2.5 text-sm ${stat.subtextClassName}`}>{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/20 px-6 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Tomorrow
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  Light day — one consultation at 11am with Mei Lin
                </h3>
                <p className="text-base leading-7 text-muted-foreground">
                  Alex will send her a reminder at 8am.
                </p>
              </div>
              <Button
                className="h-auto px-0 text-base font-medium text-muted-foreground hover:text-foreground"
                variant="link"
              >
                See the week
                <Send className="size-4 rotate-[-45deg]" />
              </Button>
            </div>
          </div>

        </motion.section>
        <div aria-hidden="true" className="h-px w-full" ref={handledEndRef} />
      </div>
      <Sheet
        open={Boolean(activeLead)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveLeadId(null);
            setDraftMessage("");
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl" side="right">
          {activeLead ? (
            <>
              <SheetHeader className="border-b border-border/60 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <SheetTitle className="text-xl">{activeLead.name}</SheetTitle>
                    <SheetDescription className="max-w-xl leading-6">
                      {activeLead.meta}. {activeLead.responseTime} first reply.{" "}
                      {activeLead.exchangeCount} messages so far.
                    </SheetDescription>
                  </div>
                  <Badge className="border-border/60 bg-transparent" variant="outline">
                    {actionLabel}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeLead.pills.map((pill) => (
                    <Badge
                      className={
                        pill.dotClassName
                          ? "gap-2 border-border/60 bg-transparent"
                          : undefined
                      }
                      key={`sheet-${activeLead.id}-${pill.label}`}
                      variant={pill.variant}
                    >
                      {pill.dotClassName ? (
                        <span
                          aria-hidden="true"
                          className={`size-2 rounded-full ${pill.dotClassName}`}
                        />
                      ) : null}
                      {pill.label}
                    </Badge>
                  ))}
                  {activeLead.channels.map((channel) => {
                    const ChannelIcon = channelIcon(channel);
                    return (
                      <Badge
                        className="gap-2 border-border/60 bg-transparent"
                        key={`sheet-${activeLead.id}-${channel}`}
                        variant="outline"
                      >
                        <ChannelIcon className="size-3.5" />
                        {channel}
                      </Badge>
                    );
                  })}
                </div>
              </SheetHeader>
              <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto]">
                <div className="border-b border-border/40 px-6 py-4">
                  <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      What happened
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Lead came in through {activeLead.meta.toLowerCase()}.
                      Alex responded over {activeLead.channels.join(" + ")} and
                      gathered enough context to move this thread forward. Open it
                      here to review the breadcrumb and jump in directly.
                    </p>
                  </div>
                </div>
                <ScrollArea className="min-h-0 px-6 py-5">
                  <div className="space-y-4 pr-4">
                    {activeLead.thread.map((message) => {
                      const isLead = message.speaker === "lead";
                      const isRealtor = message.speaker === "realtor";
                      const MessageIcon = isRealtor
                        ? User
                        : isLead
                          ? Phone
                          : Bot;

                      return (
                        <div
                          className={`flex ${isLead ? "justify-start" : "justify-end"}`}
                          key={message.id}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
                              isLead
                                ? "border-border/50 bg-background"
                                : isRealtor
                                  ? "border-sky-500/20 bg-sky-500/10"
                                  : "border-emerald-500/20 bg-emerald-500/10"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              <MessageIcon className="size-3.5" />
                              <span>{speakerLabel(message.speaker, activeLead.name)}</span>
                              <span className="text-[10px] text-muted-foreground/70">
                                {message.via}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70">
                                {message.time}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-foreground/95">
                              {message.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="border-t border-border/60 px-6 py-5">
                  <div className="rounded-2xl border border-border/50 bg-muted/10 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Add to thread
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Send Alex guidance or write the next message yourself.
                        </div>
                      </div>
                      <Badge className="gap-2 border-border/60 bg-transparent" variant="outline">
                        <Send className="size-3.5" />
                        Realtor note
                      </Badge>
                    </div>
                    <Textarea
                      className="min-h-24 bg-background/60"
                      onChange={(event) => setDraftMessage(event.target.value)}
                      placeholder={`Add guidance for Alex or reply to ${activeLead.name} directly...`}
                      value={draftMessage}
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        Demo behavior: this appends your message to the mock thread.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleSendMessage}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Add To Thread
                        </Button>
                        <Button size="sm" type="button">
                          {actionLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};
