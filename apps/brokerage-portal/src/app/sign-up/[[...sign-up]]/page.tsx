import Image from "next/image"
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="@container relative min-h-svh overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(-16deg,var(--muted)_50%,var(--background)_50%)]"
      />
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          <Image
            src="/brand/engel-volkers-logo.png"
            alt="Engel & Völkers"
            width={2263}
            height={498}
            priority
            className="h-8 w-auto"
          />
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  )
}
