import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { ClipboardList } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, TaskNodeData } from '@/types';

function TaskNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as TaskNodeData;
  return (
    <BaseNode id={id} type="task" label={d.label} icon={<ClipboardList size={16} />} selected={selected}>
      {d.title && (
        <p className="truncate text-white/50">
          {d.title}
          {d.assignee && <span className="ml-1 text-indigo-400">@{d.assignee}</span>}
        </p>
      )}
    </BaseNode>
  );
}

export default memo(TaskNode);
