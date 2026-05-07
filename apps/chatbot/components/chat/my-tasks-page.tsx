"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  CalendarPlus2,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  FolderOpen,
  GripVertical,
  Home,
  Link2,
  ListFilter,
  MessageSquareMore,
  MessageCircleMore,
  MoreHorizontal,
  HousePlus,
  KeyRound,
  MapPinned,
  Plus,
  Send,
  Sparkles,
  SquareDashedMousePointer,
  TrendingUp,
  UserCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/chat/chat-header";
import { ContextualChatLauncher } from "@/components/chat/contextual-chat-launcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import type { ChatLaunchContext } from "@/lib/chat-launch";
type TaskStatus = "todo" | "active" | "done";
type TaskPriority = "Low" | "Medium" | "High";

type TaskItem = {
  id: string;
  title: string;
  category: string;
  links: number;
  comments: number;
  status: TaskStatus;
  stageLabel: string;
  priority: TaskPriority;
  progress: number;
};

type ActivityItem = {
  id: string;
  text: string;
  time: string;
};

const readonlyVisibility: VisibilityType = "private";
const TASKS_STORAGE_KEY = "reala-demo-my-tasks";
const ACTIVITIES_STORAGE_KEY = "reala-demo-my-tasks-activity";

const categories = [
  {
    icon: CalendarPlus2,
    label: "Book a showing",
    template: "Book Dundas loft showing with the first-time buyer lead",
    category: "Showings",
  },
  {
    icon: Send,
    label: "Send listing package",
    template: "Send pre-listing package to the new High Park seller lead",
    category: "Lead Follow-up",
  },
  {
    icon: HousePlus,
    label: "Prepare new listing",
    template: "Prepare staging checklist for the Roncesvalles listing launch",
    category: "Listings",
  },
  {
    icon: KeyRound,
    label: "Coordinate key handoff",
    template: "Coordinate key handoff for tomorrow's Liberty Village occupancy",
    category: "Closing",
  },
  {
    icon: UserCircle2,
    label: "Qualify new lead",
    template: "Qualify the inbound buyer lead from the Queen West landing page",
    category: "Lead Intake",
  },
  {
    icon: MapPinned,
    label: "Build tour route",
    template: "Build west-end buyer tour route for four listings before noon",
    category: "Buyer Tour",
  },
  {
    icon: FileText,
    label: "Draft offer paperwork",
    template: "Draft offer paperwork for the Junction townhouse buyer",
    category: "Offer Prep",
  },
  {
    icon: Home,
    label: "Schedule open house",
    template: "Schedule open house staff and signage for the Sunday launch",
    category: "Open House",
  },
] as const;

const initialTasks: TaskItem[] = [
  {
    id: "appointment",
    title: "Confirm Saturday showing for the King West condo buyer",
    category: "Showings",
    links: 12,
    comments: 21,
    status: "todo",
    stageLabel: "In Review",
    priority: "High",
    progress: 0,
  },
  {
    id: "medicine",
    title: "Send listing package to the new Riverdale seller lead",
    category: "Lead Follow-up",
    links: 4,
    comments: 32,
    status: "todo",
    stageLabel: "Drafts",
    priority: "Medium",
    progress: 0,
  },
  {
    id: "event",
    title: "Plan Sunday open house flow for the Leslieville listing",
    category: "Open House",
    links: 11,
    comments: 8,
    status: "active",
    stageLabel: "In Progress",
    priority: "Medium",
    progress: 26,
  },
  {
    id: "return-package",
    title: "Assemble offer docs for the Danforth townhouse buyer",
    category: "Offer Prep",
    links: 7,
    comments: 12,
    status: "active",
    stageLabel: "In Progress",
    priority: "Medium",
    progress: 74,
  },
  {
    id: "passport",
    title: "Build East-end tour route for tomorrow afternoon",
    category: "Buyer Tour",
    links: 4,
    comments: 16,
    status: "active",
    stageLabel: "Input Needed",
    priority: "Low",
    progress: 38,
  },
  {
    id: "gift",
    title: "Mark key handoff complete for the Queen Street closing",
    category: "Closing",
    links: 3,
    comments: 9,
    status: "done",
    stageLabel: "Completed",
    priority: "Low",
    progress: 100,
  },
] as const satisfies TaskItem[];

