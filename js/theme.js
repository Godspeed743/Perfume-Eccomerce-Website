// Theme management for Al Qamar Perfumes
// Dark theme only - light theme removed

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Fallback if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Make theme methods globally available
window.getCurrentTheme = () => window.themeManager?.currentTheme || 'dark';

// Desktop-only footer extras (do not affect mobile layout).
function injectDesktopFooterPolicyButtons() {
    try {
        const footerBottom = document.querySelector('footer .footer-bottom');
        if (!footerBottom) return;

        if (document.getElementById('footer-policy-buttons')) return;

        const copyrightP = footerBottom.querySelector('p');
        if (!copyrightP) return;

        const policiesHref = String(window.location.pathname || '').includes('/pages/')
            ? 'policies.html'
            : 'pages/policies.html';

        const wrapper = document.createElement('div');
        wrapper.id = 'footer-policy-buttons';
        wrapper.className = 'footer-desktop-policy-buttons';

        const buttons = [
            'Privacy Policy',
            'Return Policy',
            'Refund Policy',
            'Disclaimer'
        ];

        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.addEventListener('click', function () {
                window.location.href = policiesHref;
            });
            wrapper.appendChild(btn);
        });

        copyrightP.insertAdjacentElement('afterend', wrapper);
    } catch (e) {
        // Non-critical; fail silently.
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDesktopFooterPolicyButtons);
} else {
    injectDesktopFooterPolicyButtons();
}


