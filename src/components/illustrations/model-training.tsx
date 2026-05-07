import { CheckCircle2, Clock3, Inbox, MessageSquareText, TimerReset } from 'lucide-react'

export const ModelTrainingIllustration = () => {
    return (
        <div
            aria-hidden
            className="w-full min-w-0 overflow-visible px-2">
            <div className="perspective-dramatic mx-auto flex w-full max-w-sm flex-col gap-4">
                <div className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left rotate-x-5 rotate-z-6 -rotate-4 pl-4 pt-1 @md:pl-6">
                    <div className="ring-border-illustration bg-background/80 shadow-black/6.5 rounded-t-2xl px-2 pt-4 shadow-lg ring-1">
                        <div className="mb-3 flex items-center justify-between gap-3 px-3">
                            <div className="text-muted-foreground flex items-center gap-2.5 font-medium">
                                <Inbox className="size-4" />
                                Lead inbox
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">Live</span>
                        </div>

                        <div className="bg-card ring-border-illustration flex flex-col gap-4 rounded-t-xl px-4 pt-4 shadow ring-1">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-muted/45 rounded-lg border px-2.5 py-2.5">
                                    <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                        <Clock3 className="size-3" />
                                        Reply
                                    </div>
                                    <div className="text-foreground mt-1 text-lg font-semibold">8s</div>
                                </div>
                                <div className="bg-muted/45 rounded-lg border px-2.5 py-2.5">
                                    <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                        <CheckCircle2 className="size-3 text-emerald-500" />
                                        Booked
                                    </div>
                                    <div className="text-foreground mt-1 text-lg font-semibold">3/4</div>
                                </div>
                                <div className="bg-muted/45 rounded-lg border px-2.5 py-2.5">
                                    <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                        <TimerReset className="size-3" />
                                        Saved
                                    </div>
                                    <div className="text-foreground mt-1 text-lg font-semibold">47m</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="rounded-xl border bg-background/80 p-3 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-foreground text-sm font-medium">Willow Glen showing</div>
                                            <div className="text-muted-foreground mt-1 text-xs">Portal lead · asks to tour today</div>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">Ready</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/8 px-2.5 py-2 text-xs text-emerald-700">
                                        <MessageSquareText className="size-3.5 shrink-0" />
                                        Reply drafted in 8 seconds
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="rounded-lg border bg-background/60 px-3 py-2">
                                        <div className="text-muted-foreground text-[11px]">Source</div>
                                        <div className="text-foreground mt-0.5 text-xs font-medium">Open house form</div>
                                    </div>
                                    <div className="rounded-lg border bg-background/60 px-3 py-2">
                                        <div className="text-muted-foreground text-[11px]">Next step</div>
                                        <div className="text-foreground mt-0.5 text-xs font-medium">Book showing</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelTrainingIllustration
