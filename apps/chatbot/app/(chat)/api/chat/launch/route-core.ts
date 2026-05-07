import {
  allowedModelIds,
  DEFAULT_CHAT_MODEL,
} from "@/lib/ai/models";
import {
  launchChatRequestSchema,
  type LaunchChatRequest,
} from "@/lib/chat-launch";
import { ChatbotError } from "@/lib/errors";
import { generateUUID } from "@/lib/utils";

type LaunchChatRouteDeps = {
  authFn: () => Promise<{ user?: { id: string } } | null>;
  createChatWithLaunchContext: (input: {
    context: LaunchChatRequest["launchContext"];
    id: string;
    initialMessage?:
      | {
          id: string;
          text: string;
        }
      | undefined;
    title: string;
    userId: string;
    visibility: "private";
  }) => Promise<unknown>;
};

export function createLaunchChatRouteHandler(deps: LaunchChatRouteDeps) {
  return async function POST(request: Request) {
    let requestBody: LaunchChatRequest;

    try {
      requestBody = launchChatRequestSchema.parse(await request.json());
    } catch {
      return new ChatbotError("bad_request:api").toResponse();
    }

    const session = await deps.authFn();

    if (!session?.user) {
      return new ChatbotError("unauthorized:chat").toResponse();
    }

    try {
      const chatId = generateUUID();
      const initialPrompt = requestBody.initialPrompt?.trim() || undefined;
      const initialMessageId = initialPrompt ? generateUUID() : undefined;
      const selectedChatModel = allowedModelIds.has(requestBody.selectedChatModel)
        ? requestBody.selectedChatModel
        : DEFAULT_CHAT_MODEL;

      await deps.createChatWithLaunchContext({
        context: requestBody.launchContext,
        id: chatId,
        initialMessage:
          initialPrompt && initialMessageId
            ? {
                id: initialMessageId,
                text: initialPrompt,
              }
            : undefined,
        title: requestBody.launchContext.title,
        userId: session.user.id,
        visibility: "private",
      });

      return Response.json({
        chatId,
        initialMessageId,
        selectedChatModel,
        selectedVisibilityType: "private",
      });
    } catch {
      return new ChatbotError(
        "bad_request:database",
        "Failed to launch chat"
      ).toResponse();
    }
  };
}
