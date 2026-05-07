"use client";

import {
  BriefcaseBusinessIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  ChartColumnBigIcon,
  CircleHelpIcon,
  RadioTowerIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  PenSquareIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import {
  getChatHistoryPaginationKey,
  SidebarHistory,
} from "@/components/chat/sidebar-history";
import { SidebarUserNav } from "@/components/chat/sidebar-user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AppSidebar({ user }: { user: User | undefined }) {
  const showArchiveChats = false;
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile, toggleSidebar } = useSidebar();
  const { mutate } = useSWRConfig();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleDeleteAll = () => {
    setShowDeleteAllDialog(false);
    router.replace("/");
    mutate(unstable_serialize(getChatHistoryPaginationKey), [], {
      revalidate: false,
    });

    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/history`, {
      method: "DELETE",
    });

    toast.success("Chats archived");
  };

  const navButtonClass = (href: string) =>
    [
      "rounded-lg text-sidebar-foreground/60 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      pathname === href ? "bg-sidebar-accent/60 text-sidebar-foreground" : "",
    ].join(" ");

  const handleNewChat = () => {
    setOpenMobile(false);
    router.push(`/new?draft=${Date.now()}`);
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="pb-0 pt-3">
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-row items-center justify-between">
              <div className="pointer-events-none absolute inset-x-0 inset-y-0 flex items-center justify-center group-data-[collapsible=icon]:hidden">
                <button
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => toggleSidebar()}
                  type="button"
                >
                  <RealaWordmark />
                </button>
              </div>
              <div className="group/logo relative flex items-center justify-center">
                <SidebarMenuButton
                  asChild
                  className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:group-hover/logo:opacity-0"
                  tooltip="Chatbot"
                >
                  <Link href="/" onClick={() => setOpenMobile(false)}>
                    <MessageSquareIcon className="size-4 text-sidebar-foreground/50" />
                  </Link>
                </SidebarMenuButton>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      className="pointer-events-none absolute inset-0 size-8 opacity-0 group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:group-hover/logo:opacity-100"
                      onClick={() => toggleSidebar()}
                    >
                      <PanelLeftIcon className="size-4" />
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent className="hidden md:block" side="right">
                    Open sidebar
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <SidebarTrigger className="text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-foreground" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="pt-1">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={[
                      "h-8 rounded-xl border border-sidebar-border bg-sidebar-accent/20 text-[13px] transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      pathname === "/new"
                        ? "border-sidebar-accent bg-sidebar-accent/70 text-sidebar-foreground"
                        : "text-sidebar-foreground/80",
                    ].join(" ")}
                    onClick={handleNewChat}
                    tooltip="New Chat"
                  >
                    <PenSquareIcon className="size-4" />
                    <span className="font-medium">New chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/")}
                    tooltip="My Tasks"
                  >
                    <Link href="/" onClick={() => setOpenMobile(false)}>
                      <CalendarDaysIcon className="size-4" />
                      <span className="text-[13px]">My Tasks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/inbox")}
                    tooltip="Inbox"
                  >
                    <Link
                      href="/inbox"
                      onClick={() => setOpenMobile(false)}
                    >
                      <RadioTowerIcon className="size-4" />
                      <span className="text-[13px]">Inbox</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="border border-sidebar-border bg-background text-sidebar-foreground">
                    1
                  </SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/leads")}
                    tooltip="Leads"
                  >
                    <Link href="/leads" onClick={() => setOpenMobile(false)}>
                      <BriefcaseBusinessIcon className="size-4" />
                      <span className="text-[13px]">Leads</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/showings")}
                    tooltip="Showings"
                  >
                    <Link href="/showings" onClick={() => setOpenMobile(false)}>
                      <CalendarCheckIcon className="size-4" />
                      <span className="text-[13px]">Showings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/performance")}
                    tooltip="Insights"
                  >
                    <Link
                      href="/performance"
                      onClick={() => setOpenMobile(false)}
                    >
                      <ChartColumnBigIcon className="size-4" />
                      <span className="text-[13px]">Insights</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarHistory user={user} />
          <SidebarGroup className="mt-auto pt-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={navButtonClass("/settings")}
                    tooltip="Settings"
                  >
                    <Link href="/settings" onClick={() => setOpenMobile(false)}>
                      <SettingsIcon className="size-4" />
                      <span className="text-[13px]">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="rounded-lg text-sidebar-foreground/60 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    tooltip="Help & Support"
                  >
                    <Link href="/settings" onClick={() => setOpenMobile(false)}>
                      <CircleHelpIcon className="size-4" />
                      <span className="text-[13px]">Help &amp; Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {user && showArchiveChats && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="rounded-lg text-sidebar-foreground/40 transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setShowDeleteAllDialog(true)}
                      tooltip="Archive Chats"
                    >
                      <TrashIcon className="size-4" />
                      <span className="text-[13px]">Archive Chats</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border pt-2 pb-3">
          {user && <SidebarUserNav user={user} />}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <AlertDialog
        onOpenChange={setShowDeleteAllDialog}
        open={showDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive chats?</AlertDialogTitle>
            <AlertDialogDescription>
              For now, this demo archive action clears all chats and removes
              them from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>
              Archive Chats
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RealaWordmark() {
  return (
    <span className="inline-flex h-4.5 w-fit items-center gap-1.5 text-foreground transition-opacity hover:opacity-85">
      <svg
        className="h-4 w-5.5"
        fill="none"
        viewBox="0 0 349 259"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M348.543 94V153.5C348.543 172 333.043 178 322.043 178H268.543C260.044 178 265.544 186 267.544 189C269.74 192.295 303.71 235.833 321.043 258.5H204.043C187.876 238 204.039 258.502 146.045 185.5C135.885 172.71 154.126 166.5 157.544 165C180.711 154.833 234.789 131.294 241.544 128C260 119 259 112.5 259 94H348.543ZM152 0C190.8 0 239.833 0.333333 259 0.5V94H207C173 94 157.881 90.377 141.5 126.5C102.5 212.5 109.333 197.167 102.5 212.5H0C15 179.167 -3 217.5 65 69C83.5376 28.5172 103.5 0 152 0Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-[15px] font-semibold leading-none tracking-tight">
        Reala
      </span>
    </span>
  );
}
