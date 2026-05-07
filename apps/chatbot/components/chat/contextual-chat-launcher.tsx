"use client";

import { unstable_serialize } from "swr/infinite";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { useSWRConfig } from "swr";
import { getChatHistoryPaginationKey } from "@/components/chat/sidebar-history";
import { toast } from "@/components/chat/toast";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import {
  stashPendingChatLaunch,
} from "@/lib/chat-launch-client";
import type { ChatLaunchContext } from "@/lib/chat-launch";

type ContextualChatLauncherProps = {
  context: ChatLaunchContext;
  buttonLabel?: string;
  buttonEffect?: "default" | "rainbow";
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  description?: string;
  promptPlaceholder?: string;
};

export function ContextualChatLauncher({
  context,
  buttonLabel = "Ask Alex",
  buttonEffect = "default",
  buttonVariant = "outline",
  className,
  description,
  promptPlaceholder = "Ask a follow-up, request a summary, or get Alex's next best move...",
}: ContextualChatLauncherProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLaunch = async () => {
    setIsSubmitting(true);

    try {
      const initialPrompt = prompt.trim();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/chat/launch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initialPrompt: initialPrompt || undefined,
            selectedChatModel: DEFAULT_CHAT_MODEL,
            selectedVisibilityType: "private",
            launchContext: context,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to open Alex chat right now.");
      }

      const result = (await response.json()) as {
        chatId: string;
        initialMessageId?: string;
        selectedChatModel: string;
      };

      if (initialPrompt) {
        stashPendingChatLaunch({
          chatId: result.chatId,
          initialPrompt,
          initialMessageId: result.initialMessageId,
          selectedChatModel: result.selectedChatModel,
          createdAt: Date.now(),
        });
      }

      await mutate(unstable_serialize(getChatHistoryPaginationKey));
      setOpen(false);
      setPrompt("");
      router.push(`/chat/${result.chatId}`);
    } catch (error) {
      toast({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to open Alex chat right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {buttonEffect === "rainbow" ? (
          <RainbowButton
            className={className}
            data-testid="ask-alex-trigger"
            size="default"
            variant="outline"
          >
            <Sparkles
              className="text-blue-700 drop-shadow-[0_1px_4px_rgba(29,78,216,0.32)]"
              data-icon="inline-start"
            />
            {buttonLabel}
          </RainbowButton>
        ) : (
          <Button
            className={className}
            data-testid="ask-alex-trigger"
            variant={buttonVariant}
          >
            <Sparkles className="text-blue-700" data-icon="inline-start" />
            {buttonLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Open a new Alex chat</DialogTitle>
          <DialogDescription>
            {description ??
              `Start a full chat thread about ${context.title}. Alex will keep this CRM context attached for follow-ups.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-muted/25 px-4 py-3">
            <p className="font-medium text-sm text-foreground">{context.title}</p>
            <p className="mt-1 text-muted-foreground text-xs">
              {context.scopeType === "record" ? "Record context" : "Section context"} from{" "}
              {context.route}
            </p>
          </div>

          <Textarea
            className="min-h-32 resize-none"
            data-testid="ask-alex-input"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={promptPlaceholder}
            value={prompt}
          />
        </div>

        <DialogFooter>
          <Button
            data-testid="ask-alex-submit"
            disabled={isSubmitting}
            onClick={handleLaunch}
          >
            <Sparkles data-icon="inline-start" />
            {isSubmitting ? "Opening..." : "Open chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
