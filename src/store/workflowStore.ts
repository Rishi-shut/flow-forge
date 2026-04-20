import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type {
  FlowNode,
  FlowEdge,
  FlowNodeData,
  SimulationLog,
  WorkflowStatus,
} from '@/types';

export type Theme = 'light' | 'dark';

interface WorkflowState {
  // ── Graph ───────────────────────────────────────────────────────
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: FlowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<FlowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;

  // ── Selection ───────────────────────────────────────────────────
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // ── UI State ────────────────────────────────────────────────────
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  consoleOpen: boolean;
  toggleConsole: () => void;
  theme: Theme;
  toggleTheme: () => void;

  // ── Workflow Meta ───────────────────────────────────────────────
  projectName: string;
  setProjectName: (name: string) => void;
  status: WorkflowStatus;
  setStatus: (status: WorkflowStatus) => void;

  // ── Simulation ──────────────────────────────────────────────────
  simulationLogs: SimulationLog[];
  addSimulationLog: (log: SimulationLog) => void;
  clearSimulationLogs: () => void;
  isSimulating: boolean;
  setIsSimulating: (v: boolean) => void;

  // ── Serialization ───────────────────────────────────────────────
  serialize: () => string;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // ── Graph ─────────────────────────────────────────────────────────
  nodes: [],
  edges: [],

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    const theme = get().theme;
    const strokeColor = theme === 'dark' ? '#64748b' : '#94a3b8';
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: strokeColor, strokeWidth: 1.5 },
        },
        get().edges
      ),
    });
  },

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  updateNodeData: (nodeId, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } as FlowNodeData }
          : n
      ),
    }),

  deleteNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      selectedNodeId:
        get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    }),

  deleteEdge: (edgeId) =>
    set({ edges: get().edges.filter((e) => e.id !== edgeId) }),

  // ── Selection ─────────────────────────────────────────────────────
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // ── UI State ──────────────────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  consoleOpen: false,
  toggleConsole: () => set({ consoleOpen: !get().consoleOpen }),
  theme: 'dark',
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  // ── Workflow Meta ─────────────────────────────────────────────────
  projectName: 'Untitled Workflow',
  setProjectName: (name) => set({ projectName: name }),
  status: 'draft',
  setStatus: (status) => set({ status }),

  // ── Simulation ────────────────────────────────────────────────────
  simulationLogs: [],
  addSimulationLog: (log) =>
    set({ simulationLogs: [...get().simulationLogs, log] }),
  clearSimulationLogs: () => set({ simulationLogs: [] }),
  isSimulating: false,
  setIsSimulating: (v) => set({ isSimulating: v }),

  // ── Serialization ─────────────────────────────────────────────────
  serialize: () => {
    const { nodes, edges, projectName, status } = get();
    return JSON.stringify({ projectName, status, nodes, edges }, null, 2);
  },
}));
