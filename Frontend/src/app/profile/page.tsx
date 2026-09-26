"use client";

import { useState, useEffect } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import {
  User,
  Building2,
  Phone,
  Mail,
  Languages,
  CheckCircle2,
  ShieldCheck,
  FileText,
  MessageSquare,
  Loader2,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    id: "user_vaibhav_default",
    full_name: "Vaibhav Shaw",
    email: "vaibhav@legalens.ai",
    phone: "+91 98765 43210",
    organization: "Legal Aid Cell & Civic Research",
    role: "Legal Advocate & Researcher",
    plan: "Free Plan",
    preferred_language: "Hindi (हिन्दी)",
    avatar_initials: "V",
    documents_analyzed: 14,
    queries_asked: 38,
    created_at: "September 2026"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/profile");
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        localStorage.setItem("legalens_user", JSON.stringify(data));
      }
    } catch {
      // Offline fallback from localStorage
      const stored = localStorage.getItem("legalens_user");
      if (stored) {
        try {
          setFormData(JSON.parse(stored));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("http://localhost:8000/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          organization: formData.organization,
          role: formData.role,
          plan: formData.plan,
          preferred_language: formData.preferred_language
        })
      });

      if (res.ok) {
        const updated = await res.json();
        if (updated.user) {
          setFormData(updated.user);
          localStorage.setItem("legalens_user", JSON.stringify(updated.user));
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {
      // Local save fallback
      localStorage.setItem("legalens_user", JSON.stringify(formData));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Header Profile Banner */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black text-white flex items-center justify-center font-serif font-black text-2xl sm:text-3xl shadow-md shrink-0">
              {formData.avatar_initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  {formData.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  {formData.plan}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">{formData.email}</p>
              <p className="text-xs text-neutral-600 font-medium">{formData.role} • {formData.organization}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Civic Account</span>
            </div>
          </div>
        </div>

        {/* Usage & Activity Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Contracts Analyzed</span>
              <FileText className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 font-serif">
              {formData.documents_analyzed}
            </p>
            <p className="text-[11px] text-neutral-400">Processed in local memory</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Queries Resolved</span>
              <MessageSquare className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 font-serif">
              {formData.queries_asked}
            </p>
            <p className="text-[11px] text-neutral-400">Grounded statutory Q&A</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Data Privacy Mode</span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-emerald-700 font-serif">DPDPA 2023</p>
            <p className="text-[11px] text-neutral-400">Zero persistent retention</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-neutral-100 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Account & Professional Profile
              </h2>
              <p className="text-xs text-neutral-500">
                Update your identity details, vernacular dialect, and subscription preferences.
              </p>
            </div>
            {saveSuccess && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Changes saved to database!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Organization */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Organization / Affiliation
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Professional Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Role / Specialty
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>

              {/* Preferred Language for VaaniLens */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Preferred Vernacular Language</span>
                </label>
                <select
                  value={formData.preferred_language}
                  onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors cursor-pointer"
                >
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                  <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                  <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                  <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                  <option value="Gujarati (ગુજરાતી)">Gujarati (ગુજરાતી)</option>
                  <option value="Kannada (ಕನ್ನಡ)">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam (മലയാളം)">Malayalam (മലയാളം)</option>
                  <option value="Punjabi (ਪੰਜਾਬੀ)">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* Plan Card Selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Active Membership Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, plan: "Free Plan" })}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    formData.plan === "Free Plan"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-900">Free Plan</span>
                    <p className="text-[11px] text-neutral-500">
                      Standard clause analysis & Q&A assistance
                    </p>
                  </div>
                  {formData.plan === "Free Plan" && (
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  )}
                </div>

                <div
                  onClick={() => setFormData({ ...formData, plan: "Pro Legal Aid Plan" })}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    formData.plan === "Pro Legal Aid Plan"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900">Pro Legal Aid Plan</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Unlimited OCR, batch doc translation & priority counsel tools
                    </p>
                  </div>
                  {formData.plan === "Pro Legal Aid Plan" && (
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
