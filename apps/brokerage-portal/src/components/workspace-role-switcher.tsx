"use client"

import * as React from "react"
import Image from "next/image"
import { useFormStatus } from "react-dom"
import {
  ChevronsUpDownIcon,
  EyeIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserRoundCogIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  createRolePermissionAccessRequestAction,
  type AccessRequestActionState,
} from "@/app/actions/access-requests"
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
import { useDashboardRole } from "@/components/role-context"
import { cn } from "@/lib/utils"

export function WorkspaceRoleSwitcher() {
  const [permissionDialogOpen, setPermissionDialogOpen] = React.useState(false)
  const {
    role,
    setRole,
    activeProfile,
    activeOrganization,
    availableRoleProfiles,
    canApproveBridge,
  } = useDashboardRole()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="h-8 max-w-[52vw] gap-2 px-2 text-sm font-medium md:max-w-none"
            />
          }
        >
          <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            <Image
              src={activeProfile.logo}
              alt=""
              width={180}
              height={180}
              className="size-full object-cover"
            />
          </div>
          <span className="hidden text-muted-foreground lg:inline">Role</span>
          <span className="truncate">{role}</span>
          <ChevronsUpDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-72 rounded-lg">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserRoundCogIcon />
              Roles & Permissions
            </DropdownMenuLabel>
            {availableRoleProfiles.map((profile, index) => (
              <DropdownMenuItem
                key={profile.role}
                className={cn("gap-2 p-2", role === profile.role && "bg-muted")}
                onClick={() => setRole(profile.role)}
              >
                <div className="flex size-6 items-center justify-center overflow-hidden rounded-md border bg-background">
                  <Image
                    src={profile.logo}
                    alt=""
                    width={180}
                    height={180}
                    className="size-full object-cover"
                  />
                </div>
                <div className="grid min-w-0 flex-1">
                  <span className="truncate font-medium">{profile.role}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {profile.scopeLabel}
                  </span>
                </div>
                {profile.canViewLegacy ? (
                  <ShieldCheckIcon className="text-muted-foreground" />
                ) : (
                  <EyeIcon className="text-muted-foreground" />
                )}
                {role === profile.role ? (
                  <span className="text-xs text-muted-foreground">Active</span>
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
              onClick={() => setPermissionDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon />
              </div>
              <div className="grid min-w-0 flex-1">
                <span className="font-medium text-muted-foreground">
                  Add Role Permission
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Portal draft, reviewed by Reala admin
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddRolePermissionDialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        organizationName={activeOrganization.name}
        canApproveBridge={canApproveBridge}
      />
    </>
  )
}

function AddRolePermissionDialog({
  open,
  onOpenChange,
  organizationName,
  canApproveBridge,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationName: string
  canApproveBridge: boolean
}) {
  const [state, formAction] = React.useActionState(
    createRolePermissionAccessRequestAction,
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
      toast.success("Role permission draft created", {
        description: canApproveBridge
          ? "Ready for Reala review before any Clerk membership changes."
          : "Sent as a portal draft; Reala admin approval is still required.",
      })
    } else {
      toast.warning("Role permission draft needs persistence setup", {
        description: state.message,
      })
    }
  }, [canApproveBridge, onOpenChange, state])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form action={formAction} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Add Role Permission</DialogTitle>
            <DialogDescription>
              Create a portal-native access request for {organizationName}. This
              does not change Clerk, legacy portals, TimeTap, or Stripe yet.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="permission-email">Member email</FieldLabel>
              <Input
                id="permission-email"
                name="email"
                type="email"
                placeholder="agent@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="permission-display-name">
                Display name
              </FieldLabel>
              <Input
                id="permission-display-name"
                name="displayName"
                placeholder="Jamie Reala"
              />
              <FieldDescription>
                Used for the portal draft only; Clerk invitation and legacy name
                changes still require admin review.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Requested role</FieldLabel>
              <Select name="role" defaultValue="Individual Agent">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Brokerage Admin">Brokerage Admin</SelectItem>
                    <SelectItem value="Individual Agent">Individual Agent</SelectItem>
                    <SelectItem value="Vendor Admin">Vendor Admin</SelectItem>
                    <SelectItem value="Field Technician">Field Technician</SelectItem>
                    <SelectItem value="Partner Photographer">Partner Photographer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Role assignment stays in draft until it is reviewed and mapped
                to the correct Clerk organization.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="permission-legacy-client">
                Legacy clientName candidate
              </FieldLabel>
              <Input
                id="permission-legacy-client"
                name="legacyClientName"
                placeholder={organizationName}
              />
              <FieldDescription>
                Legacy uses `clientName` as the unique account key, so this is
                stored as a review candidate, not an automatic mapping.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Legacy access flags to review</FieldLabel>
              <LegacyCapabilityOptions />
              <FieldDescription>
                These mirror the old client-management flags. Checking them
                only records requested capabilities for admin review.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="permission-notes">Review notes</FieldLabel>
              <Textarea
                id="permission-notes"
                name="notes"
                placeholder="Why this person needs access, any known legacy account, brokerage/team context, or vendor relationship."
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
