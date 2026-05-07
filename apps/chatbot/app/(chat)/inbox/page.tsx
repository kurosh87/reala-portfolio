"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  CalendarPlus,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  MoreHorizontal,
  NotebookTabs,
  Paperclip,
  Phone,
  Plus,
  MessageSquareReply,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Suggestion } from "@/components/ai-elements/suggestion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/chat/chat-header";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import type {
  Attachment,
  ChatMessage as AppChatMessage,
} from "@/lib/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ChatLaunchContext } from "@/lib/chat-launch";
import { cn } from "@/lib/utils";

type ChatMessage = {
  author: "lead" | "alex" | "agent";
  body: string;
  time: string;
};

type ChatThread = {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  status: "Needs reply" | "Alex active" | "Resolved";
  archived?: boolean;
  subject: string;
  leadCode: string;
  context: string;
  date: string;
  age: string;
  preview: string;
  unread?: boolean;
  messages: ChatMessage[];
};

type PropertyDetail = {
  address: string;
  status: string;
  type: string;
  price: string;
  beds: string;
  baths: string;
  interior: string;
  neighborhood: string;
  notes: string;
};

const inboxThreads: ChatThread[] = [
  {
    id: "amelia-frost",
    name: "Amelia Frost",
    initials: "AF",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    status: "Needs reply",
    subject: "Oakridge showing request",
    leadCode: "LEAD 023",
    context: "721 Oakridge Avenue",
    date: "Today 09:00 AM",
    age: "1m ago",
    preview:
      "Hi Alex, we can do today after work. Is 6:30 PM still available?",
    unread: true,
    messages: [
      {
        author: "lead",
        body: "Hi Alex, we can do today after work. Is 6:30 PM still available for Oakridge?",
        time: "09:00 AM",
      },
      {
        author: "alex",
        body: "Yes, I can hold 6:30 PM. Before I confirm with the listing agent, will both decision makers attend?",
        time: "09:01 AM",
      },
      {
        author: "lead",
        body: "Yes, both of us will be there. We are pre-approved up to about 1.25, but we would rather stay lower.",
        time: "09:03 AM",
      },
      {
        author: "alex",
        body: "Got it. Oakridge is in range. I paused here so you can decide whether to ask about video attendance before booking.",
        time: "09:05 AM",
      },
    ],
  },
  {
    id: "jordan-velasco",
    name: "Jordan Velasco",
    initials: "JV",
    status: "Alex active",
    subject: "Offer strategy follow-up",
    leadCode: "LEAD 047",
    context: "King West condo search",
    date: "Today 08:42 AM",
    age: "18m ago",
    preview:
      "Alex is gathering closing timeline and financing before the next offer strategy note.",
    messages: [
      {
        author: "alex",
        body: "Jordan, I am checking one thing before sending the offer recap. Are you still targeting a 60 day close?",
        time: "08:42 AM",
      },
      {
        author: "lead",
        body: "Yes. We can be flexible down to 45 if it helps.",
        time: "08:47 AM",
      },
      {
        author: "alex",
        body: "Perfect. I will include that as a strength and keep the deposit language conservative.",
        time: "08:48 AM",
      },
    ],
  },
  {
    id: "marcus-cho",
    name: "Marcus Cho",
    initials: "MC",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    status: "Needs reply",
    subject: "Listing prep timeline",
    leadCode: "LEAD 118",
    context: "Leslieville seller",
    date: "Today 07:15 AM",
    age: "2h ago",
    preview:
      "Can we move staging earlier? We want photos done before the weekend.",
    unread: true,
    messages: [
      {
        author: "lead",
        body: "Can we move staging earlier? We want photos done before the weekend if possible.",
        time: "07:15 AM",
      },
      {
        author: "alex",
        body: "I can ask the stager for Thursday morning. I am waiting for your approval before I shift the launch checklist.",
        time: "07:16 AM",
      },
    ],
  },
  {
    id: "nina-patel",
    name: "Nina Patel",
    initials: "NP",
    status: "Resolved",
    archived: true,
    subject: "School boundary question",
    leadCode: "LEAD 064",
    context: "Family buyer search",
    date: "Yesterday 04:45 PM",
    age: "Yesterday",
    preview:
      "Alex sent the school boundary map and marked the search criteria updated.",
    messages: [
      {
        author: "lead",
        body: "Can you confirm whether the Maple Ridge address is inside the school boundary?",
        time: "04:22 PM",
      },
      {
        author: "alex",
        body: "Confirmed. It is inside the requested boundary. I updated the saved search and sent the map.",
        time: "04:45 PM",
      },
    ],
  },
  {
    id: "elliot-ward",
    name: "Elliot Ward",
    initials: "EW",
    status: "Resolved",
    archived: true,
    subject: "Inspection window update",
    leadCode: "LEAD 205",
    context: "High Park buyer search",
    date: "Monday 01:20 PM",
    age: "2d ago",
    preview:
      "Inspection slot was confirmed and Alex already sent the seller-side timing note.",
    messages: [
      {
        author: "lead",
        body: "Can we still keep the inspection inside the original 48 hour window?",
        time: "01:06 PM",
      },
      {
        author: "alex",
        body: "Yes. The inspector is booked for tomorrow at 10:30 AM and the listing side confirmed access.",
        time: "01:20 PM",
      },
    ],
  },
  {
    id: "sophia-ng",
    name: "Sophia Ng",
    initials: "SN",
    status: "Resolved",
    archived: true,
    subject: "Open house recap",
    leadCode: "LEAD 092",
    context: "Trinity Bellwoods listing",
    date: "Sunday 06:10 PM",
    age: "3d ago",
    preview:
      "Alex sent the attendee recap and grouped the strongest follow-ups for Monday outreach.",
    messages: [
      {
        author: "alex",
        body: "I sent the open house recap and flagged the three hottest buyers for your Monday follow-up list.",
        time: "06:10 PM",
      },
    ],
  },
  {
    id: "omar-haddad",
    name: "Omar Haddad",
    initials: "OH",
    status: "Resolved",
    archived: true,
    subject: "Deposit timing question",
    leadCode: "LEAD 137",
    context: "Liberty Village condo buyer",
    date: "Last week",
    age: "6d ago",
    preview:
      "Deposit instructions were answered and the thread was archived after confirmation.",
    messages: [
      {
        author: "lead",
        body: "Should the deposit draft be ready the same day if we submit tonight?",
        time: "11:08 AM",
      },
      {
        author: "alex",
        body: "Yes. We should have the draft ready the same day so the offer package stays clean.",
        time: "11:19 AM",
      },
    ],
  },
  {
    id: "leila-bennett",
    name: "Leila Bennett",
    initials: "LB",
    status: "Resolved",
    archived: true,
    subject: "Listing photos approved",
    leadCode: "LEAD 156",
    context: "Riverdale semi-detached listing",
    date: "Last week",
    age: "1w ago",
    preview:
      "Photo selects were approved and the launch sequence moved into the scheduled state.",
    messages: [
      {
        author: "lead",
        body: "The exterior twilight shots look great. Please use those in the hero slot.",
        time: "03:42 PM",
      },
      {
        author: "alex",
        body: "Done. I updated the hero image selection and moved the launch checklist forward.",
        time: "03:50 PM",
      },
    ],
  },
];

