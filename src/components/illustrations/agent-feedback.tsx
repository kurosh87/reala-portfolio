import { CheckCircle2, RefreshCw, Send } from 'lucide-react'

export const AgentFeedbackIllustration = () => {
    return (
        <div
            aria-hidden
            className="min-w-xs">
            <div className="bg-card ring-border-illustration shadow-black/6.5 rounded-2xl p-5 shadow-lg ring-1">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold">Automated Marketing Run</div>
                        <div className="text-muted-foreground mt-1 text-[11px]">Listing content routed to social channels</div>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 rounded-full px-2 py-1 text-[10px] font-medium ring-1 dark:text-emerald-400">
                        Live
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="relative">
                        <div className="bg-illustration/70 ring-border-illustration flex items-start gap-3 rounded-xl p-3 shadow-sm ring-1">
                            <div className="bg-background ring-border-illustration flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold shadow-sm ring-1">1</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-semibold">Launch campaign</div>
                                    <div className="text-muted-foreground text-[10px]">content brief</div>
                                </div>
                                <div className="bg-background/80 ring-border-illustration mt-2 rounded-lg px-2.5 py-2 font-mono text-[10px] shadow-inner ring-1">
                                    <span className="text-muted-foreground">curl -X POST </span>
                                    <span className="text-emerald-600 dark:text-emerald-400">/api/socials</span>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5 fill-emerald-500/10 text-emerald-500" />
                                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">UGC video queued for review</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-border absolute -bottom-3 left-6 top-full border-l border-dashed"></div>
                    </div>

                    <div className="relative">
                        <div className="bg-illustration/70 ring-border-illustration flex items-start gap-3 rounded-xl p-3 shadow-sm ring-1">
                            <div className="bg-background ring-border-illustration flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold shadow-sm ring-1">2</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-semibold">Route creative</div>
                                    <div className="text-muted-foreground text-[10px]">3 channels</div>
                                </div>
                                <div className="bg-background/80 ring-border-illustration mt-2 rounded-lg p-2 shadow-inner ring-1">
                                    <div className="space-y-1.5 border-l-2 border-sky-500 py-1 pl-2 pr-1">
                                        <div className="flex items-center gap-1.5">
                                            <Send className="size-3.5 fill-sky-500/15 text-sky-600 dark:text-sky-400" />
                                            <div className="text-[11px] font-semibold text-sky-900 dark:text-sky-300">Distribution plan</div>
                                        </div>

                                        <div className="text-muted-foreground text-[11px]">Instagram Reels, TikTok, and story variants</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-border absolute -bottom-3 left-6 top-full border-l border-dashed"></div>
                    </div>

                    <div className="bg-illustration/70 ring-border-illustration flex items-start gap-3 rounded-xl p-3 shadow-sm ring-1">
                        <div className="bg-background ring-border-illustration flex size-6 shrink-0 items-center justify-center rounded-full shadow-sm ring-1">
                            <RefreshCw
                                className="size-3 animate-spin text-violet-500"
                                style={{ animationDuration: '2s' }}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-xs font-semibold">Publish via API</div>
                                <div className="text-violet-600 text-[10px] font-medium dark:text-violet-400">queued</div>
                            </div>
                            <div className="mt-2 rounded-lg bg-violet-500/5 px-2.5 py-2 font-mono text-[10px] shadow-inner ring-1 ring-violet-500/20">
                                <span className="text-muted-foreground">POST </span>
                                <span className="text-violet-600 dark:text-violet-400">/v1/ugc/publish</span>
                                <span className="text-muted-foreground"> --schedule now</span>
                            </div>
                            <div className="mt-2 flex items-center gap-1">
                                <span className="text-muted-foreground text-[11px]">Posting copy, captions, and creative variants.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgentFeedbackIllustration
