import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Clock } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, DelayNodeData } from '@/types';

function DelayNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as DelayNodeData;
  return (
    <BaseNode id={id} type="delay" label={d.label} icon={<Clock size={16} />} selected={selected}>
      {d.duration > 0 && (
        <p>
          Wait <span className="text-orange-400">{d.duration} {d.unit}</span>
        </p>
      )}
    </BaseNode>
  );
}

export default memo(DelayNode);
