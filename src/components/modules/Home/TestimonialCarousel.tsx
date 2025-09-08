import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useCallback, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  feedback: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Student & Football Fan",
    avatar: "https://blookie.io/stock/person1.webp",
    rating: 5,
    feedback:
      "Found the perfect jersey for my favorite team on Jersey Hub! The quality is amazing and the delivery was super fast. I can't wait to wear it for the next match.",
  },
  {
    id: 2,
    name: "Imran Hossain",
    role: "Jersey Collector",
    avatar: "https://blookie.io/stock/person2.webp",
    rating: 5,
    feedback:
      "As a collector, finding authentic jerseys is tough. Jersey Hub has an incredible selection of high-quality kits. My order arrived in perfect condition.",
  },
  {
    id: 3,
    name: "Salma Akter",
    role: "University Student",
    avatar: "https://blookie.io/stock/person3.webp",
    rating: 4,
    feedback:
      "I ordered a custom jersey for my university's football team, and it turned out better than I expected. The fabric is comfortable and the print is top-notch.",
  },
  {
    id: 4,
    name: "Rafid Karim",
    role: "Lifelong Football Fan",
    avatar: "https://blookie.io/stock/person4.webp",
    rating: 5,
    feedback:
      "I've been buying jerseys for years, and Jersey Hub is now my go-to store. Their collection is fantastic, prices are fair, and the checkout process is seamless. Highly recommended!",
  },
];

export default function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-2xl px-6 lg:max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <h2 className="text-3xl/tight font-semibold tracking-tight sm:text-4xl/tight">
            What Our Customers Say
          </h2>
          <div className="space-x-4">
            <Button onClick={scrollPrev} variant="outline" size="icon">
              <ArrowLeft />
            </Button>
            <Button onClick={scrollNext} variant="outline" size="icon">
              <ArrowRight />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="mt-12 w-80 mx-auto sm:w-full"
        >
          <CarouselContent className="-ml-4 lg:-ml-6">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3 lg:pl-6"
              >
                <Card className="hover:border-primary h-full transition-all duration-300 hover:shadow-md">
                  <CardContent className="flex h-full flex-col">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < testimonial.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-4 mb-4 flex-grow text-sm/6">
                      {testimonial.feedback}
                    </p>
                    <div className="mt-auto flex items-center gap-4">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="text-sm sm:text-base">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">
                          {testimonial.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
