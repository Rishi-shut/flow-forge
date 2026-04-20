import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import BaseNode from './BaseNode';
import type { FlowNode } from '@/types';

function StartNode({ id, data, selected }: NodeProps<FlowNode>) {
  return (
    <BaseNode
      id={id}
      type="start"
      label={data.label}
      icon={<Play size={16} />}
      selected={selected}
      showTarget={false}
    />
  );
}

export default memo(StartNode);
