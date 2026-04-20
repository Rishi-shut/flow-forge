import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function SimulationConsole() {
  const { consoleOpen, toggleConsole, simulationLogs, clearSimulationLogs, isSimulating, theme } = useWorkflowStore();
  const isDark = theme === 'dark';

  const levelColors = {
    info: isDark ? 'text-blue-400' : 'text-blue-600',
    success: isDark ? 'text-emerald-400' : 'text-emerald-600',
    warning: isDark ? 'text-amber-400' : 'text-amber-600',
    error: isDark ? 'text-red-400' : 'text-red-600',
  };

  return (
    <div className="relative z-20">
      <button
        onClick={toggleConsole}
        className={`flex w-full items-center justify-between border-t px-4 py-2 transition-colors
          ${isDark ? 'border-zinc-800/80 bg-zinc-900 hover:bg-zinc-800' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'}
        `}
        id="console-toggle"
      >
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
          <span className={`text-[12px] font-bold tracking-tight ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Console</span>
          {isSimulating && (
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-2 w-2 rounded-full bg-blue-500" />
          )}
          {simulationLogs.length > 0 && (
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}>
              {simulationLogs.length}
            </span>
          )}
        </div>
        {consoleOpen ? <ChevronDown size={12} className="opacity-30" /> : <ChevronUp size={12} className="opacity-30" />}
      </button>

      <AnimatePresence>
        {consoleOpen && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 180 }} exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`overflow-hidden border-t ${isDark ? 'border-zinc-800/80 bg-zinc-950' : 'border-zinc-200 bg-[#f0f0f0]'}`}
          >
            <div className="flex h-full flex-col">
              <div className={`flex items-center justify-end px-3 py-1 border-b ${isDark ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
                <button onClick={clearSimulationLogs} className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors
                  ${isDark ? 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400' : 'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600'}
                `} id="clear-logs-btn">
                  <Trash2 size={10} /> Clear
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
                {simulationLogs.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className={`italic ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>No logs yet. Click "Simulate" to start.</p>
                  </div>
                ) : (
                  simulationLogs.map((log, i) => (
                    <motion.div key={log.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      className={`flex gap-3 py-1 border-b border-transparent hover:border-zinc-800/20 transition-colors ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}
                    >
                      <span className="shrink-0 opacity-40 tabular-nums">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                      <span className={`shrink-0 font-bold w-12 ${levelColors[log.level]}`}>{log.level.toUpperCase()}</span>
                      <span className={`flex-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{log.message}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
