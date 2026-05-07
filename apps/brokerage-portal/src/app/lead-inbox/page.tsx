import * as React from "react"
import {
  CalendarClockIcon,
  Clock3Icon,
  HomeIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneCallIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { LeadInboxSidebar } from "@/components/lead-inbox-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  selectedLead,
  selectedLeadMessages,
  selectedLeadSuggestions,
} from "@/lib/lead-inbox-data"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/lead-inbox" })

  return (
    <RoleProvider initialAccess={access}>
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
          <SiteHeader title="Lead Inbox" />
          <div className="flex min-h-0 flex-1">
            <LeadInboxSidebar />
            <main id="lead-detail" className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <section className="flex shrink-0 items-center justify-between gap-4 border-b bg-background px-5 py-4 lg:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="shadow-xs" size="lg">
                    <AvatarFallback className="bg-linear-to-br from-sky-100 via-cyan-50 to-emerald-100 text-sky-950">
                      MC
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h1 className="truncate text-xl font-semibold">{selectedLead.name}</h1>
                      <Badge variant="outline">SMS</Badge>
                      <Badge variant="secondary">Hot</Badge>
                    </div>
                    <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                      <HomeIcon />
                      <span className="truncate">{selectedLead.type} - {selectedLead.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="sm">
                    <PhoneCallIcon data-icon="inline-start" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <MailIcon data-icon="inline-start" />
                    Email
                  </Button>
                  <Button aria-label="More lead actions" size="icon-sm" variant="outline">
                    <MoreHorizontalIcon />
                  </Button>
                </div>
              </section>

              <section className="relative min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-muted/35 via-background to-background">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 border-b bg-linear-to-b from-background/70 to-transparent" />
                <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-5 py-7 lg:px-8">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Separator className="flex-1" />
                    <span>Today</span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex justify-center">
                    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border bg-background/90 px-3 py-1.5 text-xs shadow-sm [&_svg]:size-3.5 [&_svg]:shrink-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2 py-0.5 font-medium text-background">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        Live
                      </span>
                      <SparklesIcon />
                      <span className="truncate font-medium text-foreground/80">
                        Alex paused for a human call after 2 PM
                      </span>
                      <Separator className="h-4" orientation="vertical" />
                      <span className="rounded-full border bg-muted/65 px-2 py-0.5 font-medium text-foreground/70">
                        3 actions ready
                      </span>
                    </div>
                  </div>

                  {selectedLeadMessages.map((message, index) => (
                    <ChatBubble
                      key={`${message.time}-${message.author}`}
                      message={message}
                      index={index}
                    />
                  ))}
                </div>
              </section>

              <section className="shrink-0 border-t bg-background px-5 py-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-3">
                  <div className="flex min-w-0 gap-2">
                    {selectedLeadSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        className="min-w-0 flex-1 justify-start"
                        size="sm"
                        variant="outline"
                      >
                        {suggestion === "Schedule 15-minute call" ? (
                          <CalendarClockIcon data-icon="inline-start" />
                        ) : (
                          <SparklesIcon data-icon="inline-start" />
                        )}
                        <span className="truncate">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="rounded-xl border bg-muted/25 p-2">
                    <div className="flex items-center gap-2 rounded-lg bg-background p-2 shadow-xs">
                      <Input
                        className="border-0 shadow-none focus-visible:ring-0"
                        placeholder="Reply to Maya or ask Alex to draft..."
                      />
                      <Button size="icon-sm">
                        <SendIcon data-icon="inline-start" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-1 text-xs text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
                      <Clock3Icon />
                      <span>{selectedLead.nextStep}</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function ChatBubble({
  message,
  index,
}: {
  message: (typeof selectedLeadMessages)[number]
  index: number
}) {
  const isLead = message.author === "lead"
  const isAlex = message.author === "alex"
  const alignRight = !isLead

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        alignRight && "justify-end"
      )}
      style={{ animationDelay: `${Math.min(index, 4) * 80}ms` }}
    >
      {isLead ? (
        <Avatar className="shadow-xs" size="sm">
          <AvatarFallback className="bg-linear-to-br from-sky-100 via-cyan-50 to-emerald-100 text-sky-950">
            MC
          </AvatarFallback>
        </Avatar>
      ) : null}
      <div className={cn("flex max-w-[76%] flex-col gap-1.5", alignRight && "items-end")}>
        {isLead ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{message.name}</span>
            <span>{message.time}</span>
          </div>
        ) : null}
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-6 shadow-sm",
            isLead && "rounded-tl-sm bg-card text-card-foreground ring-1 ring-foreground/5",
            !isLead && "rounded-br-sm bg-foreground text-background",
            isAlex && "shadow-[0_18px_34px_rgba(15,23,42,0.16)]"
          )}
        >
          {message.body}
        </div>
        {!isLead ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{message.name}</span>
            <span>{message.time}</span>
          </div>
        ) : null}
      </div>
      {isLead ? null : (
        <div
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm [&_svg]:size-4 [&_svg]:shrink-0",
            isAlex && "border-emerald-200 text-emerald-700"
          )}
        >
          {isAlex ? <span className="absolute right-0 top-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" /> : null}
          <SparklesIcon />
        </div>
      )}
    </div>
  )
}
