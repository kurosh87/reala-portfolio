import Link from 'next/link'
import { ArrowBigRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DocumentCsvIllustration from '@/components/document-csv'
import { CurrencyIllustration } from '@/components/ui/illustrations/currency-illustration'
import { DocumentIllustration } from '@/components/ui/illustrations/document-illustration'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

export default function HowItWorks4() {
    return (
        <section className="overflow-hidden py-24">
            <div className="bg-background mx-4 rounded-[2rem]">
                <div className="@container relative mx-auto w-full max-w-5xl px-6 py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-primary">Our Process</span>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">Start with the audit, then build what matters.</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">
                            The audit turns scattered AI ideas into a practical build order, so implementation starts with the workflows most likely to move leads, follow-up, and operations.
                        </p>
                    </div>

                    <div className="@3xl:grid-cols-3 my-20 grid gap-12">
                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">1</span>

                            <div className="relative self-center">
                                <div className="mx-auto w-fit">
                                    <DocumentCsvIllustration />
                                </div>
                                <ArrowBigRight className="@3xl:block fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[150%] drop-shadow" />
                            </div>

                            <div className="space-y-3 self-end">
                                <h3 className="text-foreground text-lg font-medium">Review the workflow</h3>
                                <p className="text-muted-foreground text-balance">
                                    Look at follow-up, CRM use, marketing work, and the places where momentum gets lost.
                                </p>
                            </div>
                        </div>

                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">2</span>

                            <div className="relative">
                                <div className="mx-auto w-fit self-center">
                                    <CurrencyIllustration />
                                </div>
                                <ArrowBigRight className="@3xl:block fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[150%] drop-shadow" />
                            </div>

                            <div className="space-y-3 self-end">
                                <h3 className="text-foreground text-lg font-medium">Map the opportunity</h3>
                                <p className="text-muted-foreground text-balance">
                                    Prioritize the highest-leverage AI opportunities before adding more tooling or complexity.
                                </p>
                            </div>
                        </div>

                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">3</span>

                            <div className="mx-auto flex w-fit gap-2 self-center">
                                <DocumentIllustration />
                                <DocumentIllustration />
                            </div>

                            <div className="space-y-3 self-end">
                                <h3 className="text-foreground text-lg font-medium">Build the system</h3>
                                <p className="text-muted-foreground text-balance">
                                    Turn the roadmap into practical workflows only after the priorities and handoffs are clear.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="mx-auto flex w-fit"
                        render={<Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS} />}
                        nativeButton={false}>
                        Book AI Workflow Audit
                    </Button>
                </div>
            </div>
        </section>
    )
}
