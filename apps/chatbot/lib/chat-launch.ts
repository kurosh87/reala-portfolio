import { z } from "zod";

const snapshotSchema = z.record(z.unknown());

const timeRangeSchema = z
  .object({
    label: z.string().min(1).max(120).optional(),
    start: z.string().min(1).max(120).optional(),
    end: z.string().min(1).max(120).optional(),
    granularity: z.string().min(1).max(64).optional(),
  })
  .nullable()
  .optional();

export const chatLaunchContextSchema = z.object({
  scopeType: z.enum(["section", "record"]),
  entityType: z.string().min(1).max(64),
  entityId: z.string().min(1).max(128).nullable().optional(),
  title: z.string().min(1).max(140),
  route: z.string().min(1).max(500),
  snapshot: snapshotSchema,
  filters: snapshotSchema.nullable().optional(),
  timeRange: timeRangeSchema,
  selectedView: z.string().min(1).max(120).nullable().optional(),
  sourceApp: z.literal("crm"),
});

export type ChatLaunchContext = z.infer<typeof chatLaunchContextSchema>;

export const launchChatRequestSchema = z.object({
  initialPrompt: z.string().trim().max(2000).optional(),
  selectedChatModel: z.string(),
  selectedVisibilityType: z.enum(["public", "private"]),
  launchContext: chatLaunchContextSchema,
});

export type LaunchChatRequest = z.infer<typeof launchChatRequestSchema>;

function stringifyContextValue(
  value: ChatLaunchContext["filters"] | ChatLaunchContext["snapshot"] | ChatLaunchContext["timeRange"]
) {
  if (!value || Object.keys(value).length === 0) {
    return null;
  }

  return JSON.stringify(value);
}

export function formatChatLaunchContextPrompt(context: ChatLaunchContext) {
  const lines = [
    "CRM context for this conversation:",
    `- Source app: ${context.sourceApp}`,
    `- Scope: ${context.scopeType}`,
    `- Entity type: ${context.entityType}`,
    `- Title: ${context.title}`,
    `- Route: ${context.route}`,
  ];

  if (context.entityId) {
    lines.push(`- Entity id: ${context.entityId}`);
  }

  if (context.selectedView) {
    lines.push(`- Selected view: ${context.selectedView}`);
  }

  const filters = stringifyContextValue(context.filters);
  if (filters) {
    lines.push(`- Filters: ${filters}`);
  }

  const timeRange = stringifyContextValue(context.timeRange);
  if (timeRange) {
    lines.push(`- Time range: ${timeRange}`);
  }

  lines.push(`- Snapshot: ${JSON.stringify(context.snapshot)}`);

  return lines.join("\n");
}
