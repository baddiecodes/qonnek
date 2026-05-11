# Qonnek

Qonnek is a CASH-native agent payroll MVP for Solana.

Businesses run specialized AI agents, each with its own wallet and visible task flow. When an agent completes work, Qonnek shows a payroll event, updates balances, and visualizes treasury behavior in a clean dashboard built for hackathon demos.

## What it does

- Phantom wallet connection
- Devnet-only wallet and balance flow
- Agent wallet display
- One real devnet transfer for payroll proof
- Pentagon-style agent activity simulation
- Treasury visuals for idle balance / yield storytelling
- Explorer links for on-chain visibility

## Why it exists

AI agents are moving from chat to action. Qonnek explores the missing layer between agents, payments, and treasury management: a simple, visual payroll system for autonomous work.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide icons
- Phantom Connect
- Solana devnet
- Helius-compatible RPC architecture (devnet)
- Browser-based wallet and UI flow

## Current prototype scope

Qonnek is currently a frontend-first prototype optimized for hackathon demonstration.

The current implementation intentionally uses:
- frontend-only agent simulation
- Solana devnet only
- lightweight local state
- mock orchestration flows

The project does not yet include:
- backend agent orchestration
- production treasury infrastructure
- autonomous AI execution systems
- multi-user coordination
- mainnet deployment

## Devnet safety

Qonnek is hard-locked to Solana devnet.

This prototype intentionally avoids:
- mainnet deployment
- real fund exposure
- production treasury risk

All wallet activity and transfers shown in demos are devnet-only for safe testing and transparent verification.

## Hackathon focus

This repository is optimized for:
- fast demo iteration
- minimal blockchain complexity
- strong sponsor alignment
- clear product storytelling
- devnet-only safety

## Demo flow

1. Connect Phantom
2. Load dashboard
3. Show agent wallet
4. Show agent activity
5. Trigger a devnet payroll transfer
6. Show balance update + explorer link
7. Show treasury visuals

## Running locally

> Replace these commands with the exact commands used in your repo if needed.

```bash
npm install
npm run dev
```

## Built By

Mewtwo — product strategist, ecosystem operator, and Web3-native builder focused on AI, Solana, and internet-scale coordination systems.
Bangkok-based. Globally networked. Long-term focused.
https://x.com/withmewtwo 
