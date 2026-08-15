# Ayojan Wale — PRD

## Original Problem Statement
Build "Ayojan Wale", an Indian event-planning & vendor marketplace. Homepage blueprint with two customer journeys:
- **Find Vendors** (marketplace): browse photographers, decorators, caterers, makeup, DJs, venues etc. by category / occasion / location.
- **Plan My Event**: create an event, add requirements, explore & choose vendors, (future) book & track.
Design: Indian • Festive • Premium • Warm • Modern • Trustworthy. Base palette Warm Ivory + Royal Plum + Marigold; per-event accent theming. Avoid dark corporate / generic blue SaaS / dashboard-like homepage.

## User Choices
- Scope: Homepage + full flows (Find Vendors + Plan My Event). No auth.
- Data: realistic demo/seed data in MongoDB.
- Images: high-quality stock photos.
- Branding: text logo + premium Indian-festive font (Cormorant Garamond + Manrope).

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`) + `seed_data.py`. MongoDB auto-seeded on startup (categories=11, event-types=8, vendors=14, ideas=4).
  - Endpoints: `GET /api/categories`, `/api/event-types`, `/api/ideas`, `/api/vendors` (filters: category, event_type, city, q), `/api/vendors/cities`, `/api/vendors/{id}`, `POST /api/events`, `GET /api/events/{id}`, `POST /api/leads`.
- **Frontend**: React + Tailwind + shadcn/ui, framer-motion (scroll reveals, kinetic hero), Lenis smooth scroll, react-fast-marquee.
  - Pages: `Home.jsx`, `FindVendors.jsx`, `VendorProfile.jsx`, `PlanEvent.jsx`.
  - Home sections: Hero (two-path), EditorialMarquee, CategoryGrid, EventTypes, HowItWorks, FeaturedVendors, PlanJourney, YourChoice, TrustPillars, Ideas, FinalCTA.

## User Personas
- **Consumer who knows what they need** → Find Vendors marketplace.
- **Consumer unsure where to begin** → Plan My Event wizard.

## Core Requirements (static)
- Emotional two-path homepage, category + occasion discovery, premium vendor cards, 3-step marketplace explainer, 5-step planning journey, trust pillars, ideas/inspiration, per-event accent theming.

## Implemented (2026-06-15)
- Full homepage with all 12 sections, kinetic masked hero reveal, marquee, parallax accent, per-occasion color theming.
- Find Vendors listing with category/occasion/city/search filters + clear.
- Vendor profile with gallery, packages, working enquiry form → `/api/leads`.
- Plan My Event 3-step wizard (details → requirements → review) → `/api/events`, success screen.
- MongoDB seed data. Verified: backend 11/11 pytest, frontend flows 100% (testing agent iteration_1).

## Backlog
- **P1**: User accounts (JWT or Google), saved shortlist persistence, vendor booking + availability + work-progress tracking, event dashboard (My Events / Bookings).
- **P2**: Ideas/blog detail pages + CMS, vendor onboarding portal, reviews submission, real vendor statistics, payments.

## Next Tasks
- Add auth + persistent shortlist; build customer dashboard (My Event / Bookings / Work Progress).
