/**
 * PrimeShield Group - Background Customization Engine
 * Handles full-screen villa background (image/video), overlay opacity, blur, presets, and custom file uploads.
 */

const BackgroundEngine = (() => {
  const STORAGE_KEY = 'primeshield_bg_settings';

  const defaultSettings = {
    type: 'image', // 'image' | 'video'
    activeImageId: 'img-1',
    imageUrl: DEFAULT_PRESETS.images[0].url,
    activeVideoId: 'vid-1',
    videoUrl: DEFAULT_PRESETS.videos[0].url,
    overlayDarkness: 0.65, // 0.2 to 0.95
    overlayBlur: 2, // 0 to 20px
    isCustomUpload: false
  };

  let state = { ...defaultSettings };

  function init() {
    loadSavedSettings();
    renderPresetsInPanel();
    applyState();
    bindEvents();
  }

  function loadSavedSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read background settings:', e);
      state = { ...defaultSettings };
    }
  }

  function saveSettings() {
    try {
      // If custom file data URL is huge, avoid breaking localStorage quota
      const toSave = { ...state };
      if (toSave.isCustomUpload && toSave.customDataUrl && toSave.customDataUrl.length > 500000) {
        // large files only keep in-memory for the session to prevent quota exception
        delete toSave.customDataUrl;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not persist background settings to localStorage:', e);
    }
  }

  function applyState() {
    const bgImage = document.getElementById('bg-image');
    const bgVideo = document.getElementById('bg-video');
    const bgOverlay = document.getElementById('bg-overlay');
    const typeImageRadio = document.getElementById('bg-type-image');
    const typeVideoRadio = document.getElementById('bg-type-video');
    const darknessSlider = document.getElementById('overlay-darkness-slider');
    const blurSlider = document.getElementById('overlay-blur-slider');
    const darknessVal = document.getElementById('overlay-darkness-val');
    const blurVal = document.getElementById('overlay-blur-val');

    if (!bgImage || !bgVideo || !bgOverlay) return;

    // Apply overlay darkness and blur
    bgOverlay.style.backgroundColor = `rgba(6, 12, 24, ${state.overlayDarkness})`;
    bgOverlay.style.backdropFilter = `blur(${state.overlayBlur}px)`;
    bgOverlay.style.webkitBackdropFilter = `blur(${state.overlayBlur}px)`;

    // Update UI controls
    if (darknessSlider) darknessSlider.value = Math.round(state.overlayDarkness * 100);
    if (darknessVal) darknessVal.textContent = `${Math.round(state.overlayDarkness * 100)}%`;
    if (blurSlider) blurSlider.value = state.overlayBlur;
    if (blurVal) blurVal.textContent = `${state.overlayBlur}px`;

    // Apply media type
    if (state.type === 'video') {
      if (typeVideoRadio) typeVideoRadio.checked = true;
      bgImage.style.display = 'none';
      bgVideo.style.display = 'block';

      const currentSrc = bgVideo.getAttribute('src');
      const targetSrc = state.isCustomUpload && state.customUrl ? state.customUrl : state.videoUrl;
      if (currentSrc !== targetSrc) {
        bgVideo.src = targetSrc;
        bgVideo.load();
        bgVideo.play().catch(e => console.log('Autoplay deferred:', e));
      }
    } else {
      if (typeImageRadio) typeImageRadio.checked = true;
      bgVideo.pause();
      bgVideo.style.display = 'none';
      bgImage.style.display = 'block';

      const targetSrc = state.isCustomUpload && state.customUrl ? state.customUrl : state.imageUrl;
      bgImage.style.backgroundImage = `url('${targetSrc}')`;
      bgImage.style.backgroundSize = 'cover';
      bgImage.style.backgroundPosition = 'center';
    }

    highlightActivePreset();
  }

  function renderPresetsInPanel() {
    const imgContainer = document.getElementById('preset-images-list');
    const vidContainer = document.getElementById('preset-videos-list');

    if (imgContainer) {
      imgContainer.innerHTML = DEFAULT_PRESETS.images.map(img => `
        <button type="button" data-img-id="${img.id}" class="preset-item preset-img-btn group relative rounded-lg overflow-hidden border-2 transition-all ${state.activeImageId === img.id && !state.isCustomUpload ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700 hover:border-slate-500'}">
          <img src="${img.thumbnail}" alt="${img.title}" class="w-full h-14 object-cover group-hover:scale-105 transition-transform">
          <span class="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-slate-200 px-1 py-0.5 truncate">${img.title}</span>
        </button>
      `).join('');
    }

    if (vidContainer) {
      vidContainer.innerHTML = DEFAULT_PRESETS.videos.map(vid => `
        <button type="button" data-vid-id="${vid.id}" class="preset-item preset-vid-btn group relative rounded-lg overflow-hidden border-2 transition-all ${state.activeVideoId === vid.id && !state.isCustomUpload ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700 hover:border-slate-500'}">
          <img src="${vid.thumbnail}" alt="${vid.title}" class="w-full h-14 object-cover group-hover:scale-105 transition-transform">
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20">
            <i class="fa-solid fa-circle-play text-amber-400 text-lg drop-shadow"></i>
          </div>
          <span class="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-slate-200 px-1 py-0.5 truncate">${vid.title}</span>
        </button>
      `).join('');
    }
  }

  function highlightActivePreset() {
    document.querySelectorAll('.preset-img-btn').forEach(btn => {
      const id = btn.getAttribute('data-img-id');
      if (id === state.activeImageId && !state.isCustomUpload && state.type === 'image') {
        btn.classList.add('border-amber-400', 'ring-2', 'ring-amber-400/50');
        btn.classList.remove('border-slate-700');
      } else {
        btn.classList.remove('border-amber-400', 'ring-2', 'ring-amber-400/50');
        btn.classList.add('border-slate-700');
      }
    });

    document.querySelectorAll('.preset-vid-btn').forEach(btn => {
      const id = btn.getAttribute('data-vid-id');
      if (id === state.activeVideoId && !state.isCustomUpload && state.type === 'video') {
        btn.classList.add('border-amber-400', 'ring-2', 'ring-amber-400/50');
        btn.classList.remove('border-slate-700');
      } else {
        btn.classList.remove('border-amber-400', 'ring-2', 'ring-amber-400/50');
        btn.classList.add('border-slate-700');
      }
    });
  }

  function bindEvents() {
    // Panel toggle button
    const panelToggle = document.getElementById('bg-settings-btn');
    const panel = document.getElementById('bg-customization-panel');
    const closeBtn = document.getElementById('close-bg-panel');

    if (panelToggle && panel) {
      panelToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('hidden');
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (panel && !panel.classList.contains('hidden')) {
        if (!panel.contains(e.target) && !panelToggle.contains(e.target)) {
          panel.classList.add('hidden');
        }
      }
    });

    // Media type radios
    const typeRadios = document.querySelectorAll('input[name="bg-media-type"]');
    typeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.type = e.target.value;
        saveSettings();
        applyState();
      });
    });

    // Sliders
    const darknessSlider = document.getElementById('overlay-darkness-slider');
    const blurSlider = document.getElementById('overlay-blur-slider');

    if (darknessSlider) {
      darknessSlider.addEventListener('input', (e) => {
        state.overlayDarkness = parseFloat(e.target.value) / 100;
        document.getElementById('overlay-darkness-val').textContent = `${e.target.value}%`;
        applyState();
      });
      darknessSlider.addEventListener('change', saveSettings);
    }

    if (blurSlider) {
      blurSlider.addEventListener('input', (e) => {
        state.overlayBlur = parseInt(e.target.value, 10);
        document.getElementById('overlay-blur-val').textContent = `${e.target.value}px`;
        applyState();
      });
      blurSlider.addEventListener('change', saveSettings);
    }

    // Preset Image clicks
    const imgList = document.getElementById('preset-images-list');
    if (imgList) {
      imgList.addEventListener('click', (e) => {
        const btn = e.target.closest('.preset-img-btn');
        if (!btn) return;
        const imgId = btn.getAttribute('data-img-id');
        const found = DEFAULT_PRESETS.images.find(i => i.id === imgId);
        if (found) {
          state.type = 'image';
          state.activeImageId = imgId;
          state.imageUrl = found.url;
          state.isCustomUpload = false;
          delete state.customUrl;
          saveSettings();
          applyState();
        }
      });
    }

    // Preset Video clicks
    const vidList = document.getElementById('preset-videos-list');
    if (vidList) {
      vidList.addEventListener('click', (e) => {
        const btn = e.target.closest('.preset-vid-btn');
        if (!btn) return;
        const vidId = btn.getAttribute('data-vid-id');
        const found = DEFAULT_PRESETS.videos.find(v => v.id === vidId);
        if (found) {
          state.type = 'video';
          state.activeVideoId = vidId;
          state.videoUrl = found.url;
          state.isCustomUpload = false;
          delete state.customUrl;
          saveSettings();
          applyState();
        }
      });
    }

    // Custom File Upload
    const fileInput = document.getElementById('bg-file-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isImage && !isVideo) {
          alert('Please upload a valid image or video file.');
          return;
        }

        const objectUrl = URL.createObjectURL(file);
        state.isCustomUpload = true;
        state.customUrl = objectUrl;
        state.type = isVideo ? 'video' : 'image';

        // Also create a Reader for fallback persistence
        const reader = new FileReader();
        reader.onload = (event) => {
          state.customDataUrl = event.target.result;
          saveSettings();
        };
        reader.readAsDataURL(file);

        applyState();
        const statusEl = document.getElementById('upload-status-text');
        if (statusEl) {
          statusEl.textContent = `Active: ${file.name} (${isVideo ? 'Video' : 'Image'})`;
          statusEl.classList.remove('hidden');
        }
      });
    }

    // Reset Defaults
    const resetBtn = document.getElementById('btn-reset-bg');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state = { ...defaultSettings };
        saveSettings();
        applyState();
        const statusEl = document.getElementById('upload-status-text');
        if (statusEl) statusEl.classList.add('hidden');
      });
    }
  }

  return {
    init,
    getState: () => ({ ...state })
  };
})();
