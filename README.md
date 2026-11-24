# PrimeShield Group - Real Estate & Insurance Advisory Platform

A responsive, modern, professional 5-page web platform created for **PrimeShield Group**, a premier real estate acquisition and institutional insurance advisory business led by Founder **Teekaraman.P**.

---

## Brand Identity & Aesthetic
- **Colors**: Deep Navy (`#060C18`, `#0B1528`) paired with rich metallic Gold accents (`#D4AF37`, `#F5DF88`), subtle glassmorphism cards, and gold ambient glow.
- **Typography**: Cinzel (classic luxury serif for brand headings and titles) & Plus Jakarta Sans (ultra-clean, highly readable modern sans-serif for UI and forms).
- **Layout**: Mobile-first architecture, fully responsive across smartphones, tablets, laptops, and ultra-wide desktops.
- **Floating WhatsApp**: Present on every page with speed-dial to Teekaraman.P (+91 9962699649) and Advisory Support (+91 8148603963).

---

## 5-Page Overview

### PAGE 1 – Home (Brand)
- **Strict Brand Focus**: Exclusively presents the brand name **"PrimeShield Group"**, a refined brand tagline, and navigation buttons to the other 4 pages.
- **No Villa Clutter**: Absolutely no villa listings, prices, or square footage details are displayed on this page.
- **Background Customization Panel (Small Settings Icon)**:
  - Switch seamlessly between High-Res Villa Image and Looping Video Walkthroughs.
  - Upload custom image or video files directly from local storage with real-time preview.
  - Choose from curated preset villa backgrounds.
  - Dynamic sliders to control **Overlay Darkness** (20% to 95%) and **Background Blur** (0px to 16px) with persistent local memory.

### PAGE 2 – About and Services
- **Founder Section**:
  - Highlights Founder **Teekaraman.P** with an executive portrait emblem, credentials, and vision statement.
  - Quick tap-to-call and direct WhatsApp links to Teekaraman.P.
  - Trust credentials: 100% Legal Title Verification, Top 3 Insurer Partnerships, and SGIM Corridor specialization.
- **Comprehensive Services Spectrum (5 Cards)**:
  1. **Real Estate Advisory** (Clear titles, DTCP & RERA approved SGIM gated communities)
  2. **Life Insurance** (Term protection, retirement continuity, child education security)
  3. **General Insurance** (Motor, property, natural disaster, and asset protection)
  4. **Health Insurance** (Cashless hospitalization across 10,000+ hospitals, critical illness covers)
  5. **Industrial Health & Safety Insurance** (Workmen Compensation Act compliance, plant hazard liability, factory safety shields)

### PAGE 3 – Real Estate (SGIM Region)
- **Approved SGIM Projects Showcase**:
  - **Chola's Empire** (Imperial living, royal entrance, wide 40ft avenues, lands & duplex villas)
  - **Temple Town** (Pure Vaastu orientation, serene heritage precinct, immediate registration ready)
  - **Vateka** (Eco-smart modern township, solar infrastructure, luxury smart villas)
- **Real Estate Enquiry & Customization Form**:
  - Selection and filling only:
    - **Property Type**: Land / Plot or Luxury Villa (Radio buttons)
    - **Project**: Chola's Empire, Temple Town, or Vateka (Dropdown)
    - **Budget Range**: Interactive slider from ₹95 Lakhs to ₹1.5 Crores
    - **Square Feet**: Dropdown (1200, 1500, 1800, 2400, 3000+ sq.ft)
    - **User Details**: Name, 10-digit mobile number, email ID, location
    - **Visiting On**: Date picker (with past date protection) & Time slot selector
  - Validation: Prevents past dates, enforces 10-digit phone and valid email.
  - Instant submission feedback with pre-filled WhatsApp forwarding button to Teekaraman.P.
- **Villa Listings Section (Admin-Managed, Unlimited)**:
  - Each villa card displays: Title, Located Area, Sq.Ft, BHK configuration, status badge, and pricing.
  - **Up to 5 images per villa**: Interactive multi-photo lightbox modal with thumbnails, image counter, and next/previous keyboard controls (`Left`/`Right`/`Esc`).
  - **"Contact on WhatsApp" Button**: Opens WhatsApp with an automatic pre-filled message specifying that exact villa's name, project, area, and square footage.

