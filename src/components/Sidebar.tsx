import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  Square,
  GripVertical,
} from 'lucide-react';
import { NODE_PALETTE } from '@/nodes/nodeConfig';
import { useWorkflowStore } from '@/store/workflowStore';
import type { FlowNodeType } from '@/types';

const iconMap: Record<FlowNodeType, React.ReactNode> = {
  start: <Play size={16} />,
  task: <ClipboardList size={16} />,
  approval: <ShieldCheck size={16} />,
  automated: <Zap size={16} />,
  end: <Square size={14} />,
};

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, theme } = useWorkflowStore();
  const isDark = theme === 'dark';

  const onDragStart = (event: React.DragEvent, nodeType: FlowNodeType) => {
    event.dataTransfer.setData('application/flowforge-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 250 : 52 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          relative z-20 flex flex-col border-r transition-colors
          ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}
        `}
      >
        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className={`flex h-12 items-center justify-center border-b transition-colors
            ${isDark
              ? 'border-slate-800 text-slate-500 hover:text-slate-300'
              : 'border-slate-200 text-slate-400 hover:text-slate-600'
            }
          `}
          id="sidebar-toggle"
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        {/* Node list */}
        <div className="flex-1 overflow-y-auto p-2">
          {sidebarOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em]
                ${isDark ? 'text-slate-600' : 'text-slate-400'}
              `}
            >
              Components
            </motion.p>
          )}

          <div className="flex flex-col gap-1">
            {NODE_PALETTE.map((item) => (
              <motion.div
                key={item.type}
                draggable
                onDragStart={(e) =>
                  onDragStart(e as unknown as React.DragEvent, item.type)
                }
                whileHover={{ x: sidebarOpen ? 2 : 0 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  group flex cursor-grab items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-all active:cursor-grabbing
                  ${isDark
                    ? 'border-transparent hover:border-slate-700 hover:bg-slate-800/60'
                    : 'border-transparent hover:border-slate-200 hover:bg-white'
                  }
                  ${!sidebarOpen ? 'justify-center px-0' : ''}
                `}
              >
                {/* Drag grip */}
                {sidebarOpen && (
                  <GripVertical
                    size={12}
                    className={`shrink-0 opacity-0 transition-opacity group-hover:opacity-50 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                  />
                )}

                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {iconMap[item.type]}
                </div>

                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col min-w-0"
                  >
                    <span className={`text-[13px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {item.description}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`border-t px-3 py-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
          >
            <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Drag onto canvas to add
            </p>
          </motion.div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
