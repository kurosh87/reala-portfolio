import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { validateEnv } from "@/lib/env";
import "./globals.css";

const appEnv = validateEnv();
const metadataBase = new URL(appEnv.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Reala | AI Workflow Audit for Real Estate Teams",
    template: "%s | Reala",
  },
  description:
    "Reala helps real estate teams find where leads go cold, then build faster AI response, follow-up, and CRM workflows.",
  openGraph: {
    title: "Reala | AI Workflow Audit for Real Estate Teams",
    description:
      "Find where real estate leads go cold, then build faster response, follow-up, and CRM workflows.",
    url: "/",
    siteName: "Reala",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reala | AI Workflow Audit for Real Estate Teams",
    description:
      "Find where real estate leads go cold, then build faster response, follow-up, and CRM workflows.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = <ThemeProvider>{children}</ThemeProvider>;

  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {content}
      </body>
    </html>
  );
}
