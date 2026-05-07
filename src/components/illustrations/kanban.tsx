import { PlusIcon } from 'lucide-react'

const KanbanIllustration = () => {
    return (
        <div
            className="mask-b-from-65% w-full min-w-0 overflow-visible px-0 @md:px-2"
            aria-hidden>
            <div className="grid min-w-0 grid-cols-2 gap-2 *:min-w-0 *:rounded-xl *:border *:p-1">
                <div>
                    <div className="text-foreground/65 px-2 pb-2 pt-1 text-xs font-semibold">In Progress</div>
                    <div className="space-y-3">
                        <div className="ring-border-illustration relative h-32 rounded-xl ring-1">
                            <div
                                className="absolute inset-2 z-0 opacity-25"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-zinc-500) 1px, transparent 0)',
                                    backgroundSize: '12px 12px',
                                }}
                            />
                            <div className="bg-illustration z-1 rotate-4 translate-4 ring-border-illustration absolute inset-0 flex h-32 flex-col justify-between rounded-xl p-4 shadow-2xl shadow-indigo-900/30 ring-1 dark:shadow-black/50">
                                <div className="text-sm font-semibold">Follow up with Willow Glen lead</div>

                                <div className="flex items-center gap-1.5">
                                    <div className="relative flex size-4 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-400 via-violet-500 to-sky-500 text-[8px] font-semibold text-white before:absolute before:inset-0 before:rounded-full before:border before:border-foreground/20">
                                        S
                                    </div>
                                    <span className="truncate text-xs font-medium">Sarah Mitchell</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-foreground/5 flex cursor-pointer gap-2 rounded-xl p-2">
                            <PlusIcon className="size-4 opacity-50" />
                            <span className="text-xs font-medium">Add new task</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-foreground/65 px-2 pb-2 pt-1 text-xs font-semibold">Ready for Review</div>
                    <div className="space-y-3">
                        <div className="relative flex h-32 items-center justify-center rounded-xl ring-1 ring-foreground/10">
                            <div className="text-muted-foreground text-sm font-semibold">Drop here</div>

                            <div
                                className="absolute inset-2 z-0 opacity-15"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-zinc-500) 1px, transparent 0)',
                                    backgroundSize: '12px 12px',
                                }}
                            />
                        </div>
                    </div>
                    <div className="bg-foreground/5 mt-auto flex cursor-pointer gap-2 rounded-xl p-2">
                        <PlusIcon className="size-4 opacity-50" />
                        <span className="text-xs font-medium">Add new task</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KanbanIllustration
