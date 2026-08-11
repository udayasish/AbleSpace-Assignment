import type { CreateSubtaskDto, CreateTaskDto } from './schemas';

/** Copy taken from the Figma board so a guest's first view matches the design. */
export const demoTasks: CreateTaskDto[] = [
  {
    title: 'Write API Documentation',
    description:
      'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
    status: 'todo',
    priority: 'high',
    assigneeLabel: 'Admin',
    labels: ['Deployment', 'Documentation'],
  },
  {
    title: 'Implement Search Function',
    status: 'todo',
    priority: 'medium',
    assigneeLabel: 'Admin',
    labels: ['Deployment', 'Documentation'],
  },
  {
    title: 'Deploy to Production',
    status: 'todo',
    priority: 'urgent',
    assigneeLabel: 'Admin',
    labels: ['Deployment', 'Documentation'],
  },
  {
    title: 'Code Review Completed',
    status: 'doing',
    priority: 'medium',
    assigneeLabel: 'Admin',
    labels: ['Deployment', 'Documentation'],
  },
  {
    title: 'Design Mockups Finalized',
    status: 'doing',
    priority: 'low',
    assigneeLabel: 'Admin',
    labels: ['Deployment', 'Documentation'],
  },
  {
    title: 'Feature Testing Passed',
    status: 'completed',
    priority: 'medium',
    assigneeLabel: 'QA Team',
    labels: ['Testing', 'Passed'],
  },
  {
    title: 'UI Design Updated',
    status: 'completed',
    priority: 'low',
    assigneeLabel: 'Designer',
    labels: ['Design', 'Updated'],
  },
  {
    title: 'Security Audit Scheduled',
    status: 'completed',
    priority: 'high',
    assigneeLabel: 'Security',
    labels: ['Audit', 'Scheduled'],
  },
  {
    title: 'UI Review',
    status: 'on_hold',
    priority: 'medium',
    assigneeLabel: 'Designer',
    labels: ['Design', 'Review'],
  },
  {
    title: 'Backend Integration',
    status: 'on_hold',
    priority: 'high',
    assigneeLabel: 'Dev Team',
    labels: ['Development'],
  },
];

/** Subtasks for the first demo task — the one the Figma detail screen shows. */
export const demoSubtasks: CreateSubtaskDto[] = [
  {
    title: 'Draft the endpoint reference',
    priority: 'high',
    assigneeLabel: 'Admin',
  },
  {
    title: 'Add request and response examples',
    priority: 'low',
    assigneeLabel: 'Dev Team',
  },
  {
    title: 'Review with the team',
    priority: 'medium',
    assigneeLabel: 'QA Team',
  },
];

export const demoComment =
  'Starting with the inventory endpoints — the sales metrics section needs the new filters documented too.';

/** Due dates are relative so seeded data never looks stale. */
export function demoDueDate(index: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + ((index % 5) + 1));
  return date;
}
