"use client"

import * as React from "react"
import { CornerDownLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function HeaderActions() {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "f" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const target = event.target as HTMLElement | null
        const isTyping =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable

        if (!isTyping) {
          event.preventDefault()
          document.getElementById("feedback-trigger")?.click()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              id="feedback-trigger"
              variant="outline"
              size="sm"
              className="h-8 gap-2 rounded-full px-3"
            />
          }
        >
          Feedback
          <Kbd>F</Kbd>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 rounded-xl p-3">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="p-0 focus:bg-transparent"
              onSelect={(event) => event.preventDefault()}
            >
              <textarea
                className="min-h-36 w-full resize-none rounded-lg border bg-muted/50 p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Have an idea to improve this page? Tell the team."
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="/help" className="text-primary hover:underline">
                Contact us
              </a>{" "}
              or{" "}
              <a href="#" className="text-primary hover:underline">
                see docs.
              </a>
            </p>
            <Button size="sm" className="gap-2">
              Send
              <KbdGroup>
                <Kbd className="h-5 min-w-5 border-primary-foreground/20 bg-primary-foreground/20 text-primary-foreground">
                  ⌘
                </Kbd>
                <Kbd className="h-5 min-w-5 border-primary-foreground/20 bg-primary-foreground/20 text-primary-foreground">
                  <CornerDownLeftIcon className="size-3" />
                </Kbd>
              </KbdGroup>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" className="h-8 px-2">
        Help
      </Button>
    </div>
  )
}
