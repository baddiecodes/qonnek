import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================
   TREASURY SIMULATION ENGINE
   Institutional-grade treasury management sim.
   Pure frontend — timers + deterministic growth.
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
  value: number;    // 0-100 or raw
  maxValue: number;
  unit: string;
  status: "excellent" | "good" | "caution" | "warning";
}

export interface TreasuryState {
  /** Total treasury balance in SOL */
  totalBalance: number;
  /** Balance sitting idle before yield allocation */
  idleCash: number;
  /** Currently earning yield */
  yieldBalance: number;
  /** Reserves held for payroll */
  reserveBalance: number;
  /** APY as a percentage (e.g. 4.2) */
  currentApy: number;
  /** Total yield earned since session start */
  totalYieldEarned: number;
  /** Yield earned per second (for animation) */
  yieldPerSecond: number;
  /** Allocation breakdown */
  allocations: TreasuryAllocation[];
  /** Recent treasury events */
  events: TreasuryEvent[];
  /** Health metrics */
  healthMetrics: TreasuryHealthMetric[];
  /** Health score 0-100 */
  healthScore: number;
  /** Utilization percentage */
  utilization: number;
  /** True while simulation is running */
  isActive: boolean;
  /** Session uptime in seconds */
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
  "LP yield auto-compounded",
];

const REBALANCE_MESSAGES = [
  "Portfolio rebalanced for optimal yield",
  "Allocation adjusted: increased yield exposure",
  "Risk-adjusted rebalance completed",
  "Treasury allocation optimized by AI strategy",
  "Auto-rebalance: payroll reserves topped up",
];

const HEALTH_MESSAGES = [
  "Treasury health check: all metrics green",
  "Reserve ratio verified: above threshold",
  "Liquidity check passed: funds accessible",
  "Risk assessment complete: low exposure",
];

// Initial mock balances
const BASE_TOTAL = 12.4582;
const BASE_IDLE = 1.2340;
const BASE_YIELD = 8.7142;
const BASE_RESERVE = 2.5100;
const BASE_APY = 4.2;

