// Main application JavaScript for Al Qamar Perfumes

// Form test mode:
// - When true: contact/review forms will not submit to the server (they will only log payloads).
// - When false: forms submit normally to PHP handlers.
const FORM_TEST_MODE = false;
window.FORM_TEST_MODE = FORM_TEST_MODE;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    initMobileMenu();
});

function initApp() {
    // Mobile nav must work even if product globals are missing on some pages
    const hasProducts = typeof products !== 'undefined' && Array.isArray(products);
    const hasReviews = typeof window.reviews !== 'undefined' && Array.isArray(window.reviews);

    // Load products and populate UI
    if (hasProducts) {
        loadProducts();
        loadBestSellers();
    }
    if (hasReviews) {
        loadReviews();
    }

    // Initialize animations
    initAnimations();

    // Set up event listeners
    setupEventListeners();

    // Check for user authentication
    checkAuthStatus();

    // Load cart from localStorage
    const cart = getCartManager();
    if (cart) {
        cart.loadCart();
        cart.updateCartCount();
    } else {
        updateCartCount();
    }

    // Add consistent desktop-only footer policy buttons.
    // Kept hidden on mobile via CSS so it doesn't interrupt mobile footer layouts.
    injectDesktopFooterPolicyButtons();
}

function injectDesktopFooterPolicyButtons() {
    try {
        const footerBottom = document.querySelector('footer .footer-bottom');
        if (!footerBottom) return;

        // Avoid duplicates.
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
        // Silent: footer extras are non-critical.
    }
}

