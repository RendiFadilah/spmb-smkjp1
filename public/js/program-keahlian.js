document.addEventListener('DOMContentLoaded', function() {
    const programItems = document.querySelectorAll('.program-item');
    const programContents = document.querySelectorAll('.program-content');

    programItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active state from all items
            programItems.forEach(i => {
                i.classList.remove('active', 'bg-white/10', 'bg-blue-50');
                i.classList.add('border-transparent');
                i.classList.remove('border-white/10', 'border-blue-200');
            });
            programContents.forEach(c => c.classList.add('hidden'));

            // Add active state to clicked item
            this.classList.add('active', 'bg-blue-50', 'bg-white/10');
            this.classList.remove('border-transparent');
            this.classList.add('border-blue-200', 'border-white/10');

            // Show corresponding content with fade
            const program = this.getAttribute('data-program');
            const content = document.querySelector('.program-content[data-program="' + program + '"]');
            
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
                content.classList.remove('hidden');
                
                // Trigger reflow
                content.offsetHeight;
                
                content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        });
    });
});
