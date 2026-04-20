import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function SimulationConsole() {
  const {
    consoleOpen,
    toggleConsole,
    simulationLogs,
    clearSimulationLogs,
    isSimulating,
    theme,
  } = useWorkflowStore();

  const isDark = theme === 'dark';

  const levelColors = {
    info: isDark ? 'text-blue-400' : 'text-blue-600',
    success: isDark ? 'text-emerald-400' : 'text-emerald-600',
    warning: isDark ? 'text-amber-400' : 'text-amber-600',
    error: isDark ? 'text-red-400' : 'text-red-600',
  };

  return (
    <div className="relative z-20">
      {/* Toggle Bar */}
      <button
        onClick={toggleConsole}
        className={`flex w-full items-center justify-between border-t px-5 py-2 transition-colors
          ${isDark
            ? 'border-slate-800 bg-slate-900 hover:bg-slate-800/60'
            : 'border-slate-200 bg-white hover:bg-slate-50'
          }
        `}
        id="console-toggle"
      >
        <div className="flex items-center gap-2">
          <Terminal size={13} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Console
          </span>
          {isSimulating && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
            />
          )}
          {simulationLogs.length > 0 && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium
              ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}
            `}>
              {simulationLogs.length}
            </span>
          )}
        </div>
        {consoleOpen ? (
          <ChevronDown size={13} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
        ) : (
          <ChevronUp size={13} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {consoleOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`overflow-hidden border-t
              ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}
            `}
          >
            <div className="flex h-full flex-col">
              {/* Toolbar */}
              <div className={`flex items-center justify-end px-4 py-1 border-b
                ${isDark ? 'border-slate-800' : 'border-slate-200'}
              `}>
                <button
                  onClick={clearSimulationLogs}
                  className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors
                    ${isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}
                  `}
                  id="clear-logs-btn"
                >
                  <Trash2 size={10} />
                  Clear
                </button>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs">
                {simulationLogs.length === 0 ? (
                  <p className={`italic ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
                    No logs yet. Click "Simulate" to run your workflow.
                  </p>
                ) : (
                  simulationLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`flex gap-3 py-1 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200/60'}`}
                    >
                      <span className={`shrink-0 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`shrink-0 font-medium ${levelColors[log.level]}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {log.message}
                      </span>
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
