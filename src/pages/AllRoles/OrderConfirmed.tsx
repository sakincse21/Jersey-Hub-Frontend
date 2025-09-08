import { Link } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OrderConfirmed = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center flex flex-col ">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <CardTitle className="mt-4 text-3xl">Thank You for Your Order!</CardTitle>
          <CardDescription className="mt-2 text-lg">
            Your order has been placed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We have sent a confirmation email to your registered email address with the order details.
          </p>
          <p className="text-muted-foreground">
            You can expect your delivery within 3-4 business days. You can track the status of your order in your profile.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/collections">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmed;