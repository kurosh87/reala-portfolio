"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  Edit3,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import { ChatHeader } from "@/components/chat/chat-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type InboxItem =
  | {
      id: string;
      kind: "escalation";
      lead: string;
      leadInitial: string;
      reason: string;
      context: string;
      age: string;
    }
  | {
      id: string;
      kind: "confirmation";
      lead: string;
      leadInitial: string;
      property: string;
      from: string;
      proposedTime: string;
      requestedWindow: string;
      age: string;
    }
  | {
      id: string;
      kind: "approval";
      lead: string;
      leadInitial: string;
      trigger: string;
      draft: string;
      age: string;
    }
  | {
      id: string;
      kind: "showing_request";
      lead: string;
      leadInitial: string;
      property: string;
      listingAgent: string;
      preferredWindow: string;
      qualification: string;
      age: string;
    };

const INITIAL_ITEMS: InboxItem[] = [
  {
    id: "e1",
    kind: "escalation",
    lead: "Jessica Lam",
    leadInitial: "JL",
    reason: "Asked about commission rates on a $2.4M listing.",
    context: "Alex paused because commission is a realtor conversation.",
    age: "11:42 AM",
  },
  {
    id: "c1",
    kind: "confirmation",
    lead: "David Ross",
    leadInitial: "DR",
    property: "1204 Balsam St",
    from: "Mark Chen (listing agent at Macdonald Realty)",
    proposedTime: "Sat Apr 19 · 2:00 PM",
    requestedWindow: "Saturday afternoon",
    age: "8 min ago",
  },
  {
    id: "a1",
    kind: "approval",
    lead: "Michael Tanaka",
    leadInitial: "MT",
    trigger:
      'He replied: "yeah we\'re relocating from Calgary, move-in ideally mid-June"',
    draft:
      "That's a great window. Are you pre-approved with a lender yet, or is that still on the to-do list? Wanted to make sure we're lining up the right places for you.",
    age: "4 min ago",
  },
  {
    id: "a2",
    kind: "approval",
    lead: "Priya Shah",
    leadInitial: "PS",
    trigger: 'Just replied: "what\'s the strata fee on that one?"',
    draft:
      "The strata is $624/mo on 3411 W 14th and includes heat, hot water, and caretaker. Want me to set up a showing this weekend?",
    age: "32 min ago",
  },
  {
    id: "s1",
    kind: "showing_request",
    lead: "Jessica Lam",
    leadInitial: "JL",
    property: "2847 Oak St, Kitsilano",
    listingAgent: "Unknown (need to look up on Paragon)",
    preferredWindow: "Saturday afternoon",
    qualification: "Pre-approved $1.4M · no agent · 60-day timeline",
    age: "1h ago",
  },
  {
    id: "s2",
    kind: "showing_request",
    lead: "Tom Walsh",
    leadInitial: "TW",
    property: "1842 W 8th Ave",
    listingAgent: "Emma Liu · Oakwyn · 604-555-0188",
    preferredWindow: "Saturday 4:30pm or Sunday morning",
    qualification: "Pre-approved $1.8M · downsizing from Dunbar",
    age: "3h ago",
  },
];

const readonlyVisibility = "private" as const;

