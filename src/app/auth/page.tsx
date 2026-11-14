"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeritageStore } from "@/lib/heritageStore";
import { UserRole } from "@/types/heritage";
import { Landmark, Shield, UserCheck, Eye, LogIn, Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("curator@heritageverse.org");
  const [name, setName] = useState("Dr. Ananya Chitnis");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    HeritageStore.setUser({
      id: "usr-" + Date.now(),
      name: name || "Heritage Enthusiast",
      email: email || "user@heritageverse.org",
      role: selectedRole,
      createdAt: new Date().toISOString(),
    });

    setSuccessMsg(`Signed in successfully as ${selectedRole.toUpperCase()}!`);
    window.dispatchEvent(new Event("heritageverse_role_changed"));

    setTimeout(() => {
      if (selectedRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 800);
  };

  const handleQuickDemoRole = (role: UserRole) => {
    const rolesData = {
      visitor: { name: "Aditi Joshi", email: "aditi.visitor@gmail.com" },
      contributor: { name: "Sneha Kulkarni", email: "sneha.kulkarni@heritageverse.org" },
      admin: { name: "Dr. Ananya Chitnis (Curator)", email: "ananya.curator@heritageverse.org" },
    };

    const chosen = rolesData[role];
    HeritageStore.setUser({
      id: "usr-demo-" + role,
      name: chosen.name,
      email: chosen.email,
      role: role,
      createdAt: new Date().toISOString(),
    });

    window.dispatchEvent(new Event("heritageverse_role_changed"));
    setSuccessMsg(`Switched directly into ${role.toUpperCase()} persona.`);
    setTimeout(() => {
      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#181615] flex items-center justify-center text-[#C5A059] mx-auto border border-[#C5A059]/40 shadow-sm">
          <Landmark className="w-6 h-6" />
        </div>
        <h1 className="font-serif-editorial text-3xl font-bold text-[#181615]">
          HeritageVerse Portal
        </h1>
        <p className="text-xs text-[#68615A]">
          Authentication & Role-Based Access for SDG 11.4 Demonstration
        </p>
      </div>

      {/* Quick Demo Role Selectors (Academic demo convenience) */}
      <div className="bg-[#FAF4E5] p-4 rounded-2xl border border-[#C5A059]/40 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#181615]">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          Instant Demo Persona Switcher:
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleQuickDemoRole("visitor")}
            className="p-2 rounded-xl bg-white border border-[#E6DED4] hover:border-[#181615] text-left"
          >
            <Eye className="w-3.5 h-3.5 text-[#68615A] mb-1" />
            <div className="font-bold text-[#181615]">Visitor</div>
            <div className="text-[10px] text-[#938A82]">Read & Tour</div>
          </button>

          <button
            onClick={() => handleQuickDemoRole("contributor")}
            className="p-2 rounded-xl bg-white border border-[#E6DED4] hover:border-[#181615] text-left"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#9B783E] mb-1" />
            <div className="font-bold text-[#181615]">Contributor</div>
            <div className="text-[10px] text-[#938A82]">Submit Stories</div>
          </button>

          <button
            onClick={() => handleQuickDemoRole("admin")}
            className="p-2 rounded-xl bg-white border border-[#C5A059] hover:bg-[#FAF4E5] text-left"
          >
            <Shield className="w-3.5 h-3.5 text-[#C85A32] mb-1" />
            <div className="font-bold text-[#181615]">Curator</div>
            <div className="text-[10px] text-[#938A82]">Admin Console</div>
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E6DED4] shadow-sm space-y-6">
        
        {/* Sign In vs Register Tabs */}
        <div className="flex border-b border-[#E6DED4]">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 pb-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === "signin"
                ? "border-[#181615] text-[#181615]"
                : "border-transparent text-[#938A82] hover:text-[#181615]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 pb-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === "register"
                ? "border-[#181615] text-[#181615]"
                : "border-transparent text-[#938A82] hover:text-[#181615]"
            }`}
          >
            Register Profile
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-semibold text-[#181615] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Deshpande"
                className="w-full py-2.5 px-3 rounded-xl border border-[#E6DED4] bg-[#FBF9F5] text-xs text-[#181615] focus:outline-none focus:border-[#C5A059]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#181615] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@heritageverse.org"
              className="w-full py-2.5 px-3 rounded-xl border border-[#E6DED4] bg-[#FBF9F5] text-xs text-[#181615] focus:outline-none focus:border-[#C5A059]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181615] mb-1.5">
              Password
            </label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full py-2.5 px-3 rounded-xl border border-[#E6DED4] bg-[#FBF9F5] text-xs text-[#181615] focus:outline-none focus:border-[#C5A059]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181615] mb-1.5">
              Role Permission Scope
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#E6DED4] bg-[#FBF9F5] text-xs text-[#181615] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="visitor">Visitor (Standard Explorer)</option>
              <option value="contributor">Contributor (Submit Oral Histories & Photos)</option>
              <option value="admin">Curator Admin (Moderate & Manage Monuments)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#181615] hover:bg-[#262220] text-[#FAF4E5] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <LogIn className="w-4 h-4 text-[#C5A059]" />
            {activeTab === "signin" ? "Sign In to HeritageVerse" : "Create Account"}
          </button>
        </form>

      </div>

    </div>
  );
}
