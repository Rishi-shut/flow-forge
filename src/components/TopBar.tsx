import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Play,
  FlaskConical,
  ChevronDown,
  Workflow,
  Sun,
  Moon,
  Download,
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
    theme,
    toggleTheme,
  } = useWorkflowStore();
  const { runSimulation } = useSimulation();
  const [editing, setEditing] = useState(false);
  const isDark = theme === 'dark';

  const statusConfig: Record<string, { bg: string; text: string }> = {
    draft: {
      bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
      text: isDark ? 'text-amber-400' : 'text-amber-600',
    },
    active: {
      bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
    },
    simulating: {
      bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
      text: isDark ? 'text-blue-400' : 'text-blue-600',
    },
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

  const sc = statusConfig[status] || statusConfig.draft;

  return (
    <header
      className={`
        relative z-20 flex h-14 items-center justify-between border-b px-5 transition-colors
        ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}
      `}
    >
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700">
            <Workflow size={15} className="text-slate-300" />
          </div>
          <span className={`text-sm font-semibold tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            FlowForge
          </span>
        </div>

        <div className={`h-5 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

        {editing ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className={`rounded-md border px-2 py-1 text-sm outline-none transition-colors
              ${isDark
                ? 'border-slate-600 bg-slate-800 text-slate-200 focus:border-blue-500'
                : 'border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500'
              }
            `}
            id="project-name-input"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className={`flex items-center gap-1.5 text-sm transition-colors
              ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}
            `}
            id="project-name-btn"
          >
            {projectName}
            <ChevronDown size={12} className="opacity-40" />
          </button>
        )}

        <motion.span
          key={status}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sc.bg} ${sc.text}`}
        >
          {status}
        </motion.span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
            ${isDark
              ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }
          `}
          id="theme-toggle"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className={`h-5 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
            ${isDark
              ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }
          `}
          id="save-btn"
        >
          <Download size={13} />
          Export
        </button>

        <button
          onClick={handleRun}
          disabled={nodes.length === 0}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed
            ${isDark
              ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-900/30'
              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }
          `}
          id="run-btn"
        >
          <Play size={13} />
          Run
        </button>

        <button
          onClick={runSimulation}
          disabled={isSimulating || nodes.length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition-all hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
          id="simulate-btn"
        >
          <FlaskConical size={13} />
          {isSimulating ? 'Running…' : 'Simulate'}
        </button>
      </div>
    </header>
  );
}
