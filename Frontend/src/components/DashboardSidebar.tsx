"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FileSearch,
  GitCompare,
  Languages,
  ShieldCheck,
  MessageSquare,
  ListTodo,
  Sparkles
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home, subtitle: "" },
    { label: "LexiLens", href: "/lexilens", icon: BookOpen, subtitle: "Understand" },
    { label: "ClauseLens", href: "/clauselens", icon: FileSearch, subtitle: "Analyze" },
    { label: "CompareLens", href: "/comparelens", icon: GitCompare, subtitle: "Compare" },
    { label: "VaaniLens", href: "/vaanilens", icon: Languages, subtitle: "In Your Language" },
    { label: "DigitalLens", href: "/digitallens", icon: ShieldCheck, subtitle: "Verify" },
    { label: "QueryLens", href: "/querylens", icon: MessageSquare, subtitle: "Ask" },
    { label: "ActionLens", href: "/actionlens", icon: ListTodo, subtitle: "Next Steps" },
  ];

  return (
    <aside className="w-64 bg-[#141414] text-white min-h-screen flex flex-col justify-between p-4 border-r border-[#262626]">
      <div>
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-4 mb-4 group">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/logo_updated.png"
              alt="Legalens Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-brush text-2xl tracking-wider text-white uppercase">
            LEGALENS
          </span>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#262626] text-white shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-[#1f1f1f]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  {item.subtitle && (
                    <span className="text-[11px] text-neutral-400 font-normal -mt-0.5">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card */}
      <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Upgrade to Pro</div>
            <div className="text-[11px] text-neutral-400">Unlock advanced features</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
