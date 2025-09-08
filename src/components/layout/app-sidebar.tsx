// import * as React from "react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import Logo from "@/assets/icons/logo";
// import { authApi, useLogoutMutation } from "@/redux/features/Auth/auth.api";
// import { getSidebarItems } from "@/lib/getSidebarItems";
// import { Button } from "../ui/button";
// import { useAppDispatch } from "@/redux/hook";
// import { Link, useNavigate } from "react-router";
// import { useUserInfoQuery } from "@/redux/features/User/user.api";
// import { toast } from "sonner";

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { data: userData } = useUserInfoQuery(undefined);

//   // console.log(userData?.data?.role, "from sidebar");

//   const data = {
//     navMain: getSidebarItems(userData?.data?.role),
//   };

//   const navigate = useNavigate();
//   const [logout] = useLogoutMutation();
//   const dispatch = useAppDispatch();
  
//   const handleLogout = async () => {
//     const toastId = toast.loading("Logging you out. :'(");
//     try {
//       dispatch(authApi.util.resetApiState());
//       const res = await logout(undefined).unwrap();
//       if (res?.success) {
//         dispatch(authApi.util.resetApiState());
//         toast.success("Log out successful.", { id: toastId });
//         navigate("/", { replace: true });
//       } else {
//         toast.error(res?.data?.message, { id: toastId });
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       console.error(error);
//       const errorMessage =
//         error?.data?.message || "Something went wrong. Try again.";
//       toast.error(errorMessage, { id: toastId });
//     }
//   };
//   // console.log(data);

//   return (
//     <Sidebar {...props}>
//       <SidebarHeader>
//         <Logo />
//       </SidebarHeader>
//       <SidebarContent>
//         <h2 className="m-2 mt-4 text-lg font-semibold">
//           {userData?.data?.role} Dashboard
//         </h2>
//         {/* We create a SidebarGroup for each parent. */}
//         {data.navMain.map((item) => (
//           <SidebarGroup key={item.title}>
//             <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {item.items.map((item:{url:string,title:string}) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <Link to={item.url}>{item.title}</Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>
//       <SidebarRail />
//       {/* { localStorage.getItem(tourKey) && <Button
//         variant={"ghost"}
//         size={"lg"}
//         className="text-sm m-4"
//         onClick={handleRestartTour}
//       >
//         Restart Tour
//       </Button>} */}
//       <Button
//         variant={"outline"}
//         size={"lg"}
//         className="text-sm m-4"
//         onClick={handleLogout}
//       >
//         Logout
//       </Button>
//     </Sidebar>
//   );
// }
