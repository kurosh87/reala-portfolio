import Image from 'next/image'

export const PollIllustration = () => {
    return (
        <div
            aria-hidden
            className="relative w-full select-none">
            <div className="relative w-full space-y-2 py-4">
                <div className="absolute inset-y-0 left-0 w-px bg-[length:1px_4px] bg-repeat-y opacity-25 [background-image:linear-gradient(180deg,var(--color-foreground)_1px,transparent_1px)]"></div>

                <div className="pl-5">
                    <div className="text-foreground before:border-muted-foreground before:bg-background before:ring-background relative mt-0.5 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
                        <div className="text-muted-foreground text-xs">06 AM</div>
                        Poll Created
                    </div>
                </div>
                <div className="bg-illustration ring-border-illustration relative -mx-5 flex rounded-xl border border-transparent py-1 pl-2 pr-4 text-xs shadow shadow-black/10 ring-1">
                    <div className="before:border-primary before:bg-background before:ring-background relative ml-7 mt-0.5 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[19px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
                        <div className="flex items-center -space-x-2">
                            {[
                                { src: 'https://avatars.githubusercontent.com/u/47919550?v=4', alt: 'Méschac Irung' },
                                { src: 'https://avatars.githubusercontent.com/u/31113941?v=4', alt: 'Bernard Ngandu' },
                            ].map((avatar, index) => (
                                <div
                                    key={index}
                                    className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5 *:rounded-full">
                                    <Image
                                        src={avatar.src}
                                        className="aspect-square rounded-[calc(var(--avatar-radius)-2px)] object-cover"
                                        alt={avatar.alt}
                                        width="46"
                                        height="46"
                                    />
                                </div>
                            ))}
                        </div>
                        +50 Users voted
                    </div>
                </div>
                <div className="pl-5">
                    <div className="text-foreground before:border-muted-foreground before:bg-background before:ring-background relative mt-0.5 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
                        <div className="text-muted-foreground text-xs">01 PM</div>
                        Poll Closed
                    </div>
                </div>
            </div>
        </div>
    )
}