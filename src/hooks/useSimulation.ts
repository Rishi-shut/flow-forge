import { useCallback } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { simulateWorkflow } from '@/api/mock';

export function useSimulation() {
  const {
    nodes,
    setIsSimulating,
    addSimulationLog,
    clearSimulationLogs,
    setStatus,
    toggleConsole,
    consoleOpen,
  } = useWorkflowStore();

  const runSimulation = useCallback(async () => {
    if (nodes.length === 0) return;

    clearSimulationLogs();
    setIsSimulating(true);
    setStatus('simulating');
    if (!consoleOpen) toggleConsole();

    try {
      const logs = await simulateWorkflow(nodes);
      logs.forEach((log) => addSimulationLog(log));
    } finally {
      setIsSimulating(false);
      setStatus('active');
    }
  }, [nodes, clearSimulationLogs, setIsSimulating, setStatus, addSimulationLog, consoleOpen, toggleConsole]);

  return { runSimulation };
}
