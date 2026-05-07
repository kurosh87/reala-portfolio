"use client";

import {
  BellIcon,
  CalendarClockIcon,
  CircleCheckIcon,
  MessageSquareTextIcon,
  PanelLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, memo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { VercelIcon } from "./icons";
import type { VisibilityType } from "./visibility-selector";

type HeaderBreadcrumb = {
  href?: string;
  label: string;
};

function PureChatHeader(props: {
  breadcrumbs?: HeaderBreadcrumb[];
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { breadcrumbs } = props;
  const { state, toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();

  const routeTitle =
    pathname === "/"
      ? "My Tasks"
      : pathname === "/new"
        ? "New chat"
      : pathname === "/inbox" || pathname === "/live-conversations"
      ? "Inbox"
      : pathname === "/leads"
        ? "Leads"
      : pathname === "/showings"
          ? "Showings"
        : pathname === "/performance"
          ? "Insights"
          : pathname === "/settings"
          ? "Settings"
          : "Alex";
  const routeLabel =
    routeTitle === "New chat" ? "New Chat" : routeTitle;
  const breadcrumbItems =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { href: "/", label: "Dashboard" },
          { label: routeLabel },
        ];

  if (state === "collapsed" && !isMobile) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-sidebar/95 px-3 backdrop-blur">
      <Button
        className="md:hidden"
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>

      <Link
        className="flex size-8 items-center justify-center rounded-lg md:hidden"
        href="https://vercel.com/templates/next.js/chatbot"
        rel="noopener noreferrer"
        target="_blank"
      >
        <VercelIcon size={14} />
      </Link>

      <div className="min-w-0 flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {item.href && !isLast ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {isLast ? null : <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <nav
        aria-label="Product links"
        className="hidden items-center gap-3 pr-1 text-sm text-foreground/80 md:flex"
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open notifications"
            className={cn(
              buttonVariants({ size: "icon-sm", variant: "ghost" }),
              "relative rounded-full"
            )}
          >
            <BellIcon data-icon="inline-start" />
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-red-500 ring-2 ring-sidebar" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem>
                <MessageSquareTextIcon />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium">New reply from Amelia</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Oakridge showing request needs a final confirmation.
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarClockIcon />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium">Showing hold expires soon</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Alex is holding the 6:30 PM window for today.
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleCheckIcon />
                <span>Mark all as read</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-muted/55 px-3 font-medium shadow-inner transition-colors hover:bg-muted"
          href="/settings"
        >
          <span>Feedback</span>
          <kbd className="flex size-5 items-center justify-center rounded-full bg-foreground/10 text-[11px] font-medium text-foreground/65">
            F
          </kbd>
        </Link>
        <Link
          className="font-medium transition-colors hover:text-foreground"
          href="/settings"
        >
          Help
        </Link>
        <Link
          className="font-medium transition-colors hover:text-foreground"
          href="/settings"
        >
          Docs
        </Link>
      </nav>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.breadcrumbs === nextProps.breadcrumbs &&
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
