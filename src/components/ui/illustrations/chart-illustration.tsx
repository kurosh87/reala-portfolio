import { BarChart3 } from 'lucide-react'

export const ChartIllustration = () => (
    <div
        aria-hidden
        className="bg-illustration ring-border-illustration mx-auto w-full max-w-[15rem] rounded-2xl border border-transparent p-4 shadow shadow-black/10 ring-1">
        <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium">Pipeline</div>
            <BarChart3 className="text-muted-foreground size-4" />
        </div>
        <div className="space-y-3">
            <div className="flex items-end gap-1">
                <div className="bg-sky-500/70 h-8 w-5 rounded-t-md" />
                <div className="bg-sky-500/70 h-12 w-5 rounded-t-md" />
                <div className="bg-sky-500/70 h-16 w-5 rounded-t-md" />
                <div className="bg-sky-500/70 h-10 w-5 rounded-t-md" />
                <div className="bg-sky-500/70 h-20 w-5 rounded-t-md" />
                <div className="bg-sky-500/70 h-14 w-5 rounded-t-md" />
            </div>
            <div className="space-y-1">
                <div className="bg-foreground/10 h-1.5 w-full rounded-full" />
                <div className="bg-foreground/10 h-1.5 w-2/3 rounded-full" />
            </div>
        </div>
    </div>
)
