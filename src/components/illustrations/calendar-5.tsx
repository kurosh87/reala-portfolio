import { BellRing, CalendarDays } from 'lucide-react'

export const Calendar5Illustration = () => {
    return (
        <div
            aria-hidden
            className="mx-auto flex h-full w-full min-w-0 max-w-[28rem] flex-col items-center justify-center gap-5 px-0 @md:px-2">
            <div className="bg-illustration ring-border-illustration shadow-black/6.5 w-full rounded-2xl border border-transparent shadow-lg ring-1">
                <div className="grid grid-cols-2 divide-x divide-dashed border-b border-dashed">
                    <div className="flex flex-col items-center gap-2 rounded-tl-2xl p-4">
                        <div className="bg-foreground/5 flex size-10 rounded-full *:m-auto">
                            <CalendarDays className="size-4" />
                        </div>
                        <div className="text-xs font-medium">Showing Invite</div>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-tr-2xl p-4">
                        <div className="bg-foreground/5 flex size-10 rounded-full *:m-auto">
                            <BellRing className="size-4" />
                        </div>
                        <div className="text-xs font-medium">Buyer Alert</div>
                    </div>
                </div>
                <div className="space-y-2 p-5">
                    <div className="text-foreground/50 text-sm font-medium">Schedule Showing</div>
                    <div className="bg-background flex h-8 min-w-0 items-center rounded-lg border pl-2 pr-3">
                        <div className="bg-primary mr-2 h-4.5 w-0.5 shrink-0 animate-pulse rounded"></div>
                        <div className="text-foreground/50 truncate text-sm font-medium">Willow Glen open house at 2pm</div>
                    </div>
                </div>
            </div>
            <p className="text-foreground/65 max-w-[24rem] text-center text-sm leading-6">
                <span>
                    <span className="border-primary text-foreground border-b-2 py-0.5">Willow Glen open house at 2pm</span> is booked with calendar invites and notifications.
                </span>
            </p>
        </div>
    )
}

export default Calendar5Illustration
