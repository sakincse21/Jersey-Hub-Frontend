import { Button } from "@/components/ui/button";
import { useLazySearchUserQuery } from "@/redux/features/User/user.api";
import { toast } from "sonner";

// ✅ Correct - Properly destructure props
const SearchUser = ({
  form,
  requiredRole,
}: {
  form: { getValues: (field: string) => string };
  requiredRole: string;
}) => {
  const [searchUser, { isLoading: isSearchLoading }] = useLazySearchUserQuery();

  const handleCheck = async () => {
    const phoneNumber = form.getValues("to");

    if (!phoneNumber || phoneNumber.length > 11 || phoneNumber.length < 11) {
      toast.error("Please enter a valid phone number first.");
      return;
    }
    const toastId = toast.loading("Searching...");
    try {
      const res = await searchUser(phoneNumber).unwrap();

      if (res?.success) {
        if (res?.data?.role === requiredRole) {
          toast.success(
            `${res?.data?.role} found: ${res?.data?.name} (${res?.data?.phoneNo})`,
            { id: toastId }
          );
        } else {
          toast.error(
            `${res?.data?.role} found: ${res?.data?.name} (${res?.data?.phoneNo})`,
            { id: toastId }
          );
        }
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
  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={handleCheck}
      disabled={isSearchLoading}
    >
      {isSearchLoading ? "Checking..." : "Check"}
    </Button>
  );
};

export default SearchUser;
