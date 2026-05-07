import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { Container } from '@/components/container'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

const faqItems = [
    {
        group: 'Audit',
        items: [
            {
                id: 'item-1',
                question: 'What happens in the AI Workflow Audit?',
                answer: 'We map how each lead enters, who responds, where delays happen, what follow-up is missing, and which handoffs should be automated first.',
            },
            {
                id: 'item-2',
                question: 'Do we need a CRM cleanup before the audit?',
                answer: 'No. The audit is designed to expose messy routing, duplicate stages, stale leads, and missing ownership before you spend time rebuilding the system.',
            },
            {
                id: 'item-3',
                question: 'How quickly do we get recommendations?',
                answer: 'You get a prioritized workflow plan after the audit, including quick wins, high-impact fixes, and the automation sequence that should come next.',
            },
        ],
    },
    {
        group: 'Build',
        items: [
            {
                id: 'item-1',
                question: 'Can Reala build the system after the audit?',
                answer: 'Yes. The audit comes first so the build is scoped around the actual lead leaks: first reply, qualification, follow-up, routing, dashboards, or CRM handoff.',
            },
            {
                id: 'item-2',
                question: 'Will agents still review AI replies?',
                answer: 'Yes. Reala can draft, suggest, or send depending on the workflow. Most teams start with reviewed drafts, then automate narrow, low-risk replies over time.',
            },
            {
                id: 'item-3',
                question: 'What tools can this connect to?',
                answer: 'We can work with website forms, portals, ad leads, open-house sources, email, SMS, and CRM workflows. The audit confirms the exact integrations before implementation.',
            },
        ],
    },
]
export default function FAQs() {
    return (
        <section
            id="faq"
            className="bg-background">
            <Container className="**:data-[slot=content]:bg-background **:data-[slot=content]:py-16 md:**:data-[slot=content]:py-24">
                <div className="mx-auto max-w-5xl px-1 md:px-6">
                    <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                        <div className="max-w-lg max-md:px-6 md:col-span-2">
                            <h2 className="text-foreground text-4xl font-semibold">FAQs</h2>
                            <p className="text-muted-foreground mt-4 text-balance text-lg">Questions teams ask before they book the audit</p>
                            <p className="text-muted-foreground mt-6 max-md:hidden">
                                Most teams already know leads are slowing down. The audit shows exactly where the leak is, what to automate first, and what can wait.{' '}
                                <Link
                                    href={BOOK_AUDIT_ROUTE}
                                    {...BOOK_AUDIT_LINK_PROPS}
                                    className="text-primary font-medium hover:underline">
                                    Book the audit
                                </Link>
                            </p>
                        </div>

                        <div className="flex flex-col gap-12 md:col-span-3">
                            {faqItems.map((item) => (
                                <div
                                    className="flex flex-col gap-4"
                                    key={item.group}>
                                    <h3 className="text-foreground pl-6 text-lg font-semibold">{item.group}</h3>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="-space-y-1">
                                        {item.items.map((item) => (
                                            <AccordionItem
                                                key={item.id}
                                                value={item.id}
                                                className="data-[state=open]:bg-card data-[state=open]:ring-border data-[state=open]:shadow-black/6.5 peer rounded-xl border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm data-[state=open]:ring-1">
                                                <AccordionTrigger className="cursor-pointer rounded-none border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent">{item.question}</AccordionTrigger>
                                                <AccordionContent>
                                                    <p className="text-muted-foreground text-base">{item.answer}</p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-muted-foreground mt-12 px-6 md:hidden">
                        Most teams already know leads are slowing down. The audit shows exactly where the leak is, what to automate first, and what can wait.{' '}
                        <Link
                            href={BOOK_AUDIT_ROUTE}
                            {...BOOK_AUDIT_LINK_PROPS}
                            className="text-primary font-medium hover:underline">
                            Book the audit
                        </Link>
                    </p>
                </div>
            </Container>
        </section>
    )
}
