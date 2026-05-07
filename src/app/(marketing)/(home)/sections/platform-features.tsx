import { MobileAiSuggestionIllustration } from '@/components/illustrations/mobile-ai-suggestion'
import { ChatIllustration } from '@/components/illustrations/chat-illustration'
import { Flow13Illustration } from '@/components/illustrations/flow-13'
import { ModelTrainingIllustration } from '@/components/illustrations/model-training'
import { Notes2Illustration } from '@/components/illustrations/notes-2'

import { Container } from '@/components/container'
import { cn } from '@/lib/utils'

export function PlatformFeatures() {
    return (
        <section
            id="how-it-works"
            className="scroll-mt-28">
            <Container>
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                        <span className="text-foreground font-mono text-sm uppercase">
                            <span className="text-foreground/50">[ 02 ]</span> How It Works
                        </span>
                        <h2 className="text-foreground mt-6 text-balance text-4xl font-semibold lg:text-5xl">How the speed-to-lead system works</h2>
                        <p className="text-muted-foreground text-balance text-lg">A lead arrives. Reala replies in 30 seconds, qualifies, routes, follows up, and updates the CRM while the agent gets the signal.</p>
                    </div>
                </div>
            </Container>
            <Container className="**:data-[slot=content]:py-0 border-foreground/10 border-dashed">
                <div className="divide-foreground/10 @4xl:grid-cols-4 @4xl:divide-y-0 @4xl:*:p-8 @5xl:*:p-12 grid grid-cols-2 divide-y overflow-hidden *:p-4">
                    <div className="@4xl:col-span-2 col-span-full row-span-2 grid gap-8 border-r-0 [grid-template-rows:minmax(26rem,1fr)_auto]">
                        <div
                            aria-hidden
                            className="flex w-full min-w-0 items-center justify-center overflow-visible">
                            <Flow13Illustration />
                        </div>
                        <div className="relative z-10 w-full self-end text-left">
                            <h3 className="font-semibold">Lead Capture</h3>
                            <p className="text-muted-foreground mt-3">The instant a lead comes in from WordPress, RealtyNinja, or any other platform, Reala sends the first response within 30 seconds.</p>
                        </div>
                    </div>
                    <div className="border-foreground/10 @4xl:col-span-2 col-span-full row-span-2 grid gap-8 border-r-0 @4xl:border-l [grid-template-rows:minmax(19rem,1fr)_auto]">
                        <div className="mx-auto self-end">
                            <MobileAiSuggestionIllustration />
                        </div>
                        <div className="relative z-10 w-full self-end text-left">
                            <h3 className="font-semibold">Instant Response System</h3>
                            <p className="text-muted-foreground mt-3">Reala reads the source, intent, and urgency, then drafts the first reply and next step before the lead cools off.</p>
                        </div>
                    </div>

                </div>
            </Container>
            <Container className="**:data-[slot=content]:bg-background max-lg:**:data-[slot=content]:px-6 **:data-[slot=content]:py-0 border-dashed">
                <div className="@container w-full pb-0">
                    <div className="relative">
                        <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
                        <PlusDecorator className="right-0 -translate-y-[calc(50%-0.5px)] translate-x-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 right-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                        <div className="@2xl:grid-cols-2 @5xl:grid-cols-3 grid [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] *:grid *:min-w-0 *:grid-rows-[minmax(16rem,1fr)_auto] *:gap-8 *:p-6 @md:*:p-8">
                            <div className="border-b @2xl:border-r">
                                <div
                                    aria-hidden
                                    className="flex w-full min-w-0 items-center justify-center overflow-hidden">
                                    <ChatIllustration
                                        prompt="Is the Willow Glen open house still available? I can come by this afternoon."
                                        response="Yes, the home is available. I can meet you this afternoon and send showing details now."
                                    />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-semibold">AI First Reply</h3>
                                    <p className="text-muted-foreground mt-2">Send or draft the first response with the right context, questions, and tone.</p>
                                </div>
                            </div>
                            <div className="border-b @5xl:border-r">
                                <div
                                    aria-hidden
                                    className="flex w-full min-w-0 items-center justify-center overflow-hidden">
                                    <ModelTrainingIllustration />
                                </div>

                                <div>
                                    <h3 className="text-foreground font-semibold">Lead Capture</h3>
                                    <p className="text-muted-foreground mt-2">Bring website, portal, ad, open-house, and valuation inquiries into one operating view.</p>
                                </div>
                            </div>
                            <div className="border-b @2xl:border-r @5xl:border-r">
                                <div
                                    aria-hidden
                                    className="flex w-full min-w-0 items-center justify-center overflow-visible">
                                    <Notes2Illustration />
                                </div>

                                <div>
                                    <h3 className="text-foreground font-semibold">Client Shortlist</h3>
                                    <p className="text-muted-foreground mt-2">AI packages the best-fit homes into a clear shortlist for the buyer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

const PlusDecorator = ({ className }: { className?: string }) => (
    <div
        aria-hidden
        className={cn('mask-radial-from-15% before:bg-foreground/25 after:bg-foreground/25 absolute size-3 before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px', className)}
    />
)
