import { useUserInfoQuery } from "@/redux/features/User/user.api";
import type { TRole } from "@/types/user";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const WithAuth = (Component: ComponentType, requiredRoles?: TRole[]) => {
  return function AuthWrapper() {
    // console.log(requiredRoles);

    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to={"/login"} />;
    }
    if (!isLoading && !requiredRoles?.includes(data?.data?.role)) {
      return <Navigate to={"/unauthorized"} />;
    }
    return <Component />;
  };
};
