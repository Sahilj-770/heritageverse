import Link from "next/link";
import { Landmark, Globe2, ShieldCheck, HeartHandshake, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#282522] text-[#F5F1E8] pt-16 pb-12 border-t border-[#332F2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & SDG Statement */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-display-archivo text-xl font-black text-[#F5F1E8] uppercase tracking-tight">
                HERITAGEVERSE
              </span>
              <span className="text-[9px] font-bold tracking-[0.22em] text-[#B18A55] uppercase mt-1">
                AN ARCHIVE OF LIGHT CAST IN STONE
              </span>
            </div>
            <p className="text-xs text-[#E4DDD0]/80 leading-relaxed">
              Discover the past. Preserve it for the future. An interactive digital heritage discovery and participatory preservation platform across India.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#B18A55] font-semibold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>Dedicated to UN SDG Target 11.4</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B18A55] mb-4">
              Explore Heritage
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E4DDD0]/80">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  National Directory (17 Sites)
                </Link>
              </li>
              <li>
                <Link href="/heritage/taj-mahal" className="hover:text-white transition-colors">
                  Taj Mahal (Agra, Uttar Pradesh)
                </Link>
              </li>
              <li>
                <Link href="/heritage/qutub-minar" className="hover:text-white transition-colors">
                  Qutub Minar (Delhi)
                </Link>
              </li>
              <li>
                <Link href="/heritage/hampi-virupaksha" className="hover:text-white transition-colors">
                  Hampi (Vijayanagara, Karnataka)
                </Link>
              </li>
              <li>
                <Link href="/heritage/ellora-caves" className="hover:text-white transition-colors">
                  Kailasa Temple (Ellora, Maharashtra)
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Interactive Geographic Map of India
                </Link>
              </li>
            </ul>
          </div>

          {/* Conservation & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B18A55] mb-4">
              Preservation & Voices
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E4DDD0]/80">
              <li>
                <Link href="/conservation" className="hover:text-white transition-colors">
                  Conservation Knowledge Hub
                </Link>
              </li>
              <li>
                <Link href="/conservation#report" className="hover:text-white transition-colors">
                  Report a Site Concern
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Community Archive & Oral Histories
                </Link>
              </li>
              <li>
                <Link href="/community#submit" className="hover:text-white transition-colors">
                  Submit a Story or Photograph
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Methodology & Authenticity
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Open Heritage Statement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B18A55] mb-4">
              Academic & Civic Integrity
            </h4>
            <div className="p-4 rounded-2xl bg-[#332F2C] border border-[#4A4440] text-xs text-[#E4DDD0]/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[#F5F1E8] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#B18A55]" />
                Pilot Academic Sandbox
              </div>
              <p>
                Demonstrates realistic digital heritage stewardship for Pune & Western Ghats. All community submissions undergo peer-curator review before publication.
              </p>
              <div className="pt-1 text-[11px] text-[#B18A55]">
                Assets licensed under Creative Commons & Open Heritage Archives.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-[#332F2C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#968D85] gap-4">
          <p>© 2026 HeritageVerse • ATRIUM MTL. Academic Capstone Demonstration. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Attributions & Sources
            </Link>
            <Link href="/conservation" className="hover:text-white transition-colors">
              SDG 11.4 Principles
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Curator Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