const readonlyVisibility: VisibilityType = "private";
const inboxSuggestions = [
  {
    action: "reply",
    label: "Reply: confirm attendance",
    prompt: "Suggested reply: confirm attendance, then let Alex book the showing window.",
  },
  {
    action: "reminder",
    label: "Reminder: tomorrow",
    prompt: "Schedule a reminder if Amelia does not reply by tomorrow.",
  },
] as const;
type InboxChannel = "sms" | "email";
type InboxAttachmentPreset = "showing" | "buyer-packet" | "disclosures";
const propertyDetailsByContext: Record<string, PropertyDetail> = {
  "721 Oakridge Avenue": {
    address: "721 Oakridge Avenue",
    status: "Showing requested",
    type: "Detached home",
    price: "$1,198,000",
    beds: "4 bedrooms",
    baths: "3 bathrooms",
    interior: "2,340 sq ft",
    neighborhood: "Oakridge",
    notes:
      "Strong family-fit home with flexible evening showing availability. Best angle is move-in readiness and school access.",
  },
  "King West condo search": {
    address: "King West condo search",
    status: "Offer prep",
    type: "Buyer search",
    price: "$900k - $1.1M target",
    beds: "2 bedroom goal",
    baths: "2 bathroom goal",
    interior: "900+ sq ft target",
    neighborhood: "King West",
    notes:
      "Focus on conservative deposit language, flexible closing window, and buildings with strong resale history.",
  },
  "Leslieville seller": {
    address: "Leslieville seller",
    status: "Listing prep",
    type: "Seller listing",
    price: "Pricing in progress",
    beds: "3 bedrooms",
    baths: "2 bathrooms",
    interior: "1,880 sq ft",
    neighborhood: "Leslieville",
    notes:
      "Timing matters most here. Staging and photography need to land before the weekend launch window.",
  },
  "Family buyer search": {
    address: "Family buyer search",
    status: "Search active",
    type: "Buyer search",
    price: "$1.0M - $1.3M target",
    beds: "3+ bedrooms",
    baths: "2+ bathrooms",
    interior: "1,600+ sq ft target",
    neighborhood: "Maple Ridge area",
    notes:
      "School-boundary fit is the main constraint. Keep district notes attached to each shortlisted property.",
  },
};
const listingPropertyContexts = new Set(
  Object.keys(propertyDetailsByContext).filter((context) => /^\d+/.test(context))
);

