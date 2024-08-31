import React from "react";
import { Navbar } from "../../_components/navbar";
import { FadeIn } from "@/components/fade-in";

const DefaultPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full h-full flex-col">
      <FadeIn direction="down" className="z-[200]" once>
        <Navbar showCTA />
      </FadeIn>
      <main className="">{children}</main>
    </div>
  );
};

export default DefaultPage;
