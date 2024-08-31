import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, Shield, Zap, Globe } from "lucide-react";
import content from "@/content/home.content";
import { LoopingSentences } from "@/components/looping-sentences";
import Image from "next/image";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="">
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <p className="text-xl md:text-2xl mb-8">{content.hero.heading}</p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <LoopingSentences sentences={content.hero.cta_hook} delay={4} />
          </h1>
          <div className="w-full max-w-md">
            <div className="flex space-x-2">
              <Button>Send files for free</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.features.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.features.list.map((feat, index) => (
              <Card key={`feature-${index}`}>
                <CardContent className="flex flex-col items-center p-6">
                  <Image
                    src={feat.photo}
                    width={12}
                    height={12}
                    alt={feat.heading}
                    className=""
                  />
                  <h3 className="text-xl font-semibold mb-2">{feat.heading}</h3>
                  <p className="text-center text-gray-600">
                    {feat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.faqs.heading}
          </h2>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {content.faqs.list.map((faq, index) => (
              <AccordionItem key={`faq-${index}`} value="item-1">
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white py-12">
        <div className="container mx-auto px-4">
          <div className="w-full flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-4">{content.footer.cta}</h3>
            <div className="flex space-x-2">
              <Button>Send files for free</Button>
            </div>
          </div>
          <div className="mt-8 border-t flex items-center justify-between border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NetherSync.</p>
            <div className="flex space-x-4">
              {content.footer.socials.map((social, index) => (
                <Link
                  href={social.link}
                  target="_blank"
                  key={`${social.link}`}
                  className="text-gray-400 hover:text-white"
                >
                  <Image
                    src={social.icon}
                    alt={`social-media-${social.label}-${index + 1}`}
                    className="rounded-lg"
                    width={30}
                    height={30}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
