// ============================================
// MATHRUCHAYA HOSPITAL - JAVASCRIPT
// Interactive Functions & Animations
// ============================================

// ============================================
// FORM VALIDATION FOR APPOINTMENT FORM
// ============================================

function validateAppointmentForm() {
    const form = document.querySelector('form[action="/book"]');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const doctorSelect = form.querySelector('select[name="doctor"]');
        const reasonInput = form.querySelector('textarea[name="reason"]');
        const dateInput = form.querySelector('input[name="date"]');

        let isValid = true;

        // Validate Name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else if (nameInput.value.trim().length < 3) {
            showError(nameInput, 'Name must be at least 3 characters');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Validate Phone
        const phoneRegex = /[\d\+\-\s()]{10,}/;
        if (!phoneInput.value.trim()) {
            showError(phoneInput, 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
            showError(phoneInput, 'Phone must be at least 10 digits');
            isValid = false;
        } else {
            clearError(phoneInput);
        }

        // Validate Doctor
        if (!doctorSelect.value) {
            showError(doctorSelect, 'Please select a doctor');
            isValid = false;
        } else {
            clearError(doctorSelect);
        }

        // Validate Reason
        if (!reasonInput.value.trim()) {
            showError(reasonInput, 'Please describe your reason for visit');
            isValid = false;
        } else if (reasonInput.value.trim().length < 10) {
            showError(reasonInput, 'Please provide more details (minimum 10 characters)');
            isValid = false;
        } else {
            clearError(reasonInput);
        }

        // Validate Date
        if (!dateInput.value) {
            showError(dateInput, 'Date is required');
            isValid = false;
        } else {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showError(dateInput, 'Please select a future date');
                isValid = false;
            } else {
                clearError(dateInput);
            }
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                clearError(this);
            }
        });
    });
}

// ============================================
// ERROR AND SUCCESS MESSAGE HANDLERS
// ============================================

function showError(element, message) {
    element.classList.add('error');
    element.classList.remove('success');
    
    // Remove existing error message
    const existingError = element.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

function clearError(element) {
    element.classList.remove('error');
    element.classList.add('success');
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.style.display = 'none';
    }
}

// ============================================
// SCROLL REVEAL ANIMATION
// Animate elements as they come into view
// ============================================

function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section h2').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// COUNTER ANIMATION FOR STATS
// Animate counter numbers when in view
// ============================================

function setupCounterAnimation() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                const h2 = entry.target.querySelector('h2');
                if (h2) {
                    const text = h2.textContent.trim();
                    h2.dataset.original = text;
                    entry.target.dataset.counted = 'true';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat').forEach(stat => {
        observer.observe(stat);
    });
}

// ============================================
// ACTIVE LINK STYLING
// ============================================

function setupActiveLinks() {
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.style.color = 'var(--secondary-color)';
            link.style.fontWeight = '700';
        }
    });
}

// ============================================
// SMOOTH SCROLL TO ELEMENT
// ============================================

function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// INITIALIZATION
// Run all functions when DOM is ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hospital Website Initialized');

    // Initialize all functions
    validateAppointmentForm();
    setupScrollReveal();
    setupCounterAnimation();
    setupActiveLinks();

    // Fade in body
    document.body.style.opacity = '1';
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Detect if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// COUNTER ANIMATION FOR STATS
// Animate counter numbers when in view
// ============================================

function setupCounterAnimation() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                const counter = entry.target.querySelector('.stat-counter') || entry.target.querySelector('h2');
                if (counter) {
                    animateCounter(counter);
                    entry.target.dataset.counted = 'true';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat').forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text);
    
    if (isNaN(number)) return;

    let current = 0;
    const increment = number / 30; // Animate over ~30 frames
    const duration = 1000; // 1 second
    const frameRate = duration / 30;

    const counter = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
            clearInterval(counter);
        } else {
            if (text.includes('+')) {
                element.textContent = Math.floor(current) + '+';
            } else if (text.includes('/7')) {
                element.textContent = text;
            } else {
                element.textContent = Math.floor(current) + number.toString().endsWith('+') ? '+' : '';
            }
        }
    }, frameRate);
}

// ============================================
// NAVIGATION HIGHLIGHT
// Highlight current section in navbar
// ============================================

function setupNavHighlight() {
    const sections = document.querySelectorAll('.section, .hero, .stats, .cta');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id') || 'home';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current || 
                (current === 'home' && link.getAttribute('href') === '/')) {
                link.style.color = 'var(--secondary-color)';
            }
        });
    });
}

// ============================================
// ACTIVE LINK STYLING
// ============================================

function setupActiveLinks() {
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.style.color = 'var(--secondary-color)';
            link.style.fontWeight = '700';
        }
    });
}

// ============================================
// MOBILE MENU TOGGLE (Optional)
// ============================================

function setupMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navDiv = document.querySelector('.navbar div');

    // Check if already has mobile menu setup
    if (window.innerWidth <= 768) {
        // Mobile optimization already handled by CSS
        // But we can add further JS enhancements here if needed
    }
}

// ============================================
// FORM INPUT ENHANCEMENT
// Add focus states and placeholder handling
// ============================================

function enhanceFormInputs() {
    const inputs = document.querySelectorAll('form input, form select, form textarea');

    inputs.forEach(input => {
        // Add focus events
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
        });

        input.addEventListener('blur', function() {
            if (this.value) {
                this.classList.add('success');
            } else {
                this.classList.remove('success');
            }
            this.style.borderColor = '';
        });

        // Validate on input change
        if (input.type === 'tel' || input.name === 'phone') {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }
    });
}

// ============================================
// WHATSAPP BUTTON ENHANCEMENT
// ============================================

function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;

    // Add tooltip
    whatsappBtn.setAttribute('title', 'Chat with us on WhatsApp');

    // Log click for analytics (optional)
    whatsappBtn.addEventListener('click', function(e) {
        console.log('WhatsApp button clicked');
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + B: Scroll to book appointment button
        if (e.altKey && e.key.toLowerCase() === 'b') {
            const bookBtn = document.querySelector('a[href="/appointment"]');
            if (bookBtn) {
                bookBtn.scrollIntoView({ behavior: 'smooth' });
                bookBtn.focus();
            }
        }

        // Alt + D: Scroll to doctors section
        if (e.altKey && e.key.toLowerCase() === 'd') {
            const doctorsSection = document.querySelector('.section:nth-of-type(2)');
            if (doctorsSection) {
                doctorsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// ============================================
// INITIALIZATION
// Run all functions when DOM is ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hospital Website Initialized');

    // Initialize all functions
    validateAppointmentForm();
    setupScrollReveal();
    setupCounterAnimation();
    setupActiveLinks();
    setupNavHighlight();
    setupMobileMenu();
    enhanceFormInputs();
    setupWhatsAppButton();
    setupKeyboardShortcuts();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Detect if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add loading state to buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Loading...';
    return () => {
        button.disabled = false;
        button.textContent = originalText;
    };
}

// ============================================
// LOG ANALYTICS (Optional)
// ============================================

function logPageAnalytics() {
    if (typeof console !== 'undefined') {
        console.log('Page: ' + document.title);
        console.log('URL: ' + window.location.href);
        console.log('Referrer: ' + document.referrer);
    }
}

// Call analytics on page load
window.addEventListener('load', logPageAnalytics);
