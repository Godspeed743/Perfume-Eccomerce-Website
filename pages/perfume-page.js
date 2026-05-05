// Renders a single perfume detail page from js/data.js (products + reviews).
// Usage: open perfume-page-template.html?id=<productId>
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);

  if (!productId || Number.isNaN(productId)) {
    document.body.innerHTML = '<p class="text-center text-[#c0c0c0] py-16">Product not found.</p>';
    return;
  }

  const product = (typeof products !== 'undefined')
    ? products.find(p => p.id === productId)
    : null;

  if (!product) {
    document.body.innerHTML = '<p class="text-center text-[#c0c0c0] py-16">Product not found.</p>';
    return;
  }

  document.title = `${product.name} - Al Qamar Perfumes`;

  renderHero(product);
  renderReviews(product);
  renderRelated(product);
  initReviewForm(product);
  fetchGlobalReviews(product);
});

function renderHero(product) {
  const img = document.getElementById('pp-hero-image');
  const nameEl = document.getElementById('pp-hero-name');
  const priceEl = document.getElementById('pp-hero-price');
  const catEl = document.getElementById('pp-hero-category');
  const topEl = document.getElementById('pp-notes-top');
  const midEl = document.getElementById('pp-notes-middle');
  const baseEl = document.getElementById('pp-notes-base');
  const descEl = document.getElementById('pp-description');
  const addBtn = document.getElementById('pp-add-to-cart');
  const buyNow = document.getElementById('pp-buy-now');

  if (!img || !nameEl || !priceEl || !catEl) return;

  img.src = product.image;
  img.alt = product.name;

  nameEl.textContent = product.name;
  priceEl.textContent = `Rs. ${product.price}`;
  catEl.textContent = product.category || '';

  const top = (product.scentPyramid && product.scentPyramid.top) ? product.scentPyramid.top : [];
  const mid = (product.scentPyramid && product.scentPyramid.heart) ? product.scentPyramid.heart : [];
  const base = (product.scentPyramid && product.scentPyramid.base) ? product.scentPyramid.base : [];

  if (topEl) topEl.textContent = top.join(', ') || '-';
  if (midEl) midEl.textContent = mid.join(', ') || '-';
  if (baseEl) baseEl.textContent = base.join(', ') || '-';

  // Description block: always show product description (if present) and all notes.
  if (descEl) {
    const topText = top.join(', ') || '-';
    const midText = mid.join(', ') || '-';
    const baseText = base.join(', ') || '-';
    const notesText = `Top: ${topText}\nMiddle: ${midText}\nBase: ${baseText}`;
    const productDesc = String(product.description || '').trim();
    descEl.textContent = productDesc ? `${productDesc}\n\n${notesText}` : notesText;
  }

  initPurchaseControls(product);

  if (buyNow) {
    buyNow.removeAttribute('href');
    buyNow.onclick = (e) => {
      e.preventDefault();
      const selectedSize = sizeSelector ? sizeSelector.value : (product.sizes?.[0] || '60ml');
      if (typeof window.cartManager !== 'undefined' && window.cartManager) {
          const existingItem = window.cartManager.cart.find(item => item.id === product.id && item.size === selectedSize);
          if (existingItem) {
              window.cartManager.updateQuantity(product.id, selectedSize, existingItem.quantity + qty);
          } else {
              window.cartManager.addToCart(product.id, selectedSize);
              if (qty > 1) {
                   window.cartManager.updateQuantity(product.id, selectedSize, qty);
              }
          }
      } else if (typeof window.addToCart === 'function') {
          for (let i = 0; i < qty; i++) {
              window.addToCart(product.id, selectedSize);
          }
      }
      setTimeout(() => {
          window.location.href = 'place-order.html';
      }, 50);
    };
  }
}

