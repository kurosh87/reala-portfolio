import Image from 'next/image'
import { BERNARD_AVATAR, GLODIE_AVATAR, THEO_AVATAR } from '@/lib/const'
import { Map } from '@/components/map'

export const MapIllustration = () => (
    <>
        <div className="absolute inset-6">
            <div className="absolute left-1/3 top-1/3 z-10 size-8 -translate-x-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
                <div className="relative size-full">
                    <Image
                        className="rounded-full object-cover"
                        src={GLODIE_AVATAR}
                        alt="Glodie"
                        fill
                        sizes="32px"
                    />
                </div>
            </div>
            <div className="absolute right-1/2 top-1/2 z-10 size-8 -translate-y-full translate-x-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
                <div className="relative size-full">
                    <Image
                        className="rounded-full object-cover"
                        src={THEO_AVATAR}
                        alt="Theo"
                        fill
                        sizes="32px"
                    />
                </div>
            </div>
            <div className="absolute right-1/4 top-1/3 z-10 size-8 -translate-y-full translate-x-full rounded-full bg-white p-0.5 shadow-md shadow-black/15">
                <div className="relative size-full">
                    <Image
                        className="rounded-full object-cover"
                        src={BERNARD_AVATAR}
                        alt="Bernard"
                        fill
                        sizes="32px"
                    />
                </div>
            </div>
        </div>
        <div className="isolate">
            <Map />
        </div>
    </>
)
