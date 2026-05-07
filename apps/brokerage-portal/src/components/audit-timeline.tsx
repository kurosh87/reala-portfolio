import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  DatabaseIcon,
  FileClockIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type AuditTimelineTone =
  | "audit"
  | "bridge"
  | "exception"
  | "handoff"
  | "product"
  | "sync"

export type AuditTimelineItem = {
  id: string
  tone: AuditTimelineTone
  title: string
  summary: string
  timestamp: string
  actor?: string | null
  status?: string | null
  reference?: string | null
}

const toneStyles: Record<AuditTimelineTone, string> = {
  audit: "border-slate-200 bg-slate-50 text-slate-700",
  bridge: "border-blue-200 bg-blue-50 text-blue-700",
  exception: "border-amber-200 bg-amber-50 text-amber-800",
  handoff: "border-emerald-200 bg-emerald-50 text-emerald-700",
  product: "border-rose-200 bg-rose-50 text-rose-700",
  sync: "border-cyan-200 bg-cyan-50 text-cyan-700",
}

const toneIcons = {
  audit: FileClockIcon,
  bridge: ShieldCheckIcon,
  exception: AlertTriangleIcon,
  handoff: CheckCircle2Icon,
  product: DatabaseIcon,
  sync: ClockIcon,
}

export function AuditTimeline({
  items,
  title = "Audit timeline",
  description = "Portal and mirror events shown without touching legacy production.",
}: {
  items: AuditTimelineItem[]
  title?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="relative grid gap-3">
            {items.map((item) => {
              const Icon = toneIcons[item.tone]

              return (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[2.5rem_1fr_auto]"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium">{item.title}</div>
                      {item.status ? (
                        <Badge className={toneStyles[item.tone]}>
                          {formatLabel(item.status)}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.actor ? <span>Actor: {item.actor}</span> : null}
                      {item.reference ? <span>Reference: {item.reference}</span> : null}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(item.timestamp)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            No audit events are visible for this record yet. The next operator
            decision, dry-run bridge attempt, sync run, or exception will appear
            here.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ")
}
