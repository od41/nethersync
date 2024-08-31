import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DefaultPage from "./(regular_layout)/_components/default-page";
import { Toaster } from "@/components/ui/toaster";
import { ApplicationProvider } from "@/context";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = localFont({
  src: "../assets/nunito-var.ttf",
  variable: "--font-sans",
});
const displaySans = localFont({
  src: "../assets/recoleta-light.ttf",
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
                {children}
                <Toaster />
              </>
            </TooltipProvider>
          </ThemeProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
