"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resilientFetch } from "@/lib/api";
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Shield,
  FileText,
  Languages,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import BackButton from "./BackButton";

interface DashboardTopNavProps {
  title?: string;
  showBack?: boolean;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  action_url: string;
  is_read: boolean;
  timestamp: string;
}

export default function DashboardTopNav({ title, showBack = false }: DashboardTopNavProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState({
    full_name: "Vaibhav Shaw",
    email: "vaibhav@legalens.ai",
    plan: "Free Plan",
    avatar_initials: "V"
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load user profile and notifications on mount
  useEffect(() => {
    // 1. Load user from localStorage if logged in
    const storedUser = localStorage.getItem("legalens_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserProfile({
          full_name: parsed.full_name || "Vaibhav Shaw",
          email: parsed.email || "vaibhav@legalens.ai",
          plan: parsed.plan || "Free Plan",
          avatar_initials: parsed.avatar_initials || "V"
        });
      } catch {
        // use default
      }
    } else {
      // Fetch from backend profile
      resilientFetch("/api/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUserProfile({
              full_name: data.full_name || "Vaibhav Shaw",
              email: data.email || "vaibhav@legalens.ai",
              plan: data.plan || "Free Plan",
              avatar_initials: data.avatar_initials || "V"
            });
            localStorage.setItem("legalens_user", JSON.stringify(data));
          }
        })
        .catch(() => {});
    }

    // 2. Fetch notifications
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await resilientFetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch {
      // Fallback offline mock notifications if backend temporarily unavailable
      setNotifications([
        {
          id: 1,
          title: "Contract Risk Audit Complete",
          message: "Senior_Software_Engineer_Agreement.pdf analyzed with 4 high-risk restrictive covenants.",
          category: "document",
          action_url: "/clauselens",
          is_read: false,
          timestamp: "Just now"
        },
        {
          id: 2,
          title: "Statutory Compliance Alert",
          message: "Digital Personal Data Protection Act (DPDPA 2023) statutory compliance guidelines issued.",
          category: "statutory",
          action_url: "/digitallens",
          is_read: false,
          timestamp: "10m ago"
        },
        {
          id: 3,
          title: "VaaniLens Document Engine Active",
          message: "Multi-language document translation & OCR is ready for regional Hindi, Tamil, and Bengali dialects.",
          category: "translation",
          action_url: "/vaanilens",
          is_read: false,
          timestamp: "1h ago"
        }
      ]);
      setUnreadCount(3);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await resilientFetch("/api/notifications/read-all", { method: "POST" });
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    try {
      await resilientFetch(`/api/notifications/${item.id}/read`, { method: "POST" });
    } catch {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setShowNotifications(false);
    if (item.action_url) {
      router.push(item.action_url);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("legalens_user");
    localStorage.removeItem("legalens_auth_token");
    router.push("/login");
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "document":
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case "statutory":
        return <Shield className="w-3.5 h-3.5 text-emerald-600" />;
      case "translation":
        return <Languages className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <header className="h-16 border-b border-[#e5e5e5] bg-white px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4">
        {showBack && <BackButton href="/dashboard" label="Back to Dashboard" />}
        {title && <h2 className="text-base font-semibold text-neutral-900">{title}</h2>}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Interactive Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className={`w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors relative cursor-pointer ${
              showNotifications ? "bg-neutral-100 text-black border-neutral-400" : ""
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-neutral-500 hover:text-black font-medium transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !item.is_read ? "bg-amber-50/30" : ""
                      }`}
                    >
                      <div className="w-7 h-7 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-neutral-100 bg-neutral-50/50 text-center">
                <Link
                  href="/clauselens"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                >
                  <span>View All Document Audits</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Interactive User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-neutral-200 hover:opacity-85 transition-opacity cursor-pointer p-1 rounded-xl ${
              showProfileMenu ? "bg-neutral-50" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {userProfile.avatar_initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-neutral-900 leading-tight">
                {userProfile.full_name}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                <span>{userProfile.plan}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </div>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-neutral-100 bg-neutral-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {userProfile.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {userProfile.full_name}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {userProfile.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                      {userProfile.plan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5 text-xs text-neutral-700">
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 hover:text-black transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium">Profile & Account Settings</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 hover:text-black transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium">My Legalens Workspace</span>
                </Link>
              </div>

              <div className="p-1.5 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
