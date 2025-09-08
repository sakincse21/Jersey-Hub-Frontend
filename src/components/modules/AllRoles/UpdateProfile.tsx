import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/features/User/user.api";
import { useEffect } from "react";

const updateProfileSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  email: z
    .string({ error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .toLowerCase()
    .optional(),
  phoneNo: z
    .string()
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid. Format: 01XXXXXXXXX",
    })
    .optional()
    .or(z.literal("")),
  address: z
    .string({ error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});

const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string({ error: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),
    newPassword: z
      .string({ error: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),
    newPasswordAgain: z
      .string({ error: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),
  })
  .refine((data) => data.newPassword === data.newPasswordAgain, {
    message: "Passwords do not match",
    path: ["newPasswordAgain"],
  });

// Define props for the component
interface UpdateProfileProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any; // Consider creating a specific type for user data
  refetch: () => void;
}

export function UpdateProfile({ userData, refetch }: UpdateProfileProps) {
  const [updateProfile] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const formUpdateProfile = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
      address: "",
    },
  });

  const formUpdatePassword = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    },
  });

  useEffect(() => {
    if (userData?.data) {
      formUpdateProfile.reset({
        name: userData.data.name || "",
        email: userData.data.email || "",
        phoneNo: userData.data.phoneNo || "",
        address: userData.data.address || "",
      });
    }
  }, [userData, formUpdateProfile]);

  //submit action for profile update
  async function onSubmitUpdateProfile(
    formData: z.infer<typeof updateProfileSchema>
  ) {
    // console.log(formData);

    const toastId = toast.loading("Updating Profile...");
    const payload = {
      body: formData,
      userId: userData?.data?._id,
    };

    try {
      const res = await updateProfile(payload).unwrap();
      if (res?.success) {
        toast.success("Profile updated successfully.", { id: toastId });
        refetch();
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
  }

  //update password submit
  async function onSubmitUpdatePassword(
    formData: z.infer<typeof updatePasswordSchema>
  ) {
    // console.log(formData);

    const toastId = toast.loading("Updating password...");

    try {
      const res = await updatePassword(formData).unwrap();
      if (res?.success) {
        toast.success("Password updated successfully.", { id: toastId });
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
  }

  return (
    <div className="w-full h-full md:w-4xl mx-auto flex flex-col gap-6">
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-xl">Update Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...formUpdateProfile}>
            <form
              onSubmit={formUpdateProfile.handleSubmit(onSubmitUpdateProfile)}
              className="space-y-8"
            >
              <FormField
                control={formUpdateProfile.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdateProfile.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="me@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdateProfile.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdateProfile.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="3/C, B Block, Road 7, Mirpur, Dhaka"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-row justify-end">
                <Button type="submit" className="">
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-xl">Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...formUpdatePassword}>
            <form
              onSubmit={formUpdatePassword.handleSubmit(onSubmitUpdatePassword)}
              className="space-y-8"
            >
              <FormField
                control={formUpdatePassword.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      Old Password
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdatePassword.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      New Password
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdatePassword.control}
                name="newPasswordAgain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Verify Password
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-row justify-end">
                <Button type="submit" className="">
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
