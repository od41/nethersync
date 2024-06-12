import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DefaultPage from "./_components/default-page";
import { Toaster } from "@/components/ui/toaster";
import { ApplicationProvider } from "@/context";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = localFont({
  src: "../assets/nunito-var.ttf",
  variable: "--font-sans",
});
const displaySans = localFont({
  src: "../assets/noto-serif.ttf",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "NetherSync",
  description: "Share files & assets with clients securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans ${displaySans.variable}`}
      >
        <ApplicationProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <>
                <DefaultPage>{children}</DefaultPage>
                <Toaster />
              </>
            </TooltipProvider>
          </ThemeProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
