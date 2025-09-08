import LoadingScreen from "@/components/layout/LoadingScreen";
import AllOrders from "@/components/modules/AllRoles/AllOrders";
import { UpdateProfile } from "@/components/modules/AllRoles/UpdateProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRole } from "@/interfaces";
import { useUserInfoQuery } from "@/redux/features/User/user.api";
import AllUsers from "../Admin/AllUsers";
import AllProducts from "../Admin/AllProducts";
import Overview from "@/components/modules/AllRoles/Overview";

const Profile = () => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  if(isLoading){
    return <LoadingScreen />
  }
  const ifAdmin = data?.data?.role === IRole.ADMIN;
  return (
    <div className="my-8">
      <Tabs defaultValue="orders">
        <TabsList className="mx-auto">
          {ifAdmin && <TabsTrigger value="overview">Overview</TabsTrigger>}
          {ifAdmin && <TabsTrigger value="products">Products</TabsTrigger>}
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {ifAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
          <TabsTrigger value="update-profile">Update Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-2 p-4">
          <h2 className="font-bold">Overview</h2>
          <Overview />
        </TabsContent>
        <TabsContent value="orders" className="space-y-2 p-4">
          <h2 className="font-bold">Orders</h2>
          <AllOrders />
        </TabsContent>
        <TabsContent value="products" className="space-y-2 p-4">
          <h2 className="font-bold">All Products</h2>
          <AllProducts />
        </TabsContent>
        <TabsContent value="users" className="space-y-2 p-4">
          <h2 className="font-bold">All Users</h2>
          <AllUsers role={IRole.USER} />
        </TabsContent>
        <TabsContent value="updateProfile" className="space-y-2 p-4">
          <h2 className="font-bold">Update Profile</h2>
          <UpdateProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
