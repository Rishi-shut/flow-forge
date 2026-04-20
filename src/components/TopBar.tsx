import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Play,
  FlaskConical,
  ChevronDown,
  Workflow,
  Sun,
  Moon,
  Check,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useSimulation } from '@/hooks/useSimulation';
import HelpModal from './HelpModal';

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
  const [saved, setSaved] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const isDark = theme === 'dark';

  const statusConfig: Record<string, { dot: string; text: string; label: string }> = {
    draft: { dot: 'bg-amber-400', text: isDark ? 'text-zinc-400' : 'text-zinc-500', label: 'Draft' },
    active: { dot: 'bg-emerald-400', text: isDark ? 'text-zinc-400' : 'text-zinc-500', label: 'Active' },
    simulating: { dot: 'bg-blue-400', text: isDark ? 'text-zinc-400' : 'text-zinc-500', label: 'Simulating' },
  };

  const handleExport = () => {
    const json = serialize();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRun = () => {
    if (nodes.length === 0) return;
    setStatus('active');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sc = statusConfig[status] || statusConfig.draft;

  return (
    <header
      className={`
        relative z-50 flex h-[56px] items-center justify-between border-b px-4 sm:px-6 transition-all shadow-sm
        ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}
      `}
    >
      {/* Left: Logo + Name + Status */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm
            ${isDark ? 'bg-zinc-800 ring-1 ring-zinc-700' : 'bg-zinc-100 ring-1 ring-zinc-200'}
          `}>
            <Workflow size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <span className={`hidden md:inline text-sm font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
            FlowForge
          </span>
        </div>

        <div className={`hidden sm:block h-5 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        {/* Project Name Area */}
        <div className="flex items-center gap-3">
          {editing ? (
            <input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              className={`w-40 sm:w-56 rounded-md border px-3 py-1.5 text-sm outline-none transition-all shadow-inner
                ${isDark
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                  : 'border-zinc-300 bg-white text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }
              `}
              id="project-name-input"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className={`group flex items-center gap-1.5 text-sm font-medium transition-colors
                ${isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'}
              `}
              id="project-name-btn"
            >
              <span className="truncate max-w-[140px] sm:max-w-[240px]">{projectName}</span>
              <ChevronDown size={14} className="shrink-0 opacity-40 group-hover:opacity-100" />
            </button>
          )}

          {/* Status Badge */}
          <div className={`hidden xs:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ring-1
            ${isDark ? 'bg-zinc-800/50 ring-zinc-800' : 'bg-zinc-100/50 ring-zinc-200'}
          `}>
            <div className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${sc.dot}`} />
            <span className={sc.text}>{sc.label}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Help */}
          <button
            onClick={() => setHelpOpen(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all
              ${isDark
                ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
              }
            `}
            title="Help & Components"
          >
            <HelpCircle size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all
              ${isDark
                ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
              }
            `}
            id="theme-toggle"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className={`h-5 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        <div className="flex items-center gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            disabled={nodes.length === 0}
            className={`
              flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-semibold tracking-tight transition-all disabled:opacity-30
              ${isDark
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 active:scale-95'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 active:scale-95'
              }
            `}
            id="export-btn"
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={14} className="text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Download size={14} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={nodes.length === 0}
            className={`
              flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-bold tracking-tight transition-all disabled:opacity-30
              ${isDark
                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95'
                : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:scale-95'
              }
            `}
            id="run-btn"
          >
            <Play size={14} fill="currentColor" />
            <span className="hidden sm:inline">Run</span>
          </button>

          {/* Simulate - High Prominence */}
          <button
            onClick={runSimulation}
            disabled={isSimulating || nodes.length === 0}
            className={`
              relative flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-bold tracking-tight transition-all disabled:opacity-50
              shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]
              ${isDark
                ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }
            `}
            id="simulate-btn"
          >
            {isSimulating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Working…</span>
              </>
            ) : (
              <>
                <FlaskConical size={14} />
                <span>Simulate</span>
              </>
            )}
          </button>
        </div>
      </div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} theme={theme} />
    </header>
  );
}
