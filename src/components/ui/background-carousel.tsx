"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BackgroundCarousel = ({ images }: { images: any }) => {
  return (
    <Carousel
      className="w-full absolute top-0 -z-50"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className=" h-screen w-full -ml-0 ">
        {images.map((img: any, index: number) => (
          <CarouselItem
            key={index}
            className=" flex items-center justify-center pl-0"
          >
            <Image
              src={img.src}
              layout="fill"
              objectFit="cover"
              alt={`Slide ${index}`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default BackgroundCarousel;
