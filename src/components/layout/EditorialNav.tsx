"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeritageStore } from "@/lib/heritageStore";
import { UserRole } from "@/types/heritage";
import { Menu, X, Landmark, Bookmark } from "lucide-react";

export function EditorialNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>("visitor");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const user = HeritageStore.getUser();
      setRole(user.role);
      setSavedCount(HeritageStore.getSavedMonumentIds().length);
    };

    update();
    window.addEventListener("heritageverse_role_changed", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("heritageverse_role_changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const navLinks = [
    { href: "/explore", label: "Directory" },
    { href: "/map", label: "Map" },
    { href: "/plan-trip", label: "Trip Planner" },
    { href: "/conservation", label: "Conservation" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#E4DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Clean Brand Mark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#282522] flex items-center justify-center text-[#B18A55]">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display-archivo text-xl font-black text-[#282522] tracking-tight leading-none group-hover:text-[#713C3C] transition-colors">
                HERITAGEVERSE
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#713C3C] uppercase mt-0.5">
                SDG 11.4 • National Heritage Archive
              </span>
            </div>
          </Link>

          {/* Simple, Clean Nav Links (No bloated pills) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-[#713C3C] border-b-2 border-[#713C3C] pb-0.5"
                      : "text-[#6B635D] hover:text-[#282522]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area: Saved + Auth Portal */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#6B635D] hover:text-[#282522] flex items-center gap-1.5 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#B18A55]" />
              <span>Saved ({savedCount})</span>
            </Link>

            {role === "admin" && (
              <Link
                href="/admin"
                className="text-xs font-bold text-[#713C3C] hover:text-[#282522] uppercase tracking-wider"
              >
                Curator Console
              </Link>
            )}

            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#282522]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#282522]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4DDD0] bg-[#F5F1E8] px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#282522] py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E4DDD0] flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#6B635D]"
            >
              Saved Monuments ({savedCount})
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#282522] text-[#F5F1E8]"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
