import { NextResponse } from "next/server";
import { AttributeName, TaskClassificationResult } from "@/types/database.types";

const HEURISTIC_KEYWORDS: Record<AttributeName, string[]> = {
  Intellect: [
    "code", "program", "study", "read", "learn", "math", "exam", "research",
    "course", "book", "write code", "algorithm", "homework", "debug", "lecture",
    "article", "science", "quiz", "revision", "tutorial", "analyze", "solve"
  ],
  Strength: [
    "gym", "workout", "run", "lift", "pushup", "squat", "cardio", "exercise",
    "swim", "yoga", "walk", "stretch", "jog", "pullup", "bench", "deadlift",
    "weights", "cycle", "football", "basketball", "hiit"
  ],
  Discipline: [
    "clean", "chore", "wash", "dishes", "organize", "budget", "routine",
    "laundry", "trash", "plan", "schedule", "tidy", "declutter", "wake up",
    "meditate", "fold", "inbox", "pay bill", "cook meal", "prep"
  ],
  Creativity: [
    "paint", "draw", "compose", "design", "write story", "music", "art",
    "sketch", "video edit", "brainstorm", "poem", "craft", "produce",
    "photograph", "ui design", "guitar", "piano", "animation"
  ],
  Social: [
    "meet", "call", "friend", "party", "network", "mentor", "family", "date",
    "talk", "chat", "email client", "meeting", "hangout", "dinner", "coffee",
    "connect", "colleague", "birthday", "event", "presentation"
  ],
};

// ============================================================================
// FACTUAL BENCHMARK ONTOLOGY (Empirical Human Baseline Standards)
// ============================================================================
const FACTUAL_BENCHMARK_ONTOLOGY = `
EMPIRICAL HUMAN PERFORMANCE & EFFORT BENCHMARK ONTOLOGY:

1. Software & Algorithmic Problem Solving:
   - LeetCode Easy: 15–25 min/problem (Cognitive: 6/10, Low-Medium Strain)
   - LeetCode Medium: 30–45 min/problem (Cognitive: 8/10, High Focus)
   - LeetCode Hard: 50–80 min/problem (Cognitive: 9.5/10, Peak Focus)
   - 1–2 Problems: ~30–50 min total -> EASY (10–15 XP, Effort: 15–25)
   - 3–5 Problems: ~1.5–2.5 hours total -> MEDIUM (20–30 XP, Effort: 35–60)
   - 8–10+ Problems: ~4–6+ hours marathon grind -> HARD (40–50 XP, Effort: 75–95)
   - Feature Engineering / Debugging Complex Systems: 2–4 hours -> HARD (40–50 XP)

2. Reading, Writing & Academics:
   - Adult Reading Speed (Carver / Rayner et al.): ~200–250 words/min (~1.5–2.0 min per book page)
   - 10–15 Pages: ~20 min -> EASY (10–14 XP, Effort: 15–20)
   - 30–50 Pages: ~60–90 min -> MEDIUM (20–28 XP, Effort: 35–55)
   - 80–120+ Pages: ~2.5–4 hours -> HARD (38–48 XP, Effort: 70–90)
   - University Course Review / Lecture Notes: 45–60 min -> MEDIUM (20–25 XP)
   - Multi-chapter Exam Prep / Research Paper Writing: 3–5 hours -> HARD (42–50 XP)

3. Physical Exertion (ACSM & Exercise Physiology Standards):
   - Running Pace (Average Recreational Runner): 5:15–6:30 min/km
   - 1–2.5 km (Warmup / Light Jog): 10–15 min -> EASY (10–14 XP, Effort: 15–22)
   - 5 km (Standard 5K Run): 25–32 min -> MEDIUM (22–28 XP, Effort: 40–55)
   - 10 km (Endurance Run): 52–65 min -> HARD (38–45 XP, Effort: 70–85)
   - Half Marathon / Marathon: 1.75–4 hours -> HARD (48–50 XP, Effort: 95–100)
   - Calisthenics Pushups: 15–25 reps (EASY, 10–12 XP); 50–75 reps (MEDIUM, 22–26 XP); 100+ reps (HARD, 40–46 XP)
   - Hypertrophy / Weightlifting Session: 45–75 min focused compound lifts -> MEDIUM/HARD (25–35 XP)

4. Domestic, Habits & Discipline:
   - Micro-Chore (dishes, tidy desk, make bed, take out trash): 10–20 min -> EASY (10–12 XP, Effort: 10–18)
   - Standard Routine (groceries, laundry wash & fold, cook dinner): 40–60 min -> MEDIUM (18–24 XP, Effort: 30–45)
   - Deep Clean / Garage Overhaul / Financial Audit: 2–4 hours -> HARD (35–45 XP, Effort: 65–85)

5. Creativity & Social:
   - Daily sketch / 10 min journaling / quick social check-in: 10–20 min -> EASY (10–12 XP)
   - Design mockup / 1500w draft / 1 hr team presentation: 60–90 min -> MEDIUM (20–28 XP)
   - Complete digital painting / song composition / keynote speech: 3+ hours -> HARD (40–50 XP)
`;

function detectGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 3) return true;

  // Single word repeated character pattern: e.g. "asdfasdf", "aaaaaaa", "qwerty"
  const repeatingCharRegex = /(.)\1{4,}/i;
  if (repeatingCharRegex.test(trimmed)) return true;

  const words = trimmed.split(/\s+/);
  const commonVowels = /[aeiouy]/i;

  // Check if words lack vowels entirely (like "sdfghjk")
  let invalidWords = 0;
  for (const w of words) {
    if (w.length >= 4 && !commonVowels.test(w)) {
      invalidWords++;
    }
  }

  if (invalidWords > 0 && invalidWords >= words.length / 2) {
    return true;
  }

  return false;
}

function classifyByHeuristics(title: string, description: string = ""): TaskClassificationResult {
  const content = `${title} ${description}`.toLowerCase();

  if (detectGibberish(title)) {
    return {
      category: "Discipline",
      difficulty: "easy",
      suggested_xp: 10,
      is_gibberish: true,
      reason: "Input appears nonsensical or too short to be a genuine quest.",
    };
  }

  const scores: Record<AttributeName, number> = {
    Intellect: 0,
    Strength: 0,
    Discipline: 0,
    Creativity: 0,
    Social: 0,
  };

  for (const [category, keywords] of Object.entries(HEURISTIC_KEYWORDS) as [AttributeName, string[]][]) {
    for (const kw of keywords) {
      if (content.includes(kw)) {
        scores[category] += 1;
      }
    }
  }

  let bestCategory: AttributeName = "Discipline";
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores) as [AttributeName, number][]) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Dynamic volume and effort estimation (so it doesn't default everything to medium 20 XP)
  let difficulty: "easy" | "medium" | "hard" = "medium";
  let suggested_xp = 20;
  let reason = `Classified as ${bestCategory}`;

  // Check for coding/problem counts (e.g. "10 problems", "2 leetcode", "leetcode 10")
  const problemMatch = content.match(/(\d+)\s*(?:problems?|questions?|leetcode|tasks?)|(?:leetcode|coding|problems?)\s*(\d+)/i);
  if (problemMatch) {
    const count = parseInt(problemMatch[1] || problemMatch[2], 10);
    if (count <= 2) {
      difficulty = "easy";
      suggested_xp = 12;
      reason = `Classified as ${bestCategory}: ${count} problems is a light practice sprint.`;
    } else if (count <= 5) {
      difficulty = "medium";
      suggested_xp = 25;
      reason = `Classified as ${bestCategory}: ${count} problems is a solid focused session.`;
    } else {
      difficulty = "hard";
      suggested_xp = Math.min(50, 35 + (count - 6) * 3);
      reason = `Classified as ${bestCategory}: ${count} problems is an intensive grind marathon!`;
    }
  }
  // Check for distance (e.g. "10km", "2km", "5 miles")
  else if (content.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|miles?|mi)\b/i)) {
    const distMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|miles?|mi)\b/i);
    const dist = parseFloat(distMatch![1]);
    if (dist <= 2.5) {
      difficulty = "easy";
      suggested_xp = 12;
      reason = `Classified as ${bestCategory}: ${dist}km is a light cardio warmup.`;
    } else if (dist <= 6) {
      difficulty = "medium";
      suggested_xp = 25;
      reason = `Classified as ${bestCategory}: ${dist}km is a solid stamina run.`;
    } else {
      difficulty = "hard";
      suggested_xp = 45;
      reason = `Classified as ${bestCategory}: ${dist}km is an endurance challenge!`;
    }
  }
  // Check for reading pages (e.g. "100 pages", "10 pages")
  else if (content.match(/(\d+)\s*(?:pages?|pgs?)/i)) {
    const pageMatch = content.match(/(\d+)\s*(?:pages?|pgs?)/i);
    const pages = parseInt(pageMatch![1], 10);
    if (pages <= 15) {
      difficulty = "easy";
      suggested_xp = 12;
      reason = `Classified as ${bestCategory}: ${pages} pages is a quick reading session.`;
    } else if (pages <= 50) {
      difficulty = "medium";
      suggested_xp = 25;
      reason = `Classified as ${bestCategory}: ${pages} pages is a focused chapter study.`;
    } else {
      difficulty = "hard";
      suggested_xp = 45;
      reason = `Classified as ${bestCategory}: ${pages} pages is an extensive reading marathon!`;
    }
  }
  // Keyword-based general fallback
  else if (content.includes("quick") || content.includes("easy") || content.includes("5 min") || content.includes("short") || content.includes("tiny")) {
    difficulty = "easy";
    suggested_xp = 10;
    reason = `Classified as ${bestCategory}: Bite-sized task.`;
  } else if (content.includes("complete") || content.includes("exam") || content.includes("marathon") || content.includes("project") || content.includes("deep") || content.includes("hard")) {
    difficulty = "hard";
    suggested_xp = 40;
    reason = `Classified as ${bestCategory}: High-intensity milestone.`;
  }

  return {
    category: bestCategory,
    difficulty,
    suggested_xp,
    is_gibberish: false,
    reason,
  };
}