const initialActivity: ActivityItem[] = [
  {
    id: "activity-1",
    text: "Riverside seller package was generated for follow-up review.",
    time: "Just now",
  },
  {
    id: "activity-2",
    text: "Two buyer-tour tasks moved into Active after route planning started.",
    time: "2m ago",
  },
  {
    id: "activity-3",
    text: "One closing task was marked done after key handoff confirmation.",
    time: "6m ago",
  },
];

function readDemoTasks() {
  if (typeof window === "undefined") {
    return [...initialTasks];
  }

  const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
  if (!storedTasks) {
    return [...initialTasks];
  }

  try {
    return JSON.parse(storedTasks) as TaskItem[];
  } catch {
    return [...initialTasks];
  }
}

function readDemoActivity() {
  if (typeof window === "undefined") {
    return [...initialActivity];
  }

  const storedActivity = window.localStorage.getItem(ACTIVITIES_STORAGE_KEY);
  if (!storedActivity) {
    return [...initialActivity];
  }

  try {
    return JSON.parse(storedActivity) as ActivityItem[];
  } catch {
    return [...initialActivity];
  }
}

function taskBadgeClass(priority: TaskPriority) {
  if (priority === "High") {
    return "rounded-md bg-fuchsia-500/15 text-fuchsia-300";
  }
  if (priority === "Low") {
    return "rounded-md bg-sky-500/15 text-sky-300";
  }
  return "rounded-md bg-amber-500/15 text-amber-300";
}

function stageBadgeClass(stage: string) {
  if (stage === "Completed") {
    return "rounded-md bg-emerald-500/15 text-emerald-300";
  }
  if (stage === "In Progress") {
    return "rounded-md bg-violet-500/15 text-violet-300";
  }
  if (stage === "In Review") {
    return "rounded-md bg-rose-500/15 text-rose-300";
  }
  return "rounded-md bg-muted text-muted-foreground";
}

function buildTaskLaunchContext(task: TaskItem): ChatLaunchContext {
  return {
    scopeType: "record",
    entityType: "task",
    title: task.title,
    route: "/",
    snapshot: {
      category: task.category,
      stage: task.stageLabel,
      priority: task.priority,
      files: task.links,
      updates: task.comments,
      progress: task.progress,
    },
    filters: null,
    timeRange: null,
    selectedView: "board",
    sourceApp: "crm",
  };
}

