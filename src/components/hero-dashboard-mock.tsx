import Image from 'next/image'

export function HeroDashboardMock() {
    return (
        <div className="border border-transparent bg-neutral-100/70 px-2 pb-6 sm:px-6">
            <div className="bg-background ring-foreground/10 shadow-black/6.5 -mt-12 overflow-hidden rounded-2xl p-1 shadow-2xl ring-1">
                <div className="relative aspect-[3420/1984] min-h-[20rem] overflow-hidden rounded-[20px] border border-foreground/10 bg-white sm:min-h-[34rem]">
                    <Image
                        src="/reala-dashboard-hero.webp"
                        alt=""
                        aria-hidden="true"
                        fill
                        priority
                        sizes="(min-width: 1024px) 1100px, 100vw"
                        className="object-cover object-top"
                    />
                </div>
            </div>
        </div>
    )
}
