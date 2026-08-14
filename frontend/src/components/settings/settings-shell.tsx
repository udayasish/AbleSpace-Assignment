import { SidebarTrigger } from "@/components/ui/sidebar";

/** Figma: 64px header band, then a 640px column centred in the 1024px main area. */
export function SettingsShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center px-4">
        <SidebarTrigger className="-ml-1" />
      </header>

      <div className="flex min-w-0 flex-1 justify-center px-4 pb-4">
        <div className="flex w-full max-w-[640px] flex-col gap-8">
          <h1 className="text-2xl leading-none font-medium">{title}</h1>
          <div className="flex flex-col gap-12">{children}</div>
        </div>
      </div>
    </>
  );
}
