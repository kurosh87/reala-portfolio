import { ImageResponse } from 'next/og'

export const alt = 'Reala AI Workflow Audit for Real Estate Teams'

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#f7f7f5',
                    color: '#09090b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 72,
                    fontFamily: 'Arial, sans-serif',
                    border: '1px solid #dedbd4',
                }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        fontSize: 40,
                        fontWeight: 700,
                    }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            background: '#09090b',
                            color: '#f7f7f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 34,
                            fontWeight: 800,
                        }}>
                        R
                    </div>
                    Reala
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <div
                        style={{
                            fontSize: 22,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            color: '#6b7280',
                        }}>
                        AI Workflow Audit
                    </div>
                    <div
                        style={{
                            maxWidth: 920,
                            fontSize: 78,
                            lineHeight: 0.96,
                            fontWeight: 800,
                            letterSpacing: -2,
                        }}>
                        Find where real estate leads go cold.
                    </div>
                    <div
                        style={{
                            maxWidth: 860,
                            fontSize: 30,
                            lineHeight: 1.3,
                            color: '#4b5563',
                        }}>
                        Then build the response, follow-up, and CRM workflows that move faster.
                    </div>
                </div>
            </div>
        ),
        size,
    )
}
