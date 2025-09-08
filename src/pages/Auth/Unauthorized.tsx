import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";
import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="mx-auto max-w-md text-center h-full flex flex-col items-center justify-center flex-1">
      <LockIcon className="mx-auto h-12 w-12 text-primary" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Unauthorized Access
      </h1>
      <p className="mt-4 text-muted-foreground">
        You do not have the necessary permissions to access this resource.
        Please contact your administrator for assistance.
      </p>
      <div className="mt-6">
        <Link to={"/"}>
          <Button className="text-lg" variant={"outline"}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
