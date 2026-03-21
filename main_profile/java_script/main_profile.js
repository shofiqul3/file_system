// script.js - FIXED VERSION

// Animated Mobile Menu
class AnimatedMobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.desktopMenu = document.getElementById('desktopMenu');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuOverlay = document.getElementById('mobileOverlay');
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.detectDevice();
        this.setupClickOutside();
    }
    
    detectDevice() {
        this.isMobile = window.innerWidth <= 768;
        
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            
            if (!this.isMobile && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    setupEventListeners() {
        this.menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        this.menuOverlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    setupAccessibility() {
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.menuBtn.setAttribute('aria-label', 'Open mobile menu');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        this.desktopMenu.setAttribute('aria-hidden', 'false');
    }
    
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.mobileMenu.classList.add('active');
        this.menuOverlay.classList.add('active');
        this.menuBtn.classList.add('active');
        this.menuBtn.setAttribute('aria-expanded', 'true');
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        
        // FIXED: Animate menu items properly
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            // First remove any inline styles that might block CSS
            item.style.cssText = '';
            
            // Force reflow to restart animation
            void item.offsetWidth;
            
            // Now let CSS handle the animation
            item.classList.remove('animated');
            void item.offsetWidth; // Force reflow again
            item.classList.add('animated');
            
            // Set delay through CSS variable
            item.style.setProperty('--animation-delay', `${(index + 1) * 0.1}s`);
        });
        
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.mobileMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        this.menuBtn.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        
        // FIXED: Clean up animation classes and inline styles
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        menuItems.forEach(item => {
            item.classList.remove('animated');
            item.style.cssText = '';
        });
        
        document.body.style.overflow = '';
        this.menuBtn.focus();
    }
    
    scrollToSection(sectionId) {
        const targetElement = document.querySelector(sectionId);
        if (targetElement) {
            const headerHeight = 70;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (this.isOpen) {
                this.closeMenu();
            }
        }
    }
}

// Profile Picture Animation
class ProfileAnimation {
    constructor() {
        this.profilePicture = document.getElementById('profilePicture');
        this.init();
    }
    
    init() {
        this.setupProfilePicture();
        this.setupHoverEffects();
        this.setupImageFallback();
    }
    
    setupProfilePicture() {
        if (!this.profilePicture) return;
        
        this.profilePicture.addEventListener('click', () => {
            this.createPulseEffect();
        });
        
        let lastClick = 0;
        this.profilePicture.addEventListener('dblclick', (e) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClick;
            
            if (timeDiff < 300) {
                this.createHeartEffect(e);
                lastClick = 0;
            } else {
                lastClick = currentTime;
            }
        });
    }
    
    setupHoverEffects() {
        if (!this.profilePicture) return;
        
        this.profilePicture.addEventListener('mouseenter', () => {
            this.profilePicture.style.filter = 'brightness(1.1) saturate(1.2)';
        });
        
        this.profilePicture.addEventListener('mouseleave', () => {
            this.profilePicture.style.filter = 'brightness(1) saturate(1)';
        });
    }
    
    createPulseEffect() {
        const pulse = document.createElement('div');
        pulse.className = 'pulse-effect';
        pulse.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            animation: pulse-expand 0.6s ease-out;
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
        `;
        
        this.profilePicture.parentElement.style.position = 'relative';
        this.profilePicture.parentElement.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, 600);
    }
    
    createHeartEffect(event) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'heart-effect';
        heart.style.cssText = `
            position: absolute;
            font-size: 24px;
            animation: heart-float 1s ease-out forwards;
            pointer-events: none;
            z-index: 2;
            left: ${event.clientX - 12}px;
            top: ${event.clientY - 12}px;
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
    
    setupImageFallback() {
        if (!this.profilePicture) return;
        
        this.profilePicture.addEventListener('error', () => {
            console.log('Profile image failed to load, using placeholder');
            this.profilePicture.src = this.createPlaceholderSVG();
        });
    }
    
    createPlaceholderSVG() {
        return 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#grad)" stroke="white" stroke-width="3"/>
                <text x="100" y="115" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
                    SI
                </text>
            </svg>
        `);
    }
}

// Contact Button Animations
class ContactButtonAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRippleEffects();
        this.setupHoverAnimations();
        this.addRippleStyles();
    }
    
    setupRippleEffects() {
        const buttons = document.querySelectorAll('.contact-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    setupHoverAnimations() {
        const buttons = document.querySelectorAll('.contact-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-8px) scale(1.03)';
                button.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    createRipple(event, button) {
        const existingRipples = button.querySelectorAll('.ripple');
        existingRipples.forEach(ripple => ripple.remove());
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    addRippleStyles() {
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollListener();
        this.animateOnLoad();
    }
    
    setupScrollListener() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            const header = document.querySelector('header');
            if (currentScroll > 50) {
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
            
            if (currentScroll > lastScrollTop) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            this.animateOnScroll();
        });
    }
    
    animateOnLoad() {
        const elements = document.querySelectorAll('.profile-name, .profile-title, .profile-bio, .btn');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    animateOnScroll() {
        const elements = document.querySelectorAll('.contact-btn, .edu-card, .section-title');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu = new AnimatedMobileMenu();
    window.profileAnimation = new ProfileAnimation();
    window.contactAnimations = new ContactButtonAnimations();
    window.scrollAnimations = new ScrollAnimations();
    
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    console.log('Portfolio with animated menu initialized!');
    
    const allButtons = document.querySelectorAll('button, .btn, .contact-btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.cursor = 'pointer';
        });
    });
});

// Utility functions
window.utils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    isMobile: function() {
        return window.innerWidth <= 768;
    }
};

window.addEventListener('resize', window.utils.debounce(() => {
    if (window.mobileMenu && !window.utils.isMobile() && window.mobileMenu.isOpen) {
        window.mobileMenu.closeMenu();
    }
}, 250));
