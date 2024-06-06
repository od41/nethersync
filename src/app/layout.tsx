import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DefaultPage from "./_components/default-page";
import { Toaster } from "@/components/ui/toaster";
import { ApplicationProvider } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nethersync",
  description: "Share files with clients safely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <TooltipProvider>
            <ApplicationProvider>
              <>
                <DefaultPage>{children}</DefaultPage>
                <Toaster />
              </>
            </ApplicationProvider>
          </TooltipProvider>
      </body>
    </html>
  );
}
