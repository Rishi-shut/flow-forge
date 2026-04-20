import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';
import type {
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  ConditionNodeData,
  DelayNodeData,
  NotificationNodeData,
  LoopNodeData,
  FlowNodeData,
} from '@/types';

export default function Inspector() {
  const {
    nodes, edges,
    selectedNodeId, selectedEdgeId,
    setSelectedNodeId, setSelectedEdgeId,
    updateNodeData, deleteNode, deleteEdge,
    theme
  } = useWorkflowStore();
  const { automations } = useAutomations();
  const isDark = theme === 'dark';
  const node = nodes.find((n) => n.id === selectedNodeId);
  const edge = edges.find((e) => e.id === selectedEdgeId);

  return (
    <AnimatePresence mode="wait">
      {node && (
        <motion.aside
          key="node-inspector"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            absolute right-0 top-0 z-30 flex h-full w-72 sm:w-80 flex-col border-l transition-colors
            ${isDark ? 'border-zinc-800/80 bg-zinc-900/98' : 'border-zinc-200 bg-zinc-50/98'}
          `}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Header */}
          <div className={`flex h-[60px] shrink-0 items-center justify-between border-b px-4 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
            <div className="min-w-0">
              <h3 className={`text-[12px] font-bold tracking-tight truncate ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>Inspector</h3>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 truncate ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {node.data.type} node
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { deleteNode(node.id); setSelectedNodeId(null); }}
                className={`rounded-lg p-1.5 transition-all active:scale-90 ${isDark ? 'text-red-400/60 hover:bg-red-500/10 hover:text-red-400' : 'text-red-400/40 hover:bg-red-50 hover:text-red-500'}`}
                id="delete-node-btn"
                title="Delete Node"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className={`rounded-lg p-2 transition-all active:scale-90 ${isDark ? 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}`}
                id="close-inspector-btn"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <Field label="Label" value={node.data.label} onChange={(v) => updateNodeData(node.id, { label: v })} isDark={isDark} />

            {node.data.type === 'task' && <TaskFields data={node.data as TaskNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'approval' && <ApprovalFields data={node.data as ApprovalNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'automated' && <AutomatedFields data={node.data as AutomatedNodeData} automations={automations} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'condition' && <ConditionFields data={node.data as ConditionNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'delay' && <DelayFields data={node.data as DelayNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'notification' && <NotificationFields data={node.data as NotificationNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
            {node.data.type === 'loop' && <LoopFields data={node.data as LoopNodeData} onChange={(d) => updateNodeData(node.id, d)} isDark={isDark} />}
          </div>

          <div className={`border-t px-4 py-2.5 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
            <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>ID: {node.id}</p>
          </div>
        </motion.aside>
      )}

      {edge && (
        <motion.aside
          key="edge-inspector"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            absolute right-0 top-0 z-30 flex h-full w-72 sm:w-80 flex-col border-l transition-colors
            ${isDark ? 'border-zinc-800/80 bg-zinc-900/98' : 'border-zinc-200 bg-zinc-50/98'}
          `}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Header */}
          <div className={`flex h-[60px] shrink-0 items-center justify-between border-b px-4 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
            <div className="min-w-0">
              <h3 className={`text-[12px] font-bold tracking-tight truncate ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>Connection</h3>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 truncate ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Flow Edge
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedEdgeId(null)}
                className={`rounded-lg p-2 transition-all active:scale-90 ${isDark ? 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}`}
                id="close-inspector-btn"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Source Node</label>
                <div className={`p-3 rounded-lg border text-xs font-medium font-mono ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-600'}`}>
                  {nodes.find(n => n.id === edge.source)?.data.label || edge.source}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Target Node</label>
                <div className={`p-3 rounded-lg border text-xs font-medium font-mono ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-600'}`}>
                  {nodes.find(n => n.id === edge.target)?.data.label || edge.target}
                </div>
              </div>
            </div>

            <button
              onClick={() => { deleteEdge(edge.id); setSelectedEdgeId(null); }}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all active:scale-[0.98]
                ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}
              `}
              id="delete-edge-btn"
            >
              <Trash2 size={14} />
              Delete Connection
            </button>
          </div>

          <div className={`border-t px-4 py-2.5 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
            <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>Edge ID: {edge.id}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ── Shared Fields ───────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder, isDark }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; isDark: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || label}
        className={`w-full rounded-lg border px-3 py-2 text-[13px] outline-none transition-all duration-200
          ${isDark 
            ? 'border-zinc-800 bg-zinc-900 shadow-inner text-zinc-200 placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5' 
            : 'border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5'}
        `}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, isDark }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; }) {
  return (
    <div className="space-y-1">
      <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{label}</label>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={label}
        className={`w-full rounded-md border px-2.5 py-1.5 text-[13px] outline-none transition-colors resize-none
          ${isDark ? 'border-zinc-800 bg-zinc-800/60 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600' : 'border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400'}
        `}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, isDark }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; isDark: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{label}</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border px-2.5 py-1.5 text-[13px] outline-none transition-colors
          ${isDark ? 'border-zinc-800 bg-zinc-800/60 text-zinc-200 focus:border-zinc-600' : 'border-zinc-200 bg-white text-zinc-700 focus:border-zinc-400'}
        `}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Type-specific fields ────────────────────────────────────────────────
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
      <SelectField label="Role" value={data.role} onChange={(v) => onChange({ role: v })} options={[
        { value: 'manager', label: 'Manager' }, { value: 'director', label: 'Director' }, { value: 'admin', label: 'Admin' }, { value: 'team-lead', label: 'Team Lead' },
      ]} isDark={isDark} />
      <Field label="Threshold" value={data.threshold} onChange={(v) => onChange({ threshold: parseInt(v) || 0 })} type="number" isDark={isDark} />
    </>
  );
}

function AutomatedFields({ data, automations, onChange, isDark }: {
  data: AutomatedNodeData; automations: { id: string; label: string; params: string[] }[]; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean;
}) {
  const selected = automations.find((a) => a.id === data.automationId);
  return (
    <>
      <SelectField label="Automation" value={data.automationId} onChange={(v) => onChange({ automationId: v, params: {} })} options={[
        { value: '', label: 'Select action…' }, ...automations.map((a) => ({ value: a.id, label: a.label })),
      ]} isDark={isDark} />
      {selected?.params.map((param) => (
        <Field key={param} label={param} value={data.params[param] || ''} onChange={(v) => onChange({ params: { ...data.params, [param]: v } })} isDark={isDark} />
      ))}
    </>
  );
}

function ConditionFields({ data, onChange, isDark }: { data: ConditionNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <Field label="Field" value={data.field} onChange={(v) => onChange({ field: v })} placeholder="e.g. user.role" isDark={isDark} />
      <SelectField label="Operator" value={data.operator} onChange={(v) => onChange({ operator: v })} options={[
        { value: 'equals', label: 'Equals' }, { value: 'not_equals', label: 'Not Equals' }, { value: 'contains', label: 'Contains' },
        { value: 'greater_than', label: 'Greater Than' }, { value: 'less_than', label: 'Less Than' },
      ]} isDark={isDark} />
      <Field label="Value" value={data.value} onChange={(v) => onChange({ value: v })} isDark={isDark} />
    </>
  );
}

function DelayFields({ data, onChange, isDark }: { data: DelayNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <Field label="Duration" value={data.duration} onChange={(v) => onChange({ duration: parseInt(v) || 0 })} type="number" isDark={isDark} />
      <SelectField label="Unit" value={data.unit} onChange={(v) => onChange({ unit: v })} options={[
        { value: 'seconds', label: 'Seconds' }, { value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }, { value: 'days', label: 'Days' },
      ]} isDark={isDark} />
    </>
  );
}

function NotificationFields({ data, onChange, isDark }: { data: NotificationNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <SelectField label="Channel" value={data.channel} onChange={(v) => onChange({ channel: v })} options={[
        { value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'push', label: 'Push Notification' }, { value: 'in-app', label: 'In-App Alert' }, { value: 'slack', label: 'Slack' },
      ]} isDark={isDark} />
      <TextArea label="Message" value={data.message} onChange={(v) => onChange({ message: v })} isDark={isDark} />
    </>
  );
}

function LoopFields({ data, onChange, isDark }: { data: LoopNodeData; onChange: (d: Partial<FlowNodeData>) => void; isDark: boolean }) {
  return (
    <>
      <Field label="Iterations" value={data.iterations} onChange={(v) => onChange({ iterations: parseInt(v) || 0 })} type="number" isDark={isDark} />
      <Field label="Collection" value={data.collection} onChange={(v) => onChange({ collection: v })} placeholder="e.g. items, users" isDark={isDark} />
    </>
  );
}
