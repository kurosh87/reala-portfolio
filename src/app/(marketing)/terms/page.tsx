import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@/components/container'
import { mdxComponents } from '@/components/mdx-components'
import { formatDate } from '@/lib/format-date'
import { getLegalDocBySlug } from '@/lib/legal-docs'

export const metadata: Metadata = {
    title: 'Terms of Service - Reala',
    description: 'Terms for using Reala services, including SMS notifications.',
}

export default function TermsPage() {
    const doc = getLegalDocBySlug('terms-of-service')

    if (!doc) {
        notFound()
    }

    return (
        <section className="overflow-hidden">
            <div className="relative">
                <div
                    aria-hidden
                    className="h-14 lg:h-[73px]"
                />

                <Container className="border-b">
                    <div className="@4xl:px-10 mx-auto max-w-3xl px-4 py-12">
                        <h1 className="text-foreground text-balance text-5xl font-semibold tracking-tight sm:text-6xl">{doc.title}</h1>
                        <p className="text-muted-foreground mt-6">
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
    )
}
