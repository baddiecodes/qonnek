// ==============================================
// QONNEK MOCK DATA
// All mock data for dashboard, agents, treasury
// ==============================================

export type AgentStatus = "active" | "idle" | "offline";

export interface CompletedTask {
  id: string;
  title: string;
  payout: number;
  completedAt: string;
}

export interface PendingPayout {
  id: string;
  taskTitle: string;
  amount: number;
  estimatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  balance: number;
  tasksCompleted: number;
  lastActive: string;
  walletAddress: string;
  earned24h: number;
  avatar: string;
  description: string;
  pendingPayouts: PendingPayout[];
  completedTasks: CompletedTask[];
}

export interface Transaction {
  id: string;
  type: "payment" | "fund" | "yield";
  agentName: string;
  amount: number;
  timestamp: string;
  signature: string;
  status: "confirmed" | "pending";
}

export interface ActivityEvent {
  id: string;
  type: "task_complete" | "payment_sent" | "treasury_fund" | "yield_accrued" | "agent_deployed";
  title: string;
  detail: string;
  timestamp: string;
  agentId?: string;
}

// ---- Agents (3 core agents as specified) ----
export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-content",
    name: "Content Agent",
    type: "Content",
    status: "active",
    balance: 4250,
    tasksCompleted: 187,
    lastActive: "Just now",
    walletAddress: "7xKQ...n3Fp",
    earned24h: 620,
    avatar: "✍️",
    description: "Generates blog posts, social copy, email campaigns, and marketing content on demand.",
    pendingPayouts: [
      { id: "pp-1", taskTitle: "Blog post: Q3 DeFi Trends", amount: 75, estimatedAt: "~2 min" },
      { id: "pp-2", taskTitle: "Twitter thread: Agent Economy", amount: 35, estimatedAt: "~5 min" },
      { id: "pp-3", taskTitle: "Newsletter draft: May edition", amount: 120, estimatedAt: "~8 min" },
    ],
    completedTasks: [
      { id: "ct-1", title: "Landing page copy for Qonnek v2", payout: 150, completedAt: "10 min ago" },
      { id: "ct-2", title: "Email sequence: onboarding flow (5 emails)", payout: 200, completedAt: "45 min ago" },
      { id: "ct-3", title: "Product description: Treasury Dashboard", payout: 85, completedAt: "1 hr ago" },
      { id: "ct-4", title: "Social media calendar: June week 1", payout: 110, completedAt: "2 hrs ago" },
      { id: "ct-5", title: "Whitepaper summary: CASH tokenomics", payout: 75, completedAt: "3 hrs ago" },
    ],
  },
  {
    id: "agent-research",
    name: "Research Agent",
    type: "Research",
    status: "active",
    balance: 3180,
    tasksCompleted: 94,
    lastActive: "1 min ago",
    walletAddress: "4mRe...8kWz",
    earned24h: 410,
    avatar: "🔬",
    description: "Crawls datasets, analyzes competitors, summarizes whitepapers, and delivers structured insights.",
    pendingPayouts: [
      { id: "pp-4", taskTitle: "Competitor analysis: Squads v4", amount: 95, estimatedAt: "~3 min" },
      { id: "pp-5", taskTitle: "Market data: SOL DeFi TVL report", amount: 60, estimatedAt: "~6 min" },
    ],
    completedTasks: [
      { id: "ct-6", title: "Scraped 2,400 records: DEX volume data", payout: 85, completedAt: "5 min ago" },
      { id: "ct-7", title: "Whitepaper analysis: Swig protocol", payout: 120, completedAt: "30 min ago" },
      { id: "ct-8", title: "Competitor feature matrix: 8 products", payout: 95, completedAt: "1.5 hrs ago" },
      { id: "ct-9", title: "Sentiment report: agent economy tweets", payout: 65, completedAt: "3 hrs ago" },
    ],
  },
  {
    id: "agent-distribution",
    name: "Distribution Agent",
    type: "Distribution",
    status: "idle",
    balance: 5020,
    tasksCompleted: 231,
    lastActive: "12 min ago",
    walletAddress: "9pLj...2vQs",
    earned24h: 195,
    avatar: "📡",
    description: "Handles cross-platform publishing, notification dispatch, webhook delivery, and partner API syncs.",
    pendingPayouts: [
      { id: "pp-6", taskTitle: "Publish blog to 4 platforms", amount: 40, estimatedAt: "~1 min" },
    ],
    completedTasks: [
      { id: "ct-10", title: "Syndicated newsletter to 12,000 subscribers", payout: 90, completedAt: "12 min ago" },
      { id: "ct-11", title: "Webhook delivery: 340 partner endpoints", payout: 65, completedAt: "40 min ago" },
      { id: "ct-12", title: "Published 3 posts to Medium, Mirror, X", payout: 40, completedAt: "1.5 hrs ago" },
      { id: "ct-13", title: "API sync: CoinGecko + DeFiLlama data push", payout: 55, completedAt: "2 hrs ago" },
      { id: "ct-14", title: "Notification blast: 8,000 mobile + email", payout: 80, completedAt: "4 hrs ago" },
      { id: "ct-15", title: "Cross-post report to Slack + Discord", payout: 30, completedAt: "5 hrs ago" },
    ],
  },
];

