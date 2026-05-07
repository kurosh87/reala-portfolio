import { ChatHeader } from "@/components/chat/chat-header";
import { LeadsDataGrid } from "@/components/chat/leads-data-grid";
import type { VisibilityType } from "@/components/chat/visibility-selector";

const readonlyVisibility: VisibilityType = "private";

export default function LeadsPage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-leads"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-hidden bg-muted/30 p-2 text-foreground md:rounded-tl-[12px] md:border-t md:border-l md:border-border/50 md:p-3">
        <div className="flex min-h-0 h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xs">
          <LeadsDataGrid />
        </div>
      </div>
    </div>
  );
}
