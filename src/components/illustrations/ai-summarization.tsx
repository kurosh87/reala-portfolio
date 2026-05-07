import { Sparkles } from 'lucide-react'
import Image from 'next/image'
const SHADCN_AVATAR = 'https://avatars.githubusercontent.com/u/124599?v=4'

export const AiSummarizationIllustration = () => {
    return (
        <div
            aria-hidden
            className="min-w-xs max-w-xs space-y-3">
            <div className="mask-b-from-35% -m-2 p-2">
                <div className="grid grid-cols-[auto_1fr] gap-2.5">
                    <div className="before:border-foreground/20 relative size-9 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
                        <Image
                            src={SHADCN_AVATAR}
                            alt="shadcn"
                            width={56}
                            height={56}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-end gap-1">
                            <div className="text-sm font-medium [text-trim:both]">Inbound Lead</div>
                            <div className="text-foreground/50 border border-transparent text-xs [text-trim:both]">30s ago</div>
                        </div>
                        <div className="text-foreground/65 text-sm/6">Hi, I&apos;m interested in the Willow Glen listing. Is it still available, and could I see it this afternoon? I&apos;m pre-approved and hoping to move quickly.</div>
                    </div>
                </div>
            </div>

            <div className="text-foreground flex items-center gap-2 text-sm">
                <Sparkles className="text-foreground fill-foreground *:nth-2:text-purple-400 *:nth-3:text-purple-400 *:not-first:text-foreground/25 size-3.5" />
                Generating lead response
            </div>

            <div className="relative">
                <div className="bg-linear-to-r/shorter absolute inset-0 rounded-xl from-purple-500 to-emerald-500 opacity-25 blur-2xl"></div>
                <div className="bg-card/90 ring-border-illustration shadow-black/6.5 relative rounded-xl p-3 shadow-md ring-1">
                    <div className="text-foreground text-sm/6">Thanks for reaching out. Yes, the home is available. I can meet you this afternoon and send the showing details now.</div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="bg-foreground/5 ring-border-illustration rounded px-2 py-1 text-xs font-medium ring-1">Draft</span>
                        <span className="bg-foreground text-background rounded px-2 py-1 text-xs font-medium">Send</span>
                    </div>
                </div>
            </div>

            <div className="*:active:scale-98 flex items-center gap-1 *:cursor-pointer *:rounded-md *:duration-100">
                <div className="bg-foreground/5 ring-border-illustration rounded px-2 py-1 text-xs font-medium ring-1">Casual</div>
                <div className="hover:bg-foreground/5 text-muted-foreground rounded px-2 py-1 text-xs">Professional</div>
                <div className="hover:bg-foreground/5 text-muted-foreground rounded px-2 py-1 text-xs">Warm</div>
            </div>
        </div>
    )
}

export default AiSummarizationIllustration