// ---- Transactions (aligned to 3 agents) ----
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "payment", agentName: "Content Agent", amount: 150, timestamp: "10 min ago", signature: "5xNq...3kFp", status: "confirmed" },
  { id: "tx-2", type: "payment", agentName: "Research Agent", amount: 85, timestamp: "30 min ago", signature: "8aPr...9mRz", status: "confirmed" },
  { id: "tx-3", type: "payment", agentName: "Distribution Agent", amount: 90, timestamp: "40 min ago", signature: "2bQs...7jKw", status: "confirmed" },
  { id: "tx-4", type: "fund", agentName: "Treasury", amount: 500, timestamp: "1 hr ago", signature: "9cRt...1nLx", status: "confirmed" },
  { id: "tx-5", type: "payment", agentName: "Content Agent", amount: 200, timestamp: "2 hrs ago", signature: "3dSu...4oMy", status: "confirmed" },
  { id: "tx-6", type: "yield", agentName: "Treasury", amount: 14.2, timestamp: "3 hrs ago", signature: "6eVw...5pNa", status: "confirmed" },
  { id: "tx-7", type: "payment", agentName: "Research Agent", amount: 120, timestamp: "3 hrs ago", signature: "1fGx...7qOb", status: "confirmed" },
  { id: "tx-8", type: "payment", agentName: "Distribution Agent", amount: 65, timestamp: "4 hrs ago", signature: "4hIy...8rPc", status: "confirmed" },
];

// ---- Activity Feed (aligned to 3 agents) ----
export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: "ev-1", type: "task_complete", title: "Content Agent completed task", detail: "Landing page copy for Qonnek v2 — $150.00 billable", timestamp: "Just now", agentId: "agent-content" },
  { id: "ev-2", type: "payment_sent", title: "Payment sent to Content Agent", detail: "+$150.00 CASH via Swig wallet 7xKQ...n3Fp", timestamp: "1 min ago", agentId: "agent-content" },
  { id: "ev-3", type: "task_complete", title: "Research Agent completed task", detail: "Scraped 2,400 records from DEX volume dataset", timestamp: "5 min ago", agentId: "agent-research" },
  { id: "ev-4", type: "payment_sent", title: "Payment sent to Research Agent", detail: "+$85.00 CASH via Swig wallet 4mRe...8kWz", timestamp: "6 min ago", agentId: "agent-research" },
  { id: "ev-5", type: "task_complete", title: "Distribution Agent completed task", detail: "Syndicated newsletter to 12,000 subscribers", timestamp: "12 min ago", agentId: "agent-distribution" },
  { id: "ev-6", type: "payment_sent", title: "Payment sent to Distribution Agent", detail: "+$90.00 CASH via Swig wallet 9pLj...2vQs", timestamp: "13 min ago", agentId: "agent-distribution" },
  { id: "ev-7", type: "treasury_fund", title: "Treasury funded", detail: "$500.00 CASH deposited to main treasury pool", timestamp: "1 hr ago" },
  { id: "ev-8", type: "yield_accrued", title: "Yield accrued", detail: "+$14.20 CASH from Altitude yield strategy", timestamp: "3 hrs ago" },
];

// ---- Stats (derived from 3 agents) ----
export const MOCK_STATS = {
  totalAgents: 3,
  activeAgents: 2,
  totalCash: 12450,
  treasuryApy: 5.2,
  tasksToday: 34,
  earned24h: 1225,
  treasuryBalance: 8400,
  yieldEarned30d: 187.5,
  totalPendingPayouts: MOCK_AGENTS
    ? 0 // computed below
    : 0,
};

// Compute aggregate pending payout total
MOCK_STATS.totalPendingPayouts = MOCK_AGENTS.reduce(
  (sum, a) => sum + a.pendingPayouts.reduce((s, p) => s + p.amount, 0),
  0,
);
