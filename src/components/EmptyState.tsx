import { motion } from 'framer-motion';
import { Workflow, MousePointerClick } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function EmptyState() {
  const isDark = useWorkflowStore((s) => s.theme) === 'dark';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border
            ${isDark
              ? 'border-slate-800 bg-slate-800/50'
              : 'border-slate-200 bg-white shadow-sm'
            }
          `}
        >
          <Workflow size={28} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
        </motion.div>

        <h3 className={`text-base font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Start building your workflow
        </h3>
        <p className={`mt-1.5 max-w-[260px] text-sm leading-relaxed ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Drag components from the sidebar onto the canvas to begin.
        </p>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className={`mt-5 flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-700' : 'text-slate-300'}`}
        >
          <MousePointerClick size={13} />
          Drag & drop
        </motion.div>
      </motion.div>
    </div>
  );
}
