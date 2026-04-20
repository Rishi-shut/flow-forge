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

function BaseNode({
  id,
  type,
  label,
  icon,
  selected,
  children,
  showSource = true,
  showTarget = true,
}: BaseNodeProps) {
  const color = getNodeColor(type);
  const theme = useWorkflowStore((s) => s.theme);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const connection = useConnection();
  const isConnecting = connection.inProgress;

  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onClick={() => setSelectedNodeId(id)}
      className="group relative"
    >
      {/* Subtle selection ring */}
      {selected && (
        <motion.div
          className="absolute -inset-[3px] rounded-xl border-2"
          style={{ borderColor: `${color}80` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div
        className={`
          relative min-w-[190px] rounded-xl border transition-all duration-150
          ${isDark
            ? selected
              ? 'border-slate-600 bg-slate-800/90 shadow-lg shadow-black/20'
              : 'border-slate-700/60 bg-slate-800/70 shadow-md shadow-black/10 hover:border-slate-600 hover:shadow-lg'
            : selected
              ? 'border-slate-300 bg-white shadow-lg shadow-slate-200/60'
              : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
          }
        `}
      >
        {/* Colored top bar */}
        <div className="h-[3px] rounded-t-xl" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[13px] font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {label}
            </span>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {type}
            </span>
          </div>
        </div>

        {/* Body */}
        {children && (
          <div className={`border-t px-3.5 py-2 text-xs ${isDark ? 'border-slate-700/50 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            {children}
          </div>
        )}
      </div>

      {/* Handles — larger hit area for easier connecting */}
      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className={`
            !-top-[6px] !h-3 !w-3 !rounded-full !border-2 transition-all duration-150
            ${isConnecting
              ? `!border-blue-400 !bg-blue-400 !shadow-[0_0_8px_rgba(96,165,250,0.5)] !scale-125`
              : isDark
                ? '!border-slate-500 !bg-slate-700 hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-125'
                : '!border-slate-300 !bg-white hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-125'
            }
          `}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={`
            !-bottom-[6px] !h-3 !w-3 !rounded-full !border-2 transition-all duration-150
            ${isConnecting
              ? `!border-blue-400 !bg-blue-400 !shadow-[0_0_8px_rgba(96,165,250,0.5)] !scale-125`
              : isDark
                ? '!border-slate-500 !bg-slate-700 hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-125'
                : '!border-slate-300 !bg-white hover:!border-blue-400 hover:!bg-blue-400 hover:!scale-125'
            }
          `}
        />
      )}
    </motion.div>
  );
}

export default memo(BaseNode);
