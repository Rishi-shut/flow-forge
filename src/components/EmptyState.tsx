import { motion } from 'framer-motion';
import { Workflow, MousePointerClick } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center text-center"
      >
        {/* Animated icon */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(99, 102, 241, 0)',
              '0 0 0 20px rgba(99, 102, 241, 0.05)',
              '0 0 0 40px rgba(99, 102, 241, 0)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/[0.06]"
        >
          <Workflow size={36} className="text-indigo-400/60" />
        </motion.div>

        <h3 className="text-lg font-semibold text-white/40">
          Start building your workflow
        </h3>
        <p className="mt-2 max-w-xs text-sm text-white/20 leading-relaxed">
          Drag components from the sidebar onto the canvas, then connect them to create your automation pipeline.
        </p>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 flex items-center gap-2 text-xs text-white/15"
        >
          <MousePointerClick size={14} />
          Drag & Drop
        </motion.div>
      </motion.div>
    </div>
  );
}
