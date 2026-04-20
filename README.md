# FlowForge — Visual Workflow Builder

A modern, production-grade workflow builder for designing automation pipelines using a drag-and-drop node-based editor. Built with React, TypeScript, React Flow, Zustand, Framer Motion, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

The app will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
src/
├── api/              # Mock API layer
│   └── mock.ts       # Simulated endpoints for automations & simulation
├── components/       # UI components
│   ├── Canvas.tsx    # Main React Flow canvas
│   ├── EmptyState.tsx# Shown when canvas has no nodes
│   ├── Inspector.tsx # Right panel — dynamic form editor
│   ├── Sidebar.tsx   # Left panel — draggable node palette
│   ├── SimulationConsole.tsx  # Bottom panel — execution logs
│   └── TopBar.tsx    # Top bar — project name, actions, theme toggle
├── hooks/            # Custom React hooks
│   ├── useAutomations.ts  # Fetches available automations
│   └── useSimulation.ts   # Orchestrates simulation lifecycle
├── nodes/            # Custom React Flow node components
│   ├── BaseNode.tsx      # Shared node shell (handles, styling, theming)
│   ├── StartNode.tsx     # Entry point node
│   ├── TaskNode.tsx      # Manual task node
│   ├── ApprovalNode.tsx  # Approval gate node
│   ├── AutomatedNode.tsx # API-driven action node
│   ├── EndNode.tsx       # Terminal node
│   ├── nodeConfig.ts     # Node palette definitions, colors, defaults
│   └── index.ts          # Node type registry for React Flow
├── store/            # Global state management
│   └── workflowStore.ts  # Zustand store for entire app state
├── types/            # TypeScript type definitions
│   └── index.ts      # All interfaces and type aliases
├── App.tsx           # Root component — layout composition
├── main.tsx          # Entry point — React DOM render
├── index.css         # Global styles + React Flow overrides
└── vite-env.d.ts     # Vite type declarations
```

---

## 🧱 Component Guide

### 1. TopBar (`components/TopBar.tsx`)

The top navigation bar contains:

| Element | Description |
|---|---|
| **Logo** | FlowForge branding with icon |
| **Project Name** | Click-to-edit inline text field |
| **Status Badge** | Shows `DRAFT`, `ACTIVE`, or `SIMULATING` |
| **Theme Toggle** | ☀️ / 🌙 button switches between light and dark mode |
| **Export** | Downloads the workflow as a `.json` file |
| **Run** | Sets workflow status to `active` |
| **Simulate** | Triggers step-by-step simulation with console output |

**How it works:** The project name is an inline-editable field (click to type, Enter or blur to save). The status badge animates on state change using Framer Motion. Export serializes the full graph (nodes + edges) to JSON.

---

### 2. Sidebar (`components/Sidebar.tsx`)

The collapsible left panel is the **node palette**. It contains five draggable node types:

| Node Type | Color | Purpose |
|---|---|---|
| **Start** | Green | Entry point — every workflow begins here |
| **Task** | Blue | A manual task assigned to a person |
| **Approval** | Amber | A decision gate requiring sign-off |
| **Automated** | Purple | An API-driven automated action |
| **End** | Red | Terminates the workflow |

**How it works:**
1. Each item uses the HTML Drag and Drop API.
2. On `dragstart`, the node type is stored in `dataTransfer`.
3. The Canvas component listens for `drop` events and creates a new node at the drop position.
4. The sidebar can be collapsed to icon-only mode using the toggle button at the top.
5. A drag grip icon (⠿) appears on hover to indicate draggability.

---

### 3. Canvas (`components/Canvas.tsx`)

The **centerpiece** of the app. An infinite, pannable, zoomable canvas powered by React Flow.

**Features:**
- **Snap to grid**: Nodes snap to a 16×16 grid for clean alignment.
- **Drag & drop**: Drop nodes from the sidebar to create them.
- **Connect nodes**: Drag from a node's bottom handle to another node's top handle.
- **Loose connections**: Uses `ConnectionMode.Loose` — you can start connections from anywhere near a handle, making it much easier to connect nodes.
- **Connection preview**: A blue line shows where the connection will go while dragging.
- **Select & inspect**: Click a node to open the Inspector panel.
- **Deselect**: Click empty canvas to close the Inspector.
- **MiniMap**: Shows a bird's-eye view of the graph in the bottom-right.
- **Controls**: Zoom in/out/fit buttons in the bottom-left.

**How nodes are created:**
```
Sidebar dragstart → stores node type
Canvas onDragOver → prevents default
Canvas onDrop → reads type → converts screen coords to flow coords → creates node
```

---

### 4. Inspector (`components/Inspector.tsx`)

The **right panel** slides in when you click a node. It shows a dynamic form based on the node type.

**Common fields (all nodes):**
- **Label** — The display name shown on the node

**Task node fields:**
- Title, Description, Assignee (`@username`), Due Date (date picker)

**Approval node fields:**
- Role (dropdown: Manager, Director, Admin, Team Lead)
- Threshold (number — how many approvals needed)

**Automated node fields:**
- Automation (dropdown — populated from mock API)
- Dynamic parameter fields (appear based on selected automation)

**How it works:**
- The Inspector reads `selectedNodeId` from the store.
- It finds the corresponding node and renders the appropriate form.
- Each field calls `updateNodeData()` on change, which updates the node in the graph.
- Changes are **live** — the node preview on the canvas updates immediately.
- The delete button removes the node and all connected edges.

---

### 5. Simulation Console (`components/SimulationConsole.tsx`)

A toggleable bottom panel that shows execution logs during simulation.

**How simulation works:**
1. Click **Simulate** in the TopBar.
2. The console panel opens automatically.
3. Each node is processed sequentially with a simulated delay (600-1000ms).
4. Logs appear one by one with animated entry.
5. Each log has a timestamp, level (INFO/SUCCESS/WARNING), and message.
6. A pulsing dot in the console tab indicates active simulation.

**Log levels:**
| Level | Color | Meaning |
|---|---|---|
| `INFO` | Blue | System messages |
| `SUCCESS` | Green | Node processed successfully |
| `WARNING` | Amber | Non-critical issue (random ~15% chance) |
| `ERROR` | Red | Critical failure |

---

### 6. EmptyState (`components/EmptyState.tsx`)

Shown when the canvas has no nodes. Displays:
- An animated workflow icon with a subtle breathing animation
- "Start building your workflow" heading
- Instructions to drag components from the sidebar
- A bouncing "Drag & drop" hint

Automatically hides when the first node is added.

---

### 7. Base Node (`nodes/BaseNode.tsx`)

The **shared visual shell** for all node types. All five node types (Start, Task, Approval, Automated, End) use this component but pass in their own icon, children, and handle configuration.

**Visual anatomy of a node:**
```
┌─────────────────────┐
│ ████████████████████ │ ← Colored accent bar (matches node type)
│ [icon] Label        │ ← Header with icon, name, type badge
│        TYPE         │
│─────────────────────│
│ Preview content     │ ← Optional body (e.g., assignee, role)
└─────────────────────┘
     ● (handle)          ← Connection point
