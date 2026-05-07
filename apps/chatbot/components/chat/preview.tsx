"use client";

import { Badge } from "@/components/ui/badge";
import { SparklesIcon } from "./icons";

const handledLeads = [
  {
    name: "Avery Singh",
    meta: "Facebook lead ad",
    summary:
      "Relocating from Calgary in June, needs a three-bedroom near good schools.",
    pills: ["Qualified", "Relocation", "Pre-approved"],
  },
  {
    name: "Jordan Velasco",
    meta: "REW inquiry",
    summary:
      "Asked about a condo listed by another brokerage and shared budget plus timing.",
    pills: ["Qualifying", "Other listing", "Condo"],
  },
  {
    name: "Priya Desai",
    meta: "Website valuation form",
    summary:
      "Requested a listing consultation for next Tuesday and wants staging guidance.",
    pills: ["Seller", "Consult", "Follow-up"],
  },
  {
    name: "Noah Bennett",
    meta: "Instagram DM",
    summary:
      "Wants a private evening tour and shared lender letter plus move date.",
    pills: ["Buyer", "Touring", "Approved"],
  },
];

export function Preview() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-tl-2xl bg-background">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border/20 px-5">
        <div className="flex size-5 items-center justify-center rounded bg-muted/60 ring-1 ring-border/50">
          <SparklesIcon size={10} />
        </div>
        <span className="text-[13px] text-muted-foreground">
          Alex Inbound Leads Agent
        </span>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden px-8 py-10">
        <div className="preview-cursor pointer-events-none absolute top-30 left-[60%] z-30">
          <div className="relative">
            <div className="preview-click-ring absolute top-1 left-1 size-7 rounded-full border border-violet-400/70" />
            <div className="preview-click-ring preview-click-ring-delay absolute top-1 left-1 size-7 rounded-full border border-orange-400/60" />
            <svg
              className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
              fill="none"
              height="28"
              viewBox="0 0 24 24"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 3L18.5 13.5L12.25 14.75L14.5 21L11.75 22L9.5 15.75L5 20V3Z"
                fill="white"
                stroke="rgba(15,15,15,0.9)"
                strokeLinejoin="round"
                strokeWidth="1.4"
              />
            </svg>
          </div>
        </div>

        <div className="preview-content flex flex-1 flex-col gap-8">
          <div className="preview-hero">
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground">
              Alex handled 5 leads today.
            </h2>
            <p className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-muted-foreground/80">
              4 went smoothly. 1 needs you.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm leading-7 text-muted-foreground">
              <span>Avg response 23 s.</span>
              <span>14.3 hrs saved this week.</span>
              <span>8/11 qualified.</span>
            </div>
          </div>

          <div className="grid flex-1 gap-6">
            <section className="preview-section">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Needs you
                </div>
                <span className="text-sm text-muted-foreground">1 lead</span>
              </div>

              <div className="preview-urgent-card rounded-xl border border-border/40 bg-background/30 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold text-foreground">
                        Maya Chen
                      </div>
                      <Badge
                        className="h-5 border-emerald-500/40 bg-transparent px-2 text-[10px] text-emerald-300 hover:bg-transparent"
                        variant="outline"
                      >
                        New
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Realtor.ca lead
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <Badge
                      className="gap-2 border-border/60 bg-transparent"
                      variant="outline"
                    >
                      <span className="size-2 rounded-full bg-sky-400" />
                      Requested
                    </Badge>
                    <Badge className="border-border/60 bg-transparent" variant="outline">
                      Own listing
                    </Badge>
                    <Badge className="border-border/60 bg-transparent" variant="outline">
                      Showing
                    </Badge>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Asked to confirm a 6:30 PM showing on your Oakridge listing and
                  wants to know whether her partner can join.
                </p>
              </div>
            </section>

            <section className="preview-section min-h-0 overflow-hidden">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Handled
                </div>
                <span className="text-sm text-muted-foreground">4 leads</span>
              </div>

              <div className="relative h-[360px] overflow-hidden">
                <div className="preview-scroll-stack grid gap-3 pb-6">
                  {[...handledLeads, ...handledLeads].map((lead, index) => (
                    <div
                      className="rounded-xl border border-border/40 bg-background/30 px-4 py-4"
                      key={`${lead.name}-${index}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold text-foreground">
                            {lead.name}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {lead.meta}
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          {lead.pills.map((pill) => (
                            <Badge
                              className="border-border/60 bg-transparent"
                              key={`${lead.name}-${index}-${pill}`}
                              variant="outline"
                            >
                              {pill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {lead.summary}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background via-background/75 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-content {
          animation: panelFade 900ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preview-hero {
          animation: heroRise 900ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preview-section {
          animation: sectionRise 1000ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preview-urgent-card {
          animation: urgentPulse 4.8s ease-in-out infinite;
        }

        .preview-scroll-stack {
          animation: autoScroll 18s linear infinite;
        }

        .preview-cursor {
          animation: cursorTour 11s ease-in-out infinite;
        }

        .preview-click-ring {
          animation: clickPulse 2.8s ease-out infinite;
        }

        .preview-click-ring-delay {
          animation-delay: 1.4s;
        }

        @keyframes panelFade {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroRise {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sectionRise {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes urgentPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.06);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 20px 40px -28px rgba(249, 115, 22, 0.42);
            transform: translateY(-2px);
          }
        }

        @keyframes autoScroll {
          0%,
          14% {
            transform: translateY(0);
          }
          24%,
          38% {
            transform: translateY(-126px);
          }
          48%,
          62% {
            transform: translateY(-252px);
          }
          72%,
          86% {
            transform: translateY(-378px);
          }
          100% {
            transform: translateY(-504px);
          }
        }

        @keyframes cursorTour {
          0%,
          10% {
            transform: translate(0, 0) scale(1);
          }
          18% {
            transform: translate(18px, 0px) scale(0.96);
          }
          28%,
          38% {
            transform: translate(510px, 116px) scale(1);
          }
          46% {
            transform: translate(520px, 128px) scale(0.95);
          }
          58%,
          70% {
            transform: translate(540px, 388px) scale(1);
          }
          78% {
            transform: translate(548px, 398px) scale(0.96);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes clickPulse {
          0%,
          68%,
          100% {
            opacity: 0;
            transform: scale(0.25);
          }
          12% {
            opacity: 0.9;
            transform: scale(1);
          }
          30% {
            opacity: 0;
            transform: scale(1.8);
          }
        }
      `}</style>
    </div>
  );
}
