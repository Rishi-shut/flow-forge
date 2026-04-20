import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  Square,
  GitBranch,
  Clock,
  Bell,
  Repeat,
  Info,
} from 'lucide-react';
import { NODE_PALETTE } from '@/nodes/nodeConfig';
import { useWorkflowStore } from '@/store/workflowStore';
import type { FlowNodeType } from '@/types';

const iconMap: Record<FlowNodeType, React.ReactNode> = {
  start: <Play size={15} />,
  task: <ClipboardList size={15} />,
  approval: <ShieldCheck size={15} />,
  automated: <Zap size={15} />,
  condition: <GitBranch size={15} />,
  delay: <Clock size={15} />,
  notification: <Bell size={15} />,
  loop: <Repeat size={15} />,
  end: <Square size={13} />,
};

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, theme } = useWorkflowStore();
  const isDark = theme === 'dark';
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const onDragStart = (event: React.DragEvent, nodeType: FlowNodeType) => {
    event.dataTransfer.setData('application/flowforge-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 52 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        relative z-20 flex flex-col border-r transition-colors shrink-0
        ${isDark ? 'border-zinc-800/80 bg-zinc-900/95' : 'border-zinc-200 bg-zinc-50/95'}
        max-sm:absolute max-sm:h-full max-sm:shadow-2xl
      `}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className={`flex h-[60px] items-center justify-center border-b transition-colors
          ${isDark
            ? 'border-zinc-800/80 text-zinc-500 hover:bg-zinc-800/20 hover:text-zinc-300'
            : 'border-zinc-200 text-zinc-400 hover:bg-zinc-200/20 hover:text-zinc-600'
          }
        `}
        id="sidebar-toggle"
      >
        {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
      </button>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto p-1.5">
        {sidebarOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-1.5 px-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em]
              ${isDark ? 'text-zinc-600' : 'text-zinc-400'}
            `}
          >
            Components
          </motion.p>
        )}

        <div className="flex flex-col gap-0.5">
          {NODE_PALETTE.map((item) => (
            <div key={item.type} className="relative">
              <motion.div
                draggable
                onDragStart={(e) =>
                  onDragStart(e as unknown as React.DragEvent, item.type)
                }
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHoveredTooltip(item.type)}
                onHoverEnd={() => setHoveredTooltip(null)}
                className={`
                  group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-all active:scale-[0.98]
                  ${isDark
                    ? 'hover:bg-zinc-800/80 active:bg-zinc-800'
                    : 'hover:bg-white hover:shadow-md hover:ring-1 hover:ring-zinc-200 active:shadow-sm'
                  }
                  ${!sidebarOpen ? 'justify-center mx-1.5' : 'mx-2'}
                `}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {iconMap[item.type]}
                </div>

                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-1 items-center justify-between min-w-0"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[12px] font-bold tracking-tight ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {item.label}
                      </span>
                      <span className={`text-[11px] font-medium leading-tight ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {item.description}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTooltip === item.type && sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -4, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-full top-0 z-50 ml-2 w-56 rounded-lg border p-3 shadow-xl
                      ${isDark
                        ? 'border-zinc-700 bg-zinc-800/95 shadow-black/40'
                        : 'border-zinc-200 bg-white/95 shadow-zinc-200/80'
                      }
                    `}
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded"
                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                      >
                        {iconMap[item.type]}
                      </div>
                      <span className={`text-[12px] font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {item.tooltip}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed tooltip (icon only) */}
              <AnimatePresence>
                {hoveredTooltip === item.type && !sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.12 }}
                    className={`absolute left-full top-1/2 -translate-y-1/2 z-50 ml-2 w-52 rounded-lg border p-3 shadow-lg
                      ${isDark
                        ? 'border-zinc-700 bg-zinc-800 shadow-black/30'
                        : 'border-zinc-200 bg-white shadow-zinc-200/60'
                      }
                    `}
                  >
                    <p className={`text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {item.tooltip}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`border-t px-3 py-2 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}
        >
          <p className={`text-[10px] ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
            Drag onto canvas · Hover for info
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
}
