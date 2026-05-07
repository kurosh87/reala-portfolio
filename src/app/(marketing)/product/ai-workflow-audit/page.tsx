import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import DescriptionList5 from '@/components/description-list-5'
import ExpandableFeatures from '@/components/expandable-features-3'
import HowItWorks4 from '@/components/how-it-works-4'
import { Container } from '@/components/container'
import { AuditCtaSection } from '@/components/marketing/page-shell'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Button } from '@/components/ui/button'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { InfiniteGridBackground } from '@/components/ui/the-infinite-grid'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

export const metadata = {
    title: 'AI Workflow Audit - Reala',
    description: 'Find the best AI opportunities inside your real estate business.',
}

const bestFit = [
    {
        title: 'Solo agents',
        description: 'You want leverage without bolting together five disconnected AI tools on your own.',
    },
    {
        title: 'Real estate teams',
        description: 'Your follow-up, CRM habits, and workflow ownership are inconsistent across the team.',
    },
    {
        title: 'Broker owners',
        description: 'You need practical AI adoption, not another generic training deck.',
    },
    {
        title: 'Ops-minded teams',
        description: 'You can already see the friction and want a cleaner system before building more.',
    },
]

const deliverables = [
    {
        title: 'AI opportunity map',
        description: 'A clear picture of the highest-value workflow opportunities inside your business.',
    },
    {
        title: 'Priority matrix',
        description: 'A practical order of operations for what to fix first, what needs cleanup, and what can wait.',
    },
    {
        title: 'Tool and CRM review',
        description: 'Guidance on what to keep, simplify, replace, or stop forcing into the wrong workflow.',
    },
    {
        title: '30-day roadmap',
        description: 'An implementation-minded next-step plan instead of a vague list of AI ideas.',
    },
]

const heroStats = [
    { label: 'Discovery call', value: '45 min' },
    { label: 'Founding price', value: '$997' },
    { label: 'Implementation', value: 'Optional' },
]

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

