'use client'

import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'

import { Beacon } from '@/components/ui/svgs/beacon'
import { Bolt } from '@/components/ui/svgs/bolt'
import { Cisco } from '@/components/ui/svgs/cisco'
import { Hulu } from '@/components/ui/svgs/hulu'
import { LeapWallet } from '@/components/ui/svgs/leap-wallet'
import { OpenaiWordmarkLight as OpenAIFull } from '@/components/ui/svgs/openai'
import { Paypal as PayPal } from '@/components/ui/svgs/paypal'
import { Polars } from '@/components/ui/svgs/polars'
import { PrimeVideo as Primevideo } from '@/components/ui/svgs/prime-video'
import { Spotify } from '@/components/ui/svgs/spotify'
import { Stripe } from '@/components/ui/svgs/stripe'
import { Supabase } from '@/components/ui/svgs/supabase'
import { VercelFull } from '@/components/ui/svgs/vercel'

const aiLogos: React.ReactNode[] = [
    <OpenAIFull
        key="openai"
        height={24}
    />,
    <Bolt
        key="bolt"
        height={20}
    />,
    <Cisco
        key="cisco"
        height={32}
    />,
    <Hulu
        key="hulu"
        height={22}
    />,
    <Spotify
        key="spotify"
        height={24}
    />,
]

const hostingLogos: React.ReactNode[] = [
    <Supabase
        key="supabase"
        height={24}
    />,
    <Cisco
        key="cisco"
        height={32}
    />,
    <Hulu
        key="hulu"
        height={22}
    />,
    <Spotify
        key="spotify"
        height={24}
    />,
    <VercelFull
        key="vercel"
        height={20}
    />,
]

const paymentsLogos: React.ReactNode[] = [
    <Stripe
        key="stripe"
        height={24}
    />,
    <PayPal
        key="paypal"
        height={24}
    />,
    <LeapWallet
        key="leapwallet"
        height={24}
    />,
    <Beacon
        key="beacon"
        height={20}
    />,
    <Polars
        key="polars"
        height={24}
    />,
]

const streamingLogos: React.ReactNode[] = [
    <Primevideo
        key="primevideo"
        height={28}
    />,
    <Hulu
        key="hulu"
        height={22}
    />,
    <Spotify
        key="spotify"
        height={24}
    />,
    <Cisco
        key="cisco"
        height={32}
    />,
    <Beacon
        key="beacon"
        height={20}
    />,
]

type LogoGroup = 'ai' | 'hosting' | 'payments' | 'streaming'

const logos: { [key in LogoGroup]: React.ReactNode[] } = {
    ai: aiLogos,
    hosting: hostingLogos,
    payments: paymentsLogos,
    streaming: streamingLogos,
}

export function LogoCloud() {
    const [currentGroup, setCurrentGroup] = useState<LogoGroup>('ai')

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGroup((prev) => {
                const groups = Object.keys(logos) as LogoGroup[]
                const currentIndex = groups.indexOf(prev)
                const nextIndex = (currentIndex + 1) % groups.length
                return groups[nextIndex]
            })
        }, 2500)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="bg-background py-16">
            <div className="relative">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -top-16 inset-x-0 mx-auto max-w-7xl px-2 lg:px-6">
                    <div className="h-full border-x px-2 sm:px-6">
                        <div className="h-full border-x" />
                    </div>
                </div>
                <div className="relative mx-auto max-w-5xl px-6">
                    <div className="mx-auto mb-12 max-w-xl text-balance text-center md:mb-16">
                        <h2 className="text-4xl font-semibold">You&apos;re in good company</h2>
                        <p
                            data-current={currentGroup}
                            className="text-muted-foreground mt-4 text-lg">
                            Reala fits into the tools real estate teams already use for{' '}
                            <span className="in-data-[current=ai]:text-foreground transition-colors duration-200">
                                AI assistance,
                            </span>{' '}
                            <span className="in-data-[current=hosting]:text-foreground transition-colors duration-200">
                                websites and data,
                            </span>{' '}
                            <span className="in-data-[current=payments]:text-foreground transition-colors duration-200">
                                payments and operations,
                            </span>{' '}
                            <span className="in-data-[current=streaming]:text-foreground transition-colors duration-200">
                                content workflows
                            </span>
                        </p>
                    </div>
                    <div className="perspective-dramatic mx-auto grid max-w-5xl grid-cols-3 items-center gap-8 md:h-10 md:grid-cols-5">
                        <AnimatePresence
                            initial={false}
                            mode="popLayout">
                            {logos[currentGroup].map((logo, i) => (
                                <motion.div
                                    key={`${currentGroup}-${i}`}
                                    className="**:fill-foreground! flex items-center justify-center"
                                    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -24, filter: 'blur(6px)', scale: 0.5 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}>
                                    {logo}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
