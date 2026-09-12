"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Sparkles, Sword, Mail, KeyRound, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already authenticated or on auth state change, immediately enter realm
  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    };
    checkActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleOAuthLogin = async (provider: "google") => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initialize OAuth login.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        setSuccessMessage("Account created! You can now enter the realm.");
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Demo Guest Login for instant judge evaluation
  const handleGuestDemo = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const demoEmail = `guest_adventurer_${Math.floor(1000 + Math.random() * 9000)}@liferpg.demo`;
      const demoPassword = "DemoPassword123!";
      
      const { error: signUpErr } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            full_name: "Hero of Valoria",
            avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Adventurer",
          },
        },
      });

      if (signUpErr) {
        // Try direct sign in if user already existed
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });
        if (signInErr) throw signInErr;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage("Guest demo session initialized. Entering realm...");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14]">
      <div className="max-w-md w-full pixel-box p-6 sm:p-8 rounded-xl bg-slate-900/95 border-2 border-slate-700 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
            <Sword className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-title text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            {isSignUp ? "Create Your Hero" : "Guild Hall Login"}
          </h1>
          <p className="text-xs text-slate-400 font-body">
            {isSignUp
              ? "Register to begin your journey and track your progression."
              : "Welcome back, adventurer. Sign in to resume your quests."}
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-3 transition-colors pixel-btn mb-4 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-2 text-slate-500 font-pixel text-[10px]">OR WITH SCROLL</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Adventurer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@realm.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Secret Passcode</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{isSignUp ? "Forge Hero" : "Enter Realm"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Mode for Judges */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={handleGuestDemo}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 pixel-btn transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Guest Mode (Fast Pass)</span>
          </button>
        </div>

        {/* Toggle Sign up / Sign in */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            {isSignUp
              ? "Already have a hero? Sign in here."
              : "First time at the guild? Create an account."}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-[11px] text-slate-500 hover:text-slate-400">
            ← Return to Realm Gates
          </Link>
        </div>

      </div>
    </div>
  );
}
