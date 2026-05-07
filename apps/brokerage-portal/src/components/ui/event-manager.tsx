"use client"

import * as React from "react"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ListFilterIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  color: string
  category?: string
  attendees?: string[]
  tags?: string[]
  location?: string
  status?: string
  source?: string
  serviceTypes?: string[]
  staff?: string
  vendorCompany?: string
  mismatchState?: string
  bridgeState?: string
  legacy?: {
    timeTapAppointmentId?: string | null
    timeTapCalendarId?: string | null
    calendarName?: string
    client?: string
    realtor?: string
    unit?: string
    dailyDrafting?: {
      workbookTitle: string
      spreadsheetId: string
      sheetTitle: string
      sheetId: string
      row: number | null
      status: string
      uploadMarker?: string
      draftedBy?: string
      checkedBy?: string
      livableSqft?: string
      extraSqft?: string
      billableSqft?: string
    }
    schedulerFields?: {
      photoType?: string
      floorPlanType?: string
      videoType?: string
      matterportType?: string
      printedMaterialType?: string
      matterportUrl?: string
      printQuantity?: string
      printPaperWeight?: string
      printTracking?: string
      folderStatus?: string
    }
    exceptions?: string[]
    bridgeChecklist?: string[]
    noWriteNote?: string
  }
}

export interface EventManagerProps {
  events?: Event[]
  categories?: string[]
  defaultView?: "month" | "week" | "day" | "list"
  initialDate?: Date
  className?: string
  onEventClick?: (event: Event) => void
}

const colors: Record<string, string> = {
  blue: "bg-blue-600 text-white",
  green: "bg-green-600 text-white",
  purple: "bg-violet-600 text-white",
  orange: "bg-orange-500 text-white",
  pink: "bg-pink-500 text-white",
  red: "bg-red-600 text-white",
  slate: "bg-slate-900 text-white",
}

function startOfWeek(date: Date) {
  const next = new Date(date)
  next.setDate(date.getDate() - date.getDay())
  next.setHours(0, 0, 0, 0)
  return next
}

