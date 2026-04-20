import type { Automation, SimulationLog, FlowNode } from '@/types';

// ── GET /automations ────────────────────────────────────────────────────
const automations: Automation[] = [
  { id: 'email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'doc', label: 'Generate Document', params: ['template', 'format'] },
  { id: 'slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'webhook', label: 'Trigger Webhook', params: ['url', 'method'] },
  { id: 'db', label: 'Database Query', params: ['query', 'database'] },
];

export async function fetchAutomations(): Promise<Automation[]> {
  await delay(300);
  return automations;
}

// ── POST /simulate ──────────────────────────────────────────────────────
export async function simulateWorkflow(nodes: FlowNode[]): Promise<SimulationLog[]> {
  const logs: SimulationLog[] = [];

  for (let i = 0; i < nodes.length; i++) {
    await delay(500 + Math.random() * 300);
    const node = nodes[i];
    const data = node.data;

    logs.push({
      id: `log-${Date.now()}-${i}`,
      timestamp: new Date().toISOString(),
      nodeId: node.id,
      nodeLabel: data.label,
      message: getSimMessage(data.type, data.label),
      level: Math.random() > 0.85 ? 'warning' : 'success',
    });
  }

  logs.push({
    id: `log-${Date.now()}-done`,
    timestamp: new Date().toISOString(),
    nodeId: 'system',
    nodeLabel: 'System',
    message: '✓ Workflow simulation completed successfully',
    level: 'info',
  });

  return logs;
}

function getSimMessage(type: string, label: string): string {
  const msgs: Record<string, string> = {
    start: `→ Workflow initiated from "${label}"`,
    task: `⚡ Task "${label}" executed`,
    approval: `✓ Approval "${label}" granted`,
    automated: `⚙ Automation "${label}" triggered`,
    condition: `⑂ Condition "${label}" evaluated → true`,
    delay: `⏳ Delay "${label}" waited`,
    notification: `🔔 Notification "${label}" sent`,
    loop: `↻ Loop "${label}" completed iteration`,
    end: `■ Workflow completed at "${label}"`,
  };
  return msgs[type] || `Processed "${label}"`;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
