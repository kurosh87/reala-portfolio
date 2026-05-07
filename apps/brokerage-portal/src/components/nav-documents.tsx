"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

type WorkspaceItem = {
  name: string
  url: string
  icon: React.ReactNode
  items?: {
    title: string
    url: string
  }[]
}

export function NavDocuments({ items }: { items: WorkspaceItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <WorkspaceMenuItem key={item.name} item={item} pathname={pathname} />
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function WorkspaceMenuItem({
  item,
  pathname,
}: {
  item: WorkspaceItem
  pathname: string
}) {
  const hasChildren = Boolean(item.items?.length)
  const isActive =
    pathname === item.url || Boolean(item.items?.some((child) => pathname === child.url))
  const [open, setOpen] = React.useState(isActive)
  const renderedOpen = open || isActive

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<a href={item.url} />}
        isActive={isActive}
      >
        {item.icon}
        <span>{item.name}</span>
      </SidebarMenuButton>
      {hasChildren ? (
        <SidebarMenuAction
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setOpen((current) => !current)
          }}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronRightIcon
            className={`transition-transform ${renderedOpen ? "rotate-90" : ""}`}
          />
          <span className="sr-only">Toggle {item.name}</span>
        </SidebarMenuAction>
      ) : null}
      {hasChildren && renderedOpen ? (
        <SidebarMenuSub>
          {item.items?.map((child) => (
            <SidebarMenuSubItem key={child.title}>
              <SidebarMenuSubButton
                render={<a href={child.url} />}
                isActive={pathname === child.url}
              >
                <span>{child.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  )
}
