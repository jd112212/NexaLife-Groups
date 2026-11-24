/**
 * PrimeShield Group - Insurance Advisory Module
 * Handles selectable partner insurer cards, insurance categories, validation and enquiry submissions.
 */

const InsuranceModule = (() => {
  const ENQUIRIES_STORAGE_KEY = 'primeshield_enquiries_db';
  let selectedInsurer = 'HDFC';

  function init() {
    renderPartnerCards();
    initDatePicker();
    bindFormEvents();
    bindSuccessModalEvents();
  }

  function renderPartnerCards() {
    const container = document.getElementById('partner-insurers-container');
    if (!container) return;

    container.innerHTML = PARTNER_INSURERS.map(partner => {
      const isSelected = partner.name.toLowerCase().includes(selectedInsurer.toLowerCase());
      return `
        <div onclick="InsuranceModule.selectPartner('${partner.name}')" class="partner-card glass-card rounded-2xl p-6 cursor-pointer border-2 transition-all duration-300 relative group ${isSelected ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30' : 'border-slate-700/80 hover:border-amber-400/50'}">
          <!-- Selection indicator -->
          <div class="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600 text-transparent group-hover:border-slate-400'}">
            <i class="fa-solid fa-check text-xs"></i>
          </div>

          <!-- Partner Badge & Name -->
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-amber-500/20 mb-3">
            ${partner.badge}
          </span>

          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-serif">
              ${partner.logoText.slice(0, 4)}
            </div>
            <div>
              <h4 class="text-lg font-bold text-white font-serif">${partner.name}</h4>
              <p class="text-[11px] text-amber-400/90 font-medium">Authorized Advisory Partner</p>
            </div>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed mb-4">
            ${partner.desc}
          </p>

          <div class="space-y-1.5 pt-3 border-t border-slate-700/50">
            ${partner.specialties.map(spec => `
              <div class="flex items-center gap-2 text-[11px] text-slate-300">
                <i class="fa-solid fa-shield-halved text-amber-400 text-[10px]"></i>
                <span>${spec}</span>
              </div>
            `).join('')}
          </div>

          <div class="mt-4 pt-2">
            <span class="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Select as preferred insurer</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function selectPartner(partnerFullName) {
    const dropdown = document.getElementById('ins-partner-select');
    if (dropdown) {
      if (partnerFullName.includes('HDFC')) {
        dropdown.value = 'HDFC';
        selectedInsurer = 'HDFC';
      } else if (partnerFullName.includes('TVS')) {
        dropdown.value = 'TVS Galaxy Health Insurance';
        selectedInsurer = 'TVS Galaxy';
      } else if (partnerFullName.includes('Central Bank')) {
        dropdown.value = 'Central Bank of India';
        selectedInsurer = 'Central Bank of India';
      }
    }
    renderPartnerCards();

    // Scroll smoothly to form
    const formSection = document.getElementById('insurance-enquiry-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function initDatePicker() {
    const dateInput = document.getElementById('ins-visit-date');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  function bindFormEvents() {
    const form = document.getElementById('insurance-enquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const insurer = document.getElementById('ins-partner-select')?.value;
      const insType = document.getElementById('ins-type-select')?.value;
      const name = document.getElementById('ins-user-name')?.value.trim();
      const mobile = document.getElementById('ins-user-mobile')?.value.trim();
      const email = document.getElementById('ins-user-email')?.value.trim();
      const incomeSource = document.getElementById('ins-income-source')?.value.trim();
      const profession = document.getElementById('ins-work-profession')?.value.trim();
      const location = document.getElementById('ins-user-location')?.value.trim();
      const visitDate = document.getElementById('ins-visit-date')?.value;
      const visitTime = document.getElementById('ins-visit-time')?.value;

      const errorEl = document.getElementById('ins-form-error');
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

      if (!insurer) {
        showError('Please choose your preferred Insurer (HDFC / TVS Galaxy / Central Bank of India).');
        return;
      }
      if (!insType) {
        showError('Please choose an Insurance Type.');
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
      // Valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }
      if (!incomeSource) {
        showError('Please select or specify your primary income source.');
        return;
      }
      if (!profession) {
        showError('Please enter your work / profession.');
        return;
      }
      if (!location) {
        showError('Please enter your current location / city.');
        return;
      }
      if (!visitDate) {
        showError('Please select a consultation date.');
        return;
      }
      const selectedDate = new Date(visitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError('Consultation date cannot be in the past.');
        return;
      }
      if (!visitTime) {
        showError('Please choose a preferred time slot.');
        return;
      }

      const enquiryData = {
        id: 'INS-' + Date.now(),
        category: 'Insurance',
        submittedAt: new Date().toISOString(),
        insurer: insurer,
        insuranceType: insType,
        name: name,
        mobile: mobileClean,
        email: email,
        incomeSource: incomeSource,
        profession: profession,
        location: location,
        visitDate: visitDate,
        visitTime: visitTime
      };

      // Save locally
      saveEnquiryLocally(enquiryData);

      // Backend submission if available
      if (window.ApiService) {
        window.ApiService.submitEnquiry(enquiryData).catch(() => {});
      }

      showSuccessModal(enquiryData);
      form.reset();
      initDatePicker();
    });
  }

  function saveEnquiryLocally(enquiry) {
    try {
      const existing = JSON.parse(localStorage.getItem(ENQUIRIES_STORAGE_KEY) || '[]');
      existing.unshift(enquiry);
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to store insurance enquiry:', e);
    }
  }

  function showSuccessModal(data) {
    const modal = document.getElementById('ins-success-modal');
    if (!modal) return;

    const summaryEl = document.getElementById('ins-modal-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="space-y-1.5 text-xs text-slate-300">
          <p><strong class="text-amber-400">Name:</strong> ${data.name}</p>
          <p><strong class="text-amber-400">Mobile:</strong> +91 ${data.mobile}</p>
          <p><strong class="text-amber-400">Insurer:</strong> ${data.insurer}</p>
          <p><strong class="text-amber-400">Coverage Type:</strong> ${data.insuranceType}</p>
          <p><strong class="text-amber-400">Profession & Income:</strong> ${data.profession} (${data.incomeSource})</p>
          <p><strong class="text-amber-400">Consultation Schedule:</strong> ${data.visitDate} (${data.visitTime})</p>
        </div>
      `;
    }

    const waBtn = document.getElementById('ins-modal-whatsapp-btn');
    if (waBtn) {
      const waText = encodeURIComponent(
        `*NEW INSURANCE ENQUIRY - PrimeShield Group*\n\n` +
        `*Name:* ${data.name}\n` +
        `*Mobile:* +91 ${data.mobile}\n` +
        `*Email:* ${data.email}\n` +
        `*Partner Insurer:* ${data.insurer}\n` +
        `*Insurance Type:* ${data.insuranceType}\n` +
        `*Profession / Work:* ${data.profession}\n` +
        `*Income Source:* ${data.incomeSource}\n` +
        `*Location:* ${data.location}\n` +
        `*Consultation Date:* ${data.visitDate}\n` +
        `*Preferred Slot:* ${data.visitTime}\n\n` +
        `Please connect for policy quotation and claim advisory.`
      );
      waBtn.href = `https://wa.me/919962699649?text=${waText}`;
    }

    modal.classList.remove('hidden');
  }

  function bindSuccessModalEvents() {
    const closeBtn = document.getElementById('close-ins-success-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('ins-success-modal')?.classList.add('hidden');
      });
    }
  }

  return {
    init,
    selectPartner
  };
})();
