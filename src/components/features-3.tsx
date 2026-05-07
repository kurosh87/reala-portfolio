import { MessageIllustration } from "@/components/ui/illustrations/message-illustration"
import { PollIllustration } from "@/components/ui/illustrations/poll-illustration"
import { UptimeIllustration } from "@/components/ui/illustrations/uptime-illustration"

export default function FeaturesSection() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
                <div className="@max-4xl:max-w-sm ring-border overflow-hidden bg-card/50 mx-auto rounded-2xl border border-transparent shadow-md shadow-black/5 ring-1">
                    <div className="@4xl:grid-cols-3 @max-4xl:divide-y @4xl:divide-x grid">
                        <div className="row-span-2 grid grid-rows-subgrid gap-8 p-8">
                            <div className="mx-auto max-w-56 self-center">
                                <MessageIllustration />
                            </div>
                            <div className="mx-auto max-w-sm text-center">
                                <h3 className="text-balance font-semibold">Speed-to-lead coverage</h3>
                                <p className="text-muted-foreground mt-3 text-balance">Reply to new inquiries fast with AI-assisted first response and handoff.</p>
                            </div>
                        </div>
                        <div className="row-span-2 grid grid-rows-subgrid gap-8 p-8">
                            <div className="self-center">
                                <UptimeIllustration />
                            </div>
                            <div className="relative z-10 mx-auto max-w-sm text-center">
                                <h3 className="text-balance font-semibold">CRM follow-up</h3>
                                <p className="text-muted-foreground mt-3 text-balance">Keep stages, tasks, and next steps from slipping through the cracks.</p>
                            </div>
                        </div>
                        <div className="row-span-2 grid grid-rows-subgrid gap-8 p-8">
                            <div className="mx-auto self-center">
                                <PollIllustration />
                            </div>
                            <div className="relative z-10 mx-auto max-w-sm text-center">
                                <h3 className="text-balance font-semibold">Marketing output</h3>
                                <p className="text-muted-foreground mt-3 text-balance">Turn listing details into posts, emails, and launch content faster.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
