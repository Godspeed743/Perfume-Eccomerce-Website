================================================================================
                        MOHAMMAD AL QAMAR PERFUMES
                Luxury Arabian Fragrances E-Commerce Website
================================================================================

PROJECT OVERVIEW
================================================================================

Al Qamar Perfumes is a modern, static HTML/CSS/JavaScript e-commerce website
specializing in premium Arabian luxury fragrances. The site features a curated
collection of scents with detailed product information, customer reviews, a
personalized scent quiz, and full e-commerce functionality including shopping
cart, checkout, and order management.

KEY FEATURES
================================================================================

- Dynamic product catalog with filtering and search
- Detailed product pages with scent pyramids (top, heart, base notes)
- Personalized scent quiz to recommend fragrances
- Shopping cart with localStorage persistence
- Client-side authentication system (demo account included)
- Dark theme with golden, aqua, and white accent colors
- Responsive design with Tailwind CSS
- Smooth animations powered by GSAP
- Order tracking and management
- Admin dashboard for viewing orders
- Multiple product variants (sizes)
- Customer review system
- Contact form with email integration
- FAQ and policy pages

QUICK START
================================================================================

1. RUNNING LOCALLY

   Option A: Using Python
   ----------------------
   python -m http.server 8080
   Then open http://localhost:8080 in your browser

   Option B: Using Node (with npx)
   --------------------------------
   npx serve .
   Then open http://localhost:5000 in your browser

   Option C: Direct file access
   ----------------------------
   Open index.html directly in a browser (limited functionality for sub-pages)

2. DEMO ACCOUNT

   Email: demo@alqamar.com
   Password: demo123

PROJECT STRUCTURE
================================================================================

Root Directory
  ├── index.html                    Homepage (main landing page)
  ├── AGENTS.md                     Development guidelines
  ├── DEPLOYMENT_GUIDE.md           Deployment instructions
  ├── README.txt                    This file
  ├── TODO.md                       Development tasks
  │
  ├── css/
  │   ├── styles.css               Custom component styles
  │   └── theme.css                Dark theme CSS variables
  │
  ├── js/
  │   ├── theme.js                 Theme management and initialization
  │   ├── data.js                  All product data and globals
  │   ├── auth.js                  AuthManager class for user authentication
  │   ├── cart.js                  CartManager class for shopping cart
  │   ├── quiz.js                  ScentQuiz class for scent recommendations
  │   └── app.js                   Homepage-specific logic
  │
  ├── pages/                        Sub-pages directory
  │   ├── shop.html                Product listing and filtering
  │   ├── shop.js                  Shop page filtering logic
  │   ├── product-detail.html      Individual product detail page
  │   ├── product-detail.js        Product detail page logic
  │   ├── checkout.html            Shopping cart checkout
  │   ├── place-order.html         Order placement
  │   ├── dashboard.html           User order history
  │   ├── track-order.html         Order tracking
  │   ├── contact.html             Contact form
  │   ├── about.html               About the company
  │   ├── faq.html                 Frequently asked questions
  │   ├── policies.html            Terms and privacy policies
  │   └── [perfume-name].html      Individual perfume product pages
  │
  ├── perfume images/              Product images (note: directory has space)
  ├── images/                      General site images
  └── [API files]
      ├── contact-handler.php      Contact form backend
      └── review-handler.php       Review submission backend

ARCHITECTURE & TECHNICAL DETAILS
================================================================================

GLOBAL STATE MANAGERS

The application uses a global state pattern (no module system):

  authManager     - Instance of AuthManager (js/auth.js)
                   Session storage: localStorage keys 'alqamar_token' & 'alqamar_user'
  
  cartManager     - Instance of CartManager (js/cart.js)
                   Cart storage: localStorage key 'alqamar_cart'
  
  scentQuiz       - Instance of ScentQuiz (js/quiz.js)
  
  themeManager    - Instance of ThemeManager (js/theme.js)
                   Preference storage: localStorage key 'alqamar_theme'

SCRIPT LOADING ORDER

