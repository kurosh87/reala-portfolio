import { z } from "zod";

const envSchema = z
  .object({
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV !== "production") {
      return;
    }

    if (!value.NEXT_PUBLIC_APP_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_APP_URL"],
        message: "NEXT_PUBLIC_APP_URL is required when NODE_ENV=production",
      });
    }
  });

type ParsedEnv = z.infer<typeof envSchema>;
type AppEnv = ParsedEnv & {
  NEXT_PUBLIC_APP_URL: string;
};

function formatEnvErrors(issues: z.ZodIssue[]) {
  const lines = issues.map((issue) => {
    const path = issue.path.join(".") || "process.env";
    return `- ${path}: ${issue.message}`;
  });

  return [
    "Invalid environment configuration.",
    "Review the following variables before booting the app:",
    ...lines,
  ].join("\n");
}

let parsedEnv: AppEnv | null = null;

function parseEnv(): AppEnv {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    throw new Error(formatEnvErrors(result.error.issues));
  }

  return {
    ...result.data,
    NEXT_PUBLIC_APP_URL:
      result.data.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export function getEnv(): AppEnv {
  parsedEnv ??= parseEnv();
  return parsedEnv;
}

export function validateEnv(): AppEnv {
  return getEnv();
}

export const env = new Proxy({} as AppEnv, {
  get(_target, property) {
    return getEnv()[property as keyof AppEnv];
  },
  has(_target, property) {
    return property in getEnv();
  },
  ownKeys() {
    return Reflect.ownKeys(getEnv());
  },
  getOwnPropertyDescriptor() {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

export type { AppEnv };
