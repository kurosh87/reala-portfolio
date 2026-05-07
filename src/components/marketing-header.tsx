'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useMedia } from '@/hooks/use-media'
import { cn } from '@/lib/utils'
import { BOOK_AUDIT_LINK_PROPS, BOOK_AUDIT_ROUTE } from '@/lib/marketing/site-content'

const HEADER_SCROLL_OFFSET = 92
const ACTIVE_NAV_PILL_CLASS = 'bg-foreground/5 ring-1 ring-foreground/5'

const navItems = [
    { name: 'Why Reala', href: '/#why-reala', key: 'why-reala', sectionId: 'why-reala' },
    { name: 'How It Works', href: '/#how-it-works', key: 'how-it-works', sectionId: 'how-it-works' },
    { name: 'Pricing', href: '/#pricing', key: 'pricing', sectionId: 'pricing' },
    { name: 'FAQ', href: '/#faq', key: 'faq', sectionId: 'faq' },
    { name: 'Contact', href: '/company/contact', key: 'contact' },
] as const

type NavItem = (typeof navItems)[number]
type NavKey = NavItem['key']
type NavSectionItem = Extract<NavItem, { sectionId: string }>
type NavSectionId = NavSectionItem['sectionId']
const anchorNavItems = navItems.filter((item): item is NavSectionItem => 'sectionId' in item)

