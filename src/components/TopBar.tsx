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
        relative z-50 flex h-[60px] items-center border-b transition-all shadow-sm
        ${isDark ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-200 bg-white/95'}
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-10">
        
        {/* Left Section: Logo & Branding */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105
              ${isDark ? 'bg-zinc-800 ring-1 ring-zinc-700' : 'bg-zinc-100 ring-1 ring-zinc-200'}
            `}>
              <Workflow size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <span className={`hidden sm:inline text-[13px] md:text-[15px] font-black tracking-[-0.02em] uppercase ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              FlowForge
            </span>
          </div>

          <div className={`hidden lg:block h-6 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

          {/* Project Name Area - Hidden on tablets/mobile to save space */}
          <div className="hidden lg:flex items-center gap-4">
            {editing ? (
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                className={`w-64 rounded-xl border px-4 py-2 text-sm outline-none transition-all shadow-inner
                  ${isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                    : 'border-zinc-300 bg-white text-zinc-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                  }
                `}
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className={`group flex items-center gap-2 text-sm font-bold tracking-tight transition-colors
                  ${isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'}
                `}
              >
                <span className="truncate max-w-[240px]">{projectName}</span>
                <ChevronDown size={14} className="shrink-0 opacity-40 group-hover:opacity-100 transition-transform group-hover:translate-y-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Metadata + Utilities + Actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          
          {/* Metadata Badges - Only on Desktop */}
          <div className="hidden xl:flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ring-1 transition-all
              ${isDark ? 'bg-blue-500/10 ring-blue-500/20 text-blue-400' : 'bg-blue-50 ring-blue-100 text-blue-600'}
            `}>
              <span>{nodes.length}</span>
              <span className="opacity-60">{nodes.length === 1 ? 'Node' : 'Nodes'}</span>
            </div>

            <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 transition-all duration-300
              ${isDark ? 'bg-zinc-800/50 ring-zinc-800 text-zinc-400' : 'bg-zinc-100/50 ring-zinc-200 text-zinc-500'}
            `}>
              <div className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${sc.dot} animate-pulse`} />
              <span>{sc.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme & Help Utilities - Hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-opacity-50" style={{ backgroundColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(244, 244, 245, 0.5)' }}>
              <button
                onClick={() => setHelpOpen(true)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-90
                  ${isDark ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600'}
                `}
                title="Help"
              >
                <HelpCircle size={18} />
              </button>
              <button
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-90
                  ${isDark ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600'}
                `}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Action Island - The "Perfect" Spaced Container */}
            <div className={`flex items-center gap-3 sm:gap-4 p-1 rounded-2xl ring-1 shadow-lg
              ${isDark ? 'bg-zinc-950/60 ring-white/5 shadow-black/20' : 'bg-zinc-100/60 ring-black/5 shadow-zinc-200/50'}
            `} style={{ backdropFilter: 'blur(8px)' }}>
              
              {/* Export */}
              <button
                onClick={handleExport}
                disabled={nodes.length === 0}
                className={`
                  flex h-9 items-center justify-center gap-2 rounded-xl px-3 sm:px-4 text-xs font-bold transition-all disabled:opacity-30 active:scale-95
                  ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}
                `}
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
                <span className="hidden xl:inline">Export</span>
              </button>

              {/* Run */}
              <button
                onClick={handleRun}
                disabled={nodes.length === 0}
                className={`
                  flex h-9 items-center justify-center gap-2 rounded-xl px-3 sm:px-4 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-30 active:scale-95
                  ${isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'}
                `}
              >
                <Play size={14} fill="currentColor" />
                <span className="hidden xl:inline">Run</span>
              </button>

              {/* Simulate */}
              <button
                onClick={runSimulation}
                disabled={isSimulating || nodes.length === 0}
                className={`
                  relative flex h-9 items-center justify-center gap-2 rounded-xl px-4 sm:px-6 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50
                  shadow-[0_4px_16px_rgba(37,99,235,0.4)] active:scale-95 text-white
                  bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600
                `}
              >
                {isSimulating ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
                <span className="hidden sm:inline">Simulate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} theme={theme} />
    </header>
  );
}