function initPurchaseControls(product) {
  const sizeSelector = document.getElementById('pp-size-selector');
  const qtyMinus = document.getElementById('pp-qty-minus');
  const qtyPlus = document.getElementById('pp-qty-plus');
  const qtyValue = document.getElementById('pp-qty-value');
  const addBtn = document.getElementById('pp-add-to-cart');
  const wishlistBtn = document.getElementById('pp-wishlist-btn');
  const wishlistIcon = document.getElementById('pp-wishlist-icon');
  
  if (sizeSelector) {
    const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : ['60ml'];
    sizeSelector.innerHTML = sizes.map(size => `<option value="${size}">${size.toUpperCase()}</option>`).join('');
  }

  let qty = 1;

  if (qtyMinus && qtyPlus && qtyValue) {
    qtyValue.textContent = qty;
    qtyMinus.onclick = () => {
      if (qty > 1) {
        qty--;
        qtyValue.textContent = qty;
      }
    };
    qtyPlus.onclick = () => {
      qty++;
      qtyValue.textContent = qty;
    };
  }

  if (addBtn) {
    addBtn.removeAttribute('onclick');
    addBtn.onclick = () => {
      const selectedSize = sizeSelector ? sizeSelector.value : (product.sizes?.[0] || '60ml');
      if (typeof window.cartManager !== 'undefined' && window.cartManager) {
          const existingItem = window.cartManager.cart.find(item => item.id === product.id && item.size === selectedSize);
          if (existingItem) {
              window.cartManager.updateQuantity(product.id, selectedSize, existingItem.quantity + qty);
              window.cartManager.showNotification(`${product.name} quantity updated!`);
          } else {
              window.cartManager.addToCart(product.id, selectedSize);
              if (qty > 1) {
                   window.cartManager.updateQuantity(product.id, selectedSize, qty);
              }
          }
      } else if (typeof window.addToCart === 'function') {
          for (let i = 0; i < qty; i++) {
              window.addToCart(product.id, selectedSize);
          }
      }
    };
  }
  
  if (wishlistBtn && wishlistIcon) {
    let isWishlisted = false;
    wishlistBtn.onclick = () => {
      isWishlisted = !isWishlisted;
      if (isWishlisted) {
        wishlistIcon.setAttribute('fill', 'currentColor');
      } else {
        wishlistIcon.setAttribute('fill', 'none');
      }
    };
  }
}
function renderReviews(product) {
  const container = document.getElementById('pp-reviews');
  if (!container) return;

  const pool = (typeof reviews !== 'undefined' && Array.isArray(reviews)) ? reviews : [];
  const productReviews = pool
    .filter(r => r.productId === product.id)
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  // Update average rating display (all reviews, not just the 3 shown).
  const avgEl = document.getElementById('pp-average-rating');
  if (avgEl) {
    if (!productReviews.length) avgEl.textContent = '0.0★';
    else {
      const avg = productReviews.reduce((sum, r) => sum + (parseInt(r.rating, 10) || 0), 0) / productReviews.length;
      avgEl.textContent = `${avg.toFixed(1)}★`;
    }
  }

  // Only render reviews strictly from the stored ones, no fallbacks.
  const selected = productReviews.slice(0, 3);
  
  if (selected.length === 0) {
      container.innerHTML = `<p class="text-[#c0c0c0] col-span-full">No reviews yet. Be the first to review this product!</p>`;
      return;
  }

  container.innerHTML = selected.map(r => {
    const starsHtml = renderStars(r.rating);
    const avatar = avatarDataUri(r.user || 'U');
    return `
      <div class="bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded-2xl p-6 backdrop-blur-sm">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-4">
            <img src="${avatar}" alt="${escapeHtml(r.user || 'Customer')}"
              class="w-12 h-12 rounded-full border border-[#ffd700]/20 object-cover">
            <div>
              <h4 class="text-[#ffd700] font-semibold">${escapeHtml(r.user || 'Customer')}</h4>
              <div class="flex items-center gap-2">
                <div class="text-yellow-400">${starsHtml}</div>
                <span class="text-xs text-[#c0c0c0]">${escapeHtml(r.date || '')}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-[#c0c0c0] leading-relaxed">${escapeHtml(r.comment || '')}</p>
      </div>
    `;
  }).join('');
}

