"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import EventManagerDemo from "@/components/ui/event-manager-demo";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import type { ChatLaunchContext } from "@/lib/chat-launch";

const readonlyVisibility: VisibilityType = "private";
const showingsLaunchContext: ChatLaunchContext = {
  scopeType: "section",
  entityType: "showings",
  title: "Showings calendar",
  route: "/showings",
  snapshot: {
    focus: "showing schedule and event manager board",
  },
  filters: null,
  timeRange: null,
  selectedView: "calendar",
  sourceApp: "crm",
};

export default function ShowingsPage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-showings"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-hidden bg-muted/30 p-2 text-foreground md:rounded-tl-[12px] md:border-t md:border-l md:border-border/50 md:p-3">
        <section className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-background shadow-xs">
          <ScrollArea className="h-full w-full">
            <div className="mx-auto flex min-h-full w-full max-w-[1480px] flex-col px-4 py-4 md:px-6 md:py-5">
              <div className="mb-4 flex justify-end">
                <ContextualChatLauncher
                  buttonLabel="Ask Alex about calendar"
                  context={showingsLaunchContext}
                />
              </div>
              <EventManagerDemo />
            </div>
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