export default function AIWorkflowAuditPage() {
    return (
        <>
            <section className="bg-muted/50 relative overflow-hidden border-b [--color-border:var(--border-illustration)]">
                <div className="relative pt-32 sm:pt-44">
                    <div className="absolute inset-x-0 -bottom-8 top-0 mx-auto max-w-7xl lg:-bottom-20">
                        <div className="absolute inset-x-0 inset-y-0 mx-auto max-w-7xl lg:px-6">
                            <div className="pointer-events-none absolute inset-x-2 bottom-0 top-19 overflow-hidden sm:inset-x-6 lg:inset-x-6">
                                <InfiniteGridBackground className="opacity-90 [mask-image:radial-gradient(78%_100%_at_50%_18%,white,rgba(255,255,255,0.9)_42%,rgba(255,255,255,0.42)_64%,transparent_86%)]" />
                            </div>
                            <div className="top-19 absolute inset-0 inset-x-2 border-x px-2 sm:px-6 lg:inset-x-6 lg:border-t">
                                <div className="sm:-top-19 mask-t-from-90% absolute inset-x-2 bottom-0 top-0 border-x sm:inset-x-6" />
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto max-w-5xl px-6 pb-12 text-center">
                        <div className="relative mx-auto max-w-3xl text-center">
                            <AnimatedGroup variants={transitionVariants}>
                                <Link
                                    href="#audit-why"
                                    className="hover:bg-background group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border bg-card/90 p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 sm:mb-10">
                                    <span className="text-foreground text-sm">
                                        AI workflow audit for real estate teams
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
                                    Find where AI will actually <span className="text-foreground">move the real estate business forward.</span>
                                </h1>
                                <p className="text-muted-foreground mb-8 mt-6 text-balance text-lg">
                                    Reala reviews lead response, follow-up, CRM handoffs, content bottlenecks, and operations, then turns the messy list of AI ideas into a ranked roadmap.
                                </p>
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
                                        <Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS}>
                                            Book AI Workflow Audit
                                        </Link>
                                    </RainbowButton>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="min-w-56 px-6 text-sm"
                                        render={<Link href="#audit-why" />}
                                        nativeButton={false}>
                                        See what you get
                                    </Button>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    $997 founding price. 45-minute discovery. Implementation stays optional.
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
                            <AuditPreview />
                        </div>
                    </Container>
                </AnimatedGroup>
            </section>

            <section
                id="audit-why"
                className="scroll-mt-24 border-y bg-background">
                <Container className="**:data-[slot=content]:py-0">
                    <div className="grid gap-px lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="px-6 py-12 lg:px-10 lg:py-14">
                            <p className="text-primary text-sm font-medium tracking-[0.18em] uppercase">Best Fit</p>
                            <h2 className="text-foreground mt-4 text-balance text-4xl font-semibold tracking-tight">
                                The audit is for teams that need clarity before committing to a build.
                            </h2>
                            <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-8">
                                The point is to get specific about where AI creates lift, what needs cleanup first,
                                and whether implementation is actually worth the next investment.
                            </p>
                        </div>
                        <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
                            {bestFit.map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-background px-6 py-6">
                                    <p className="text-foreground text-lg font-semibold">{item.title}</p>
                                    <p className="text-muted-foreground mt-3 text-sm leading-6">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <DescriptionList5 />
            <HowItWorks4 />
            <ExpandableFeatures />

            <section className="bg-muted/30 py-24">
                <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                    <div className="flex flex-col gap-4">
                        <p className="text-primary text-sm font-medium tracking-[0.18em] uppercase">What You Receive</p>
                        <h2 className="text-foreground text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                            Deliverables that make implementation easier.
                        </h2>
                        <p className="text-muted-foreground text-lg leading-8">
                            The goal is to leave with a concrete path and the right order of operations, not a brainstorm.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-3xl border bg-background shadow-sm shadow-black/5">
                        {deliverables.map((item) => (
                            <div
                                key={item.title}
                                className="grid gap-3 border-b px-6 py-5 last:border-b-0 md:grid-cols-[15rem_1fr] md:gap-6">
                                <p className="text-foreground text-base font-semibold">{item.title}</p>
                                <p className="text-muted-foreground text-sm leading-6">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AuditCtaSection
                title="Ready to map the highest-leverage AI opportunities in your business?"
                description="Start with the audit, get specific about what matters, and then decide what is worth building."
            />
        </>
    )
}

function AuditPreview() {
    return (
        <div className="bg-card/95 ring-foreground/10 mx-auto max-w-5xl overflow-hidden rounded-md shadow-2xl shadow-black/10 ring-1">
            <div className="border-border/70 flex h-11 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                </div>
                <span className="text-muted-foreground text-xs">AI Workflow Audit</span>
            </div>
            <div className="grid gap-px bg-border/70 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="bg-background p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">Prepared for</p>
                            <h2 className="text-foreground mt-2 text-2xl font-semibold">Oakridge Realty</h2>
                        </div>
                        <div className="rounded-md border bg-card px-3 py-2 text-right">
                            <p className="text-muted-foreground text-xs">Priority</p>
                            <p className="text-foreground text-sm font-semibold">Speed-to-lead</p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {heroStats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-md border bg-card p-4">
                                <p className="text-muted-foreground text-xs">{stat.label}</p>
                                <p className="text-foreground mt-1 text-xl font-semibold tabular-nums">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <AuditScore
                            label="First response"
                            value="47 min avg"
                            target="Target: under 30s"
                            width="72%"
                        />
                        <AuditScore
                            label="CRM handoff"
                            value="Manual"
                            target="Target: clear owner + next task"
                            width="46%"
                        />
                        <AuditScore
                            label="Follow-up consistency"
                            value="Gaps found"
                            target="Target: every lead gets a next touch"
                            width="58%"
                        />
                    </div>
                </div>

                <div className="bg-background p-6 sm:p-8">
                    <div className="rounded-md border bg-card p-4 shadow-sm shadow-black/5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">Roadmap</p>
                                <h3 className="text-foreground mt-1 font-semibold">30-day implementation order</h3>
                            </div>
                            <CheckCircle2 className="text-primary size-5" />
                        </div>
                        <div className="mt-5 space-y-3">
                            {[
                                ['1', 'Connect lead sources', 'Website, portal, ad, and open-house forms'],
                                ['2', 'Install first reply flow', 'Draft or send the first response while intent is hot'],
                                ['3', 'Route the next step', 'Assign owner, CRM task, and follow-up sequence'],
                            ].map(([step, title, detail]) => (
                                <div
                                    key={step}
                                    className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border bg-background p-3">
                                    <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md text-xs font-medium tabular-nums">
                                        {step}
                                    </span>
                                    <div>
                                        <p className="text-foreground text-sm font-medium">{title}</p>
                                        <p className="text-muted-foreground mt-1 text-xs leading-5">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AuditScore({
    label,
    value,
    target,
    width,
}: {
    label: string
    value: string
    target: string
    width: string
}) {
    return (
        <div>
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground font-medium">{label}</span>
                <span className="text-muted-foreground">{value}</span>
            </div>
            <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                <div
                    className="from-primary h-full rounded-full bg-linear-to-r to-cyan-400"
                    style={{ width }}
                />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">{target}</p>
        </div>
    )
}
