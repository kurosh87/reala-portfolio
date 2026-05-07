import { CalendarCheck, CheckCircle2, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE, DISCOVERY_CALL_ROUTE } from '@/lib/marketing/site-content'

export const metadata = {
    title: 'Contact - Reala',
    description: 'Contact Reala about your AI workflow audit or implementation needs.',
}

const benefits = [
    'AI workflow audit scoping',
    'Lead response and CRM review',
    'Implementation planning',
    'Follow-up system recommendations',
]

const CONTACT_EMAIL = 'contact@reala.agency'
const DEFAULT_RESEND_FROM_EMAIL = 'contact@mail.reala.agency'

const contactInquirySchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    team: z.string().trim().optional(),
    tools: z.string().trim().optional(),
    website: z.string().trim().optional(),
    message: z.string().trim().min(1),
})

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

async function submitContactInquiry(formData: FormData) {
    'use server'

    const parsed = contactInquirySchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        team: formData.get('team'),
        tools: formData.get('tools'),
        website: formData.get('website'),
        message: formData.get('message'),
    })

    if (!parsed.success) {
        redirect('/company/contact?contact=invalid')
    }

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        redirect('/company/contact?contact=missing-resend')
    }

    const inquiry = parsed.data
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL
    const toEmail = process.env.RESEND_CONTACT_TO || CONTACT_EMAIL
    const resend = new Resend(apiKey)
    const submittedAt = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/Vancouver',
    })

    const rows = [
        ['Name', inquiry.name],
        ['Email', inquiry.email],
        ['Team size', inquiry.team || 'Not provided'],
        ['CRM / tools', inquiry.tools || 'Not provided'],
        ['Website / lead source', inquiry.website || 'Not provided'],
        ['Submitted', submittedAt],
    ]

    const text = [
        'New Reala contact inquiry',
        '',
        ...rows.map(([label, value]) => `${label}: ${value}`),
        '',
        'Message:',
        inquiry.message,
    ].join('\n')

    const html = `
        <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.5;">
            <h1 style="font-size: 20px; margin: 0 0 16px;">New Reala contact inquiry</h1>
            <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
                <tbody>
                    ${rows
                        .map(
                            ([label, value]) => `
                                <tr>
                                    <td style="border: 1px solid #e5e7eb; padding: 8px 10px; color: #6b7280; width: 180px;">${escapeHtml(label)}</td>
                                    <td style="border: 1px solid #e5e7eb; padding: 8px 10px;">${escapeHtml(value)}</td>
                                </tr>
                            `,
                        )
                        .join('')}
                </tbody>
            </table>
            <h2 style="font-size: 16px; margin: 20px 0 8px;">Message</h2>
            <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(inquiry.message)}</p>
        </div>
    `

    const result = await resend.emails.send({
        from: `Reala Contact <${fromEmail}>`,
        to: toEmail,
        replyTo: inquiry.email,
        subject: `New contact inquiry from ${inquiry.name}`,
        text,
        html,
    })

    if (result.error) {
        console.error('Resend contact inquiry failed', result.error)
        redirect('/company/contact?contact=send-error')
    }

    redirect('/company/contact?contact=sent')
}

