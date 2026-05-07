import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/container'
import DescriptionList5 from '@/components/description-list-5'
import ExpandableFeatures from '@/components/expandable-features-3'
import FeaturesSection from '@/components/features-3'
import HowItWorks4 from '@/components/how-it-works-4'
import { AUDIT_ROUTE, BOOK_AUDIT_ROUTE, type StubPageContent } from '@/lib/marketing/site-content'

type CtaLink = {
    label: string
    href: string
}

type HeroProps = {
    eyebrow?: string
    title: string
    description: string
    primaryCta?: CtaLink
    secondaryCta?: CtaLink
    aside?: React.ReactNode
}

function externalLinkProps(href: string) {
    return href.startsWith('http')
        ? {
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : {}
}

type SectionProps = {
    eyebrow?: string
    title: string
    description?: string
    children: React.ReactNode
}

export type InfoCardItem = {
    title: string
    description: string
    bullets?: string[]
}

export function MarketingPageHero({
    eyebrow,
    title,
    description,
    primaryCta,
    secondaryCta,
    aside,
}: HeroProps) {
    return (
        <section className="bg-muted/50 border-b">
            <div
                aria-hidden
                className="h-14 lg:h-[73px]"
            />
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center lg:py-24">
                <div className="max-w-3xl">
                    {eyebrow ? (
                        <p className="text-primary mb-4 text-sm font-medium tracking-[0.18em] uppercase">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h1 className="text-foreground text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-8">{description}</p>
                    {(primaryCta || secondaryCta) ? (
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {primaryCta ? (
                                <Button
                                    size="lg"
                                    className="px-6"
                                    render={<Link href={primaryCta.href} {...externalLinkProps(primaryCta.href)} />}
                                    nativeButton={false}>
                                    {primaryCta.label}
                                </Button>
                            ) : null}
                            {secondaryCta ? (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-6"
                                    render={<Link href={secondaryCta.href} {...externalLinkProps(secondaryCta.href)} />}
                                    nativeButton={false}>
                                    {secondaryCta.label}
                                </Button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                {aside ? <div>{aside}</div> : null}
            </div>
        </section>
    )
}

export function MarketingSection({ eyebrow, title, description, children }: SectionProps) {
    return (
        <Container>
            <div className="mx-auto max-w-6xl px-4">
                <div className="max-w-3xl">
                    {eyebrow ? (
                        <p className="text-primary mb-4 text-sm font-medium tracking-[0.18em] uppercase">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h2 className="text-foreground text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        {title}
                    </h2>
                    {description ? <p className="text-muted-foreground mt-4 text-lg leading-8">{description}</p> : null}
                </div>
                <div className="mt-10">{children}</div>
            </div>
        </Container>
    )
}

export function InfoCardGrid({
    items,
    columns = 3,
}: {
    items: InfoCardItem[]
    columns?: 2 | 3 | 4
}) {
    const columnClass =
        columns === 2
            ? 'lg:grid-cols-2'
            : columns === 4
              ? 'md:grid-cols-2 xl:grid-cols-4'
              : 'md:grid-cols-2 xl:grid-cols-3'

    return (
        <div className={`grid gap-4 ${columnClass}`}>
            {items.map((item) => (
                <Card
                    key={item.title}
                    className="h-full rounded-2xl border border-transparent shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                    </CardHeader>
                    {item.bullets?.length ? (
                        <CardContent>
                            <ul className="space-y-3 text-sm leading-6">
                                {item.bullets.map((bullet) => (
                                    <li
                                        key={bullet}
                                        className="text-muted-foreground flex gap-3">
                                        <span className="text-primary mt-1.5 block size-1.5 rounded-full bg-current" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    ) : null}
                </Card>
            ))}
        </div>
    )
}

export function AuditCtaSection({
    title = 'Ready to find the best AI opportunities in your real estate business?',
    description = 'Start with the Reala AI Workflow Audit and build only what matters.',
    primaryLabel = 'Book an AI Workflow Audit',
    primaryHref = BOOK_AUDIT_ROUTE,
    secondaryLabel = 'See What We Audit',
    secondaryHref = AUDIT_ROUTE,
}: {
    title?: string
    description?: string
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
}) {
    return (
        <Container className="**:data-[slot=content]:bg-linear-to-br **:data-[slot=content]:from-zinc-950 **:data-[slot=content]:to-zinc-800">
            <div className="mx-auto max-w-5xl px-4 text-center text-white">
                <p className="mb-4 text-sm font-medium tracking-[0.18em] uppercase text-zinc-300">Get Started</p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{description}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-white text-zinc-950 hover:bg-zinc-100"
                        render={<Link href={primaryHref} {...externalLinkProps(primaryHref)} />}
                        nativeButton={false}>
                        {primaryLabel}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                        render={<Link href={secondaryHref} {...externalLinkProps(secondaryHref)} />}
                        nativeButton={false}>
                        {secondaryLabel}
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export function StubLandingPage({ page }: { page: StubPageContent }) {
    return (
        <>
            <MarketingPageHero
                eyebrow={page.eyebrow}
                title={page.title}
                description={page.description}
                primaryCta={{ label: page.ctaLabel, href: BOOK_AUDIT_ROUTE }}
                secondaryCta={{ label: 'See the Audit Offer', href: AUDIT_ROUTE }}
                aside={
                    <Card className="rounded-3xl border border-transparent shadow-xl shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl">Workflow examples</CardTitle>
                            <CardDescription className="text-base leading-7">
                                Each stub page stays intentional by showing how the topic connects back to the audit and eventual implementation path.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm leading-6">
                                {page.examples.slice(0, 3).map((example) => (
                                    <li
                                        key={example}
                                        className="text-muted-foreground flex gap-3">
                                        <ChevronRight className="text-primary mt-1 size-4 shrink-0" />
                                        <span>{example}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                }
            />
            <DescriptionList5 />
            <FeaturesSection />
            <HowItWorks4 />
            <Container className="pt-0">
                <div className="mx-auto max-w-5xl px-4">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-primary text-sm font-medium tracking-[0.18em] uppercase">{page.eyebrow ?? 'Product'}</p>
                            <h2 className="text-foreground mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Example workflows for this page</h2>
                        </div>
                        <Button
                            size="lg"
                            render={<Link href={BOOK_AUDIT_ROUTE} {...externalLinkProps(BOOK_AUDIT_ROUTE)} />}
                            nativeButton={false}>
                            {page.ctaLabel}
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {page.examples.map((example, index) => (
                            <Card
                                key={example}
                                className="rounded-2xl border border-transparent shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Workflow {index + 1}</CardTitle>
                                    <CardDescription className="text-base leading-7">{example}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
            <ExpandableFeatures />
            <AuditCtaSection
                primaryLabel={page.ctaLabel}
                secondaryLabel="Back to AI Workflow Audit"
                secondaryHref={AUDIT_ROUTE}
            />
        </>
    )
}
