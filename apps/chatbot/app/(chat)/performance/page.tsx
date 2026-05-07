import { ChatHeader } from "@/components/chat/chat-header";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import { InsightsResponseSpeed } from "@/components/chat/insights-response-speed";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import type { ChatLaunchContext } from "@/lib/chat-launch";

const readonlyVisibility: VisibilityType = "private";
const analyticsLaunchContext: ChatLaunchContext = {
  scopeType: "section",
  entityType: "analytics",
  title: "Analytics overview",
  route: "/performance",
  snapshot: {
    focus: "response speed, source mix, and sales performance",
    report: "Response Speed",
  },
  filters: null,
  timeRange: {
    label: "01 Feb 2025 - 01 Mar 2025",
    granularity: "monthly",
  },
  selectedView: "monthly",
  sourceApp: "crm",
};

export default function PerformancePage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-performance"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Analytics
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-5 text-muted-foreground/75">
                A lighter overview of lead operations, response timing, source
                mix, and forecasted sales performance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <ContextualChatLauncher
                buttonLabel="Ask Alex about analytics"
                context={analyticsLaunchContext}
              />
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                <span>01 Feb 2025 - 01 Mar 2025</span>
              </div>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[120px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>View</SelectLabel>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="min-w-36" variant="outline">
                CTA Placeholder
              </Button>
            </div>
          </section>
        </div>

        <div className="w-full border-t border-border/60" />

        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:pb-8 md:pt-6">
          <InsightsResponseSpeed />
        </div>
      </div>
    </div>
  );
}
