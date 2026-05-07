import { Heart, ThumbsDown, ThumbsUp } from 'lucide-react'

const listings = [
    {
        name: 'Willow Glen Bungalow',
        meta: '3 bed · Open house today',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=160&q=80',
        action: ThumbsUp,
    },
    {
        name: 'Maple Ridge Townhome',
        meta: 'Low HOA · Near schools',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&q=80',
        action: Heart,
    },
    {
        name: 'Cedar Park Condo',
        meta: 'Shortlist backup',
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=160&q=80',
        action: ThumbsDown,
    },
]

export const KitIllustration = () => (
    <div
        aria-hidden
        className="bg-illustration ring-border-illustration mx-auto w-full min-w-0 max-w-[20rem] overflow-hidden rounded-2xl border border-transparent p-3 shadow shadow-black/10 ring-1 sm:max-w-[22rem] sm:p-4">
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0 truncate text-sm font-medium">Listing Shortlist</div>
            <div className="text-muted-foreground shrink-0 text-xs">3 homes</div>
        </div>
        <div className="flex flex-col gap-2">
            {listings.map((listing) => {
                const ActionIcon = listing.action

                return (
                    <div
                        key={listing.name}
                        className="bg-background/75 ring-foreground/10 flex min-w-0 items-center gap-2 rounded-xl p-2 ring-1 sm:gap-3">
                        <div
                            className="size-10 shrink-0 rounded-lg bg-cover bg-center sm:size-12"
                            style={{ backgroundImage: `url(${listing.image})` }}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{listing.name}</div>
                            <div className="text-muted-foreground truncate text-xs">{listing.meta}</div>
                        </div>
                        <div className="bg-background ring-foreground/10 flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 sm:size-9">
                            <ActionIcon className="size-4" />
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
)
