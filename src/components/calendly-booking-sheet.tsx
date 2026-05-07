'use client'

import * as React from 'react'
import { CalendarCheck } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    CALENDLY_AUDIT_PACKAGE_URL,
    CALENDLY_DISCOVERY_URL,
} from '@/lib/marketing/site-content'

const BOOK_AUDIT_PATH = '/book-audit'

const bookingOptions = {
    audit: {
        title: 'Book the AI Audit',
        description: 'Choose a 45 minute paid audit call with Reala.',
        iframeTitle: 'Book the paid AI Audit on Calendly',
        url: CALENDLY_AUDIT_PACKAGE_URL,
    },
    discovery: {
        title: 'Book a Discovery Call',
        description: 'Choose a 15 minute introductory call with Reala.',
        iframeTitle: 'Book a Discovery Call on Calendly',
        url: CALENDLY_DISCOVERY_URL,
    },
} as const

type BookingKind = keyof typeof bookingOptions

function calendlyPathMatches(href: URL, calendlyUrl: string) {
    const target = new URL(calendlyUrl)

    return href.origin === target.origin && href.pathname === target.pathname
}

function getBookingKind(href: string): BookingKind | null {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const url = new URL(href, window.location.href)

        if (url.pathname === BOOK_AUDIT_PATH || calendlyPathMatches(url, CALENDLY_AUDIT_PACKAGE_URL)) {
            return 'audit'
        }

        if (calendlyPathMatches(url, CALENDLY_DISCOVERY_URL)) {
            return 'discovery'
        }

        return null
    } catch {
        return null
    }
}

export function CalendlyBookingSheet() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [bookingKind, setBookingKind] = React.useState<BookingKind>('audit')
    const booking = bookingOptions[bookingKind]
    const embedUrl = `${booking.url}?hide_gdpr_banner=1`

    React.useEffect(() => {
        const handleBookingClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return
            }

            const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
            const nextBookingKind = link ? getBookingKind(link.href) : null

            if (!link || !nextBookingKind) {
                return
            }

            event.preventDefault()
            setBookingKind(nextBookingKind)
            setIsOpen(true)
        }

        document.addEventListener('click', handleBookingClick)

        return () => {
            document.removeEventListener('click', handleBookingClick)
        }
    }, [])

    return (
        <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}>
            <SheetContent className="!w-full gap-0 p-0 sm:!w-[36rem] sm:max-w-none">
                <SheetHeader className="border-b py-4 pl-5 pr-12">
                    <div className="flex items-center gap-3">
                        <span
                            aria-hidden
                            className="flex size-9 items-center justify-center rounded-full border bg-card">
                            <CalendarCheck />
                        </span>
                        <div className="min-w-0">
                            <SheetTitle>{booking.title}</SheetTitle>
                            <SheetDescription>{booking.description}</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <div className="min-h-0 flex-1 bg-background">
                    <iframe
                        key={bookingKind}
                        title={booking.iframeTitle}
                        src={embedUrl}
                        className="h-[calc(100vh-5.5rem)] w-full border-0"
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
