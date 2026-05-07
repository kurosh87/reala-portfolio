'use client'

import { useEffect, useId, useRef } from 'react'
import {
    motion,
    type MotionValue,
    useAnimationFrame,
    useMotionTemplate,
    useMotionValue,
} from 'motion/react'

import { cn } from '@/lib/utils'

type InfiniteGridBackgroundProps = {
    className?: string
}

export function InfiniteGridBackground({ className }: InfiniteGridBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const gridOffsetX = useMotionValue(0)
    const gridOffsetY = useMotionValue(0)

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            const bounds = containerRef.current?.getBoundingClientRect()

            if (!bounds) {
                return
            }

            mouseX.set(event.clientX - bounds.left)
            mouseY.set(event.clientY - bounds.top)
        }

        window.addEventListener('pointermove', handlePointerMove)

        return () => window.removeEventListener('pointermove', handlePointerMove)
    }, [mouseX, mouseY])

    useAnimationFrame(() => {
        gridOffsetX.set((gridOffsetX.get() + 0.16) % 36)
        gridOffsetY.set((gridOffsetY.get() + 0.12) % 36)
    })

    const maskImage = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, black, transparent 72%)`

    return (
        <div
            ref={containerRef}
            aria-hidden
            className={cn('pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]', className)}>
            <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_18%,color-mix(in_oklab,var(--color-zinc-300)_30%,transparent),transparent_74%),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-zinc-100)_78%,transparent),transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.11]">
                <GridPattern
                    offsetX={gridOffsetX}
                    offsetY={gridOffsetY}
                />
            </div>
            <motion.div
                className="absolute inset-0 opacity-55"
                style={{
                    maskImage,
                    WebkitMaskImage: maskImage,
                }}>
                <GridPattern
                    offsetX={gridOffsetX}
                    offsetY={gridOffsetY}
                />
            </motion.div>
            <div className="absolute inset-0 bg-[radial-gradient(44%_36%_at_82%_4%,color-mix(in_oklab,var(--color-zinc-500)_26%,transparent),transparent_70%),radial-gradient(52%_46%_at_6%_88%,color-mix(in_oklab,var(--color-slate-700)_10%,transparent),transparent_74%),radial-gradient(36%_30%_at_50%_18%,color-mix(in_oklab,var(--color-zinc-200)_48%,transparent),transparent_78%)]" />
        </div>
    )
}

export const Component = InfiniteGridBackground

const GridPattern = ({
    offsetX,
    offsetY,
}: {
    offsetX: MotionValue<number>
    offsetY: MotionValue<number>
}) => {
    const patternId = useId()

    return (
        <svg
            className="size-full text-muted-foreground"
            role="presentation">
            <defs>
                <motion.pattern
                    id={patternId}
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                    x={offsetX}
                    y={offsetY}>
                    <path
                        d="M 36 0 L 0 0 0 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </motion.pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill={`url(#${patternId})`}
            />
        </svg>
    )
}
