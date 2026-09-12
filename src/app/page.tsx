import Link from "next/link";
import { Sparkles, Sword } from "lucide-react";
import { redirect } from "next/navigation";

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomeProps) {
  // If Supabase redirected ?code= here (Site URL mismatch fallback),
  // forward it to /auth/callback so the session is properly exchanged.
  const code = searchParams["code"];
  if (code) {
    const codeValue = Array.isArray(code) ? code[0] : code;
    redirect(`/auth/callback?code=${encodeURIComponent(codeValue)}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14] text-slate-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rpg-gold/40 bg-rpg-gold/10 text-rpg-goldLight text-xs tracking-wider uppercase font-pixel animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-rpg-gold" />
          <span>Life RPG Progression Engine</span>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black font-title tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
            Level Up Your Life
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto font-body">
            Transform everyday habits, studies, and chores into an epic RPG journey. Earn XP, rank up your attributes, and claim legendary rewards.
          </p>
        </div>

        {/* Core Attributes Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          {[
            { name: "Intellect", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
            { name: "Strength", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
            { name: "Discipline", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
            { name: "Creativity", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
            { name: "Social", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
          ].map((attr) => (
            <div
              key={attr.name}
              className={`p-3 rounded-lg border ${attr.border} ${attr.bg} flex flex-col items-center gap-1 pixel-box`}
            >
              <span className={`text-xs font-semibold ${attr.color}`}>{attr.name}</span>
              <span className="text-[10px] text-slate-500 font-pixel">LVL 1</span>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="pt-6 flex items-center justify-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wider uppercase font-pixel pixel-btn flex items-center justify-center gap-2.5 shadow-glowGold"
          >
            <Sword className="w-4 h-4" />
            <span>Enter the Realm</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
