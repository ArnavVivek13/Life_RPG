# ⚔️ Life RPG — Gamified Real-World Progression Engine

> **Turn everyday habits, studies, and chores into an epic RPG journey.**  
> Built with **Next.js 14 App Router**, **Supabase PostgreSQL**, **Tailwind CSS**, and **Serverless AI Grounding**.

[![Live Production](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://life-rpg-bice.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌐 Live Production Deployment

👉 **Live Demo:** **[https://life-rpg-bice.vercel.app](https://life-rpg-bice.vercel.app)**  
*(Includes Google OAuth2 authentication, Instant Guest Fast-Pass, and fully functional cloud persistence).*

---

## 📖 Table of Contents
1. [Overview & Key Features](#-overview--key-features)
2. [Local Setup & Run Tutorial](#-local-setup--run-tutorial)
3. [Architecture & System Design](#-architecture--system-design)
4. [Technical Details: Authentication & OAuth](#-technical-details-authentication--oauth)
5. [Technical Details: AI Quest Classifier & Live Web Search](#-technical-details-ai-quest-classifier--live-web-search)
6. [Technical Details: Game Logic & Anti-Cheat Math](#-technical-details-game-logic--anti-cheat-math)
7. [Technical Details: Overworld Map & 2D Sprite Engine](#-technical-details-overworld-map--2d-sprite-engine)
8. [Technical Details: UI/UX & Web Audio Synthesis](#-technical-details-uiux--web-audio-synthesis)
9. [Database Schema & Stored Procedures](#-database-schema--stored-procedures)
10. [Environment Variables Reference](#-environment-variables-reference)

---

## 🌟 Overview & Key Features

- **🎮 2D Canvas Overworld Engine:** Custom retro pixel-art map with real-time character movement, gabled building perspective, multi-region zones, and interactive landmarks.
- **🤖 Authoritative AI Quest Classifier:** Uses LLMs (Groq LLaMA 3.1 / OpenAI) with live web search and human performance benchmark ontologies to semantically categorize quests, determine difficulty, and assign XP without client manipulation.
- **🌐 Real-Time Live Web Search:** DuckDuckGo HTML scraping + Tavily AI search grounding for factual effort, duration, and difficulty lookup.
- **🛡️ Server-Authoritative Anti-Cheat:** XP calculations, level thresholds, gold rewards, and streak tracking run strictly inside PostgreSQL RPC stored procedures.
- **📈 Balanced Non-Linear Progression:** Levels scale exponentially: $\text{XP}(n) = \lfloor 100 \times 1.15^{n-1} \rfloor$.
- **🛒 Guild Armory & Cosmetic Inventory:** 15 distinct catalog items including character armor, weapons, capes, crowns, and dynamic world map color palettes (Kanto Day, Emerald Night, Johto Autumn, Lavender Town, Neon Byte).
- **🎉 Tactile Celebrations:** 16-bit retro pixel design, procedural Web Audio fanfare synthesis, and particle confetti cannons.

---

## 🚀 Local Setup & Run Tutorial

Follow these steps to run Life RPG locally on your machine.

### Prerequisites
- **Node.js 18.17+** (Node.js 20 recommended)
- **Git**
- A **Supabase** account ([supabase.com](https://supabase.com)) — Free tier is sufficient.
- *(Optional)* A **Groq** account ([console.groq.com](https://console.groq.com)) for free 200ms LLM inference, or an **OpenAI** API key.
- *(Optional)* A **Tavily** account ([tavily.com](https://tavily.com)) for dedicated live web search.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/ArnavVivek13/Life_RPG.git
cd Life_RPG
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Supabase Database
1. Go to [database.new](https://database.new) and create a new project.
2. In your Supabase project dashboard, open the **SQL Editor** (left sidebar).
3. Open [`supabase/schema.sql`](supabase/schema.sql) from this repository, copy its entire contents, paste it into the Supabase SQL Editor, and click **Run**.
   - This creates all relational tables: `profiles`, `attributes`, `tasks`, `shop_items`, `user_inventory`.
   - Creates Row-Level Security (RLS) policies.
   - Installs the server-authoritative RPC functions: `complete_task_rpc` and `purchase_shop_item_rpc`.
   - Seeds the 15 items in the Guild Armory catalog.

### Step 4: Configure Supabase Authentication
1. In Supabase Dashboard, go to **Authentication** ➔ **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (or your production Vercel domain)
   - **Redirect URLs**: Add:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**`
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/**`
2. *(Optional Google OAuth)*: Under **Authentication** ➔ **Providers** ➔ **Google**:
   - Enable Google provider.
   - Add your Google Client ID & Client Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - In Google Cloud Authorized Redirect URIs, add: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`.

### Step 5: Configure Environment Variables
Create a file named `.env.local` in the project root:

```bash
# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...<your-supabase-anon-key>

# Supabase Server-Only Secret Key
SUPABASE_SERVICE_ROLE_KEY=eyJh...<your-supabase-service-role-key>

# LLM Classification (Recommended: Free Groq LLaMA 3.1)
LLM_API_KEY=gsk_...<your-groq-api-key>
LLM_MODEL=llama-3.1-8b-instant

# Live Web Search (Optional - defaults to zero-config DuckDuckGo live search)
TAVILY_API_KEY=tvly-...
```

### Step 6: Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🛠️ Architecture & System Design

```
                     ┌────────────────────────────────────────────────────────┐
                     │                   Next.js 14 Client                    │
                     │  - React 18 UI Components & Zustand State Store        │
                     │  - 2D Canvas SpriteEngine (Movement, Math Shearing)    │
                     │  - Procedural Web Audio API Fanfare & Canvas Confetti  │
                     └───────────────────────────┬────────────────────────────┘
                                                 │
                                 Server Actions / Route Handlers
                                                 │
        ┌────────────────────────────────────────┼────────────────────────────────────────┐
        ▼                                        ▼                                        ▼
┌─────────────────────────┐          ┌─────────────────────────┐          ┌─────────────────────────┐
│     Supabase Auth       │          │   PostgreSQL Engine     │          │   AI Grounding Engine   │
│  - Google OAuth 2.0     │          │  - Multi-Tenant RLS     │          │  - Factual Ontology     │
│  - PKCE Session Cookies │          │  - complete_task_rpc    │          │  - Live Web Search      │
│  - Single-Click Stamp   │          │  - purchase_item_rpc    │          │  - Groq / OpenAI LLM    │
└─────────────────────────┘          └─────────────────────────┘          └─────────────────────────┘
```

---

## 🔐 Technical Details: Authentication & OAuth

### 1. Robust Single-Click PKCE Cookie Stamping
In standard Next.js App Router applications, Route Handlers that call `supabase.auth.exchangeCodeForSession(code)` write session tokens to internal cookie stores, but standard `NextResponse.redirect()` returns a fresh Response object lacking the `Set-Cookie` headers. This causes users to be bounced back to the login page on their first attempt.

In Life RPG, the callback handler in [`src/app/auth/callback/route.ts`](src/app/auth/callback/route.ts) directly binds cookie mutators to the redirect response object:
```typescript
const response = NextResponse.redirect(`${origin}${next}`);

const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    get(name) { return request.cookies.get(name)?.value; },
    set(name, value, options) {
      request.cookies.set({ name, value, ...options });
      response.cookies.set({ name, value, ...options }); // Stamped directly on 307 Redirect!
    },
    remove(name, options) {
      request.cookies.set({ name, value: "", ...options });
      response.cookies.set({ name, value, ...options });
    },
  },
});
```
This guarantees the session cookie is transmitted on the **very first redirect**, enabling seamless single-click login.

### 2. Instant Demo Mode (Judge Fast-Pass)
To allow immediate testing without requiring Google credentials or email verification, [`src/app/login/page.tsx`](src/app/login/page.tsx) features a dedicated **Instant Demo Guest Mode** that automatically provisions an isolated guest session with mock starter data.

---

## 🤖 Technical Details: AI Quest Classifier & Live Web Search

### 1. Zero-Regex Semantic Evaluation
Instead of fragile keyword matching, the Quest Master AI in [`src/app/api/classify-task/route.ts`](src/app/api/classify-task/route.ts) evaluates the semantic intent of tasks. Manual category pickers were intentionally removed from the UI so users cannot manipulate stats by self-categorizing.

### 2. Live Web Search Grounding
To verify facts about real-world tasks (e.g. how long an athletic challenge takes or the difficulty of a specific curriculum), the route executes real-time web retrieval:
- **Tavily AI Search**: If `TAVILY_API_KEY` is provided, queries Tavily's factual search endpoint.
- **Zero-Config DuckDuckGo Search**: Automatically falls back to DuckDuckGo HTML scraping to extract real-time web evidence with **zero API keys required**.

### 3. Factual Benchmark Ontology
The LLM system prompt is anchored with an empirical human baseline table:
- **Algorithms & Code**: LeetCode Easy: 15–25m; Medium: 30–45m; Hard: 50–80m. 10 problems = ~5 hours (Hard, 48 XP); 2 problems = ~40 mins (Easy, 12 XP).
- **Reading Speed (Carver / Rayner Standards)**: ~200–250 words/min (~1.5–2.0 min/page). 10 pages = ~20 min (Easy, 12 XP); 100 pages = ~3.5 hours (Hard, 45 XP).
- **Exercise Physiology (ACSM Standards)**: Running pace 5:15–6:30 min/km. 2km = warmup (Easy, 12 XP); 10km = endurance (Hard, 42 XP).
- **Multi-Factor Decomposition**: The LLM outputs `estimated_minutes`, `cognitive_load` (1–10), and `physical_strain` (1–10), computing an `effort_score` (1–100) that linearly derives difficulty and base XP (5–50 XP).

---

## 🎮 Technical Details: Game Logic & Anti-Cheat Math

### 1. Server-Authoritative Execution
All game progressions run inside PostgreSQL via the stored procedure `complete_task_rpc(p_task_id, p_user_id)`. The frontend client **never** computes or sends XP values.

### 2. Exponential Level Curve
Progression follows a strictly balanced non-linear progression function:
$$\text{XP Required for Level } n = \lfloor 100 \times 1.15^{n-1} \rfloor$$
$$\text{Total Cumulative XP}(L) = \sum_{i=1}^{L} \lfloor 100 \times 1.15^{i-1} \rfloor$$

### 3. Streak & Speed Multipliers
- **Speed Bonus**: Completing a quest before its user-defined deadline computes a time-remaining scalar granting up to **$1.5\times$ base XP**.
- **Daily Streak Multiplier**: Logging consecutive quest completions across days scales gold earnings by $+10\%$ per day up to a maximum **$+50\%$ streak bonus**.
- **Streak Protection**: If a user misses a day, the streak resets gracefully unless protected by a streak talisman.

---

## 🗺️ Technical Details: Overworld Map & 2D Sprite Engine

Located in [`src/components/world/SpriteEngine.ts`](src/components/world/SpriteEngine.ts) and [`src/components/world/WorldMap.tsx`](src/components/world/WorldMap.tsx):

### 1. Procedural 2D Canvas Engine
- **Resolution**: 640 × 480 virtual canvas dynamically scaled with CSS pixelation (`image-rendering: pixelated`).
- **Mathematical Gabled Roof Shearing**: Implements triangular perspective shearing for medieval thatched roofs, rendering distinct shaded roof planes and eave trims without sprite distortion.
- **Directional Character Walk Cycle**: 4-directional 16-bit hero sprite with 4-frame walk cycles, idle breathing animations, and shadow projections.
- **Dynamic Cosmetic Equipment Layers**: Automatically renders equipped gear overlays in real-time:
  - *Golden Crown* & *Mage Hood* (Head accessories)
  - *Dragon Blade* (Weapon hand)
  - *Knight Shield* (Offhand)
  - *Celestial Cape* (Back layer animation)
  - *Ranger Cowl* (Shoulder gear)

### 2. World Districts & Landmarks
The map features distinct regions with custom tile rendering:
- 🏛️ **The Guild Hall**: Central hub with questboard and notice pins.
- ⚒️ **The Iron Smithy**: Interactive anvil and smelting furnace.
- 📚 **The Grand Library**: Study sanctum with book stacks and study desks.
- 🌲 **The Whispering Pines**: Shrine with glowing runic obelisks.
- 🍺 **The Boar's Tusk Inn**: Village tavern with timber barrels.
- 🐈 **Interactive Easter Eggs**: Wandering ginger cat, practice training dummy, and animated campfires.

---

## 🎨 Technical Details: UI/UX & Web Audio Synthesis

### 1. Palette Themes
The user can switch or purchase 5 distinct color palettes via the HUD:
- **Kanto Day**: Bright emerald green fields with honey-colored thatch.
- **Emerald Night**: Deep moonlight blue tones with glowing torch accents.
- **Johto Autumn**: Amber grasslands with golden-red maple canopies.
- **Lavender Town**: Ethereal purple dusk with mystic spectral lanterns.
- **Neon Byte**: Cyberpunk obsidian roads with electric cyan and magenta highlights.

### 2. Synthesized Web Audio API Fanfare
To eliminate external audio loading delays and asset failures, level-up fanfares are synthesized procedurally in JavaScript using the browser's native `AudioContext`:
- Dual square-wave and triangle-wave oscillators.
- Classic retro arpeggios: C4 $\rightarrow$ E4 $\rightarrow$ G4 $\rightarrow$ C5 with rapid decay envelopes.
- Synthesized quest completion chimes and coin purchase clinks.

---

## 🗄️ Database Schema & Stored Procedures

The database schema is defined in [`supabase/schema.sql`](supabase/schema.sql):

### Core Tables
1. **`profiles`**: User level, total XP, current gold, streak count, equipped theme, and last active date.
2. **`attributes`**: Individual attribute progression tracking (*Intellect*, *Strength*, *Discipline*, *Creativity*, *Social*) with attribute-specific XP and level.
3. **`tasks`**: User quests with title, description, category, difficulty, base XP, deadline, status (`pending`, `completed`, `failed`), and completion timestamps.
4. **`shop_items`**: Armor, weapons, accessories, themes, and consumable items.
5. **`user_inventory`**: Multi-tenant inventory tracking equipped status and item associations.

### Key RPC Functions
- **`complete_task_rpc(p_task_id, p_user_id)`**: Atomically awards XP, recalculates character and attribute levels, updates streaks, and grants gold.
- **`purchase_shop_item_rpc(p_item_id, p_user_id)`**: Validates gold balance, deducts item cost, and inserts into `user_inventory` in a single ACID transaction.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required | Example |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project REST Endpoint | **Yes** | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Public Key | **Yes** | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Server-Only Secret Key | **Yes** | `eyJhbGci...` |
| `LLM_API_KEY` | Groq or OpenAI API Key for Semantic AI Classifier | Optional | `gsk_...` or `sk-...` |
| `LLM_MODEL` | Target LLM Model Name | Optional | `llama-3.1-8b-instant` |
| `LLM_BASE_URL` | Custom OpenAI-compatible Base URL | Optional | `https://api.groq.com/openai/v1` |
| `TAVILY_API_KEY` | Tavily Search API Key for Live Web Grounding | Optional | `tvly-...` |

---

## 📄 License & Attribution
Developed for the **TechZephyr Full-Stack Life RPG Challenge**. Built with passion for retro games, clean mathematics, and robust web engineering.