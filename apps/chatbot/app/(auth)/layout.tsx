import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SparklesIcon } from "@/components/chat/icons";
import { Preview } from "@/components/chat/preview";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-screen bg-sidebar">
      <div className="flex w-full flex-col bg-background p-8 xl:w-[600px] xl:shrink-0 xl:rounded-r-2xl xl:border-r xl:border-border/40 md:p-16">
        <Link
          className="flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/50">
              <SparklesIcon size={14} />
            </div>
            {children}
          </div>
        </div>
      </div>

      <div className="hidden flex-1 flex-col overflow-hidden pl-12 xl:flex">
        <div className="flex items-center gap-3 pt-8 text-[13px] text-muted-foreground/80">
          <span className="inline-flex h-4.5 w-fit items-center gap-1.5 text-foreground">
            <svg
              className="h-4 w-5.5"
              fill="none"
              viewBox="0 0 349 259"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M348.543 94V153.5C348.543 172 333.043 178 322.043 178H268.543C260.044 178 265.544 186 267.544 189C269.74 192.295 303.71 235.833 321.043 258.5H204.043C187.876 238 204.039 258.502 146.045 185.5C135.885 172.71 154.126 166.5 157.544 165C180.711 154.833 234.789 131.294 241.544 128C260 119 259 112.5 259 94H348.543ZM152 0C190.8 0 239.833 0.333333 259 0.5V94H207C173 94 157.881 90.377 141.5 126.5C102.5 212.5 109.333 197.167 102.5 212.5H0C15 179.167 -3 217.5 65 69C83.5376 28.5172 103.5 0 152 0Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-[15px] font-semibold leading-none tracking-tight">
              Reala
            </span>
          </span>
        </div>
        <div className="flex-1 pt-4">
          <Preview />
        </div>
      </div>
    </div>
  );
}