export default async function ContactPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = searchParams ? await searchParams : undefined
    const contactStatus = Array.isArray(params?.contact) ? params.contact[0] : params?.contact

    return (
        <section className="bg-background pt-28">
            <div className="mx-auto max-w-7xl px-2 lg:px-6">
                <div className="border-x border-t px-2 sm:px-6">
                    <div className="@container border-x py-3">
                        <span className="text-muted-foreground px-6 font-mono text-sm uppercase lg:px-12">Contact</span>
                    </div>

                    <div className="@container border-x border-t">
                        <div className="@4xl:grid-cols-2 grid divide-y @4xl:divide-x @4xl:divide-y-0">
                            <div className="p-6 lg:p-12">
                                <h1 className="text-foreground max-w-xl text-balance text-5xl font-semibold tracking-tight">
                                    Ready to fix where your leads go cold?
                                </h1>
                                <p className="text-muted-foreground mt-6 max-w-xl text-balance text-lg">
                                    Tell us what is slowing down response, qualification, follow-up, or CRM handoff. We will help you decide whether an AI Workflow Audit is the right next step.
                                </p>

                                <ul className="mt-8 flex flex-col gap-3">
                                    {benefits.map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-center gap-3">
                                            <CheckCircle2 className="size-4 shrink-0 fill-emerald-400/25 text-emerald-600" />
                                            <span className="text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="text-muted-foreground mt-8 text-sm">
                                    Want to skip the back-and-forth?{' '}
                                    <Link
                                        href={BOOK_AUDIT_ROUTE}
                                        {...BOOK_AUDIT_LINK_PROPS}
                                        className="text-primary font-medium hover:underline">
                                        Book the audit directly
                                    </Link>
                                </div>

                                <div className="mt-12 flex flex-col gap-6">
                                    <div>
                                        <h3 className="text-muted-foreground text-sm">Email</h3>
                                        <Link
                                            href={`mailto:${CONTACT_EMAIL}?subject=Reala%20Contact%20Request`}
                                            className="text-foreground hover:decoration-primary inline-flex items-center gap-2 text-sm font-medium hover:underline">
                                            <Mail className="size-4" />
                                            {CONTACT_EMAIL}
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 className="text-muted-foreground text-sm">Booking</h3>
                                        <Link
                                            href={BOOK_AUDIT_ROUTE}
                                            {...BOOK_AUDIT_LINK_PROPS}
                                            className="text-foreground hover:decoration-primary inline-flex items-center gap-2 text-sm font-medium hover:underline">
                                            <CalendarCheck className="size-4" />
                                            Book an AI Workflow Audit
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 className="text-muted-foreground text-sm">Focus</h3>
                                        <p className="text-foreground inline-flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="size-4" />
                                            Real estate teams and solo agents
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 lg:p-12">
                                <h2 className="text-foreground font-medium">Talk to Reala</h2>
                                <p className="text-muted-foreground mb-12 mt-2 text-sm">
                                    Share the basics and we will point you toward the right audit or implementation path.
                                </p>

                                {contactStatus ? (
                                    <div
                                        role="status"
                                        className={`mb-6 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                                            contactStatus === 'sent' ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-border bg-card'
                                        }`}>
                                        {contactStatus === 'sent' ? <CheckCircle2 className="size-4 shrink-0 fill-emerald-400/25 text-emerald-600" /> : null}
                                        <span>
                                            {contactStatus === 'sent' ? 'Thanks. Your inquiry was sent to Reala.' : null}
                                            {contactStatus === 'invalid' ? 'Please add your name, a valid email, and a message.' : null}
                                            {contactStatus === 'missing-resend' ? 'Resend is not configured yet. Add RESEND_API_KEY to the environment to enable contact form delivery.' : null}
                                            {contactStatus === 'send-error' ? 'The inquiry could not be sent. Please email contact@reala.agency directly.' : null}
                                        </span>
                                    </div>
                                ) : null}

                                <form
                                    action={submitContactInquiry}
                                    className="relative flex flex-col gap-6">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="name">Full name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                type="text"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="email">Work email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                required
                                                type="email"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="team">Team size</Label>
                                            <Input
                                                id="team"
                                                name="team"
                                                placeholder="Solo, team, brokerage"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="tools">CRM / tools</Label>
                                            <Input
                                                id="tools"
                                                name="tools"
                                                placeholder="FUB, HubSpot, Zapier"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="website">Website or lead source</Label>
                                        <div className="relative">
                                            <Input
                                                id="website"
                                                name="website"
                                                type="text"
                                                className="pl-16"
                                                placeholder="reala.agency"
                                            />
                                            <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">https://</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="message">Where are leads getting stuck?</Label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-32 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-3"
                                            placeholder="Response speed, qualification, routing, CRM tasks, follow-up, reporting..."
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
                                        <p className="text-muted-foreground text-balance text-sm">
                                            By submitting this form, you agree to be contacted about Reala services. Prefer calendar first?{' '}
                                            <Link
                                                href={DISCOVERY_CALL_ROUTE}
                                                {...BOOK_AUDIT_LINK_PROPS}
                                                className="text-primary underline">
                                                Book here
                                            </Link>
                                            .
                                        </p>
                                        <Button
                                            type="submit"
                                            className="max-sm:row-start-1">
                                            Get in touch
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
