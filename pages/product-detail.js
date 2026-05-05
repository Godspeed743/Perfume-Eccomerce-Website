// Product Detail page functionality for Al Qamar Perfumes

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    // Load product details
    loadProductDetail(productId);

    // Initialize other functionality
    initProductDetail();
});

function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('product-detail').innerHTML = '<p class="text-center text-[#c0c0c0]">Product not found.</p>';
        return;
    }

    // Update page title
    document.title = `${product.name} - Al Qamar Perfumes`;

    // Populate product detail
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <!-- Product Images -->
        <div class="space-y-4">
            <img src="${product.image}" alt="${product.name}" class="w-full h-96 object-cover rounded-lg bottle-glow">
            <div class="grid grid-cols-4 gap-2">
                <img src="${product.image}" alt="${product.name}" class="w-full h-20 object-cover rounded cursor-pointer border-2 border-theme-gold">
                <img src="${product.image}" alt="${product.name}" class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-theme-turquoise">
                <img src="${product.image}" alt="${product.name}" class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-theme-turquoise">
                <img src="${product.image}" alt="${product.name}" class="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-theme-turquoise">
            </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
            <div>
                <h1 class="text-4xl font-['Crimson_Text'] font-bold text-theme-gold mb-2">${product.name}</h1>
                <div class="flex items-center space-x-4 mb-4">
                    <div class="flex items-center">
                        <span class="text-yellow-400 mr-1">⭐</span>
                        <span class="text-theme-text-secondary">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <span class="text-theme-text-secondary">•</span>
                    <span class="text-theme-text-secondary">${product.category}</span>
                    <span class="text-theme-text-secondary">•</span>
                    <span class="text-theme-text-secondary">${product.gender}</span>
                </div>
                <p class="text-theme-text-secondary text-lg leading-relaxed">${product.description}</p>
            </div>

            <!-- Price and Size Selection -->
            <div class="space-y-4">
                <div class="text-3xl font-bold text-theme-turquoise">Rs. ${product.price}</div>
                <div>
                    <label class="block text-theme-text-secondary mb-2">Size</label>
                    <div class="flex space-x-2">
                        ${product.sizes.map(size => `
                            <button onclick="selectSize('${size}')" class="size-btn px-4 py-2 border border-theme-border rounded hover:border-theme-turquoise transition-colors" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Scent Pyramid -->
            <div class="bg-theme-bg-card border border-theme-border rounded-lg p-6">
                <h3 class="text-xl font-['Crimson_Text'] font-bold text-theme-gold mb-4">Scent Pyramid</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-theme-turquoise mb-2">Top Notes</h4>
                        <p class="text-theme-text-secondary">${product.scentPyramid.top.join(', ')}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-turquoise mb-2">Heart Notes</h4>
                        <p class="text-theme-text-secondary">${product.scentPyramid.heart.join(', ')}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-turquoise mb-2">Base Notes</h4>
                        <p class="text-theme-text-secondary">${product.scentPyramid.base.join(', ')}</p>
                    </div>
                </div>
            </div>

            <!-- Add to Cart -->
            <div class="space-y-4">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center border border-theme-border rounded">
                        <button onclick="updateQuantity(-1)" class="px-3 py-2 text-theme-text-secondary hover:text-theme-text">-</button>
                        <span id="quantity" class="px-4 py-2 text-theme-text">1</span>
                        <button onclick="updateQuantity(1)" class="px-3 py-2 text-theme-text-secondary hover:text-theme-text">+</button>
                    </div>
                    <button onclick="addToCartDetail(${product.id})" class="flex-1 add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
                <button class="w-full bg-theme-bg-secondary border border-theme-border text-theme-text-secondary py-3 rounded-lg font-semibold hover:border-theme-turquoise transition-colors">
                    Add to Wishlist
                </button>
            </div>

            <!-- Product Details -->
            <div class="space-y-4">
                <h3 class="text-xl font-['Crimson_Text'] font-bold text-theme-gold">Product Details</h3>
                <ul class="space-y-2 text-theme-text-secondary">
                    <li>• Concentration: EDP (Eau de Parfum)</li>
                    <li>• Longevity: 8-12 hours</li>
                    <li>• Sillage: Moderate to strong</li>
                    <li>• Season: All seasons</li>
                    <li>• Occasion: Evening, special events</li>
                </ul>
            </div>
        </div>
    `;

    // Load reviews
    loadProductReviews(productId);

    // Load related products
    loadRelatedProducts(productId, product.category);
}

function loadProductReviews(productId) {
    const productReviews = reviews.filter(review => review.productId === productId);
    const reviewsContainer = document.getElementById('product-reviews');

    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-center text-theme-text-secondary">No reviews yet. Be the first to review this product!</p>';
        return;
    }

    reviewsContainer.innerHTML = productReviews.map(review => `
        <div class="bg-theme-bg-card border border-theme-border rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-theme-gold rounded-full flex items-center justify-center">
                        <span class="text-theme-bg-primary font-bold">${review.user.charAt(0)}</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-theme-gold">${review.user}</h4>
                        <div class="flex items-center">
                            ${'⭐'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                            <span class="text-sm text-theme-text-secondary ml-2">${review.date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <p class="text-theme-text-secondary">${review.comment}</p>
        </div>
    `).join('');
}

function loadRelatedProducts(productId, category) {
    const relatedProducts = products
        .filter(p => p.id !== productId && p.category === category)
        .slice(0, 3);

    const relatedContainer = document.getElementById('related-products');

    relatedContainer.innerHTML = relatedProducts.map(product => `
        <div class="bg-theme-bg-card border border-theme-border rounded-lg p-4 hover:border-theme-turquoise transition-all duration-300 cursor-pointer" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-4">
            <h4 class="font-['Crimson_Text'] font-bold text-theme-gold mb-2">${product.name}</h4>
            <p class="text-theme-text-secondary text-sm mb-2">${product.description.substring(0, 60)}...</p>
            <div class="flex items-center justify-between">
                <span class="text-theme-turquoise font-semibold">Rs.${product.price}</span>
                <div class="flex items-center">
                    <span class="text-yellow-400 mr-1">⭐</span>
                    <span class="text-sm text-theme-text-secondary">${product.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function initProductDetail() {
    // Initialize cart and auth
    if (typeof authManager !== 'undefined') {
        authManager.checkExistingSession();
    }
    if (typeof cartManager !== 'undefined') {
        cartManager.loadCart();
        cartManager.updateCartCount();
    }

    // Set up event listeners
    setupProductDetailEventListeners();

    // GSAP animations
    gsap.registerPlugin();

    gsap.from('#product-detail > div:first-child', {
        opacity: 0,
        x: -50,
        duration: 0.8
    });

    gsap.from('#product-detail > div:last-child', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 0.2
    });
}

function setupProductDetailEventListeners() {
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

// Global functions for product detail
let selectedSize = '60ml';
let quantity = 1;

function selectSize(size) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('border-theme-turquoise', 'bg-theme-turquoise/10');
        if (btn.dataset.size === size) {
            btn.classList.add('border-theme-turquoise', 'bg-theme-turquoise/10');
        }
    });
}

function updateQuantity(change) {
    quantity = Math.max(1, quantity + change);
    document.getElementById('quantity').textContent = quantity;
}

function addToCartDetail(productId) {
    if (typeof cartManager !== 'undefined') {
        for (let i = 0; i < quantity; i++) {
            cartManager.addToCart(productId, selectedSize);
        }
        quantity = 1;
        document.getElementById('quantity').textContent = quantity;
    }
}