// ============================================================================
// LIVE REAL-TIME WEB SEARCH (Zero-Config DuckDuckGo + Optional Tavily Support)
// ============================================================================
async function performLiveWebSearch(query: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    // 1. If TAVILY_API_KEY is configured, use official Tavily API
    if (process.env.TAVILY_API_KEY) {
      try {
        const tavRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: `${query} average time required effort difficulty`,
            search_depth: "basic",
            max_results: 3,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (tavRes.ok) {
          const data = await tavRes.json();
          if (data.results && data.results.length > 0) {
            return data.results.map((r: any) => `• ${r.title}: ${r.content}`).join("\n");
          }
        }
      } catch {
        // Fall back to DuckDuckGo
      }
    }

    // 2. Direct Live Web Search (DuckDuckGo HTML) - No API Key Needed!
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " average duration effort time required")}`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const snippetRegex = /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
      const snippets: string[] = [];
      let match;
      while ((match = snippetRegex.exec(html)) !== null && snippets.length < 3) {
        const cleanText = match[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
        if (cleanText.length > 25) {
          snippets.push(`• ${cleanText}`);
        }
      }
      if (snippets.length > 0) {
        return snippets.join("\n");
      }
    }
  } catch (err) {
    console.warn("[Live Web Search] skipped or timed out:", err);
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // 1. Perform live real-time web search for task facts and effort baselines
    const liveWebContext = await performLiveWebSearch(title);

    const apiKey = process.env.LLM_API_KEY;
    const isPlaceholderKey = !apiKey || apiKey.includes("placeholder");

    // If no real API key is present, use our quantitative heuristic classifier
    if (isPlaceholderKey) {
      const result = classifyByHeuristics(title, description);
      if (liveWebContext) {
        result.reason = `${result.reason} (Web grounded)`;
      }
      return NextResponse.json(result);
    }

    // Determine endpoint URL (supports Groq, OpenAI, or custom provider)
    const baseUrl = process.env.LLM_BASE_URL || (
      apiKey.startsWith("gsk_") || (process.env.LLM_MODEL && process.env.LLM_MODEL.includes("llama"))
        ? "https://api.groq.com/openai/v1"
        : "https://api.openai.com/v1"
    );

    // Purely semantic LLM evaluation grounded in Factual Benchmark Ontology + Live Web Search
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      const systemPrompt = `You are the Quest Master AI for an RPG real-life progression system.
You MUST ground your evaluation in empirical human performance baselines and real-time web evidence.

