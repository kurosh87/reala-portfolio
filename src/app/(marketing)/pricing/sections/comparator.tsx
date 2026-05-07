import { Gauge, SearchCheck, Wrench, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/container'

const columns = [
    { key: 'audit', label: 'Audit', icon: SearchCheck },
    { key: 'implementation', label: 'Build', icon: Wrench },
    { key: 'optimization', label: 'Optimize', icon: Gauge },
] as const

type ColumnKey = (typeof columns)[number]['key']
type Availability = boolean | string

type Feature = {
    name: string
    values: Record<ColumnKey, Availability>
}

const features: Feature[] = [
    {
        name: 'Best for',
        values: {
            audit: 'Need clarity',
            implementation: 'Ready to build',
            optimization: 'Already live',
        },
    },
    {
        name: 'Main outcome',
        values: {
            audit: 'Roadmap',
            implementation: 'Workflow system',
            optimization: 'Performance gains',
        },
    },
    {
        name: 'Discovery and analysis',
        values: {
            audit: true,
            implementation: true,
            optimization: true,
        },
    },
    {
        name: 'Priority matrix and roadmap',
        values: {
            audit: true,
            implementation: true,
            optimization: 'Refinement only',
        },
    },
    {
        name: 'Hands-on workflow buildout',
        values: {
            audit: false,
            implementation: true,
            optimization: 'Iteration only',
        },
    },
    {
        name: 'Ongoing tuning and support',
        values: {
            audit: false,
            implementation: 'Launch period',
            optimization: true,
        },
    },
    {
        name: 'Commercial model',
        values: {
            audit: 'Fixed price',
            implementation: 'Custom scope',
            optimization: 'Monthly support',
        },
    },
    {
        name: 'Timeline',
        values: {
            audit: 'Fast first step',
            implementation: 'Scoped project',
            optimization: 'Ongoing cadence',
        },
    },
]

function renderAvailability(value: Availability) {
    if (value === true) {
        return <Indicator checked />
    }

    if (value === false) {
        return <Indicator />
    }

    return value
}

export function Comparator() {
    return (
        <section
            id="comparator"
            className="py-16 md:py-24">
            <Container className="border-0 bg-transparent">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <h2 className="text-foreground text-balance text-3xl font-semibold md:text-4xl">
                            How the offers relate
                        </h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">
                            The public pricing surface should stay simple, but it still needs to show how the audit,
                            implementation, and ongoing optimization connect.
                        </p>
                    </div>
                    <div className="mx-auto max-w-4xl overflow-x-auto">
                        <div className="grid min-w-[720px] grid-cols-2">
                            <div>
                                <div className="h-18 flex items-center">
                                    <div className="text-lg font-medium">Benefits</div>
                                </div>
                                {features.map((feature) => (
                                    <div
                                        key={feature.name}
                                        className="flex h-14 items-center border-t pr-6 text-sm">
                                        <div>{feature.name}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="from-primary/10 via-primary/5 to-background grid grid-cols-3 rounded-2xl bg-linear-to-b">
                                {columns.map((column, index) => (
                                    <div
                                        key={column.key}
                                        className={index === 1 ? 'bg-card ring-foreground/5 my-2 rounded-lg shadow-lg shadow-black/10 ring-1' : ''}>
                                        <div className="h-18 flex flex-col items-center justify-center gap-1 px-6 pt-2 text-center">
                                            <ColumnIcon icon={column.icon} />
                                            <div className="text-sm font-medium">{column.label}</div>
                                        </div>
                                        {features.map((feature) => (
                                            <div
                                                key={`${feature.name}-${column.key}`}
                                                className="flex h-14 items-center justify-center border-t px-4 text-center text-sm">
                                                <div>{renderAvailability(feature.values[column.key])}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

function ColumnIcon({ icon: Icon }: { icon: LucideIcon }) {
    return <Icon className="size-4" />
}

function Indicator({ checked = false }: { checked?: boolean }) {
    return (
        <span
            className={`flex size-5 items-center justify-center rounded-full font-sans text-xs font-semibold ${
                checked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-foreground/[0.065] text-foreground/65'
            }`}>
            {checked ? '✓' : '✗'}
        </span>
    )
}
