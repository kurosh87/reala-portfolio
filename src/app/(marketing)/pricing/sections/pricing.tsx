'use client'

import NumberFlow from '@number-flow/react'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

const auditFeatures = [
    'Lead source discovery',
    'First response and follow-up review',
    'CRM handoff review',
    'Speed-to-lead scorecard',
    'Reply and qualification quick wins',
    'Top 3 leakage points',
    '30-day speed-to-lead roadmap',
    'Walkthrough call',
]

const implementationFeatures = [
    'AI first-response workflow',
    'Lead qualification flow',
    'SMS and email follow-up sequences',
    'CRM task and summary updates',
    'Agent triage inbox',
    'Response and handoff reporting',
    'Tool integrations',
    'Workflow documentation',
    'Team handoff and launch support',
]

const optimizationFeatures = [
    'Workflow monitoring',
    'Prompt and automation tuning',
    'Reporting refinements',
    'New workflow buildouts',
    'CRM and tool adjustments',
    'Monthly review call',
    'Priority support',
]

const enterpriseFeatures = [
    'Team AI workflow audit',
    'Lead routing and assignment review',
    'CRM pipeline and stage cleanup',
    'Agent follow-up standards',
    'Speed-to-lead workflow design',
    'Shared dashboard and reporting',
    'Permissions, roles, and handoffs',
    'Team training and rollout plan',
    'Ongoing optimization options',
]

export function Pricing() {
    return (
        <section
            id="pricing"
            className="bg-background relative scroll-mt-28 py-16 md:py-32">
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -top-16 inset-x-0 mx-auto max-w-7xl px-2 lg:px-6">
                <div className="h-full border-x px-2 sm:px-6">
                    <div className="h-full border-x" />
                </div>
            </div>
            <div className="relative mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-foreground font-mono text-sm uppercase">
                        <span className="text-foreground/50">[ 03 ]</span> Pricing
                    </span>
                    <h2 className="text-foreground text-balance text-4xl font-semibold lg:text-5xl">Audit first. Build only what fixes speed-to-lead.</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
                        The audit shows where leads stall and what to fix first. If the gap is real, implementation starts at
                        $3,500 to install the reply, follow-up, and CRM loop.
                    </p>
                </div>

                <div className="@container mt-12">
                    <div className="rounded-(--radius) @max-4xl:max-w-sm mx-auto border">
                        <div className="@4xl:grid-cols-3 grid *:p-8">
                            <div className="@max-4xl:p-9 row-span-5 grid grid-rows-subgrid gap-8">
                                <div className="self-end">
                                    <CardTitle className="text-lg font-medium">AI Workflow Audit</CardTitle>
                                    <div className="text-muted-foreground mt-1 text-balance text-sm">For solo agents and small teams</div>
                                </div>

                                <div>
                                    <NumberFlow
                                        value={997}
                                        prefix="$"
                                        className="text-3xl font-semibold"
                                    />
                                    <div className="text-muted-foreground text-sm">Founding price</div>
                                </div>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-md">
                        <Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS}>Book AI Workflow Audit</Link>
                    </Button>

                                <ul
                                    role="list"
                                    className="flex flex-col gap-3 text-sm">
                                    {auditFeatures.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/10 *:last:stroke-emerald-600 *:last:drop-shadow" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground text-balance text-sm">
                                    Best if leads are coming in, but response and follow-up are inconsistent.
                                </p>
                            </div>
                            <div className="ring-border bg-card rounded-(--radius) @4xl:my-2 @max-4xl:mx-1 shadow-black/6.5 row-span-5 grid grid-rows-subgrid gap-8 shadow-xl ring-1 backdrop-blur">
                                <div className="self-end">
                                    <CardTitle className="text-lg font-medium">Speed-to-Lead Buildout</CardTitle>
                                    <CardDescription className="text-muted-foreground mt-1 text-balance text-sm">
                                        Buildout + Audit included
                                    </CardDescription>
                                </div>

                                <div>
                                    <div className="text-3xl font-semibold">$3,500</div>
                                    <div className="text-muted-foreground text-sm">Starting from, based on scope</div>
                                </div>
                                <RainbowButton
                                    asChild
                                    className="w-full rounded-md">
                                    <Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS}>Get Started Today</Link>
                                </RainbowButton>

                                <ul
                                    role="list"
                                    className="flex flex-col gap-3 text-sm">
                                    <li className="font-medium">AI Workflow Audit included, plus:</li>
                                    {implementationFeatures.map((item) => (
                                        <li
                                            key={item}
                                            className="group flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/10 *:last:stroke-emerald-600 *:last:drop-shadow" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground text-balance text-sm">
                                    Best if you want Reala to install the response, follow-up, and CRM loop after the audit.
                                </p>
                            </div>
                            <div className="@max-4xl:p-9 row-span-5 grid grid-rows-subgrid gap-8">
                                <div className="self-end">
                                    <CardTitle className="text-lg font-medium">Optimization</CardTitle>
                                    <CardDescription className="text-muted-foreground mt-1 text-balance text-sm">Ongoing support after launch</CardDescription>
                                </div>

                                <div>
                                    <div className="text-3xl font-semibold">Custom</div>
                                    <div className="text-muted-foreground text-sm">Based on workflow volume and support needs</div>
                                </div>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-md">
                        <Link href="/company/contact">Get a Quote</Link>
                    </Button>

                                <ul
                                    role="list"
                                    className="flex flex-col gap-3 text-sm">
                                    <li className="font-medium">Everything in implementation, plus:</li>
                                    {optimizationFeatures.map((item) => (
                                        <li
                                            key={item}
                                            className="group flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/10 *:last:stroke-emerald-600 *:last:drop-shadow" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground text-balance text-sm">
                                    Best if you want your AI workflows maintained, improved, and expanded over time.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-(--radius) @max-4xl:max-w-sm @4xl:grid-cols-3 @max-4xl:divide-y @4xl:divide-x mx-auto mt-6 grid border *:p-8">
                        <div className="space-y-6">
                            <div className="self-end">
                                <CardTitle className="text-lg font-medium">Real Estate Teams</CardTitle>
                                <div className="text-muted-foreground mt-1 text-balance text-sm">
                                    For teams with multiple agents, shared leads, routing rules, or a more complex CRM setup.
                                </div>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="@max-4xl:w-full">
                                <Link href="/company/contact">Get a Team Quote</Link>
                            </Button>
                        </div>
                        <div className="col-span-2 space-y-6">
                            <ul
                                role="list"
                                className="@4xl:grid-cols-2 grid gap-x-14 gap-y-3 text-sm">
                                {enterpriseFeatures.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/10 *:last:stroke-emerald-600 *:last:drop-shadow" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-muted-foreground text-balance text-sm">
                                Best if your team needs consistency across agents, not just more automation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
