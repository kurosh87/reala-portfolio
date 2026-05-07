import Image from 'next/image'
import { Comparator } from '@/app/(marketing)/pricing/sections/comparator'
import { FAQs } from '@/app/(marketing)/pricing/sections/faqs'
import { Pricing } from '@/app/(marketing)/pricing/sections/pricing'
import { Container } from '@/components/container'
import { LogoCloud } from '@/components/logo-cloud'
import { AuditCtaSection } from '@/components/marketing/page-shell'

export const metadata = {
    title: 'Pricing - Reala',
    description: 'Start with an AI Workflow Audit. Build only what matters.',
}

export default function PricingPage() {
    return (
        <>
            <section className="overflow-hidden border-b bg-background">
                <div
                    aria-hidden
                    className="h-14 lg:h-[73px]"
                />
                <div className="relative">
                    <Container className="relative py-20 sm:py-24">
                        <div
                            aria-hidden
                            className="mask-x-from-70% mask-x-to-95% mask-y-from-75% pointer-events-none absolute inset-0 opacity-25 max-lg:opacity-20 2xl:mx-auto 2xl:max-w-7xl">
                            <Image
                                src="https://images.unsplash.com/photo-1676034833163-317f108e7a69?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt=""
                                aria-hidden
                                className="contrast-50 size-full -scale-x-100 object-cover brightness-90"
                                width={2224}
                                height={1589}
                            />
                        </div>
                        <div className="relative mx-auto max-w-3xl px-6 text-center">
                            <p className="text-primary text-sm font-medium tracking-[0.18em] uppercase">Pricing</p>
                            <h1 className="text-foreground mt-5 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                                Start with an audit. Build only what matters.
                            </h1>
                            <p className="text-muted-foreground mt-6 text-balance text-lg leading-8">
                                Reala starts with a fixed-price AI Workflow Audit, then gives you a clear implementation
                                path based on your business, CRM, follow-up process, and team size.
                            </p>
                        </div>
                    </Container>
                </div>
            </section>
            <Pricing />
            <LogoCloud />
            <Comparator />
            <FAQs />
            <AuditCtaSection />
        </>
    )
}
