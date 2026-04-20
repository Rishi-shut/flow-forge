import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Play,
  FlaskConical,
  ChevronDown,
  Workflow,
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useSimulation } from '@/hooks/useSimulation';

export default function TopBar() {
  const {
    projectName,
    setProjectName,
    status,
    isSimulating,
    serialize,
    nodes,
    setStatus,
  } = useWorkflowStore();
  const { runSimulation } = useSimulation();
  const [editing, setEditing] = useState(false);

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    simulating: 'bg-purple-500/20 text-purple-400',
  };

  const handleSave = () => {
    const json = serialize();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    if (nodes.length === 0) return;
    setStatus('active');
  };

  return (
    <header className="relative z-20 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0c0c10]/80 px-5 backdrop-blur-xl">
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Workflow size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white/90">
            FlowForge
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        {editing ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-indigo-500/50"
            id="project-name-input"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
            id="project-name-btn"
          >
            {projectName}
            <ChevronDown size={12} className="text-white/30" />
          </button>
        )}

        <motion.span
          key={status}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[status]}`}
        >
          {status}
        </motion.span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white/90"
          id="save-btn"
        >
          <Save size={14} />
          Save
        </button>

        <button
          onClick={handleRun}
          disabled={nodes.length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
          id="run-btn"
        >
          <Play size={14} />
          Run
        </button>

        <button
          onClick={runSimulation}
          disabled={isSimulating || nodes.length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
          id="simulate-btn"
        >
          <FlaskConical size={14} />
          {isSimulating ? 'Simulating...' : 'Simulate'}
        </button>
      </div>
    </header>
  );
}
