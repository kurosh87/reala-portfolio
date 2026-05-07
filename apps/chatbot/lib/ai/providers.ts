import { anthropic } from "@ai-sdk/anthropic";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";
import { titleModel } from "./models";

const anthropicModelAliases: Record<string, string> = {
  "anthropic/claude-3-5-haiku-latest": "anthropic/claude-haiku-4-5",
};

function normalizeAnthropicModelId(modelId: string) {
  return anthropicModelAliases[modelId] ?? modelId;
}

export const myProvider = isTestEnvironment
  ? (() => {
      const { chatModel, titleModel } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "title-model": titleModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    try {
      return myProvider.languageModel(modelId);
    } catch {
      return myProvider.languageModel("chat-model");
    }
  }

  return anthropic(
    normalizeAnthropicModelId(modelId).replace(/^anthropic\//, "")
  );
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return anthropic(
    normalizeAnthropicModelId(titleModel.id).replace(/^anthropic\//, "")
  );
}
