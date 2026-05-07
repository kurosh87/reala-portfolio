import type { MetadataRoute } from 'next'

import { validateEnv } from '@/lib/env'

const appUrl = validateEnv().NEXT_PUBLIC_APP_URL

const publicRoutes = [
    { path: '/', priority: 1 },
    { path: '/product/ai-workflow-audit', priority: 0.9 },
    { path: '/company/contact', priority: 0.8 },
    { path: '/company/about', priority: 0.6 },
    { path: '/privacy', priority: 0.2 },
    { path: '/terms', priority: 0.2 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date()

    return publicRoutes.map((route) => ({
        url: new URL(route.path, appUrl).toString(),
        lastModified,
        changeFrequency: route.path === '/' ? 'weekly' : 'monthly',
        priority: route.priority,
    }))
}
