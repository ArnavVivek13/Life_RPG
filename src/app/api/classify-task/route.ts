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

  // Difficulty estimation based on length / intensity keywords
  let difficulty: "easy" | "medium" | "hard" = "medium";
  let suggested_xp = 20;

  if (content.includes("quick") || content.includes("easy") || content.includes("5 min") || content.includes("short")) {
    difficulty = "easy";
    suggested_xp = 10;
  } else if (content.includes("complete") || content.includes("exam") || content.includes("marathon") || content.includes("project") || content.includes("deep") || content.includes("hard")) {
    difficulty = "hard";
    suggested_xp = 35;
  }

  return {
    category: bestCategory,
    difficulty,
    suggested_xp,
    is_gibberish: false,
    reason: `Classified as ${bestCategory} via key terms matching.`,
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

    // Attempt OpenAI / Groq Compatible endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout safeguard

      const systemPrompt = `You are the Quest Master AI for an RPG life tracking app. 
Classify the user's quest into exactly ONE of these categories:
- "Intellect" (coding, study, reading, research)
- "Strength" (gym, workout, sports, physical activity)
- "Discipline" (chores, routine, cleaning, budgeting, organizing)
- "Creativity" (art, design, music, creative writing)
- "Social" (friends, family, networking, communication)

Estimate difficulty: "easy" (10 XP), "medium" (20 XP), "hard" (35 XP).
Detect if the title/description is gibberish/spam/invalid.

Respond ONLY with valid JSON in this structure:
{
  "category": "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social",
  "difficulty": "easy" | "medium" | "hard",
  "suggested_xp": 10 | 20 | 35,
  "is_gibberish": boolean,
  "reason": "Brief 1-sentence reason"
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
          max_tokens: 150,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const parsed: TaskClassificationResult = JSON.parse(json.choices[0].message.content);
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