function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    if (typeof products === 'undefined' || !Array.isArray(products)) return;

    const isSubPage = String(window.location.pathname || '').includes('/pages/');
    const normalizeImageSrc = function (src) {
        if (isSubPage) return src;
        const s = String(src || '');
        // Root pages use "./perfume images/..." not "../perfume images/...".
        return s.startsWith('../') ? s.replace(/^\.\.\//, '') : s;
    };

    // Display first 12 products on home page
    const displayProducts = products.slice(0, 12);

    productGrid.innerHTML = displayProducts.map(product => `
        <div class="product-card bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded-lg p-6 hover:border-[#40e0d0] transition-all duration-300">
            <div class="relative mb-4">
                <img src="${normalizeImageSrc(product.image)}" alt="${product.name}" class="product-image w-full h-64 object-cover rounded-lg bottle-glow">
                <div class="absolute top-2 right-2 bg-[#ffd700] text-[#0f0f23] px-2 py-1 rounded-full text-xs font-semibold">
                    ${product.rating}⭐
                </div>
            </div>
            <h3 class="text-xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-2">${product.name}</h3>
            <p class="text-[#c0c0c0] text-sm mb-4">${product.description.substring(0, 100)}...</p>
            <div class="scent-notes mb-4">
                <div class="flex justify-between text-xs text-[#c0c0c0] mb-2">
                    <span class="scent-note relative cursor-pointer">Top: ${product.scentPyramid.top.join(', ')}
                        <div class="scent-popup">Top notes: ${product.scentPyramid.top.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-[#c0c0c0] mb-2">
                    <span class="scent-note relative cursor-pointer">Heart: ${product.scentPyramid.heart.join(', ')}
                        <div class="scent-popup">Heart notes: ${product.scentPyramid.heart.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-[#c0c0c0]">
                    <span class="scent-note relative cursor-pointer">Base: ${product.scentPyramid.base.join(', ')}
                        <div class="scent-popup">Base notes: ${product.scentPyramid.base.join(', ')}</div>
                    </span>
                </div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-[#40e0d0]">Rs${product.price}</span>
                <span class="text-sm text-[#c0c0c0]">${product.category}</span>
            </div>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function loadBestSellers() {
    const bestSellersContainer = document.getElementById('best-sellers-grid');
    if (!bestSellersContainer) return;
    if (typeof products === 'undefined' || !Array.isArray(products)) return;

    function productSlug(name) {
        const raw = String(name || '').trim();
        const normalized = raw.replace(/\(([^)]*)\)/g, (m, inner) => {
            const innerStr = String(inner || '').trim();
            return /\d/.test(innerStr) ? '' : ` ${innerStr} `;
        });

        const s = normalized
            .replace(/&/g, 'and')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric -> hyphen
            .replace(/-+/g, '-') // collapse
            .replace(/^-|-$/g, '');

        return s || raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const isSubPage = String(window.location.pathname || '').includes('/pages/');
    const normalizeImageSrc = function (src) {
        if (isSubPage) return src;
        const s = String(src || '');
        return s.startsWith('../') ? s.replace(/^\.\.\//, '') : s;
    };

    // Specific "Best Sellers" required by design/spec.
    const normalize = (s) => String(s || '').toLowerCase().trim();

    const royalBlack = products.find(p =>
        normalize(p.name).startsWith('royal black') ||
        String(p.image || '').toLowerCase().includes('royal black')
    );
    const summerSoul = products.find(p =>
        normalize(p.name) === 'summer soul' ||
        normalize(p.name).includes('summer soul') ||
        String(p.image || '').toLowerCase().includes('summer soul')
    );
    const madina = products.find(p =>
        normalize(p.name) === 'madina' ||
        String(p.image || '').toLowerCase().includes('madina')
    );
    const king = products.find(p =>
        normalize(p.name) === 'king'
    );

    // Spec: always render these best seller cards in this order.
    const bestSellers = [royalBlack, summerSoul, madina, king].filter(Boolean).slice(0, 4);

    // Use the exact same card layout as the Shop page for visual + functional parity.
    bestSellersContainer.innerHTML = bestSellers.map(product => `
        <div class="product-card bg-theme-bg-card border border-theme-border rounded-lg p-6 hover:border-theme-turquoise transition-all duration-300" data-category="${product.category}" data-gender="${product.gender}" data-price="${product.price}" data-name="${product.name.toLowerCase()}">
            <div class="relative mb-4">
                <img src="${normalizeImageSrc(product.image)}" alt="${product.name}" class="product-image w-full h-64 object-cover rounded-lg bottle-glow">
                <div class="absolute top-2 right-2 bg-theme-gold text-theme-bg-primary px-2 py-1 rounded-full text-xs font-semibold">
                    ${product.rating}⭐
                </div>
            </div>
            <h3 class="text-xl font-bold text-theme-text mb-2">${
                normalize(product.name).startsWith('royal black')
                    ? 'Royal Black'
                    : (normalize(product.name) === 'summer soul' || normalize(product.name).includes('summer soul'))
                        ? 'Summer Soul'
                        : (normalize(product.name) === 'madina')
                            ? 'Madina'
                            : product.name
            }</h3>
            <p class="text-theme-text-secondary text-sm mb-4">${product.description.substring(0, 100)}...</p>
            <div class="scent-notes mb-4">
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Top: ${(product.scentPyramid?.top || []).join(', ')}
                        <div class="scent-popup">Top notes: ${(product.scentPyramid?.top || []).join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Heart: ${(product.scentPyramid?.heart || []).join(', ')}
                        <div class="scent-popup">Heart notes: ${(product.scentPyramid?.heart || []).join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary">
                    <span class="scent-note relative cursor-pointer">Base: ${(product.scentPyramid?.base || []).join(', ')}
                        <div class="scent-popup">Base notes: ${(product.scentPyramid?.base || []).join(', ')}</div>
                    </span>
                </div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-theme-turquoise">Rs. ${product.price}</span>
                <span class="text-sm text-theme-text-secondary">${product.category}</span>
            </div>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
            <a href="pages/${productSlug(product.name)}.html" class="block text-center mt-3 text-[#40e0d0] hover:text-[#ffd700] font-semibold">
                View Details
            </a>
        </div>
    `).join('');
}

function loadReviews() {
    const reviewsSlider = document.getElementById('reviews-slider');
    if (!reviewsSlider) return;
    if (typeof window.reviews === 'undefined' || !Array.isArray(window.reviews)) return;

    reviewsSlider.innerHTML = reviews.map(review => `
        <div class="flex-shrink-0 w-80 bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded-lg p-4 mr-6">
            <div class="flex items-center mb-2">
                <div class="flex text-yellow-400 mr-2">
                    ${'⭐'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                </div>
                <span class="text-sm text-[#c0c0c0]">${review.user}</span>
            </div>
            <p class="text-[#c0c0c0] mb-2">${review.comment}</p>
            <span class="text-xs text-[#c0c0c0]">${review.date}</span>
        </div>
    `).join('');
}

function initAnimations() {
    if (typeof window.gsap === 'undefined') return;
    // GSAP animations
    gsap.registerPlugin();

    // Moon phases animation
    gsap.to("#moon-phases div", {
        scale: 1.2,
        opacity: 1,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });

    // Parallax effect for hero
    if (typeof window.ScrollTrigger !== 'undefined') {
        gsap.to(".parallax-dunes", {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: "#home",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Lunar particles
    createLunarParticles();

    // Product unveil animation
    // IMPORTANT: On HOME, Best Sellers are separate from #product-grid.
    // If we animate all ".product-card" with trigger "#product-grid", Best Sellers
    // remain opacity:0 until you scroll (making them look dim).
    const scrollTriggerAvailable = typeof window.ScrollTrigger !== 'undefined';

    const unveilTargets = [
        { cards: '#product-grid .product-card', trigger: '#product-grid' },
        { cards: '#best-sellers-grid .product-card', trigger: '#best-sellers-grid' },
        { cards: '#shop-product-grid .product-card', trigger: '#shop-product-grid' }
    ];

    unveilTargets.forEach(({ cards, trigger }) => {
        if (!document.querySelector(cards)) return;

        // Bulletproof Best Sellers:
        // - Never run opacity-to-zero animations for Best Sellers.
        // - This prevents intermittent "dim/invisible on reopen" caused by GSAP/ScrollTrigger state.
        if (cards.includes('#best-sellers-grid')) {
            gsap.set(cards, { opacity: 1, visibility: 'visible' });
            return;
        }
        if (scrollTriggerAvailable && document.querySelector(trigger)) {
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: trigger,
                    start: "top 80%"
                }
            });
        } else {
            // Fallback: animate immediately (prevents "stuck opacity:0").
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 0.6,
                stagger: 0.06
            });
        }
    });
}

function createLunarParticles() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'lunar-particle oud-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        container.appendChild(particle);
    }
}

function setupEventListeners() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Auth modal
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.getElementById('close-modal');

    if (authBtn && authModal) {
        authBtn.addEventListener('click', () => {
            authModal.classList.remove('hidden');
            authModal.classList.add('modal-enter');
        });
    }

    if (closeModal && authModal) {
        closeModal.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    }

    // Cart modal
    const cartBtns = document.querySelectorAll('#cart-btn');
    let cartModal = document.getElementById('cart-modal');
    let closeCartModal = document.getElementById('close-cart-modal');

    function injectCartModalIfMissing() {
        if (cartModal) return cartModal;
        if (!cartBtns || cartBtns.length === 0) return null;

        cartModal = document.createElement('div');
        cartModal.id = 'cart-modal';
        cartModal.className =
            'fixed inset-0 bg-black/60 backdrop-blur-sm hidden z-50 flex items-center justify-center';

        cartModal.innerHTML = `
            <div class="relative bg-[#0f0f23] p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-[#ffd700]/20">
                <button id="close-cart-modal" class="absolute top-4 right-4 text-[#c0c0c0] hover:text-white text-2xl leading-none">&times;</button>
                <h3 class="text-2xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-6 pr-8">Your Cart</h3>
                <div id="cart-items"></div>
                <div class="border-t border-[#ffd700]/20 mt-6 pt-6 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg">Subtotal:</span>
                        <span id="cart-subtotal" class="text-lg font-semibold text-[#40e0d0]">Rs. 0.00</span>
                    </div>
                    <div id="cart-summary"></div>
                    <button id="checkout-btn" class="w-full bg-[#ffd700] text-[#0f0f23] py-3 rounded font-semibold hover:bg-[#ffd700]/80 transition-colors">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(cartModal);
        closeCartModal = document.getElementById('close-cart-modal');
        return cartModal;
    }

    injectCartModalIfMissing();

    if (cartBtns.length > 0 && cartModal) {
        cartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateCartDisplay();
                cartModal.classList.remove('hidden');
                cartModal.classList.add('modal-enter');
            });
        });
    }

    if (closeCartModal && cartModal) {
        closeCartModal.addEventListener('click', () => {
            cartModal.classList.add('hidden');
        });
    }

    // Quiz modal
    const startQuiz = document.getElementById('start-quiz');
    const quizModal = document.getElementById('quiz-modal');
    const closeQuizModal = document.getElementById('close-quiz-modal');

    if (startQuiz && quizModal) {
        startQuiz.addEventListener('click', () => {
            startScentQuiz();
            quizModal.classList.remove('hidden');
            quizModal.classList.add('modal-enter');
        });
    }

    if (closeQuizModal && quizModal) {
        closeQuizModal.addEventListener('click', () => {
            quizModal.classList.add('hidden');
        });
    }

    // Switch between login and signup
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (switchToSignup && loginForm && signupForm) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });
    }

    if (switchToLogin && loginForm && signupForm) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    // Close modals when clicking outside
    [authModal, cartModal, quizModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menu = document.querySelector('.mobile-menu');

    if (!hamburger || !overlay || !menu) return;

    const openClass = 'is-open';
    const bodyOpenClass = 'mobile-menu-open';

    function setOpen(nextOpen) {
        overlay.classList.toggle(openClass, nextOpen);
        hamburger.classList.toggle(openClass, nextOpen);
        document.documentElement.classList.toggle(bodyOpenClass, nextOpen);
        hamburger.setAttribute('aria-expanded', String(nextOpen));
    }

    function toggle() {
        setOpen(!overlay.classList.contains(openClass));
    }

    hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        toggle();
    });

    // Close on outside click
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });

    // Close after navigation click (and allow haptic)
    menu.addEventListener('click', function (e) {
        const a = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!a) return;
        if (navigator.vibrate) navigator.vibrate(8);
        setOpen(false);
    });

    // Active highlighting
    const path = (location.pathname || '').toLowerCase();
    const isHome = path.endsWith('/') || path.endsWith('\\') || path.endsWith('index.html');
    const currentKey =
        isHome ? 'home' :
        path.includes('shop') ? 'shop' :
        path.includes('about') ? 'about' :
        path.includes('contact') ? 'contact' :
        path.includes('policies') ? 'policies' :
        '';

    menu.querySelectorAll('a[data-nav]').forEach(function (link) {
        const key = link.getAttribute('data-nav');
        const active = key === currentKey;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    // Touch-friendly haptic on add-to-cart
    document.addEventListener('click', function (e) {
        const btn = e.target && e.target.closest ? e.target.closest('.add-to-cart-btn') : null;
        if (!btn) return;
        if (navigator.vibrate) navigator.vibrate(12);
    });
}

function checkAuthStatus() {
    const token = localStorage.getItem('alqamar_token');
    const user = localStorage.getItem('alqamar_user');

    if (token && user) {
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            const userData = JSON.parse(user);
            authBtn.textContent = `Hi, ${userData.name}`;
            authBtn.href = 'pages/dashboard.html';
        }
    }
}

