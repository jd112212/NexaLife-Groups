/**
 * PrimeShield Group - Real Estate Module
 * Handles SGIM projects showcase, enquiry form with strict validation, villa listings with gallery & lightbox, and WhatsApp enquiry generation.
 */

const RealEstateModule = (() => {
  const VILLAS_STORAGE_KEY = 'primeshield_villas_db';
  const ENQUIRIES_STORAGE_KEY = 'primeshield_enquiries_db';

  let currentVillas = [];
  let activeLightbox = {
    villaIndex: 0,
    imageIndex: 0
  };

  function init() {
    loadVillasData();
    renderSGIMProjects();
    renderVillasList();
    initBudgetSlider();
    initDatePicker();
    bindFormEvents();
    bindLightboxEvents();
  }

  function loadVillasData() {
    try {
      const stored = localStorage.getItem(VILLAS_STORAGE_KEY);
      if (stored) {
        currentVillas = JSON.parse(stored);
      } else {
        currentVillas = [...INITIAL_VILLAS];
        saveVillasData();
      }
    } catch (e) {
      console.warn('Error reading villas from localStorage:', e);
      currentVillas = [...INITIAL_VILLAS];
    }
  }

  function saveVillasData() {
    try {
      localStorage.setItem(VILLAS_STORAGE_KEY, JSON.stringify(currentVillas));
    } catch (e) {
      console.warn('Failed to save villas to localStorage:', e);
    }
  }

  function renderSGIMProjects() {
    const container = document.getElementById('sgim-projects-container');
    if (!container) return;

    container.innerHTML = SGIM_PROJECTS.map(project => `
      <div class="glass-card rounded-2xl p-6 sm:p-8 gold-shimmer relative flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              SGIM Approved
            </span>
            <span class="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <i class="fa-solid fa-gem text-[10px]"></i> Lands & Villas
            </span>
          </div>

          <h3 class="text-2xl font-bold text-white mb-2 font-serif">${project.name}</h3>
          <p class="text-amber-400 text-sm font-medium mb-3">${project.tagline}</p>
          <p class="text-slate-300 text-sm leading-relaxed mb-4">${project.description}</p>

          <div class="space-y-2 mb-6">
            ${project.highlights.map(h => `
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <i class="fa-solid fa-circle-check text-amber-400 text-xs"></i>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-700/60 mt-auto">
          <div class="flex items-center justify-between mb-3 text-xs">
            <span class="text-slate-400">Configurations</span>
            <span class="text-amber-300 font-semibold text-right">${project.unitsAvailable}</span>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-slate-400 text-xs">Pricing Starts From</span>
            <span class="text-lg font-bold text-white">${project.priceStarting}</span>
          </div>
          <button type="button" onclick="RealEstateModule.selectProjectForEnquiry('${project.name}')" class="w-full py-2.5 px-4 rounded-xl btn-outline-gold text-xs font-semibold flex items-center justify-center gap-2">
            <span>Enquire For ${project.name}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderVillasList() {
    const container = document.getElementById('villa-listings-container');
    const countEl = document.getElementById('villa-count-badge');
    if (!container) return;

    if (countEl) countEl.textContent = `${currentVillas.length} Exclusive Villas`;

    if (currentVillas.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 glass-panel rounded-2xl p-8 border border-dashed border-amber-500/30">
          <i class="fa-solid fa-hotel text-4xl text-amber-400/50 mb-3"></i>
          <h4 class="text-lg font-bold text-white">No Villas Currently Listed</h4>
          <p class="text-slate-400 text-sm mt-1">Use the Admin Panel below to add new villa listings.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = currentVillas.map((villa, vIdx) => {
      const images = (villa.images && villa.images.length > 0) ? villa.images.slice(0, 5) : [DEFAULT_PRESETS.images[0].url];
      const encodedMsg = encodeURIComponent(
        `Hello PrimeShield Group,\n\nI am interested in visiting/booking the villa:\n*Villa Name:* ${villa.title}\n*Project:* ${villa.project}\n*Area / Location:* ${villa.area}\n*Size:* ${villa.sqft} sq.ft (${villa.bhk || 'Luxury Villa'})\n*Price:* ${villa.priceDisplay || 'On Request'}\n\nPlease share site visit schedule, layout plan, and pricing sheet.\n\nThank you!`
      );
      const whatsappUrl = `https://wa.me/919962699649?text=${encodedMsg}`;

      return `
        <div class="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-700/80 hover:border-amber-400/50 transition-all duration-300">
          <!-- Image Carousel Header with Lightbox Trigger -->
          <div class="relative w-full h-64 bg-slate-900 overflow-hidden">
            <div id="carousel-${villa.id}" class="w-full h-full relative">
              <img src="${images[0]}" alt="${villa.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" onclick="RealEstateModule.openLightbox(${vIdx}, 0)" />
            </div>

            <!-- Image count badge -->
            <button type="button" onclick="RealEstateModule.openLightbox(${vIdx}, 0)" class="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 hover:bg-black/90 transition-colors">
              <i class="fa-regular fa-images text-amber-400"></i>
              <span>${images.length} Photos (Click to View)</span>
            </button>

            <!-- Status badge -->
            <span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-navy-deep font-sans shadow-lg">
              ${villa.status || 'Verified Listing'}
            </span>

            <!-- Project pill -->
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
              ${villa.project}
            </span>
          </div>

          <!-- Villa Details -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="text-xl font-bold text-white font-serif group-hover:text-amber-300 transition-colors">
                  ${villa.title}
                </h4>
              </div>

              <!-- Location & Area -->
              <div class="flex items-center gap-2 text-xs text-slate-300 mb-3">
                <i class="fa-solid fa-location-dot text-amber-400"></i>
                <span class="font-medium">${villa.area}</span>
              </div>

              <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                ${villa.description || 'Exclusive luxury villa with premium specifications, contemporary architecture, and landscaped surroundings.'}
              </p>

              <!-- Specs Grid -->
              <div class="grid grid-cols-2 gap-2 mb-5 py-3 border-y border-slate-700/60 bg-slate-900/40 rounded-xl px-3">
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <i class="fa-solid fa-ruler-combined text-amber-400"></i>
                  <span><strong class="text-white">${villa.sqft}</strong> sq.ft</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <i class="fa-solid fa-bed text-amber-400"></i>
                  <span class="text-white font-medium">${villa.bhk || 'Independent Villa'}</span>
                </div>
              </div>
            </div>

            <!-- Price & WhatsApp Action -->
            <div class="pt-2">
              <div class="flex items-baseline justify-between mb-4">
                <span class="text-xs text-slate-400">Investment</span>
                <span class="text-xl font-extrabold text-amber-400">${villa.priceDisplay || '₹95 Lakhs+'}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button type="button" onclick="RealEstateModule.openLightbox(${vIdx}, 0)" class="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center justify-center gap-2 transition-colors">
                  <i class="fa-solid fa-expand text-amber-400"></i>
                  <span>Gallery</span>
                </button>
                <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]">
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>Contact on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function initBudgetSlider() {
    const slider = document.getElementById('re-budget-slider');
    const display = document.getElementById('re-budget-display');
    if (!slider || !display) return;

    function updateLabel(val) {
      const num = parseInt(val, 10);
      if (num < 100) {
        display.textContent = `₹${num} Lakhs`;
      } else {
        const cr = (num / 100).toFixed(2);
        display.textContent = `₹${cr} Crores`;
      }
    }

    slider.addEventListener('input', (e) => {
      updateLabel(e.target.value);
    });

    updateLabel(slider.value);
  }

  function initDatePicker() {
    const dateInput = document.getElementById('re-visit-date');
    if (dateInput) {
      // Set minimum date to today's date formatted as YYYY-MM-DD
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  function selectProjectForEnquiry(projectName) {
    const dropdown = document.getElementById('re-project-select');
    if (dropdown) {
      dropdown.value = projectName;
    }
    const formSection = document.getElementById('realestate-enquiry-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function bindFormEvents() {
    const form = document.getElementById('realestate-enquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather values
      const propType = form.querySelector('input[name="property_type"]:checked')?.value;
      const project = document.getElementById('re-project-select')?.value;
      const budgetSlider = document.getElementById('re-budget-slider')?.value;
      const budgetDisplay = document.getElementById('re-budget-display')?.textContent;
      const sqft = document.getElementById('re-sqft-select')?.value;
      const name = document.getElementById('re-user-name')?.value.trim();
      const mobile = document.getElementById('re-user-mobile')?.value.trim();
      const email = document.getElementById('re-user-email')?.value.trim();
      const location = document.getElementById('re-user-location')?.value.trim();
      const visitDate = document.getElementById('re-visit-date')?.value;
      const visitTime = document.getElementById('re-visit-time')?.value;

      // Validation
      const errorEl = document.getElementById('re-form-error');
      const successModal = document.getElementById('re-success-modal');
      if (errorEl) errorEl.classList.add('hidden');

      function showError(msg) {
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.classList.remove('hidden');
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert(msg);
        }
      }

      if (!propType) {
        showError('Please select a Property Type (Land or Villa).');
        return;
      }
      if (!project) {
        showError('Please select a Project.');
        return;
      }
      if (!sqft) {
        showError('Please select a Square Feet requirement.');
        return;
      }
      if (!name || name.length < 2) {
        showError('Please enter your full name.');
        return;
      }
      // 10-digit mobile number validation
      const mobileClean = mobile.replace(/\D/g, '');
      if (mobileClean.length !== 10) {
        showError('Please enter a valid 10-digit mobile number.');
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }
      if (!location) {
        showError('Please enter your current location/city.');
        return;
      }
      if (!visitDate) {
        showError('Please choose a preferred visiting date.');
        return;
      }
      // Check no past date
      const selectedDate = new Date(visitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError('Visiting date cannot be in the past.');
        return;
      }
      if (!visitTime) {
        showError('Please select a preferred visiting time slot.');
        return;
      }

      const enquiryData = {
        id: 'ENQ-' + Date.now(),
        category: 'Real Estate',
        submittedAt: new Date().toISOString(),
        propertyType: propType,
        project: project,
        budget: budgetDisplay,
        sqft: sqft,
        name: name,
        mobile: mobileClean,
        email: email,
        location: location,
        visitDate: visitDate,
        visitTime: visitTime
      };

      // Store in localStorage
      saveEnquiryLocally(enquiryData);

      // Attempt backend post if available
      if (window.ApiService) {
        window.ApiService.submitEnquiry(enquiryData).catch(() => {});
      }

      // Populate success modal with details & WhatsApp direct forward
      showSuccessModal(enquiryData);
      form.reset();
      initBudgetSlider();
      initDatePicker();
    });
  }

  function saveEnquiryLocally(enquiry) {
    try {
      const existing = JSON.parse(localStorage.getItem(ENQUIRIES_STORAGE_KEY) || '[]');
      existing.unshift(enquiry);
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to store enquiry:', e);
    }
  }

  function showSuccessModal(data) {
    const modal = document.getElementById('re-success-modal');
    if (!modal) return;

    const summaryEl = document.getElementById('re-modal-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="space-y-1.5 text-xs text-slate-300">
          <p><strong class="text-amber-400">Name:</strong> ${data.name}</p>
          <p><strong class="text-amber-400">Mobile:</strong> +91 ${data.mobile}</p>
          <p><strong class="text-amber-400">Requirement:</strong> ${data.propertyType} in ${data.project}</p>
          <p><strong class="text-amber-400">Budget & Size:</strong> ${data.budget} | ${data.sqft}</p>
          <p><strong class="text-amber-400">Scheduled Visit:</strong> ${data.visitDate} (${data.visitTime})</p>
        </div>
      `;
    }

    const waBtn = document.getElementById('re-modal-whatsapp-btn');
    if (waBtn) {
      const waText = encodeURIComponent(
        `*NEW REAL ESTATE ENQUIRY - PrimeShield Group*\n\n` +
        `*Name:* ${data.name}\n` +
        `*Mobile:* +91 ${data.mobile}\n` +
        `*Email:* ${data.email}\n` +
        `*Location:* ${data.location}\n` +
        `*Property Type:* ${data.propertyType}\n` +
        `*Project:* ${data.project}\n` +
        `*Budget:* ${data.budget}\n` +
        `*Square Feet:* ${data.sqft}\n` +
        `*Site Visit Date:* ${data.visitDate}\n` +
        `*Preferred Slot:* ${data.visitTime}\n\n` +
        `Please confirm our appointment and share project brochure.`
      );
      waBtn.href = `https://wa.me/919962699649?text=${waText}`;
    }

    modal.classList.remove('hidden');
  }

  // Lightbox Implementation
  function openLightbox(villaIndex, imageIndex = 0) {
    activeLightbox.villaIndex = villaIndex;
    activeLightbox.imageIndex = imageIndex;
    updateLightboxUI();
    const modal = document.getElementById('villa-lightbox-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeLightbox() {
    const modal = document.getElementById('villa-lightbox-modal');
    if (modal) modal.classList.add('hidden');
  }

  function updateLightboxUI() {
    const villa = currentVillas[activeLightbox.villaIndex];
    if (!villa) return;
    const images = villa.images && villa.images.length > 0 ? villa.images : [DEFAULT_PRESETS.images[0].url];

    if (activeLightbox.imageIndex < 0) activeLightbox.imageIndex = images.length - 1;
    if (activeLightbox.imageIndex >= images.length) activeLightbox.imageIndex = 0;

    const mainImg = document.getElementById('lightbox-main-img');
    const titleEl = document.getElementById('lightbox-title');
    const counterEl = document.getElementById('lightbox-counter');
    const thumbsContainer = document.getElementById('lightbox-thumbs');
    const waLink = document.getElementById('lightbox-whatsapp-link');

    if (mainImg) mainImg.src = images[activeLightbox.imageIndex];
    if (titleEl) titleEl.textContent = `${villa.title} - ${villa.area}`;
    if (counterEl) counterEl.textContent = `${activeLightbox.imageIndex + 1} / ${images.length}`;

    if (waLink) {
      const msg = encodeURIComponent(`Hello PrimeShield Group, I am viewing the photos of "${villa.title}" (${villa.sqft} sqft) and would like to arrange a site visit.`);
      waLink.href = `https://wa.me/919962699649?text=${msg}`;
    }

    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.map((img, idx) => `
        <button type="button" onclick="RealEstateModule.setLightboxImage(${idx})" class="w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === activeLightbox.imageIndex ? 'border-amber-400 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'}">
          <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover">
        </button>
      `).join('');
    }
  }

  function bindLightboxEvents() {
    const closeBtn = document.getElementById('close-lightbox-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const backdrop = document.getElementById('villa-lightbox-modal');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeLightbox.imageIndex--;
        updateLightboxUI();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeLightbox.imageIndex++;
        updateLightboxUI();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('villa-lightbox-modal');
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
          activeLightbox.imageIndex--;
          updateLightboxUI();
        }
        if (e.key === 'ArrowRight') {
          activeLightbox.imageIndex++;
          updateLightboxUI();
        }
      }
    });

    const closeSuccessBtn = document.getElementById('close-re-success-modal');
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', () => {
        document.getElementById('re-success-modal')?.classList.add('hidden');
      });
    }
  }

  return {
    init,
    openLightbox,
    closeLightbox,
    setLightboxImage: (idx) => {
      activeLightbox.imageIndex = idx;
      updateLightboxUI();
    },
    selectProjectForEnquiry,
    refreshVillas: () => {
      loadVillasData();
      renderVillasList();
    },
    getVillas: () => currentVillas,
    setVillas: (newVillas) => {
      currentVillas = newVillas;
      saveVillasData();
      renderVillasList();
    }
  };
})();
