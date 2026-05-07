"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HeaderActions } from "@/components/header-actions"
import {
  routeAllowedForProfile,
  useDashboardRole,
} from "@/components/role-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { WorkspaceRoleSwitcher } from "@/components/workspace-role-switcher"

type SiteHeaderCrumb = {
  label: string
  href?: string
}

export function SiteHeader({
  title = "Documents",
  breadcrumbs,
}: {
  title?: string
  breadcrumbs?: SiteHeaderCrumb[]
}) {
  const pathname = usePathname()
  const { activeOrganization, activeProfile, accessSource, isPreviewFallback } =
    useDashboardRole()
  const routeAllowed = routeAllowedForProfile(pathname, activeProfile)
  const crumbTrail =
    breadcrumbs ??
    (title === "Dashboard"
      ? []
      : [
          {
            label: "Dashboard",
            href: "/dashboard",
          },
        ])

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-vertical:self-auto"
          />
          <WorkspaceRoleSwitcher />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {crumbTrail.map((crumb) => (
                <React.Fragment key={`${crumb.href ?? "current"}-${crumb.label}`}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base font-medium">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <HeaderActions />
        </div>
      </header>
      <div className="border-b bg-muted/35 px-4 py-2 lg:px-6">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-background">
              {isPreviewFallback ? "Preview fallback" : "Server-scoped access"}
            </Badge>
            <span>
              {activeOrganization.name} · {activeProfile.role} · {activeProfile.dataScope}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-background">
              {accessSource.replaceAll("_", " ")}
            </Badge>
            <Badge variant={routeAllowed ? "secondary" : "destructive"}>
              {routeAllowed ? activeProfile.bridgePolicy : "Route outside scope"}
            </Badge>
            {!routeAllowed ? (
              <Button nativeButton={false} size="sm" variant="outline" render={<Link href={activeProfile.defaultRoute} />}>
                Go to role home
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
