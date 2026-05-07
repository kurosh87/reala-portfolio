"use client";

export const leadStageQueryToValue = {
  new: "Requested",
  review: "In Review",
  qualified: "Qualified",
  "follow-up": "Needs follow-up",
} as const;

export const leadStageValueToQuery = {
  Requested: "new",
  "In Review": "review",
  Qualified: "qualified",
  "Needs follow-up": "follow-up",
} as const;

export const leadFilterStates = [
  {
    label: "All leads",
    count: 12,
    dotClassName: "bg-sidebar-foreground/45",
    stageQuery: null,
  },
  {
    label: "New",
    count: 4,
    dotClassName: "bg-sky-400",
    stageQuery: "new",
  },
  {
    label: "In review",
    count: 2,
    dotClassName: "bg-amber-400",
    stageQuery: "review",
  },
  {
    label: "Qualified",
    count: 3,
    dotClassName: "bg-emerald-400",
    stageQuery: "qualified",
  },
  {
    label: "Needs follow-up",
    count: 3,
    dotClassName: "bg-rose-400",
    stageQuery: "follow-up",
  },
] as const;
