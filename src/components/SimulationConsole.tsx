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
  } = useWorkflowStore();

  const levelColors = {
    info: 'text-blue-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
  };

  return (
    <div className="relative z-20">
      {/* Toggle Bar */}
      <button
        onClick={toggleConsole}
        className="flex w-full items-center justify-between border-t border-white/[0.06] bg-[#0c0c10]/90 px-5 py-2 backdrop-blur-xl transition-colors hover:bg-white/[0.02]"
        id="console-toggle"
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-white/40" />
          <span className="text-xs font-medium text-white/50">Console</span>
          {isSimulating && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-1.5 w-1.5 rounded-full bg-purple-500"
            />
          )}
          {simulationLogs.length > 0 && (
            <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/40">
              {simulationLogs.length}
            </span>
          )}
        </div>
        {consoleOpen ? (
          <ChevronDown size={14} className="text-white/30" />
        ) : (
          <ChevronUp size={14} className="text-white/30" />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {consoleOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 220 }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden border-t border-white/[0.04] bg-[#08080b]/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-end px-4 py-1.5 border-b border-white/[0.04]">
                <button
                  onClick={clearSimulationLogs}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
                  id="clear-logs-btn"
                >
                  <Trash2 size={10} />
                  Clear
                </button>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs">
                {simulationLogs.length === 0 ? (
                  <p className="text-white/20 italic">
                    No logs yet. Hit "Simulate" to run your workflow.
                  </p>
                ) : (
                  simulationLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 py-1 border-b border-white/[0.02]"
                    >
                      <span className="text-white/15 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`shrink-0 ${levelColors[log.level]}`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className="text-white/60">{log.message}</span>
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