Each page loads scripts in this specific order (critical for dependencies):

  1. theme.js           (in <head> to prevent theme flash)
  2. data.js            (defines all globals: products, reviews, etc.)
  3. auth.js            (depends on data.js)
  4. cart.js            (depends on data.js and auth.js)
  5. Page-specific JS   (depends on all above)

THEME SYSTEM

  - Dark theme only (light theme has been removed)
  - Colors: Golden, Aqua, Black, White
  - CSS variables defined in css/theme.css
  - Tailwind CSS CDN build with custom theme configuration
  - Google Fonts: Crimson Text, Poppins, Amiri (Arabic)

PRODUCT DATA

  - Hardcoded in js/data.js as 'products' array
  - Each product includes: id, name, category, gender, price, image,
    description, scentPyramid, sizes, rating, reviews, originalPrice
  - Product images: Unsplash URLs or relative paths (perfume images/ directory)

AUTHENTICATION & ORDERS

  - Entirely client-side (frontend-only, no backend database)
  - User accounts stored in localStorage under 'alqamar_users'
  - Passwords encoded with: btoa(password + 'alqamar_salt')
    ⚠ NOTE: NOT cryptographically secure - placeholder for demo only
  - Demo account: demo@alqamar.com / demo123
  - Orders saved to localStorage on user object after checkout

CDN DEPENDENCIES
================================================================================

All dependencies loaded from CDN (no package.json or node_modules):

  - Tailwind CSS                 https://cdn.tailwindcss.com
  - GSAP 3.12.2                 https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
  - ScrollTrigger (GSAP)         https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js
  - Google Fonts API             Crimson Text, Poppins, Amiri

DEPLOYMENT
================================================================================

Static file hosting on Netlify or Vercel:

  - Build command: None (static files only)
  - Publish directory: / (project root)
  - Required configuration:
    * Stripe public key (Stripe payment integration)
    * PayPal client ID (PayPal payment integration)
    * Placeholder values in js/data.js must be replaced with real keys

See DEPLOYMENT_GUIDE.md for detailed setup instructions.

PAGES & URLS
================================================================================

Homepage
  /                                  Main landing page (index.html)

Shopping & Checkout
  /pages/shop.html                   Product catalog with filters
  /pages/product-detail.html?id=X    Individual product detail
  /pages/checkout.html               Shopping cart review
  /pages/place-order.html            Order confirmation

User Account
  /pages/dashboard.html              User order history
  /pages/track-order.html            Track existing orders

Information Pages
  /pages/about.html                  About Al Qamar Perfumes
  /pages/faq.html                    Frequently asked questions
  /pages/policies.html               Terms and privacy policies
  /pages/contact.html                Contact/inquiry form

Individual Perfumes (examples)
  /pages/gilaf.html
  /pages/dubai.html
  /pages/royal-black.html
  [Additional perfume pages...]

IMPORTANT NOTES
================================================================================

NAMING CONVENTIONS
  - Currency display: Use "Rs." (Rupees) - prices in data.js are in PKR/INR
  - Page assets: Use relative paths (e.g., ../js/, ../css/) from pages/

CURRENCY INCONSISTENCY
  - Some files display prices with $ symbol
  - Actual prices are in Pakistani/Indian Rupees
  - Update to "Rs." prefix for consistency

PERFUME IMAGES DIRECTORY
  - Directory name contains a space: "perfume images/"
  - Paths must include the space or URL-encode as "perfume%20images/"
  - Example: ../perfume images/gilaf.jpg (from pages/)

PAYMENT KEYS
  - Stripe test key: pk_test_51EXAMPLE... (placeholder - MUST REPLACE)
  - PayPal client ID: AZEXAMPLE... (placeholder - MUST REPLACE)
  - Located at: bottom of js/data.js
  - Replace before deploying to production

ADDING NEW PAGES
================================================================================

When creating a new HTML page under pages/:

1. Copy boilerplate from existing page (shop.html recommended)
2. Link both CSS files:
   - <link rel="stylesheet" href="../css/styles.css">
   - <link rel="stylesheet" href="../css/theme.css">
3. Load theme.js in <head> (BEFORE other scripts):
   - <script src="../js/theme.js"></script>
