import LoadingScreen from "@/components/layout/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IOrderSort } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllProductsQuery, useDeleteProductMutation } from "@/redux/features/Product/product.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { teams } from "@/constants/teams";
import { toast } from "sonner";

export const ISize = {
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
} as const;

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
  createdAt?: string;
  updatedAt?: string;
}

const filterSchema = z.object({
  searchTerm: z.string().optional().or(z.literal("")),
  team: z.string().optional().or(z.literal("")),
  league: z.string().optional().or(z.literal("")),
  sort: z
    .enum([...Object.values(IOrderSort)] as [string, ...string[]])
    .optional()
    .or(z.literal("")),
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

export default function AllProducts() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const defaultFilter = {
    sortBy: "name",
    sort: "asc",
  };
  const [filters, setFilters] = useState<IFilters | null>(defaultFilter);
  const { data, isLoading } = useGetAllProductsQuery(filters);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // console.log(data);
  // console.log(role, "given role");

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: "",
      team: "",
      league: "",
      sort: "asc",
      limit: "10",
      sortBy: "name",
      isFeatured: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterSchema>) {
    const cleanedFilters = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
    );

    setFilters(cleanedFilters);
    setCurrentPage(1);
    setOpenDialog(false);
  }

  useEffect(() => {
    setFilters({
      ...filters,
      page: currentPage.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const [selectedLeague, setSelectedLeague] = useState<string>("");

  // Get unique leagues
  const leagues = teams.map((item) => item.league);

  // Get teams based on selected league
  const getTeamsForLeague = (league: string) => {
    const leagueData = teams.find((item) => item.league === league);
    return leagueData ? leagueData.teams : [];
  };

  const handleFilterClear = () => {
    form.resetField("isFeatured");
    form.resetField("team");
    form.resetField("league");
    form.resetField("searchTerm");
    setSelectedLeague(""); // Reset selected league
    setFilters({
      sort: "asc",
      limit: "10",
      sortBy: "name",
    });
    setOpenDialog(false);
    setCurrentPage(1);
  };

  const handleOpenDeleteDialog = (product: IProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const toastId = toast.loading("Deleting product...");
    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product deleted successfully", { id: toastId });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to delete product", { id: toastId });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  // console.log(productData);

  // console.log("all orders", data);
  // console.log(data);

  const products: IProduct[] = data?.data?.data;
  const totalPage = data?.data?.meta?.totalPage || 1;

  return (
    <div className="w-full flex flex-col justify-center items-center md:w-5xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex-1 overflow-hidden">
            <div className="w-full flex justify-between items-center my-3">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button variant={"outline"}>Apply Filters</Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Filter Products</DialogTitle>
                    <DialogDescription>
                      Apply filters to narrow down your results.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="searchTerm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Search</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Product name, team, league"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center gap-2">
                        <FormField
                          control={form.control}
                          name="league"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>League</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedLeague(value);
                                  // Reset team when league changes
                                  form.setValue("team", "");
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select league" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {leagues.map((league) => (
                                    <SelectItem key={league} value={league}>
                                      {league}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="team"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Team</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!selectedLeague}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        selectedLeague
                                          ? "Select team"
                                          : "Select league first"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getTeamsForLeague(selectedLeague).map(
                                    (team) => (
                                      <SelectItem key={team} value={team}>
                                        {team}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end items-end gap-3">
                        <FormField
                          control={form.control}
                          name="sortBy"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Sort By</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sort By" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(sortByOptions).map(
                                    (sortOption) => (
                                      <SelectItem
                                        key={sortOption}
                                        value={sortOption}
                                      >
                                        {sortOption}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Featured</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Featured" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={"true"}>Yes</SelectItem>
                                  <SelectItem value={"false"}>No</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end items-end gap-3">
                        <FormField
                          control={form.control}
                          name="sort"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Sort</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sort type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(IOrderSort).map(
                                    (sortOption) => (
                                      <SelectItem
                                        key={sortOption}
                                        value={sortOption}
                                      >
                                        {sortOption}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="limit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Limit</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10"
                                  {...field}
                                  type={"number"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end items-center gap-3">
                        <Button type="submit" variant={"default"}>
                          Apply
                        </Button>
                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={handleFilterClear}
                        >
                          Clear
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Link to={"/add-product"}>
                <Button>Add Product</Button>
              </Link>
            </div>

            {products?.length > 0 ? (
              <div className="mt-8">
                <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b h-full">
                  <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Sizes</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-y-auto">
                    {products?.map((product: IProduct) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <img
                            src={product.images[0]}
                            alt="pd-img"
                            width={"100px"}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        {/* <TableCell>{product.slug}</TableCell> */}
                        <TableCell>{product.league}</TableCell>
                        <TableCell>{product.team}</TableCell>
                        <TableCell>
                          {product.variants.map(
                            (variant) => `${variant.size} `
                          )}
                        </TableCell>
                        <TableCell>
                          {product.isFeatured ? "YES" : "NO"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            onClick={() =>
                              navigate(`/edit-product/${product._id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant={'destructive'}
                            onClick={() => handleOpenDeleteDialog(product)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPage > 1 && (
                  <div className="flex justify-end mt-4">
                    <div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((prev) => prev - 1)}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPage },
                            (_, index) => index + 1
                          ).map((page) => (
                            <PaginationItem
                              key={page}
                              onClick={() => setCurrentPage(page)}
                            >
                              <PaginationLink isActive={currentPage === page}>
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              className={
                                currentPage === totalPage
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center">
                <span className="font-semibold text-lg mt-8">
                  No Products found. Try changing filters.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product "{productToDelete?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
