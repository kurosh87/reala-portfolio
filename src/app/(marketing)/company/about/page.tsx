import { AuditCtaSection, InfoCardGrid, MarketingPageHero, MarketingSection } from '@/components/marketing/page-shell'
import { BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

export const metadata = {
    title: 'About - Reala',
    description: 'Helping real estate businesses turn AI into practical workflows.',
}

const beliefs = [
    {
        title: 'Why Reala exists',
        description: 'Most real estate businesses have experimented with AI, but very few have turned it into repeatable workflows that actually improve how the business runs.',
    },
    {
        title: 'What we believe',
        description: 'AI should support real follow-up, marketing, client communication, operations, and visibility. It should not create more tool sprawl or more hype.',
    },
    {
        title: 'How we work',
        description: 'Start with clarity. Audit the current workflow reality, identify the highest-leverage opportunities, then implement only what matters.',
    },
]

export default function AboutPage() {
    return (
        <>
            <MarketingPageHero
                eyebrow="Company"
                title="Helping real estate businesses turn AI into practical workflows."
                description="Reala exists to make AI useful inside the day-to-day operation of a real estate business, not just interesting in a prompt window."
                primaryCta={{ label: 'Book an AI Workflow Audit', href: BOOK_AUDIT_ROUTE }}
                secondaryCta={{ label: 'See What We Audit', href: '/product/ai-workflow-audit' }}
            />
            <MarketingSection
                eyebrow="About Reala"
                title="Practical AI, not platform theater"
                description="This page builds trust by explaining the company point of view, the real estate context, and why the audit-first model exists.">
                <InfoCardGrid items={beliefs} />
            </MarketingSection>
            <MarketingSection
                eyebrow="Focus"
                title="What Reala is optimizing for"
                description="Every engagement starts with how the business really operates today, then expands into implementation only if the workflow and economics make sense.">
                <div className="grid gap-4 md:grid-cols-2">
                    {['Lead follow-up and reactivation', 'Client communication and nurture', 'Marketing systems and content workflows', 'CRM cleanup, operations, and visibility'].map((item) => (
                        <div
                            key={item}
                            className="bg-card text-card-foreground rounded-2xl px-6 py-5 shadow-sm ring-1 ring-foreground/6.5">
                            <p className="text-lg font-medium">{item}</p>
                        </div>
                    ))}
                </div>
            </MarketingSection>
            <AuditCtaSection />
        </>
    )
}
