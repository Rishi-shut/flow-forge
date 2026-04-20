import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Square } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode } from '@/types';

function EndNode({ id, data, selected }: NodeProps<FlowNode>) {
  return (
    <BaseNode
      id={id}
      type="end"
      label={data.label}
      icon={<Square size={14} />}
      selected={selected}
      showSource={false}
    />
  );
}

export default memo(EndNode);
