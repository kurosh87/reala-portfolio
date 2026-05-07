'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useMedia } from '@/hooks/use-media'
import { MapIllustration } from "@/components/ui/illustrations/map-illustration"
import Models4Illustration from "@/components/ui/illustrations/models-4-illustrations"
import { WorkflowIllustration } from "@/components/ui/illustrations/workflow-illustration"

const AUTOPLAY_DURATION = 7000

const features = [
    {
        title: 'Lead response',
        description: 'Catch new inquiries quickly and route them with useful context.',
        ariaLabel: 'expand lead response workflow',
        image: 'https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c1_sc01ut.png',
        imageAlt: 'bg c1',
        illustration: <WorkflowIllustration />,
        illustrationClassName: '',
    },
    {
        title: 'Client updates',
        description: 'Keep buyers and sellers informed without adding more admin work.',
        ariaLabel: 'expand client updates workflow',
        image: 'https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png',
        imageAlt: 'bg c3',
        illustration: <MapIllustration />,
        illustrationClassName: '',
    },
    {
        title: 'Visibility',
        description: 'See what is happening across follow-up, workflows, and activity.',
        ariaLabel: 'expand visibility workflow',
        image: 'https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c4_rg6vjt.png',
        imageAlt: 'bg c4',
        illustration: <Models4Illustration />,
        illustrationClassName: 'scale-90',
    },
]

export default function ExpandableFeatures() {
    const [expandedIndex, setExpandedIndex] = useState<number>(0)
    const [progressKey, setProgressKey] = useState(0)
    const [paused, setPaused] = useState(false)
    const isMd = useMedia('(min-width: 768px)')
    const activeIndex = isMd ? expandedIndex : 0
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const pausedRef = useRef(false)

    const resetTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            if (pausedRef.current) return
            setExpandedIndex((current) => (current + 1) % features.length)
            setProgressKey((k) => k + 1)
        }, AUTOPLAY_DURATION)
    }, [])

    useEffect(() => {
        if (!isMd) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
        }
        resetTimer()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [resetTimer, isMd])

    const handleSelect = (index: number) => {
        if (!isMd || index === activeIndex) return
        setExpandedIndex(index)
        setProgressKey((k) => k + 1)
        resetTimer()
    }

    const handleMouseEnter = (index: number) => {
        if (!isMd) return
        if (index === activeIndex) {
            pausedRef.current = true
            setPaused(true)
        }
    }

    const handleMouseLeave = (index: number) => {
        if (!isMd) return
        if (index === activeIndex) {
            pausedRef.current = false
            setPaused(false)
        }
    }

    return (
        <section className="bg-background @container py-24">
            <style>{`
                @keyframes expandProgress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-6 lg:mb-10">
                    <h2 className="text-foreground max-w-md text-balance text-4xl font-semibold">Where the audit usually finds the biggest lift</h2>
                </div>

                <div className={cn('grid gap-8 md:grid-cols-[1fr_1fr_1fr] md:gap-3 md:transition-[grid-template-columns] md:duration-500', expandedIndex === 0 && 'md:grid-cols-[2fr_1fr_1fr]', expandedIndex === 1 && 'md:grid-cols-[1fr_2fr_1fr]', expandedIndex === 2 && 'md:grid-cols-[1fr_1fr_2fr]')}>
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            data-expanded={activeIndex === index}
                            className="relative row-span-2 grid grid-rows-subgrid gap-4 text-left"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}>
                            <div className="inset-ring-1 inset-ring-border-illustration h-104 relative flex items-center justify-center overflow-hidden rounded-2xl">
                                <img
                                    src={feature.image}
                                    alt={feature.imageAlt}
                                    className="absolute inset-0 size-full object-cover opacity-50 dark:opacity-25"
                                />
                                <div className={feature.illustrationClassName}>{feature.illustration}</div>
                            </div>
                            <div>
                                {isMd && (
                                    <>
                                        <button
                                            className="absolute inset-0 cursor-pointer"
                                            aria-label={feature.ariaLabel}
                                            onClick={() => handleSelect(index)}
                                            aria-expanded={activeIndex === index}
                                        />

                                        <div className="bg-muted relative h-px">
                                            {activeIndex === index && (
                                                <div
                                                    key={progressKey}
                                                    className="bg-linear-to-r absolute inset-0 h-full origin-left rounded-full from-emerald-500 to-indigo-400"
                                                    style={{ animation: `expandProgress ${AUTOPLAY_DURATION}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}

                                <p className="text-muted-foreground text-balance md:mt-4">
                                    <strong className="text-foreground font-medium">{feature.title}</strong> <span className="md:not-in-data-[expanded=true]:opacity-0 md:in-data-[expanded=true]:delay-300 md:not-in-data-[expanded=true]:blur-xs md:in-data-[expanded=true]:duration-300">{feature.description}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
