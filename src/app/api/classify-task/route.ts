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

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LLM_API_KEY;
    const isPlaceholderKey = !apiKey || apiKey.includes("placeholder");

    // If no real API key is present, use our instant heuristic classifier
    if (isPlaceholderKey) {
      const result = classifyByHeuristics(title, description);
      return NextResponse.json(result);
    }

    // Determine endpoint URL (supports Groq, OpenAI, or custom provider)
    const baseUrl = process.env.LLM_BASE_URL || (
      apiKey.startsWith("gsk_") || (process.env.LLM_MODEL && process.env.LLM_MODEL.includes("llama"))
        ? "https://api.groq.com/openai/v1"
        : "https://api.openai.com/v1"
    );

    // Purely semantic LLM evaluation
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const systemPrompt = `You are the Quest Master AI for an RPG real-life progression system.
You must perform SEMANTIC evaluation of the user's quest.

1. SEMANTIC GIBBERISH / VALIDITY DETECTION:
Set "is_gibberish": true if:
- It is keyboard smashing or random character sequences (e.g. "asdfghj", "qwertyuiop").
- It is nonsensical, trolling, or lacks genuine intent (e.g. "idk what to do", "blah blah", "xyz").
- It is a trivial non-activity (e.g. "blinking", "breathing", "existing").
Otherwise, set "is_gibberish": false.

2. SEMANTIC CATEGORY (Must be exactly one):
- "Intellect": mental challenge, coding, LeetCode, computer science, studying, homework, reading, mathematics, scientific research.
- "Strength": physical exertion, gym, workouts, lifting, running, calisthenics, sports, cardio.
- "Discipline": habits, routines, domestic chores, cleaning, budgeting, organizing, time management.
- "Creativity": expressive arts, writing, design, music, drawing, filmmaking, crafting.
- "Social": human connection, meetings, friends, networking, communication, teamwork.

3. SEMANTIC EFFORT & QUANTITY SCALING (CRITICAL):
You MUST evaluate the actual WORKLOAD, VOLUME, and TIME commitment implied by the numbers and text:
- Small Scale (1-2 coding problems, 15m walk, 10 pages, 15 pushups):
  -> difficulty: "easy", suggested_xp: 10 - 15
- Moderate Scale (3-5 coding problems, 1 hour workout, 5km run, 30-50 pages, 1-2 hours of study):
  -> difficulty: "medium", suggested_xp: 20 - 30
- Heavy / Marathon Scale (8-10+ coding problems, 10km+ run, 100+ pages, 3+ hours deep work):
  -> difficulty: "hard", suggested_xp: 35 - 50

DO NOT treat small tasks and large tasks the same! "Leetcode 2 problems" is Easy (~12 XP), while "Leetcode 10 problems" is Hard (~45 XP).

Respond ONLY with valid JSON:
{
  "category": "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social",
  "difficulty": "easy" | "medium" | "hard",
  "suggested_xp": number (between 5 and 50),
  "is_gibberish": boolean,
  "reason": "One concise sentence explaining the semantic categorization and why the volume/effort received this difficulty."
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
          max_tokens: 200,
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
