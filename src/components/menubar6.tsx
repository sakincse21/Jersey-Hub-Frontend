import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { User2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { authApi, useLogoutMutation } from "@/redux/features/Auth/auth.api";
import { useAppDispatch } from "@/redux/hook";

export default function DisabledMenu({ role }: { role: string }) {
  console.log(role);

  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    logout(undefined);
    dispatch(authApi.util.resetApiState());
    navigate("/", { replace: true });
    dispatch(authApi.util.resetApiState());
  };
  return (
    <Menubar className=" border-0">
      <MenubarMenu>
        <MenubarTrigger>
          <User2Icon />
        </MenubarTrigger>
        <MenubarContent>
          <Link to={"/profile"}>
            <MenubarItem>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex justify-center items-center w-full"
              >
                Profile
              </Button>
            </MenubarItem>
          </Link>
          {/* <MenubarItem>
            <Link to={"/settings"}>Settings</Link>
          </MenubarItem> */}
          <MenubarItem>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="text-sm w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
