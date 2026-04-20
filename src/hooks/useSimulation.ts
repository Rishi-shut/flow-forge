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
      // Fetch all logs from mock
      const logs = await simulateWorkflow(nodes);
      
      // Instead of adding them all at once, stream them with delays
      // to give the user a real-time "execution" feel.
      for (const log of logs) {
        // Wait 800ms between each log to simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 800));
        addSimulationLog(log);
      }
    } finally {
      setIsSimulating(false);
      setStatus('active');
    }
  }, [nodes, clearSimulationLogs, setIsSimulating, setStatus, addSimulationLog, consoleOpen, toggleConsole]);

  return { runSimulation };
}
