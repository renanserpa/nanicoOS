# Nanico OS Cockpit — Project Overview

## Purpose
A comprehensive orchestration and control dashboard for the Nanico OS. Currently branded as "mission-control" / "TenacitOS", but is being evolved to serve as the visual command center for personal agent systems.

## Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **Charts & Data**: Recharts
- **Icons**: Lucide React
- **3D**: React Three Fiber + Drei (not primary focus for this phase)
- **Database**: SQLite (better-sqlite3)
- **Runtime**: Node.js 18+
- **Auth**: Password-based with JWT cookies (httpOnly, sameSite, secure)
- **Deployment**: Vercel

## Key Features (v1)
- Overview dashboard
- Kanban board (tasks/sprints)
- Topics & scores tracking
- Artifacts & handoffs
- Agent dashboard & status
- System monitoring (CPU, RAM, Disk, Network)
- Cost tracking
- Activity feed & heatmaps
- Cron job manager
- Memory browser
- File browser with preview/edit
- Global search
- Notifications
- 3D office (advanced, deprioritized)
- Terminal (read-only)

## Key Directories
```
src/
├── app/(dashboard)/        # Protected routes (overview, cockpit, agents, etc.)
├── app/api/               # API routes (auth, agents, files, activities, etc.)
├── app/login/             # Login page
├── components/
│   ├── TenacitOS/        # OS-style shell (TopBar, Dock, StatusBar)
│   ├── cockpit/          # Cockpit-specific components (Overview, Kanban, Topics, Agents, Artifacts)
│   ├── Office3D/         # 3D office (advanced feature, deprioritized)
│   └── charts/           # Recharts-based visualizations
├── config/branding.ts     # Branding from env vars
└── lib/                   # Utilities (pricing, paths, cockpit-data, activity-logger)
```

## Current State
- Auth working (local + remote Vercel)
- Cockpit v1 delivered with all major components
- Branch: feat/nanico-cockpit-v1
- Remote: https://nanicoos.vercel.app/cockpit
- Vercel connected to olie-music/nanicoos project

## Next Phase (Current Work)
1. **Visual Polish & Nanico OS Branding** — Update titles, labels, identity. Remove old TenacitOS branding.
2. **Improve Mock Data** — Organize state to be closer to real Nanico OS operations.
3. **Strengthen Cockpit UX** — Better navigation, highlight blocked/in-progress, improve artifacts visibility.
4. **NO heavy integrations yet** — Stay mocked until architecture is solid.
