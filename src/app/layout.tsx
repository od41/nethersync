import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DefaultPage from "./_components/default-page";
import { Toaster } from "@/components/ui/toaster";
import { ApplicationProvider } from "@/context";
import localFont from "next/font/local";

const fontSans = localFont({
  src: "../assets/nunito-var.ttf",
  variable: "--font-sans",
});
const headingSans = localFont({
  src: "../assets/anton-regular.ttf",
  variable: "--font-anton-heading",
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
    <html lang="en">
      <body className={`${fontSans.variable} font-sans`}>
        <ApplicationProvider>
          <TooltipProvider>
            <>
              <DefaultPage>{children}</DefaultPage>
              <Toaster />
            </>
          </TooltipProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