function TaskRow({
  task,
  onDragStart,
  onOpenTask,
}: {
  task: TaskItem;
  onDragStart: (taskId: string) => void;
  onOpenTask: (task: TaskItem) => void;
}) {
  const taskLaunchContext = buildTaskLaunchContext(task);

  return (
    <div
      className="grid cursor-grab items-center gap-4 rounded-xl border border-border/60 bg-background px-5 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.16)] transition-colors hover:border-border hover:bg-muted/15 active:cursor-grabbing md:grid-cols-[minmax(280px,1.65fr)_minmax(170px,auto)_auto_auto_minmax(250px,auto)_auto]"
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={() => onOpenTask(task)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenTask(task);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="size-4 text-muted-foreground" />
        <div className="min-w-0">
          <div className="max-w-[34rem] text-pretty font-semibold leading-snug text-foreground">
            {task.title}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{task.category}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge className="rounded-md px-2.5" variant="outline">
          <Link2 className="mr-1 size-3.5" />
          {task.links} files
        </Badge>
        <Badge className="rounded-md px-2.5" variant="outline">
          <MessageSquareMore className="mr-1 size-3.5" />
          {task.comments} updates
        </Badge>
      </div>

      <Badge className={stageBadgeClass(task.stageLabel)} variant="secondary">
        {task.stageLabel}
      </Badge>

      <Badge className={taskBadgeClass(task.priority)} variant="secondary">
        {task.priority}
      </Badge>

      <div className="flex items-center justify-end gap-2">
        <ContextualChatLauncher
          buttonLabel="Delegate with Alex"
          buttonVariant="outline"
          className="h-8 rounded-lg px-3 text-xs"
          context={taskLaunchContext}
          description={`Open a task-specific Alex thread for ${task.title}. Alex will keep the task context, status, and category attached.`}
          promptPlaceholder="Ask Alex to draft the next step, summarize blockers, or take over the task planning..."
        />
        <Button
          className="h-8 rounded-lg px-3 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            onOpenTask(task);
          }}
          size="sm"
          variant="outline"
        >
          <FolderOpen className="size-3.5" />
          View details
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="self-center"
            onClick={(event) => event.stopPropagation()}
            size="icon-sm"
            variant="ghost"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpenTask(task)}>Open task</DropdownMenuItem>
          <DropdownMenuItem>Edit details</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  onAdd,
  onDropTask,
  onDragStart,
  creatingTaskId,
  onOpenTask,
}: {
  title: string;
  tasks: TaskItem[];
  onAdd?: () => void;
  onDropTask: () => void;
  onDragStart: (taskId: string) => void;
  creatingTaskId?: string | null;
  onOpenTask: (task: TaskItem) => void;
}) {
  return (
    <div
      className="flex flex-col gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDropTask}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sort by due date</DropdownMenuItem>
            <DropdownMenuItem>Sort by priority</DropdownMenuItem>
            <DropdownMenuItem>Hide completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden items-center gap-4 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:grid md:grid-cols-[minmax(280px,1.65fr)_minmax(170px,auto)_auto_auto_minmax(250px,auto)_auto]">
        <div>Task</div>
        <div>Context</div>
        <div>Stage</div>
        <div>Priority</div>
        <div className="text-right">Actions</div>
        <div />
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            className={
              creatingTaskId === task.id
                ? "animate-in fade-in-0 slide-in-from-top-2 duration-300"
                : undefined
            }
            key={task.id}
          >
            <TaskRow onDragStart={onDragStart} onOpenTask={onOpenTask} task={task} />
          </div>
        ))}
      </div>

      {onAdd ? (
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          onClick={onAdd}
          type="button"
        >
          <SquareDashedMousePointer className="size-4" />
          Add New Task
        </button>
      ) : null}
    </div>
  );
}

