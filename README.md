# ⚔️ Life RPG — Gamified Real-World Progression Engine

> **TechZephyr Full-Stack Life RPG Challenge Submission**  
> A full-stack web application transforming mundane habits, studies, and chores into an immersive RPG progression adventure.

---

## 🌟 Overview & Highlights

- **🛡️ Server-Authoritative Anti-Cheat Architecture:** XP, level calculations, gold rewards, and daily streaks are calculated and validated strictly server-side through Postgres RPC stored procedures and Server Actions with Row Level Security (RLS). Inspect element or client modification cannot forge stats.
- **📈 Mathematically Sound Non-Linear Progression:** Progression follows exponential curve $\text{XP}(n) = \lfloor 100 \times 1.15^{n-1} \rfloor$ where higher levels demand progressively higher mastery.
- **✨ 5 Core Disciplines & Attributes:** Quests map to *Intellect*, *Strength*, *Discipline*, *Creativity*, and *Social*, each with individual rank tracking.
- **🤖 Serverless AI Quest Classifier & Gibberish Shield:** Uses structured LLM inference to automatically categorize quests, estimate difficulty, and suggest balanced base XP, with automatic rejection of nonsensical input and resilient offline fallback heuristics.
- **🔥 Daily Streaks & Speed Multipliers:** Finishing quests before deadlines grants up to $1.5\times$ speed bonus; consecutive daily logins multiply gold yields by up to $+50\%$.
- **🛒 Guild Armory & Backpack Customization:** Spend gold to acquire custom themes (Dungeon Tavern, Cyberpunk Neon), avatar gear (Golden Crown, Mage Hood), and milestone badges.
- **🎉 Tactile & Celebratory UI:** 16-bit retro aesthetic, animated SVG character sprite, celebratory particle explosions (`canvas-confetti`), and synthesized 8-bit Web Audio fanfare.
- **♿ Fully Accessible (a11y):** Complete keyboard navigation (`Tab`, `Enter`, `Space`, `Escape`), semantic HTML, screen reader labels, and graceful offline detection banner.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Server Components, Server Actions, Client Interactivity |
| **Language** | **TypeScript** | Strict type safety across database entities & game math |
| **Styling & Fonts** | **Tailwind CSS + Google Fonts** | *Cinzel*, *Press Start 2P*, *Outfit* with retro pixel borders |
| **Animations & Effects** | **Framer Motion + Canvas Confetti** | Spring physics, particle celebrations, Web Audio fanfare |
| **State Management** | **Zustand & Optimistic State** | Instant tactile feedback without UI freezing |
| **Backend & DB** | **Supabase PostgreSQL** | Relational schema, RPC stored functions, RLS multi-tenant security |
| **Authentication** | **Supabase Auth** | Google OAuth2, Email/Password, and Instant Demo Guest Pass |
| **AI / NLP** | **Serverless AI Classifier** | Flexible LLM API support (Groq/Gemini/OpenAI) + heuristic fallback |
| **Deployment** | **Vercel** | Edge-ready serverless deployment |

---

## 🔒 Anti-Cheat & Security Model

Any client can inspect elements or send arbitrary request bodies. To prevent stat tampering:
1. **Server-Computed Math:** The client never sends `+50 XP` or `level = 5`. The client only requests `complete_task(task_id)`.
2. **Postgres RPC Function:** `complete_task_rpc` retrieves the task server-side, verifies user ownership, computes time-remaining multipliers, updates streaks, increments total XP, and recalculates level atomically.
3. **Row Level Security (RLS):** All tables (`profiles`, `attributes`, `tasks`, `user_inventory`) enforce `auth.uid() = user_id`, guaranteeing multi-tenant data isolation.

---

## 🚀 Quickstart & Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ArnavVivek13/Life_RPG.git
cd Life_RPG
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and provide your Supabase and LLM API keys:
```bash
cp .env.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LLM Classification API (Optional - defaults to heuristic fallback if omitted)
LLM_API_KEY=your-llm-api-key
LLM_MODEL=llama-3.1-8b-instant
```

### 3. Database Migration
Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql) inside your Supabase SQL Editor:
- Creates `profiles`, `attributes`, `tasks`, `shop_items`, `user_inventory`.
- Configures RLS policies and user onboarding triggers.
- Creates the `complete_task_rpc` game engine.
- Seeds default shop items (themes, cosmetics, badges).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📹 Video Walkthrough Demonstration Script (90–180s)

1. **Sign In (0:00 - 0:20):**
   - Navigate to `/login`.
   - Click *Instant Demo Guest Mode* or sign in with Google OAuth.
2. **Explore Quest Hub (0:20 - 0:45):**
   - View Character Sprite, non-linear XP bar, 5 Core Attributes (*Intellect*, *Strength*, *Discipline*, *Creativity*, *Social*), and Streak Flame.
3. **Forge a Quest with AI Classifier (0:45 - 1:10):**
   - Click `+ New Quest`.
   - Type `"Read 25 pages of Computer Science and Algorithms"` $\rightarrow$ watch AI auto-tag **Intellect** and estimate Medium difficulty (20 XP).
   - Show gibberish rejection test (e.g., `"asdfasdf"` $\rightarrow$ warning toast).
4. **Complete Quest & Celebration (1:10 - 1:30):**
   - Click `Claim` on an active quest.
   - Observe the celebratory Level-Up Modal, particle confetti explosion, and 8-bit fanfare audio!
5. **Guild Armory & Inventory Customization (1:30 - 1:45):**
   - Navigate to `/shop`.
   - Purchase an item (e.g., *Golden Crown* or *Cyberpunk Neon Theme*) with earned gold.
   - Equip item in *My Backpack* and observe immediate cosmetic update on character sprite.
6. **Data Persistence Verification (1:45 - 2:00):**
   - Perform a hard browser refresh (`Ctrl+F5` / `Cmd+R`) to demonstrate that level, XP, gold, and inventory persist from the Supabase PostgreSQL database.

---

## 📋 Deliverables & Compliance Checklist

- [x] **Public GitHub Repository:** Clean chronological commit history with complete frontend and backend code.
- [x] **Live Deployed URL:** Configured for seamless Vercel deployment.
- [x] **Data Persistence:** Real database persistence in Supabase PostgreSQL (not localStorage).
- [x] **Zero Console Errors:** Clean runtime with zero unhandled exceptions.
- [x] **Responsive & Accessible UI:** Fully navigable via keyboard (`Tab`, `Enter`, `Space`, `Escape`) and responsive from mobile (320px) to desktop.