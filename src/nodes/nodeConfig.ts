import type { NodePaletteItem, FlowNodeData } from '@/types';

export const NODE_PALETTE: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point of workflow',
    color: '#4ade80',
    gradient: 'from-emerald-500/10 to-emerald-600/5',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Assign a manual task',
    color: '#60a5fa',
    gradient: 'from-blue-500/10 to-blue-600/5',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Requires sign-off',
    color: '#fbbf24',
    gradient: 'from-amber-500/10 to-amber-600/5',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'API-driven action',
    color: '#c084fc',
    gradient: 'from-purple-500/10 to-purple-600/5',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Terminates the flow',
    color: '#f87171',
    gradient: 'from-red-500/10 to-red-600/5',
  },
];

export function getDefaultNodeData(type: string): FlowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', label: 'Start' };
    case 'task':
      return {
        type: 'task',
        label: 'New Task',
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
      };
    case 'approval':
      return {
        type: 'approval',
        label: 'Approval Gate',
        role: 'manager',
        threshold: 1,
      };
    case 'automated':
      return {
        type: 'automated',
        label: 'Automation',
        automationId: '',
        params: {},
      };
    case 'end':
      return { type: 'end', label: 'End' };
    default:
      return { type: 'start', label: 'Unknown' };
  }
}

export function getNodeColor(type: string): string {
  return NODE_PALETTE.find((n) => n.type === type)?.color ?? '#94a3b8';
}