function sameDay(left: Date, right: Date) {
  return (
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear()
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function EventManager({
  events = [],
  categories = ["Shoot", "Edit", "Delivery", "Meeting"],
  defaultView = "week",
  initialDate = new Date(2026, 3, 27),
  className,
  onEventClick,
}: EventManagerProps) {
  const [currentDate, setCurrentDate] = React.useState(initialDate)
  const [view, setView] = React.useState(defaultView)
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("All")

  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      const matchesQuery = [event.title, event.description, event.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesCategory = category === "All" || event.category === category

      return matchesQuery && matchesCategory
    })
  }, [category, events, query])

  const title =
    view === "month"
      ? currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : view === "day"
        ? currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
        : view === "list"
          ? "Scheduled jobs"
          : `Week of ${startOfWeek(currentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}`

  function navigate(direction: -1 | 1) {
    setCurrentDate((previous) => {
      const next = new Date(previous)
      if (view === "month") next.setMonth(previous.getMonth() + direction)
      if (view === "week") next.setDate(previous.getDate() + direction * 7)
      if (view === "day") next.setDate(previous.getDate() + direction)
      return next
    })
  }

  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <div className="flex flex-col gap-3 border-b p-3 lg:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-2 text-2xl font-semibold tracking-normal">
              {title}
            </h2>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(initialDate)}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => navigate(1)}
            >
              <ChevronRightIcon />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          <Button className="w-full sm:w-auto">
            <PlusIcon data-icon="inline-start" />
            Job
          </Button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] xl:items-center">
          <div className="relative min-w-0">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search jobs, address, vendor..."
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <ToggleGroup
              multiple={false}
              value={[view]}
              onValueChange={(value) => {
                const nextView = value[0]
                if (nextView) setView(nextView as typeof view)
              }}
              variant="outline"
              size="sm"
              className="max-w-full overflow-x-auto"
            >
              {(["month", "week", "day", "list"] as const).map((item) => (
                <ToggleGroupItem
                  key={item}
                  value={item}
                  aria-label={`${item} view`}
                  className="capitalize"
                >
                  {item === "month" && <CalendarIcon data-icon="inline-start" />}
                  {item === "week" && <ListFilterIcon data-icon="inline-start" />}
                  {item === "day" && <ClockIcon data-icon="inline-start" />}
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", ...categories].map((item) => (
                <Button
                  key={item}
                  variant={category === item ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCategory(item)}
                  className="shrink-0"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {view === "month" && (
        <MonthCalendar
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={onEventClick}
        />
      )}
      {view === "week" && (
        <WeekCalendar
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={onEventClick}
        />
      )}
      {view === "day" && (
        <DayCalendar
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={onEventClick}
        />
      )}
      {view === "list" && (
        <ListCalendar events={filteredEvents} onEventClick={onEventClick} />
      )}
    </div>
  )
}

function JobPill({
  event,
  compact,
  onEventClick,
}: {
  event: Event
  compact?: boolean
  onEventClick?: (event: Event) => void
}) {
  const sourceLabel = getEventSourceLabel(event)

  return (
    <button
      type="button"
      onClick={() => onEventClick?.(event)}
      className={cn(
        "w-full rounded-md px-2 py-1 text-left text-xs font-medium shadow-sm transition hover:scale-[1.01] hover:shadow-md",
        colors[event.color] ?? colors.slate
      )}
    >
      <span className="block truncate">{event.title}</span>
      {!compact && (
        <span className="mt-0.5 block truncate text-[11px] opacity-85">
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </span>
      )}
      {sourceLabel && !compact ? (
        <span className="mt-1 inline-flex max-w-full rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          {sourceLabel}
        </span>
      ) : null}
    </button>
  )
}

function getEventSourceLabel(event: Event) {
  const tags = event.tags ?? []
  const sourceTags = [
    "TimeTap mirror",
    "Legacy appointment mirror",
    "Daily Drafting",
    "Portal job",
    "Vendor assignment",
    "Workflow deadline",
    "Exception detector",
    "Supabase mirror",
    "Portal assignment draft",
    "Sample data",
  ]

  return sourceTags.find((sourceTag) =>
    tags.some((tag) => tag.toLowerCase() === sourceTag.toLowerCase())
  )
}

function MonthCalendar({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date
  events: Event[]
  onEventClick?: (event: Event) => void
}) {
  const startDate = startOfWeek(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  )
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date
  })

  return (
    <Card className="overflow-hidden rounded-none border-0 shadow-none">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="border-r p-2 text-center text-xs font-medium last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            sameDay(event.startTime, day)
          )

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-28 border-b border-r p-2 last:border-r-0",
                day.getMonth() !== currentDate.getMonth() && "bg-muted/25 text-muted-foreground"
              )}
            >
              <div className="mb-2 text-xs font-medium">{day.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <JobPill
                    key={event.id}
                    event={event}
                    compact
                    onEventClick={onEventClick}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function WeekCalendar({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date
  events: Event[]
  onEventClick?: (event: Event) => void
}) {
  const firstDay = startOfWeek(currentDate)
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(firstDay)
    day.setDate(firstDay.getDate() + index)
    return day
  })
  const hours = Array.from({ length: 12 }, (_, index) => index + 7)

  return (
    <Card className="overflow-auto rounded-none border-0 shadow-none">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))] border-b bg-muted/40">
          <div className="border-r p-3 text-xs font-medium text-muted-foreground">
            Time
          </div>
          {days.map((day) => (
            <div key={day.toISOString()} className="border-r p-3 last:border-r-0">
              <div className="text-sm font-semibold">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))]"
          >
            <div className="border-b border-r p-3 text-xs text-muted-foreground">
              {hour}:00
            </div>
            {days.map((day) => {
              const slotEvents = events.filter(
                (event) => sameDay(event.startTime, day) && event.startTime.getHours() === hour
              )

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-20 border-b border-r p-1.5 last:border-r-0 hover:bg-muted/30"
                >
                  <div className="space-y-1.5">
                    {slotEvents.map((event) => (
                      <JobPill
                        key={event.id}
                        event={event}
                        onEventClick={onEventClick}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}

function DayCalendar({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date
  events: Event[]
  onEventClick?: (event: Event) => void
}) {
  const hours = Array.from({ length: 12 }, (_, index) => index + 7)

  return (
    <Card className="overflow-hidden rounded-none border-0 shadow-none">
      {hours.map((hour) => {
        const slotEvents = events.filter(
          (event) => sameDay(event.startTime, currentDate) && event.startTime.getHours() === hour
        )

        return (
          <div key={hour} className="flex border-b last:border-b-0">
            <div className="w-20 shrink-0 border-r p-3 text-sm text-muted-foreground">
              {hour}:00
            </div>
            <div className="min-h-20 flex-1 p-2">
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {slotEvents.map((event) => (
                  <JobPill
                    key={event.id}
                    event={event}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </Card>
  )
}

function ListCalendar({
  events,
  onEventClick,
}: {
  events: Event[]
  onEventClick?: (event: Event) => void
}) {
  const sortedEvents = [...events].sort(
    (left, right) => left.startTime.getTime() - right.startTime.getTime()
  )

  return (
    <Card className="rounded-none border-0 p-3 shadow-none">
      <div className="grid gap-2">
        {sortedEvents.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventClick?.(event)}
            className="grid gap-3 rounded-md border p-3 text-left transition hover:bg-muted/40 md:grid-cols-[1fr_160px_130px]"
          >
            <div>
              <div className="font-semibold">{event.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {event.description}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {event.startTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              , {formatTime(event.startTime)}
            </div>
            <Badge variant="outline" className="w-fit">
              {event.category}
            </Badge>
          </button>
        ))}
      </div>
    </Card>
  )
}
