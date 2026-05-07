"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import type { VisibilityType } from "@/components/chat/visibility-selector";

type SectionCard = {
  title: string;
  body: string;
};

type SectionPageProps = {
  title: string;
  description: string;
  cards: SectionCard[];
};

const readonlyVisibility: VisibilityType = "private";

export function SectionPage({
  title,
  description,
  cards,
}: SectionPageProps) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
          <section className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          </section>

          <div className="w-full border-t border-border/60" />

          <section className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <div
                className="rounded-3xl border border-border/60 bg-card/10 p-5"
                key={card.title}
              >
                <h2 className="text-sm font-semibold text-foreground">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {card.body}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-dashed border-border/70 bg-card/5 p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-foreground">
                Workspace placeholder
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This section is now isolated from the chat runtime and ready for
                real UI work. We can drop in tables, metrics, settings forms,
                queues, or detail panes here without affecting `Today`, `New
                chat`, or active chat threads.
              </p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                Left rail or filters
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                Main content canvas
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                Detail drawer or summary
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
