import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  // Gate on the refresh token: the access token expires in minutes, and apiFetch
  // silently rotates it, so its absence does not mean the session is over.
  if (!cookieStore.has("refresh_token")) redirect("/login");

  // Persisted by the sidebar itself so its open/closed state survives reloads.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
