// Shopping cart functionality for Al Qamar Perfumes

class CartManager {
    constructor() {
        this.cart = [];
        this.couponCode = '';
        this.couponDiscountRate = 0; // 0.10 for 10% discount (MOON10)
        this.init();
    }

    init() {
        this.loadCart();
        this.loadCoupon();
        this.updateCartCount();
    }

    addToCart(productId, size = '60ml') {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.cart.find(item =>
            item.id === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                size: size,
                category: product.category,
                scentPyramid: product.scentPyramid
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart!`);
        return true;
    }

    removeFromCart(productId, size = null) {
        if (size) {
            this.cart = this.cart.filter(item =>
                !(item.id === productId && item.size === size)
            );
        } else {
            this.cart = this.cart.filter(item => item.id !== productId);
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(productId, size, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId, size);
            return;
        }

        const item = this.cart.find(item =>
            item.id === productId && item.size === size
        );

        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.updateCartDisplay();
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    getTax(amount) {
        return amount * 0.02; // 2% tax
    }

    getShipping(amount) {
        // Simple shipping estimate: always free
        return 0;
    }

    getCartSummary() {
        const subtotal = this.getCartTotal();
        const discount = subtotal * this.couponDiscountRate;
        const discountedSubtotal = Math.max(0, subtotal - discount);
        const tax = this.getTax(discountedSubtotal);
        const shipping = this.getShipping(discountedSubtotal);
        const total = discountedSubtotal + tax + shipping;

        return {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2)
        };
    }

    getYouMayAlsoLike(limit = 3) {
        if (typeof products === 'undefined' || !Array.isArray(products)) return [];

        const cartIds = new Set(this.cart.map(item => item.id));
        const candidates = products.filter(p => !cartIds.has(p.id));
        const bestCandidates = candidates.filter(p => p.bestseller);
        const picked = (bestCandidates.length ? bestCandidates : candidates).slice(0, limit);
        return picked;
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const count = this.getCartItemsCount();

        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

    updateCartDisplay() {
        const cartItemsElement = document.getElementById('cart-items');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const cartSummaryElement = document.getElementById('cart-summary');
        const couponInputId = 'cart-coupon-input';

        if (!cartItemsElement) return;

        if (this.cart.length === 0) {
            cartItemsElement.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">🛒</div>
                    <p class="text-[#c0c0c0] text-lg mb-4">Your cart is empty</p>
                    <a href="#product-grid" class="bg-[#ffd700] text-[#0f0f23] px-6 py-2 rounded-full font-semibold hover:bg-[#ffd700]/80 transition-colors">
                        Start Shopping
                    </a>
                </div>
            `;

            if (cartSubtotalElement) cartSubtotalElement.textContent = 'Rs. 0.00';
            if (cartSummaryElement) cartSummaryElement.innerHTML = '';
            return;
        }

        const isSubPage = window.location.pathname.includes('/pages/');
        const normalizeImageSrc = function (src) {
            if (isSubPage) return src;
            const s = String(src || '');
            return s.startsWith('../') ? s.replace(/^\.\.\//, '') : s;
        };

        cartItemsElement.innerHTML = this.cart.map(item => {
            let imageSrc = normalizeImageSrc(item.image || '');

            return `
            <div class="flex items-center space-x-4 py-4 border-b border-[#ffd700]/20">
                <img src="${imageSrc}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold text-[#ffd700]">${item.name}</h4>
                    <p class="text-sm text-[#c0c0c0]">${item.category} • ${item.size}</p>
                    <div class="flex items-center mt-2">
                        <button onclick="cartManager.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})"
                                class="bg-[#ffd700]/20 text-[#ffd700] px-2 py-1 rounded mr-2 hover:bg-[#ffd700]/30">-</button>
                        <span class="text-[#c0c0c0] mx-2">${item.quantity}</span>
                        <button onclick="cartManager.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})"
                                class="bg-[#ffd700]/20 text-[#ffd700] px-2 py-1 rounded ml-2 hover:bg-[#ffd700]/30">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-[#40e0d0]">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="cartManager.removeFromCart(${item.id}, '${item.size}')"
                            class="text-red-400 hover:text-red-300 text-sm mt-1">Remove</button>
                </div>
            </div>
        `}).join('');

        const summary = this.getCartSummary();
        if (cartSubtotalElement) cartSubtotalElement.textContent = `Rs. ${summary.subtotal}`;

        if (cartSummaryElement) {
            const alsoLikeProducts = this.getYouMayAlsoLike(3);
            cartSummaryElement.innerHTML = `
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-[#c0c0c0]">Subtotal:</span>
                        <span>Rs. ${summary.subtotal}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#c0c0c0]">Discount:</span>
                        <span>${Number(summary.discount) > 0 ? '-Rs. ' + summary.discount : 'Rs. ' + summary.discount}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#c0c0c0]">Tax:</span>
                        <span>Rs. ${summary.tax}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#c0c0c0]">Shipping:</span>
                        <span>Rs. ${summary.shipping}</span>
                    </div>

                    <div class="pt-2">
                        <div class="flex items-center gap-2">
                            <input
                                id="${couponInputId}"
                                class="w-full px-3 py-2 bg-[#0f0f23] border border-[#ffd700]/20 rounded focus:border-[#40e0d0] focus:outline-none text-white placeholder-[#c0c0c0]"
                                type="text"
                                inputmode="text"
                                placeholder=""
                                value="${this.couponCode || ''}"
                            />
                            <button
                                type="button"
                                onclick="applyCouponFromCart()"
                                class="bg-[#40e0d0] text-[#0f0f23] px-4 py-2 rounded font-semibold hover:bg-[#40e0d0]/80 transition-colors whitespace-nowrap"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-between font-semibold text-[#ffd700] border-t border-[#ffd700]/20 pt-2">
                        <span>Total:</span>
                        <span>Rs. ${summary.total}</span>
                    </div>

                    ${
                        alsoLikeProducts.length
                            ? `
                        <div class="pt-6 mt-4 border-t border-[#ffd700]/20">
                            <h4 class="text-[#ffd700] font-semibold mb-4">You may also like</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                ${alsoLikeProducts.map(product => `
                                    <div class="product-card bg-theme-bg-card border border-theme-border rounded-lg p-4 hover:border-theme-turquoise transition-all duration-300">
                                        <div class="relative mb-3">
                                            <img src="${normalizeImageSrc(product.image)}" alt="${product.name}"
                                                class="product-image w-full h-32 object-cover rounded-lg bottle-glow">
                                            <div class="absolute top-2 right-2 bg-theme-gold text-theme-bg-primary px-2 py-1 rounded-full text-xs font-semibold">
                                                ${product.rating}⭐
                                            </div>
                                        </div>
                                        <h3 class="text-base font-bold text-theme-text mb-1">${product.name}</h3>
                                        <p class="text-theme-text-secondary text-xs mb-3">${product.description.substring(0, 60)}...</p>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-lg font-bold text-theme-turquoise">Rs. ${product.price}</span>
                                        </div>
                                        <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                                            Add to Cart
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `
                            : ''
                    }
                </div>
            `;
        }
    }

    saveCart() {
        localStorage.setItem('alqamar_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const savedCart = localStorage.getItem('alqamar_cart');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            this.cart = parsed.map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    id: item.id,
                    name: item.name || (product ? product.name : ''),
                    price: item.price ?? (product ? product.price : 0),
                    image: item.image || (product ? product.image : ''),
                    quantity: item.quantity || 1,
                    size: item.size || (product && product.sizes ? product.sizes[0] : '60ml'),
                    category: item.category || (product ? product.category : ''),
                    scentPyramid: item.scentPyramid || (product ? product.scentPyramid : { top: [], heart: [], base: [] })
                };
            });
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    loadCoupon() {
        try {
            const raw = localStorage.getItem('alqamar_coupon') || '';
            this.couponCode = String(raw).trim();
            const normalized = this.couponCode.toUpperCase();
            this.couponDiscountRate = normalized === 'MOON10' ? 0.10 : 0;
            if (normalized !== 'MOON10') this.couponCode = '';
        } catch (e) {
            this.couponCode = '';
            this.couponDiscountRate = 0;
        }
    }

    applyCoupon(code) {
        const normalized = String(code || '').trim().toUpperCase();
        if (!normalized) {
            localStorage.removeItem('alqamar_coupon');
            this.couponCode = '';
            this.couponDiscountRate = 0;
            this.showNotification('Coupon removed', 'info');
            this.updateCartDisplay();
            return;
        }

        if (normalized === 'MOON10') {
            this.couponCode = normalized;
            this.couponDiscountRate = 0.10;
            localStorage.setItem('alqamar_coupon', normalized);
            this.showNotification('Coupon applied: MOON10 (-10%)', 'success');
            this.updateCartDisplay();
            return;
        }

        // Unknown coupon: reset discount.
        this.couponCode = '';
        this.couponDiscountRate = 0;
        localStorage.removeItem('alqamar_coupon');
        this.showNotification('Invalid coupon code', 'error');
        this.updateCartDisplay();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg text-white z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        gsap.from(notification, { x: 300, opacity: 0, duration: 0.3 });

        // Auto remove after 3 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: 300,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }

    // Checkout methods
    async processCheckout(paymentMethod, billingInfo) {
        try {
            // Simulate payment processing
            this.showNotification('Processing payment...', 'info');

            await this.delay(2000); // Simulate processing time

            // Create order
            const order = this.createOrder(billingInfo);

            // Save order to user account
            if (authManager.isLoggedIn()) {
                this.saveOrderToUser(order);
            }

            // Clear cart
            this.clearCart();

            this.showNotification('Order placed successfully!', 'success');

            return { success: true, orderId: order.id };
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Payment failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    createOrder(billingInfo) {
        const summary = this.getCartSummary();

        return {
            id: 'ALQ-' + Date.now(),
            date: new Date().toISOString(),
            items: [...this.cart],
            billingInfo,
            summary,
            status: 'Processing'
        };
    }

    saveOrderToUser(order) {
        const user = authManager.getCurrentUser();
        if (user) {
            user.orders = user.orders || [];
            user.orders.push(order);
            localStorage.setItem('alqamar_user', JSON.stringify(user));
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make cart methods globally available
window.addToCart = (productId, size) => cartManager.addToCart(productId, size);
window.updateCartQuantity = (productId, size, quantity) => cartManager.updateQuantity(productId, size, quantity);
window.removeFromCart = (productId, size) => cartManager.removeFromCart(productId, size);

// Coupon helper for cart modal coupon button.
window.applyCouponFromCart = () => {
    const el = document.getElementById('cart-coupon-input');
    const code = el ? el.value : '';
    cartManager.applyCoupon(code);
};
