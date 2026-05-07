import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const calendlyHref = "https://calendly.com/reala/setup-call";

export default function InterestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Thanks for your interest
      </h1>
      <p className="text-sm leading-6 text-muted-foreground">
        We&apos;re only working with agents who want a custom setup right now.
      </p>
      <p className="text-sm leading-6 text-muted-foreground">
        If that&apos;s you, book a setup call and we&apos;ll walk through your
        workflow, lead routing, and rollout plan together.
      </p>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href={calendlyHref} rel="noopener noreferrer" target="_blank">
            <CalendarDaysIcon className="size-4" />
            Book a custom setup call
          </Link>
        </Button>
        <Button asChild className="w-full sm:w-auto" variant="ghost">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
