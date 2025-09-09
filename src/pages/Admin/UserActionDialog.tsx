import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  useGetSingleUserQuery,
  useUpdateProfileMutation,
} from "@/redux/features/User/user.api";
import { IRole, IStatus } from "@/interfaces";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import LoadingScreen from "@/components/layout/LoadingScreen";

// Schema for updating user info by an admin
const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.email().optional(),
  phoneNo: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/)
    .optional()
    .or(z.literal("")),
  address: z.string().max(200).optional(),
  role: z.enum([...Object.values(IRole)] as [string, ...string[]]).optional(),
  status: z.enum([...Object.values(IStatus)] as [string, ...string[]]).optional(),
});

interface UserActionDialogProps {
  userId: string;
}

const UserActionDialog = ({ userId }: UserActionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: userData, isLoading: isUserLoading, isSuccess } = useGetSingleUserQuery(userId, {
    skip: !open, // Only fetch when the dialog is open
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (isSuccess && userData?.data) {
      const user = userData.data;
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        role: user.role || "",
        status: user.status || "",
      });
    }
  }, [userData, isSuccess, form]);

  
  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    const toastId = toast.loading("Updating user...");

    // Filter out empty strings so they don't overwrite existing data with nulls
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== "")
    );

    try {
      await updateUser({ userId: userId, body: payload }).unwrap();
      toast.success("User updated successfully", { id: toastId });
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update user", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        {isUserLoading ? (
          <div className="h-64">
            <LoadingScreen />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={userData?.data?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} defaultValue={userData?.data?.email} />
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
                      <Input placeholder="01XXXXXXXXX" {...field} defaultValue={userData?.data?.phoneNo} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Dhaka" {...field} defaultValue={userData?.data?.address} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-start gap-5 items-center">

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value||userData?.data?.role} defaultValue={userData?.data?.role}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(IRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value||userData?.data?.status} defaultValue={userData?.data?.status}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(IStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserActionDialog;
