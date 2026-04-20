import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Bell } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, NotificationNodeData } from '@/types';

function NotificationNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as NotificationNodeData;
  return (
    <BaseNode id={id} type="notification" label={d.label} icon={<Bell size={16} />} selected={selected}>
      {d.channel && (
        <p className="truncate">
          via <span className="text-pink-400">{d.channel}</span>
          {d.message && ` — "${d.message.slice(0, 30)}…"`}
        </p>
      )}
    </BaseNode>
  );
}

export default memo(NotificationNode);
