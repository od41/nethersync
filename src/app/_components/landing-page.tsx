import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, Shield, Zap, Globe, ArrowRightIcon } from "lucide-react";
import content from "@/content/home.content";
import { LoopingSentences } from "@/components/looping-sentences";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="">
        <FadeIn direction="down" initialDelay={0.05} once>
          <div className="container mx-auto md:px-10 pb-12 pt-6 md:pt-0 flex flex-col">
            <div className="text-4xl md:text-6xl mb-5 font-display w-full lg:w-2/3 ">
              <LoopingSentences sentences={content.hero.cta_hook} delay={4} />
            </div>
            <div className="w-full max-w-md">
              <Button size="lg" className="" asChild>
                <Link href={"/transfers/send"}>
                  Send Files <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Benefits Section */}
        <div className="container mx-auto md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {content.features.list.map((feature, index) => (
              <FadeIn
                key={`${index}-index`}
                initialDelay={(index + 1) * 0.2}
                once
              >
                <div className="w-full h-full bg-muted p-5 lg:p-7 pb-0 rounded-xl border-0 border-white">
                  <div className="text-xl md:text-3xl font-display mb-2">
                    {feature.heading}
                  </div>
                  <div className="text-md md:text-lg text-muted-foreground mb-2 font-normal">
                    {feature.description}
                  </div>
                  <div className="w-full h-[200px] relative">
                    <Image
                      src={feature.photo}
                      fill={true}
                      className="object-contain"
                      alt={feature.heading}
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl md:px-10">
          <FadeIn initialDelay={0.2} once>
            <h2 className="text-5xl font-normal font-display text-center mb-12">
              {content.faqs.heading}
            </h2>
          </FadeIn>
          <div className="flex flex-col justify-start w-full gap-4">
            {content.faqs.list.map((item, index) => {
              return (
                <FadeIn
                  key={`${index}-faq-index`}
                  initialDelay={(index + 1) * 0.07}
                  once
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`${index}-item`}>
                      <AccordionTrigger className="text-2xl font-display md:text-2xl [&[data-state=open]]:pb-3">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-lg pb-0">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white py-12">
        <div className="container mx-auto md:px-10">
          <div className="flex flex-col md:flex-row justify-between w-full h-full bg-muted px-7 py-14 rounded-xl">
            <FadeIn
              once
              className="w-full flex flex-col items-center md:items-start mb-8 md:mb-0 justify-center"
            >
              <h3 className="text-3xl md:text-4xl font-display text-center md:text-left mb-4">
                {content.footer.cta}
              </h3>
              <div className="flex space-x-2">
                <Button size="lg" className="" asChild>
                  <Link href={"/transfers/send"}>
                    Send Files <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            {/* <FadeIn initialDelay={0.4} once> */}
            <FadeIn
              initialDelay={0.2}
              once
              className="w-full h-[200px] relative"
            >
              <Image
                src="/icons/leo-illustration.svg"
                fill={true}
                className="object-contain"
                alt="send files with Nethersync illustration"
              />
            </FadeIn>
            {/* </FadeIn> */}
          </div>
          <FadeIn
            once
            initialDelay={0.2}
            className="mt-8 flex items-center justify-between text-center text-muted-foreground"
          >
            <p>&copy; {new Date().getFullYear()} NetherSync.</p>
            <div className="flex space-x-4">
              {content.footer.socials.map((social, index) => (
                <Link
                  href={social.link}
                  target="_blank"
                  key={`${social.link}`}
                  className="text-muted-foreground hover:opacity-70"
                >
                  <Image
                    src={social.icon}
                    alt={`social-media-${social.label}-${index + 1}`}
                    className="rounded-lg"
                    width={23}
                    height={23}
                  />
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