const getThreadContextIcon = (context: string) => {
  if (/^\d+/.test(context)) {
    return Home;
  }

  if (/seller|listing/i.test(context)) {
    return Building2;
  }

  return MapPin;
};

const getThreadContextToneClassName = (context: string) => {
  if (context === "721 Oakridge Avenue") {
    return "border-emerald-300 bg-emerald-100 text-emerald-950 shadow-[0_0_0_1px_rgba(16,185,129,0.16),0_8px_18px_rgba(16,185,129,0.10)] hover:border-emerald-400 hover:bg-emerald-100 hover:text-emerald-950";
  }

  if (/^\d+/.test(context)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900";
  }

  if (/seller|listing/i.test(context)) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-sky-200 bg-sky-50 text-sky-800";
};

const avatarGradientClassNames = [
  "bg-linear-to-br from-sky-100 via-cyan-50 to-emerald-100 text-sky-950 ring-1 ring-foreground/5",
  "bg-linear-to-br from-rose-100 via-orange-50 to-amber-100 text-rose-950 ring-1 ring-foreground/5",
  "bg-linear-to-br from-violet-100 via-fuchsia-50 to-rose-100 text-violet-950 ring-1 ring-foreground/5",
  "bg-linear-to-br from-teal-100 via-emerald-50 to-lime-100 text-teal-950 ring-1 ring-foreground/5",
  "bg-linear-to-br from-slate-200 via-zinc-100 to-stone-100 text-slate-900 ring-1 ring-foreground/5",
];

const getAvatarGradientClassName = (id: string) => {
  const index = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);

  return avatarGradientClassNames[index % avatarGradientClassNames.length];
};

const formatThreadAge = (age: string) =>
  age
    .replace(/^(\d+)m ago$/, "$1 min ago")
    .replace(/^(\d+)h ago$/, "$1 hr ago")
    .replace(/^1d ago$/, "1 day ago")
    .replace(/^(\d+)d ago$/, "$1 days ago");

