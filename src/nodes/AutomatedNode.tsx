import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, AutomatedNodeData } from '@/types';

function AutomatedNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as AutomatedNodeData;
  return (
    <BaseNode id={id} type="automated" label={d.label} icon={<Zap size={16} />} selected={selected}>
      {d.automationId && (
        <p className="text-white/50">
          Action: <span className="text-purple-400">{d.automationId}</span>
        </p>
      )}
    </BaseNode>
  );
}

export default memo(AutomatedNode);
