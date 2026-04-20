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
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const connection = useConnection();
  const isConnecting = connection.inProgress;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => setSelectedNodeId(id)}
      className="group relative"
    >
      {/* Glow ring on selection */}
      {selected && (
        <motion.div
          layoutId="node-glow"
          className="absolute -inset-1 rounded-2xl opacity-40 blur-md"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />
      )}

      <div
        className={`
          relative min-w-[180px] rounded-2xl border backdrop-blur-xl
          transition-all duration-200
          ${selected
            ? 'border-white/30 shadow-lg shadow-black/10'
            : 'border-white/10 shadow-md shadow-black/5 hover:border-white/20 hover:shadow-lg'
          }
        `}
        style={{
          background: `linear-gradient(135deg, ${color}12 0%, rgba(15,15,20,0.85) 100%)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: `${color}30` }}
          >
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white/90">{label}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              {type}
            </span>
          </div>
          <div
            className="ml-auto h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Body (optional extra content) */}
        {children && (
          <div className="border-t border-white/5 px-4 py-2.5 text-xs text-white/60">
            {children}
          </div>
        )}
      </div>

      {/* Handles with glow */}
      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className={`!h-3 !w-3 !rounded-full !border-2 !bg-gray-900 transition-all
            ${isConnecting ? '!border-indigo-400 !shadow-[0_0_8px_rgba(99,102,241,0.6)]' : '!border-white/30'}
          `}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={`!h-3 !w-3 !rounded-full !border-2 !bg-gray-900 transition-all
            ${isConnecting ? '!border-indigo-400 !shadow-[0_0_8px_rgba(99,102,241,0.6)]' : '!border-white/30'}
          `}
        />
      )}
    </motion.div>
  );
}

export default memo(BaseNode);
