import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================
   TREASURY SIMULATION ENGINE — v3 (perf-optimized)
   Reduced timer pressure: fewer intervals, batched updates.
   ============================================ */

export interface TreasuryAllocation {
  label: string;
  amount: number;
  percentage: number;
  color: string;
  description: string;
}

export interface TreasuryEvent {
  id: string;
  type: "auto_deposit" | "yield_accrual" | "rebalance" | "reserve_update" | "health_check";
  message: string;
  amount?: number;
  timestamp: number;
}

export interface TreasuryHealthMetric {
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  status: "excellent" | "good" | "caution" | "warning";
}

export interface TreasuryState {
  totalBalance: number;
  idleCash: number;
  yieldBalance: number;
  reserveBalance: number;
  currentApy: number;
  totalYieldEarned: number;
  yieldPerSecond: number;
  allocations: TreasuryAllocation[];
  events: TreasuryEvent[];
  healthMetrics: TreasuryHealthMetric[];
  healthScore: number;
  utilization: number;
  isActive: boolean;
  uptimeSeconds: number;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const AUTO_DEPOSIT_MESSAGES = [
  "Auto-deposited idle CASH into yield vault",
  "Swept idle payroll funds to earning pool",
  "Idle balance auto-allocated to yield strategy",
  "Dormant CASH moved to optimized vault",
  "Auto-deposit: idle funds routed to yield",
  "Smart sweep: idle CASH earning 4.2% APY",
];

const YIELD_MESSAGES = [
  "Yield accrued from lending pool position",
  "Interest earned on treasury deposits",
  "Yield harvest from DeFi allocation",
  "Staking rewards compounded into vault",
];

const REBALANCE_MESSAGES = [
  "Portfolio rebalanced for optimal yield",
  "Allocation adjusted: increased yield exposure",
  "Risk-adjusted rebalance completed",
  "Treasury allocation optimized by AI strategy",
];

const HEALTH_MESSAGES = [
  "Treasury health check: all metrics green",
  "Reserve ratio verified: above threshold",
  "Liquidity check passed: funds accessible",
];

const BASE_TOTAL = 12.4582;
const BASE_IDLE = 1.2340;
const BASE_YIELD = 8.7142;
const BASE_RESERVE = 2.5100;
const BASE_APY = 4.2;

export function useTreasurySimulation(): TreasuryState {
  const [totalBalance, setTotalBalance] = useState(BASE_TOTAL);
  const [idleCash, setIdleCash] = useState(BASE_IDLE);
  const [yieldBalance, setYieldBalance] = useState(BASE_YIELD);
  const [reserveBalance] = useState(BASE_RESERVE);
  const [currentApy] = useState(BASE_APY);
  const [totalYieldEarned, setTotalYieldEarned] = useState(0);
  const [events, setEvents] = useState<TreasuryEvent[]>([]);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Yield per second
  const yieldPerSecond = (yieldBalance * (currentApy / 100)) / (365.25 * 24 * 3600);

  const addEvent = useCallback((event: Omit<TreasuryEvent, "id" | "timestamp">) => {
    setEvents((prev) => [{ ...event, id: uid(), timestamp: Date.now() }, ...prev].slice(0, 30));
  }, []);

  // Combined yield + uptime tick: every 5 seconds (was 1s uptime + 3s yield = 2 timers)
  useEffect(() => {
    const timer = setInterval(() => {
      const accrual = yieldPerSecond * 5;
      if (accrual > 0) {
        setYieldBalance((p) => parseFloat((p + accrual).toFixed(6)));
        setTotalBalance((p) => parseFloat((p + accrual).toFixed(6)));
        setTotalYieldEarned((p) => parseFloat((p + accrual).toFixed(6)));
      }
      setUptimeSeconds((p) => p + 5);
    }, 5000);
    return () => clearInterval(timer);
  }, [yieldPerSecond]);

  // Auto-deposit events (every 18-28 seconds)
  useEffect(() => {
    const schedule = () => {
      const delay = 18000 + Math.random() * 10000;
      const t = setTimeout(() => {
        const amt = parseFloat((Math.random() * 0.03 + 0.005).toFixed(4));
        setIdleCash((p) => parseFloat(Math.max(0.1, p - amt).toFixed(4)));
        setYieldBalance((p) => parseFloat((p + amt).toFixed(4)));
        addEvent({ type: "auto_deposit", message: pick(AUTO_DEPOSIT_MESSAGES), amount: amt });
        schedule();
      }, delay);
      timersRef.current.push(t);
    };
    const init = setTimeout(() => schedule(), 10000);
    timersRef.current.push(init);
    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Yield log events (every 25-40 seconds)
  useEffect(() => {
    const schedule = () => {
      const delay = 25000 + Math.random() * 15000;
      const t = setTimeout(() => {
        const amt = parseFloat((Math.random() * 0.002 + 0.0005).toFixed(4));
        addEvent({ type: "yield_accrual", message: pick(YIELD_MESSAGES), amount: amt });
        schedule();
      }, delay);
      timersRef.current.push(t);
    };
    const init = setTimeout(() => schedule(), 15000);
    timersRef.current.push(init);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebalance events (every 50-80 seconds)
  useEffect(() => {
    const schedule = () => {
      const delay = 50000 + Math.random() * 30000;
      const t = setTimeout(() => {
        addEvent({ type: "rebalance", message: pick(REBALANCE_MESSAGES) });
        setIdleCash((p) => parseFloat((p + Math.random() * 0.02).toFixed(4)));
        schedule();
      }, delay);
      timersRef.current.push(t);
    };
    const init = setTimeout(() => schedule(), 35000);
    timersRef.current.push(init);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Health check events (every 60-100 seconds)
  useEffect(() => {
    const schedule = () => {
      const delay = 60000 + Math.random() * 40000;
      const t = setTimeout(() => {
        addEvent({ type: "health_check", message: pick(HEALTH_MESSAGES) });
        schedule();
      }, delay);
      timersRef.current.push(t);
    };
    const init = setTimeout(() => schedule(), 30000);
    timersRef.current.push(init);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Computed allocations
  const allocations: TreasuryAllocation[] = [
    {
      label: "Yield Vault",
      amount: yieldBalance,
      percentage: (yieldBalance / totalBalance) * 100,
      color: "hsl(24 85% 62%)",
      description: "Earning " + currentApy + "% APY in lending/staking",
    },
    {
      label: "Payroll Reserve",
      amount: reserveBalance,
      percentage: (reserveBalance / totalBalance) * 100,
      color: "hsl(220 8% 52%)",
      description: "Reserved for upcoming agent payouts",
    },
    {
      label: "Idle CASH",
      amount: idleCash,
      percentage: (idleCash / totalBalance) * 100,
      color: "hsl(38 80% 52%)",
      description: "Awaiting auto-deposit to yield vault",
    },
  ];

  // Computed health metrics
  const utilization = ((yieldBalance + reserveBalance) / totalBalance) * 100;
  const reserveRatio = (reserveBalance / totalBalance) * 100;
  const yieldEfficiency = (yieldBalance / totalBalance) * 100;
  const healthScore = Math.min(100, Math.round(
    (utilization > 70 ? 30 : 20) +
    (reserveRatio > 15 ? 25 : 15) +
    (yieldEfficiency > 50 ? 30 : 20) +
    (idleCash / totalBalance < 0.15 ? 15 : 5)
  ));

  const getStatus = (val: number, thresholds: [number, number, number]): "excellent" | "good" | "caution" | "warning" => {
    if (val >= thresholds[0]) return "excellent";
    if (val >= thresholds[1]) return "good";
    if (val >= thresholds[2]) return "caution";
    return "warning";
  };

  const healthMetrics: TreasuryHealthMetric[] = [
    { label: "Health Score", value: healthScore, maxValue: 100, unit: "pts", status: getStatus(healthScore, [85, 70, 50]) },
    { label: "Utilization", value: parseFloat(utilization.toFixed(1)), maxValue: 100, unit: "%", status: getStatus(utilization, [80, 60, 40]) },
    { label: "Reserve Ratio", value: parseFloat(reserveRatio.toFixed(1)), maxValue: 50, unit: "%", status: getStatus(reserveRatio, [20, 15, 10]) },
    { label: "Yield Efficiency", value: parseFloat(yieldEfficiency.toFixed(1)), maxValue: 100, unit: "%", status: getStatus(yieldEfficiency, [65, 50, 30]) },
  ];

  return {
    totalBalance, idleCash, yieldBalance, reserveBalance, currentApy,
    totalYieldEarned, yieldPerSecond, allocations, events, healthMetrics,
    healthScore, utilization, isActive: true, uptimeSeconds,
  };
}
