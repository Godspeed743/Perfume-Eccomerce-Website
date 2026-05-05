# Al Qamar Perfumes - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Al Qamar Perfumes e-commerce website to production using Netlify or Vercel.

## Prerequisites
- GitHub account
- Netlify or Vercel account
- Stripe account (for payments)
- PayPal Business account (for payments)

## Project Structure
```
alqamar-perfumes/
├── index.html                 # Home page
├── css/
│   └── styles.css            # Custom styles
├── js/
│   ├── data.js              # Product data and configuration
│   ├── app.js               # Main application logic
│   ├── auth.js              # Authentication system
│   ├── cart.js              # Shopping cart functionality
│   └── quiz.js              # Scent quiz functionality
├── pages/
│   ├── shop.html            # Shop page
│   ├── shop.js              # Shop page logic
│   ├── about.html           # About page
│   ├── product-detail.html  # Product detail page
│   ├── product-detail.js    # Product detail logic
│   ├── contact.html         # Contact page
│   ├── track-order.html     # Order tracking page
│   ├── faq.html             # FAQ page
│   ├── dashboard.html       # User dashboard
│   └── checkout.html        # Checkout page
├── images/                   # Product images (add your images here)
├── assets/                   # Additional assets (videos, icons)
└── DEPLOYMENT_GUIDE.md      # This file
```

## Step 1: Prepare Your Repository

1. **Create a GitHub Repository**
   - Go to GitHub and create a new repository
   - Name it `alqamar-perfumes` or your preferred name
   - Make it public or private (private recommended for production)

2. **Upload Your Code**
   - Clone the repository locally
   - Copy all files from your project folder to the repository
   - Add, commit, and push your files:
   ```bash
   git add .
   git commit -m "Initial commit - Al Qamar Perfumes website"
   git push origin main
   ```

## Step 2: Set Up Payment Processing

### Stripe Setup
1. **Create Stripe Account**
   - Go to [Stripe.com](https://stripe.com) and create an account
   - Complete the business verification process

2. **Get API Keys**
   - In your Stripe dashboard, go to "Developers" > "API keys"
   - Copy your "Publishable key" (starts with `pk_test_` for test mode)
   - Copy your "Secret key" (starts with `sk_test_` for test mode)

3. **Update Code**
   - Open `js/data.js`
   - Replace `'pk_test_51EXAMPLE...'` with your actual Stripe publishable key
   - For production, use live keys (start with `pk_live_` and `sk_live_`)

### PayPal Setup
1. **Create PayPal Business Account**
   - Go to [PayPal.com](https://paypal.com) and create a business account
   - Complete the verification process

2. **Get Client ID**
   - In your PayPal dashboard, go to "Developer" > "My Apps & Credentials"
   - Create a new app or use existing one
   - Copy the "Client ID"

3. **Update Code**
   - Open `js/data.js`
   - Replace `'AZEXAMPLE...'` with your actual PayPal client ID

## Step 3: Choose Your Deployment Platform

### Option A: Deploy to Netlify (Recommended)

1. **Connect Repository**
   - Go to [Netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your `alqamar-perfumes` repository

2. **Configure Build Settings**
   - Branch to deploy: `main`
   - Build command: (leave empty - static site)
   - Publish directory: `/` (root directory)

3. **Environment Variables** (Optional)
   - For production, you can add environment variables in Netlify dashboard
   - However, for this demo, API keys are hardcoded in the code

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Your site will be available at `https://[your-site-name].netlify.app`

### Option B: Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: `Other`
   - Root Directory: `./` (leave default)
   - Build Command: (leave empty)
   - Output Directory: `./` (leave default)

3. **Environment Variables** (Optional)
   - Add any environment variables if needed

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be available at `https://[your-site-name].vercel.app`

## Step 4: Configure Custom Domain (Optional)

### Netlify Custom Domain
1. Go to your site settings in Netlify dashboard
2. Click "Domain management"
3. Add your custom domain
4. Follow DNS configuration instructions

### Vercel Custom Domain
1. Go to your project settings in Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 5: Post-Deployment Configuration

### Update Image URLs
- Replace placeholder image URLs in `js/data.js` with actual product images
- Upload images to a CDN (Imgur, Cloudinary) or host them in your repository
- For better performance, consider using a CDN like Cloudflare

### Update Video Background
- Replace the placeholder video URL in `index.html` with your actual desert/moon video
- Host the video on a video platform (Vimeo, YouTube) or CDN

### SEO Optimization
- Update meta descriptions in each HTML file
- Add structured data for products
- Submit your sitemap to Google Search Console

### Analytics (Optional)
- Add Google Analytics or similar tracking code
- Insert the tracking script in the `<head>` section of `index.html`

## Step 6: Testing Your Deployment

1. **Basic Functionality**
   - Visit your deployed site
   - Test navigation between pages
   - Check responsive design on mobile devices

2. **E-commerce Features**
   - Add products to cart
   - Test user registration and login
   - Verify checkout process (use test payment methods)
   - Test order tracking

3. **Performance**
   - Check page load times
   - Test on different browsers and devices
   - Verify images load correctly

## Step 7: Going Live

1. **Switch to Production Mode**
   - Update Stripe and PayPal keys to live/production keys
   - Remove any test indicators from the UI
   - Update contact information and business details

2. **Final Checks**
   - Test all payment flows with real (small) transactions
   - Verify all links and forms work correctly
   - Check for any console errors

3. **Launch**
   - Announce your site launch
   - Monitor for any issues
   - Set up customer support channels

## Troubleshooting

### Common Issues

1. **404 Errors on Subpages**
   - Ensure all HTML files are in the correct directories
   - Check that internal links use correct relative paths

2. **Payment Processing Issues**
   - Verify API keys are correct and active
   - Check that you're using test keys for testing, live keys for production

3. **Images Not Loading**
   - Ensure image URLs are accessible
   - Check for CORS issues with external image hosts

4. **JavaScript Errors**
   - Check browser console for errors
   - Verify all script files are loading correctly

### Support
- Netlify Documentation: https://docs.netlify.com/
- Vercel Documentation: https://vercel.com/docs
- Stripe Documentation: https://stripe.com/docs
- PayPal Documentation: https://developer.paypal.com/

## Demo Accounts

For testing purposes, use these demo accounts:
- **Email:** demo@alqamar.com
- **Password:** demo123

## Security Notes

- Never commit real API keys to version control
- Use environment variables for sensitive data in production
- Regularly update dependencies and monitor for security vulnerabilities
- Implement proper HTTPS and SSL certificates

---

**Congratulations!** Your Al Qamar Perfumes website is now live. May your lunar fragrances bring joy to customers around the world! 🌙✨
