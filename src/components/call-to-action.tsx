import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/container'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

export function CallToAction() {
    return (
        <section
            id="contact"
            className="relative scroll-mt-28">
            <Container className="**:data-[slot=content]:bg-linear-to-b **:data-[slot=content]:from-blue-400 **:data-[slot=content]:to-indigo-500 **:data-[slot=content]:py-0 relative">
                <div
                    aria-hidden
                    className="dither-xs mask-x-from-65% mask-x-to-95% mask-y-from-75% pointer-events-none absolute inset-0 mix-blend-darken 2xl:mx-auto 2xl:max-w-7xl">
                    <div className="size-full">
                        <Image
                            src="https://images.unsplash.com/photo-1632314813226-fc0ac70d8569?q=80&w=2352&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="size-full -scale-x-100 object-cover"
                            width={2224}
                            height={1589}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
                        />
                    </div>
                </div>
                <div
                    data-theme="dark"
                    className="relative overflow-hidden pl-8 pt-8 md:p-20">
                    <div className="max-w-xl max-md:pr-8">
                        <div className="relative">
                            <span className="text-foreground/75 font-mono text-sm uppercase">
                                Audit first. Speed-to-lead next.
                            </span>
                            <h2 className="text-foreground mt-4 text-balance text-4xl font-semibold lg:text-5xl">
                                Book the audit that shows where leads go cold.
                            </h2>
                            <p className="text-foreground/80 mb-6 mt-4 text-balance text-lg">
                                Then we build the reply, qualification, follow-up, and CRM system that turns new inquiries into booked conversations.
                            </p>
                            <Button
                                render={<Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS} />}
                                nativeButton={false}>
                                Book AI Workflow Audit
                            </Button>
                        </div>
                    </div>
                    <div
                        data-theme="quartz"
                        className="max-lg:mask-b-from-35% max-lg:pt-6 max-md:mt-4 lg:absolute lg:inset-0 lg:top-12 lg:ml-auto lg:w-2/5">
                        <div className="bg-card ring-border-illustration shadow-black/6.5 overflow-hidden rounded-tl-2xl rounded-bl-2xl shadow-2xl ring-1 lg:h-full">
                            <div className="border-border/60 flex h-8 items-center gap-2 border-b px-4">
                                <span className="bg-muted-foreground/25 size-2 rounded-full" />
                                <span className="bg-muted-foreground/25 size-2 rounded-full" />
                                <span className="bg-muted-foreground/25 size-2 rounded-full" />
                            </div>
                            <div className="relative min-h-[22rem] lg:h-[calc(100%-2rem)]">
                                <Image
                                    src="/reala-dashboard-hero.webp"
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="(min-width: 1024px) 560px, 90vw"
                                    className="object-cover object-left-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="border-b" />
        </section>
    )
}
