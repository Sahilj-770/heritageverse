# HeritageVerse: SDG 11 Cultural Heritage Preservation Platform

> **"Discover the past. Preserve it for the future."**  
> Direct alignment: **United Nations Sustainable Development Goal 11 (Sustainable Cities and Communities)** — **Target 11.4: Strengthen efforts to protect and safeguard the world's cultural and natural heritage**.

HeritageVerse is an interactive digital heritage discovery, virtual exploration, and participatory conservation platform. Focused on Maharashtra, India (with Pune and surrounding Sahyadri heritage as the pilot region), it connects verified historical scholarship, 360-degree spatial digital tours, open-source cartography, and community-driven preservation reports.

---

## 🏛️ Key Features

1. **Editorial Heritage Directory (`/explore`)**:
   - Filter by architectural archetype (*Forts & Citadels, Palaces & Mansions, Rock-Cut Caves, Museums*).
   - Filter by historical era (*Ancient, Maratha Empire, Peshwa Era, Colonial*).
   - Instant search across names, vernacular titles (e.g. शनिवार वाडा), locations, and historical descriptions.
   - Bookmark monuments directly to your personal dossier archive.

2. **360° Virtual Tour Experience (`/tour/[slug]`)**:
   - Equirectangular spherical viewer with drag-to-look camera controls, zoom, and heading compass.
   - Chamber-to-chamber navigation (e.g. walk from *Dilli Darwaza* into the *Hazari Karanje* fountain grounds).
   - Spatial interactive hotspots with architectural analyses and historical notes.
   - Informative fallback state for sites undergoing future scanning.

3. **Monument Dossiers (`/heritage/[slug]`)**:
   - Verified architectural and structural breakdown.
   - Historical chronology, builder/patronage details, and verified visiting hours.
   - High-resolution photographic archives with licensing attributions.
   - Primary source citations (ASI records and Bombay Presidency Gazetteers).

4. **Conservation Hub & Reporting (`/conservation`)**:
   - Educational guides on primary regional decay factors (*Monsoon water percolation, root wedging, atmospheric pollution, vandalism*).
   - Citizen field observation form for reporting cracks, weathering, or neglect.
   - Non-governmental disclosure ensuring transparency.

5. **Community Participation & Oral Histories (`/community`)**:
   - Citizen-contributed folklore, elder oral histories, and photographic memories.
   - Curator-in-the-loop moderation workflow ensuring authenticity.

6. **Interactive Leaflet Cartography (`/map`)**:
   - Verified OpenStreetMap GPS pins for all Pune pilot monuments.
   - Dynamic archetype filtering and spatial dossier inspector cards.

7. **User & Curator Portals (`/dashboard` & `/admin`)**:
   - Personal bookmarks, saved dossiers, and submitted contribution status trackers.
   - Admin command center: Manage monument records, moderate community submissions, and triage conservation reports.
   - Interactive demo role switcher (*Visitor*, *Contributor*, *Curator*) in the top banner.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Archival Ivory & Sandstone Editorial Theme)
- **Icons**: Lucide React
- **Mapping**: Leaflet + OpenStreetMap
- **Virtual Tours**: WebGL / Canvas Equirectangular Panorama Engine
- **Database / Storage**: Dual-mode Architecture:
  - **Local Demonstration Mode** (Default, persistent client store, zero API key dependencies).
  - **Supabase Cloud Mode** (PostgreSQL schema with Row-Level Security policies provided in `supabase/migrations/`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18.x` or higher
- npm or pnpm

### 2. Installation
```bash
git clone <repo-url>
cd SDG
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Supabase keys are optional; the application automatically activates local demo mode if omitted).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Test
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
SDG/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Editorial typography & theme shell
│   │   ├── page.tsx                       # Landing page with SDG 11.4 mission
│   │   ├── explore/page.tsx               # Filterable heritage directory
│   │   ├── heritage/[slug]/page.tsx       # Monument detail dossiers
│   │   ├── tour/[slug]/page.tsx           # 360° virtual tour engine
│   │   ├── map/page.tsx                   # Leaflet interactive map
│   │   ├── conservation/page.tsx          # Conservation hub & citizen reporting
│   │   ├── community/page.tsx             # Community stories & submission form
│   │   ├── about/page.tsx                 # Project context & ethical charter
│   │   ├── auth/page.tsx                  # Role-based auth & demo switcher
│   │   ├── dashboard/                     # User dashboard & contribution history
│   │   └── admin/                         # Curator admin, monument CRUD & moderation
│   ├── components/
│   │   ├── layout/                        # Navigation, Footer, RoleBanner
│   │   ├── tour/                          # VirtualTourViewer (360° engine)
│   │   ├── map/                           # HeritageMap (Leaflet)
│   │   └── monuments/                     # MonumentCard component
│   ├── data/
│   │   └── sampleData.ts                  # Peer-verified Pune pilot monument datasets
│   ├── lib/
│   │   └── heritageStore.ts               # Local demonstration repository pattern
│   └── types/
│       └── heritage.ts                    # TypeScript data definitions
├── supabase/
│   └── migrations/                        # PostgreSQL RLS migration file
└── public/                                # Static assets
```

---

## 🏛️ Pilot Region Datasets (Pune, Maharashtra)

1. **Shaniwar Wada** (*1732 CE*) — Principal palace-fort of the Peshwa rulers.
2. **Aga Khan Palace** (*1892 CE*) — Italianate memorial of the Indian Freedom Movement.
3. **Sinhagad Fort** (*1340 CE*) — Sahyadri mountain fortress and 1670 battle site.
4. **Karla Caves** (*c. 160 BCE*) — Ancient Buddhist rock-cut Chaityagriha with 2,000-year-old teak vaults.
5. **Raja Dinkar Kelkar Museum** (*1962*) — Folk art, domestic artifacts, and Mastani Mahal chamber.

---

## 📜 Academic Integrity & Open Licenses
- Historical descriptions and architectural terminology verified against **Archaeological Survey of India (ASI)** and **Gazetteer of the Bombay Presidency (1885)**.
- Photography licensed under **Creative Commons (CC-BY-SA 4.0)** and **Unsplash Open Heritage**.
- Geospatial mapping data © **OpenStreetMap contributors**.
