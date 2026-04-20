import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
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
  } = useWorkflowStore();

  const reactFlowInstance = useRef<ReactFlowInstance<FlowNode> | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData(
        'application/flowforge-node'
      ) as FlowNodeType;
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
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="!bg-[#0a0a0f]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls
          className="!rounded-xl !border !border-white/[0.06] !bg-[#0c0c10]/90 !shadow-xl !backdrop-blur-xl [&>button]:!border-white/[0.06] [&>button]:!bg-transparent [&>button]:!text-white/40 [&>button:hover]:!bg-white/5 [&>button:hover]:!text-white/80"
          showInteractive={false}
        />
        <MiniMap
          className="!rounded-xl !border !border-white/[0.06] !bg-[#0c0c10]/90 !backdrop-blur-xl"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#22c55e',
              task: '#6366f1',
              approval: '#f59e0b',
              automated: '#a855f7',
              end: '#ef4444',
            };
            return colors[node.type ?? ''] ?? '#6b7280';
          }}
          maskColor="rgba(0,0,0,0.7)"
        />
      </ReactFlow>

      <Inspector />
    </div>
  );
}
