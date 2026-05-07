'use client'

import React, { useMemo } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

export type TextShimmerProps = {
    children: string
    as?: React.ElementType
    className?: string
    duration?: number
    spread?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const motionCreateCache = new Map<React.ElementType, any>()

function getMotionComponent(el: React.ElementType) {
    if (!motionCreateCache.has(el)) {
        motionCreateCache.set(el, motion.create(el as keyof React.JSX.IntrinsicElements))
    }

    return motionCreateCache.get(el)!
}

/* eslint-disable react-hooks/static-components */
function TextShimmerComponent({ children, as: Component = 'p', className, duration = 2, spread = 2 }: TextShimmerProps) {
    const MotionComponent = getMotionComponent(Component)

    const dynamicSpread = useMemo(() => {
        return children.length * spread
    }, [children, spread])

    return (
        <MotionComponent
            className={cn(
                'bg-size-[250%_100%,auto] relative inline-block bg-clip-text',
                'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
                '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
                'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
                className
            )}
            initial={{ backgroundPosition: '100% center' }}
            animate={{ backgroundPosition: '0% center' }}
            transition={{
                repeat: Infinity,
                duration,
                ease: 'linear',
            }}
            style={
                {
                    '--spread': `${dynamicSpread}px`,
                    backgroundImage: 'var(--bg), linear-gradient(var(--base-color), var(--base-color))',
                } as React.CSSProperties
            }>
            {children}
        </MotionComponent>
    )
}

export const TextShimmer = React.memo(TextShimmerComponent)
