import { PageHeader } from "@/components/page-header";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-muted-foreground text-sm">
          The projects table lands in a later slice.
        </p>
      </div>
    </>
  );
}
