import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import SimulationConsole from './components/SimulationConsole';
import { useWorkflowStore } from './store/workflowStore';

export default function App() {
  const theme = useWorkflowStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ReactFlowProvider>
      <div
        className={`flex h-screen w-screen flex-col overflow-hidden transition-colors duration-200
          ${theme === 'dark' ? 'bg-zinc-950 text-zinc-200' : 'bg-[#f0f0f0] text-zinc-700'}
        `}
      >
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Canvas />
            <SimulationConsole />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
