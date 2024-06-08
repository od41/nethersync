import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DefaultPage from "./_components/default-page";
import { Toaster } from "@/components/ui/toaster";
import { ApplicationProvider } from "@/context";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
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
