import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { ShieldCheck } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, ApprovalNodeData } from '@/types';

function ApprovalNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as ApprovalNodeData;
  return (
    <BaseNode id={id} type="approval" label={d.label} icon={<ShieldCheck size={16} />} selected={selected}>
      {d.role && (
        <p className="text-white/50">
          Role: <span className="text-amber-400">{d.role}</span>
          {d.threshold > 0 && <span className="ml-2">· {d.threshold} required</span>}
        </p>
      )}
    </BaseNode>
  );
}

export default memo(ApprovalNode);