export function MyTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(readDemoTasks);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(readDemoActivity);
  const [creatingTaskId, setCreatingTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const creationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTaskIdRef = useRef(tasks.length + 1);
  const nextActivityIdRef = useRef(recentActivity.length + 1);

  useEffect(() => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    window.localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    return () => {
      if (creationTimeoutRef.current) {
        clearTimeout(creationTimeoutRef.current);
      }
    };
  }, []);

  const groupedTasks = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      active: tasks.filter((task) => task.status === "active"),
      done: tasks.filter((task) => task.status === "done"),
    }),
    [tasks]
  );

  const summaryStats = [
    {
      icon: Activity,
      label: "Open work",
      value: tasks.length.toString(),
      detail: `${groupedTasks.active.length} active right now`,
    },
    {
      icon: Sparkles,
      label: "Alex assists",
      value: "9",
      detail: "drafts, routes, handoffs",
    },
    {
      icon: Clock3,
      label: "Median reply",
      value: "21s",
      detail: "lead follow-up pace",
    },
    {
      icon: CheckCircle2,
      label: "Booked today",
      value: "6",
      detail: "from inbound threads",
    },
  ];

  const pushActivity = (text: string, time = "Just now") => {
    setRecentActivity((current) => [
      {
        id: `activity-${nextActivityIdRef.current++}`,
        text,
        time,
      },
      ...current,
    ].slice(0, 5));
  };

  const moveTask = (status: TaskStatus) => {
    if (!draggingTaskId) {
      return;
    }

    const movedTask = tasks.find((task) => task.id === draggingTaskId);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === draggingTaskId
          ? {
              ...task,
              status,
              progress:
                status === "todo" ? 0 : status === "active" ? Math.max(task.progress, 24) : 100,
              stageLabel:
                status === "todo"
                  ? "In Review"
                  : status === "active"
                    ? "In Progress"
                    : "Completed",
            }
          : task
      )
    );
    if (movedTask) {
      pushActivity(
        `${movedTask.title} moved to ${
          status === "todo" ? "Todo" : status === "active" ? "Active Tasks" : "Completed"
        }.`
      );
    }
    setDraggingTaskId(null);
  };

  const simulateTaskCreation = (task: Pick<TaskItem, "title" | "category">) => {
    const nextId = `task-${nextTaskIdRef.current++}`;

    setCreatingTaskId(nextId);
    setTasks((currentTasks) => [
      {
        id: nextId,
        title: task.title,
        category: task.category,
        links: 0,
        comments: 1,
        status: "todo",
        stageLabel: "Generating",
        priority: "Medium",
        progress: 0,
      },
      ...currentTasks,
    ]);
    pushActivity(`Creating "${task.title}" from the demo workflow...`);

    if (creationTimeoutRef.current) {
      clearTimeout(creationTimeoutRef.current);
    }

    creationTimeoutRef.current = setTimeout(() => {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === nextId
            ? {
                ...currentTask,
                stageLabel: "Drafts",
                links: Math.max(currentTask.links, 1),
                comments: Math.max(currentTask.comments, 3),
              }
            : currentTask
        )
      );
      pushActivity(`"${task.title}" was added to Todo and is ready for the next step.`);
      setCreatingTaskId(null);
    }, 900);
  };

  const addTask = () => {
    simulateTaskCreation({
      title: "Follow up with the latest inbound seller lead from Reala Ads",
      category: "Lead Follow-up",
    });
  };

  const tasksLaunchContext: ChatLaunchContext = {
    scopeType: "section",
    entityType: "tasks",
    title: "My Tasks",
    route: "/",
    snapshot: {
      todoCount: groupedTasks.todo.length,
      activeCount: groupedTasks.active.length,
      doneCount: groupedTasks.done.length,
      recentActivity: recentActivity.slice(0, 3),
    },
    filters: null,
    timeRange: null,
    selectedView: "board",
    sourceApp: "crm",
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <ChatHeader
        chatId="section-my-tasks"
        isReadonly
        selectedVisibilityType={readonlyVisibility}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
          <section className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/75 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
              <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
                <div className="flex min-w-0 flex-col justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-300" />
                      Alex is triaging active lead work
                    </div>
                    <div className="space-y-3">
                      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                        My Tasks
                      </h1>
                      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                        Every showing, lead follow-up, listing prep, and closing handoff in one workspace with Alex ready to draft the next move.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <ContextualChatLauncher
                      buttonLabel="Ask Alex about tasks"
                      className="rounded-xl"
                      context={tasksLaunchContext}
                    />
                    <Button className="rounded-xl" onClick={addTask} variant="outline">
                      <Plus data-icon="inline-start" />
                      New Task
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {summaryStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        className="rounded-xl border border-border/60 bg-background/72 p-4"
                        key={stat.label}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {stat.label}
                          </div>
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {stat.detail}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid border-t border-border/60 bg-background/45 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                  {categories.slice(0, 4).map((category) => {
                    const Icon = category.icon;

                    return (
                      <button
                        className="group flex min-h-20 items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/25"
                        key={category.label}
                        onClick={() =>
                          simulateTaskCreation({
                            title: category.template,
                            category: category.category,
                          })
                        }
                        type="button"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/20 transition-colors duration-300 group-hover:border-foreground/20 group-hover:bg-muted/35">
                          <Icon className="size-4.5 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-foreground" />
                        </div>
                        <span className="text-sm font-medium leading-snug text-foreground">
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-border/60 p-4 lg:border-t-0 lg:border-l">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Live Activity
                    </div>
                    <TrendingUp className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 3).map((activity) => (
                      <div
                        className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-sm"
                        key={activity.id}
                      >
                        <div className="mt-1 size-2 rounded-full bg-emerald-300" />
                        <div className="min-w-0">
                          <div className="line-clamp-2 leading-snug text-foreground">
                            {activity.text}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline">
                    <Filter data-icon="inline-start" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <ListFilter data-icon="inline-start" />
                    Sort
                  </Button>
                  <Button variant="outline">
                    <MessageCircleMore data-icon="inline-start" />
                    Hide
                  </Button>
                </div>

                <Button onClick={addTask}>
                  <Plus data-icon="inline-start" />
                  New Task
                </Button>
              </div>

              <TaskSection
                onAdd={addTask}
                creatingTaskId={creatingTaskId}
                onDragStart={setDraggingTaskId}
                onDropTask={() => moveTask("todo")}
                onOpenTask={setActiveTask}
                tasks={groupedTasks.todo}
                title="Todo"
              />

              <TaskSection
                onDragStart={setDraggingTaskId}
                onDropTask={() => moveTask("active")}
                onOpenTask={setActiveTask}
                tasks={groupedTasks.active}
                title="Active Tasks"
              />

              <TaskSection
                onDragStart={setDraggingTaskId}
                onDropTask={() => moveTask("done")}
                onOpenTask={setActiveTask}
                tasks={groupedTasks.done}
                title="Completed"
              />
          </section>
        </div>
      </div>

      <Sheet onOpenChange={(open) => !open && setActiveTask(null)} open={Boolean(activeTask)}>
        <SheetContent className="w-full overflow-y-auto border-border/60 bg-background sm:max-w-xl" side="right">
          {activeTask ? (
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b border-border/60 pb-5">
                <SheetTitle className="text-xl">{activeTask.title}</SheetTitle>
                <SheetDescription>
                  {activeTask.category} · {activeTask.stageLabel} · {activeTask.priority} priority
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Task files
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">
                      {activeTask.links}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Recent updates
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">
                      {activeTask.comments}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
                  <div className="text-sm font-medium text-foreground">What Alex can do here</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>Draft the next outreach message or checklist.</li>
                    <li>Summarize blockers and recommend the next move.</li>
                    <li>Turn this task into a focused chat thread with context attached.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="mb-3 text-sm font-medium text-foreground">Task actions</div>
                  <div className="flex flex-wrap gap-3">
                    <ContextualChatLauncher
                      buttonLabel="Delegate with Alex"
                      className="rounded-lg"
                      context={buildTaskLaunchContext(activeTask)}
                      description={`Start a task-specific Alex thread for ${activeTask.title}.`}
                      promptPlaceholder="Ask Alex to take over the next step, propose a plan, or prepare the response..."
                    />
                    <Button
                      className="rounded-lg"
                      onClick={() => {
                        setTasks((currentTasks) =>
                          currentTasks.map((task) =>
                            task.id === activeTask.id
                              ? {
                                  ...task,
                                  status: "active",
                                  stageLabel: "In Progress",
                                  progress: Math.max(task.progress, 24),
                                }
                              : task
                          )
                        );
                        pushActivity(`${activeTask.title} was moved into Active Tasks.`);
                        setActiveTask((currentTask) =>
                          currentTask
                            ? {
                                ...currentTask,
                                status: "active",
                                stageLabel: "In Progress",
                                progress: Math.max(currentTask.progress, 24),
                              }
                            : currentTask
                        );
                      }}
                      variant="outline"
                    >
                      Move to Active
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
