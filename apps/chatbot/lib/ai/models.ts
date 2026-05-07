export const DEFAULT_CHAT_MODEL = "anthropic/claude-sonnet-4-5";

export const titleModel = {
  id: "anthropic/claude-sonnet-4-5",
  name: "Claude Sonnet 4.5",
  provider: "anthropic",
  description: "Balanced model for title generation",
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  gatewayOrder?: string[];
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    id: "anthropic/claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "Fast Anthropic model",
  },
  {
    id: "anthropic/claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Balanced Anthropic model with tool use",
  },
];

const curatedCapabilities = Object.fromEntries(
  chatModels.map((model) => [
    model.id,
    {
      tools: true,
      vision: true,
      reasoning: false,
    } satisfies ModelCapabilities,
  ])
);

export function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Promise.resolve(curatedCapabilities);
}

export const isDemo = false;

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export function getAllGatewayModels(): Promise<GatewayModelWithCapabilities[]> {
  return Promise.resolve(
    chatModels.map((model) => ({
      ...model,
      capabilities: curatedCapabilities[model.id],
    }))
  );
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
