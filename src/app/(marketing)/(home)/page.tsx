import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { PlatformFeatures } from '@/app/(marketing)/(home)/sections/platform-features'
import {
    AnalyticsFeatures,
    WhyRealaSection,
} from '@/app/(marketing)/(home)/sections/analytics-features'
import { Pricing } from '@/app/(marketing)/pricing/sections/pricing'
import { CallToAction } from '@/components/call-to-action'
import { Container } from '@/components/container'
import FAQs from '@/components/faqs-1'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { InfiniteGridBackground } from '@/components/ui/the-infinite-grid'
import { HeroDashboardMock } from '@/components/hero-dashboard-mock'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { AUDIT_ROUTE } from '@/lib/marketing/site-content'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function Home() {
    return (
        <>
            <section
                id="home"
                className="bg-muted/50 relative overflow-hidden border-b [--color-border:var(--border-illustration)]">
                <div className="relative pt-32 sm:pt-44">
                    <div className="absolute inset-x-0 -bottom-8 top-0 mx-auto max-w-7xl lg:-bottom-20">
                        <div className="absolute inset-x-0 inset-y-0 mx-auto max-w-7xl lg:px-6">
                            <div className="pointer-events-none absolute inset-x-2 bottom-0 top-19 overflow-hidden sm:inset-x-6 lg:inset-x-6">
                                <InfiniteGridBackground className="opacity-90 [mask-image:radial-gradient(78%_100%_at_50%_18%,white,rgba(255,255,255,0.9)_42%,rgba(255,255,255,0.42)_64%,transparent_86%)]" />
                            </div>
                            <div className="top-19 absolute inset-0 inset-x-2 border-x px-2 sm:px-6 lg:inset-x-6 lg:border-t">
                                <div className="sm:-top-19 mask-t-from-90% absolute inset-x-2 bottom-0 top-0 border-x sm:inset-x-6"></div>
                            </div>
                        </div>
                    </div>
                    <div className="relative mx-auto max-w-5xl px-6 pb-12 text-center">
                        <div className="relative mx-auto max-w-3xl text-center">
                            <AnimatedGroup variants={transitionVariants}>
                                <Link
                                    href="#why-reala"
                                    className="hover:bg-background group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border bg-card/90 p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 sm:mb-10">
                                    <span className="text-foreground text-sm">
                                        Why speed-to-lead needs a system
                                    </span>
                                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <h1 className="text-muted-foreground text-balance text-5xl font-medium tracking-tight sm:text-6xl">
                                    Turn real estate leads into <span className="text-foreground">booked conversations before they go cold.</span>
                                </h1>
                                <p className="text-muted-foreground mb-8 mt-6 text-balance text-lg">Reala starts with a focused lead response audit, then installs the AI reply, qualification, follow-up, and CRM handoff system that gets every inquiry moving fast.</p>
                            </AnimatedGroup>
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.55,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="flex flex-col items-center gap-3">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <RainbowButton
                                        asChild
                                        size="lg"
                                        className="min-w-56 rounded-md text-sm">
                                        <Link href="#why-reala">
                                            See Why Reala
                                        </Link>
                                    </RainbowButton>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="min-w-56 px-6 text-sm"
                                        render={<Link href={AUDIT_ROUTE} />}
                                        nativeButton={false}>
                                        View audit offer
                                    </Button>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    3 45-minute calls. Priority matrix included. Implementation stays optional.
                                </p>
                            </AnimatedGroup>
                        </div>
                    </div>
                </div>
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    delayChildren: 0.8,
                                },
                            },
                        },
                        item: {
                            hidden: {
                                opacity: 0,
                                filter: 'blur(12px)',
                                y: 24,
                            },
                            visible: {
                                opacity: 1,
                                filter: 'blur(0px)',
                                y: 0,
                                transition: {
                                    type: 'spring' as const,
                                    bounce: 0.2,
                                    duration: 1.7,
                                },
                            },
                        },
                    }}>
                    <Container className="**:data-[slot=content]:py-0 mt-8 bg-transparent sm:mt-20">
                        <div className="-mx-12 px-12">
                            <HeroDashboardMock />
                        </div>
                    </Container>
                </AnimatedGroup>
                <WhyRealaSection />
            </section>
            <AnalyticsFeatures />
            <PlatformFeatures />
            <Pricing />
            <FAQs />
            <CallToAction />
        </>
    )
}
