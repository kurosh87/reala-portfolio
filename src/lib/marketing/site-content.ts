export const AUDIT_ROUTE = '/product/ai-workflow-audit'
export const CALENDLY_DISCOVERY_URL = 'https://calendly.com/pej-afra1987/30min'
export const CALENDLY_AUDIT_PACKAGE_URL = 'https://calendly.com/pej-afra1987/packages/a743d730-d3a6-4d86-8cd8-2ddac729c183'
export const BOOK_AUDIT_ROUTE = CALENDLY_AUDIT_PACKAGE_URL
export const DISCOVERY_CALL_ROUTE = CALENDLY_DISCOVERY_URL
export const BOOK_AUDIT_LINK_PROPS = {
    target: '_blank',
    rel: 'noopener noreferrer',
} as const
export const PRICING_ROUTE = '/#pricing'

export type MenuIconKey =
    | 'sparkles'
    | 'activity'
    | 'shield'
    | 'headset'
    | 'cpu'
    | 'gem'
    | 'shopping-bag'
    | 'graduation-cap'
    | 'book-open'
    | 'notebook'
    | 'users'

export type MenuLink = {
    name: string
    href: string
    description?: string
    iconKey?: MenuIconKey
}

export type MenuColumn = {
    title: string
    links: MenuLink[]
}

export type StubPageContent = {
    slug: string
    href: string
    title: string
    description: string
    examples: string[]
    ctaLabel: string
    eyebrow?: string
}

export const productMenuColumns: MenuColumn[] = [
    {
        title: 'Core Product',
        links: [
            {
                name: 'AI Workflow Audit',
                href: AUDIT_ROUTE,
                description: 'Find what AI should fix first.',
                iconKey: 'sparkles',
            },
            {
                name: 'Speed-to-Lead Agent',
                href: '/product/speed-to-lead-agent',
                description: 'Respond to new leads in seconds.',
                iconKey: 'activity',
            },
            {
                name: 'CRM Follow-Up',
                href: '/product/crm-follow-up',
                description: 'Keep every lead moving.',
                iconKey: 'notebook',
            },
            {
                name: 'Marketing Workflows',
                href: '/product/marketing-workflows',
                description: 'Create content faster.',
                iconKey: 'book-open',
            },
            {
                name: 'Dashboard',
                href: '/product/dashboard',
                description: 'See what is working.',
                iconKey: 'cpu',
            },
        ],
    },
    {
        title: 'What We Improve',
        links: [
            {
                name: 'Lead Response',
                href: '/product/speed-to-lead-agent',
                description: 'Stop new leads from going cold.',
                iconKey: 'shopping-bag',
            },
            {
                name: 'Follow-Up',
                href: '/product/crm-follow-up',
                description: 'Automate the work agents forget.',
                iconKey: 'graduation-cap',
            },
            {
                name: 'CRM Setup',
                href: '/product/crm-follow-up',
                description: 'Clean up your pipeline before automating.',
                iconKey: 'shield',
            },
            {
                name: 'Client Communication',
                href: '/product/crm-follow-up',
                description: 'Keep buyers and sellers updated.',
                iconKey: 'headset',
            },
            {
                name: 'Team Visibility',
                href: '/product/dashboard',
                description: 'Track activity, response, and performance.',
                iconKey: 'gem',
            },
        ],
    },
]

export const solutionMenuColumns: MenuColumn[] = [
    {
        title: 'Who It’s For',
        links: [
            {
                name: 'Solo Agents',
                href: '/solutions/solo-agents',
                description: 'Use AI without hiring more help.',
                iconKey: 'sparkles',
            },
            {
                name: 'Real Estate Teams',
                href: '/solutions/real-estate-teams',
                description: 'Standardize follow-up across your team.',
                iconKey: 'users',
            },
        ],
    },
]

export const companyMenuLinks: MenuLink[] = [
    {
        name: 'About',
        href: '/company/about',
        description: 'Learn why Reala exists and how we approach practical AI.',
    },
    {
        name: 'Contact',
        href: '/company/contact',
        description: 'Tell us where your workflows are getting stuck.',
    },
]

