import Link from 'next/link'
import { Logo } from '@/components/logo'
import { AUDIT_ROUTE, PRICING_ROUTE, communityLinks } from '@/lib/marketing/site-content'

const footerLinks = [
    { title: 'AI Workflow Audit', href: AUDIT_ROUTE },
    { title: 'Pricing', href: PRICING_ROUTE },
    { title: 'About', href: '/company/about' },
    { title: 'Contact', href: '/company/contact' },
    { title: 'Privacy', href: '/privacy' },
]

export function MarketingFooter() {
    return (
        <footer
            role="contentinfo"
            className="bg-background">
            <div className="mx-auto max-w-7xl px-2 lg:px-6">
                <div className="border-x px-2 sm:px-6">
                    <div className="flex flex-col gap-6 border-x px-6 py-8 sm:py-16">
                        <div className="flex flex-wrap justify-between gap-6">
                            <Link
                                href="/"
                                aria-label="go home"
                                className="block size-fit">
                                <Logo />
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <nav
                                aria-label="Footer navigation"
                                className="flex flex-wrap gap-4 md:gap-6">
                                {footerLinks.map((item) => (
                                    <Link
                                        key={`${item.title}-${item.href}`}
                                        href={item.href}
                                        className="text-foreground hover:text-primary block text-sm duration-150">
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </nav>
                            {communityLinks.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.title}
                                    className="text-muted-foreground hover:text-primary block duration-150">
                                    <svg
                                        aria-hidden
                                        className="size-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                        <div
                            aria-hidden
                            className="h-px bg-[length:6px_1px] bg-repeat-x opacity-25 [background-image:linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)]"
                        />

                        <div className="flex flex-wrap justify-between gap-4">
                            <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} Reala Agency LLC, All rights reserved</span>

                            <div className="ring-foreground/5 bg-card flex items-center gap-2 rounded-full border border-transparent py-1 pl-2 pr-4 shadow ring-1">
                                <div className="relative flex size-3">
                                    <span className="duration-1500 absolute inset-0 block size-full animate-pulse rounded-full bg-emerald-100" />
                                    <span className="relative m-auto block size-1 rounded-full bg-emerald-500" />
                                </div>
                                <span className="text-sm">All systems are normal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
