import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@/components/container'
import { getLegalDocBySlug, getAllLegalSlugs } from '@/lib/legal-docs'
import { mdxComponents } from '@/components/mdx-components'
import { formatDate } from '@/lib/format-date'
import { ChevronLeft } from 'lucide-react'

export async function generateStaticParams() {
    const slugs = getAllLegalSlugs()
    return slugs.map((slug) => ({ document: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ document: string }> }) {
    const { document } = await params
    const doc = getLegalDocBySlug(document)

    if (!doc) {
        return { title: 'Document Not Found' }
    }

    return {
        title: `${doc.title} - Legal`,
    }
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ document: string }> }) {
    const { document } = await params
    const doc = getLegalDocBySlug(document)

    if (!doc) {
        notFound()
    }

    return (
        <>
            <section className="overflow-hidden">
                <div className="relative">
                    <div
                        aria-hidden
                        className="h-14 lg:h-[73px]"
                    />

                    <Container className="border-b">
                        <div className="@4xl:px-10 mx-auto max-w-3xl px-4">
                            <Link
                                href="/legal"
                                className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors">
                                <ChevronLeft className="size-4" />
                                All Legal Documents
                            </Link>
                            <h1 className="text-foreground text-balance text-6xl font-semibold tracking-tight sm:text-7xl sm:font-bold">{doc.title}</h1>
                            <p className="text-muted-foreground mt-6">
                                {' '}
                                <span className="text-foreground">Effective date:</span> {formatDate(doc.effectiveDate)}
                            </p>

                            <MDXRemote
                                source={doc.content}
                                components={mdxComponents}
                            />
                        </div>
                    </Container>
                </div>
            </section>
        </>
    )
}
