/**
 * PrimeShield Group - Initial Seed Data & Configurations
 */

const DEFAULT_PRESETS = {
  images: [
    {
      id: 'img-1',
      title: 'Ultra Luxury Palm Villa',
      thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
      url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=85'
    },
    {
      id: 'img-2',
      title: 'Modern Architectural Estate',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85'
    },
    {
      id: 'img-3',
      title: 'Twilight Infinity Pool Residence',
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85'
    },
    {
      id: 'img-4',
      title: 'Majestic Royal Courtyard Villa',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'
    }
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Luxury Villa Drone Walkthrough',
      thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-pool-and-villa-42491-large.mp4'
    },
    {
      id: 'vid-2',
      title: 'Sunset Modern Architectural Estate',
      thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-during-the-evening-44331-large.mp4'
    }
  ]
};

const SGIR_PROJECTS = [
  {
    id: 'cholas-empire',
    name: "Chola's Empire",
    tagline: 'Imperial Living Meets Unrivaled Heritage in SGIR',
    type: 'Exclusive Lands & Sovereign Villas',
    priceStarting: '₹95 Lakhs',
    location: 'SGIR Prime Growth Corridor, Grand Trunk Highway',
    description: "Inspired by the timeless grandeur of the Cholas, this gated sanctuary spans verdant acres featuring wide 40ft blacktop avenues, underground electrical cabling, royal clubhouse, and round-the-clock biosecurity.",
    highlights: ['DTCP & RERA Approved', 'Clubhouse & Royal Arch', 'Avenue Plantations', '100% Clear Title', 'Ready for Construction'],
    unitsAvailable: 'Plots: 1200 - 3500 sq.ft | Villas: 3 & 4 BHK Duplex'
  },
  {
    id: 'temple-town',
    name: 'Temple Town',
    tagline: 'Sacred Harmony & Pure Vaastu Sanctuary',
    type: 'Bespoke Villas & Vaastu-Compliant Lands',
    priceStarting: '₹98 Lakhs',
    location: 'SGIR Heritage Precinct, Near Sacred Shrines',
    description: "Immerse your family in peaceful tranquility. Temple Town blends serene spirituality with first-class infrastructure: purified water lines, temple architecture motif parks, walking promenades, and pure Vaastu orientations.",
    highlights: ['100% Vaastu Compliant', 'Abundant Potable Water', 'Heritage Landscape Gardens', '24/7 Monitored Gating', 'Instant Registration'],
    unitsAvailable: 'Plots: 1500 - 4000 sq.ft | Villas: 3 BHK Heritage Design'
  },
  {
    id: 'vateka',
    name: 'Vateka',
    tagline: 'Futuristic Eco-Township & Smart Architectural Living',
    type: 'Ultra-Modern Villas & Investment Plots',
    priceStarting: '₹1.15 Crores',
    location: 'SGIR Tech & Industrial Expressway Zone',
    description: "Designed for the modern visionary, Vateka offers contemporary architectural villas nestled within lush greenery, solar-powered pathways, private swimming pools, and high-capital-appreciation acreage.",
    highlights: ['Smart Home Automation', 'Eco-Sol Energy Systems', 'Private Infinity Decks', 'Multi-Sport Courts', 'High Rental Yield Zone'],
    unitsAvailable: 'Plots: 1800 - 5000 sq.ft | Villas: 4 & 5 BHK Smart Villas'
  }
];

