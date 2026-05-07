import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Container } from '@/components/container'

export function FAQs() {
    const faqItems = [
        {
            group: 'Audit',
            items: [
                {
                    id: 'audit-1',
                    question: 'What exactly is included in the AI Workflow Audit?',
                    answer: 'The audit includes a discovery call, a review across the main business workflow zones, an AI opportunity map, a priority matrix, a tool and CRM review, and a roadmap walkthrough.',
                },
                {
                    id: 'audit-2',
                    question: 'Is the audit only for lead follow-up?',
                    answer: 'No. Lead follow-up is usually one major area, but the audit also looks at marketing, client communication, operations, CRM usage, and reporting visibility.',
                },
                {
                    id: 'audit-3',
                    question: 'Do we have to hire Reala for implementation afterward?',
                    answer: 'No. The audit is valuable on its own. If you want Reala to help build the workflows after that, implementation is scoped separately.',
                },
            ],
        },
        {
            group: 'Implementation and Support',
            items: [
                {
                    id: 'impl-1',
                    question: 'When do implementation projects make sense?',
                    answer: 'Implementation makes sense once the audit has clarified the highest-leverage opportunities, the dependencies, and the business case for building them.',
                },
                {
                    id: 'impl-2',
                    question: 'How do you price implementation?',
                    answer: 'Implementation is scoped after the audit because the right solution depends on the actual workflow gaps, team shape, and systems involved.',
                },
                {
                    id: 'impl-3',
                    question: 'What is the optimization retainer for?',
                    answer: 'Optimization is for teams that already have workflows live and want monitoring, tuning, reporting improvements, and continued expansion over time.',
                },
            ],
        },
    ]

    return (
        <section
            id="faqs"
            className="bg-background py-16 md:py-24">
            <Container className="border-0 bg-transparent">
                <div className="mx-auto max-w-5xl px-1 md:px-6">
                    <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                        <div className="max-w-lg max-md:px-6 md:col-span-2">
                            <h2 className="text-foreground text-4xl font-semibold">FAQs</h2>
                            <p className="text-muted-foreground mt-4 text-balance text-lg">
                                Answers for teams evaluating the audit-first offer.
                            </p>
                            <p className="text-muted-foreground mt-6 max-md:hidden">
                                Need a more specific answer?{' '}
                                <Link
                                    href="/company/contact"
                                    className="text-primary font-medium hover:underline">
                                    Talk to Reala
                                </Link>
                            </p>
                        </div>

                        <div className="space-y-12 md:col-span-3">
                            {faqItems.map((item) => (
                                <div
                                    className="space-y-4"
                                    key={item.group}>
                                    <h3 className="text-foreground pl-6 text-lg font-semibold">{item.group}</h3>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="-space-y-1">
                                        {item.items.map((faq) => (
                                            <AccordionItem
                                                key={faq.id}
                                                value={faq.id}
                                                className="peer data-[state=open]:bg-card data-[state=open]:ring-border data-[state=open]:shadow-black/6.5 rounded-xl border-none px-6 py-1 data-[state=open]:shadow-sm data-[state=open]:ring-1">
                                                <AccordionTrigger className="cursor-pointer rounded-none border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <p className="text-muted-foreground text-base">{faq.answer}</p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-muted-foreground mt-12 px-6 md:hidden">
                        Need a more specific answer?{' '}
                        <Link
                            href="/company/contact"
                            className="text-primary font-medium hover:underline">
                            Talk to Reala
                        </Link>
                    </p>
                </div>
            </Container>
        </section>
    )
}