export const footerGroups = [
    {
        group: 'Product',
        items: [
            { title: 'AI Workflow Audit', href: AUDIT_ROUTE },
            { title: 'Speed-to-Lead Agent', href: '/product/speed-to-lead-agent' },
            { title: 'CRM Follow-Up', href: '/product/crm-follow-up' },
            { title: 'Marketing Workflows', href: '/product/marketing-workflows' },
            { title: 'Dashboard', href: '/product/dashboard' },
        ],
    },
    {
        group: 'Solutions',
        items: [
            { title: 'Solo Agents', href: '/solutions/solo-agents' },
            { title: 'Real Estate Teams', href: '/solutions/real-estate-teams' },
        ],
    },
    {
        group: 'Company',
        items: [
            { title: 'About', href: '/company/about' },
            { title: 'Contact', href: '/company/contact' },
            { title: 'Pricing', href: PRICING_ROUTE },
            { title: 'Privacy', href: '/privacy' },
            { title: 'Terms', href: '/terms' },
        ],
    },
]

export const communityLinks = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/pejmanafra/' },
]

const productStubPages: Record<string, StubPageContent> = {
    'speed-to-lead-agent': {
        slug: 'speed-to-lead-agent',
        href: '/product/speed-to-lead-agent',
        title: 'Respond to new leads in seconds.',
        description:
            'Show how Reala can capture, qualify, and route inbound leads faster without adding more manual follow-up work.',
        examples: [
            'Reply to new website and ad leads right away.',
            'Qualify leads before an agent jumps in.',
            'Route hot leads to the right agent fast.',
            'Keep nights and weekends covered.',
        ],
        ctaLabel: 'Book an AI Workflow Audit',
        eyebrow: 'Product',
    },
    'crm-follow-up': {
        slug: 'crm-follow-up',
        href: '/product/crm-follow-up',
        title: 'Keep every lead and client moving.',
        description:
            'Use this page to frame CRM follow-up as the system that keeps leads, clients, and next steps from getting lost.',
        examples: [
            'Trigger follow-up after every inquiry and showing.',
            'Keep stale leads from sitting untouched.',
            'Clean up stages and next steps inside the CRM.',
            'Make sure clients hear from your team on time.',
        ],
        ctaLabel: 'Book an AI Workflow Audit',
        eyebrow: 'Product',
    },
    'marketing-workflows': {
        slug: 'marketing-workflows',
        href: '/product/marketing-workflows',
        title: 'Create listing and social content faster.',
        description:
            'Position Reala as the faster way to turn listing and market inputs into repeatable marketing output.',
        examples: [
            'Write listing descriptions from one property brief.',
            'Turn listing details into social posts fast.',
            'Create market updates without starting from scratch.',
            'Reuse content across email, social, and listing launches.',
        ],
        ctaLabel: 'Book an AI Workflow Audit',
        eyebrow: 'Product',
    },
}

const solutionPages: Record<string, StubPageContent> = {
    'solo-agents': {
        slug: 'solo-agents',
        href: '/solutions/solo-agents',
        title: 'Use AI without hiring more help.',
        description:
            'Frame Reala as the practical way for solo agents to handle follow-up, marketing, and organization without adding headcount.',
        examples: [
            'Respond faster when new leads come in.',
            'Keep follow-up going between appointments.',
            'Create listing and social content faster.',
            'Stay organized without more admin help.',
        ],
        ctaLabel: 'Start with an AI Workflow Audit',
        eyebrow: 'Solutions',
    },
    'real-estate-teams': {
        slug: 'real-estate-teams',
        href: '/solutions/real-estate-teams',
        title: 'Standardize follow-up across your team.',
        description:
            'Use this page to position Reala as the system that keeps lead response, CRM use, and follow-up consistent across the team.',
        examples: [
            'Standardize lead response across multiple agents.',
            'Keep CRM stages and follow-up rules aligned.',
            'Reduce missed handoffs and dropped leads.',
            'Give team leaders a clearer view of performance.',
        ],
        ctaLabel: 'Start with an AI Workflow Audit',
        eyebrow: 'Solutions',
    },
}

export const productStubPageList = Object.values(productStubPages)
export const solutionPageList = Object.values(solutionPages)

export function getProductStubPage(slug: string) {
    return productStubPages[slug]
}

export function getSolutionPage(slug: string) {
    return solutionPages[slug]
}
