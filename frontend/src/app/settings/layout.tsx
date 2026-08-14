import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function SettingsLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  if (!cookieStore.has("refresh_token")) redirect("/login");

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <SettingsSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
