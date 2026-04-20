import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';
import type {
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  FlowNodeData,
} from '@/types';

export default function Inspector() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData, deleteNode, theme } =
    useWorkflowStore();
  const { automations } = useAutomations();
  const isDark = theme === 'dark';

  const node = nodes.find((n) => n.id === selectedNodeId);

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            absolute right-0 top-0 z-30 flex h-full w-80 flex-col border-l transition-colors
            ${isDark ? 'border-slate-800 bg-slate-900/98' : 'border-slate-200 bg-white/98'}
          `}
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Inspector
              </h3>
              <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {node.data.type} node
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  deleteNode(node.id);
                  setSelectedNodeId(null);
                }}
                className={`rounded-md p-1.5 transition-colors ${isDark ? 'text-red-400/60 hover:bg-red-900/20 hover:text-red-400' : 'text-red-400/60 hover:bg-red-50 hover:text-red-500'}`}
                id="delete-node-btn"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className={`rounded-md p-1.5 transition-colors ${isDark ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                id="close-inspector-btn"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <Field label="Label" value={node.data.label} onChange={(v) => updateNodeData(node.id, { label: v })} isDark={isDark} />

            {node.data.type === 'task' && (
              <TaskFields data={node.data as TaskNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />
            )}
            {node.data.type === 'approval' && (
              <ApprovalFields data={node.data as ApprovalNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />
            )}
            {node.data.type === 'automated' && (
              <AutomatedFields data={node.data as AutomatedNodeData} automations={automations} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />
            )}
          </div>

          {/* Footer */}
          <div className={`border-t px-4 py-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              ID: {node.id}
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ── Field Components ────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  isDark,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  isDark: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
          ${isDark
            ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-blue-600'
            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:border-blue-500'
          }
        `}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isDark: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={label}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors resize-none
          ${isDark
            ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-blue-600'
            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:border-blue-500'
          }
        `}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isDark: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
          ${isDark
            ? 'border-slate-700 bg-slate-800 text-slate-200 focus:border-blue-600'
            : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-500'
          }
        `}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Type-specific field groups ──────────────────────────────────────────
function TaskFields({ data, onChange, isDark }: { data: TaskNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <Field label="Title" value={data.title} onChange={(v) => onChange({ title: v })} isDark={isDark} />
      <TextArea label="Description" value={data.description} onChange={(v) => onChange({ description: v })} isDark={isDark} />
      <Field label="Assignee" value={data.assignee} onChange={(v) => onChange({ assignee: v })} placeholder="@username" isDark={isDark} />
      <Field label="Due Date" value={data.dueDate} onChange={(v) => onChange({ dueDate: v })} type="date" isDark={isDark} />
    </>
  );
}

function ApprovalFields({ data, onChange, isDark }: { data: ApprovalNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <SelectField
        label="Role"
        value={data.role}
        onChange={(v) => onChange({ role: v })}
        options={[
          { value: 'manager', label: 'Manager' },
          { value: 'director', label: 'Director' },
          { value: 'admin', label: 'Admin' },
          { value: 'team-lead', label: 'Team Lead' },
        ]}
        isDark={isDark}
      />
      <Field label="Threshold" value={data.threshold} onChange={(v) => onChange({ threshold: parseInt(v) || 0 })} type="number" isDark={isDark} />
    </>
  );
}

function AutomatedFields({
  data,
  automations,
  onChange,
  isDark,
}: {
  data: AutomatedNodeData;
  automations: { id: string; label: string; params: string[] }[];
  onChange: (d: Partial<FlowNodeData>) => void;
  isDark: boolean;
}) {
  const selected = automations.find((a) => a.id === data.automationId);
  return (
    <>
      <SelectField
        label="Automation"
        value={data.automationId}
        onChange={(v) => onChange({ automationId: v, params: {} })}
        options={[
          { value: '', label: 'Select action…' },
          ...automations.map((a) => ({ value: a.id, label: a.label })),
        ]}
        isDark={isDark}
      />
      {selected?.params.map((param) => (
        <Field
          key={param}
          label={param}
          value={data.params[param] || ''}
          onChange={(v) => onChange({ params: { ...data.params, [param]: v } })}
          isDark={isDark}
        />
      ))}
    </>
  );
}
