import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/store/workflowStore';
import { nodeTypes } from '@/nodes';
import { getDefaultNodeData } from '@/nodes/nodeConfig';
import Inspector from './Inspector';
import EmptyState from './EmptyState';
import type { FlowNode, FlowNodeType } from '@/types';

export default function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
    theme,
  } = useWorkflowStore();

  const isDark = theme === 'dark';
  const reactFlowInstance = useRef<ReactFlowInstance<FlowNode> | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/flowforge-node') as FlowNodeType;
      if (!nodeType || !reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: FlowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: getDefaultNodeData(nodeType),
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const edgeStroke = isDark ? '#475569' : '#cbd5e1';

  return (
    <div className="relative flex-1 overflow-hidden">
      {nodes.length === 0 && <EmptyState />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowInstance.current = instance as ReactFlowInstance<FlowNode>;
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: edgeStroke, strokeWidth: 1.5 },
        }}
        connectionLineStyle={{ stroke: '#60a5fa', strokeWidth: 2 }}
        proOptions={{ hideAttribution: true }}
        className={isDark ? '!bg-slate-950' : '!bg-slate-100'}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDark ? 'rgba(148,163,184,0.06)' : 'rgba(100,116,139,0.12)'}
        />
        <Controls
          className={`
            !rounded-lg !border !shadow-sm
            ${isDark
              ? '!border-slate-800 !bg-slate-900 [&>button]:!border-slate-800 [&>button]:!bg-transparent [&>button]:!text-slate-500 [&>button:hover]:!bg-slate-800 [&>button:hover]:!text-slate-300'
              : '!border-slate-200 !bg-white [&>button]:!border-slate-200 [&>button]:!bg-transparent [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-50 [&>button:hover]:!text-slate-600'
            }
          `}
          showInteractive={false}
        />
        <MiniMap
          className={`
            !rounded-lg !border
            ${isDark
              ? '!border-slate-800 !bg-slate-900'
              : '!border-slate-200 !bg-white'
            }
          `}
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#4ade80',
              task: '#60a5fa',
              approval: '#fbbf24',
              automated: '#c084fc',
              end: '#f87171',
            };
            return colors[node.type ?? ''] ?? '#94a3b8';
          }}
          maskColor={isDark ? 'rgba(2,6,23,0.75)' : 'rgba(241,245,249,0.75)'}
        />
      </ReactFlow>

      <Inspector />
    </div>
  );
}
