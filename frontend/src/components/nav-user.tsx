"use client";

import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authService } from "@/lib/auth-service";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function NavUser() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.userData);

  const signOut = async () => {
    await authService.logout().catch(() => undefined);
    dispatch(logout());
    router.replace("/login");
    router.refresh();
  };

  const name = user?.name ?? "…";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-full">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt={name} />
                <AvatarFallback className="rounded-full text-xs">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{name}</span>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) rounded-lg"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex flex-col items-center gap-1 px-1 py-3 text-center">
                <Avatar className="size-12 rounded-full">
                  <AvatarImage src={user?.avatarUrl ?? undefined} alt={name} />
                  <AvatarFallback className="rounded-full">
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="mt-1 truncate font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email ?? "Guest session"}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="size-4" />
                  Change Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  {/* Design offsets the submenu 8px off the parent and sizes it 192px. */}
                  <DropdownMenuSubContent sideOffset={8} className="min-w-48">
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      Theme
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="size-4" />
                      Light
                      {theme === "light" && <CheckMark />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="size-4" />
                      Dark
                      {theme === "dark" && <CheckMark />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem disabled>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={signOut}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function CheckMark() {
  return (
    <svg
      className="ml-auto size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
