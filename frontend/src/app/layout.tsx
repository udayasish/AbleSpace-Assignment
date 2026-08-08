import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthInit } from "@/components/auth/auth-init";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pyramid",
  description: "Plan, track and ship your work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      {/* Browser extensions commonly inject body attributes before hydration. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <StoreProvider>
          <ThemeProvider>
            <AuthInit />
            {children}
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
