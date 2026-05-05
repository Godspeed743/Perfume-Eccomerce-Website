// Authentication system for Al Qamar Perfumes

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    }

    checkExistingSession() {
        const token = localStorage.getItem('alqamar_token');
        const user = localStorage.getItem('alqamar_user');

        if (token && user) {
            this.token = token;
            this.currentUser = JSON.parse(user);
            this.updateUIForLoggedInUser();
        }
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form-element');
        const signupForm = document.getElementById('signup-form-element');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const rememberMe = e.target.querySelector('input[type="checkbox"]').checked;

        try {
            const user = await this.authenticateUser(email, password);

            if (user) {
                this.currentUser = user;
                this.token = this.generateToken();
                this.saveSession(rememberMe);
                this.updateUIForLoggedInUser();
                this.closeAuthModal();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification('Invalid email or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            const newUser = await this.createUser(name, email, password);

            if (newUser) {
                this.currentUser = newUser;
                this.token = this.generateToken();
                this.saveSession(true);
                this.updateUIForLoggedInUser();
                this.closeAuthModal();
                this.showNotification('Account created successfully!', 'success');
            } else {
                this.showNotification('Email already exists', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Signup failed. Please try again.', 'error');
        }
    }

    async authenticateUser(email, password) {
        // Simulate API call - in real app, this would be a server request
        await this.delay(1000); // Simulate network delay

        // Check demo users first
        let user = demoUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            // Check localStorage users
            const localUsers = JSON.parse(localStorage.getItem('alqamar_users') || '[]');
            user = localUsers.find(u => u.email === email && u.password === this.hashPassword(password));
        }

        return user || null;
    }

    async createUser(name, email, password) {
        // Simulate API call
        await this.delay(1000);

        const localUsers = JSON.parse(localStorage.getItem('alqamar_users') || '[]');

        // Check if user already exists
        if (localUsers.find(u => u.email === email)) {
            return null;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password: this.hashPassword(password),
            addresses: [],
            orders: [],
            wishlist: []
        };

        localUsers.push(newUser);
        localStorage.setItem('alqamar_users', JSON.stringify(localUsers));

        return newUser;
    }

    hashPassword(password) {
        // Simple hash simulation - in real app, use proper hashing
        return btoa(password + 'alqamar_salt');
    }

    generateToken() {
        // Simple JWT simulation
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            userId: this.currentUser.id,
            email: this.currentUser.email,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        const signature = btoa('alqamar_secret_key'); // In real app, use proper signing

        return `${header}.${payload}.${signature}`;
    }

    saveSession(rememberMe) {
        localStorage.setItem('alqamar_token', this.token);
        localStorage.setItem('alqamar_user', JSON.stringify(this.currentUser));

        if (!rememberMe) {
            // Set session to expire in 24 hours
            setTimeout(() => {
                this.logout();
            }, 24 * 60 * 60 * 1000);
        }
    }

    updateUIForLoggedInUser() {
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.textContent = `Hi, ${this.currentUser.name}`;
            authBtn.href = 'pages/dashboard.html';
            authBtn.removeEventListener('click', this.showAuthModal);
        }

        // Update cart and other user-specific elements
        this.updateUserElements();
    }

    updateUserElements() {
        // Update cart with user-specific data if needed
        // This could include saved carts, etc.
    }

    logout() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('alqamar_token');
        localStorage.removeItem('alqamar_user');

        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.textContent = 'Login';
            authBtn.href = '#';
            authBtn.addEventListener('click', () => this.showAuthModal());
        }

        this.showNotification('Logged out successfully', 'success');
        // Redirect to home if on dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = '../index.html';
        }
    }

    showAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('hidden');
            authModal.classList.add('modal-enter');
        }
    }

    closeAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods
    isLoggedIn() {
        return this.currentUser !== null && this.token !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getToken() {
        return this.token;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Make logout function globally available
window.logout = () => authManager.logout();
