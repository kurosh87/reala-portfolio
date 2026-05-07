'use client'

import { useState } from 'react'
import { Webhook, CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Slack } from '@/components/ui/svgs/slack'
import { Twilio } from '@/components/ui/svgs/twilio'
import { Gmail } from '@/components/ui/svgs/gmail'

const triggerTransition = {
    duration: 1.2,
    ease: 'easeInOut' as const,
}

const dispatchTransition = {
    duration: 1,
    ease: 'easeOut' as const,
    delay: 0.8,
}

export const Flow3Illustration = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            aria-hidden
            className="relative flex min-h-[420px] w-fit min-w-[420px] items-center justify-center"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}>
            <svg
                viewBox="0 0 400 240"
                fill="none"
                className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-4/5">
                {/* Input line from event */}
                <path
                    d="M60 120 H160"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                />
                {/* Output lines to endpoints - fork pattern */}
                <path
                    d="M220 120 H260"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                />
                <path
                    d="M260 120 Q280 120 290 100 L310 50 Q320 30 340 30"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                />
                <path
                    d="M260 120 H340"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                />
                <path
                    d="M260 120 Q280 120 290 140 L310 190 Q320 210 340 210"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                />

                <motion.path
                    d="M60 120 H160"
                    pathLength="1"
                    stroke="url(#flow3-trigger)"
                    strokeLinecap="round"
                    strokeDasharray="0.3 2"
                    initial={{ strokeDashoffset: 1.3 }}
                    animate={isHovered ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }}
                    transition={isHovered ? triggerTransition : { duration: 0 }}
                />

                <motion.path
                    d="M220 120 H260 Q280 120 290 100 L310 50 Q320 30 340 30"
                    pathLength="1"
                    stroke="url(#flow3-dispatch-1)"
                    strokeLinecap="round"
                    strokeDasharray="0.3 2"
                    initial={{ strokeDashoffset: 1.3 }}
                    animate={isHovered ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }}
                    transition={isHovered ? dispatchTransition : { duration: 0 }}
                />
                <motion.path
                    d="M220 120 H340"
                    pathLength="1"
                    stroke="url(#flow3-dispatch-2)"
                    strokeLinecap="round"
                    strokeDasharray="0.3 2"
                    initial={{ strokeDashoffset: 1.3 }}
                    animate={isHovered ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }}
                    transition={isHovered ? { ...dispatchTransition, delay: 1.1 } : { duration: 0 }}
                />
                <motion.path
                    d="M220 120 H260 Q280 120 290 140 L310 190 Q320 210 340 210"
                    pathLength="1"
                    stroke="url(#flow3-dispatch-3)"
                    strokeLinecap="round"
                    strokeDasharray="0.3 2"
                    initial={{ strokeDashoffset: 1.3 }}
                    animate={isHovered ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }}
                    transition={isHovered ? { ...dispatchTransition, delay: 1.2 } : { duration: 0 }}
                />

                <defs>
                    <linearGradient
                        id="flow3-trigger"
                        gradientUnits="userSpaceOnUse"
                        x1="220"
                        y1="120"
                        x2="160"
                        y2="120">
                        <stop
                            offset="0%"
                            stopOpacity={0}
                            stopColor="transparent"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-green-400)"
                        />
                    </linearGradient>
                    <linearGradient
                        id="flow3-dispatch-1"
                        gradientUnits="userSpaceOnUse"
                        x1="220"
                        y1="120"
                        x2="320"
                        y2="60">
                        <stop
                            offset="0%"
                            stopColor="transparent"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-rose-400)"
                        />
                    </linearGradient>
                    <linearGradient
                        id="flow3-dispatch-2"
                        gradientUnits="userSpaceOnUse"
                        x1="220"
                        y1="120"
                        x2="340"
                        y2="120">
                        <stop
                            offset="0%"
                            stopColor="transparent"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-sky-400)"
                        />
                    </linearGradient>
                    <linearGradient
                        id="flow3-dispatch-3"
                        gradientUnits="userSpaceOnUse"
                        x1="220"
                        y1="120"
                        x2="320"
                        y2="180">
                        <stop
                            offset="0%"
                            stopColor="transparent"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-emerald-400)"
                        />
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative z-10 flex items-center gap-24">
                <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 shadow-md ring-1">
                    <CheckCircle2 className="size-4 fill-emerald-500/10 text-emerald-500" />
                    <span className="text-xs font-semibold">Order Success</span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-zinc-200 py-1.5 pl-1.5 pr-3 text-zinc-950 shadow-lg shadow-black/10 ring-1 ring-black backdrop-blur">
                    <Webhook className="size-4 fill-violet-500/10 text-violet-500" />
                    <span className="text-xs font-semibold">
                        POST <span className="font-mono text-zinc-500">{'/api/hook'}</span>
                    </span>
                </div>

                <div className="gap-18 flex flex-col *:w-fit">
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex items-center gap-2 rounded-full py-2 pl-3 pr-4 shadow-md ring-1">
                        <Twilio className="size-4" />
                        <span className="text-sm font-semibold">Twilio</span>
                    </div>
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex items-center gap-2 rounded-full py-2 pl-3 pr-4 shadow-md ring-1">
                        <Gmail className="size-4" />
                        <span className="text-sm font-semibold">Google Mail</span>
                    </div>
                    <div className="bg-illustration ring-border-illustration shadow-black/6.5 flex items-center gap-2 rounded-full py-2 pl-3 pr-4 shadow-md ring-1">
                        <Slack className="size-4" />

                        <span className="text-sm font-semibold">Slack</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Flow3Illustration