### PAGE 4 – Insurance
- **Authorized Partner Insurers**:
  - **HDFC** (HDFC Life & HDFC ERGO)
  - **TVS Galaxy Health Insurance**
  - **Central Bank of India** (Bancassurance & Security)
  - Interactive partner cards that highlight upon selection and synchronize with the enquiry form.
- **Insurance Consultation Enquiry Form**:
  - Selected Insurer (HDFC / TVS Galaxy / Central Bank of India)
  - Insurance Type (Life, Health, General, Industrial Health, Industrial Safety)
  - Client Details (Name, 10-digit mobile, email, primary income source, work/profession, location)
  - Consultation Date (no past dates) & Time slot
  - Validation, local + backend persistence, and instant WhatsApp dispatch.

### PAGE 5 – Contact / More Information
- **Executive Contact Directory**:
  - Founder: **Teekaraman.P**
  - Tap-to-Call direct numbers: **+91 99626 99649** and **+91 79044 95355**
  - WhatsApp Click-to-Chat buttons: **+91 99626 99649** and **+91 81486 03963**
- **Interactive SGIM Territory Map**:
  - Stylized interactive radar vector map visualizing PrimeShield Headquarters, Chola's Empire, Temple Town, and Vateka with location pins.
- **FAQ Accordion & Comprehensive Footer**: Quick links, legal disclaimers, and admin console launch.

---

## Admin Portal (Unlimited Villa Inventory & Leads)
- **Password Protected**: Default password: `prime`.
- **Villa Inventory CRUD**:
  - Add unlimited new villas with up to 5 photos, area, sqft, price tag, project, and status.
  - Edit existing villa listings in real-time.
  - Delete retired listings.
- **Customer Leads Console**:
  - Displays all real estate and insurance enquiries with full timestamp, client name, phone, email, and scheduled visit date/time.
  - Direct 1-click **"Export Leads (CSV)"** for CRM or Excel import.
  - 1-click WhatsApp chat link to message the prospective client immediately.

---

## Quick Start & Setup Instructions

### Option 1: Standalone Client-Side (No Installation Required)
Double-click `index.html` in your file explorer or open it in any modern browser (Chrome, Edge, Safari, Firefox).
- All 5 pages, transitions, villa galleries, background engine, local storage database, and WhatsApp routing function **100% out of the box** with zero installation!

### Option 2: Run with Python Backend Server
Run the included zero-dependency Python server:
```bash
python server.py
```
1. Open your browser and navigate to: **`http://localhost:8000`**
2. The server initializes an SQLite database (`primeshield.db`) and serves both static assets and REST API endpoints (`/api/enquiries`, `/api/villas`).
3. Whenever a client submits an enquiry, the backend logs it, saves it to SQLite, and outputs the pre-filled WhatsApp dispatch URL.

---

## File Structure
```
NEXALIFE GROUPS/
├── index.html           # Core 5-page responsive application
├── css/
│   └── custom.css       # Deep navy & gold theme, glassmorphism, animations
├── js/
│   ├── data.js          # Seed data (projects, villas, partners, services, presets)
│   ├── background.js    # Background customization engine & file uploader
│   ├── realestate.js    # SGIM projects, form validation, gallery & lightbox
│   ├── insurance.js     # Partner insurer selector & insurance consultation form
│   ├── admin.js         # Password-protected admin CRUD & leads CSV export
│   └── app.js           # 5-page router, floating WhatsApp drawer, interactive map
├── server.py            # Python 3 standard library HTTP + SQLite backend server
└── README.md            # Documentation & setup instructions
```

---

## Compliance & Contact
- **Founder & MD**: Teekaraman.P
- **Phone**: +91 9962699649 | +91 7904495355
- **WhatsApp**: +91 9962699649 | +91 8148603963
- **Primary Region**: SGIM Growth Corridor, Tamil Nadu, India
