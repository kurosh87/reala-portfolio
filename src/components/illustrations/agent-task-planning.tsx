import { CheckCircle2, CircleDashed, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const marketingSteps = [
    {
        title: '1. Package listing angle',
        detail: 'Hook, audience, and offer selected',
        state: 'complete',
    },
    {
        title: '2. Generate UGC brief',
        detail: 'Video script and shot list ready',
        state: 'complete',
    },
    {
        title: '3. Create social variants',
        detail: 'Instagram Reels, TikTok, and YouTube Shorts',
        state: 'active',
    },
    {
        title: '4. Schedule publishing',
        detail: 'Queued for review and send',
        state: 'pending',
    },
]

export const AgentTaskPlanningIllustration = () => {
    return (
        <div
            aria-hidden
            className="w-full min-w-0 max-w-[17rem] px-1 sm:max-w-[18rem] sm:px-2">
            <div className="bg-card ring-border-illustration shadow-black/6.5 min-w-0 overflow-hidden rounded-2xl p-4 shadow-lg ring-1 sm:p-5">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0 truncate text-sm font-semibold">Automated Marketing</div>
                    <div className="ml-auto shrink-0 whitespace-nowrap rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-500">Auto Posting</div>
                </div>

                <div className="bg-background ring-border-illustration mt-3 min-w-0 rounded-lg p-2.5 shadow shadow-black/5 ring-1">
                    <div className="text-muted-foreground text-[10px]">Goal</div>
                    <div className="mt-1 text-xs leading-snug">Turn a new listing into ready-to-review social content.</div>
                </div>

                <div className="mt-3 flex flex-col gap-1.5">
                    {marketingSteps.map((step) => {
                        if (step.state === 'active') {
                            return (
                                <div
                                    key={step.title}
                                    className="-mx-1 flex min-w-0 items-start gap-2 rounded-lg bg-indigo-500/10 p-2 ring-1 ring-indigo-300/70">
                                    <div className="relative mt-0.5 shrink-0">
                                        <CircleDashed
                                            className="size-4 animate-spin text-indigo-500"
                                            style={{ animationDuration: '3s' }}
                                        />
                                        <Play className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current text-indigo-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-semibold text-indigo-500">{step.title}</div>
                                        <div className="truncate text-[10px] text-indigo-500/70">In progress...</div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div
                                key={step.title}
                                className={cn('flex min-w-0 items-start gap-2', step.state === 'pending' && 'opacity-40')}>
                                {step.state === 'complete' ? (
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                                ) : (
                                    <CircleDashed
                                        className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className={cn('truncate text-xs font-medium', step.state === 'complete' && 'line-through opacity-50')}>{step.title}</div>
                                    <div className="text-muted-foreground truncate text-[10px]">
                                        {step.state === 'complete' ? 'Completed' : step.detail}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-2.5 flex min-w-0 items-center justify-between gap-3 text-[10px]">
                    <div className="text-muted-foreground min-w-0 truncate">2/4 tasks complete</div>
                    <div className="text-muted-foreground shrink-0 text-right">Ready soon</div>
                </div>
            </div>
        </div>
    )
}

export default AgentTaskPlanningIllustration
