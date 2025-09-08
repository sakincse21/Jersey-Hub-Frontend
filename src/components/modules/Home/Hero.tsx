import { Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeroProps {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero = ({
  description = "Track your money, save smarter, and achieve your financial goals with ease digitally. PaisaHiPaisa gives you the tools to manage money stress-free.",
  button = {
    text: "Get Started Free",
    url: "/signup",
  },
  reviews = {
    count: 500,
    rating: 4.9,
    avatars: [
      {
        src: "https://randomuser.me/api/portraits/men/32.jpg",
        alt: "User 1",
      },
      {
        src: "https://randomuser.me/api/portraits/women/44.jpg",
        alt: "User 2",
      },
      {
        src: "https://randomuser.me/api/portraits/men/51.jpg",
        alt: "User 3",
      },
      {
        src: "https://randomuser.me/api/portraits/women/48.jpg",
        alt: "User 4",
      },
      {
        src: "https://randomuser.me/api/portraits/men/21.jpg",
        alt: "User 5",
      },
    ],
  },
}: HeroProps) => {
  return (
     <section className="py-32">
      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">
            Take Control of Your Money Digitally with <span className="text-primary">PaisahiPaisa</span>
          </h1>
          <p className="text-muted-foreground text-balance lg:text-lg">
            {description}
          </p>
        </div>
        <Button asChild size="lg" className="mt-10">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="mr-1 font-semibold">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground text-left font-medium">
              from {reviews.count}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
    // <section className="py-32 bg-gradient-to-b from-white to-muted">
    //   <div className="container text-center">
    //     <div className="mx-auto flex max-w-5xl flex-col gap-6">
    //       <h1 className="text-3xl font-extrabold lg:text-6xl">{heading}</h1>
    //       <p className="text-muted-foreground text-balance lg:text-lg">
    //         {description}
    //       </p>
    //     </div>
    //     <Button asChild size="lg" className="mt-10 bg-emerald-600 text-white hover:bg-emerald-700">
    //       <a href={button.url}>{button.text}</a>
    //     </Button>
    //     <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
    //       <span className="mx-4 inline-flex items-center -space-x-4">
    //         {reviews.avatars.map((avatar, index) => (
    //           <Avatar key={index} className="size-14 border-2 border-white shadow-md">
    //             <AvatarImage src={avatar.src} alt={avatar.alt} />
    //           </Avatar>
    //         ))}
    //       </span>
    //       <div>
    //         <div className="flex items-center gap-1">
    //           {[...Array(5)].map((_, index) => (
    //             <Star
    //               key={index}
    //               className="size-5 fill-yellow-400 text-yellow-400"
    //             />
    //           ))}
    //           <span className="mr-1 font-semibold">
    //             {reviews.rating?.toFixed(1)}
    //           </span>
    //         </div>
    //         <p className="text-muted-foreground text-left font-medium">
    //           Trusted by {reviews.count}+ users
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export { Hero };
