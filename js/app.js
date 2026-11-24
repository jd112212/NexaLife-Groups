/**
 * PrimeShield Group - Main Application Controller
 * Handles 5-page routing, mobile navigation, floating WhatsApp drawer, service cards, contact interactions, and API sync.
 */

const App = (() => {
  const PAGES = ['page-home', 'page-about', 'page-realestate', 'page-insurance', 'page-contact'];
  let currentPage = 'page-home';

  function init() {
    renderAboutServices();
    initRouting();
    bindNavEvents();
    bindWhatsAppFloating();
    initContactMap();

    // Initialize submodules
    BackgroundEngine.init();
    RealEstateModule.init();
    InsuranceModule.init();
    AdminModule.init();

    // Check backend health
    checkBackendConnection();
  }

  function renderAboutServices() {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    container.innerHTML = SERVICES_DATA.map(srv => `
      <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group gold-shimmer border border-slate-700/80 hover:border-amber-400/60 transition-all duration-300">
        <div>
          <!-- Icon Header -->
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl mb-5 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
            <i class="fa-solid ${srv.icon}"></i>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 font-serif group-hover:text-amber-300 transition-colors">
            ${srv.title}
          </h3>
          <p class="text-xs text-amber-400 font-semibold mb-3 tracking-wide">
            ${srv.tagline}
          </p>
          <p class="text-xs text-slate-300 leading-relaxed mb-6">
            ${srv.desc}
          </p>

          <!-- Key bullet points -->
          <div class="space-y-2 mb-6 pt-4 border-t border-slate-700/50">
            ${srv.points.map(pt => `
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <i class="fa-solid fa-shield-check text-amber-400 text-xs mt-0.5 shrink-0"></i>
                <span>${pt}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pt-4">
          <button type="button" onclick="App.navigateTo('${srv.targetPage}')" class="w-full py-2.5 px-4 rounded-xl btn-outline-gold text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
            <span>Enquire For ${srv.title}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  function initRouting() {
    // Read hash on load
    const hash = window.location.hash.replace('#', '');
    const pageId = `page-${hash}`;
    if (PAGES.includes(pageId)) {
      navigateTo(pageId, false);
    } else {
      navigateTo('page-home', false);
    }

    // Listen to hashchange
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      const p = `page-${h}`;
      if (PAGES.includes(p) && p !== currentPage) {
        navigateTo(p, false);
      }
    });
  }

  function navigateTo(pageId, updateHash = true) {
    if (!PAGES.includes(pageId)) return;

    currentPage = pageId;

    // Toggle pages
    PAGES.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === pageId) {
          el.classList.add('active');
          el.style.display = 'block';
        } else {
          el.classList.remove('active');
          el.style.display = 'none';
        }
      }
    });

    // Update active nav links
    const routeName = pageId.replace('page-', '');
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-target');
      if (target === pageId) {
        link.classList.add('text-amber-400', 'border-amber-400', 'font-bold');
        link.classList.remove('text-slate-300', 'border-transparent');
      } else {
        link.classList.remove('text-amber-400', 'border-amber-400', 'font-bold');
        link.classList.add('text-slate-300', 'border-transparent');
      }
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-nav-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }

    // Update hash
    if (updateHash) {
      window.location.hash = routeName;
    }

    // Scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Background panel visibility: only allow settings on Home or globally
    const bgSettingsToggle = document.getElementById('bg-settings-btn');
    if (bgSettingsToggle) {
      // Keep it accessible, but prominently visible on home
      bgSettingsToggle.style.opacity = (pageId === 'page-home') ? '1' : '0.85';
    }
  }

  function bindNavEvents() {
    // Nav links
    document.querySelectorAll('[data-nav-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-nav-target');
        navigateTo(target);
      });
    });

    // Mobile menu toggle
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  function bindWhatsAppFloating() {
    const trigger = document.getElementById('floating-whatsapp-trigger');
    const drawer = document.getElementById('floating-whatsapp-drawer');
    const closeBtn = document.getElementById('close-whatsapp-drawer');

    if (trigger && drawer) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        drawer.classList.toggle('hidden');
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (drawer && !drawer.classList.contains('hidden')) {
        if (!drawer.contains(e.target) && !trigger?.contains(e.target)) {
          drawer.classList.add('hidden');
        }
      }
    });
  }

  function initContactMap() {
    // Interactive Map Placeholder for SGIM Corridor
    const mapContainer = document.getElementById('contact-interactive-map');
    if (!mapContainer) return;

    mapContainer.innerHTML = `
      <div class="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center shadow-2xl">
        <!-- Stylized Map Vector Background -->
        <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(#d4af37 1px, transparent 1px), radial-gradient(#1e3a8a 1px, #060c18 1px); background-size: 30px 30px; background-position: 0 0, 15px 15px;"></div>

        <!-- Simulated Road Network Lines -->
        <svg class="absolute inset-0 w-full h-full stroke-amber-500/20" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="90%" y2="80%" stroke-width="3" stroke-dasharray="6,6" />
          <line x1="20%" y1="90%" x2="80%" y2="10%" stroke-width="2" stroke="rgba(212, 175, 55, 0.25)" />
          <circle cx="50%" cy="50%" r="90" stroke="rgba(212, 175, 55, 0.15)" stroke-width="1.5" fill="none" />
          <circle cx="50%" cy="50%" r="160" stroke="rgba(212, 175, 55, 0.1)" stroke-width="1" fill="none" />
        </svg>

        <!-- Location Pins -->
        <!-- HQ Pin -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center group cursor-pointer">
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-400 opacity-75"></span>
            <div class="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-bold shadow-xl border-2 border-slate-900">
              <i class="fa-solid fa-building-shield"></i>
            </div>
          </div>
          <div class="mt-2 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-amber-400/40 text-xs font-bold text-white shadow-xl whitespace-nowrap">
            PrimeShield Group HQ
            <span class="block text-[10px] text-amber-300 font-normal">SGIM Central Advisory Office</span>
          </div>
        </div>

        <!-- Chola's Empire Pin -->
        <div class="absolute top-[28%] left-[25%] z-10 text-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-slate-800 text-amber-400 border border-amber-400/60 flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-crown"></i>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-semibold text-slate-200 whitespace-nowrap">
            Chola's Empire
          </div>
        </div>

        <!-- Temple Town Pin -->
        <div class="absolute bottom-[25%] left-[32%] z-10 text-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-slate-800 text-amber-400 border border-amber-400/60 flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-om"></i>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-semibold text-slate-200 whitespace-nowrap">
            Temple Town
          </div>
        </div>

        <!-- Vateka Pin -->
        <div class="absolute top-[32%] right-[22%] z-10 text-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-slate-800 text-amber-400 border border-amber-400/60 flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-tree-city"></i>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-semibold text-slate-200 whitespace-nowrap">
            Vateka Township
          </div>
        </div>

        <!-- Map Footer Pill -->
        <div class="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-10 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-compass text-amber-400 animate-spin" style="animation-duration: 12s;"></i>
            <span>SGIM Regional Advisory Map</span>
          </div>
          <a href="https://maps.google.com" target="_blank" class="text-amber-400 font-bold hover:underline flex items-center gap-1">
            <span>Open in Google Maps</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    `;
  }

  function checkBackendConnection() {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('PrimeShield Backend Connected:', data);
        const badge = document.getElementById('backend-status-badge');
        if (badge) {
          badge.classList.remove('hidden');
          badge.textContent = 'Server Connected';
        }
      })
      .catch(() => {
        console.log('Running in client-side localStorage mode.');
      });
  }

  return {
    init,
    navigateTo,
    getCurrentPage: () => currentPage
  };
})();

// API Bridge for Python backend or localStorage
window.ApiService = {
  async submitEnquiry(enquiryData) {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
      return await res.json();
    } catch (e) {
      console.log('API offline, enquiry preserved in localStorage');
      return { success: true, mode: 'local' };
    }
  },

  async deleteVilla(villaId) {
    try {
      const res = await fetch(`/api/villas/${villaId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return { success: true, mode: 'local' };
    }
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
