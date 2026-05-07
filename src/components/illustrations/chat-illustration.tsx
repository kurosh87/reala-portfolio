'use client'
import { Loader } from '@/components/ui/loader'
import { ResponseStream } from '@/components/ui/response-stream'
import { useState, useEffect } from 'react'

type ChatIllustrationProps = {
    prompt?: string
    response?: string
}

const defaultPrompt = 'Is the Willow Glen open house still available? I can come by this afternoon.'
const defaultResponse = 'Yes, the home is available. I can meet you this afternoon and send showing details now.'
const followUpResponse = "I'll send a reminder an hour before the showing. See you this afternoon."
const inboundTimeLabel = 'Lead text · 2:14 PM'
const responseTimeLabel = 'AI reply · 8 sec later'
const followUpTimeLabel = 'Follow-up queued · 12 sec later'

export const ChatIllustration = ({ prompt = defaultPrompt, response = defaultResponse }: ChatIllustrationProps) => {
    const [showFirstReply, setShowFirstReply] = useState(false)
    const [showFollowUpTyping, setShowFollowUpTyping] = useState(false)
    const [showFollowUpReply, setShowFollowUpReply] = useState(false)

    useEffect(() => {
        const firstReplyTimer = setTimeout(() => setShowFirstReply(true), 400)
        const followUpTypingTimer = setTimeout(() => setShowFollowUpTyping(true), 4200)
        const followUpReplyTimer = setTimeout(() => setShowFollowUpReply(true), 5400)

        return () => {
            clearTimeout(firstReplyTimer)
            clearTimeout(followUpTypingTimer)
            clearTimeout(followUpReplyTimer)
        }
    }, [])
    return (
        <div
            aria-hidden
            className="flex w-full min-w-0 flex-col gap-6 overflow-visible">
            <div>
                <div className="before:mask-x-from-75% before:border-foreground/10 relative before:absolute before:inset-0 before:border-y before:border-dashed">
                    <div className="relative mx-auto w-full max-w-sm px-2">
                        <div className="max-w-3/4 bg-linear-to-b from-card ring-foreground/10 inset-ring inset-ring-background/50 ml-auto w-fit rounded-t-2xl rounded-bl-2xl rounded-br to-indigo-100/50 p-3 text-sm text-indigo-950 shadow-md shadow-indigo-600/10 ring-1">{prompt}</div>
                    </div>
                </div>
                <div className="mx-auto mt-1 w-full max-w-sm px-2">
                    <span className="text-muted-foreground block text-right text-xs">{inboundTimeLabel}</span>
                </div>
            </div>
            <div className="space-y-5">
                <div>
                    <div className="before:mask-x-from-75% before:border-foreground/10 relative before:absolute before:-inset-x-12 before:inset-y-0 before:border-y before:border-dashed">
                        <div className="relative mx-auto w-full max-w-sm px-2">
                            {showFirstReply ? (
                                <div className="max-w-3/4 bg-linear-to-b from-card ring-foreground/10 inset-ring inset-ring-background/50 w-fit rounded-t-2xl rounded-bl rounded-br-2xl to-emerald-50/50 p-3 text-sm text-emerald-950 shadow-md shadow-emerald-600/10 ring-1">
                                    <ResponseStream
                                        textStream={response}
                                        mode="typewriter"
                                        className="text-sm"
                                        speed={40}
                                    />
                                </div>
                            ) : (
                                <div className="py-2">
                                    <Loader
                                        variant="typing"
                                        size="sm"
                                        className="[--color-primary:var(--color-muted-foreground)]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {showFirstReply ? (
                        <div className="mx-auto mt-1 w-full max-w-sm px-2">
                            <span className="text-muted-foreground block text-left text-xs">{responseTimeLabel}</span>
                        </div>
                    ) : null}
                </div>
                {showFollowUpTyping ? (
                    <div>
                        <div className="before:mask-x-from-75% before:border-foreground/10 relative before:absolute before:-inset-x-12 before:inset-y-0 before:border-y before:border-dashed">
                            <div className="relative mx-auto w-full max-w-sm px-2">
                                {showFollowUpReply ? (
                                    <div className="max-w-3/4 bg-linear-to-b from-card ring-foreground/10 inset-ring inset-ring-background/50 w-fit rounded-t-2xl rounded-bl rounded-br-2xl to-emerald-50/50 p-3 text-sm text-emerald-950 shadow-md shadow-emerald-600/10 ring-1">
                                        <ResponseStream
                                            textStream={followUpResponse}
                                            mode="typewriter"
                                            className="text-sm"
                                            speed={40}
                                        />
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        <Loader
                                            variant="typing"
                                            size="sm"
                                            className="[--color-primary:var(--color-muted-foreground)]"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {showFollowUpReply ? (
                            <div className="mx-auto mt-1 w-full max-w-sm px-2">
                                <span className="text-muted-foreground block text-left text-xs">{followUpTimeLabel}</span>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
