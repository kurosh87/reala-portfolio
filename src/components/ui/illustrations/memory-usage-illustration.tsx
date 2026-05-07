import { MemoryStick } from 'lucide-react'

export const MemoryUsageIllustration = () => (
    <div
        aria-hidden
        className="bg-illustration ring-border-illustration mx-auto w-full max-w-[15rem] rounded-2xl border border-transparent p-4 shadow shadow-black/10 ring-1">
        <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium">Usage</div>
            <MemoryStick className="text-muted-foreground size-4" />
        </div>
        <div className="space-y-3">
            <div className="rounded-xl border border-foreground/10 bg-background/70 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-medium">72%</span>
                </div>
                <div className="bg-foreground/10 h-2 rounded-full">
                    <div className="h-2 w-[72%] rounded-full bg-violet-500/80" />
                </div>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-background/70 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">48%</span>
                </div>
                <div className="bg-foreground/10 h-2 rounded-full">
                    <div className="h-2 w-[48%] rounded-full bg-emerald-500/80" />
                </div>
            </div>
        </div>
    </div>
)
