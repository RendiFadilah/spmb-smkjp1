// Function to handle navbar background on scroll
function handleNavbarScroll() {
  const navbar = document.querySelector('nav');
  const mobileMenu = document.querySelector('#navbar-sticky ul');
  
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200/80');
      navbar.classList.remove('bg-transparent', 'border-transparent');
      
      // Update mobile menu background only if it's visible
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('bg-white/95', 'backdrop-blur-md');
        mobileMenu.classList.remove('bg-white/90');
      }
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200/80');
      navbar.classList.add('bg-transparent', 'border-transparent');
      
      // Reset mobile menu background
      mobileMenu.classList.remove('bg-white/95', 'backdrop-blur-md');
      mobileMenu.classList.add('bg-white/90');
    }
  }

  // Initial check
  updateNavbar();
  
  // Update on scroll
  window.addEventListener('scroll', updateNavbar);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', handleNavbarScroll);
