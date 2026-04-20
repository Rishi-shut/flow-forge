import { ReactFlowProvider } from '@xyflow/react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import SimulationConsole from './components/SimulationConsole';

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
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
