/**
 * PrimeShield Group - Admin Management Module
 * Password-protected administration for Unlimited Villa CRUD & Lead Management.
 */

const AdminModule = (() => {
  const ADMIN_PASSWORD_KEY = 'primeshield_admin_pw';
  const DEFAULT_PASSWORD = 'prime'; // simple clean default, easy to test
  const SESSION_AUTH_KEY = 'primeshield_admin_authenticated';

  let editingVillaId = null;

  function init() {
    bindAdminEvents();
  }

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  }

  function authenticate(passwordInput) {
    const savedPw = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
    if (passwordInput === savedPw) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    showLoginView();
  }

  function openAdminModal() {
    const modal = document.getElementById('admin-portal-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    if (isAuthenticated()) {
      showDashboardView();
    } else {
      showLoginView();
    }
  }

  function closeAdminModal() {
    const modal = document.getElementById('admin-portal-modal');
    if (modal) modal.classList.add('hidden');
  }

  function showLoginView() {
    document.getElementById('admin-login-view')?.classList.remove('hidden');
    document.getElementById('admin-dashboard-view')?.classList.add('hidden');
    const err = document.getElementById('admin-login-error');
    if (err) err.classList.add('hidden');
    const pwInput = document.getElementById('admin-password-input');
    if (pwInput) {
      pwInput.value = '';
      setTimeout(() => pwInput.focus(), 100);
    }
  }

  function showDashboardView() {
    document.getElementById('admin-login-view')?.classList.add('hidden');
    document.getElementById('admin-dashboard-view')?.classList.remove('hidden');
    renderAdminVillasList();
    renderAdminEnquiriesList();
  }

  function renderAdminVillasList() {
    const tableBody = document.getElementById('admin-villas-table-body');
    const emptyNotice = document.getElementById('admin-villas-empty');
    if (!tableBody) return;

    const villas = RealEstateModule.getVillas();

    if (villas.length === 0) {
      tableBody.innerHTML = '';
      if (emptyNotice) emptyNotice.classList.remove('hidden');
      return;
    }

    if (emptyNotice) emptyNotice.classList.add('hidden');

    tableBody.innerHTML = villas.map((villa, idx) => {
      const firstImg = villa.images && villa.images.length > 0 ? villa.images[0] : DEFAULT_PRESETS.images[0].url;
      const count = villa.images ? villa.images.length : 0;
      return `
        <tr class="border-b border-slate-800 hover:bg-slate-900/40 text-xs">
          <td class="py-3 px-4">
            <div class="flex items-center gap-3">
              <img src="${firstImg}" alt="${villa.title}" class="w-12 h-10 object-cover rounded-md border border-slate-700">
              <div>
                <p class="font-bold text-white">${villa.title}</p>
                <p class="text-slate-400 text-[11px]">${villa.project} • ${villa.bhk || ''}</p>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 text-slate-300">${villa.area}</td>
          <td class="py-3 px-4 font-semibold text-amber-400">${villa.sqft} sq.ft</td>
          <td class="py-3 px-4 font-bold text-white">${villa.priceDisplay || '₹95L+'}</td>
          <td class="py-3 px-4">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              ${count} Photos
            </span>
          </td>
          <td class="py-3 px-4 text-right space-x-2">
            <button type="button" onclick="AdminModule.openEditVillaModal('${villa.id}')" class="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition-colors">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button type="button" onclick="AdminModule.deleteVilla('${villa.id}')" class="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold transition-colors">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderAdminEnquiriesList() {
    const tableBody = document.getElementById('admin-enquiries-table-body');
    const countBadge = document.getElementById('admin-enquiry-count');
    if (!tableBody) return;

    let enquiries = [];
    try {
      enquiries = JSON.parse(localStorage.getItem('primeshield_enquiries_db') || '[]');
    } catch (e) {
      enquiries = [];
    }

    if (countBadge) countBadge.textContent = `${enquiries.length} Enquiries`;

    if (enquiries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-slate-500 text-xs">
            No customer enquiries recorded yet.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = enquiries.map((enq, idx) => {
      const dateFormatted = new Date(enq.submittedAt).toLocaleDateString();
      const isRE = enq.category === 'Real Estate';
      const badgeClass = isRE ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

      return `
        <tr class="border-b border-slate-800 hover:bg-slate-900/40 text-xs">
          <td class="py-3 px-4 text-slate-400">${dateFormatted}</td>
          <td class="py-3 px-4">
            <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">
              ${enq.category}
            </span>
          </td>
          <td class="py-3 px-4">
            <p class="font-bold text-white">${enq.name}</p>
            <p class="text-slate-400 text-[11px]">${enq.email} | ${enq.location}</p>
          </td>
          <td class="py-3 px-4">
            <a href="tel:${enq.mobile}" class="font-semibold text-amber-400 hover:underline">+91 ${enq.mobile}</a>
          </td>
          <td class="py-3 px-4 text-slate-300">
            ${isRE ? `${enq.propertyType} in ${enq.project} (${enq.sqft})` : `${enq.insurer} - ${enq.insuranceType}`}
            <div class="text-[10px] text-slate-400">Visiting: ${enq.visitDate} (${enq.visitTime})</div>
          </td>
          <td class="py-3 px-4 text-right">
            <a href="https://wa.me/91${enq.mobile}" target="_blank" class="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-semibold transition-colors">
              <i class="fa-brands fa-whatsapp"></i> Chat
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openAddVillaModal() {
    editingVillaId = null;
    const modal = document.getElementById('villa-edit-modal');
    const form = document.getElementById('villa-edit-form');
    const title = document.getElementById('villa-edit-modal-title');
    if (form) form.reset();
    if (title) title.textContent = 'Add New Villa Listing';
    if (modal) modal.classList.remove('hidden');
  }

  function openEditVillaModal(villaId) {
    editingVillaId = villaId;
    const modal = document.getElementById('villa-edit-modal');
    const title = document.getElementById('villa-edit-modal-title');
    const villas = RealEstateModule.getVillas();
    const villa = villas.find(v => v.id === villaId);
    if (!villa) return;

    if (title) title.textContent = `Edit Villa: ${villa.title}`;

    document.getElementById('edit-villa-title').value = villa.title || '';
    document.getElementById('edit-villa-project').value = villa.project || "Chola's Empire";
    document.getElementById('edit-villa-area').value = villa.area || '';
    document.getElementById('edit-villa-sqft').value = villa.sqft || '';
    document.getElementById('edit-villa-bhk').value = villa.bhk || '';
    document.getElementById('edit-villa-price').value = villa.priceDisplay || '';
    document.getElementById('edit-villa-status').value = villa.status || 'Ready to Move';
    document.getElementById('edit-villa-desc').value = villa.description || '';

    // Images 1-5
    const imgs = villa.images || [];
    for (let i = 1; i <= 5; i++) {
      const input = document.getElementById(`edit-villa-img-${i}`);
      if (input) input.value = imgs[i - 1] || '';
    }

    if (modal) modal.classList.remove('hidden');
  }

  function closeEditVillaModal() {
    const modal = document.getElementById('villa-edit-modal');
    if (modal) modal.classList.add('hidden');
    editingVillaId = null;
  }

  function deleteVilla(villaId) {
    if (!confirm('Are you sure you want to permanently delete this villa listing?')) return;
    const current = RealEstateModule.getVillas();
    const filtered = current.filter(v => v.id !== villaId);
    RealEstateModule.setVillas(filtered);
    renderAdminVillasList();
    if (window.ApiService) {
      window.ApiService.deleteVilla(villaId).catch(() => {});
    }
  }

  function exportEnquiriesToCSV() {
    let enquiries = [];
    try {
      enquiries = JSON.parse(localStorage.getItem('primeshield_enquiries_db') || '[]');
    } catch (e) {
      enquiries = [];
    }

    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Category', 'Name', 'Mobile', 'Email', 'Location', 'Requirement/Insurer', 'Details/Type', 'Visit Date', 'Time Slot'];
    const rows = enquiries.map(e => [
      e.id,
      e.submittedAt,
      e.category,
      `"${e.name || ''}"`,
      e.mobile,
      e.email,
      `"${e.location || ''}"`,
      `"${e.project || e.insurer || ''}"`,
      `"${e.sqft || e.insuranceType || ''}"`,
      e.visitDate,
      `"${e.visitTime || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PrimeShield_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function bindAdminEvents() {
    // Open admin portal trigger
    document.querySelectorAll('.btn-open-admin-portal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminModal();
      });
    });

    // Close admin portal
    document.getElementById('close-admin-portal')?.addEventListener('click', closeAdminModal);

    // Login form submit
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = document.getElementById('admin-password-input')?.value;
        if (authenticate(pw)) {
          showDashboardView();
        } else {
          const err = document.getElementById('admin-login-error');
          if (err) err.classList.remove('hidden');
        }
      });
    }

    // Logout
    document.getElementById('btn-admin-logout')?.addEventListener('click', logout);

    // Add villa trigger button
    document.getElementById('btn-admin-add-villa')?.addEventListener('click', openAddVillaModal);
    document.getElementById('close-villa-edit-modal')?.addEventListener('click', closeEditVillaModal);

    // Save villa submit
    const villaForm = document.getElementById('villa-edit-form');
    if (villaForm) {
      villaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('edit-villa-title')?.value.trim();
        const project = document.getElementById('edit-villa-project')?.value;
        const area = document.getElementById('edit-villa-area')?.value.trim();
        const sqft = parseInt(document.getElementById('edit-villa-sqft')?.value, 10) || 1500;
        const bhk = document.getElementById('edit-villa-bhk')?.value.trim();
        const priceDisplay = document.getElementById('edit-villa-price')?.value.trim();
        const status = document.getElementById('edit-villa-status')?.value;
        const description = document.getElementById('edit-villa-desc')?.value.trim();

        const images = [];
        for (let i = 1; i <= 5; i++) {
          const val = document.getElementById(`edit-villa-img-${i}`)?.value.trim();
          if (val) images.push(val);
        }
        if (images.length === 0) {
          images.push(DEFAULT_PRESETS.images[0].url);
        }

        const currentVillas = RealEstateModule.getVillas();

        if (editingVillaId) {
          // Edit existing
          const updated = currentVillas.map(v => {
            if (v.id === editingVillaId) {
              return {
                ...v,
                title,
                project,
                area,
                sqft,
                bhk,
                priceDisplay,
                status,
                description,
                images
              };
            }
            return v;
          });
          RealEstateModule.setVillas(updated);
        } else {
          // Add new villa
          const newVilla = {
            id: 'villa-' + Date.now(),
            title,
            project,
            area,
            sqft,
            bhk,
            priceDisplay,
            status,
            description,
            images
          };
          RealEstateModule.setVillas([newVilla, ...currentVillas]);
        }

        closeEditVillaModal();
        renderAdminVillasList();
      });
    }

    // CSV export
    document.getElementById('btn-export-enquiries-csv')?.addEventListener('click', exportEnquiriesToCSV);
  }

  return {
    init,
    openAdminModal,
    openAddVillaModal,
    openEditVillaModal,
    deleteVilla
  };
})();
