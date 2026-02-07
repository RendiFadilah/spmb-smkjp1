document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const brandText = nav.querySelector('.nav-brand-text');
  const brandSub = nav.querySelector('.nav-brand-sub');
  const userTexts = nav.querySelectorAll('.nav-user-text');
  const ctaBtn = nav.querySelector('.nav-cta-btn');
  const hamburgerLines = nav.querySelectorAll('.nav-hamburger-line');

  // ===== DARK MODE =====
  const darkToggle = document.getElementById('darkModeToggle');
  const html = document.documentElement;

  function applyDarkMode(isDark) {
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    updateToggleIcon();
    update(); // re-apply navbar colors
  }

  function updateToggleIcon() {
    if (!darkToggle) return;
    const isDark = html.classList.contains('dark');
    const moonIcon = darkToggle.querySelector('.dark-icon');
    const sunIcon = darkToggle.querySelector('.light-icon');
    if (isDark) {
      moonIcon && moonIcon.classList.add('hidden');
      sunIcon && sunIcon.classList.remove('hidden');
    } else {
      moonIcon && moonIcon.classList.remove('hidden');
      sunIcon && sunIcon.classList.add('hidden');
    }
  }

  // Init dark mode from localStorage
  const savedDark = localStorage.getItem('darkMode');
  if (savedDark === 'true') {
    html.classList.add('dark');
  } else if (savedDark === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark');
  }
  updateToggleIcon();

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      applyDarkMode(!html.classList.contains('dark'));
    });
  }

  // ===== SCROLL NAVBAR =====
  function update() {
    var scrolled = window.scrollY > 60;
    var isDark = html.classList.contains('dark');

    if (scrolled) {
      if (isDark) {
        nav.classList.remove('bg-transparent', 'bg-white/95');
        nav.classList.add('bg-gray-900/95', 'backdrop-blur-xl', 'shadow-lg', 'shadow-black/20', 'border-b', 'border-gray-700/50');
      } else {
        nav.classList.remove('bg-transparent', 'bg-gray-900/95', 'border-gray-700/50', 'shadow-black/20');
        nav.classList.add('bg-white/95', 'backdrop-blur-xl', 'shadow-lg', 'shadow-black/5', 'border-b', 'border-gray-200/50');
      }
      nav.style.paddingTop = '0.5rem';
      nav.style.paddingBottom = '0.5rem';

      if (isDark) {
        if (brandText) { brandText.classList.remove('text-white', 'text-gray-900'); brandText.classList.add('text-white'); }
        if (brandSub) { brandSub.classList.remove('text-white/60', 'text-gray-500'); brandSub.classList.add('text-gray-400'); }
        userTexts.forEach(function (t) { t.classList.remove('text-white', 'text-white/60', 'text-gray-700'); t.classList.add('text-gray-300'); });
        hamburgerLines.forEach(function (l) { l.classList.remove('bg-white', 'bg-gray-700'); l.classList.add('bg-gray-300'); });
      } else {
        if (brandText) { brandText.classList.remove('text-white'); brandText.classList.add('text-gray-900'); }
        if (brandSub) { brandSub.classList.remove('text-white/60', 'text-gray-400'); brandSub.classList.add('text-gray-500'); }
        userTexts.forEach(function (t) { t.classList.remove('text-white', 'text-white/60', 'text-gray-300'); t.classList.add('text-gray-700'); });
        hamburgerLines.forEach(function (l) { l.classList.remove('bg-white', 'bg-gray-300'); l.classList.add('bg-gray-700'); });
      }

      if (ctaBtn) {
        ctaBtn.classList.remove('bg-white/15', 'border-white/25', 'text-white');
        ctaBtn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'border-transparent', 'shadow-lg', 'shadow-blue-500/25');
      }

      // Dark mode toggle button when scrolled
      if (darkToggle) {
        if (isDark) {
          darkToggle.classList.remove('bg-white/10', 'border-white/15', 'text-white');
          darkToggle.classList.add('bg-gray-800', 'border-gray-700', 'text-yellow-400');
        } else {
          darkToggle.classList.remove('bg-white/10', 'border-white/15', 'text-white', 'bg-gray-800', 'border-gray-700', 'text-yellow-400');
          darkToggle.classList.add('bg-gray-100', 'border-gray-200', 'text-gray-600');
        }
      }

      nav.querySelectorAll('#navbar-sticky > ul > li > a').forEach(function (a) {
        a.classList.remove('md:text-white/80', 'md:hover:text-white', 'md:hover:bg-white/10');
        if (isDark) {
          a.classList.remove('md:text-gray-600', 'md:hover:text-blue-600', 'md:hover:bg-blue-50');
          a.classList.add('md:text-gray-300', 'md:hover:text-blue-400', 'md:hover:bg-gray-800');
        } else {
          a.classList.remove('md:text-gray-300', 'md:hover:text-blue-400', 'md:hover:bg-gray-800');
          a.classList.add('md:text-gray-600', 'md:hover:text-blue-600', 'md:hover:bg-blue-50');
        }
      });
    } else {
      nav.classList.remove('bg-white/95', 'bg-gray-900/95', 'backdrop-blur-xl', 'shadow-lg', 'shadow-black/5', 'shadow-black/20', 'border-b', 'border-gray-200/50', 'border-gray-700/50');
      nav.classList.add('bg-transparent');
      nav.style.paddingTop = '';
      nav.style.paddingBottom = '';

      if (brandText) { brandText.classList.add('text-white'); brandText.classList.remove('text-gray-900'); }
      if (brandSub) { brandSub.classList.add('text-white/60'); brandSub.classList.remove('text-gray-500', 'text-gray-400'); }
      userTexts.forEach(function (t) { t.classList.add('text-white', 'text-white/60'); t.classList.remove('text-gray-700', 'text-gray-300'); });
      hamburgerLines.forEach(function (l) { l.classList.add('bg-white'); l.classList.remove('bg-gray-700', 'bg-gray-300'); });

      if (ctaBtn) {
        ctaBtn.classList.add('bg-white/15', 'border-white/25', 'text-white');
        ctaBtn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'border-transparent', 'shadow-lg', 'shadow-blue-500/25');
      }

      // Dark mode toggle button at top (hero)
      if (darkToggle) {
        darkToggle.classList.remove('bg-gray-100', 'border-gray-200', 'text-gray-600', 'bg-gray-800', 'border-gray-700', 'text-yellow-400');
        darkToggle.classList.add('bg-white/10', 'border-white/15', 'text-white');
      }

      nav.querySelectorAll('#navbar-sticky > ul > li > a').forEach(function (a) {
        a.classList.add('md:text-white/80', 'md:hover:text-white', 'md:hover:bg-white/10');
        a.classList.remove('md:text-gray-600', 'md:hover:text-blue-600', 'md:hover:bg-blue-50', 'md:text-gray-300', 'md:hover:text-blue-400', 'md:hover:bg-gray-800');
      });
    }
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
});
