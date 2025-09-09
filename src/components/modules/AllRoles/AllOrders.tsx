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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  IRole,
  IOrderSort,
  IOrderStatus,
  IPaymentMethod,
  IPaymentStatus,
} from "@/interfaces";
import { cn } from "@/lib/utils";
import {
  useAllOrdersQuery,
  useCancelMutation,
  useUpdateOrderMutation,
  useSingleOrderQuery,
} from "@/redux/features/Order/order.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useForm as useEditForm } from "react-hook-form";
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
import { useUserInfoQuery } from "@/redux/features/User/user.api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface IOrderItem {
  size: string;
  quantity: number;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface IItem {
  _id: string;
  userId?: string;
  name?: string;
  phoneNo: string;
  items: IOrderItem[];
  amountSubtotal: number;
  amountShipping?: number;
  amountTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  bkashTransactionId?: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}
//need to infer from the web and order model

const filterSchema = z
  .object({
    searchTerm: z.string().optional().or(z.literal("")),
    status: z
      .enum([...Object.values(IOrderStatus)] as [string, ...string[]])
      .optional()
      .or(z.literal("")),
    paymentStatus: z
      .enum([...Object.values(IPaymentStatus)] as [string, ...string[]])
      .optional()
      .or(z.literal("")),
    paymentMethod: z
      .enum([...Object.values(IPaymentMethod)] as [string, ...string[]])
      .optional()
      .or(z.literal("")),
    sort: z
      .enum([...Object.values(IOrderSort)] as [string, ...string[]])
      .optional()
      .or(z.literal("")),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export interface IFilters {
  searchTerm?: string;
  type?: string;
  status?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  paymentStatus?: string;
  paymentMethos?: string;
}

export default function AllOrders() {
  const [cancel] = useCancelMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<IFilters | null>(null);
  const { data, isLoading } = useAllOrdersQuery(filters);
  const { data: userData } = useUserInfoQuery(undefined);

  // console.log(data);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: "",
      status: "",
      paymentMethod: "",
      paymentStatus: "",
      sort: "desc",
      sortBy: "updatedAt",
      startDate: undefined,
      endDate: undefined,
      limit: "30",
    },
  });

  function onSubmit(values: z.infer<typeof filterSchema>) {
    const cleanedFilters = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
    );
    if (values.startDate) {
      const start = new Date(values.startDate);
      start.setHours(0, 0, 0, 0); // beginning of day
      cleanedFilters.startDate = start.toISOString();
    }

    if (values.endDate) {
      const end = new Date(values.endDate);
      end.setHours(23, 59, 59, 999); // end of day
      cleanedFilters.endDate = end.toISOString();
    }

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

  const handleFilterClear = () => {
    form.reset();
    setFilters(null);
    setOpenDialog(false);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  // console.log(userData);

  const handleCancel = async (orderId: string) => {
    // console.log(orderId);

    const toastId = toast.loading("Initiating cancel...");
    try {
      const res = await cancel(orderId).unwrap();
      console.log("cancelling", res);

      if (res?.success) {
        toast.success("Cancelled successfully", { id: toastId });
      } else {
        toast.error(res?.data?.message, { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  // --- OrderEditDialog Component ---
  const orderEditSchema = z.object({
    phoneNo: z.string().min(11, "Phone number required"),
    name: z.string().min(2, "Name required"),
    shippingAddress: z.string().min(2, "Address required"),
    status: z.enum([...Object.values(IOrderStatus)] as [string, ...string[]]),
    paymentStatus: z.enum([...Object.values(IPaymentStatus)] as [string, ...string[]]),
  });
  type OrderEditForm = z.infer<typeof orderEditSchema>;

  function OrderEditDialog({ order }: { order: IItem }) {
    const [open, setOpen] = useState(false);
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

    // Fetch detailed order info when the dialog is opened
    const { data: singleOrderData, isLoading: isSingleOrderLoading } =
      useSingleOrderQuery(order._id, {
        skip: !open,
        refetchOnMountOrArgChange: true,
      });

    const form = useEditForm<OrderEditForm>({
      resolver: zodResolver(orderEditSchema),
    });

    // Populate form when detailed order data is fetched
    useEffect(() => {
      if (singleOrderData?.data) {
        const detailedOrder = singleOrderData.data;
        form.reset({
          phoneNo: detailedOrder.phoneNo || "",
          name: detailedOrder.name || "",
          shippingAddress: detailedOrder.shippingAddress || "",
          status: detailedOrder.status,
          paymentStatus: detailedOrder.paymentStatus,
        });
      }
    }, [singleOrderData, form]);

    const onSubmit = async (values: OrderEditForm) => {
      const toastId = toast.loading("Updating order...");
      try {
        const res = await updateOrder({
          orderId: order._id,
          body: values,
        }).unwrap();
        if (res.success) {
          toast.success("Order updated", { id: toastId });
          setOpen(false);
        } else {
          toast.error("Order not updated.", { id: toastId });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast.error("Failed to update order", { id: toastId });
      }
    };

    const orderedItems = singleOrderData?.data?.items || [];

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Order ID: {order._id}</DialogDescription>
          </DialogHeader>

          {isSingleOrderLoading ? (
            <div className="h-96">
              <LoadingScreen />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: Products */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Products Ordered</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {orderedItems.map((item: { productId: { images: (string)[]; name: string ; quantity: string | number ;size:string }}, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-2 border rounded-md"
                    >
                      <img
                        src={item.productId?.images[0]}
                        alt={'pd-img'}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">{item.productId?.name}</p>
                        <p className="text-muted-foreground">
                          Size: {item.productId?.size}
                        </p>
                        <p className="text-muted-foreground">
                          Quantity: {item.productId?.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: Form */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={singleOrderData?.data?.status}
                            value={field.value || singleOrderData?.data?.status}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(IOrderStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
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
                      name="paymentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={singleOrderData?.data?.paymentStatus}
                            value={field.value || singleOrderData?.data?.paymentStatus}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(IPaymentStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="pt-4">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // console.log("all orders", data);
  const items: IItem[] = data?.data?.data;
  const totalPage = data?.data?.meta?.totalPage || 1;
  console.log(items);

  return (
    <div className="w-full min-w-2xl mx-auto  flex flex-col justify-center items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex-1 overflow-hidden">
            <div className="w-full flex justify-end items-center my-3">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger>
                  <span
                    className="py-2 px-4 rounded-lg border-2 border-gray-500"
                    // onClick={() => setOpenDialog(true)}
                  >
                    Apply Filters
                  </span>
                  {/* <Button variant={"outline"}>Apply Filters</Button> */}
                </DialogTrigger>
                {/* {openDialog && ( */}
                <DialogContent className="flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Filter Orders</DialogTitle>
                    <DialogDescription>
                      Apply filters to narrow down your order results.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {userData?.data?.role === IRole.ADMIN ? (
                        <FormField
                          control={form.control}
                          name="searchTerm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Search</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Name/Phone No/BKASH Transaction ID/Address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <></>
                      )}
                      <div className="flex justify-between items-center gap-2">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="gap-1">Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(IOrderStatus).map(
                                    (eachStatus) => (
                                      <SelectItem
                                        key={eachStatus}
                                        value={eachStatus}
                                      >
                                        {eachStatus}
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
                          name="paymentStatus"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="gap-1">Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(IPaymentStatus).map(
                                    (eachType) => (
                                      <SelectItem
                                        key={eachType}
                                        value={eachType}
                                      >
                                        {eachType}
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
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="gap-1">Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value as string}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(IPaymentMethod).map(
                                    (eachType) => (
                                      <SelectItem
                                        key={eachType}
                                        value={eachType}
                                      >
                                        {eachType}
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

                      <div className="flex justify-between items-center gap-3">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col flex-1">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick start date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col flex-1">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick end date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
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
                        {/* <span className="py-1 px-4 rounded-lg" onClick={handleFilterClear}>Clear</span> */}
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
            </div>

            {items.length > 0 ? (
              <div className="mt-8 ">
                <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b h-full">
                  <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Shipping</TableHead>
                      <TableHead
                        className={cn(
                          "",
                          userData?.data?.role === IRole.ADMIN
                            ? ""
                            : "text-right"
                        )}
                      >
                        Date
                      </TableHead>
                      {userData?.data?.role === IRole.ADMIN && (
                        <TableHead className="text-right">Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-y-auto">
                    {items?.map((item: IItem) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {item.phoneNo}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.paymentStatus}</TableCell>
                        <TableCell>{item.paymentMethod}</TableCell>
                        <TableCell>{item.amountTotal}</TableCell>
                        <TableCell>{item.shippingAddress}</TableCell>
                        <TableCell
                          className={cn(
                            "",
                            userData?.data?.role === IRole.ADMIN
                              ? ""
                              : "text-right"
                          )}
                        >
                          {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleString()
                            : "N/A"}
                        </TableCell>
                        {userData?.data?.role === IRole.ADMIN && (
                          <TableCell className="text-right flex gap-2 justify-end">
                            <OrderEditDialog order={item} />
                            <Button
                              variant={"destructive"}
                              onClick={() => handleCancel(item._id)}
                              disabled={
                                item.status === IOrderStatus.CANCELLED ||
                                item.status === IOrderStatus.REFUNDED
                              }
                            >
                              {item.status === IOrderStatus.REFUNDED
                                ? item.status
                                : " Cancel "}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPage > 1 && (
                  <div className="flex justify-end mt-4">
                    <div>
                      <Pagination>
                        <PaginationContent className="flex flex-wrap justify-end">
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
                  You do not have any orders.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
