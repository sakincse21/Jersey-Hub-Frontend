import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useGetAllProductsQuery } from "@/redux/features/Product/product.api";
import { IOrderSort } from "@/interfaces";
import { teams } from "@/constants/teams";

import LoadingScreen from "@/components/layout/LoadingScreen";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Interfaces and Schemas from AllProducts.tsx
export interface IVariant {
  size: string;
  stock: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  league: string;
  team: string;
  price: number;
  images: string[];
  variants: IVariant[];
  isFeatured?: boolean;
}

const filterSchema = z.object({
  searchTerm: z.string().optional().or(z.literal("")),
  team: z.string().optional().or(z.literal("")),
  league: z.string().optional().or(z.literal("")),
  sort: z.enum([...Object.values(IOrderSort)] as [string, ...string[]]).optional().or(z.literal("")),
  sortBy: z.string().optional(),
  limit: z.string().optional(),
  isFeatured: z.string().optional(),
});

export interface IFilters {
  searchTerm?: string;
  team?: string;
  league?: string;
  sort?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  isFeatured?: string;
}

const sortByOptions: string[] = ["name", "price", "team", "league"];
const limitOptions: string[] = ["9", "12", "18", "24"];

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParams = Object.fromEntries(searchParams.entries());
  const currentPage = parseInt(queryParams.page || "1", 10);
  const defaultFilter = { sortBy: "name", sort: "asc", limit: "9" };
  const filters: IFilters = { ...defaultFilter, ...queryParams };

  const { data, isLoading } = useGetAllProductsQuery(filters);

  const [selectedLeague, setSelectedLeague] = useState<string>(filters.league || "");

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: filters.searchTerm || "",
      team: filters.team || "",
      league: filters.league || "",
      sort: filters.sort || "asc",
      limit: filters.limit || "9",
      sortBy: filters.sortBy || "name",
      isFeatured: filters.isFeatured || "",
    },
  });

  // Sync form with URL params
  useEffect(() => {
    const newFilters = Object.fromEntries(searchParams.entries());
    form.reset({
      searchTerm: newFilters.searchTerm || "",
      team: newFilters.team || "",
      league: newFilters.league || "",
      sort: newFilters.sort || "asc",
      limit: newFilters.limit || "9",
      sortBy: newFilters.sortBy || "name",
      isFeatured: newFilters.isFeatured || "",
    });
    setSelectedLeague(newFilters.league || "");
  }, [searchParams, form]);

  function onSubmit(values: z.infer<typeof filterSchema>) {
    const newParams = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    newParams.delete("page"); // Reset to first page on new filter
    setSearchParams(newParams);
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

  const leagues = teams.map((item) => item.league);
  const getTeamsForLeague = (league: string) => {
    const leagueData = teams.find((item) => item.league === league);
    return leagueData ? leagueData.teams : [];
  };

  const handleFilterClear = () => {
    setSearchParams({});
  };

  const products: IProduct[] = data?.data?.data || [];
  const totalPage = data?.data?.meta?.totalPage || 1;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section: Filters */}
        <aside className="w-full lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="searchTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="league"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>League</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedLeague(value);
                            form.setValue("team", "");
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select league" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leagues.map((league) => <SelectItem key={league} value={league}>{league}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLeague}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedLeague ? "Select team" : "Select league first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getTeamsForLeague(selectedLeague).map((team) => <SelectItem key={team} value={team}>{team}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort By</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sortByOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Sort order" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(IOrderSort).map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Products per page" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {limitOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt} per page</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button type="submit">Apply Filters</Button>
                    <Button type="button" variant="ghost" onClick={handleFilterClear}>Clear Filters</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </aside>

        {/* Right Section: Products and Pagination */}
        <main className="w-full lg:w-3/4">
          {isLoading ? (
            <LoadingScreen />
          ) : products.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow">
                {products.map((product) => (
                  <Card key={product._id} className="flex flex-col">
                    <CardHeader className="p-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover rounded-t-lg p-3" />
                    </CardHeader>
                    <CardContent className="pt-4 flex-grow">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.team}</p>
                      <p className="text-lg font-semibold mt-2">${product.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/product/${product.slug}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {totalPage > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                      {[...Array(totalPage).keys()].map((page) => (
                        <PaginationItem key={page + 1} onClick={() => handlePageChange(page + 1)} className="cursor-pointer">
                          <PaginationLink isActive={currentPage === page + 1}>{page + 1}</PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(Math.min(totalPage, currentPage + 1))} className={currentPage === totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-muted-foreground">No products found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collections;