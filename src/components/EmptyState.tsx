import { motion } from 'framer-motion';
import { Workflow, MousePointerClick } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function EmptyState() {
  const isDark = useWorkflowStore((s) => s.theme) === 'dark';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border
            ${isDark ? 'border-zinc-800 bg-zinc-800/40' : 'border-zinc-300 bg-zinc-200/50'}
          `}
        >
          <Workflow size={24} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
        </motion.div>

        <h3 className={`text-[15px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Build your workflow
        </h3>
        <p className={`mt-1 max-w-[220px] text-[12px] leading-relaxed ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Drag components from the sidebar to get started.
        </p>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className={`mt-4 flex items-center gap-1 text-[11px] ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}
        >
          <MousePointerClick size={12} />
          Drag & drop
        </motion.div>
      </motion.div>
    </div>
  );
}
