import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  Square,
} from 'lucide-react';
import { NODE_PALETTE } from '@/nodes/nodeConfig';
import { useWorkflowStore } from '@/store/workflowStore';
import type { FlowNodeType } from '@/types';

const iconMap: Record<FlowNodeType, React.ReactNode> = {
  start: <Play size={18} />,
  task: <ClipboardList size={18} />,
  approval: <ShieldCheck size={18} />,
  automated: <Zap size={18} />,
  end: <Square size={16} />,
};

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useWorkflowStore();

  const onDragStart = (
    event: React.DragEvent,
    nodeType: FlowNodeType
  ) => {
    event.dataTransfer.setData('application/flowforge-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-20 flex flex-col border-r border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl"
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="flex h-14 items-center justify-center border-b border-white/[0.06] text-white/50 transition-colors hover:text-white"
          id="sidebar-toggle"
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        {/* Node list */}
        <div className="flex-1 overflow-y-auto p-2">
          {sidebarOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30"
            >
              Components
            </motion.p>
          )}

          <div className="flex flex-col gap-1.5">
            {NODE_PALETTE.map((item) => (
              <motion.div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, item.type)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  group flex cursor-grab items-center gap-3 rounded-xl border border-white/[0.04]
                  bg-white/[0.02] px-3 py-2.5 transition-all
                  hover:border-white/[0.08] hover:bg-white/[0.04]
                  active:cursor-grabbing
                  ${!sidebarOpen ? 'justify-center px-0' : ''}
                `}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <span style={{ color: item.color }}>{iconMap[item.type]}</span>
                </div>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                  >
                    <span className="text-sm font-medium text-white/80">{item.label}</span>
                    <span className="text-[10px] text-white/35">{item.description}</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-white/[0.06] px-4 py-3"
          >
            <p className="text-[10px] text-white/20">Drag to canvas →</p>
          </motion.div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
