import { memo, type ReactNode } from 'react';
import { Handle, Position, useConnection } from '@xyflow/react';
import { motion } from 'framer-motion';
import { getNodeColor } from './nodeConfig';
import { useWorkflowStore } from '@/store/workflowStore';

interface BaseNodeProps {
  id: string;
  type: string;
  label: string;
  icon: ReactNode;
  selected?: boolean;
  children?: ReactNode;
  showSource?: boolean;
  showTarget?: boolean;
}

function BaseNode({ id, type, label, icon, selected, children, showSource = true, showTarget = true }: BaseNodeProps) {
  const color = getNodeColor(type);
  const theme = useWorkflowStore((s) => s.theme);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const connection = useConnection();
  const isConnecting = connection.inProgress;
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onClick={() => setSelectedNodeId(id)}
      className="group relative"
    >
      {selected && (
        <motion.div
          className="absolute -inset-[2px] rounded-[10px] border-[1.5px]"
          style={{ borderColor: `${color}70` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div
        className={`relative min-w-[170px] rounded-lg border transition-all duration-150
          ${isDark
            ? selected
              ? 'border-zinc-600 bg-zinc-800 shadow-lg shadow-black/15'
              : 'border-zinc-700/50 bg-zinc-800/80 shadow-sm hover:border-zinc-600 hover:shadow-md'
            : selected
              ? 'border-zinc-300 bg-white shadow-md shadow-zinc-300/40'
              : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md'
          }
        `}
      >
        {/* Top accent */}
        <div className="h-[2px] rounded-t-lg" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className={`text-[12px] font-bold tracking-tight truncate ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>{label}</span>
            <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-60 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{type}</span>
          </div>
        </div>

        {children && (
          <div className={`border-t px-3 py-1.5 text-[11px] ${isDark ? 'border-zinc-700/40 text-zinc-500' : 'border-zinc-100 text-zinc-500'}`}>
            {children}
          </div>
        )}
      </div>

      {/* Handles */}
      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className={`!-top-[6px] !h-3 !w-3 !rounded-full !border-2 transition-all duration-200
            ${isConnecting
              ? '!border-blue-500 !bg-blue-500 !shadow-[0_0_8px_rgba(59,130,246,0.6)] !scale-[1.5]'
              : isDark
                ? '!border-zinc-700 !bg-zinc-900 hover:!border-blue-500 hover:!bg-blue-500 hover:!scale-[1.4]'
                : '!border-zinc-200 !bg-white hover:!border-blue-500 hover:!bg-blue-500 hover:!scale-[1.4]'
            }
          `}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={`!-bottom-[6px] !h-3 !w-3 !rounded-full !border-2 transition-all duration-200
            ${isConnecting
              ? '!border-blue-500 !bg-blue-500 !shadow-[0_0_8px_rgba(59,130,246,0.6)] !scale-[1.5]'
              : isDark
                ? '!border-zinc-700 !bg-zinc-900 hover:!border-blue-500 hover:!bg-blue-500 hover:!scale-[1.4]'
                : '!border-zinc-200 !bg-white hover:!border-blue-500 hover:!bg-blue-500 hover:!scale-[1.4]'
            }
          `}
        />
      )}
    </motion.div>
  );
}

export default memo(BaseNode);
