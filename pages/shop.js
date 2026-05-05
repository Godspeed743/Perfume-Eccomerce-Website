// Shop page functionality for Al Qamar Perfumes

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shop page
    initShop();
});

function productSlug(name) {
    // Must match perfume-page.js so links resolve to the correct wrappers.
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

function initShop() {
    // Load all products
    loadAllProducts();

    // Set up filters and search
    setupFilters();

    // Initialize cart and auth
    if (typeof authManager !== 'undefined') {
        authManager.checkExistingSession();
    }
    if (typeof cartManager !== 'undefined') {
        cartManager.loadCart();
        cartManager.updateCartCount();
    }

    // Set up event listeners
    setupShopEventListeners();
}

function loadAllProducts() {
    const productGrid = document.getElementById('shop-product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card bg-theme-bg-card border border-theme-border rounded-lg p-6 hover:border-theme-turquoise transition-all duration-300" data-category="${product.category}" data-gender="${product.gender}" data-price="${product.price}" data-name="${product.name.toLowerCase()}">
            <div class="relative mb-4">
                <img src="${product.image}" alt="${product.name}" class="product-image w-full h-64 object-cover rounded-lg bottle-glow">
                <div class="absolute top-2 right-2 bg-theme-gold text-theme-bg-primary px-2 py-1 rounded-full text-xs font-semibold">
                    ${product.rating}⭐
                </div>
            </div>
            <h3 class="text-xl font-bold text-theme-text mb-2">${product.name}</h3>
            <p class="text-theme-text-secondary text-sm mb-4">${product.description.substring(0, 100)}...</p>
            <div class="scent-notes mb-4">
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Top: ${product.scentPyramid.top.join(', ')}
                        <div class="scent-popup">Top notes: ${product.scentPyramid.top.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Heart: ${product.scentPyramid.heart.join(', ')}
                        <div class="scent-popup">Heart notes: ${product.scentPyramid.heart.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary">
                    <span class="scent-note relative cursor-pointer">Base: ${product.scentPyramid.base.join(', ')}
                        <div class="scent-popup">Base notes: ${product.scentPyramid.base.join(', ')}</div>
                    </span>
                </div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-theme-turquoise">Rs. ${product.displayPrice || product.price}</span>
                <span class="text-sm text-theme-text-secondary">${product.category}</span>
            </div>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
            <a href="${productSlug(product.name)}.html" class="block text-center mt-3 text-[#40e0d0] hover:text-[#ffd700] font-semibold">
                View Details
            </a>
        </div>
    `).join('');

    updateResultsCount(products.length);
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const genderFilter = document.getElementById('gender-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');

    const filters = [categoryFilter, genderFilter, priceFilter, sortFilter, searchInput];

    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
            if (filter.type === 'text') {
                filter.addEventListener('input', applyFilters);
            }
        }
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const genderFilter = document.getElementById('gender-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    let filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilter && product.category !== categoryFilter) return false;

        // Gender filter
        if (genderFilter && product.gender !== genderFilter) return false;

        // Price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (product.price < min || (max && product.price > max)) return false;
        }

        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) &&
            !product.description.toLowerCase().includes(searchTerm) &&
            !product.category.toLowerCase().includes(searchTerm)) return false;

        return true;
    });

    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortFilter) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    displayFilteredProducts(filteredProducts);
    updateResultsCount(filteredProducts.length);
}

function displayFilteredProducts(products) {
    const productGrid = document.getElementById('shop-product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card bg-theme-bg-card border border-theme-border rounded-lg p-6 hover:border-theme-turquoise transition-all duration-300" data-category="${product.category}" data-gender="${product.gender}" data-price="${product.price}" data-name="${product.name.toLowerCase()}">
            <div class="relative mb-4">
                <img src="${product.image}" alt="${product.name}" class="product-image w-full h-64 object-cover rounded-lg bottle-glow">
                <div class="absolute top-2 right-2 bg-theme-gold text-theme-bg-primary px-2 py-1 rounded-full text-xs font-semibold">
                    ${product.rating}⭐
                </div>
            </div>
            <h3 class="text-xl font-bold text-theme-text mb-2">${product.name}</h3>
            <p class="text-theme-text-secondary text-sm mb-4">${product.description.substring(0, 100)}...</p>
            <div class="scent-notes mb-4">
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Top: ${product.scentPyramid.top.join(', ')}
                        <div class="scent-popup">Top notes: ${product.scentPyramid.top.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
                    <span class="scent-note relative cursor-pointer">Heart: ${product.scentPyramid.heart.join(', ')}
                        <div class="scent-popup">Heart notes: ${product.scentPyramid.heart.join(', ')}</div>
                    </span>
                </div>
                <div class="flex justify-between text-xs text-theme-text-secondary">
                    <span class="scent-note relative cursor-pointer">Base: ${product.scentPyramid.base.join(', ')}
                        <div class="scent-popup">Base notes: ${product.scentPyramid.base.join(', ')}</div>
                    </span>
                </div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-theme-turquoise">Rs. ${product.displayPrice || product.price}</span>
                <span class="text-sm text-theme-text-secondary">${product.category}</span>
            </div>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
            <a href="${productSlug(product.name)}.html" class="block text-center mt-3 text-[#40e0d0] hover:text-[#ffd700] font-semibold">
                View Details
            </a>
        </div>
    `).join('');
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    }
}

function setupShopEventListeners() {
    // Clear filters
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.getElementById('category-filter').value = '';
            document.getElementById('gender-filter').value = '';
            document.getElementById('price-filter').value = '';
            document.getElementById('sort-filter').value = 'name';
            document.getElementById('search-input').value = '';
            loadAllProducts();
        });
    }

    // Load more (for future pagination)
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real app, this would load more products from server
            loadMoreBtn.textContent = 'All products loaded';
            loadMoreBtn.disabled = true;
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
    const cartModal = document.getElementById('cart-modal');
    const closeCartModal = document.getElementById('close-cart-modal');

    if (cartBtns.length > 0 && cartModal) {
        cartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof cartManager !== 'undefined') {
                    cartManager.updateCartDisplay();
                }
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
    [authModal, cartModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });

    // Auth form submissions
    const loginFormElement = document.getElementById('login-form-element');
    const signupFormElement = document.getElementById('signup-form-element');

    if (loginFormElement && typeof authManager !== 'undefined') {
        loginFormElement.addEventListener('submit', (e) => authManager.handleLogin(e));
    }

    if (signupFormElement && typeof authManager !== 'undefined') {
        signupFormElement.addEventListener('submit', (e) => authManager.handleSignup(e));
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (typeof cartManager !== 'undefined' && cartManager.cart.length === 0) {
                cartManager.showNotification('Your cart is empty!', 'error');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// Initialize GSAP animations for shop page
gsap.registerPlugin();

gsap.from('.product-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '#shop-product-grid',
        start: 'top 80%'
    }
});
