'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Home, MessageSquareText, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { LogoIcon } from '@/components/logo'
import { Deepseek } from '@/components/ui/svgs/deepseek'
import { Gemini } from '@/components/ui/svgs/gemini'
import { Openai } from '@/components/ui/svgs/openai'
import { ResponseStream } from '@/components/ui/response-stream'
import { TextShimmer } from '@/components/ui/text-shimmer'

const CYCLE_DURATION = 7000

const events = [
    { id: 0, icon: Home, label: 'Open House Inquiry', color: 'blue' },
    { id: 1, icon: MessageSquareText, label: 'Website Lead', color: 'emerald' },
    { id: 2, icon: Send, label: 'Showing Request', color: 'amber' },
]

const responses = [
    { id: 0, text: 'Alex replies in under 30 seconds with showing details and the next qualifying question.', color: 'blue' },
    { id: 1, text: 'Reala checks availability, drafts the reply, and keeps the lead moving while intent is hot.', color: 'emerald' },
    { id: 2, text: 'The showing request is routed, tagged, and followed up before it falls through the cracks.', color: 'amber' },
]

const pathTransition = {
    duration: 1,
    ease: 'easeInOut' as const,
}

export const VisualizationIllustration = () => {
    const [activeEvent, setActiveEvent] = useState(0)
    const [containerWidth, setContainerWidth] = useState(0)
    const [showShimmer, setShowShimmer] = useState(false)
    const [showResponse, setShowResponse] = useState(false)
    const spanRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveEvent((prev) => (prev + 1) % events.length)
        }, CYCLE_DURATION)

        return () => window.clearInterval(interval)
    }, [])

    useEffect(() => {
        const updateWidth = () => {
            if (spanRef.current) {
                setContainerWidth(spanRef.current.offsetWidth + 32)
            }
        }

        updateWidth()
        const timer = window.setTimeout(updateWidth, 50)

        return () => window.clearTimeout(timer)
    }, [activeEvent])

    useEffect(() => {
        queueMicrotask(() => {
            setShowShimmer(false)
            setShowResponse(false)
        })

        const showShimmerTimer = window.setTimeout(() => setShowShimmer(true), 2000)
        const hideShimmerTimer = window.setTimeout(() => {
            setShowShimmer(false)
            setShowResponse(true)
        }, 4500)

        return () => {
            window.clearTimeout(showShimmerTimer)
            window.clearTimeout(hideShimmerTimer)
        }
    }, [activeEvent])

    const currentEvent = useMemo(() => events[activeEvent], [activeEvent])
    const currentResponse = useMemo(() => responses[activeEvent], [activeEvent])
    const CurrentEventIcon = currentEvent.icon

    return (
        <div
            aria-hidden
            className="relative flex min-h-[420px] w-full min-w-[320px] items-center justify-center overflow-visible">
            <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">
                <svg
                    viewBox="0 0 131 245"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground/10 absolute inset-x-0 top-8 mx-auto w-2/3">
                    <path
                        d="M65.5 0V49"
                        stroke="currentColor"
                    />
                    <path
                        d="M65.5 106V155"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />
                    <path
                        d="M0.5 155.5C0.5 143.074 10.5736 133 23 133H26.119C38.5003 133 54.5209 132.623 59.5305 121.301C61.9802 115.764 63.8576 109.843 64 106"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />
                    <path
                        d="M130.5 155.5C130.5 143.074 120.426 133 108 133H104.881C92.4997 133 76.4791 132.623 71.4695 121.301C69.0198 115.764 67.1424 109.843 67 106"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />
                    <path
                        d="M65.5 244L65.5 195"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />
                    <path
                        d="M130.5 195V244"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />
                    <path
                        d="M0.5 195V244"
                        stroke="currentColor"
                        strokeLinecap="round"
                    />

                    <motion.path
                        key={`event-tailark-${activeEvent}`}
                        d="M65.5 0V49"
                        pathLength="1"
                        stroke={`var(--color-${currentEvent.color}-400)`}
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={pathTransition}
                    />

                    <motion.path
                        key={`tailark-llm-center-${activeEvent}`}
                        d="M65.5 106V155"
                        pathLength="1"
                        stroke="var(--color-indigo-400)"
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 0.5 }}
                    />

                    <motion.path
                        key={`tailark-llm-left-${activeEvent}`}
                        d="M64 106C63.8576 109.843 61.9802 115.764 59.5305 121.301C54.5209 132.623 38.5003 133 26.119 133H23C10.5736 133 0.5 143.074 0.5 155.5"
                        pathLength="1"
                        stroke="var(--color-purple-400)"
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 0.6 }}
                    />

                    <motion.path
                        key={`tailark-llm-right-${activeEvent}`}
                        d="M67 106C67.1424 109.843 69.0198 115.764 71.4695 121.301C76.4791 132.623 92.4997 133 104.881 133H108C120.426 133 130.5 143.074 130.5 155.5"
                        pathLength="1"
                        stroke="var(--color-cyan-400)"
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 0.7 }}
                    />

                    <motion.path
                        key={`llm-response-center-${activeEvent}`}
                        d="M65.5 195V244"
                        pathLength="1"
                        stroke={`var(--color-${currentResponse.color}-400)`}
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 1.5 }}
                    />

                    <motion.path
                        key={`llm-response-right-${activeEvent}`}
                        d="M130.5 195V244"
                        pathLength="1"
                        stroke={`var(--color-${currentResponse.color}-400)`}
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 1.6 }}
                    />

                    <motion.path
                        key={`llm-response-left-${activeEvent}`}
                        d="M0.5 195V244"
                        pathLength="1"
                        stroke={`var(--color-${currentResponse.color}-400)`}
                        strokeLinecap="round"
                        strokeDasharray="0.3 2"
                        initial={{ strokeDashoffset: 1.3 }}
                        animate={{ strokeDashoffset: -2 }}
                        transition={{ ...pathTransition, delay: 1.7 }}
                    />
                </svg>

                <motion.div
                    className="bg-card ring-border-illustration h-8 overflow-hidden rounded-full px-4 ring-1"
                    animate={{ width: containerWidth > 0 ? containerWidth : 'auto' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeEvent}
                            initial={{ opacity: 0, filter: 'blur(4px)', x: -32 }}
                            exit={{ opacity: 0, filter: 'blur(4px)', x: 32 }}
                            animate={{ opacity: 1, filter: 'blur(0)', x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex h-8 items-center">
                            <span
                                ref={spanRef}
                                className="flex text-nowrap text-sm font-medium">
                                <CurrentEventIcon className="mr-2 size-4 text-muted-foreground" />
                                {currentEvent.label}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                <div className="size-17 mb-13.5 relative mt-14 flex -translate-y-px">
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground/25 absolute inset-px animate-pulse">
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeDasharray="2 5"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            stroke="currentColor"
                            initial={{ strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -100 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                    </svg>

                    <div className="absolute inset-3 opacity-50">
                        <div className="bg-linear-to-r absolute inset-0 animate-pulse rounded-xl from-purple-400 to-blue-500 blur-md" />
                    </div>
                    <div className="bg-radial to-card/50 from-card shadow-black/6.5 ring-border-illustration relative m-auto flex size-11 items-center justify-center rounded-full from-35% shadow-xl ring-1 backdrop-blur">
                        <LogoIcon className="size-4 drop-shadow" />
                    </div>
                </div>

                <div className="relative mb-14 flex items-center gap-8">
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex size-11 rounded-full shadow-md ring-1 *:m-auto">
                        <Gemini className="size-5" />
                    </div>
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex size-11 rounded-full shadow-md ring-1 *:m-auto">
                        <Openai className="fill-foreground size-5" />
                    </div>
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex size-11 rounded-full shadow-md ring-1 *:m-auto">
                        <Deepseek className="size-5" />
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-linear-to-r absolute inset-0 rounded-xl from-purple-400 to-blue-500 opacity-25 mix-blend-lighten blur-md dark:mix-blend-overlay" />

                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 text-foreground/65 h-26 w-56 overflow-hidden rounded-2xl px-5 py-3 text-sm shadow-md ring-1">
                        {showShimmer ? <TextShimmer>Generating...</TextShimmer> : null}
                        {showResponse ? (
                            <ResponseStream
                                key={activeEvent}
                                textStream={currentResponse.text}
                                mode="typewriter"
                                speed={25}
                                segmentDelay={2}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
