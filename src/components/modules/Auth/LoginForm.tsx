import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/redux/features/Auth/auth.api";
import { toast } from "sonner";
// import { useAppDispatch } from "@/redux/hook";

const loginSchema = z.object({
  email: z.email({ error: "Enter a valid Email." }).toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password should be atleast 8 characters." }),
});

export function LoginForm() {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    // console.log(formData);
    // const loginInfo:ILogin = {
    //   email: formData.email,
    //   password: formData.password
    // }
    // console.log("showing res",res);
    const toastId = toast.loading("Logging in...");
    try {
      // dispatch(authApi.util.resetApiState());
      const res = await login(formData).unwrap();
      if (res?.success) {
        toast.success("Login successful.", { id: toastId });

        navigate('/collections')
        

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
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="me@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to={"/register"} className="w-full">
            <Button type="button" className="w-full bg-ring">
              Register Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link to={"about"}>Terms of Service</Link> and{" "}
        <Link to={"/about"}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
