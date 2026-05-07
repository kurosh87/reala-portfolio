import { ChevronDown, Globe2, Plus } from "lucide-react";
import { ChatHeader } from "@/components/chat/chat-header";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const readonlyVisibility: VisibilityType = "private";

const settingsNav = [
  { label: "Profile", value: "profile" },
  { label: "Appearance", value: "appearance" },
  { label: "Language & Region", value: "language-region" },
  { label: "Date & Time", value: "date-time" },
  { label: "Keyboard Shortcuts", value: "keyboard-shortcuts" },
  { label: "Account", value: "account" },
  { label: "Plans & upgrades", value: "plans-upgrades" },
  { label: "Privacy", value: "privacy" },
  { label: "Notification", value: "notification" },
] as const;

const themeCards = [
  { label: "Light Mode", active: false, tone: "light" },
  { label: "Dark Mode", active: true, tone: "dark" },
  { label: "System Preferences", active: false, tone: "split" },
] as const;

const accentColors = ["#14142f", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"] as const;

export default function SettingsPage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="settings"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-background text-foreground md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 dark:bg-[#090909]">
        <Tabs
          className="min-h-full gap-0 bg-background dark:bg-[#090909]"
          defaultValue="profile"
        >
          <div className="border-border border-b bg-card px-5 pt-8 dark:bg-[#101010] md:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Dashboard / Settings</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                  Account Settings
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Globe2 data-icon="inline-start" />
                  Help Center
                </Button>
                <Avatar className="border border-border" size="sm">
                  <AvatarImage
                    alt="Brian F."
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
                  />
                  <AvatarFallback>BF</AvatarFallback>
                </Avatar>
                <span className="hidden font-medium text-sm sm:inline">Brian F.</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="mt-7">
              <TabsList className="w-full overflow-x-auto" variant="line">
                {settingsNav.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent
            className="grid gap-8 px-5 py-7 md:px-8 xl:grid-cols-[minmax(0,1fr)_380px]"
            value="profile"
          >
              <div className="space-y-8">
                <SettingsBlock title="Profile">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar className="border border-border" size="lg">
                      <AvatarImage
                        alt="Brian F."
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80"
                      />
                      <AvatarFallback>BF</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-wrap gap-3">
                      <Button>
                        <Plus data-icon="inline-start" />
                        Change Image
                      </Button>
                      <Button variant="secondary">Remove Image</Button>
                    </div>
                    <p className="text-muted-foreground text-sm">PNGs, JPEGs, and GIFs under 2 MB.</p>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field id="first-name" label="First Name" value="Brian" />
                    <Field id="last-name" label="Last Name" value="Frederin" />
                  </div>
                </SettingsBlock>

                <SettingsBlock title="Account Security">
                  <SecurityRow
                    action="Change email"
                    label="Email"
                    value="brianfrederin@email.com"
                  />
                  <SecurityRow action="Change password" label="Password" value="••••••••••" />
                  <ToggleRow
                    description="Add an additional layer of security to your account during login."
                    enabled
                    title="2-Step Verifications"
                  />
                </SettingsBlock>

                <SettingsBlock title="Support Access">
                  <ToggleRow
                    description="Grant Reala support temporary account access until Aug 31, 2026 at 9:40 PM."
                    enabled
                    title="Support access"
                  />
                  <SecurityRow
                    action="Log out"
                    label="Log out of all devices"
                    value="End all other active sessions besides this one."
                  />
                  <SecurityRow
                    action="Delete Account"
                    destructive
                    label="Delete my account"
                    value="Permanently delete the account and remove access from all workspaces."
                  />
                </SettingsBlock>
              </div>

              <aside className="space-y-6">
                <section className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
                  <p className="text-muted-foreground text-xs uppercase">Themes</p>
                  <h3 className="mt-2 text-xl font-semibold">Choose your style</h3>
                  <div className="mt-5 space-y-3">
                    {themeCards.map((theme) => (
                      <ThemeCard key={theme.label} {...theme} />
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
                  <p className="text-muted-foreground text-xs uppercase">Accent Colors</p>
                  <h3 className="mt-2 text-xl font-semibold">Customize your theme</h3>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {accentColors.map((color) => (
                      <span
                        className="size-8 rounded-full border border-border shadow-sm"
                        key={color}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <span className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                      #4146F8
                    </span>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
                  <p className="text-muted-foreground text-xs uppercase">Tables View</p>
                  <h3 className="mt-2 text-xl font-semibold">Lead table density</h3>
                  <div className="mt-5 grid gap-3">
                    <TablePreview active label="Comfortable" />
                    <TablePreview label="Compact" />
                  </div>
                </section>
              </aside>
          </TabsContent>

          {settingsNav
            .filter((item) => item.value !== "profile")
            .map((item) => (
              <TabsContent
                className="px-5 py-7 md:px-8"
                key={item.value}
                value={item.value}
              >
                <SettingsPlaceholder
                  label={item.label}
                  value={item.value}
                />
              </TabsContent>
            ))}
        </Tabs>
      </main>
    </div>
  );
}

function SettingsBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-sm dark:bg-[#111111]">
      <div className="border-border border-b px-6 py-5">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

const placeholderCopy: Record<string, { title: string; body: string; items: string[] }> = {
  account: {
    title: "Account controls",
    body: "Manage owner details, login methods, workspace identity, and account-level actions.",
    items: ["Workspace identity", "Login methods", "Connected devices"],
  },
  appearance: {
    title: "Appearance",
    body: "Tune theme, accent color, animation, and table density for the CRM workspace.",
    items: ["Theme mode", "Accent colors", "Table density"],
  },
  "language-region": {
    title: "Language & Region",
    body: "Set locale, currency, distance units, and address formatting for client-facing workflows.",
    items: ["Language", "Currency", "Regional formats"],
  },
  "date-time": {
    title: "Date & Time",
    body: "Choose calendar defaults, time zone, business hours, and reminder formatting.",
    items: ["Time zone", "Business hours", "Calendar format"],
  },
  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    body: "Review and customize fast actions for lead handling, notes, showings, and Alex handoffs.",
    items: ["Command search", "Lead actions", "Calendar actions"],
  },
  "plans-upgrades": {
    title: "Plans & upgrades",
    body: "Review subscription status, seat limits, billing cadence, and upcoming plan options.",
    items: ["Current plan", "Usage limits", "Invoices"],
  },
  privacy: {
    title: "Privacy",
    body: "Control data retention, consent defaults, transcript visibility, and export settings.",
    items: ["Data retention", "Transcript access", "Export controls"],
  },
  notification: {
    title: "Notification",
    body: "Choose how lead alerts, showing reminders, and Alex escalations reach the team.",
    items: ["Lead alerts", "Showing reminders", "Alex escalations"],
  },
};

function SettingsPlaceholder({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const content = placeholderCopy[value] ?? {
    title: label,
    body: "This settings area is ready for the next set of controls.",
    items: ["Primary controls", "Defaults", "Advanced options"],
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-lg border border-border bg-card shadow-sm dark:bg-[#111111]">
        <div className="border-border border-b px-6 py-5">
          <p className="text-muted-foreground text-xs uppercase">{label}</p>
          <h2 className="mt-2 text-2xl font-semibold">{content.title}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            {content.body}
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {content.items.map((item) => (
            <div
              className="rounded-lg border border-border bg-background p-4 dark:bg-[#0d0d0d]"
              key={item}
            >
              <div className="h-8 w-8 rounded-md bg-muted" />
              <h3 className="mt-4 font-semibold">{item}</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Placeholder controls for {item.toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-lg border border-border bg-card p-5 shadow-sm dark:bg-[#111111]">
        <p className="text-muted-foreground text-xs uppercase">Preview</p>
        <div className="mt-5 space-y-3">
          <div className="h-24 rounded-lg border border-border bg-muted/45" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <Button className="mt-3" variant="secondary">
            Configure {label}
          </Button>
        </div>
      </aside>
    </section>
  );
}

function Field({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input className="rounded-lg bg-background dark:bg-[#0d0d0d]" id={id} defaultValue={value} />
    </div>
  );
}

function SecurityRow({
  action,
  destructive = false,
  label,
  value,
}: {
  action: string;
  destructive?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-border border-b py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className={cn("font-medium", destructive ? "text-red-500" : "")}>{label}</p>
        <p className="mt-1 text-muted-foreground text-sm">{value}</p>
      </div>
      <Button variant={destructive ? "destructive" : "secondary"}>{action}</Button>
    </div>
  );
}

function ToggleRow({
  description,
  enabled,
  title,
}: {
  description: string;
  enabled?: boolean;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-border border-b py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
      <button
        aria-checked={enabled}
        className={cn(
          "relative h-7 w-12 rounded-full border border-border transition-colors",
          enabled ? "bg-primary" : "bg-muted"
        )}
        role="switch"
        type="button"
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-white transition-transform",
            enabled ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

function ThemeCard({
  active,
  label,
  tone,
}: {
  active: boolean;
  label: string;
  tone: "dark" | "light" | "split";
}) {
  return (
    <button
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:bg-muted/50 dark:bg-[#0d0d0d]"
      )}
      type="button"
    >
      <div className="overflow-hidden rounded-md border border-border">
        <div
          className={cn(
            "h-20",
            tone === "dark"
              ? "bg-[#111827]"
              : tone === "split"
                ? "bg-[linear-gradient(90deg,#f8fafc_0_50%,#111827_50%)]"
                : "bg-[#f8fafc]"
          )}
        >
          <div className="grid h-full grid-cols-3 gap-2 p-3 opacity-70">
            <span className="rounded bg-muted" />
            <span className="rounded bg-muted" />
            <span className="rounded bg-muted" />
          </div>
        </div>
      </div>
      <span className="mt-3 flex items-center gap-3 font-medium">
        <span
          className={cn(
            "size-5 rounded-full border",
            active ? "border-primary bg-primary" : "border-border"
          )}
        />
        {label}
      </span>
    </button>
  );
}

function TablePreview({
  active = false,
  label,
}: {
  active?: boolean;
  label: string;
}) {
  return (
    <button
      className={cn(
        "rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary bg-primary/10" : "border-border bg-background dark:bg-[#0d0d0d]"
      )}
      type="button"
    >
      <p className="font-medium text-sm">{label}</p>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="grid grid-cols-[40px_1fr_1fr] gap-2" key={index}>
            <span className="h-5 rounded bg-muted" />
            <span className="h-5 rounded bg-muted" />
            <span className="h-5 rounded bg-muted" />
          </div>
        ))}
      </div>
    </button>
  );
}
