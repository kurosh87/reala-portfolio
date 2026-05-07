import { cn } from '@/lib/utils'
import { DocumentAnalysisIllustration } from '@/components/illustrations/document-analysis'

const auditMetrics = [
  {
    label: 'Response',
    value: '47 min',
    unit: 'avg reply',
    barLabel: 'Target: under 30s',
    width: 'w-11/12',
  },
  {
    label: 'CRM',
    value: '19',
    unit: 'stale leads',
    barLabel: 'Follow-up gaps',
    width: 'w-2/3',
  },
  {
    label: 'Content',
    value: '3.4 days',
    unit: 'turnaround',
    barLabel: 'Listing content lag',
    width: 'w-3/4',
  },
]

export const InvoiceIllustration = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className="relative w-full min-w-0"
    >
      <div
        className={cn(
          'mask-b-from-65% before:bg-card before:border-border after:ring-border-illustration after:bg-card/75 before:z-1 before:ring-border-illustration group relative mx-auto min-w-0 px-2 pt-6 before:absolute before:inset-x-4 before:bottom-0 before:top-4 before:rounded-2xl before:ring-1 before:backdrop-blur after:absolute after:inset-x-7 after:bottom-0 after:top-2 after:rounded-2xl after:ring-1 sm:px-4 sm:before:inset-x-6 sm:after:inset-x-9',
          className
        )}
      >
        <div className="bg-card ring-border-illustration shadow-black/6.5 relative z-10 overflow-hidden rounded-2xl border border-transparent p-5 text-sm shadow-xl ring-1 sm:p-8">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <img
                src="/logos/remax-audit.svg"
                alt=""
                className="h-5 w-auto"
              />
              <div className="mt-4 text-[11px] font-medium tracking-[0.08em] text-muted-foreground">
                Prepared for David Sinclair
              </div>
              <div className="text-xl font-semibold sm:text-2xl @min-[28rem]:whitespace-nowrap">AI Workflow Audit</div>
              <div className="text-xs font-medium text-muted-foreground">
                Ranked by impact and effort
              </div>
            </div>
            <div className="origin-top-right scale-60">
              <DocumentAnalysisIllustration />
            </div>
          </div>

          <div className="space-y-3 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
            {auditMetrics.map((metric) => (
              <div
                key={metric.label}
                className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-muted-foreground text-xs font-medium">{metric.label}</span>
                  <span className="text-foreground text-sm font-semibold">
                    {metric.value}{' '}
                    <span className="text-muted-foreground text-[10px] font-medium">{metric.unit}</span>
                  </span>
                </div>
                <div className="bg-muted/45 h-4 overflow-hidden rounded px-1 py-1">
                  <div
                    className={cn(
                      'h-2 rounded-sm bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-200 shadow-sm',
                      metric.width
                    )}
                  />
                </div>
                <div className="text-muted-foreground/70 text-[10px] font-medium">{metric.barLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
