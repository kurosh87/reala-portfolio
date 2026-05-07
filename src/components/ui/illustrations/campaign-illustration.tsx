import { SendHorizontal } from 'lucide-react'

export const CampaignIllustration = () => (
    <div
        aria-hidden
        className="bg-illustration ring-border-illustration mx-auto w-full max-w-[18rem] rounded-2xl border border-transparent p-4 shadow shadow-black/10 ring-1">
        <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium">Campaign</div>
            <SendHorizontal className="text-muted-foreground size-4" />
        </div>
        <div className="space-y-3">
            <div className="rounded-xl border border-foreground/10 bg-background/70 p-3">
                <div className="bg-foreground/10 mb-2 h-1.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-1.5 w-full rounded-full" />
                <div className="bg-foreground/10 mt-1.5 h-1.5 w-2/3 rounded-full" />
            </div>
            <div className="rounded-xl border border-foreground/10 bg-background/70 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Open rate</span>
                    <span className="font-medium">43%</span>
                </div>
                <div className="bg-foreground/10 h-2 rounded-full">
                    <div className="h-2 w-[43%] rounded-full bg-cyan-500/80" />
                </div>
            </div>
        </div>
    </div>
)
