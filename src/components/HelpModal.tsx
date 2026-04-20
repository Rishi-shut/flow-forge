import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ClipboardList, ShieldCheck, Zap, GitBranch, Clock, Bell, Repeat, Square } from 'lucide-react';
import { NODE_PALETTE } from '@/nodes/nodeConfig';
import type { FlowNodeType } from '@/types';

const iconMap: Record<FlowNodeType, React.ReactNode> = {
  start: <Play size={18} />,
  task: <ClipboardList size={18} />,
  approval: <ShieldCheck size={18} />,
  automated: <Zap size={18} />,
  condition: <GitBranch size={18} />,
  delay: <Clock size={18} />,
  notification: <Bell size={18} />,
  loop: <Repeat size={18} />,
  end: <Square size={16} />,
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function HelpModal({ isOpen, onClose, theme }: HelpModalProps) {
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl
              ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}
            `}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b px-6 py-4 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>Component Documentation</h2>
                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Learn how to use FlowForge workflow components</p>
              </div>
              <button
                onClick={onClose}
                className={`rounded-full p-2 transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {NODE_PALETTE.map((item) => (
                  <div
                    key={item.type}
                    className={`flex gap-4 rounded-xl border p-4 transition-all
                      ${isDark ? 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-700' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}
                    `}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {iconMap[item.type]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[13px] font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                          {item.label}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider
                          ${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-400'}
                        `}>
                          {item.type}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {item.tooltip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t px-6 py-4 text-center ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-100 bg-zinc-50'}`}>
              <p className={`text-[11px] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Tip: Drag any component from the left sidebar onto the canvas to start building.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
