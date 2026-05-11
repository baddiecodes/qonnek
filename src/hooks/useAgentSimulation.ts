import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================
   AGENT SIMULATION ENGINE — v3 (perf-optimized)
   Progress interval: 500ms (was 300ms).
   ============================================ */

export type AgentRole = "content" | "research" | "distribution";
export type AgentStatus = "idle" | "thinking" | "working" | "completed" | "payout";

export interface AgentTask {
  id: string;
  label: string;
  startedAt: number;
  duration: number;
}

export interface AgentEvent {
  id: string;
  agentId: AgentRole;
  agentName: string;
  type: "status_change" | "task_start" | "task_complete" | "payout" | "thinking";
  message: string;
  timestamp: number;
  payoutSol?: number;
}

export interface AgentState {
  id: AgentRole;
  name: string;
  emoji: string;
  status: AgentStatus;
  currentTask: AgentTask | null;
  progress: number;
  completedTasks: number;
  totalPayout: number;
  recentAction: string;
  color: "cyan" | "violet" | "emerald";
}

export interface SimulationState {
  agents: AgentState[];
  events: AgentEvent[];
  isRunning: boolean;
  totalPayouts: number;
  totalTasks: number;
}

const CONTENT_TASKS = [
  "Drafting blog post on DeFi yields",
  "Writing Twitter thread on Solana speed",
  "Generating newsletter for Q2 update",
  "Creating product announcement copy",
  "Composing investor update email",
  "Writing docs for new API endpoint",
];

const RESEARCH_TASKS = [
  "Analyzing on-chain TVL metrics",
  "Scanning competitor token launches",
  "Compiling market sentiment report",
  "Auditing smart contract patterns",
  "Tracking whale wallet movements",
  "Benchmarking gas fee trends",
];

const DISTRIBUTION_TASKS = [
  "Scheduling posts across 5 channels",
  "Optimizing email delivery pipeline",
  "A/B testing subject lines",
  "Publishing blog to CMS",
  "Deploying social media campaign",
  "Distributing report to stakeholders",
];

const TASK_POOLS: Record<AgentRole, string[]> = {
  content: CONTENT_TASKS,
  research: RESEARCH_TASKS,
  distribution: DISTRIBUTION_TASKS,
};

const THINKING_MESSAGES: Record<AgentRole, string[]> = {
  content: ["Analyzing tone and audience...", "Reviewing brand guidelines...", "Generating outline structure..."],
  research: ["Querying on-chain data...", "Cross-referencing sources...", "Building data models..."],
  distribution: ["Checking channel availability...", "Optimizing delivery schedule...", "Validating recipient lists..."],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const INITIAL_AGENTS: AgentState[] = [
  { id: "content", name: "Content Agent", emoji: "🖊", status: "idle", currentTask: null, progress: 0, completedTasks: 0, totalPayout: 0, recentAction: "Initializing...", color: "cyan" },
  { id: "research", name: "Research Agent", emoji: "🔬", status: "idle", currentTask: null, progress: 0, completedTasks: 0, totalPayout: 0, recentAction: "Initializing...", color: "violet" },
  { id: "distribution", name: "Distribution Agent", emoji: "📡", status: "idle", currentTask: null, progress: 0, completedTasks: 0, totalPayout: 0, recentAction: "Initializing...", color: "emerald" },
];

export function useAgentSimulation(): SimulationState {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isRunning] = useState(true);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addEvent = useCallback((event: Omit<AgentEvent, "id" | "timestamp">) => {
    setEvents((prev) => [{ ...event, id: uid(), timestamp: Date.now() }, ...prev].slice(0, 40));
  }, []);

  const updateAgent = useCallback(
    (agentId: AgentRole, patch: Partial<AgentState>) => {
      setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, ...patch } : a)));
    },
    []
  );

  const runAgentCycle = useCallback(
    (agentId: AgentRole, agentName: string) => {
      const thinkMsg = pick(THINKING_MESSAGES[agentId]);
      updateAgent(agentId, { status: "thinking", recentAction: thinkMsg, progress: 0 });
      addEvent({ agentId, agentName, type: "thinking", message: thinkMsg });

      const thinkDuration = randomBetween(2000, 4000);

      const thinkTimer = setTimeout(() => {
        const taskLabel = pick(TASK_POOLS[agentId]);
        const taskDuration = randomBetween(6000, 14000);
        const task: AgentTask = { id: uid(), label: taskLabel, startedAt: Date.now(), duration: taskDuration };

        updateAgent(agentId, { status: "working", currentTask: task, progress: 0, recentAction: taskLabel });
        addEvent({ agentId, agentName, type: "task_start", message: taskLabel });

        // Progress at 500ms (was 300ms)
        const progressInterval = setInterval(() => {
          setAgents((prev) =>
            prev.map((a) => {
              if (a.id !== agentId || !a.currentTask) return a;
              const elapsed = Date.now() - a.currentTask.startedAt;
              const pct = Math.min(99, Math.round((elapsed / a.currentTask.duration) * 100));
              return { ...a, progress: pct };
            })
          );
        }, 500);

        const workTimer = setTimeout(() => {
          clearInterval(progressInterval);

          updateAgent(agentId, { status: "completed", progress: 100, recentAction: `Completed: ${taskLabel}` });
          addEvent({ agentId, agentName, type: "task_complete", message: `Completed: ${taskLabel}` });

          const payoutTimer = setTimeout(() => {
            const payoutAmount = parseFloat((Math.random() * 0.008 + 0.002).toFixed(4));

            setAgents((prev) =>
              prev.map((a) =>
                a.id === agentId
                  ? {
                      ...a,
                      status: "payout" as AgentStatus,
                      completedTasks: a.completedTasks + 1,
                      totalPayout: parseFloat((a.totalPayout + payoutAmount).toFixed(4)),
                      recentAction: `Payout: ${payoutAmount} SOL`,
                    }
                  : a
              )
            );

            addEvent({
              agentId, agentName, type: "payout",
              message: `Payout: ${payoutAmount} SOL — CASH (devnet)`,
              payoutSol: payoutAmount,
            });

            const idleTimer = setTimeout(() => {
              updateAgent(agentId, { status: "idle", currentTask: null, progress: 0, recentAction: "Awaiting next task..." });
              const pauseTimer = setTimeout(() => runAgentCycle(agentId, agentName), randomBetween(3000, 8000));
              timersRef.current.set(`${agentId}-pause`, pauseTimer);
            }, 2000);

            timersRef.current.set(`${agentId}-idle`, idleTimer);
          }, 1500);

          timersRef.current.set(`${agentId}-payout`, payoutTimer);
        }, taskDuration);

        timersRef.current.set(`${agentId}-work`, workTimer);
        timersRef.current.set(`${agentId}-progress`, progressInterval as unknown as ReturnType<typeof setTimeout>);
      }, thinkDuration);

      timersRef.current.set(`${agentId}-think`, thinkTimer);
    },
    [updateAgent, addEvent]
  );

  useEffect(() => {
    if (!isRunning) return;
    const startTimers = INITIAL_AGENTS.map((agent, i) =>
      setTimeout(() => runAgentCycle(agent.id, agent.name), i * 2000 + randomBetween(500, 1500))
    );
    return () => {
      startTimers.forEach(clearTimeout);
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const totalPayouts = agents.reduce((sum, a) => sum + a.totalPayout, 0);
  const totalTasks = agents.reduce((sum, a) => sum + a.completedTasks, 0);

  return { agents, events, isRunning, totalPayouts, totalTasks };
}
