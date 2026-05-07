import type { MetadataRoute } from 'next'

import { validateEnv } from '@/lib/env'

const appUrl = validateEnv().NEXT_PUBLIC_APP_URL

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/wireframe', '/locked', '/tailark-sample', '/book-audit'],
        },
        sitemap: new URL('/sitemap.xml', appUrl).toString(),
    }
}