4. Include inline Tailwind config with all theme-* CSS variables
5. Load scripts at end of <body> in order:
   - <script src="../js/data.js"></script>
   - <script src="../js/auth.js"></script>
   - <script src="../js/cart.js"></script>
   - <script src="page-specific.js"></script>
6. Ensure <header> contains id="cart-btn" for toggle button insertion

TECHNOLOGIES USED
================================================================================

Frontend
  - HTML5
  - CSS3 with custom properties (CSS variables)
  - Vanilla JavaScript (no frameworks)
  - Tailwind CSS (utility-first styling)
  - GSAP (animation library)

Styling & Fonts
  - Google Fonts (Crimson Text, Poppins, Amiri)
  - Dark theme with golden accents

Backend (Optional)
  - PHP (for contact form and review submissions)
  - localStorage (client-side data persistence)

Payment Integration
  - Stripe (with test keys)
  - PayPal (with test credentials)

BROWSER SUPPORT
================================================================================

  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (latest)
  - IE11: Not supported

LOCAL DEVELOPMENT
================================================================================

PREREQUISITES
  - Python 3.x OR Node.js with npx
  - Modern web browser
  - Text editor (VS Code recommended)

COMMON TASKS

Running the server
  python -m http.server 8080
  OR
  npx serve .

Testing on mobile
  - Find your machine's IP address (ipconfig on Windows)
  - Use http://[YOUR_IP]:8080 from mobile device
  - Must be served via HTTP (not file://)

Debugging
  - Open browser DevTools (F12)
  - Check Console for errors
  - Inspect localStorage for auth/cart data
  - Check Network tab for CDN dependency loads

TROUBLESHOOTING
================================================================================

Sub-pages not loading correctly
  - Ensure you're serving from project root (not opening pages/ files directly)
  - Check relative paths (../js/, ../css/)
  - Verify all scripts load in correct order

Theme flash on page load
  - theme.js must be in <head> (before other scripts)
  - Prevents white flash before dark theme applies

Cart data not persisting
  - Verify localStorage is enabled in browser
  - Check browser console for localStorage errors
  - Clear browser cache and try again

Scent quiz not working
  - Ensure quiz.js is loaded
  - Check that scentQuiz global is instantiated
  - Verify products array is populated from data.js

Authentication issues
  - Try demo account: demo@alqamar.com / demo123
  - Check localStorage for alqamar_token and alqamar_user keys
  - Verify password encoding: btoa(password + 'alqamar_salt')

CONTRIBUTING & CUSTOMIZATION
================================================================================

Product Data
  - Edit js/data.js to add/remove/modify products
  - Add new properties to product objects as needed
  - Update product images in perfume images/ directory

Styling
  - Core styles: css/styles.css
  - Theme variables: css/theme.css
  - Modify Tailwind config in each page's <head>

Functionality
  - Page-specific logic in pages/page-name.js
  - Global managers: auth.js, cart.js, quiz.js
  - Data definitions: data.js

PERFORMANCE NOTES
================================================================================

  - All assets loaded from CDN (fast delivery via global networks)
  - Static site (no database queries, instant load times)
  - CSS variables for efficient theme switching
  - GSAP animations are GPU-accelerated
  - localStorage for instant cart/auth persistence

SECURITY NOTES
================================================================================

  ⚠ This is a FRONTEND-ONLY demo application:
  - No backend authentication (not suitable for real transactions)
  - Passwords stored in plain text (just base64 encoded)
  - Payment processing happens client-side (test keys only)
  - Do NOT use in production without proper backend

FUTURE ENHANCEMENTS
================================================================================

Potential improvements:
  - Backend authentication with secure hashing
  - Database integration for persistent data
  - Real payment processing integration
  - Email notifications for orders
  - Admin panel for inventory management
  - User account system with profiles
  - Advanced analytics and reporting

SUPPORT & CONTACT
================================================================================

For issues, questions, or contributions:
  - Check AGENTS.md for technical guidelines
  - Review DEPLOYMENT_GUIDE.md for deployment help
  - See TODO.md for known issues and tasks

LICENSE
================================================================================

This project is provided as-is for demonstration and educational purposes.
Modify as needed for your specific requirements.

================================================================================
                    Last Updated: May 2026
                    Version: 1.0
================================================================================
