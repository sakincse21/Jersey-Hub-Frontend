import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router";
import { ModeToggle } from "../ui/mode-toggle";
import { useUserInfoQuery } from "@/redux/features/User/user.api";
import { SearchIcon, ShoppingBasketIcon } from "lucide-react";
import DisabledMenu from "../menubar6";
import { useAppSelector } from "@/redux/hook";
import { selectTotalCartItems } from "@/redux/features/Cart/cart.slice";
import { Input } from "../ui/input";
import { useState } from "react";

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined);
  const totalCartItems = useAppSelector(selectTotalCartItems);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]=useState('');
  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/flash-sale", label: "Flash Sale" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="px-4 md:px-6 sticky top-0 bg-background backdrop-blur-3xl py-2 w-full z-50">
      <div className="flex h-16 items-center justify-between gap-4 mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 lg:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 xl:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <Link to={link.href} className="py-1.5">
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link to={"/"}>
              <div className="flex items-center justify-around gap-2">
                <Logo />{" "}
                <span className="font-semibold text-3xl">Jersey Hub</span>
              </div>
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-xl:hidden">
              <NavigationMenuList className="gap-4">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="flex flex-row gap-2 justify-end items-center">
            <Input placeholder="Search Here" onChange={(e)=>{e.preventDefault();setSearchTerm(e.target.value)}} />
            <SearchIcon onClick={(e)=>{e.preventDefault();navigate(`/collections?searchTerm=${searchTerm}`)}} />
          </span>
          <Link to={"/cart"} className="relative p-2">
            <ShoppingBasketIcon className="h-6 w-6" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalCartItems}
              </span>
            )}
          </Link>
          {data?.data?.email ? (
            <DisabledMenu role={data?.data?.role} />
          ) : (
            <Link to={"/login"}>
              <Button variant="ghost" size="sm" className="text-sm">
                Login
              </Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
