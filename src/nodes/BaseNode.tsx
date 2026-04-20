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
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[12px] font-medium leading-tight truncate ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>{label}</span>
            <span className={`text-[9px] font-medium uppercase tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{type}</span>
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
          className={`!-top-[5px] !h-2.5 !w-2.5 !rounded-full !border-[1.5px] transition-all duration-150
            ${isConnecting
              ? '!border-blue-400 !bg-blue-400 !shadow-[0_0_6px_rgba(96,165,250,0.5)] !scale-[1.4]'
              : isDark
                ? '!border-zinc-600 !bg-zinc-800 hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-[1.3]'
                : '!border-zinc-300 !bg-white hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-[1.3]'
            }
          `}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={`!-bottom-[5px] !h-2.5 !w-2.5 !rounded-full !border-[1.5px] transition-all duration-150
            ${isConnecting
              ? '!border-blue-400 !bg-blue-400 !shadow-[0_0_6px_rgba(96,165,250,0.5)] !scale-[1.4]'
              : isDark
                ? '!border-zinc-600 !bg-zinc-800 hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-[1.3]'
                : '!border-zinc-300 !bg-white hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-[1.3]'
            }
          `}
        />
      )}
    </motion.div>
  );
}

export default memo(BaseNode);
