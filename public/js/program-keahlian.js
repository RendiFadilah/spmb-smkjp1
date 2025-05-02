document.addEventListener('DOMContentLoaded', function() {
    const programItems = document.querySelectorAll('.program-item');
    const programContents = document.querySelectorAll('.program-content');

    programItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            programItems.forEach(i => {
                i.classList.remove('active', 'bg-blue-50');
            });
            programContents.forEach(c => c.classList.add('hidden'));

            // Add active class to clicked item
            this.classList.add('active', 'bg-blue-50');

            // Show corresponding content with fade animation
            const program = this.getAttribute('data-program');
            const content = document.querySelector(`.program-content[data-program="${program}"]`);
            
            content.style.opacity = '0';
            content.classList.remove('hidden');
            
            // Trigger reflow for animation
            content.offsetHeight;
            
            content.style.transition = 'opacity 0.3s ease-in-out';
            content.style.opacity = '1';
        });
    });
});
