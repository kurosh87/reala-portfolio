import { expect, test } from "@playwright/test";

const launchedChatId = "11111111-1111-4111-8111-111111111111";

test.describe("Contextual Alex chat launch", () => {
  test("opens a full chat thread from a CRM surface", async ({ page }) => {
    await page.route("**/api/history**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          chats: [],
          hasMore: false,
        }),
      });
    });

    await page.route("**/api/chat/launch", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          chatId: launchedChatId,
          selectedChatModel: "chat-model",
          selectedVisibilityType: "private",
        }),
      });
    });

    await page.route(`**/api/messages?chatId=${launchedChatId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          messages: [],
          visibility: "private",
          userId: "user-1",
          isReadonly: false,
          launchContext: {
            scopeType: "section",
            entityType: "tasks",
            title: "My Tasks",
            route: "/",
            snapshot: {
              todoCount: 2,
              activeCount: 3,
              doneCount: 1,
            },
            filters: null,
            timeRange: null,
            selectedView: "board",
            sourceApp: "crm",
          },
        }),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: "Ask Alex about tasks" }).click();
    await expect(page.getByTestId("ask-alex-input")).toBeVisible();
    await page.getByTestId("ask-alex-submit").click();

    await expect(page).toHaveURL(new RegExp(`/chat/${launchedChatId}$`));
    await expect(page.getByTestId("multimodal-input")).toBeVisible();
    await expect(
      page.getByText("Chatting with Alex about My Tasks")
    ).toBeVisible();
  });
});
