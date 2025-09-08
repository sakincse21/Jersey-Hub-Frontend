import LoadingScreen from "@/components/layout/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { IRole, IStatus } from "@/interfaces";
import {
  useLazyGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/redux/features/User/user.api";
import type { TRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const updateSchema = z.object({
  role: z.enum([...Object.values(IRole)] as [string, ...string[]]).optional(),
  status: z
    .enum([...Object.values(IStatus)] as [string, ...string[]])
    .optional(),
  isVerified: z.boolean().optional(),
  phoneNo: z
    .string()
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    })
    .optional(),
  nidNo: z
    .union([
      z.string().length(13, {
        message: "NID length must be 13 or 17 characters long.",
      }),
      z.string().length(17, {
        message: "NID length must be 13 or 17 characters long.",
      }),
    ])
    .optional(),
});

export interface IUpdates {
  role: string;
  status: string;
  isVerified: boolean;
  phoneNo: string;
  nidNo: string;
}

const UserActionDialog = ({ userId, role }: { userId: string, role?: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  //   const [filters, setFilters] = useState<IFilters | null>(null);
  const [updateUser] = useUpdateUserMutation();
  const [getSingleUser, { data, isLoading }] = useLazyGetSingleUserQuery();
  const userData = data?.data;

  // console.log(userData, "user single data");

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      role: userData?.role || "",
      isVerified: userData?.isVerified || "",
      status: userData?.status || "",
      phoneNo: userData?.phoneNo || "",
      nidNo: userData?.nidNo || "",
    },
  });

  useEffect(() => {
    if (openDialog && userId) {
      getSingleUser(userId);
    }
  }, [openDialog, userId, getSingleUser]);

  useEffect(() => {
    if (userData) {
      form.reset({
        role: userData?.role || "",
        isVerified: userData?.isVerified,
        status: userData?.status || "",
        phoneNo: userData?.phoneNo || "",
        nidNo: userData?.nidNo || "",
      });
    }
  }, [userData, form]);

  if (isLoading) {
    return (
      <span className="py-2 px-4 rounded-lg bg-primary text-white">
        Loading...
      </span>
    );
  }

  const roleArray:TRole[] = [IRole.ADMIN,IRole.USER];

  async function onSubmit(values: z.infer<typeof updateSchema>) {
    const toastId = toast.loading("Updating user.");
    try {
      const payload = {
        ...values,
        userId,
      };
      const res = await updateUser(payload).unwrap();
      if (res?.success) {
        toast.success("User updated successfully.", { id: toastId });
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
    setOpenDialog(false);
  }

  return (
    <div className="w-full flex justify-end items-center my-3">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <span className="py-2 px-4 rounded-lg bg-primary text-white">
            Update
          </span>
        </DialogTrigger>

        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Update {role}</DialogTitle>
            <DialogDescription>Update the info of a user.</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No</FormLabel>
                      <FormControl>
                        <Input placeholder="018XXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nidNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NID No</FormLabel>
                      <FormControl>
                        <Input placeholder="13 or 17 digit nid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center gap-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="gap-1">Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(IStatus).map((eachStatus) => (
                              <SelectItem key={eachStatus} value={eachStatus}>
                                {eachStatus}
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="gap-1">Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleArray.map((eachType) => (
                              <SelectItem key={eachType} value={eachType}>
                                {eachType}
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
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Verified</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value === "Yes");
                          }}
                          value={field.value ? "Yes" : "No"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end items-center gap-3">
                  <Button type="submit" variant={"default"}>
                    Apply
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActionDialog;
