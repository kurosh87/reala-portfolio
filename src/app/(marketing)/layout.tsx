import type { Metadata } from 'next'
import { CalendlyBookingSheet } from '@/components/calendly-booking-sheet'
import { MarketingHeader } from '@/components/marketing-header'
import { MarketingFooter } from '@/components/marketing-footer'

export const metadata: Metadata = {
    title: 'AI Workflow Audit for Real Estate Teams',
    description: 'Audit where leads go cold, then build the response, follow-up, and CRM workflows that move faster.',
}

export default function MarketingLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <MarketingHeader />
            <main
                role="main"
                className="bg-background">
                {children}
            </main>
            <MarketingFooter />
            <CalendlyBookingSheet />
        </>
    )
}
