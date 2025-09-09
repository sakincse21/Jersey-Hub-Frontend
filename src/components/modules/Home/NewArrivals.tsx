import { Link } from "react-router";
import { useGetAllProductsQuery } from "@/redux/features/Product/product.api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/layout/LoadingScreen";
import type { IProduct } from "../../../pages/AllRoles/Collections";

const NewArrivals = () => {
  // Fetch latest 7 products by sorting by creation date in descending order
  const { data, isLoading } = useGetAllProductsQuery({ sortBy: "createdAt", sort: "desc", limit: "7" });
  const products: IProduct[] = data?.data?.data || [];

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">New Arrivals</h2>
        <p className="text-muted-foreground text-center mb-10">Check out the latest jerseys just added to our store.</p>
        {isLoading ? (
          <div className="h-96">
            <LoadingScreen />
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full p-12"
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col h-full gap-2 overflow-hidden">
                       <CardContent className="p-0 rounded-md">
                         <img src={product.images[0]} alt={product.name} className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105 rounded-md p-3" />
                       </CardContent>
                       <div className="p-4 flex flex-col gap-2 flex-grow">
                         <h3 className="text-md font-bold flex-grow">{product.name}</h3>
                         <p className="text-sm font-semibold">${product.price}</p>
                       </div>
                       <CardFooter>
                         <Link to={`/product/${product.slug}`} className="w-full">
                           <Button className="w-full rounded-sm" variant={'default'}>View Details</Button>
                         </Link>
                       </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12 hidden sm:flex" />
            <CarouselNext className="mr-12 hidden sm:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;