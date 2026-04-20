import type { NodeTypes } from '@xyflow/react';
import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedNode from './AutomatedNode';
import ConditionNode from './ConditionNode';
import DelayNode from './DelayNode';
import NotificationNode from './NotificationNode';
import LoopNode from './LoopNode';
import EndNode from './EndNode';

export const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  condition: ConditionNode,
  delay: DelayNode,
  notification: NotificationNode,
  loop: LoopNode,
  end: EndNode,
};
