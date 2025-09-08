import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  selectCartItems,
  selectCartSubtotal,
  updateQuantity,
  removeItem,
} from "@/redux/features/Cart/cart.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Link } from "react-router";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shippingRate = 100;
  const total = subtotal + shippingRate;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/collections">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 p-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.variant.size}`}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Size: {item.variant.size}
                </p>
                <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        size: item.variant.size,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                >
                  -
                </Button>
                <Input
                  type="number"
                  className="h-8 w-16 text-center"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        size: item.variant.size,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    )
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        size: item.variant.size,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                >
                  +
                </Button>
              </div>
              <p className="font-semibold w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() =>
                  dispatch(
                    removeItem({
                      productId: item.productId,
                      size: item.variant.size,
                    })
                  )
                }
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p className="font-semibold">${shippingRate.toFixed(2)}</p>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <p className="font-bold">Total</p>
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
            <Link to="/checkout" className="w-full">
                <Button className="w-full mt-4" size="lg">
                Proceed to Checkout
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;