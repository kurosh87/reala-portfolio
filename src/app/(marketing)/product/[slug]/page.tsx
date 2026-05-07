import { permanentRedirect } from 'next/navigation'

import { AUDIT_ROUTE } from '@/lib/marketing/site-content'

export async function generateStaticParams() {
    return []
}

export async function generateMetadata() {
    return {
        title: 'AI Workflow Audit - Reala',
        description: 'Start with the Reala AI Workflow Audit before building new automation.',
    }
}

export default function ProductRedirectPage() {
    permanentRedirect(AUDIT_ROUTE)
}
