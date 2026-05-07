import { cn } from '@/lib/utils'

import { Openai as OpenAI } from '@/components/ui/svgs/openai'
import { Claude as ClaudeAI } from '@/components/ui/svgs/claude'
import { Gemini } from '@/components/ui/svgs/gemini'

import { Container } from '@/components/container'

export function IntegrationsSection() {
    return (
        <section>
            <Container>
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                        <span className="text-foreground font-mono text-sm uppercase">
                            <span className="text-muted-foreground">[03]</span> Integrations
                        </span>
                        <h2 className="text-foreground mt-6 text-balance text-4xl font-semibold lg:text-5xl">Connect all your preferred applications</h2>
                        <p className="text-muted-foreground text-balance text-lg">Tailark provides a seamless integration experience, allowing you to connect and synchronize data from multiple sources with ease.</p>
                    </div>
                </div>
            </Container>
            <Container className="**:data-[slot=content]:py-0">
                <div className="border-b">
                    <div className="relative mx-auto max-w-4xl border-x">
                        <div className="grid grid-cols-4 gap-0 *:relative *:flex *:aspect-square *:items-center *:justify-center sm:grid-cols-8 md:grid-cols-12">
                            <Integration isHighlighted>
                                <img
                                    alt="HubSpot"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/hubspot.svg?v=2"
                                />
                            </Integration>
                            <Integration
                                isHighlighted
                                className="col-start-3">
                                <Gemini className="size-6" />
                            </Integration>
                            <Integration className="col-start-5 max-sm:hidden lg:border-t-0">
                                <img
                                    alt="Gmail"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/gmail-2.svg?v=1"
                                />
                            </Integration>
                            <Integration className="col-start-7 max-sm:hidden lg:border-t-0">
                                <img
                                    alt="Google Sheets"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/google-sheets.svg?v=1"
                                />
                            </Integration>
                            <Integration
                                isHighlighted
                                className="col-start-9 max-md:hidden">
                                <img
                                    alt="WhatsApp"
                                    className="h-9 w-9 object-contain"
                                    loading="lazy"
                                    src="/integrations/whatsapp-alt.svg?v=1"
                                />
                            </Integration>
                            <Integration className="col-start-11 max-md:hidden lg:border-t-0">
                                <img
                                    alt="WordPress"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/wordpress.svg?v=1"
                                />
                            </Integration>
                            <Integration className="col-start-2 row-start-2 lg:border-b-0">
                                <OpenAI className="size-6" />
                            </Integration>
                            <Integration
                                isHighlighted
                                className="col-start-4 row-start-2">
                                <ClaudeAI className="size-6" />
                            </Integration>
                            <Integration
                                isHighlighted
                                className="col-start-6 row-start-2 max-sm:hidden">
                                <img
                                    alt="Google Docs"
                                    className="h-6 w-6 object-contain"
                                    loading="lazy"
                                    src="/integrations/google-docs-2.svg?v=1"
                                />
                            </Integration>
                            <Integration className="col-start-8 row-start-2 max-sm:hidden lg:border-b-0">
                                <img
                                    alt="Notion"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/notion-2.svg?v=1"
                                />
                            </Integration>
                            <Integration className="col-start-10 row-span-2 max-md:hidden lg:border-b-0">
                                <img
                                    alt="Google Drive"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/google-drive.svg?v=1"
                                />
                            </Integration>
                            <Integration
                                isHighlighted
                                className="col-start-12 row-start-2 max-md:hidden">
                                <img
                                    alt="Stripe"
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                    src="/integrations/stripe-4.svg?v=1"
                                />
                            </Integration>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

const Integration = ({ children, isHighlighted = false, className }: { children: React.ReactNode; isHighlighted?: boolean; className?: string }) => {
    return <div className={cn(isHighlighted ? 'bg-card ring-border-illustration shadow-black/6.5 shadow ring' : 'border-border-illustration bg-foreground/3 border *:size-6', className)}>{children}</div>
}
