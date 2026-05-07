"use client"

import * as React from "react"
import Image from "next/image"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import {
  createWorkspaceAccessRequestAction,
  type AccessRequestActionState,
} from "@/app/actions/access-requests"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useDashboardRole } from "@/components/role-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  BotIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PrinterIcon,
  SearchIcon,
  Settings2Icon,
  SparklesIcon,
  UsersIcon,
  CircleHelpIcon,
  ClipboardListIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  PlusIcon,
  KeyRoundIcon,
  GitBranchIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Pejman A",
    email: "pej.afra1987@gmail.com",
    avatar: "/brand/reala.png",
  },
  teams: [
    {
      name: "Engel & Völkers",
      logo: "/brand/ev.svg",
      plan: "Brokerage Workspace",
    },
    {
      name: "Reala",
      logo: "/brand/reala.png",
      plan: "Workspace",
    },
    {
      name: "Reala",
      logo: "/brand/reala.png",
      plan: "Workspace",
    },
  ],
  operations: [
    {
      title: "Command Center",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Legacy Cockpit",
      url: "/legacy-cockpit",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      title: "Legacy Sheets",
      url: "/legacy-sheets",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      title: "Ops Exceptions",
      url: "/exceptions",
      icon: (
        <AlertTriangleIcon
        />
      ),
    },
    {
      title: "Coexistence Audit",
      url: "/coexistence-audit",
      icon: (
        <GitBranchIcon
        />
      ),
    },
    {
      title: "Access Requests",
      url: "/access-requests",
      icon: (
        <KeyRoundIcon
        />
      ),
    },
    {
      title: "Bridge Safety",
      url: "/bridge-safety",
      icon: (
        <ShieldCheckIcon
        />
      ),
    },
    {
      title: "Portal Intake Review",
      url: "/bridge-approvals",
      icon: (
        <ClipboardListIcon
        />
      ),
    },
    {
      title: "Listings",
      url: "/listings",
      icon: (
        <Building2Icon
        />
      ),
    },
    {
      title: "Order Management",
      url: "#",
      icon: (
        <ClipboardListIcon
        />
      ),
      items: [
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "Jobs",
          url: "/jobs",
        },
        {
          title: "Approvals",
          url: "/approvals",
        },
        {
          title: "Vendors",
          url: "/vendors",
        },
      ],
    },
    {
      title: "Lead Inbox",
      url: "/lead-inbox",
      icon: (
        <InboxIcon
        />
      ),
    },
    {
      title: "Agents",
      url: "/agents",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Clients & Access",
      url: "/clients",
      icon: (
        <ShieldCheckIcon
        />
      ),
    },
    {
      url: "/plans-credits",
      title: "Plans & Credits",
      icon: (
        <PackageIcon
        />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Search",
      url: "/search",
      icon: (
        <SearchIcon
        />
      ),
    },
    {
      title: "Billing",
      url: "/billing",
      icon: (
        <CreditCardIcon
        />
      ),
    },
    {
      title: "Get Help",
      url: "/help",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
  ],
  workspace: [
    {
      name: "Service Catalog",
      url: "/service-catalog",
      icon: (
        <PackageIcon
        />
      ),
    },
    {
      name: "Marketing Studio",
      url: "/marketing-studio",
      icon: (
        <SparklesIcon
        />
      ),
      items: [
        { title: "Listing Launches", url: "/marketing-studio#launches" },
        { title: "Social Kits", url: "/marketing-studio#social" },
        { title: "Neighbourhood Guides", url: "/marketing-studio#guides" },
      ],
    },
    {
      name: "Print Shop",
      url: "/print-shop",
      icon: (
        <PrinterIcon
        />
      ),
      items: [
        { title: "Feature Sheets", url: "/print-shop#feature-sheets" },
        { title: "Postcards", url: "/print-shop#postcards" },
        { title: "Open House Kits", url: "/print-shop#open-house" },
      ],
    },
    {
      name: "AI Services",
      url: "/ai-services",
      icon: (
        <BotIcon
        />
      ),
      items: [
        { title: "Workflow Audit", url: "/ai-services#audit" },
        { title: "Speed-to-Lead", url: "/ai-services#speed-to-lead" },
        { title: "CRM Automations", url: "/ai-services#crm" },
      ],
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeProfile } = useDashboardRole()
  const routeAllowed = React.useCallback(
    (url: string) => {
      if (url === "#") return true

      return activeProfile.allowedRoutes.some((route) => {
        if (route === url) return true
        return route !== "/" && url.startsWith(`${route}/`)
      })
    },
    [activeProfile.allowedRoutes]
  )

  const operations = data.operations
    .map((item) => {
      if (item.items?.length) {
        const items = item.items.filter((child) => routeAllowed(child.url))
        return items.length ? { ...item, items } : null
      }

      return routeAllowed(item.url) ? item : null
    })
    .filter((item): item is (typeof data.operations)[number] => Boolean(item))

  const workspace = data.workspace
    .map((item) => {
      const children = item.items?.filter((child) => routeAllowed(child.url))

      if (!routeAllowed(item.url) && !children?.length) return null
      return children ? { ...item, items: children } : item
    })
    .filter((item): item is (typeof data.workspace)[number] => Boolean(item))

  const navSecondary = data.navSecondary.filter((item) => routeAllowed(item.url))
  const showCart = activeProfile.workspaceType !== "vendor-workspace"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarWorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={operations}
          primaryAction={activeProfile.primaryActions[0]}
          showCart={showCart}
        />
        {workspace.length ? <NavDocuments items={workspace} /> : null}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarWorkspaceSwitcher() {
  const [organizationDialogOpen, setOrganizationDialogOpen] =
    React.useState(false)
  const {
    organizationId,
    setOrganization,
    activeOrganization,
    availableOrganizations,
    canApproveBridge,
  } = useDashboardRole()
  const { isMobile } = useSidebar()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                />
              }
            >
              <div className="flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background group-data-[collapsible=icon]:size-8">
                <Image
                  src={activeOrganization.logo}
                  alt=""
                  width={180}
                  height={180}
                  className="size-full object-cover"
                />
              </div>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {activeOrganization.scopeLabel}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
              className="w-(--anchor-width) min-w-64 rounded-lg"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Organizations
                </DropdownMenuLabel>
                {availableOrganizations.map((organization, index) => (
                  <DropdownMenuItem
                    key={organization.id}
                    className={cn(
                      "gap-2 p-2",
                      organizationId === organization.id && "bg-muted"
                    )}
                    onClick={() => setOrganization(organization.id)}
                  >
                    <div className="flex size-6 items-center justify-center overflow-hidden rounded-md border bg-background">
                      <Image
                        src={organization.logo}
                        alt=""
                        width={180}
                        height={180}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="grid min-w-0 flex-1">
                      <span className="truncate font-medium">
                        {organization.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {organization.scopeLabel}
                      </span>
                    </div>
                    {organizationId === organization.id ? (
                      <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => setOrganizationDialogOpen(true)}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <PlusIcon />
                  </div>
                  <div className="grid min-w-0 flex-1">
                    <span className="font-medium text-muted-foreground">
                      Add Organization
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Draft workspace request
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AddOrganizationDialog
        open={organizationDialogOpen}
        onOpenChange={setOrganizationDialogOpen}
        canApproveBridge={canApproveBridge}
      />
    </>
  )
}

function AddOrganizationDialog({
  open,
  onOpenChange,
  canApproveBridge,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  canApproveBridge: boolean
}) {
  const [state, formAction] = React.useActionState(
    createWorkspaceAccessRequestAction,
    initialActionState
  )
  const lastRequestId = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    if (!state.publicRequestId || state.publicRequestId === lastRequestId.current) {
      return
    }

    lastRequestId.current = state.publicRequestId
    onOpenChange(false)

    if (state.ok) {
      toast.success("Organization draft created", {
        description: canApproveBridge
          ? "Ready to review before creating or mapping a Clerk organization."
          : "Reala admin approval is required before this becomes active.",
      })
    } else {
      toast.warning("Organization draft needs persistence setup", {
        description: state.message,
      })
    }
  }, [canApproveBridge, onOpenChange, state])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form action={formAction} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>
              Create a portal-native workspace request. This does not create a
              Clerk org or change legacy access until an admin approves it.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="organization-name">Organization name</FieldLabel>
              <Input
                id="organization-name"
                name="name"
                placeholder="North Group Team"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Workspace type</FieldLabel>
              <Select name="workspaceType" defaultValue="brokerage-workspace">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose workspace type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="brokerage-workspace">Brokerage workspace</SelectItem>
                    <SelectItem value="vendor-workspace">Vendor workspace</SelectItem>
                    <SelectItem value="client-workspace">Reala client intake</SelectItem>
                    <SelectItem value="reala-internal">Reala internal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                New workspaces start as drafts so production permissions cannot
                drift ahead of Clerk and Supabase membership records.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="organization-primary-email">
                Primary admin email
              </FieldLabel>
              <Input
                id="organization-primary-email"
                name="primaryEmail"
                type="email"
                placeholder="admin@example.com"
                required
              />
              <FieldDescription>
                Captured for review only; no Clerk invite, TimeTap client, or
                Stripe customer is created.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="organization-legacy-client">
                Legacy clientName candidate
              </FieldLabel>
              <Input
                id="organization-legacy-client"
                name="legacyClientName"
                placeholder="Usually the legacy Deliverables.users clientName"
              />
              <FieldDescription>
                Legacy `Deliverables.users` is keyed by clientName, not by the
                new org ID. This stays a candidate until Reala verifies it.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Legacy access flags to review</FieldLabel>
              <LegacyCapabilityOptions />
              <FieldDescription>
                These are the old client-management access flags Reala
                currently controls manually.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="organization-notes">Review notes</FieldLabel>
              <Textarea
                id="organization-notes"
                name="notes"
                placeholder="Brokerage/team/sub-account context, vendor relationship, discounts, or known legacy user notes."
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitDraftButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const initialActionState: AccessRequestActionState = { ok: false }

function LegacyCapabilityOptions() {
  const capabilities = [
    ["featureSheet", "Feature sheets"],
    ["virtualStaging", "Virtual staging"],
    ["printShop", "Print shop"],
    ["calculator", "Calculator/pricing"],
  ] as const

  return (
    <div className="grid gap-2 rounded-2xl border bg-muted/25 p-3 sm:grid-cols-2">
      {capabilities.map(([value, label]) => (
        <label
          key={value}
          className="flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-sm"
        >
          <input
            type="checkbox"
            name="capabilities"
            value={value}
            className="size-4 rounded border-input accent-primary"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  )
}

function SubmitDraftButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating Draft..." : "Create Draft"}
    </Button>
  )
}