const INITIAL_VILLAS = [
  {
    id: 'villa-101',
    title: "The Chola Imperial Duplex",
    project: "Chola's Empire",
    area: "SGIR Prime Avenue, Sector 1",
    sqft: 2450,
    bhk: "4 BHK Duplex",
    priceDisplay: "₹1.28 Crores",
    status: "Ready to Move",
    description: "Magnificent double-height living foyer with teak woodwork, private terrace lounge, modular Italian kitchen, and manicured private garden.",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 'villa-102',
    title: "Temple Town Sanctorum Residence",
    project: "Temple Town",
    area: "SGIR Heritage Sanctum, Plot 42",
    sqft: 1850,
    bhk: "3 BHK Independent Villa",
    priceDisplay: "₹98 Lakhs",
    status: "Under Construction (Possession Soon)",
    description: "East-facing pure Vaastu villa with skylit central courtyard, marble flooring, private puja chamber, solar water heater, and serene garden verandah.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 'villa-103',
    title: "Vateka Green Haven Signature Villa",
    project: "Vateka",
    area: "SGIR Eco-Boulevard, Phase 2",
    sqft: 2900,
    bhk: "4 BHK Luxury Villa",
    priceDisplay: "₹1.45 Crores",
    status: "Brand New Ready",
    description: "Architectural masterpiece with glass curtain walls, private plunge pool, master suite with walk-in closet, EV charging bay, and smart home automation.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 'villa-104',
    title: "Chola's Rajendra Sovereign Estate",
    project: "Chola's Empire",
    area: "SGIR Grand Boulevard, Corner Plot 1",
    sqft: 3250,
    bhk: "5 BHK Ultra-Spacious Manor",
    priceDisplay: "₹1.60 Crores",
    status: "Ready for Registration",
    description: "Palatial 3250 sq.ft villa featuring private home theatre space, 2-car covered porch, expansive rooftop entertainment deck, and premium German bath fittings.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

const SERVICES_DATA = [
  {
    id: 'real-estate',
    title: 'Real Estate Advisory',
    icon: 'fa-building-shield',
    tagline: 'Strategic Acquisitions & Gated Communities in SGIR',
    desc: 'Uncompromising legal verification, DTCP/RERA compliance, and high-capital-appreciation lands and bespoke luxury villas in top-tier SGIR townships.',
    points: [
      '100% Encumbrance-Free Clear Titles',
      'Exclusive Villa Customization & Construction',
      'High Returns in SGIR Growth Corridor',
      'End-to-End Legal & Registration Concierge'
    ],
    targetPage: 'page-realestate'
  },
  {
    id: 'life-insurance',
    title: 'Life Insurance',
    icon: 'fa-heart-pulse',
    tagline: 'Family Wealth Shield & Legacy Continuity',
    desc: 'Tailored term insurance, whole-life protection, wealth-accumulation guarantees, and child education assurance plans customized for your family goals.',
    points: [
      'High Sum Assured with Affordable Premiums',
      'Comprehensive Critical Illness Riders',
      'Tax-Optimized Guaranteed Maturity Payouts',
      'Hassle-Free Nominee Claim Assistance'
    ],
    targetPage: 'page-insurance'
  },
  {
    id: 'general-insurance',
    title: 'General Insurance',
    icon: 'fa-shield-halved',
    tagline: 'Comprehensive Asset, Vehicle & Property Shield',
    desc: 'Robust coverage safeguarding physical investments, residential & commercial properties, luxury vehicles, and commercial transport against losses.',
    points: [
      'Fire, Flood & Natural Disaster Protection',
      'Comprehensive Zero-Depreciation Motor Cover',
      'Commercial Goods & Transit Risk Coverage',
      'Instant Online Claim Registration'
    ],
    targetPage: 'page-insurance'
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance',
    icon: 'fa-hand-holding-medical',
    tagline: 'Cashless Medical Sovereignty & Critical Care',
    desc: 'Top-tier family floater and individual health insurance shields covering pre & post-hospitalization, advanced robotic treatments, and zero co-pay options.',
    points: [
      '10,000+ Cashless Network Hospitals Pan-India',
      'Unlimited Restoration of Sum Insured',
      'No Sub-Limits on Room Rent or ICU',
      'Annual Free Preventive Health Checkups'
    ],
    targetPage: 'page-insurance'
  },
  {
    id: 'industrial-safety',
    title: 'Industrial Health & Safety Insurance',
    icon: 'fa-industry',
    tagline: 'Enterprise Liability, Factory & Workforce Shield',
    desc: 'Specialized industrial risk underwriting: Workmen Compensation (WC Act), Public & Product Liability, Machinery Breakdown, and Factory Hazard Security.',
    points: [
      'Mandatory Statutory Compliance Under Factory Acts',
      'Accidental Death & Permanent Disability Shields',
      'Machinery Breakdown & Business Interruption Cover',
      'Tailored Solutions for Manufacturing & Warehousing'
    ],
    targetPage: 'page-insurance'
  }
];

const PARTNER_INSURERS = [
  {
    id: 'hdfc',
    name: 'HDFC Life & HDFC ERGO',
    badge: 'Premier Partner',
    desc: 'India’s most trusted private insurance titan with 99.3% claim settlement ratio and institutional financial stability.',
    specialties: ['Life & Term Protection', 'Motor & Property Insurance', 'Health Suraksha'],
    logoText: 'HDFC'
  },
  {
    id: 'tvs-galaxy',
    name: 'TVS Galaxy Health Insurance',
    badge: 'Specialized Health',
    desc: 'Pioneering healthcare protection backed by TVS pedigree, offering seamless cashless hospitalization and rapid claim resolution.',
    specialties: ['Senior Citizen Health', 'Super Top-Up Plans', 'Critical Illness Guard'],
    logoText: 'TVS Galaxy'
  },
  {
    id: 'central-bank',
    name: 'Central Bank of India',
    badge: 'Banking & Advisory Assurance',
    desc: 'Over a century of national financial legacy providing safe bancassurance, credit-linked insurance, and social security schemes.',
    specialties: ['Bancassurance Solutions', 'Rural & Micro Insurance', 'Loan Protection'],
    logoText: 'Central Bank'
  },
  {
    id: 'icic',
    name: 'ICIC Lombard',
    badge: 'Specialized General',
    desc: 'ICICI Lombard Criti Shield Plus offers financial protection against critical illnesses and medical emergencies.',
    specialties: ['Life Insurance', 'Health Insurance', 'Motor Insurance(Car & Bike)', 'Travel Insurance'],
    logoText: 'ICIC Lombard'
  }
];

const CONTACT_INFO = {
  founderName: 'Teekaraman.P',
  founderTitle: 'Founder & Managing Director',
  phones: [
    { display: '+91 99626 99649', raw: '9962699649' },
    { display: '+91 79044 95355', raw: '7904495355' }
  ],
  whatsapps: [
    { display: '+91 99626 99649 (Primary Advisory)', raw: '9962699649' },
    { display: '+91 81486 03963 (Direct Support)', raw: '8148603963' }
  ],
  email: 'ptjayandhan@gmail.com',
};
