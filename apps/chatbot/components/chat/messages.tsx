import type { UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDataStream } from "./data-stream-provider";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import { RouteStub } from "./route-stubs";

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  onHandledEndInViewChange?: (inView: boolean) => void;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  isLoading?: boolean;
  selectedModelId: string;
  onEditMessage?: (message: ChatMessage) => void;
};

function GreetingSkeleton() {
  return (
    <div className="w-full pt-4">
      <div className="space-y-4">
        <Skeleton className="h-12 w-[420px] max-w-full rounded-2xl" />
        <Skeleton className="h-12 w-[520px] max-w-full rounded-2xl" />
        <Skeleton className="h-7 w-[380px] max-w-full rounded-xl" />
      </div>

      <div className="mt-12 space-y-10">
        {[1, 2].map((section) => (
          <div key={section}>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-48 rounded-xl" />
                    <Skeleton className="h-5 w-32 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <Skeleton className="h-5 w-full rounded-lg" />
                  <Skeleton className="h-5 w-[88%] rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PureMessages({
  addToolApprovalResponse,
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  isArtifactVisible,
  isLoading,
  selectedModelId: _selectedModelId,
  onEditMessage,
  onHandledEndInViewChange,
}: MessagesProps) {
  const pathname = usePathname();
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
    reset,
  } = useMessages({
    status,
    autoScroll: messages.length > 0,
  });

  useDataStream();

  const prevChatIdRef = useRef(chatId);
  useEffect(() => {
    if (prevChatIdRef.current !== chatId) {
      prevChatIdRef.current = chatId;
      reset();
    }
  }, [chatId, reset]);

  useEffect(() => {
    if (!messagesContainerRef.current) {
      return;
    }

    if (pathname !== "/" && messages.length === 0 && status !== "submitted") {
      requestAnimationFrame(() => {
        messagesContainerRef.current?.scrollTo({
          top: 0,
          behavior: "auto",
        });
      });
    }
  }, [messages.length, pathname, status, messagesContainerRef]);

  const showHomeOverview =
    pathname === "/" 
      ? messages.length === 0 && !isLoading && status !== "submitted"
      : pathname === "/new" || pathname.startsWith("/chat/")
        ? false
        : messages.length === 0 && status !== "submitted";
  const showHomeSkeleton =
    pathname === "/" &&
    messages.length === 0 &&
    Boolean(isLoading) &&
    status !== "submitted";

  const contentWidthClass =
    pathname === "/" ? "max-w-4xl" : "max-w-[1640px]";

  return (
    <div className="relative flex-1 bg-background">
      <div
        className={cn(
          "absolute inset-0 touch-pan-y overflow-y-auto",
          messages.length > 0 ? "bg-background" : "bg-transparent"
        )}
        ref={messagesContainerRef}
        style={isArtifactVisible ? { scrollbarWidth: "none" } : undefined}
      >
        <div
          className={cn(
            pathname === "/"
              ? "mx-auto flex min-h-full min-w-0 flex-col px-2 md:px-4"
              : "mx-auto flex min-h-full min-w-0 flex-col px-2 md:px-4",
            pathname === "/"
              ? "gap-5 py-6 md:gap-7"
              : "gap-4 pt-2 pb-6 md:gap-5",
            contentWidthClass
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {showHomeOverview && (
              <motion.div
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                key="chat-overview"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {pathname === "/" ? (
                  <Greeting
                    onHandledEndInViewChange={onHandledEndInViewChange}
                  />
                ) : (
                  <RouteStub pathname={pathname} />
                )}
              </motion.div>
            )}
            {showHomeSkeleton && (
              <motion.div
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                key="chat-overview-skeleton"
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <GreetingSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message, index) => (
            <PreviewMessage
              addToolApprovalResponse={addToolApprovalResponse}
              chatId={chatId}
              isLoading={
                status === "streaming" && messages.length - 1 === index
              }
              isReadonly={isReadonly}
              key={message.id}
              message={message}
              onEdit={onEditMessage}
              regenerate={regenerate}
              requiresScrollPadding={
                hasSentMessage && index === messages.length - 1
              }
              setMessages={setMessages}
              vote={
                votes
                  ? votes.find((vote) => vote.messageId === message.id)
                  : undefined
              }
            />
          ))}

          {status === "submitted" && messages.at(-1)?.role !== "assistant" && (
            <ThinkingMessage />
          )}

          <div
            className={cn(
              "min-w-[24px] shrink-0",
              (showHomeOverview || showHomeSkeleton) && pathname === "/"
                ? "min-h-[120px]"
                : "min-h-[24px]"
            )}
            ref={messagesEndRef}
          />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={`absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-border/50 bg-card/90 px-3.5 shadow-[var(--shadow-float)] backdrop-blur-lg transition-all duration-200 h-7 text-[10px] ${
          isAtBottom
            ? "pointer-events-none scale-90 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-3 text-muted-foreground" />
      </button>
    </div>
  );
}

export const Messages = PureMessages;
