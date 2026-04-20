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

  const statusConfig: Record<string, { dot: string; label: string }> = {
    draft:      { dot: 'bg-amber-400',  label: 'Draft' },
    active:     { dot: 'bg-emerald-400', label: 'Active' },
    simulating: { dot: 'bg-blue-400',   label: 'Simulating' },
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
        relative z-50 flex h-[60px] items-center border-b transition-all shadow-sm
        ${isDark ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-200 bg-white/95'}
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-10">

        {/* ── Left: Logo + Project Name ── */}
        <div className="flex items-center gap-4 min-w-0">

          {/* Logo mark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105
              ${isDark ? 'bg-zinc-800 ring-1 ring-zinc-700' : 'bg-zinc-100 ring-1 ring-zinc-200'}
            `}>
              <Workflow size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <span className={`hidden sm:inline text-[13px] font-black tracking-[-0.02em] uppercase
              ${isDark ? 'text-zinc-100' : 'text-zinc-900'}
            `}>
              FlowForge
            </span>
          </div>

          {/* Divider */}
          <div className={`hidden lg:block h-5 w-px ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

          {/* Project name */}
          <div className="hidden lg:flex items-center">
            {editing ? (
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                className={`w-56 rounded-lg border px-3 py-1.5 text-sm outline-none transition-all
                  ${isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-100 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'
                    : 'border-zinc-300 bg-white text-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                  }
                `}
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className={`group flex items-center gap-1.5 text-sm font-semibold transition-colors
                  ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}
                `}
              >
                <span className="truncate max-w-[200px]">{projectName}</span>
                <ChevronDown
                  size={13}
                  className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity"
                />
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Badges + Utilities + Actions ── */}
        <div className="flex items-center gap-3">

          {/* Status badges — desktop only */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Node count */}
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1
              ${isDark
                ? 'bg-blue-500/10 ring-blue-500/20 text-blue-400'
                : 'bg-blue-50 ring-blue-200 text-blue-600'}
            `}>
              {nodes.length} {nodes.length === 1 ? 'Node' : 'Nodes'}
            </span>

            {/* Status */}
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1
              ${isDark
                ? 'bg-zinc-800 ring-zinc-700 text-zinc-400'
                : 'bg-zinc-100 ring-zinc-200 text-zinc-500'}
            `}>
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} animate-pulse`} />
              {sc.label}
            </span>
          </div>

          {/* Divider */}
          <div className={`hidden xl:block h-5 w-px ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

          {/* Help + Theme toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHelpOpen(true)}
              title="Help"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                ${isDark
                  ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                  : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}
              `}
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                ${isDark
                  ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                  : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}
              `}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Divider */}
          <div className={`h-5 w-px ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

          {/* Action buttons — same height, consistent style */}
          <div className="flex items-center gap-2">

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={nodes.length === 0}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all
                disabled:opacity-30 active:scale-95
                ${isDark
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ring-1 ring-zinc-700'
                  : 'bg-white text-zinc-600 hover:bg-zinc-50 ring-1 ring-zinc-200'}
              `}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={13} className="text-emerald-500" />
                  </motion.span>
                ) : (
                  <motion.span key="dl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Download size={13} />
                  </motion.span>
                )}
              </AnimatePresence>
              Export
            </button>

            {/* Run */}
            <button
              onClick={handleRun}
              disabled={nodes.length === 0}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all
                disabled:opacity-30 active:scale-95
                ${isDark
                  ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 ring-1 ring-emerald-500/25'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-1 ring-emerald-200'}
              `}
            >
              <Play size={12} fill="currentColor" />
              Run
            </button>

            {/* Simulate — primary CTA */}
            <button
              onClick={runSimulation}
              disabled={isSimulating || nodes.length === 0}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-4 text-xs font-bold uppercase tracking-wide
                transition-all disabled:opacity-50 active:scale-95 text-white
                bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600
                shadow-[0_2px_12px_rgba(37,99,235,0.35)]
              `}
            >
              {isSimulating
                ? <Loader2 size={13} className="animate-spin" />
                : <FlaskConical size={13} />
              }
              Simulate
            </button>
          </div>
        </div>
      </div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} theme={theme} />
    </header>
  );
}