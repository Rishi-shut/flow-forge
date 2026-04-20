import type { Node, Edge } from '@xyflow/react';

// ── Node Types ──────────────────────────────────────────────────────────
export type FlowNodeType =
  | 'start'
  | 'task'
  | 'approval'
  | 'automated'
  | 'condition'
  | 'delay'
  | 'notification'
  | 'loop'
  | 'end';

export interface StartNodeData {
  type: 'start';
  label: string;
  [key: string]: unknown;
}

export interface TaskNodeData {
  type: 'task';
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  [key: string]: unknown;
}

export interface ApprovalNodeData {
  type: 'approval';
  label: string;
  role: string;
  threshold: number;
  [key: string]: unknown;
}

export interface AutomatedNodeData {
  type: 'automated';
  label: string;
  automationId: string;
  params: Record<string, string>;
  [key: string]: unknown;
}

export interface ConditionNodeData {
  type: 'condition';
  label: string;
  field: string;
  operator: string;
  value: string;
  [key: string]: unknown;
}

export interface DelayNodeData {
  type: 'delay';
  label: string;
  duration: number;
  unit: string;
  [key: string]: unknown;
}

export interface NotificationNodeData {
  type: 'notification';
  label: string;
  channel: string;
  message: string;
  [key: string]: unknown;
}

export interface LoopNodeData {
  type: 'loop';
  label: string;
  iterations: number;
  collection: string;
  [key: string]: unknown;
}

export interface EndNodeData {
  type: 'end';
  label: string;
  [key: string]: unknown;
}

export type FlowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | ConditionNodeData
  | DelayNodeData
  | NotificationNodeData
  | LoopNodeData
  | EndNodeData;

export type FlowNode = Node<FlowNodeData, FlowNodeType>;
export type FlowEdge = Edge;

// ── Automation API ──────────────────────────────────────────────────────
export interface Automation {
  id: string;
  label: string;
  params: string[];
}

// ── Simulation ──────────────────────────────────────────────────────────
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface SimulationLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  message: string;
  level: LogLevel;
}

export type WorkflowStatus = 'draft' | 'active' | 'simulating';

// ── Node palette item ───────────────────────────────────────────────────
export interface NodePaletteItem {
  type: FlowNodeType;
  label: string;
  description: string;
  tooltip: string;
  color: string;
  gradient: string;
}
