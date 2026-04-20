import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Repeat } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode, LoopNodeData } from '@/types';

function LoopNode({ id, data, selected }: NodeProps<FlowNode>) {
  const d = data as LoopNodeData;
  return (
    <BaseNode id={id} type="loop" label={d.label} icon={<Repeat size={16} />} selected={selected}>
      {d.iterations > 0 && (
        <p>
          Repeat <span className="text-violet-400">{d.iterations}×</span>
          {d.collection && <span> over {d.collection}</span>}
        </p>
      )}
    </BaseNode>
  );
}

export default memo(LoopNode);
