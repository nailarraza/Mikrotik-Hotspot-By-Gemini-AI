/**
 * Memuat komponen HTML dari file partial ke dalam elemen placeholder.
 * @param {string} placeholderId - ID dari elemen placeholder.
 * @param {string} url - Path ke file HTML partial.
 */
async function loadComponent(placeholderId, url) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Placeholder dengan ID '${placeholderId}' tidak ditemukan.`);
        return;
    }
    try {
        const response = await fetch(url);
        if (response.ok) {
            placeholder.outerHTML = await response.text();
        } else {
            placeholder.innerHTML = `<p class="component-error">Gagal memuat: ${url}</p>`;
        }
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        placeholder.innerHTML = `<p class="component-error">Gagal mengambil komponen.</p>`;
    }
}

/**
 * Mengatur semua event listener setelah komponen utama dimuat.
 */
function setupEventListeners() {
    // --- Fungsionalitas Dark Mode ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (themeToggleBtn && themeToggleDarkIcon && themeToggleLightIcon) {
        // Fungsi untuk memperbarui ikon berdasarkan tema
        const updateThemeIcons = (isDark) => {
            themeToggleDarkIcon.classList.toggle('hidden', isDark);
            themeToggleLightIcon.classList.toggle('hidden', !isDark);
        };

        // Cek tema saat ini dan terapkan
        const isDarkMode = localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDarkMode);
        updateThemeIcons(isDarkMode);

        // Tambahkan event listener ke tombol
        themeToggleBtn.addEventListener('click', function() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        });
    }

    // --- Fungsionalitas Modal "Tentang" ---
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');

    if (aboutBtn && aboutModal) {
        aboutBtn.addEventListener('click', () => aboutModal.classList.add('active'));

        if (closeAboutModalBtn) {
            closeAboutModalBtn.addEventListener('click', () => aboutModal.classList.remove('active'));
        }

        // Klik di luar modal untuk menutup
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
            }
        });
    }
}

/**
 * Inisialisasi halaman: muat semua komponen lalu atur event listener.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Muat semua komponen secara bersamaan
    await Promise.all([
        loadComponent('navbar-placeholder', 'partials/navbar.html'),
        loadComponent('footer-placeholder', 'partials/footer.html'),
        loadComponent('modal-placeholder', 'partials/about_modal.html')
    ]);

    // Setelah semua komponen berhasil dimuat, baru kita pasang event listener-nya
    setupEventListeners();
});