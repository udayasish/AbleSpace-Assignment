import { TaskDetailView } from "@/components/tasks/detail/task-detail-view";

export default async function TaskDetailPage({
  params,
}: PageProps<"/tasks/[id]">) {
  const { id } = await params;
  return <TaskDetailView taskId={id} />;
}
