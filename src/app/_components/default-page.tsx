import React from "react";
import { Navbar } from "./navbar";
import BackgroundCarousel from "@/components/ui/background-carousel";
import Image from "next/image";

const photo1 = require("@/assets/bg-photos-1.jpg");
const photo2 = require("@/assets/bg-photos-2.jpg");
const photo3 = require("@/assets/bg-photos-3.jpg");

const CAROUSEL_IMAGES = [
  {
    src: String(photo1.default.src),
    owner: "Aleksandar Pasaric",
    ownerLink: "https://www.pexels.com/photo/view-of-cityscape-325185/",
  },
  {
    src: String(photo2.default.src),
    owner: "ErkinV",
    ownerLink: "https://www.deviantart.com/erkinv/art/photo-editing-868325148",
  },
  {
    src: String(photo3.default.src),
    owner: "MarcoHeisler",
    ownerLink: "https://www.deviantart.com/marcoheisler/gallery",
  },
];

const DefaultPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
        <div className="col-span-3 md:ml-8 mb-12">{children}</div>
      </main>
      {/* <BackgroundCarousel images={CAROUSEL_IMAGES} /> */}
      <div className="w-full absolute top-0 -z-50 flex items-center justify-center min-h-screen h-full radial-dark-transparent">
        {/* <div className="h-full w-full  radial-dark-transparent bg-red-300"></div> */}
        <Image
          src={CAROUSEL_IMAGES[2].src}
          fill={true}
          className="w-full"
          alt={`Slide ${CAROUSEL_IMAGES[0].owner}`}
        />
      </div>
    </div>
  );
};

export default DefaultPage;
