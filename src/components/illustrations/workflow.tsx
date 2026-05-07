import { CheckCircle2, ChevronDown, ListChecks, Megaphone, MessageSquareText } from 'lucide-react'
import { cn } from '@/lib/utils'

const workflows = [
    {
        icon: MessageSquareText,
        title: 'Speed-to-lead SMS journey',
        meta: 'first priority',
        open: true,
        steps: [
            { title: 'Connect the lead source', detail: 'Website, portal, or open house form' },
            { title: 'Match lead to listing', detail: 'Identify property, intent, and agent owner' },
            { title: 'Draft the SMS reply', detail: 'Alex gets the exact response to approve or send' },
            { title: 'Route the next step', detail: 'Book showing, tag CRM, and trigger follow-up' },
        ],
    },
    {
        icon: ListChecks,
        title: 'CRM AI follow-up',
        meta: '',
        open: false,
    },
    {
        icon: Megaphone,
        title: 'Listing content autopilot',
        meta: '',
        open: false,
    },
]

export const WorkflowIllustration = ({ className }: { className?: string }) => {
    return (
        <div
            aria-hidden
            className={cn('mask-b-from-75% mx-auto min-w-0 max-w-full', className)}>
            <div className="relative mx-auto w-full min-w-0 overflow-visible pb-14">
                <div className="bg-illustration ring-border-illustration shadow-black/6.5 relative z-10 flex items-center gap-2 rounded-xl p-3 shadow-md ring-1">
                    <CheckCircle2 className="size-4 fill-emerald-500/15 text-emerald-500" />
                    <span className="text-foreground text-sm font-medium">3 suggested workflows</span>
                </div>

                <div className="relative flex min-w-0 flex-col gap-3 pt-5 pl-5 sm:pl-6">
                    <div className="border-foreground/15 absolute bottom-0 left-0 top-0 border-l border-dashed" />
                    {workflows.map((workflow) => {
                        const Icon = workflow.icon

                        return (
                            <div
                                key={workflow.title}
                                className="relative min-w-0 pl-4 sm:pl-5">
                                <div className="border-foreground/15 absolute -left-5 bottom-1/2 top-0 w-9 rounded-bl-full border-b border-l border-dashed sm:-left-6 sm:w-11" />
                                <div
                                    className={cn(
                                        'ring-border-illustration border-border/60 after:border-border/70 relative mr-1 rounded-2xl border py-2 pl-3 pr-2 ring-1 transition-colors after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:border',
                                        workflow.open ? 'bg-card shadow-sm' : 'bg-card/20 shadow'
                                    )}>
                                    <div className="flex items-start gap-2.5">
                                        <Icon className="stroke-primary mt-0.5 size-3.5 shrink-0 fill-indigo-500/20" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-muted-foreground text-xs font-medium">
                                                    {workflow.title}
                                                    {workflow.meta ? <span className="text-foreground/50 pl-0.5">{workflow.meta}</span> : null}
                                                </span>
                                                <ChevronDown
                                                    className={cn(
                                                        'text-muted-foreground mt-0.5 size-3.5 shrink-0 transition-transform',
                                                        workflow.open ? 'rotate-180' : ''
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {workflow.open && workflow.steps ? (
                                        <div className="bg-illustration border-border/50 mt-2 space-y-1 rounded-xl border p-1.5">
                                            {workflow.steps.map((step, index) => (
                                                <div
                                                    key={step.title}
                                                    className="flex items-start gap-1.5 rounded-lg p-1.5">
                                                    <div className="border-primary/30 bg-primary/10 text-primary flex size-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-foreground/80 truncate text-[10px] font-medium">{step.title}</div>
                                                        <div className="text-muted-foreground truncate text-[9px]">{step.detail}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />
            </div>
        </div>
    )
}

export default WorkflowIllustration