function initReviewForm(product) {
  const form = document.getElementById('pp-review-form');
  if (!form) return;

  const nameInput = document.getElementById('pp-review-name');
  const emailInput = document.getElementById('pp-review-email');
  const reviewInput = document.getElementById('pp-review-text');
  const ratingInput = document.getElementById('pp-review-rating');
  const errorEl = document.getElementById('pp-review-error');
  const successEl = document.getElementById('pp-review-success');
  const starButtons = Array.from(document.querySelectorAll('#pp-star-rating .pp-star'));

  const setHiddenRating = (value) => {
    if (!ratingInput) return;
    ratingInput.value = String(value || '');
  };

  const paintStars = (value) => {
    starButtons.forEach(btn => {
      const v = parseInt(btn.getAttribute('data-value'), 10);
      const active = v <= value;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  // Star clicks: fill left → right.
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = parseInt(btn.getAttribute('data-value'), 10);
      setHiddenRating(v);
      paintStars(v);
    });
  });

  // Initialize state.
  const currentRating = parseInt(ratingInput?.value, 10) || 0;
  if (currentRating) paintStars(currentRating);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.classList.add('hidden');
    if (successEl) successEl.classList.add('hidden');

    const name = String(nameInput?.value || '').trim();
    const email = String(emailInput?.value || '').trim();
    const review = String(reviewInput?.value || '').trim();
    const rating = parseInt(ratingInput?.value, 10);

    const wordCount = review ? review.split(/\s+/).filter(Boolean).length : 0;

    // Validation rules
    const nameOk = name.length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const ratingOk = Number.isInteger(rating) && rating >= 1 && rating <= 5;
    const reviewOk = wordCount >= 1 && wordCount <= 50;

    if (!nameOk) {
      if (errorEl) errorEl.textContent = 'Name must be at least 2 characters.';
      errorEl?.classList.remove('hidden');
      return;
    }
    if (!emailOk) {
      if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      errorEl?.classList.remove('hidden');
      return;
    }
    if (!ratingOk) {
      if (errorEl) errorEl.textContent = 'Please select a star rating (1 to 5).';
      errorEl?.classList.remove('hidden');
      return;
    }
    if (!reviewOk) {
      if (errorEl) errorEl.textContent = 'Review must be 50 words or fewer.';
      errorEl?.classList.remove('hidden');
      return;
    }

    const payload = {
      product: product.name,
      name,
      rating,
      email,
      review,
      date: new Date().toISOString().slice(0, 10),
      wordCount
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      // 1) POST to Google Sheets (Apps Script Web App).
      //    Replace this placeholder with your real Web App URL.
      const REVIEW_SHEET_WEBAPP_URL = window.REVIEW_SHEET_WEBAPP_URL || 'PASTE_YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
      if (!REVIEW_SHEET_WEBAPP_URL || REVIEW_SHEET_WEBAPP_URL.includes('PASTE_YOUR_')) {
        throw new Error('Missing Google Sheets Web App URL. Set window.REVIEW_SHEET_WEBAPP_URL to your Apps Script endpoint.');
      }

      const resp = await fetch(REVIEW_SHEET_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`Google Sheet submit failed (HTTP ${resp.status}).`);
      }

      // 2) Update UI immediately (local copy).
      const newReview = {
        id: Date.now(),
        productId: product.id,
        user: payload.name,
        rating: payload.rating,
        comment: payload.review,
        date: payload.date
      };

      if (typeof reviews !== 'undefined' && Array.isArray(reviews)) {
        reviews.push(newReview);
        // Persist to localStorage
        localStorage.setItem('alqamar_reviews', JSON.stringify(reviews));
      }

      // Clear form & rerender
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (reviewInput) reviewInput.value = '';
      setHiddenRating('');
      paintStars(0);

      renderReviews(product);

      if (successEl) {
        successEl.textContent = 'Thanks! Your review has been submitted.';
        successEl.classList.remove('hidden');
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = String(err?.message || err || 'Submission failed.');
        errorEl.classList.remove('hidden');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
      }
    }
  });
}

function renderStars(rating) {
  const r = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
  // Full stars + empty stars (always 5).
  return `${'★'.repeat(r)}${'☆'.repeat(5 - r)}`;
}