// Cart functionality

function getCartManager() {
    return (typeof cartManager !== 'undefined' ? cartManager : null);
}

function addToCart(productId, size = '60ml') {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCartManager();
    if (cart) {
        cart.addToCart(productId, size);
        return;
    }

    // Fallback: keep simple cart state locally (for pages without CartManager)
    let localCart = JSON.parse(localStorage.getItem('alqamar_cart')) || [];
    const existingItem = localCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        localCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size
        });
    }

    localStorage.setItem('alqamar_cart', JSON.stringify(localCart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = getCartManager();
    if (cart) {
        cart.updateCartCount();
        return;
    }

    const cartCountElements = document.querySelectorAll('#cart-count');
    const localCart = JSON.parse(localStorage.getItem('alqamar_cart')) || [];
    const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function updateCartDisplay() {
    const cart = getCartManager();
    if (cart) {
        cart.updateCartDisplay();
        return;
    }

    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');

    if (!cartItems || !cartSubtotal) return;

    const localCart = JSON.parse(localStorage.getItem('alqamar_cart')) || [];

    if (localCart.length === 0) {
        cartItems.innerHTML = '<p class="text-[#c0c0c0] text-center py-8">Your cart is empty</p>';
        cartSubtotal.textContent = 'Rs. 0.00';
        return;
    }

    cartItems.innerHTML = localCart.map(item => `
        <div class="flex items-center justify-between py-4 border-b border-[#ffd700]/20">
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                    <h4 class="font-semibold text-[#ffd700]">${item.name}</h4>
                    <p class="text-sm text-[#c0c0c0]">Rs. ${item.price} x ${item.quantity}</p>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
}

function showNotification(message) {
    const cart = getCartManager();
    if (cart) {
        cart.showNotification(message, 'success');
        return;
    }

    // Fallback notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 px-6 py-3 rounded-lg text-white z-50 max-w-sm bg-blue-500';
    notification.textContent = message;

    document.body.appendChild(notification);
    gsap.from(notification, { x: 300, opacity: 0, duration: 0.3 });

    setTimeout(() => {
        gsap.to(notification, {
            x: 300,
            opacity: 0,
            duration: 0.3,
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// Scent Quiz functionality
function startScentQuiz() {
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) return;

    let currentQuestion = 0;
    let answers = [];

    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showResult();
            return;
        }

        const question = quizQuestions[currentQuestion];
        quizContent.innerHTML = `
            <h3 class="text-xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-6 text-center">${question.question}</h3>
            <div class="space-y-3">
                ${question.options.map((option, index) => `
                    <button onclick="selectAnswer(${index})" class="w-full text-left bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded p-3 hover:border-[#40e0d0] transition-colors">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }

    window.selectAnswer = function(index) {
        answers.push(index);
        currentQuestion++;
        showQuestion();
    };

    function showResult() {
        // Simple result logic - you could make this more sophisticated
        const resultKey = quizQuestions[0].options[answers[0]]; // Use first answer for demo
        const recommendedProducts = quizResults[resultKey] || [];

        quizContent.innerHTML = `
            <h3 class="text-xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-6 text-center">Your Lunar Scent Recommendations</h3>
            <p class="text-[#c0c0c0] mb-6 text-center">Based on your answers, we recommend these fragrances:</p>
            <div class="space-y-3">
                ${recommendedProducts.slice(0, 3).map(productId => {
                    const product = products.find(p => p.id === productId);
                    return product ? `
                        <div class="bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded p-3">
                            <h4 class="font-semibold text-[#40e0d0]">${product.name}</h4>
                            <p class="text-sm text-[#c0c0c0]">${product.description.substring(0, 80)}...</p>
                        </div>
                    ` : '';
                }).join('')}
            </div>
            <button onclick="window.location.href='pages/shop.html'" class="add-to-cart-btn mt-6">
                Shop Recommended Scents
            </button>
        `;
    }

    showQuestion();
}

// Checkout functionality (simplified)
// Use event delegation so it also works when the cart modal is injected dynamically.
document.addEventListener('click', function (e) {
    const btn = e.target && e.target.closest ? e.target.closest('#checkout-btn') : null;
    if (!btn) return;

    const cartMgr = getCartManager();
    const cartItems = cartMgr ? cartMgr.cart : (JSON.parse(localStorage.getItem('alqamar_cart')) || []);
    if (!cartItems || cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Redirect to checkout page
    const onPagesFolder = String(window.location.pathname || '').includes('/pages/');
    window.location.href = onPagesFolder ? 'checkout.html' : 'pages/checkout.html';
});
