import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';
import type { TaskNodeData, ApprovalNodeData, AutomatedNodeData, FlowNodeData } from '@/types';

export default function Inspector() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData, deleteNode } =
    useWorkflowStore();
  const { automations } = useAutomations();

  const node = nodes.find((n) => n.id === selectedNodeId);

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 z-30 flex h-full w-80 flex-col border-l border-white/[0.06] bg-[#0c0c10]/95 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-white/90">Node Inspector</h3>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mt-0.5">
                {node.data.type}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  deleteNode(node.id);
                  setSelectedNodeId(null);
                }}
                className="rounded-lg p-1.5 text-red-400/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                id="delete-node-btn"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                id="close-inspector-btn"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Common: Label */}
            <Field
              label="Label"
              value={node.data.label}
              onChange={(v) => updateNodeData(node.id, { label: v })}
            />

            {/* Type-specific fields */}
            {node.data.type === 'task' && (
              <TaskFields
                data={node.data as TaskNodeData}
                onChange={(d) => updateNodeData(node.id, d)}
              />
            )}
            {node.data.type === 'approval' && (
              <ApprovalFields
                data={node.data as ApprovalNodeData}
                onChange={(d) => updateNodeData(node.id, d)}
              />
            )}
            {node.data.type === 'automated' && (
              <AutomatedFields
                data={node.data as AutomatedNodeData}
                automations={automations}
                onChange={(d) => updateNodeData(node.id, d)}
              />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ── Reusable Field ──────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 transition-colors focus:border-indigo-500/40 focus:bg-white/[0.05]"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={label}
        className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 transition-colors focus:border-indigo-500/40 focus:bg-white/[0.05] resize-none"
      />
    </div>
  );
}

// ── Task Fields ─────────────────────────────────────────────────────────
function TaskFields({
  data,
  onChange,
}: {
  data: TaskNodeData;
  onChange: (d: Partial<FlowNodeData>) => void;
}) {
  return (
    <>
      <Field label="Title" value={data.title} onChange={(v) => onChange({ title: v })} />
      <TextArea label="Description" value={data.description} onChange={(v) => onChange({ description: v })} />
      <Field label="Assignee" value={data.assignee} onChange={(v) => onChange({ assignee: v })} placeholder="@username" />
      <Field label="Due Date" value={data.dueDate} onChange={(v) => onChange({ dueDate: v })} type="date" />
    </>
  );
}

// ── Approval Fields ─────────────────────────────────────────────────────
function ApprovalFields({
  data,
  onChange,
}: {
  data: ApprovalNodeData;
  onChange: (d: Partial<FlowNodeData>) => void;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Role
        </label>
        <select
          value={data.role}
          onChange={(e) => onChange({ role: e.target.value })}
          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition-colors focus:border-indigo-500/40"
        >
          <option value="manager">Manager</option>
          <option value="director">Director</option>
          <option value="admin">Admin</option>
          <option value="team-lead">Team Lead</option>
        </select>
      </div>
      <Field
        label="Threshold"
        value={data.threshold}
        onChange={(v) => onChange({ threshold: parseInt(v) || 0 })}
        type="number"
      />
    </>
  );
}

// ── Automated Fields ────────────────────────────────────────────────────
function AutomatedFields({
  data,
  automations,
  onChange,
}: {
  data: AutomatedNodeData;
  automations: { id: string; label: string; params: string[] }[];
  onChange: (d: Partial<FlowNodeData>) => void;
}) {
  const selected = automations.find((a) => a.id === data.automationId);

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Automation
        </label>
        <select
          value={data.automationId}
          onChange={(e) =>
            onChange({ automationId: e.target.value, params: {} })
          }
          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition-colors focus:border-indigo-500/40"
        >
          <option value="">Select action...</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {selected?.params.map((param) => (
        <Field
          key={param}
          label={param}
          value={data.params[param] || ''}
          onChange={(v) =>
            onChange({ params: { ...data.params, [param]: v } })
          }
        />
      ))}
    </>
  );
}