export default function InboxPage() {
  const [activeThreadId, setActiveThreadId] = useState(inboxThreads[0].id);
  const [visibleThreadCount, setVisibleThreadCount] = useState(7);
  const [messageOverrides, setMessageOverrides] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [query, setQuery] = useState("");
  const [orchestratorInput, setOrchestratorInput] = useState("");
  const [orchestratorAttachments, setOrchestratorAttachments] = useState<
    Attachment[]
  >([]);
  const [orchestratorMessages, setOrchestratorMessages] = useState<
    AppChatMessage[]
  >([]);
  const [selectedModelId, setSelectedModelId] =
    useState(DEFAULT_CHAT_MODEL);
  const [inboxChannel, setInboxChannel] = useState<InboxChannel>("sms");
  const [attachmentPreset, setAttachmentPreset] =
    useState<InboxAttachmentPreset>("showing");
  const [isLeadSheetOpen, setIsLeadSheetOpen] = useState(false);
  const [selectedPropertyContext, setSelectedPropertyContext] = useState(
    inboxThreads[0].context
  );
  const [isPropertySheetOpen, setIsPropertySheetOpen] = useState(false);

  const filteredThreads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return inboxThreads;
    }

    return inboxThreads.filter((thread) =>
      [
        thread.name,
        thread.subject,
        thread.context,
        thread.preview,
        thread.status,
      ].some((item) => item.toLowerCase().includes(normalizedQuery))
    );
  }, [query]);
  const visibleThreads = filteredThreads.slice(0, visibleThreadCount);
  const hasMoreThreads = visibleThreadCount < filteredThreads.length;

  const activeThread =
    visibleThreads.find((thread) => thread.id === activeThreadId) ??
    visibleThreads[0] ??
    filteredThreads.find((thread) => thread.id === activeThreadId) ??
    filteredThreads[0] ??
    inboxThreads[0];
  const ActiveContextIcon = getThreadContextIcon(activeThread.context);
  const activeThreadAge = formatThreadAge(activeThread.age);
  const inboxLaunchContext: ChatLaunchContext = {
    scopeType: "record",
    entityType: "inbox_thread",
    entityId: activeThread.id,
    title: `${activeThread.name} · ${activeThread.subject}`,
    route: "/inbox",
    snapshot: {
      leadName: activeThread.name,
      status: activeThread.status,
      subject: activeThread.subject,
      context: activeThread.context,
      preview: activeThread.preview,
      visibleThreadCount: visibleThreads.length,
    },
    filters: query ? { search: query } : null,
    timeRange: null,
    selectedView: "thread",
    sourceApp: "crm",
  };
  const activeMessages =
    messageOverrides[activeThread.id] ?? activeThread.messages;
  const activeThreadIndex = visibleThreads.findIndex(
    (thread) => thread.id === activeThread.id
  );
  const previousThread =
    activeThreadIndex > 0 ? visibleThreads[activeThreadIndex - 1] : null;
  const nextThread =
    activeThreadIndex >= 0 && activeThreadIndex < visibleThreads.length - 1
      ? visibleThreads[activeThreadIndex + 1]
      : null;
  const leadDetail = {
    agentNotes:
      activeThread.status === "Needs reply"
        ? "Lead is warm. They asked a scheduling or decision question and are waiting on a direct response."
        : activeThread.status === "Alex active"
          ? "Alex is already carrying the thread. You can jump in if tone or pricing strategy needs approval."
          : "Thread is handled. Keep for context and future nurture.",
    budget:
      activeThread.id === "amelia-frost"
        ? "$1.25M pre-approved, prefers lower"
        : activeThread.id === "jordan-velasco"
          ? "Flexible close, deposit language conservative"
          : activeThread.id === "marcus-cho"
            ? "Seller timeline focused on staging and photos"
            : "Family buyer criteria already updated",
    channel: inboxChannel === "sms" ? "SMS preferred" : "Email preferred",
    nextStep:
      activeThread.id === "amelia-frost"
        ? "Confirm both decision makers and lock the showing."
        : activeThread.id === "jordan-velasco"
          ? "Finalize offer recap and confirm closing window."
          : activeThread.id === "marcus-cho"
            ? "Rebook stager and update listing prep checklist."
            : "Keep school-boundary note attached to saved search.",
    owner: "Sarah",
    source:
      activeThread.id === "amelia-frost"
        ? "Realtor.ca inquiry"
        : activeThread.id === "jordan-velasco"
          ? "Website follow-up"
          : activeThread.id === "marcus-cho"
            ? "Seller intake form"
            : "Past conversation",
  };
  const propertyDetail =
    propertyDetailsByContext[selectedPropertyContext] ?? {
      address: selectedPropertyContext,
      status: "Active",
      type: "Lead property",
      price: "Pricing pending",
      beds: "Details pending",
      baths: "Details pending",
      interior: "Details pending",
      neighborhood: "Area pending",
      notes: "Property details will populate from the CRM once synced.",
    };
  const isListingPropertyContext = (context: string) =>
    listingPropertyContexts.has(context);
  const handleInboxPrompt = async (
    message?: Parameters<UseChatHelpers<AppChatMessage>["sendMessage"]>[0]
  ) => {
    if (!message) {
      return;
    }

    const textPart = message.parts?.find(
      (part): part is { type: "text"; text: string } => part.type === "text"
    );
    const body = textPart?.text?.trim();

    if (!body) {
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    setMessageOverrides((current) => ({
      ...current,
      [activeThread.id]: [
        ...(current[activeThread.id] ?? activeThread.messages),
        {
          author: "agent",
          body,
          time,
        },
      ],
    }));

    setOrchestratorMessages((current) => [
      ...current,
      {
        id: `inbox-${activeThread.id}-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text: body }],
      } as AppChatMessage,
    ]);
    setOrchestratorInput("");
    setOrchestratorAttachments([]);
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-inbox"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden bg-muted/30 p-2 text-foreground md:rounded-tl-[12px] md:border-t md:border-l md:border-border/50 md:p-3">
        <section className="grid min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-xs lg:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden border-border border-r bg-card/70">
            <header className="flex h-40 shrink-0 flex-col justify-between border-border border-b bg-background px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-[1.75rem] font-semibold leading-8">
                  Inbox
                </h1>
                <div className="flex shrink-0 items-center gap-2">
                  <ContextualChatLauncher
                    buttonEffect="rainbow"
                    buttonLabel="Delegate to Alex"
                    context={inboxLaunchContext}
                  />
                  <Button aria-label="Filter inbox" size="icon-sm" variant="outline">
                    <SlidersHorizontal />
                  </Button>
                  <Button aria-label="New message" size="icon-sm">
                    <Plus />
                  </Button>
                </div>
              </div>

              <InputGroup className="h-11 rounded-lg border-border bg-background shadow-xs">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleThreadCount(4);
                  }}
                  placeholder="Search conversations..."
                  value={query}
                />
              </InputGroup>
            </header>

            <ScrollArea className="relative min-h-0 flex-1">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-linear-to-b from-background/95 via-background/70 to-transparent backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-background/95 via-background/75 to-transparent backdrop-blur-[1px] [mask-image:linear-gradient(to_top,black_35%,transparent)]" />
              <div className="flex flex-col">
                {filteredThreads.length === 0 ? (
                  <div className="m-6 rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="font-medium text-sm">No inbound leads</p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Try a different search.
                    </p>
                  </div>
                ) : (
                  visibleThreads.map((thread, threadIndex) => {
                    const isActive = activeThread.id === thread.id;
                    const ContextIcon = getThreadContextIcon(thread.context);

                    return (
                      <div
                        className={cn(
                          "w-full cursor-pointer border-border border-b px-6 py-4 text-left transition-colors hover:bg-muted/45",
                          threadIndex % 2 === 0
                            ? "bg-zinc-50/70"
                            : "bg-zinc-100/45",
                          isActive && "bg-zinc-100/80",
                          thread.archived &&
                            !isActive &&
                            "bg-zinc-50/55 text-muted-foreground"
                        )}
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveThreadId(thread.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="shrink-0 shadow-xs">
                            <AvatarImage alt={thread.name} src={thread.avatar} />
                            <AvatarFallback
                              className={getAvatarGradientClassName(thread.id)}
                            >
                              {thread.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-[15px] leading-5">
                                  {thread.name}
                                </p>
                                <div className="mt-1 flex min-w-0 items-center gap-2">
                                  <p className="truncate font-medium text-[13px] leading-5 text-foreground">
                                    {thread.subject}
                                  </p>
                                  {thread.unread ? (
                                    <Badge
                                      className="shrink-0 rounded-md border border-emerald-200/80 bg-emerald-50/80 text-emerald-700"
                                      variant="secondary"
                                    >
                                      New
                                    </Badge>
                                  ) : null}
                                  {thread.archived ? (
                                    <Badge
                                      className="shrink-0 rounded-md border border-border/60 bg-muted/70 text-foreground/60"
                                      variant="secondary"
                                    >
                                      Archived
                                    </Badge>
                                  ) : null}
                                </div>
                              </div>
                              <span className="shrink-0 text-muted-foreground text-xs leading-5">
                                {thread.age}
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-1 text-muted-foreground text-[13px] leading-5">
                              {thread.preview}
                            </p>
                            <div className="mt-2 flex min-w-0 items-center gap-2 text-xs leading-5">
                              <span className="inline-flex h-6 shrink-0 items-center rounded-full border border-border/60 bg-transparent px-2.5 font-medium text-[13px] text-muted-foreground tabular-nums">
                                {thread.leadCode}
                              </span>
                              {isListingPropertyContext(thread.context) ? (
                                <Button
                                  className={cn(
                                    "max-w-full rounded-full shadow-xs",
                                    getThreadContextToneClassName(thread.context)
                                  )}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedPropertyContext(thread.context);
                                    setIsPropertySheetOpen(true);
                                  }}
                                  size="xs"
                                  type="button"
                                  variant="outline"
                                >
                                  <ContextIcon data-icon="inline-start" />
                                  <span className="truncate">{thread.context}</span>
                                </Button>
                              ) : (
                                <Badge
                                  className={cn(
                                    "h-6 max-w-full rounded-full px-2.5 shadow-xs",
                                    getThreadContextToneClassName(thread.context)
                                  )}
                                  variant="outline"
                                >
                                  <ContextIcon data-icon="inline-start" />
                                  <span className="truncate">{thread.context}</span>
                                </Badge>
                              )}
                              {thread.status === "Resolved" ? (
                                <CheckCheck className="size-3.5 shrink-0 text-muted-foreground" />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {filteredThreads.length > 0 ? (
                  <div className="border-border border-t bg-background px-6 py-4">
                    {hasMoreThreads ? (
                      <Button
                        className="w-full"
                        onClick={() =>
                          setVisibleThreadCount((current) =>
                            Math.min(current + 4, filteredThreads.length)
                          )
                        }
                        variant="outline"
                      >
                        Load more conversations
                      </Button>
                    ) : (
                      <div className="text-center text-xs text-muted-foreground">
                        Older archived conversations are fully loaded.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-background">
            <div className="flex shrink-0 items-center justify-between gap-4 border-border border-b bg-background px-6 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <Button
                  aria-label="Previous inbox thread"
                  disabled={!previousThread}
                  onClick={() =>
                    previousThread && setActiveThreadId(previousThread.id)
                  }
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  aria-label="Next inbox thread"
                  disabled={!nextThread}
                  onClick={() => nextThread && setActiveThreadId(nextThread.id)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <ChevronRight />
                </Button>
                <Separator className="mx-1 h-5" orientation="vertical" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm leading-5">
                    {activeThread.subject}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right leading-5 tabular-nums">
                <p className="font-semibold text-[13px] text-foreground">
                  {activeThread.date}
                </p>
                <p className="font-medium text-[11px] text-muted-foreground">
                  {activeThreadAge}
                </p>
              </div>
            </div>

            <header className="flex shrink-0 items-center justify-between gap-4 border-border border-b bg-background px-6 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="shrink-0 shadow-xs">
                  <AvatarImage alt={activeThread.name} src={activeThread.avatar} />
                  <AvatarFallback
                    className={getAvatarGradientClassName(activeThread.id)}
                  >
                    {activeThread.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-xl font-semibold leading-7">
                      {activeThread.name}
                    </h2>
                    <Badge
                      className="h-5 shrink-0 rounded-md border-border/60 bg-muted/60 px-1.5 font-semibold text-[10px] text-muted-foreground tracking-[0.08em]"
                      variant="outline"
                    >
                      SMS
                    </Badge>
                  </div>
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                    <Badge
                      className={cn(
                        "h-6 max-w-full rounded-full px-2.5 font-medium",
                        getThreadContextToneClassName(activeThread.context)
                      )}
                      variant="outline"
                    >
                      <ActiveContextIcon data-icon="inline-start" />
                      <span className="truncate">{activeThread.context}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button onClick={() => setIsLeadSheetOpen(true)} variant="outline">
                  <NotebookTabs data-icon="inline-start" />
                  Lead Details
                </Button>
                <Button variant="outline">
                  <CalendarClock data-icon="inline-start" />
                  Scheduled
                </Button>
                <Button
                  aria-label="More thread actions"
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <MoreHorizontal />
                </Button>
              </div>
            </header>

            <ScrollArea className="relative min-h-0 flex-1 overflow-hidden bg-background bg-linear-to-b from-muted/35 via-background to-background">
              <DotPattern
                className="text-sidebar-foreground/[0.055] [mask-image:linear-gradient(to_bottom,black,transparent_96%)]"
                cr={0.7}
                height={22}
                width={22}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 border-border/35 border-b bg-linear-to-b from-background/70 to-transparent" />
              <div className="relative mx-auto flex max-w-5xl flex-col gap-7 px-6 py-8 pb-8">
                <div className="flex items-center gap-3 text-muted-foreground text-sm tabular-nums">
                  <Separator className="flex-1" />
                  <span>{activeThread.date}</span>
                  <Separator className="flex-1" />
                </div>

                <div className="flex justify-center">
                  <div className="relative isolate inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-full border border-border/65 bg-background/90 px-2.5 py-1.5 text-xs shadow-[0_16px_38px_rgba(15,23,42,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent"
                    />
                    <span className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-2 py-0.5 font-medium text-[11px] text-background">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400 ring-1 ring-emerald-200/80" />
                      </span>
                      Live
                    </span>
                    <Sparkles className="relative size-4 shrink-0 text-foreground/80" />
                    <span className="relative min-w-0 truncate font-medium text-[13px] text-foreground/85">
                      Alex is holding the 6:30 PM window
                    </span>
                    <Separator className="relative h-4" orientation="vertical" />
                    <span className="relative inline-flex shrink-0 items-center rounded-full border border-border/60 bg-muted/65 px-2 py-0.5 font-medium text-[11px] text-foreground/70 tabular-nums">
                      2 actions ready
                    </span>
                  </div>
                </div>

                {activeMessages.map((message, index) => {
                  const isLead = message.author === "lead";
                  const isAgent = message.author === "agent";
                  const isAlex = message.author === "alex";
                  const authorName = isLead
                    ? activeThread.name
                    : isAgent
                      ? "You"
                      : "Alex AI";

                  return (
                    <div
                      className={cn(
                        "animate-in fade-in slide-in-from-bottom-2 flex items-start gap-3 duration-500",
                        !isLead && "justify-end"
                      )}
                      key={`${message.time}-${index}`}
                      style={{
                        animationDelay: `${Math.min(index, 4) * 90}ms`,
                      }}
                    >
                      {isLead ? (
                        <Avatar className="shrink-0 shadow-xs" size="sm">
                          <AvatarImage
                            alt={activeThread.name}
                            src={activeThread.avatar}
                          />
                          <AvatarFallback
                            className={getAvatarGradientClassName(activeThread.id)}
                          >
                            {activeThread.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : null}
                      <div
                        className={cn(
                          "flex max-w-[76%] flex-col gap-1.5",
                          !isLead && "items-end"
                        )}
                      >
                        {isLead ? (
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <span className="font-medium text-foreground">
                              {authorName}
                            </span>
                            <span>{message.time}</span>
                          </div>
                        ) : null}
                        <div
                          className={cn(
                            "relative overflow-hidden rounded-[var(--radius)] px-4 py-3 text-sm leading-6 shadow-sm",
                            isLead &&
                              "rounded-tl-sm bg-card/95 text-card-foreground ring-1 ring-foreground/5",
                            !isLead &&
                              "rounded-br-sm bg-primary text-primary-foreground shadow-foreground/15 ring-1 ring-foreground/10",
                            isAlex &&
                              "bg-foreground text-background shadow-[0_18px_34px_rgba(15,23,42,0.16)] ring-1 ring-foreground/10",
                            isAgent && "bg-foreground text-background"
                          )}
                        >
                          <p>{message.body}</p>
                        </div>
                        {!isLead ? (
                          <div className="flex items-center gap-2 text-right text-muted-foreground text-xs">
                            <span className="font-medium text-foreground">
                              {authorName}
                            </span>
                            <span>{message.time}</span>
                          </div>
                        ) : null}
                      </div>
                      {isLead ? null : (
                        <div
                          className={cn(
                            "relative flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/85 text-muted-foreground shadow-[0_10px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur",
                            isAlex &&
                              "border-emerald-200/80 bg-background/95 text-emerald-700 shadow-[0_12px_28px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
                          )}
                        >
                          {isAlex ? (
                            <>
                              <span className="-top-0.5 -right-0.5 absolute flex size-2.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/55" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                              </span>
                              <span className="absolute inset-1 rounded-full bg-linear-to-br from-white via-emerald-50/35 to-transparent" />
                            </>
                          ) : null}
                          <Sparkles
                            className={cn(
                              "relative size-4",
                              isAlex && "drop-shadow-[0_1px_3px_rgba(16,185,129,0.35)]"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </ScrollArea>

            <div className="shrink-0 px-6 py-4">
              <div className="mx-auto flex max-w-5xl flex-col gap-1.5">
                <div className="flex min-w-0 translate-y-2 items-center gap-2">
                  {inboxSuggestions.map((suggestion) => (
                    <Suggestion
                      className="h-9 min-w-0 flex-1 justify-start rounded-lg border-border/45 bg-background/70 px-3 text-left font-medium text-[12px] text-foreground/70 shadow-[0_1px_2px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 supports-[backdrop-filter]:bg-background/55 hover:-translate-y-px hover:border-border/70 hover:bg-background hover:text-foreground hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]"
                      key={suggestion.prompt}
                      onClick={(value) => {
                        void handleInboxPrompt({
                          role: "user",
                          parts: [{ type: "text", text: value }],
                        });
                      }}
                      suggestion={suggestion.prompt}
                    >
                      {suggestion.action === "reply" ? (
                        <MessageSquareReply data-icon="inline-start" />
                      ) : (
                        <CalendarPlus data-icon="inline-start" />
                      )}
                      <span className="min-w-0 truncate">{suggestion.label}</span>
                    </Suggestion>
                  ))}
                </div>
                <div className="rounded-[22px]">
                  <MultimodalInput
                    attachments={orchestratorAttachments}
                    chatId={`inbox-${activeThread.id}`}
                    composerContextAccessory={
                      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden rounded-xl border border-emerald-200/75 bg-emerald-50/45 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.72)]">
                        <div className="flex min-w-0 items-center gap-2">
                          <Badge
                            className="hidden h-5 shrink-0 rounded-md border-emerald-200 bg-background/80 px-1.5 font-medium text-[11px] text-emerald-700 xl:inline-flex"
                            variant="outline"
                          >
                            Open house
                          </Badge>
                          <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-emerald-800">
                            <Home data-icon="inline-start" />
                            <span className="truncate">721 Oakridge Avenue</span>
                          </span>
                          <span className="hidden h-3 w-px bg-emerald-200 2xl:block" />
                          <span className="hidden shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground 2xl:inline-flex">
                            <CalendarClock data-icon="inline-start" />
                            6:30 PM
                          </span>
                        </div>
                        <Button
                          aria-label="Lookup listing"
                          className="h-7 shrink-0 rounded-lg border-emerald-200 bg-background/75 px-2 text-[12px] font-medium text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 xl:px-2.5"
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Search data-icon="inline-start" />
                          <span className="hidden xl:inline">Lookup</span>
                        </Button>
                      </div>
                    }
                    disableRoutePush
                    footerAccessory={
                      <>
                        <Select
                          onValueChange={(value) =>
                            setAttachmentPreset(value as InboxAttachmentPreset)
                          }
                          value={attachmentPreset}
                        >
                          <SelectTrigger
                            aria-label="Attach preset"
                            className="h-7 max-w-[190px] rounded-lg border-emerald-200 bg-emerald-50/75 px-2 text-[12px] font-semibold text-emerald-700 shadow-sm shadow-emerald-950/5 hover:bg-emerald-50"
                            size="sm"
                          >
                            {attachmentPreset === "showing" ? (
                              <>
                                <Home data-icon="inline-start" />
                                <span className="truncate">721 Oakridge Avenue</span>
                              </>
                            ) : (
                              <>
                                <Paperclip data-icon="inline-start" />
                                <SelectValue />
                              </>
                            )}
                          </SelectTrigger>
                          <SelectContent align="start">
                            <SelectItem value="showing">721 Oakridge Avenue</SelectItem>
                            <SelectItem value="buyer-packet">Buyer packet</SelectItem>
                            <SelectItem value="disclosures">Disclosures</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) =>
                            setInboxChannel(value as InboxChannel)
                          }
                          value={inboxChannel}
                        >
                          <SelectTrigger
                            aria-label="Delivery channel"
                            className="h-7 rounded-lg px-2 text-[12px] text-muted-foreground"
                            size="sm"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="start">
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    }
                    input={orchestratorInput}
                    messages={orchestratorMessages as UIMessage[]}
                    onModelChange={setSelectedModelId}
                    selectedModelId={selectedModelId}
                    selectedVisibilityType={readonlyVisibility}
                    sendMessage={handleInboxPrompt}
                    setAttachments={setOrchestratorAttachments}
                    setInput={setOrchestratorInput}
                    setMessages={setOrchestratorMessages}
                    status="ready"
                    stop={() => {}}
                  />
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>

      <Sheet onOpenChange={setIsLeadSheetOpen} open={isLeadSheetOpen}>
        <SheetContent className="w-full overflow-y-auto border-border/60 bg-background/95 sm:max-w-xl">
          <SheetHeader className="border-b border-border/60 pb-4">
            <SheetTitle>{activeThread.name}</SheetTitle>
            <SheetDescription>
              {activeThread.subject} · {activeThread.context}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="shadow-xs" size="lg">
                <AvatarImage alt={activeThread.name} src={activeThread.avatar} />
                <AvatarFallback
                  className={getAvatarGradientClassName(activeThread.id)}
                >
                  {activeThread.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-lg">{activeThread.name}</p>
                <p className="text-muted-foreground text-sm">
                  {activeThread.context}
                </p>
              </div>
              <Badge className="ml-auto rounded-md" variant="secondary">
                {activeThread.status}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  CRM snapshot
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Source
                    </dt>
                    <dd>{leadDetail.source}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Owner
                    </dt>
                    <dd>{leadDetail.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Preferred channel
                    </dt>
                    <dd>{leadDetail.channel}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Budget / context
                    </dt>
                    <dd>{leadDetail.budget}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <MapPin className="size-4 text-muted-foreground" />
                  What matters now
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Next step
                    </dt>
                    <dd>{leadDetail.nextStep}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Agent notes
                    </dt>
                    <dd className="text-muted-foreground">
                      {leadDetail.agentNotes}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Phone className="size-4 text-muted-foreground" />
                Contact
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/70 px-3 py-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span>(604) 555-0184</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/70 px-3 py-2">
                  <span className="text-muted-foreground">Email</span>
                  <span>{activeThread.name.toLowerCase().replace(/\s+/g, ".")}@example.com</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/70 px-3 py-2">
                  <span className="text-muted-foreground">Last activity</span>
                  <span>{activeThread.date}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Mail className="size-4 text-muted-foreground" />
                Recent conversation
              </div>
              <div className="space-y-3">
                {activeMessages.slice(-3).map((message, index) => (
                  <div
                    className="rounded-md border border-border/50 bg-background/70 px-3 py-2"
                    key={`${message.time}-${index}`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {message.author === "lead"
                          ? activeThread.name
                          : message.author === "agent"
                            ? "You"
                            : "Alex AI"}
                      </span>
                      <span>{message.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{message.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={setIsPropertySheetOpen} open={isPropertySheetOpen}>
        <SheetContent className="w-full overflow-y-auto border-border/60 bg-background/95 sm:max-w-xl">
          <SheetHeader className="border-b border-border/60 pb-4">
            <SheetTitle>{propertyDetail.address}</SheetTitle>
            <SheetDescription>
              {propertyDetail.type} · {propertyDetail.status}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Home className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-lg">{propertyDetail.address}</p>
                <p className="text-muted-foreground text-sm">
                  {propertyDetail.neighborhood}
                </p>
              </div>
              <Badge className="ml-auto rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                {propertyDetail.status}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <Building2 className="size-4 text-muted-foreground" />
                  Property snapshot
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Price
                    </dt>
                    <dd>{propertyDetail.price}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Beds
                    </dt>
                    <dd>{propertyDetail.beds}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Baths
                    </dt>
                    <dd>{propertyDetail.baths}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Interior
                    </dt>
                    <dd>{propertyDetail.interior}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border border-border/60 bg-card/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <MapPin className="size-4 text-muted-foreground" />
                  Positioning notes
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Neighborhood
                    </dt>
                    <dd>{propertyDetail.neighborhood}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Notes
                    </dt>
                    <dd className="text-muted-foreground">{propertyDetail.notes}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
