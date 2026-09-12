# ⚔️ Life RPG — Gamified Real-World Progression Engine

Transform mundane habits and tasks into an immersive RPG progression adventure.

Built for the **TechZephyr Full-Stack Life RPG Challenge**.

---

## 🌟 Key Features

- **🛡️ Server-Authoritative Anti-Cheat:** XP, level calculations, gold, and streaks are calculated strictly on the backend/Postgres RPC layer with Row Level Security (RLS).
- **📈 Non-Linear Progression Curve:** Exponential level requirements ($\text{XP} = \lfloor 100 \times 1.15^{n-1} \rfloor$).
- **✨ 5 Core Attributes:** Quests level up specific character stats (*Intellect*, *Strength*, *Discipline*, *Creativity*, *Social*).
- **🤖 AI Quest Categorization & Gibberish Shield:** Automatic classification, difficulty estimation, and nonsensical input rejection with fallback heuristics.
- **🔥 Streaks & Multipliers:** Daily activity tracking with cumulative gold multipliers and milestone rewards.
- **🛒 Economy & Shop:** Spend earned gold on custom themes, avatar cosmetics, and profile badges.
- **⚡ Tactile & Responsive UI:** 16-bit retro fantasy theme, micro-animations, particle bursts, and full keyboard navigation (a11y).

---

## 🛠️ Tech Stack

- **Frontend & API:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Canvas-Confetti, Lucide Icons, Zustand
- **Database & Auth:** Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth (Google OAuth2 + Magic Link)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ArnavVivek13/Life_RPG.git
cd Life_RPG
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
LLM_API_KEY=your_llm_api_key
LLM_MODEL=llama-3.1-8b-instant
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Database Schema & Security
See `supabase/schema.sql` (or Stage 1 documentation) for complete table definitions, Row Level Security (RLS) policies, and server-side RPC functions.