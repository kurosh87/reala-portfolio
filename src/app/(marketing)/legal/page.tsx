import Link from 'next/link'
import { Container } from '@/components/container'
import { getAllLegalDocs } from '@/lib/legal-docs'
import { formatDate } from '@/lib/format-date'
import { ChevronRight } from 'lucide-react'

export default function LegalPage() {
    const docs = getAllLegalDocs()

    return (
        <>
            <section id="home">
                <div className="relative">
                    <div
                        aria-hidden
                        className="h-14 lg:h-[73px]"
                    />

                    <Container className="border-b">
                        <div className="@4xl:grid-cols-5 @xl:grid @4xl:divide-x @4xl:*:border-y">
                            <div className="@4xl:col-span-2">
                                <div
                                    data-grid-content
                                    className="@4xl:p-10 p-4">
                                    <div className="@4xl:sticky @4xl:top-32">
                                        <h1 className="text-foreground text-balance text-5xl font-semibold tracking-tight">Explore our Legal documents</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="@max-4xl:border-y @4xl:col-span-3">
                                <div className="divide-y">
                                    {docs.map((doc) => (
                                        <div
                                            data-grid-content
                                            key={doc.slug}
                                            className="@4xl:p-10 hover:bg-card @max-2xl:flex-col group relative flex flex-wrap justify-between gap-6 p-4">
                                            <div>
                                                <h2 className="text-foreground group-hover:text-primary text-xl font-semibold">{doc.title}</h2>
                                                <p className="text-muted-foreground mt-2 text-sm">Effective {formatDate(doc.effectiveDate)}</p>
                                            </div>
                                            <Link
                                                href={`/legal/${doc.slug}`}
                                                className="text-muted-foreground group-hover:text-foreground inline-flex h-10 w-fit cursor-pointer items-center gap-1 rounded-full border px-4 text-sm transition-colors after:absolute after:inset-0">
                                                Read document
                                                <ChevronRight
                                                    strokeWidth={2.5}
                                                    aria-hidden="true"
                                                    className="size-3.5 translate-y-px duration-200 group-hover:translate-x-0.5"
                                                />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        </>
    )
}
