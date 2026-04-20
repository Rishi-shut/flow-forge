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
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, setSelectedNodeId, setSelectedEdgeId, theme,
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
    (_: React.MouseEvent, node: FlowNode) => setSelectedNodeId(node.id),
    [setSelectedNodeId]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => setSelectedEdgeId(edge.id),
    [setSelectedEdgeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);

  const edgeStroke = isDark ? '#3f3f46' : '#d4d4d8';

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
        onEdgeClick={onEdgeClick}
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
        connectionLineStyle={{ stroke: '#60a5fa', strokeWidth: 2, strokeDasharray: '6 3' }}
        proOptions={{ hideAttribution: true }}
        className={isDark ? '!bg-zinc-950' : '!bg-[#f0f0f0]'}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDark ? 'rgba(113,113,122,0.08)' : 'rgba(113,113,122,0.15)'}
        />
        <Controls
          className={`
            !rounded-lg !border !shadow-sm
            ${isDark
              ? '!border-zinc-800 !bg-zinc-900 [&>button]:!border-zinc-800 [&>button]:!bg-transparent [&>button]:!text-zinc-500 [&>button:hover]:!bg-zinc-800 [&>button:hover]:!text-zinc-300'
              : '!border-zinc-300 !bg-[#f5f5f5] [&>button]:!border-zinc-300 [&>button]:!bg-transparent [&>button]:!text-zinc-400 [&>button:hover]:!bg-zinc-200 [&>button:hover]:!text-zinc-600'
            }
          `}
          showInteractive={false}
        />
        <MiniMap
          className={`!rounded-lg !border ${isDark ? '!border-zinc-800 !bg-zinc-900' : '!border-zinc-300 !bg-[#f5f5f5]'}`}
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#4ade80', task: '#60a5fa', approval: '#fbbf24', automated: '#c084fc',
              condition: '#2dd4bf', delay: '#fb923c', notification: '#f472b6', loop: '#a78bfa', end: '#f87171',
            };
            return colors[node.type ?? ''] ?? '#94a3b8';
          }}
          maskColor={isDark ? 'rgba(9,9,11,0.75)' : 'rgba(240,240,240,0.75)'}
        />
      </ReactFlow>

      <Inspector />
    </div>
  );
}