export function MarketingHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [observedSection, setObservedSection] = React.useState<NavSectionId>('why-reala')
    const isLarge = useMedia('(min-width: 64rem)')
    const pathname = usePathname()
    const activeNavKey: NavKey | null =
        pathname === '/' ? observedSection : pathname === '/pricing' ? 'pricing' : pathname === '/company/contact' ? 'contact' : null
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 50)
    })

    React.useEffect(() => {
        if (pathname !== '/') {
            return
        }

        let frame: number | null = null

        const updateActiveSection = () => {
            const marker = HEADER_SCROLL_OFFSET + 24
            let nextActive: NavSectionId = 'why-reala'

            for (const item of anchorNavItems) {
                const section = document.getElementById(item.sectionId)

                if (!section) {
                    continue
                }

                const rect = section.getBoundingClientRect()

                if (rect.top <= marker) {
                    nextActive = item.sectionId
                }
            }

            setObservedSection((current) => (current === nextActive ? current : nextActive))
        }

        const scheduleActiveSectionUpdate = () => {
            if (frame !== null) {
                return
            }

            frame = window.requestAnimationFrame(() => {
                frame = null
                updateActiveSection()
            })
        }

        scheduleActiveSectionUpdate()

        window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
        window.addEventListener('resize', scheduleActiveSectionUpdate)
        window.addEventListener('hashchange', scheduleActiveSectionUpdate)

        return () => {
            if (frame !== null) {
                window.cancelAnimationFrame(frame)
            }

            window.removeEventListener('scroll', scheduleActiveSectionUpdate)
            window.removeEventListener('resize', scheduleActiveSectionUpdate)
            window.removeEventListener('hashchange', scheduleActiveSectionUpdate)
        }
    }, [pathname])

    const handleAnchorNav = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
            if (!('sectionId' in item)) {
                return
            }

            if (typeof window === 'undefined' || window.location.pathname !== '/') {
                return
            }

            const section = document.getElementById(item.sectionId)

            if (!section) {
                return
            }

            event.preventDefault()
            setObservedSection(item.sectionId)
            window.history.pushState(null, '', item.href)

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            const top = Math.max(0, window.scrollY + section.getBoundingClientRect().top - HEADER_SCROLL_OFFSET)

            window.scrollTo({
                top,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            })
        },
        [],
    )

    const handleLogoHome = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        if (typeof window === 'undefined' || window.location.pathname !== '/') {
            return
        }

        event.preventDefault()
        window.history.pushState(null, '', '/#home')

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
    }, [])

    return (
        <header
            role="banner"
            data-state={isMobileMenuOpen ? 'active' : 'inactive'}
            {...(isScrolled && { 'data-scrolled': true })}>
            <div className="fixed inset-x-0 top-0 z-50 px-2 py-1.5 max-lg:overflow-hidden lg:px-6 lg:py-3">
                <div
                    className={cn(
                        'mx-auto w-full max-w-6xl rounded-2xl border border-transparent px-3 shadow-md shadow-transparent ring-1 ring-transparent transition-all duration-500 ease-in-out',
                        'in-data-scrolled:max-w-5xl in-data-scrolled:bg-background/80 in-data-scrolled:shadow-black/6.5 in-data-scrolled:ring-foreground/5 in-data-scrolled:backdrop-blur',
                        'max-lg:h-14 max-lg:overflow-hidden max-lg:in-data-[state=active]:h-[calc(100vh-0.75rem)] max-lg:in-data-[state=active]:bg-card/75 max-lg:in-data-[state=active]:backdrop-blur',
                        'max-lg:in-data-[state=active]:bg-background/90 max-lg:in-data-[state=active]:px-5 max-lg:in-data-[state=active]:shadow-black/6.5 max-lg:in-data-[state=active]:ring-foreground/5',
                    )}>
                    <div className="relative flex flex-wrap items-start justify-between max-lg:h-full lg:items-center lg:py-3">
                        <div className="flex items-center justify-between gap-8 max-lg:h-14 max-lg:w-full max-lg:in-data-[state=active]:border-b">
                            <Link
                                href="/#home"
                                aria-label="go home"
                                onClick={handleLogoHome}
                                className="h-fit transition-all duration-500 lg:in-data-scrolled:px-2">
                                <Logo />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((open) => !open)}
                                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2 -mr-2 block cursor-pointer p-2 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-5 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-5 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <DesktopNav
                                activeNavKey={activeNavKey}
                                onAnchorNav={handleAnchorNav}
                            />
                        </div>

                        {!isLarge && isMobileMenuOpen ? (
                            <MobileMenu
                                activeNavKey={activeNavKey}
                                closeMenu={() => setIsMobileMenuOpen(false)}
                                onAnchorNav={handleAnchorNav}
                            />
                        ) : null}

                        <div className="mb-6 hidden w-full flex-wrap items-center justify-end gap-3 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-3">
                            <Button
                                render={<Link href={BOOK_AUDIT_ROUTE} {...BOOK_AUDIT_LINK_PROPS} />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="rounded-md px-4 text-sm">
                                Book AI Audit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

function MobileMenu({
    activeNavKey,
    closeMenu,
    onAnchorNav,
}: {
    activeNavKey: NavKey | null
    closeMenu: () => void
    onAnchorNav: (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => void
}) {
    return (
        <nav
            role="navigation"
            className="w-full overflow-y-auto pb-8 pt-2 max-lg:h-[calc(100vh-5.25rem)]">
            {navItems.map((item) => {
                const isActive = activeNavKey === item.key

                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={(event) => {
                            onAnchorNav(event, item)
                            closeMenu()
                        }}
                        className={cn(
                            'group relative isolate block overflow-hidden border-0 border-b py-4 text-lg transition-colors duration-300',
                            isActive ? 'text-foreground' : 'text-foreground hover:text-primary',
                        )}>
                        {isActive ? (
                            <motion.span
                                layoutId="mobile-marketing-nav-active"
                                className={cn('absolute inset-x-0 inset-y-1 -z-10 rounded-md', ACTIVE_NAV_PILL_CLASS)}
                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            />
                        ) : null}
                        <span className="relative px-3">{item.name}</span>
                    </Link>
                )
            })}
            <Link
                href={BOOK_AUDIT_ROUTE}
                {...BOOK_AUDIT_LINK_PROPS}
                onClick={closeMenu}
                className="group relative block border-0 py-4 text-lg">
                Book AI Audit
            </Link>
        </nav>
    )
}

function DesktopNav({
    activeNavKey,
    onAnchorNav,
}: {
    activeNavKey: NavKey | null
    onAnchorNav: (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => void
}) {
    return (
        <NavigationMenu
            viewport={false}
            className="**:data-[slot=navigation-menu-content]:top-12 max-lg:hidden">
            <NavigationMenuList className="gap-3">
                {navItems.map((item) => {
                    const isActive = activeNavKey === item.key

                    return (
                        <NavigationMenuItem key={item.key}>
                            <NavigationMenuLink
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    navigationMenuTriggerStyle({
                                        className: 'relative isolate overflow-hidden px-3 transition-colors duration-300',
                                    }),
                                    isActive ? 'text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground',
                                )}
                                render={
                                    <Link
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={(event) => onAnchorNav(event, item)}
                                    />
                                }>
                                {isActive ? (
                                    <motion.span
                                        layoutId="marketing-nav-active-pill"
                                        className={cn('absolute inset-0 -z-10 rounded-md', ACTIVE_NAV_PILL_CLASS)}
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                    />
                                ) : null}
                                <span className="relative">{item.name}</span>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}
