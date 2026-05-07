import {
  Clock3,
  FileText,
  GitBranch,
  Map,
  Puzzle,
  Repeat2,
  Route,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'
import { InvoiceIllustration } from '@/components/illustrations/invoice-illustration'
import { WorkflowIllustration } from '@/components/illustrations/workflow'
import { Container } from '@/components/container'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

const auditDeliverables = [
  { label: 'AI opportunity map', icon: Map },
  { label: 'Current workflow review', icon: Workflow },
  { label: 'Tool and CRM review', icon: Puzzle },
  { label: 'Priority matrix', icon: Target },
  { label: 'Recommended workflows', icon: Sparkles },
  { label: '30-day implementation plan', icon: Route },
  { label: 'Top 3 quick wins', icon: FileText },
  { label: 'Build options', icon: GitBranch },
]

export function WhyRealaSection() {
  return (
    <section id="why-reala" className="scroll-mt-24">
      <Container>
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="grid gap-6 pb-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-24">
            <div className="space-y-4">
              <span className="text-foreground font-mono text-sm uppercase">
                <span className="text-muted-foreground">[ 01 ]</span> Why Reala?
              </span>
              <h2 className="text-foreground text-balance text-4xl font-semibold">
                Most real estate agents have tried AI. Few have made it
                repeatable.
              </h2>
            </div>
            <div className="@container lg:col-span-2">
              <dl className="@md:grid-cols-2 grid gap-6 *:space-y-2">
                <div>
                  <Repeat2 className="stroke-primary size-4.5 fill-indigo-500/25" />
                  <dt className="text-foreground font-semibold">Scattered AI Use</dt>
                  <dd className="text-muted-foreground">
                    AI helps, but it is not built into a daily workflow.
                  </dd>
                </div>
                <div>
                  <Clock3 className="stroke-primary size-4.5 fill-indigo-500/25" />
                  <dt className="text-foreground font-semibold">Slow Lead Response</dt>
                  <dd className="text-muted-foreground">
                    New leads still wait too long before anyone follows up.
                  </dd>
                </div>
                <div>
                  <FileText className="stroke-primary size-4.5 fill-indigo-500/25" />
                  <dt className="text-foreground font-semibold">Content Bottlenecks</dt>
                  <dd className="text-muted-foreground">
                    Listings, emails, and social posts still take too long to
                    create.
                  </dd>
                </div>
                <div>
                  <Workflow className="stroke-primary size-4.5 fill-indigo-500/25" />
                  <dt className="text-foreground font-semibold">Messy CRM Work</dt>
                  <dd className="text-muted-foreground">
                    Follow-up depends on memory instead of a clear system.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function AnalyticsFeatures() {
  return (
    <section id="how-reala-works">
      <Container className="**:data-[slot=content]:pt-8 lg:**:data-[slot=content]:pt-12">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-foreground text-balance text-4xl font-semibold">
              Start with the audit. Build what matters most.
            </h2>
          </div>
          <div className="grid max-md:divide-y md:grid-cols-2 md:divide-x">
            <div className="row-span-2 grid min-w-0 grid-rows-subgrid gap-6 overflow-visible pb-10 md:pr-8 lg:pr-12">
              <div className="flex min-h-[20rem] items-center justify-center sm:min-h-[24rem]">
                <InvoiceIllustration className="w-full max-w-[32rem]" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">AI Workflow Audit</h3>
                <p className="text-muted-foreground">
                  A clear review of your follow-up, CRM, content, and ops,
                  with the gaps that are slowing work down.
                </p>
              </div>
            </div>
            <div className="row-span-2 grid min-w-0 grid-rows-subgrid gap-6 overflow-visible pb-10 max-md:pt-10 md:pl-8 lg:pl-12">
              <div className="flex min-h-[20rem] items-center justify-center sm:min-h-[24rem]">
                <WorkflowIllustration className="w-[min(100%,24rem)]" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Step-by-Step Workflow Improvement</h3>
                <p className="text-muted-foreground">
                  Each gap is ranked by impact and effort so you know what to
                  fix first, next, and later.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t pt-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr_1fr] lg:gap-10">
              <div className="space-y-3">
                <h3 className="text-foreground text-lg font-semibold">
                  What you get from the audit
                </h3>
                <p className="text-muted-foreground text-sm">
                  A clear report and implementation path, not a generic AI
                  brainstorm.
                </p>
                <Link
                  href={BOOK_AUDIT_ROUTE}
                  {...BOOK_AUDIT_LINK_PROPS}
                  className="text-foreground hover:bg-muted inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Book AI Workflow Audit
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                {auditDeliverables.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <Icon className="stroke-primary mt-0.5 size-4 fill-indigo-500/25" />
                      <p className="text-foreground text-sm font-medium">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
