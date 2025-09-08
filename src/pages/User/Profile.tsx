import LoadingScreen from "@/components/layout/LoadingScreen";
import AllOrders from "@/components/modules/AllRoles/AllOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRole } from "@/interfaces";
import { useUserInfoQuery } from "@/redux/features/User/user.api";
import AllUsers from "../Admin/AllUsers";
import AllProducts from "../Admin/AllProducts";
import Overview from "@/components/modules/AllRoles/Overview";
import { UpdateProfile } from "@/components/modules/AllRoles/UpdateProfile";

const Profile = () => {
  const { data, isLoading, refetch } = useUserInfoQuery(undefined); // Get refetch here
  if (isLoading) {
    return <LoadingScreen />;
  }
  const ifAdmin = data?.data?.role === IRole.ADMIN;
  return (
    <div className="my-8">
      <Tabs defaultValue="orders" className="flex flex-col items-center">
        <TabsList>
          {ifAdmin && <TabsTrigger value="overview">Overview</TabsTrigger>}
          {ifAdmin && <TabsTrigger value="products">Products</TabsTrigger>}
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {ifAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
          <TabsTrigger value="update">Update Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="w-full space-y-2 p-4">
          <h2 className="font-bold">Overview</h2>
          <Overview />
        </TabsContent>
        <TabsContent value="orders" className="w-full space-y-2 p-4">
          <h2 className="font-bold">Orders</h2>
          <AllOrders />
        </TabsContent>
        <TabsContent value="products" className="w-full space-y-2 p-4">
          <h2 className="font-bold">All Products</h2>
          <AllProducts />
        </TabsContent>
        <TabsContent value="users" className="w-full space-y-2 p-4">
          <h2 className="font-bold">All Users</h2>
          <AllUsers role={IRole.USER} />
        </TabsContent>
        <TabsContent value="update" className="w-full space-y-2 p-4">
          <h2 className="font-bold">Update Profile</h2>
          {/* Pass userData and refetch as props */}
          <UpdateProfile userData={data} refetch={refetch} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
