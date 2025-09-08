import App from "@/App";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Unauthorized from "@/pages/Auth/Unauthorized";
import About from "@/pages/Public/About";
import Features from "@/pages/Public/DeliverPolicy";
import { createBrowserRouter } from "react-router";
import Home from "@/pages/Public/Home";
import { Faq } from "@/pages/Public/Faq";
import { Contact } from "@/pages/Public/Contact";
import NotFound from "@/pages/Public/NotFound";
import Cart from "@/pages/AllRoles/Cart";
import CheckOut from "@/pages/AllRoles/CheckOut";
import OrderConfirmed from "@/pages/AllRoles/OrderConfirmed";
import Profile from "@/pages/User/Profile";
import AddProduct from "@/pages/Admin/AddProduct";
import EditProduct from "@/pages/Admin/EditProduct";
import Collections from "@/pages/AllRoles/Collections";
import ProductPage from "@/pages/AllRoles/ProductPage";
import FlashSale from "@/pages/AllRoles/FlashSale";
import { WithAuth } from "@/lib/withAuth";
import { IRole } from "@/interfaces";
import DeliverPolicy from "@/pages/Public/DeliverPolicy";
import ReturnPolicy from "@/pages/Public/ReturnPolicy";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        path: "/",
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "unauthorized",
        Component: Unauthorized,
      },
      {
        path: "contact-us",
        Component: Contact,
      },
      {
        path: "faq",
        Component: Faq,
      },
      {
        path: "features",
        Component: Features,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "flash-sale",
        Component: FlashSale,
      },
      {
        path: "profile",
        Component: WithAuth(Profile,[IRole.ADMIN,IRole.USER]),
      },
      {
        path: "add-product",
        Component: WithAuth(AddProduct, [IRole.ADMIN]),
      },
      {
        path: "/edit-product/:id",
        Component: WithAuth(EditProduct, [IRole.ADMIN]),
      },
      {
        path: "product/:slug",
        Component: ProductPage,
      },
      {
        path: "cart",
        Component: Cart,
      },
      {
        path: "checkout",
        Component: CheckOut,
      },
      {
        path: "collections",
        Component: Collections,
      },
      {
        path: "order-confirmed",
        Component: OrderConfirmed,
      },
      {
        path: "delivery-policy",
        Component: DeliverPolicy,
      },
      {
        path: "return-policy",
        Component: ReturnPolicy,
      },
      {
        path: "/*",
        Component: NotFound,
      },
    ],
  },
  // {
  //   path: "/admin",
  //   Component: WithAuth(DashboardLayout, [
  //     IRole.ADMIN as TRole
  //   ]),
  //   children: [
  //     {
  //       index: true,
  //       Component: AdminOverview,
  //     },
  //     ...generateRoutes(adminSiderbarItems),
  //   ],
  // },
]);
