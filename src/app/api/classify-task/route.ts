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

  // Single word repeated character pattern: e.g. "asdfasdf", "aaaaaaa"
  const repeatingCharRegex = /(.)\1{4,}/i;
  if (repeatingCharRegex.test(trimmed)) return true;

  const words = trimmed.split(/\s+/);
  const commonVowels = /[aeiouy]/i;
  
  // Check if purely alphabetic words lack vowels entirely (like "sdfghjk")
  let invalidWords = 0;
  let alphaWordCount = 0;

  for (const w of words) {
    const alphaOnly = w.replace(/[^a-zA-Z]/g, "");
    if (alphaOnly.length > 0) {
      alphaWordCount++;
    }
    if (alphaOnly.length >= 4 && !commonVowels.test(alphaOnly)) {
      invalidWords++;
    }
  }

  if (alphaWordCount > 0 && invalidWords > 0 && invalidWords >= alphaWordCount / 2) {
    return true;
  }

  return false;
}

function parseQuantityAndEffort(content: string): { difficulty: "easy" | "medium" | "hard"; xp: number; reasonExtra?: string } | null {
  // Pattern 1: Leetcode / coding problems count (e.g. "leetcode 10 problems", "10 leetcode", "2 leetcode problems", "solve 5 coding problems")
  const leetcodeMatch = content.match(/(?:leetcode|coding|dsa|algo|problems?|questions?)[^\d]*(\d+)|(\d+)[^\d]*(?:leetcode|coding|dsa|algo|problems?|questions?)/i);
  if (leetcodeMatch) {
    const num = parseInt(leetcodeMatch[1] || leetcodeMatch[2], 10);
    if (!isNaN(num) && num > 0) {
      if (num <= 2) {
        return { difficulty: "easy", xp: 12, reasonExtra: `${num} coding problems is a light practice sprint.` };
      } else if (num <= 5) {
        return { difficulty: "medium", xp: 25, reasonExtra: `${num} coding problems is a focused problem-solving session.` };
      } else {
        const scaledXp = Math.min(50, 35 + (num - 6) * 3);
        return { difficulty: "hard", xp: scaledXp, reasonExtra: `${num} coding problems is an intensive algorithmic grind marathon!` };
      }
    }
  }

  // Pattern 2: Pages / Reading (e.g. "read 100 pages", "15 pages", "50 pages of book")
  const pagesMatch = content.match(/(\d+)\s*(?:pages?|pgs?)/i);
  if (pagesMatch) {
    const pages = parseInt(pagesMatch[1], 10);
    if (!isNaN(pages) && pages > 0) {
      if (pages <= 15) {
        return { difficulty: "easy", xp: 12, reasonExtra: `${pages} pages is a bite-sized reading session.` };
      } else if (pages <= 45) {
        return { difficulty: "medium", xp: 25, reasonExtra: `${pages} pages requires focused study.` };
      } else {
        return { difficulty: "hard", xp: 45, reasonExtra: `${pages} pages is an extensive deep-reading marathon!` };
      }
    }
  }

  // Pattern 3: Distance / Cardio (e.g. "run 10km", "5km jog", "walk 2 km", "cycle 20km")
  const distMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers?|miles?|mi)\b/i);
  if (distMatch) {
    const dist = parseFloat(distMatch[1]);
    if (!isNaN(dist) && dist > 0) {
      if (dist <= 2.5) {
        return { difficulty: "easy", xp: 12, reasonExtra: `${dist}km is a brisk warmup/light cardio.` };
      } else if (dist <= 6) {
        return { difficulty: "medium", xp: 25, reasonExtra: `${dist}km is a balanced stamina workout.` };
      } else {
        return { difficulty: "hard", xp: 45, reasonExtra: `${dist}km is a grueling endurance feat!` };
      }
    }
  }

  // Pattern 4: Time / Hours (e.g. "study 4 hours", "code 3 hrs")
  const hourMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i);
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    if (!isNaN(hours) && hours > 0) {
      if (hours <= 0.75) {
        return { difficulty: "easy", xp: 15, reasonExtra: `${hours}h is a quick work sprint.` };
      } else if (hours <= 2) {
        return { difficulty: "medium", xp: 25, reasonExtra: `${hours}h is a substantial focused session.` };
      } else {
        return { difficulty: "hard", xp: 45, reasonExtra: `${hours}h is a deep-work marathon!` };
      }
    }
  }

  // Pattern 5: Minutes (e.g. "meditate 15 mins", "clean 10 min")
  const minMatch = content.match(/(\d+)\s*(?:mins?|minutes?)\b/i);
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    if (!isNaN(mins) && mins > 0) {
      if (mins <= 20) {
        return { difficulty: "easy", xp: 10, reasonExtra: `${mins} minutes is a swift daily habit.` };
      } else if (mins <= 60) {
        return { difficulty: "medium", xp: 20, reasonExtra: `${mins} minutes is a solid routine.` };
      } else {
        return { difficulty: "hard", xp: 40, reasonExtra: `${mins} minutes requires sustained stamina.` };
      }
    }
  }

  // Pattern 6: Repetitions (e.g. "100 pushups", "25 pullups", "200 squats")
  const repsMatch = content.match(/(\d+)\s*(?:reps?|pushups?|pullups?|squats?|crunches?|jumping jacks?)/i);
  if (repsMatch) {
    const reps = parseInt(repsMatch[1], 10);
    if (!isNaN(reps) && reps > 0) {
      if (reps <= 25) {
        return { difficulty: "easy", xp: 12, reasonExtra: `${reps} reps is a light activation set.` };
      } else if (reps <= 70) {
        return { difficulty: "medium", xp: 25, reasonExtra: `${reps} reps requires genuine physical grit.` };
      } else {
        return { difficulty: "hard", xp: 45, reasonExtra: `${reps} reps is a high-volume heroic challenge!` };
      }
    }
  }

  return null;
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

  // Specific boost for coding platforms
  if (content.includes("leetcode") || content.includes("codeforces") || content.includes("hackerrank") || content.includes("neetcode")) {
    scores.Intellect += 3;
  }

  let bestCategory: AttributeName = "Discipline";
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores) as [AttributeName, number][]) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Check quantitative metrics first (problem counts, km, pages, hours)
  const quant = parseQuantityAndEffort(content);
  if (quant) {
    return {
      category: bestCategory,
      difficulty: quant.difficulty,
      suggested_xp: quant.xp,
      is_gibberish: false,
      reason: `Classified as ${bestCategory}: ${quant.reasonExtra || `${quant.difficulty.toUpperCase()} difficulty.`}`,
    };
  }

  // General qualitative fallback
  let difficulty: "easy" | "medium" | "hard" = "medium";
  let suggested_xp = 20;

  if (content.includes("quick") || content.includes("easy") || content.includes("5 min") || content.includes("short") || content.includes("tiny")) {
    difficulty = "easy";
    suggested_xp = 10;
  } else if (content.includes("complete") || content.includes("exam") || content.includes("marathon") || content.includes("project") || content.includes("deep") || content.includes("hard") || content.includes("master") || content.includes("final")) {
    difficulty = "hard";
    suggested_xp = 40;
  }

  return {
    category: bestCategory,
    difficulty,
    suggested_xp,
    is_gibberish: false,
    reason: `Classified as ${bestCategory} based on activity context (${difficulty.toUpperCase()} • ${suggested_xp} XP).`,
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

    // If no real API key is present, use our quantitative heuristic classifier
    if (isPlaceholderKey) {
      const result = classifyByHeuristics(title, description);
      return NextResponse.json(result);
    }

    // Attempt OpenAI / Groq Compatible endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout safeguard

      const systemPrompt = `You are the Quest Master AI for an RPG life tracking app. 
Classify the user's quest into exactly ONE of these categories:
- "Intellect" (coding, LeetCode, algorithms, studying, reading, research)
- "Strength" (gym, workout, running, lifting, cardio, sports)
- "Discipline" (chores, routine, cleaning, budgeting, organizing)
- "Creativity" (art, design, music, creative writing, video editing)
- "Social" (friends, family, networking, meetings, public speaking)

QUANTITY & EFFORT SCALING RULES (CRITICAL):
You MUST evaluate the volume, numerical count, time duration, and intensity:
- EASY (10-15 XP): Small, quick, or bite-sized tasks.
  * Examples: "Leetcode 1-2 problems", "Run 1-2km", "Read 10 pages", "15 pushups", "Clean desk (15m)".
- MEDIUM (20-30 XP): Standard moderate workouts or focused work sessions.
  * Examples: "Leetcode 3-5 problems", "Run 5km", "Read 30-40 pages", "1 hour gym workout", "Cook a dinner".
- HARD (35-50 XP): High-volume, grueling, marathon, or project-level tasks.
  * Examples: "Leetcode 8-10+ problems", "Run 10km+", "Read 100+ pages", "Study 4+ hours for exam", "100+ pushups".

NEVER assign the same difficulty or XP to disparate quantities (e.g. 2 problems is Easy ~12 XP, while 10 problems is Hard ~45 XP).
Detect if the title/description is gibberish/spam/invalid.

Respond ONLY with valid JSON:
{
  "category": "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social",
  "difficulty": "easy" | "medium" | "hard",
  "suggested_xp": number (between 5 and 50),
  "is_gibberish": boolean,
  "reason": "Brief 1-sentence explanation mentioning the scale/volume"
}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Quest Title: "${title}"\nDescription: "${description || "None"}"` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 180,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const parsed: TaskClassificationResult = JSON.parse(json.choices[0].message.content);
        // Ensure suggested_xp is within safe boundaries
        parsed.suggested_xp = Math.min(50, Math.max(5, Number(parsed.suggested_xp) || 20));
        return NextResponse.json(parsed);
      }
    } catch (llmErr) {
      console.warn("LLM API Call failed or timed out, falling back to heuristics:", llmErr);
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

