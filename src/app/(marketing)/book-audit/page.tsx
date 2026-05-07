import { redirect } from 'next/navigation'
import { BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

export const metadata = {
    title: 'Book AI Workflow Audit - Reala',
    description: 'Book the Reala AI Workflow Audit.',
}

export default function BookAuditPage() {
    redirect(BOOK_AUDIT_ROUTE)
}