function avatarDataUri(name) {
  const initial = String(name || '?').trim().charAt(0).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f6c343" stop-opacity="1"/>
          <stop offset="1" stop-color="#ffd700" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="64" fill="url(#g)"/>
      <circle cx="64" cy="64" r="56" fill="rgba(15,15,35,0.15)"/>
      <text x="64" y="74" text-anchor="middle" font-family="Poppins, sans-serif" font-size="52" font-weight="800" fill="#0f0f23">${initial}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderRelated(product) {
  const grid = document.getElementById('pp-related-grid');
  if (!grid) return;

  if (typeof products === 'undefined' || !Array.isArray(products)) {
    grid.innerHTML = '';
    return;
  }

  const candidates = products
    .filter(p => p.id !== product.id)
    .slice();

  // "Frequently Bought Together" heuristic:
  // 1) Same category
  // 2) Bestseller
  // 3) Highest rating
  const sameCategory = candidates.filter(p => p.category === product.category);
  const best = candidates.filter(p => p.bestseller);

  const picked = [];
  const pushUnique = (arr) => {
    for (const p of arr) {
      if (picked.length >= 3) break;
      if (picked.some(x => x.id === p.id)) continue;
      picked.push(p);
    }
  };

  pushUnique(sameCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
  pushUnique(best.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
  pushUnique(candidates.sort((a, b) => (b.rating || 0) - (a.rating || 0)));

  grid.innerHTML = picked.slice(0, 3).map(p => {
    const slug = productSlug(p.name);
    const top = (p.scentPyramid && p.scentPyramid.top) ? p.scentPyramid.top.join(', ') : '';
    const mid = (p.scentPyramid && p.scentPyramid.heart) ? p.scentPyramid.heart.join(', ') : '';
    const base = (p.scentPyramid && p.scentPyramid.base) ? p.scentPyramid.base.join(', ') : '';

    return `
      <div class="product-card bg-theme-bg-card border border-theme-border rounded-lg p-6 hover:border-theme-turquoise transition-all duration-300">
        <div class="relative mb-4">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" class="product-image w-full h-48 object-cover rounded-lg bottle-glow">
          <div class="absolute top-2 right-2 bg-theme-gold text-theme-bg-primary px-2 py-1 rounded-full text-xs font-semibold">
            ${p.rating}⭐
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 mb-2">
          <h3 class="text-xl font-bold text-theme-text flex-1 pr-2">${escapeHtml(p.name)}</h3>
        </div>

        <p class="text-theme-text-secondary text-sm mb-4">${escapeHtml((p.description || '').substring(0, 90))}...</p>

        <div class="scent-notes mb-4">
          <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
            <span class="scent-note relative cursor-pointer">Top: ${escapeHtml(top || '-')}
              <div class="scent-popup">Top notes: ${escapeHtml(top || '-')}</div>
            </span>
          </div>
          <div class="flex justify-between text-xs text-theme-text-secondary mb-2">
            <span class="scent-note relative cursor-pointer">Heart: ${escapeHtml(mid || '-')}
              <div class="scent-popup">Heart notes: ${escapeHtml(mid || '-')}</div>
            </span>
          </div>
          <div class="flex justify-between text-xs text-theme-text-secondary">
            <span class="scent-note relative cursor-pointer">Base: ${escapeHtml(base || '-')}
              <div class="scent-popup">Base notes: ${escapeHtml(base || '-')}</div>
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-bold text-theme-turquoise">Rs. ${p.price}</span>
          <span class="text-sm text-theme-text-secondary">${escapeHtml(p.category || '')}</span>
        </div>

        <button onclick="addToCart(${p.id})" class="add-to-cart-btn">
          Add to Cart
        </button>

        <a href="${slug}.html" class="block text-center mt-3 text-[#40e0d0] hover:text-[#ffd700] font-semibold">
          View Details
        </a>
      </div>
    `;
  }).join('');
}

function productSlug(name) {
  // Slug scheme must match the generated pages: royal-black.html, summer-soul.html, madina.html, etc.
  const raw = String(name || '').trim();

  // Keep non-numeric parentheses (e.g., "Scentox (Inspired Version)" keeps "Inspired Version").
  // Drop numeric parentheses (e.g., "Royal Black (65ml)").
  const normalized = raw.replace(/\(([^)]*)\)/g, (m, inner) => {
    const innerStr = String(inner || '').trim();
    return /\d/.test(innerStr) ? '' : ` ${innerStr} `;
  });

  const s = normalized
    .replace(/&/g, 'and')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric -> hyphen
    .replace(/-+/g, '-') // collapse
    .replace(/^-|-$/g, ''); // trim

  return s || raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function fetchGlobalReviews(product) {
  const REVIEW_SHEET_WEBAPP_URL = window.REVIEW_SHEET_WEBAPP_URL;
  if (!REVIEW_SHEET_WEBAPP_URL || REVIEW_SHEET_WEBAPP_URL.includes('PASTE_YOUR_')) {
    return; // Cannot fetch, Web App URL is not configured
  }

  try {
    const response = await fetch(REVIEW_SHEET_WEBAPP_URL);
    if (!response.ok) throw new Error('Fetch failed');
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      const globalReviews = [];
      data.forEach((r, index) => {
        // Match the product ID from the product name in sheet
        const matchedProduct = (typeof products !== 'undefined') ? products.find(p => String(p.name).toLowerCase() === String(r.product || '').toLowerCase()) : null;
        
        if (matchedProduct) {
          globalReviews.push({
            id: 'global_' + index,
            productId: matchedProduct.id,
            user: String(r.name || 'Anonymous'),
            rating: parseInt(r.rating, 10) || 5,
            comment: String(r.review || ''),
            date: String(r.date || '').split('T')[0] || new Date().toISOString().split('T')[0]
          });
        }
      });
      
      if (globalReviews.length > 0 && typeof reviews !== 'undefined') {
        // Overwrite local reviews with the global source of truth
        reviews.splice(0, reviews.length, ...globalReviews);
        try {
          localStorage.setItem('alqamar_reviews', JSON.stringify(reviews));
        } catch (e) {
          console.warn('localStorage saving failed.', e);
        }

        // Re-render the reviews UI for the current product
        renderReviews(product);
      }
    }
  } catch (err) {
    console.error('Error fetching global reviews from Google Sheets:', err);
  }
}

