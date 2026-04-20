import type { NodePaletteItem, FlowNodeData } from '@/types';

export const NODE_PALETTE: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point',
    tooltip: 'Every workflow begins here. The Start node triggers the pipeline and passes data to the first connected node.',
    color: '#4ade80',
    gradient: 'from-emerald-500/10 to-emerald-600/5',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Manual task',
    tooltip: 'Assigns a manual task to a team member. Configure a title, description, assignee, and due date. The workflow pauses until the task is completed.',
    color: '#60a5fa',
    gradient: 'from-blue-500/10 to-blue-600/5',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Gate check',
    tooltip: 'A decision gate that requires sign-off from a specified role. Set a threshold for how many approvals are needed before the workflow continues.',
    color: '#fbbf24',
    gradient: 'from-amber-500/10 to-amber-600/5',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'API action',
    tooltip: 'Triggers an automated action via API — send emails, create documents, post to Slack, or call webhooks. Parameters are configured dynamically.',
    color: '#c084fc',
    gradient: 'from-purple-500/10 to-purple-600/5',
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'If / else branch',
    tooltip: 'Evaluates a condition and routes the workflow down different paths. Define a field, operator (equals, contains, greater than), and value to check.',
    color: '#2dd4bf',
    gradient: 'from-teal-500/10 to-teal-600/5',
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Wait timer',
    tooltip: 'Pauses the workflow for a specified duration. Set the time in minutes, hours, or days before the next node is triggered.',
    color: '#fb923c',
    gradient: 'from-orange-500/10 to-orange-600/5',
  },
  {
    type: 'notification',
    label: 'Notification',
    description: 'Send alert',
    tooltip: 'Sends a notification through a chosen channel — email, SMS, push notification, or in-app alert. Compose the message content inline.',
    color: '#f472b6',
    gradient: 'from-pink-500/10 to-pink-600/5',
  },
  {
    type: 'loop',
    label: 'Loop',
    description: 'Repeat block',
    tooltip: 'Repeats the downstream workflow steps a set number of times or iterates over a collection of items. Useful for batch processing.',
    color: '#a78bfa',
    gradient: 'from-violet-500/10 to-violet-600/5',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Finish point',
    tooltip: 'Terminates the workflow. Every pipeline should have at least one End node. No further actions are triggered after this point.',
    color: '#f87171',
    gradient: 'from-red-500/10 to-red-600/5',
  },
];

export function getDefaultNodeData(type: string): FlowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', label: 'Start' };
    case 'task':
      return { type: 'task', label: 'New Task', title: '', description: '', assignee: '', dueDate: '' };
    case 'approval':
      return { type: 'approval', label: 'Approval Gate', role: 'manager', threshold: 1 };
    case 'automated':
      return { type: 'automated', label: 'Automation', automationId: '', params: {} };
    case 'condition':
      return { type: 'condition', label: 'Condition', field: '', operator: 'equals', value: '' };
    case 'delay':
      return { type: 'delay', label: 'Wait', duration: 30, unit: 'minutes' };
    case 'notification':
      return { type: 'notification', label: 'Notify', channel: 'email', message: '' };
    case 'loop':
      return { type: 'loop', label: 'Loop', iterations: 3, collection: '' };
    case 'end':
      return { type: 'end', label: 'End' };
    default:
      return { type: 'start', label: 'Unknown' };
  }
}

export function getNodeColor(type: string): string {
  return NODE_PALETTE.find((n) => n.type === type)?.color ?? '#94a3b8';
}
