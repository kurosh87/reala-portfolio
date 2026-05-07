import { Fingerprint } from 'lucide-react'

export const FingerprintIllustration = () => (
    <div
        aria-hidden
        className="bg-illustration ring-border-illustration mx-auto flex w-full max-w-[15rem] items-center justify-center rounded-2xl border border-transparent p-6 shadow shadow-black/10 ring-1">
        <div className="relative flex size-28 items-center justify-center rounded-full border border-dashed border-foreground/15">
            <div className="absolute inset-3 rounded-full border border-foreground/10" />
            <div className="absolute inset-6 rounded-full border border-foreground/10" />
            <Fingerprint className="text-foreground/80 size-14" />
        </div>
    </div>
)
