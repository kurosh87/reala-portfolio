"use client"

import * as React from "react"
import {
  Building2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { leadInboxLeads, leadInboxNav } from "@/lib/lead-inbox-data"

export function LeadInboxSidebar({ className }: { className?: string }) {
  const [activeItem, setActiveItem] = React.useState(leadInboxNav[0])
  const [showOnlyUnread, setShowOnlyUnread] = React.useState(false)

  const visibleLeads = showOnlyUnread
    ? leadInboxLeads.filter((lead) => lead.status === "Hot" || lead.status === "Call")
    : leadInboxLeads

  return (
    <aside
      className={cn(
        "hidden w-[350px] shrink-0 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col",
        className
      )}
    >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-base font-medium text-foreground">{activeItem.title}</div>
            <Badge variant="secondary">{activeItem.count}</Badge>
          </div>
          <Label className="flex items-center gap-2 text-sm">
            <span>Priority</span>
            <Switch
              checked={showOnlyUnread}
              onCheckedChange={setShowOnlyUnread}
              className="shadow-none"
            />
          </Label>
        </div>
        <SidebarInput placeholder="Search leads, calls, addresses..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <div className="flex border-b px-2 py-2">
              {leadInboxNav.slice(0, 4).map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
                    activeItem.title === item.title && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  title={item.title}
                >
                  {item.icon}
                  <span className="sr-only">{item.title}</span>
                </button>
              ))}
            </div>
            {visibleLeads.map((lead) => (
              <a
                href="#lead-detail"
                key={`${lead.name}-${lead.subject}`}
                className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex w-full items-center gap-2">
                  <span className="font-medium">{lead.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{lead.time}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <span className="truncate font-medium">{lead.subject}</span>
                  <Badge variant="outline" className="ml-auto shrink-0">
                    {lead.status}
                  </Badge>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                  <Building2Icon />
                  {lead.source}
                </span>
                <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces text-muted-foreground">
                  {lead.teaser}
                </span>
              </a>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </aside>
  )
}