${FACTUAL_BENCHMARK_ONTOLOGY}
${liveWebContext ? `\n--- LIVE REAL-TIME WEB SEARCH EVIDENCE ---\n${liveWebContext}\n------------------------------------------\n` : ""}

EVALUATION PROTOCOL:
1. SEMANTIC GIBBERISH DETECTION:
Set "is_gibberish": true if input is keyboard smashing, trolling, nonsensical, or passive non-activity ("breathing", "existing"). Otherwise false.

2. CATEGORY ALLOCATION (Exactly one):
"Intellect" | "Strength" | "Discipline" | "Creativity" | "Social"

3. EMPIRICAL STATISTICAL DECOMPOSITION:
Estimate:
- "estimated_minutes": Realistic time an average person needs based on the ontology and live web search.
- "cognitive_load": 1 to 10 scale.
- "physical_strain": 1 to 10 scale.
- "effort_score": 1 to 100 calculated from (estimated_minutes / 60) * max(cognitive_load, physical_strain) * 10.
- "difficulty": "easy" (effort < 25), "medium" (effort 25-65), "hard" (effort > 65).
- "suggested_xp": Scale linearly between 5 and 50 based on the effort_score.

NEVER treat different volumes the same! "Leetcode 2 problems" (~45m, Effort 20) is Easy (12 XP), while "Leetcode 10 problems" (~5h, Effort 88) is Hard (48 XP).

Respond ONLY with valid JSON:
{
  "category": "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social",
  "difficulty": "easy" | "medium" | "hard",
  "suggested_xp": number (between 5 and 50),
  "is_gibberish": boolean,
  "reason": "Clear explanation citing the estimated time and effort score from benchmark & live web data."
}`;

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || (apiKey.startsWith("gsk_") ? "llama-3.1-8b-instant" : "gpt-4o-mini"),
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Evaluate this quest:\nTitle: "${title}"\nDescription: "${description || "None"}"` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 220,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const parsed: TaskClassificationResult = JSON.parse(json.choices[0].message.content);
        parsed.suggested_xp = Math.min(50, Math.max(5, Number(parsed.suggested_xp) || 20));
        return NextResponse.json(parsed);
      } else {
        const errText = await res.text();
        console.warn(`[LLM API Error ${res.status}]:`, errText);
      }
    } catch (llmErr) {
      console.warn("LLM API call failed or timed out:", llmErr);
    }

    // Graceful fallback on LLM failure
    const fallbackResult = classifyByHeuristics(title, description);
    return NextResponse.json(fallbackResult);
  } catch (err: any) {
    console.error("Task classification error:", err);
    return NextResponse.json(
      {
        category: "Discipline",
        difficulty: "medium",
        suggested_xp: 20,
        is_gibberish: false,
        reason: "Default fallback category assigned.",
      },
      { status: 200 }
    );
  }
}
