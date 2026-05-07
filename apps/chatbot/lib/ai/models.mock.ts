import type { LanguageModel } from "ai";

const mockResponses: Record<string, string> = {
  default: "This is a mock response for testing.",
  weather: "The weather in San Francisco is sunny and 72°F.",
  greeting: "Hi Alex. How can I help with this lead?",
};

const mockUsage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 20, text: 20, reasoning: 0 },
};

function extractLeadContext(promptStr: string) {
  const leadMatch = promptStr.match(/- Lead:\s*(.+)/i);
  const sourceMatch = promptStr.match(/- Source:\s*(.+)/i);
  const stageMatch = promptStr.match(/- Stage:\s*(.+)/i);
  const contextMatch = promptStr.match(/- Context:\s*(.+)/i);
  const inquiryMatch = promptStr.match(/- Inquiry:\s*(.+)/i);

  if (!leadMatch) {
    return null;
  }

  return {
    lead: leadMatch[1]?.trim(),
    source: sourceMatch?.[1]?.trim(),
    stage: stageMatch?.[1]?.trim(),
    context: contextMatch?.[1]?.trim(),
    inquiry: inquiryMatch?.[1]?.trim(),
  };
}

function getLeadAwareGreeting(promptStr: string) {
  const leadContext = extractLeadContext(promptStr);

  if (!leadContext) {
    return mockResponses.greeting;
  }

  const summary = [
    leadContext.lead ? `${leadContext.lead} is the lead` : null,
    leadContext.inquiry ? `this is about a ${leadContext.inquiry.toLowerCase()} inquiry` : null,
    leadContext.context ? `on your ${leadContext.context.toLowerCase()}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return `Hi Alex. ${summary}. I can help you decide the right response, draft a reply to ${leadContext.lead}, or suggest the next follow-up cadence.`;
}

function getResponseForPrompt(prompt: unknown): string {
  const promptStr = JSON.stringify(prompt);
  const promptLower = promptStr.toLowerCase();

  if (promptLower.includes("weather") || promptLower.includes("temperature")) {
    return mockResponses.weather;
  }
  if (
    promptLower.includes("hello") ||
    promptLower.includes("hi") ||
    promptLower.includes("hey")
  ) {
    return getLeadAwareGreeting(promptStr);
  }

  return mockResponses.default;
}

const createMockModel = (): LanguageModel => {
  return {
    specificationVersion: "v3",
    provider: "mock",
    modelId: "mock-model",
    defaultObjectGenerationMode: "tool",
    supportedUrls: {},
    doGenerate: async ({ prompt }: { prompt: unknown }) => ({
      finishReason: "stop",
      usage: mockUsage,
      content: [{ type: "text", text: getResponseForPrompt(prompt) }],
      warnings: [],
    }),
    doStream: ({ prompt }: { prompt: unknown }) => {
      const response = getResponseForPrompt(prompt);
      const words = response.split(" ");

      return {
        stream: new ReadableStream({
          async start(controller) {
            controller.enqueue({ type: "text-start", id: "t1" });
            for (const word of words) {
              controller.enqueue({
                type: "text-delta",
                id: "t1",
                delta: `${word} `,
              });
              await new Promise((resolve) => {
                setTimeout(resolve, 10);
              });
            }
            controller.enqueue({ type: "text-end", id: "t1" });
            controller.enqueue({
              type: "finish",
              finishReason: "stop",
              usage: mockUsage,
            });
            controller.close();
          },
        }),
      };
    },
  } as unknown as LanguageModel;
};

const createMockTitleModel = (): LanguageModel => {
  return {
    specificationVersion: "v3",
    provider: "mock",
    modelId: "mock-title-model",
    defaultObjectGenerationMode: "tool",
    supportedUrls: {},
    doGenerate: async () => ({
      finishReason: "stop",
      usage: {
        inputTokens: { total: 5, noCache: 5, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 5, text: 5, reasoning: 0 },
      },
      content: [{ type: "text", text: "Test Conversation" }],
      warnings: [],
    }),
    doStream: () => ({
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "text-start", id: "t1" });
          controller.enqueue({
            type: "text-delta",
            id: "t1",
            delta: "Test Conversation",
          });
          controller.enqueue({ type: "text-end", id: "t1" });
          controller.enqueue({
            type: "finish",
            finishReason: "stop",
            usage: {
              inputTokens: {
                total: 5,
                noCache: 5,
                cacheRead: 0,
                cacheWrite: 0,
              },
              outputTokens: { total: 5, text: 5, reasoning: 0 },
            },
          });
          controller.close();
        },
      }),
    }),
  } as unknown as LanguageModel;
};

export const chatModel = createMockModel();
export const titleModel = createMockTitleModel();