export function useTreasurySimulation(): TreasuryState {
  const [totalBalance, setTotalBalance] = useState(BASE_TOTAL);
  const [idleCash, setIdleCash] = useState(BASE_IDLE);
  const [yieldBalance, setYieldBalance] = useState(BASE_YIELD);
  const [reserveBalance, setReserveBalance] = useState(BASE_RESERVE);
  const [currentApy] = useState(BASE_APY);
  const [totalYieldEarned, setTotalYieldEarned] = useState(0);
  const [events, setEvents] = useState<TreasuryEvent[]>([]);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  // Yield per second: APY applied to yield balance, converted to per-second
  const yieldPerSecond = (yieldBalance * (currentApy / 100)) / (365.25 * 24 * 3600);

  const addEvent = useCallback((event: Omit<TreasuryEvent, "id" | "timestamp">) => {
    setEvents((prev) => [{ ...event, id: uid(), timestamp: Date.now() }, ...prev].slice(0, 40));
  }, []);

  // --- Continuous yield accrual (every 3 seconds) ---
  useEffect(() => {
    const yieldTimer = setInterval(() => {
      const accrual = yieldPerSecond * 3; // 3 seconds worth
      if (accrual > 0) {
        setYieldBalance((prev) => parseFloat((prev + accrual).toFixed(6)));
        setTotalBalance((prev) => parseFloat((prev + accrual).toFixed(6)));
        setTotalYieldEarned((prev) => parseFloat((prev + accrual).toFixed(6)));
      }
    }, 3000);

    timersRef.current.push(yieldTimer);
    return () => clearInterval(yieldTimer);
  }, [yieldPerSecond]);

  // --- Uptime counter ---
  useEffect(() => {
    const uptimeTimer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    timersRef.current.push(uptimeTimer);
    return () => clearInterval(uptimeTimer);
  }, []);

  // --- Auto-deposit events (every 15-25 seconds) ---
  useEffect(() => {
    const scheduleAutoDeposit = () => {
      const delay = 15000 + Math.random() * 10000;
      const timer = setTimeout(() => {
        const depositAmount = parseFloat((Math.random() * 0.03 + 0.005).toFixed(4));
        setIdleCash((prev) => {
          const newIdle = Math.max(0.1, prev - depositAmount);
          return parseFloat(newIdle.toFixed(4));
        });
        setYieldBalance((prev) => parseFloat((prev + depositAmount).toFixed(4)));
        addEvent({
          type: "auto_deposit",
          message: pick(AUTO_DEPOSIT_MESSAGES),
          amount: depositAmount,
        });
        scheduleAutoDeposit();
      }, delay);
      timersRef.current.push(timer as unknown as ReturnType<typeof setInterval>);
    };
    // First auto-deposit after 8-12 seconds
    const initial = setTimeout(() => scheduleAutoDeposit(), 8000 + Math.random() * 4000);
    timersRef.current.push(initial as unknown as ReturnType<typeof setInterval>);
    return () => { timersRef.current.forEach(clearInterval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Yield accrual log events (every 20-35 seconds) ---
  useEffect(() => {
    const scheduleYieldLog = () => {
      const delay = 20000 + Math.random() * 15000;
      const timer = setTimeout(() => {
        const yieldAmt = parseFloat((Math.random() * 0.002 + 0.0005).toFixed(4));
        addEvent({
          type: "yield_accrual",
          message: pick(YIELD_MESSAGES),
          amount: yieldAmt,
        });
        scheduleYieldLog();
      }, delay);
      timersRef.current.push(timer as unknown as ReturnType<typeof setInterval>);
    };
    const initial = setTimeout(() => scheduleYieldLog(), 12000 + Math.random() * 5000);
    timersRef.current.push(initial as unknown as ReturnType<typeof setInterval>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Rebalance events (every 40-70 seconds) ---
  useEffect(() => {
    const scheduleRebalance = () => {
      const delay = 40000 + Math.random() * 30000;
      const timer = setTimeout(() => {
        addEvent({ type: "rebalance", message: pick(REBALANCE_MESSAGES) });
        // Slightly bump idle cash back up to simulate fund rotation
        setIdleCash((prev) => parseFloat((prev + Math.random() * 0.02).toFixed(4)));
        scheduleRebalance();
      }, delay);
      timersRef.current.push(timer as unknown as ReturnType<typeof setInterval>);
    };
    const initial = setTimeout(() => scheduleRebalance(), 30000 + Math.random() * 10000);
    timersRef.current.push(initial as unknown as ReturnType<typeof setInterval>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Health check events (every 45-80 seconds) ---
  useEffect(() => {
    const scheduleHealthCheck = () => {
      const delay = 45000 + Math.random() * 35000;
      const timer = setTimeout(() => {
        addEvent({ type: "health_check", message: pick(HEALTH_MESSAGES) });
        scheduleHealthCheck();
      }, delay);
      timersRef.current.push(timer as unknown as ReturnType<typeof setInterval>);
    };
    const initial = setTimeout(() => scheduleHealthCheck(), 25000);
    timersRef.current.push(initial as unknown as ReturnType<typeof setInterval>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Computed allocations ---
  const allocations: TreasuryAllocation[] = [
    {
      label: "Yield Vault",
      amount: yieldBalance,
      percentage: (yieldBalance / totalBalance) * 100,
      color: "hsl(186 100% 50%)",
      description: "Earning " + currentApy + "% APY in lending/staking",
    },
    {
      label: "Payroll Reserve",
      amount: reserveBalance,
      percentage: (reserveBalance / totalBalance) * 100,
      color: "hsl(265 90% 62%)",
      description: "Reserved for upcoming agent payouts",
    },
    {
      label: "Idle CASH",
      amount: idleCash,
      percentage: (idleCash / totalBalance) * 100,
      color: "hsl(38 92% 55%)",
      description: "Awaiting auto-deposit to yield vault",
    },
  ];

  // --- Computed health metrics ---
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
    {
      label: "Health Score",
      value: healthScore,
      maxValue: 100,
      unit: "pts",
      status: getStatus(healthScore, [85, 70, 50]),
    },
    {
      label: "Utilization",
      value: parseFloat(utilization.toFixed(1)),
      maxValue: 100,
      unit: "%",
      status: getStatus(utilization, [80, 60, 40]),
    },
    {
      label: "Reserve Ratio",
      value: parseFloat(reserveRatio.toFixed(1)),
      maxValue: 50,
      unit: "%",
      status: getStatus(reserveRatio, [20, 15, 10]),
    },
    {
      label: "Yield Efficiency",
      value: parseFloat(yieldEfficiency.toFixed(1)),
      maxValue: 100,
      unit: "%",
      status: getStatus(yieldEfficiency, [65, 50, 30]),
    },
  ];

  return {
    totalBalance,
    idleCash,
    yieldBalance,
    reserveBalance,
    currentApy,
    totalYieldEarned,
    yieldPerSecond,
    allocations,
    events,
    healthMetrics,
    healthScore,
    utilization,
    isActive: true,
    uptimeSeconds,
  };
}
