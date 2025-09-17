
"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import type { UserProfile } from '@/lib/types';
import ProfileCard from "./profile-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface MatchCarouselProps {
  profiles: UserProfile[];
}

const MatchCarousel: React.FC<MatchCarouselProps> = ({ profiles }) => {
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-1">
        {profiles.map((profile, index) => (
          <CarouselItem key={index} className="pl-4 basis-11/12 md:basis-1/3">
            <div className="p-1">
              <ProfileCard profile={profile} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default MatchCarousel;