```

**Connection handles:**
- **Top handle** = input (target) — accepts incoming connections
- **Bottom handle** = output (source) — creates outgoing connections
- Start nodes have **no top handle** (nothing connects into them)
- End nodes have **no bottom handle** (nothing goes out)
- Handles glow blue and enlarge when a connection is being dragged (visual feedback)

---

## 🔧 State Management

All state lives in a single **Zustand store** (`store/workflowStore.ts`).

| State Group | Fields | Purpose |
|---|---|---|
| **Graph** | `nodes`, `edges` | The workflow graph data |
| **Selection** | `selectedNodeId` | Which node's inspector is open |
| **UI** | `sidebarOpen`, `consoleOpen`, `theme` | Panel visibility & theme |
| **Meta** | `projectName`, `status` | Workflow metadata |
| **Simulation** | `simulationLogs`, `isSimulating` | Console log data |

**Key actions:**
- `onNodesChange` / `onEdgesChange` — React Flow change handlers
- `onConnect` — Creates a new edge when two nodes are connected
- `addNode` — Adds a dropped node to the graph
- `updateNodeData` — Updates a node's form data from the Inspector
- `deleteNode` — Removes a node and all its edges
- `toggleTheme` — Switches between light and dark mode
- `serialize` — Exports the full graph as JSON

---

## 🔌 Mock API

The app includes a mock API layer (`api/mock.ts`) that simulates backend calls.

### `GET /automations`
Returns available automation actions:
```json
[
  { "id": "email", "label": "Send Email", "params": ["to", "subject", "body"] },
  { "id": "doc", "label": "Generate Document", "params": ["template", "format"] },
  { "id": "slack", "label": "Send Slack Message", "params": ["channel", "message"] },
  { "id": "webhook", "label": "Trigger Webhook", "params": ["url", "method"] },
  { "id": "db", "label": "Database Query", "params": ["query", "database"] }
]
```

### `POST /simulate`
Processes each node sequentially with simulated delay. Returns execution logs.

---

## 🎨 Theming

The app supports **light** and **dark** modes. Toggle with the sun/moon button in the top bar.

| Element | Dark Mode | Light Mode |
|---|---|---|
| Background | `slate-950` | `slate-100` |
| Surfaces | `slate-900` | `white` |
| Borders | `slate-800` | `slate-200` |
| Text | `slate-200` | `slate-700` |
| Canvas dots | Faint white | Faint gray |

Theme state is stored in Zustand and also set as a `data-theme` attribute on `<html>` for CSS access.

---

## ⌨️ Keyboard & Interactions

| Action | How |
|---|---|
| Add a node | Drag from sidebar → drop on canvas |
| Connect two nodes | Drag from source handle (bottom dot) → target handle (top dot) |
| Select a node | Click on it (opens Inspector) |
| Deselect | Click on empty canvas |
| Delete a node | Select it → click trash icon in Inspector |
| Delete an edge | Click on it → press Delete/Backspace |
| Pan canvas | Click and drag on empty canvas |
| Zoom | Scroll wheel or use +/- controls |
| Edit project name | Click the name in the top bar |
| Toggle sidebar | Click the panel toggle button |
| Toggle console | Click "Console" at the bottom |
| Export workflow | Click "Export" in the top bar |

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **TypeScript** | 5.7 | Type safety |
| **Vite** | 6 | Build tool & dev server |
| **React Flow** | 12 | Node graph / canvas system |
| **Zustand** | 5 | Lightweight state management |
| **Framer Motion** | 12 | Animations & transitions |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Lucide React** | Latest | Icon library |

---

## 📄 License

MIT