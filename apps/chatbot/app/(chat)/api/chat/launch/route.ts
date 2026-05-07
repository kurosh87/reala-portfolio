import { auth } from "@/app/(auth)/auth";
import { createChatWithLaunchContext } from "@/lib/db/queries";
import { createLaunchChatRouteHandler } from "./route-core";

export const POST = createLaunchChatRouteHandler({
  authFn: auth,
  createChatWithLaunchContext,
});