export function InboxDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const resolve = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const startEdit = (item: Extract<InboxItem, { kind: "approval" }>) => {
    setEditingId(item.id);
    setEditText(item.draft);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const escalations = items.filter((item) => item.kind === "escalation");
  const decisions = items.filter(
    (item) => item.kind === "approval" || item.kind === "confirmation",
  );
  const tasks = items.filter((item) => item.kind === "showing_request");

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-inbox"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 md:px-6 md:py-8">
          <section className="w-full pt-4 md:pt-6">
            <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Alex has {items.length} inbox items today.
            </h1>
            <p className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-muted-foreground/80 md:text-3xl">
              {decisions.length} need a decision. {tasks.length} need a task.{" "}
              {escalations.length} needs you now.
            </p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              Escalations, approvals, confirmations, and showing requests waiting
              for a human touch before Alex keeps moving.
            </p>
          </section>

          <div className="mt-7 w-full space-y-3">
            {items.length === 0 ? (
              <div className="rounded-xl border border-border/40 bg-background/30 px-5 py-10 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  Nothing is waiting on you.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Alex has the rest covered for now.
                </p>
              </div>
            ) : null}

            {escalations.length > 0 ? (
              <InboxSection
                count={escalations.length}
                title="Needs You"
                tone="warning"
              >
                {escalations.map((item) => (
                  <EscalationItem
                    item={item}
                    key={item.id}
                    onResolve={() => resolve(item.id)}
                  />
                ))}
              </InboxSection>
            ) : null}

            {decisions.length > 0 ? (
              <InboxSection count={decisions.length} title="Needs Decision">
                {decisions.map((item) =>
                  item.kind === "approval" ? (
                    <ApprovalItem
                      editText={editText}
                      editing={editingId === item.id}
                      item={item}
                      key={item.id}
                      onCancelEdit={cancelEdit}
                      onSend={() => resolve(item.id)}
                      onSkip={() => resolve(item.id)}
                      onStartEdit={() => startEdit(item)}
                      setEditText={setEditText}
                    />
                  ) : (
                    <ConfirmationItem
                      item={item}
                      key={item.id}
                      onResolve={() => resolve(item.id)}
                    />
                  ),
                )}
              </InboxSection>
            ) : null}

            {tasks.length > 0 ? (
              <InboxSection count={tasks.length} title="Needs Task">
                {tasks.map((item) => (
                  <ShowingRequestItem
                    item={item}
                    key={item.id}
                    onResolve={() => resolve(item.id)}
                  />
                ))}
              </InboxSection>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxSection({
  children,
  count,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  count: number;
  title: string;
  tone?: "default" | "warning";
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4 px-0 py-3">
        <div className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </div>
        <span
          className={
            tone === "warning"
              ? "shrink-0 text-sm text-amber-200"
              : "shrink-0 text-sm text-muted-foreground"
          }
        >
          {count} lead{count === 1 ? "" : "s"}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EscalationItem({
  item,
  onResolve,
}: {
  item: Extract<InboxItem, { kind: "escalation" }>;
  onResolve: () => void;
}) {
  return (
    <Card className="rounded-2xl border-amber-500/30 bg-amber-500/6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/45 hover:bg-amber-500/8 hover:shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 px-5 py-5">
        <LeadHeader
          initial={item.leadInitial}
          lead={item.lead}
          meta={`Escalated at ${item.age}`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="gap-2 border-amber-500/35 bg-transparent text-amber-200" variant="outline">
            <AlertCircle className="size-3.5" />
            Alex paused
          </Badge>
          <Badge className="border-border/60 bg-transparent" variant="outline">
            Realtor answer needed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-5 pb-0">
        <p className="text-base font-medium text-foreground">{item.reason}</p>
        <p className="text-sm leading-6 text-muted-foreground">{item.context}</p>
      </CardContent>
      <CardFooter className="border-t border-border/40 px-5 pt-5 pb-5">
        <Button onClick={onResolve} size="sm">
          Open thread
          <ArrowUpRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ApprovalItem({
  item,
  editing,
  editText,
  setEditText,
  onStartEdit,
  onCancelEdit,
  onSend,
  onSkip,
}: {
  item: Extract<InboxItem, { kind: "approval" }>;
  editing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSend: () => void;
  onSkip: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/75 hover:bg-card/30 hover:shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 px-5 py-5">
        <LeadHeader
          initial={item.leadInitial}
          lead={item.lead}
          meta={`Awaiting approval · ${item.age}`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="gap-2 border-border/60 bg-transparent" variant="outline">
            <Sparkles className="size-3.5" />
            Draft SMS
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-0">
        <div className="rounded-2xl border border-border/50 bg-background/35 px-4 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Trigger
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.trigger}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-background/35 px-4 py-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <MessageSquareQuote className="size-3.5" />
            Alex drafted
          </div>
          {editing ? (
            <Textarea
              className="min-h-28 resize-y"
              onChange={(event) => setEditText(event.target.value)}
              value={editText}
            />
          ) : (
            <p className="text-sm leading-6 text-foreground">{item.draft}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/40 px-5 pt-5 pb-5">
        {editing ? (
          <>
            <Button onClick={onSend} size="sm">
              <Check className="size-4" />
              Send edited
            </Button>
            <Button onClick={onCancelEdit} size="sm" variant="outline">
              Cancel edit
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onSend} size="sm">
              <Check className="size-4" />
              Send as-is
            </Button>
            <Button onClick={onStartEdit} size="sm" variant="outline">
              <Edit3 className="size-4" />
              Edit
            </Button>
            <Button onClick={onSkip} size="sm" variant="ghost">
              Skip
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function ConfirmationItem({
  item,
  onResolve,
}: {
  item: Extract<InboxItem, { kind: "confirmation" }>;
  onResolve: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/75 hover:bg-card/30 hover:shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 px-5 py-5">
        <LeadHeader
          initial={item.leadInitial}
          lead={item.lead}
          meta={`${item.property} · ${item.age}`}
        />
        <Badge className="gap-2 border-border/60 bg-transparent" variant="outline">
          <Calendar className="size-3.5" />
          Listing agent replied
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-0">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailCell label="From" value={item.from} />
          <DetailCell label="Requested window" value={item.requestedWindow} />
          <DetailCell
            className="md:col-span-2"
            label="Proposed time"
            value={item.proposedTime}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/40 px-5 pt-5 pb-5">
        <Button onClick={onResolve} size="sm">
          <Check className="size-4" />
          Lock it in
        </Button>
        <Button size="sm" variant="outline">
          Propose different time
        </Button>
      </CardFooter>
    </Card>
  );
}

function ShowingRequestItem({
  item,
  onResolve,
}: {
  item: Extract<InboxItem, { kind: "showing_request" }>;
  onResolve: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/75 hover:bg-card/30 hover:shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 px-5 py-5">
        <LeadHeader
          initial={item.leadInitial}
          lead={item.lead}
          meta={`${item.property} · ${item.age}`}
        />
        <Badge className="border-border/60 bg-transparent" variant="outline">
          Showing request
        </Badge>
      </CardHeader>
      <CardContent className="px-5 pb-0">
        <div className="grid gap-3 md:grid-cols-2">
          <DetailCell label="Listing agent" value={item.listingAgent} />
          <DetailCell label="Preferred window" value={item.preferredWindow} />
          <DetailCell
            className="md:col-span-2"
            label="Qualification"
            value={item.qualification}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/40 px-5 pt-5 pb-5">
        <Button onClick={onResolve} size="sm">
          Open ShowingTime
          <ArrowUpRight className="size-4" />
        </Button>
        <Button size="sm" variant="outline">
          Copy request text
        </Button>
        <Button onClick={onResolve} size="sm" variant="ghost">
          Mark submitted
        </Button>
      </CardFooter>
    </Card>
  );
}

function LeadHeader({
  initial,
  lead,
  meta,
}: {
  initial: string;
  lead: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-sm font-medium text-foreground shadow-sm">
        {initial}
      </div>
      <div className="space-y-0.5">
        <p className="font-medium text-foreground">{lead}</p>
        <p className="text-sm text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function DetailCell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/50 bg-background/35 px-4 py-3 shadow-sm ${className ?? ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}
