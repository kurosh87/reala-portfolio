"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, CirclePlusIcon, ShoppingCartIcon } from "lucide-react"

type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({
  items,
  primaryAction,
  showCart = true,
}: {
  items: NavMainItem[]
  primaryAction?: {
    label: string
    href: string
  }
  showCart?: boolean
}) {
  const pathname = usePathname()
  const action = primaryAction ?? {
    label: "Create New Order",
    href: "/create-order",
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <ShimmerButton
              href={action.href}
              aria-label={action.label}
              background="oklch(0.145 0 0)"
              borderRadius="var(--radius-md)"
              shimmerColor="oklch(0.985 0 0)"
              className="h-8 min-w-8 flex-1 justify-start gap-2 px-3 text-sm font-medium text-white shadow-sm hover:text-white group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              shimmerDuration="2.8s"
            >
              <CirclePlusIcon className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                {action.label}
              </span>
            </ShimmerButton>
            {showCart ? (
              <CartDrawer>
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0"
                  variant="outline"
                >
                  <ShoppingCartIcon
                  />
                  <span className="sr-only">Cart</span>
                </Button>
              </CartDrawer>
            ) : null}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel>Operations</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const childIsActive = item.items?.some((child) => pathname === child.url)
            const isActive = item.isActive ?? (pathname === item.url || childIsActive)

            return (
              <NavMainMenuItem
                key={item.title}
                item={item}
                pathname={pathname}
                isActive={Boolean(isActive)}
              />
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavMainMenuItem({
  item,
  pathname,
  isActive,
}: {
  item: NavMainItem
  pathname: string
  isActive: boolean
}) {
  const hasChildren = Boolean(item.items?.length)
  const [open, setOpen] = React.useState(isActive || item.title === "Order Management")
  const renderedOpen = open || isActive

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<a href={item.url} />}
          tooltip={item.title}
          isActive={isActive}
        >
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isActive}
        onClick={() => setOpen((current) => !current)}
      >
        {item.icon}
        <span>{item.title}</span>
        <ChevronRightIcon
          className={`ml-auto transition-transform ${renderedOpen ? "rotate-90" : ""}`}
        />
      </SidebarMenuButton>
      {renderedOpen ? (
        <SidebarMenuSub>
          {item.items?.map((child) => (
            <SidebarMenuSubItem key={child.title}>
              <SidebarMenuSubButton
                render={<a href={child.url} />}
                isActive={pathname === child.url}
              >
                <span>{child.title}</span>
              </SidebarMenuSubButton>
              {child.items?.length ? (
                <div className="ml-3 mt-1 grid gap-1 border-l pl-3">
                  {child.items.map((nested) => (
                    <a
                      key={nested.title}
                      href={nested.url}
                      className="rounded-md px-2 py-1 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      {nested.title}
                    </a>
                  ))}
                </div>
              ) : null}
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  )
}
