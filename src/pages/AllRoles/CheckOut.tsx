import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "@/redux/features/Cart/cart.slice";
import { useUserInfoQuery } from "@/redux/features/User/user.api";
import { useCreateOrderMutation } from "@/redux/features/Order/order.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const checkoutSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  phoneNo: z.string().regex(/^(?:01\d{9})$/, {
    message: "Phone number must be valid. Format: 01XXXXXXXXX",
  }),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  bkashTransactionId: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery({});
  const [createOrder, { isLoading: isOrderCreating }] =
    useCreateOrderMutation();

  const [paymentMethod, setPaymentMethod] = useState<"BKASH" | "COD">();
  const shippingRate = 100;
  const total = subtotal + shippingRate;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phoneNo: "",
      shippingAddress: "",
      bkashTransactionId: "",
    },
  });

  useEffect(() => {
    if (userData?.data) {
      const { name, phoneNo, address } = userData.data;
      form.reset({
        name: name || "",
        phoneNo: phoneNo || "",
        shippingAddress: address || "",
      });
    }
  }, [userData, form]);

  const handlePlaceOrder = async (values: CheckoutFormValues) => {
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const orderData = {
      userId: userData?.data?._id, // Optional: Will be included if user is logged in
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.variant.size,
      })),
      paymentMethod,
      ...values, // Includes name, phoneNo, and shippingAddress from the form
    };

    console.log(orderData);

    const toastId = toast.loading("Placing your order...");

    try {
      const res = await createOrder(orderData).unwrap();
      if (res.success) {
        if (paymentMethod === "BKASH" && res.data.url) {
          toast.success("Redirecting to payment...", { id: toastId });
          dispatch(clearCart());
          window.location.href = res.data.url;
        } else {
          toast.success("Order placed successfully!", { id: toastId });
          dispatch(clearCart());
          navigate("/profile");
        }
      } else {
        toast.error(res.message || "Failed to place order.", { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "An unexpected error occurred.", {
        id: toastId,
      });
    }
  };

  if (cartItems.length === 0 && !isOrderCreating) {
    navigate("/collections");
    return null;
  }

  return (
    <div className="container mx-auto my-12 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePlaceOrder)}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Shipping Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Shipping Information</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isUserLoading} />
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
                    <Input
                      {...field}
                      disabled={isUserLoading}
                      placeholder="01XXXXXXXXX"
                    />
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
                    <Textarea
                      {...field}
                      disabled={isUserLoading}
                      placeholder="Enter your full shipping address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            <div className="p-6 border rounded-lg space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variant.size}`}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.variant.size} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-semibold">${shippingRate.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold">Payment Method</h2>
            <RadioGroup
              onValueChange={(value: "BKASH" | "COD") =>
                setPaymentMethod(value)
              }
              className="p-6 border rounded-lg space-y-4"
            >
              <div className="flex flex-col justify-center space-x-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BKASH" id="bkash" />
                  <Label htmlFor="bkash" className="font-semibold">
                    Pay with BKash
                  </Label>
                </div>
                <FormField
                  control={form.control}
                  name="bkashTransactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID (Send Money to <strong>01833410082</strong>)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isUserLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="COD" />
                <Label htmlFor="COD" className="font-semibold">
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              disabled={!paymentMethod || isOrderCreating}
            >
              {isOrderCreating ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Checkout;
