import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, ConditionNodeData } from '@/types';

function ConditionNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as ConditionNodeData;
  return (
    <BaseNode id={id} type="condition" label={d.label} icon={<GitBranch size={16} />} selected={selected}>
      {d.field && (
        <p className="truncate">
          If <span className="text-teal-400">{d.field}</span> {d.operator} "{d.value}"
        </p>
      )}
    </BaseNode>
  );
}

export default memo(ConditionNode);
