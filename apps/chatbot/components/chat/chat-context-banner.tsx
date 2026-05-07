"use client";

import {
  BarChart3,
  CalendarRange,
  ClipboardList,
  Inbox,
  Map,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ChatLaunchContext } from "@/lib/chat-launch";
import { Badge } from "@/components/ui/badge";

function getContextIcon(entityType: string) {
  switch (entityType) {
    case "lead":
      return UserRound;
    case "inbox":
    case "inbox_thread":
      return Inbox;
    case "task":
    case "tasks":
      return ClipboardList;
    case "analytics":
      return BarChart3;
    case "calendar":
    case "showings":
      return CalendarRange;
    default:
      return Map;
  }
}

function getEntityLabel(entityType: string) {
  switch (entityType) {
    case "lead":
      return "Lead";
    case "inbox_thread":
      return "Inbox Thread";
    case "inbox":
      return "Inbox";
    case "tasks":
      return "Tasks";
    case "task":
      return "Task";
    case "analytics":
      return "Analytics";
    case "showings":
      return "Calendar";
    default:
      return entityType
        .split("_")
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        .join(" ");
  }
}

function DetailLine({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground text-xs">{children}</span>;
}

export function ChatContextBanner({
  launchContext,
}: {
  launchContext: ChatLaunchContext;
}) {
  const Icon = getContextIcon(launchContext.entityType);
  const entityLabel = getEntityLabel(launchContext.entityType);
  const routeLabel = launchContext.route.replace(/^\//, "") || "home";
  const filtersCount = launchContext.filters
    ? Object.keys(launchContext.filters).length
    : 0;

  return (
    <div className="border-border/60 border-b bg-muted/20 px-4 py-3 md:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full px-2.5 py-1" variant="secondary">
            <Sparkles className="mr-1 size-3.5" />
            Ask Alex
          </Badge>
          <Badge className="rounded-full px-2.5 py-1" variant="outline">
            {entityLabel}
          </Badge>
          {launchContext.selectedView ? (
            <Badge className="rounded-full px-2.5 py-1" variant="outline">
              View: {launchContext.selectedView}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              Chatting with Alex about {launchContext.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <DetailLine>From: /{routeLabel}</DetailLine>
              {launchContext.timeRange?.label ? (
                <DetailLine>Range: {launchContext.timeRange.label}</DetailLine>
              ) : null}
              {filtersCount > 0 ? (
                <DetailLine>{filtersCount} active filters</DetailLine>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
