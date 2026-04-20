import type { NodePaletteItem, FlowNodeData } from '@/types';

export const NODE_PALETTE: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point',
    color: '#22c55e',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Manual task',
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Gate check',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'API action',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-purple-600/5',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Finish point',
    color: '#ef4444',
    gradient: 'from-red-500/20 to-red-600/5',
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
  return NODE_PALETTE.find((n) => n.type === type)?.color ?? '#6b7280';
}
