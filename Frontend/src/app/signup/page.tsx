"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resilientFetch } from "@/lib/api";
import { Scale, Lock, Mail, User, Building2, Globe2, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("Hindi (हिन्दी)");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const indianLanguages = [
    "Hindi (हिन्दी)",
    "Tamil (தமிழ்)",
    "Telugu (తెలుగు)",
    "Bengali (বাংলা)",
    "Marathi (मराठी)",
    "Gujarati (ગુજરાતી)",
    "Kannada (ಕನ್ನಡ)",
    "Malayalam (മലയാളം)",
    "Punjabi (ਪੰਜਾਬੀ)",
    "Odia (ଓଡ଼ିଆ)",
    "English"
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await resilientFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          organization: organization.trim() || "Independent Practice",
          preferred_language: preferredLanguage
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to register account. Please try again.");
      }

      const data = await res.json();
      localStorage.setItem("legalens_user", JSON.stringify(data.user));
      localStorage.setItem("legalens_auth_token", data.token);
      localStorage.setItem("legalens_auth_type", "signup");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-serif font-black text-base shadow-xs">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-neutral-900">
            LEGALENS
          </span>
        </Link>

        <Link
          href="/login"
          className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          Already have an account? Sign In →
        </Link>
      </header>

      {/* Main Signup Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-sm max-w-lg w-full space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 font-serif tracking-tight">
              Create Legalens Account
            </h1>
            <p className="text-xs text-neutral-500">
              Join India&apos;s authoritative grounded legal intelligence & vernacular literacy platform.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adv. Priya Sharma / Citizen"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@chambers.in"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Affiliation / Chamber
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="High Court / Chambers"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Preferred Regional Language
                </label>
                <div className="relative">
                  <Globe2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors appearance-none cursor-pointer"
                  >
                    {indianLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-neutral-700">
                  Password
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">Min. 6 chars</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Data Logging • Grounded in Indian Law</span>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-neutral-400">
        © 2026 Legalens. Educational & civic legal literacy platform.
      </footer>
    </div>
  );
}
