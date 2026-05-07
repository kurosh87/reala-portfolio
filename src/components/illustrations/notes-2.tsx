import { Home, Play, Target } from 'lucide-react'

export const Notes2Illustration = () => {
    return (
        <div
            aria-hidden
            className="mask-b-from-65% w-full max-w-md px-4 pt-1 @5xl:max-w-sm @5xl:px-0">
            <div className="bg-illustration shadow-black/6.5 ring-border-illustration z-1 relative rounded-2xl p-5 shadow-lg ring-1 @5xl:p-4">
                <span className="text-muted-foreground text-xs">
                    Today <span className="bg-foreground/50 size-0.5 rounded-full"></span> <span>09:15 AM</span>{' '}
                </span>
                <div className="mt-1 text-base font-semibold @lg:text-lg">Shortlist Package</div>

                <div className="bg-foreground/10 group relative mb-4 mt-3 h-fit w-fit cursor-pointer overflow-hidden rounded-full p-px shadow-md shadow-black/5">
                    <div className="bg-linear-to-br/increasing mask-r-to-75% mask-r-from-25% duration-2000 absolute inset-0 aspect-square -translate-y-1/3 animate-spin from-emerald-400 via-blue-500 to-indigo-400 opacity-50"></div>
                    <div className="group-hover:bg-illustration bg-background/95 relative flex h-8 items-center gap-1.5 rounded-full px-3 text-sm duration-100">
                        <Play className="fill-foreground *:not-first:opacity-50 size-3" />
                        03:47
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="*:not-first:text-foreground/50 flex min-w-0 gap-2 border-b *:-mb-px *:flex *:min-w-0 *:cursor-pointer *:items-center *:gap-1 *:py-2 *:text-xs *:[&>svg]:size-3.5 @lg:gap-3">
                        <div className="border-primary shrink-0 border-b">
                            <Target />
                            <span>Summary</span>
                        </div>
                        <div className="shrink-0">
                            <Home />
                            <span>Willow Glen</span>
                        </div>
                        <div className="flex-1">
                            <Home />
                            <span className="truncate">Oakridge Ave</span>
                        </div>
                    </div>
                    <div className="space-y-3 text-xs @lg:text-sm">
                        <p className="text-muted-foreground">Here are two homes that match your school-zone, quiet-street, and afternoon showing preferences.</p>
                        <ul className="text-muted-foreground list-disc space-y-1.5 pl-4">
                            <li>
                                <span className="text-foreground font-medium">Willow Glen:</span> closest to your preferred school and park
                            </li>
                            <li>
                                <span className="text-foreground font-medium">Oakridge Ave:</span> larger yard on a quieter block
                            </li>
                            <li>
                                <span className="text-foreground font-medium">Showing plan:</span> both can be toured this afternoon
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notes2Illustration
