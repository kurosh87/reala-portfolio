import {
  ChartPie,
  Clock9,
  MessageCircleHeart,
  Puzzle,
  Tickets,
  UserRoundPen,
} from "lucide-react"

export default function DescriptionList5() {
  return (
    <section className="bg-background py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-balance text-4xl font-semibold">
            Common workflow opportunities
          </h2>
          <div className="@container lg:col-span-2">
            <dl className="@md:grid-cols-2 @2xl:grid-cols-3 @2xl:gap-12 grid gap-6 *:space-y-2">
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <UserRoundPen className="*:not-nth-2:opacity-50 *:nth-2:fill-primary *:nth-2:stroke-primary size-4 drop-shadow" />
                  New lead response
                </dt>
                <dd className="text-muted-foreground">
                  Follow up on web, portal, ad, and sign leads faster.
                </dd>
              </div>
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <ChartPie className="*:first:fill-primary *:first:stroke-primary size-4 drop-shadow" />
                  CRM cleanup
                </dt>
                <dd className="text-muted-foreground">
                  Standardize stages, tasks, and next steps before automating.
                </dd>
              </div>
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <MessageCircleHeart className="*:last:fill-primary fill-illustration size-4 drop-shadow" />
                  Past-client reactivation
                </dt>
                <dd className="text-muted-foreground">
                  Restart dormant relationships with timely outreach and reminders.
                </dd>
              </div>
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <Tickets className="*:first:fill-primary size-4 drop-shadow" />
                  Listing marketing
                </dt>
                <dd className="text-muted-foreground">
                  Generate descriptions, posts, emails, and launch content faster.
                </dd>
              </div>
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <Clock9 className="fill-background *:not-nth-2:stroke-foreground/50 *:nth-2:stroke-primary size-4 drop-shadow" />
                  Client updates
                </dt>
                <dd className="text-muted-foreground">
                  Keep buyers and sellers informed at every milestone.
                </dd>
              </div>
              <div>
                <dt className="text-foreground flex items-center gap-2 font-medium">
                  <Puzzle className="fill-background size-4 drop-shadow" />
                  Team reporting
                </dt>
                <dd className="text-muted-foreground">
                  Track response times, activity, and handoffs in one view.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
