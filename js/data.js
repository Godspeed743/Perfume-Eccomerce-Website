// Product data updated to match provided product list images
const products = [
  {
    id: 1,
    name: "valaya",
    category: "Musk",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/valaya.jpg",
    description: "Notes Musk Citrus white floral Powdery Fruity Amber",
    scentPyramid: { top: ["Musk"], heart: ["White floral"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.5,
    reviews: 32,
    bestseller: true
  },
  {
    id: 2,
    name: "Aqua beast",
    category: "Citrus",
    gender: "Unisex",
    price: 1000,
    originalPrice: 1200,
    image: "../perfume images/aqua beast.jpg",
    description: "Notes Citrus, Aromatic, fresh spicy, Marin, woody, Musky, powdery, Amber",
    scentPyramid: { top: ["Citrus"], heart: ["Aromatic"], base: ["Woody"] },
    sizes: ["65ml"],
    rating: 4.3,
    reviews: 21,
    bestseller: true
  },
  {
    id: 3,
    name: "Gift Set",
    category: "Gift Set",
    gender: "Unisex",
    price: 1000,
    originalPrice: 1200,
    image: "../perfume images/gift set.jpg",
    description: "Combination of channel allur homme sport and baccar",
    scentPyramid: { top: ["Citrus"], heart: ["Amber"], base: ["Musk"] },
    sizes: ["65ml"],
    rating: 4.4,
    reviews: 45,
    bestseller: true
  },
  {
    id: 4,
    name: "King of Barbershop",
    category: "Woody",
    gender: "Men's",
    price: 1000,
    image: "../perfume images/king of barbershop.jpg",
    description: "Notes - Woody Aromatic Lavender Citrus Powdery Fresh Spicy Amber Musky",
    scentPyramid: { top: ["Lavender"], heart: ["Woody"], base: ["Citrus"] },
    sizes: ["65ml"],
    rating: 4.6,
    reviews: 58,
    bestseller: true
  },
  {
    id: 5,
    name: "Salalah",
    category: "Leather",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/salalah.jpg",
    description: "Notes Leather Sweet Fruity Amber Woody Rose Spicy Musky",
    scentPyramid: { top: ["Leather"], heart: ["Rose"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.2,
    reviews: 19
  },
  {
    id: 6,
    name: "Summer soul",
    category: "Fruity",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/summer soul.jpg",
    description: "Notes Fruity, Fresh, Aquatic, Warm spicy, Amber, sweet, Aromatic, Animalic",
    scentPyramid: { top: ["Fruity"], heart: ["Aquatic"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.1,
    reviews: 24
  },
  {
    id: 7,
    name: "GILAF",
    category: "Oud",
    gender: "Unisex",
    price: 1500,
    image: "../perfume images/gilaf.jpg",
    description: "Notes Oud Black musk Amber Warm spicy Woody",
    scentPyramid: { top: ["Oud"], heart: ["Black musk"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.8,
    reviews: 72,
    bestseller: true
  },
  {
    id: 8,
    name: "Royal Black (65ml)",
    category: "Musk",
    gender: "Unisex",
    price: 1000,
    originalPrice: 1200,
    image: "../perfume images/royal black.jpg",
    description: "Mint, patouchli, fresh, amber, musky",
    scentPyramid: { top: ["Mint"], heart: ["Patchouli"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.4,
    reviews: 60,
    bestseller: true
  },
  {
    id: 9,
    name: "Valley of Aroma",
    category: "Aromatic",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/valley of aroma.jpg",
    description: "Inspired by Gissa Imperial valley",
    scentPyramid: { top: ["Aromatic"], heart: ["Floral"], base: ["Musk"] },
    sizes: ["65ml"],
    rating: 4.0,
    reviews: 12
  },
  {
    id: 10,
    name: "Golden Musk",
    category: "Musk",
    gender: "Unisex",
    price: 500,
    originalPrice: 700,
    image: "../perfume images/golden musk.jpg",
    description: "musk",
    scentPyramid: { top: ["Musk"], heart: [], base: [] },
    sizes: ["65ml"],
    rating: 3.9,
    reviews: 8
  },
  {
    id: 11,
    name: "High Heels",
    category: "Floral",
    gender: "Women's",
    price: 1000,
    image: "../perfume images/high heels.jpg",
    description: "Notes Fresh Fruity Floral Musky Sweet Powdery Amber",
    scentPyramid: { top: ["Fresh"], heart: ["Floral"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.3,
    reviews: 30,
    bestseller: true
  },
  {
    id: 12,
    name: "Rome",
    category: "Citrus",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/rome.jpg",
    description: "Notes Fresh spicy Citrus Woody Vanilla Iris Aromatic Powdery",
    scentPyramid: { top: ["Citrus"], heart: ["Iris"], base: ["Vanilla"] },
    sizes: ["65ml"],
    rating: 4.4,
    reviews: 29
  },
  {
    id: 13,
    name: "Oud Rose",
    category: "Oud",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/oud rose.jpg",
    description: "Notes Oud Rose Amber Warm spicy Sweet Animalic",
    scentPyramid: { top: ["Oud"], heart: ["Rose"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.6,
    reviews: 38
  },
  {
    id: 14,
    name: "Discovery set pack of 5 & 5ml each",
    category: "Gift Set",
    gender: "Unisex",
    price: 800,
    image: "../perfume images/dicovery set.jpg",
    description: "Products Royal black Imperial Rome Velvet musk Secr",
    scentPyramid: { top: [], heart: [], base: [] },
    sizes: ["5ml"],
    rating: 4.2,
    reviews: 16
  },
  {
    id: 15,
    name: "Khus Pure",
    category: "Earthy",
    gender: "Unisex",
    price: 500,
    image: "../perfume images/khus pure.jpg",
    description: "Notes Khus Vetiver Earthy Green Woody Fresh",
    scentPyramid: { top: ["Khus"], heart: ["Green"], base: ["Vetiver"] },
    sizes: ["10ml"],
    rating: 4.5,
    reviews: 28
  },
  {
    id: 16,
    name: "Musk Collection",
    category: "Musk",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/musk collection.jpg",
    description: "Notes Musk Amber Woody Warm spicy Sweet Powdery",
    scentPyramid: { top: ["Musk"], heart: ["Amber"], base: ["Woody"] },
    sizes: ["65ml"],
    rating: 4.7,
    reviews: 52
  },
  {
    id: 17,
    name: "Breeze",
    category: "Fresh",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/Breeze.jpg",
    description: "A refreshing breeze of fresh aquatic notes with citrus undertones",
    scentPyramid: { top: ["Citrus"], heart: ["Aquatic"], base: ["Fresh"] },
    sizes: ["65ml"],
    rating: 4.2,
    reviews: 15
  },
  {
    id: 18,
    name: "Dehn Al Oud",
    category: "Oud",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/dehn al oud.jpg",
    description: "Rich oud notes blended with warm spices and amber",
    scentPyramid: { top: ["Oud"], heart: ["Spicy"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.7,
    reviews: 40
  },
  {
    id: 19,
    name: "Dubai",
    category: "Oriental",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/dubai.jpg",
    description: "Luxurious oriental scent inspired by the city of gold",
    scentPyramid: { top: ["Spicy"], heart: ["Oriental"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.5,
    reviews: 25
  },
  {
    id: 20,
    name: "Golden Oud",
    category: "Oud",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/golden oud.jpg",
    description: "Premium oud with golden honey and vanilla accents",
    scentPyramid: { top: ["Oud"], heart: ["Honey"], base: ["Vanilla"] },
    sizes: ["65ml"],
    rating: 4.8,
    reviews: 35
  },
  {
    id: 21,
    name: "Imperial",
    category: "Woody",
    gender: "Men's",
    price: 1000,
    image: "../perfume images/imperial.jpg",
    description: "Imperial woody notes with leather and tobacco",
    scentPyramid: { top: ["Woody"], heart: ["Leather"], base: ["Tobacco"] },
    sizes: ["65ml"],
    rating: 4.6,
    reviews: 30
  },
  {
    id: 22,
    name: "Madina",
    category: "Floral",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/madina.jpg",
    description: "Floral bouquet inspired by sacred gardens",
    scentPyramid: { top: ["Floral"], heart: ["Rose"], base: ["Musk"] },
    sizes: ["65ml"],
    rating: 4.4,
    reviews: 20
  },
  {
    id: 23,
    name: "Naaj",
    category: "Sweet",
    gender: "Women's",
    price: 1000,
    image: "../perfume images/naaj.jpg",
    description: "Sweet and delicate with vanilla and caramel notes",
    scentPyramid: { top: ["Sweet"], heart: ["Vanilla"], base: ["Caramel"] },
    sizes: ["65ml"],
    rating: 4.3,
    reviews: 18
  },
  {
    id: 24,
    name: "Pure Khuss",
    category: "Earthy",
    gender: "Unisex",
    price: 500,
    image: "../perfume images/pure khuss.jpg",
    description: "Pure khus root with earthy and green notes",
    scentPyramid: { top: ["Khus"], heart: ["Earthy"], base: ["Green"] },
    sizes: ["10ml"],
    rating: 4.1,
    reviews: 12
  },
  {
    id: 25,
    name: "Royal Sandal",
    category: "Woody",
    gender: "Unisex",
    price: 1500,
    image: "../perfume images/royal sandal.jpg",
    description: "Royal sandalwood with creamy and woody depth",
    scentPyramid: { top: ["Sandalwood"], heart: ["Creamy"], base: ["Woody"] },
    sizes: ["65ml"],
    rating: 4.5,
    reviews: 28
  },
  {
    id: 26,
    name: "Scentox (Inspired Version)",
    category: "Modern",
    gender: "Unisex",
    price: 1200,
    displayPrice: "500-1200",
    image: "../perfume images/SCENTOX (INSPIRED VERSION ).jpg",
    description: "Modern inspired fragrance with unique notes",
    scentPyramid: { top: ["Modern"], heart: ["Unique"], base: ["Fresh"] },
    sizes: ["55ml"],
    rating: 4.0,
    reviews: 10
  },
  {
    id: 27,
    name: "Secret Musk",
    category: "Musk",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/secret musk.jpg",
    description: "Secret blend of musky and sensual notes",
    scentPyramid: { top: ["Musk"], heart: ["Sensual"], base: ["Amber"] },
    sizes: ["65ml"],
    rating: 4.4,
    reviews: 22
  },
  {
    id: 28,
    name: "Old Barbershop",
    category: "Aromatic",
    gender: "Unisex",
    price: 1000,
    image: "../perfume images/old barbershop.jpg",
    description: "Notes Fresh, citrus, patchouli, Lavender, Aromatic, Musky, Powdery",
    scentPyramid: { top: ["Fresh", "Citrus"], heart: ["Lavender", "Aromatic"], base: ["Patchouli", "Musky"] },
    sizes: ["65ml"],
    rating: 4.5,
    reviews: 14
  },
  {
    id: 29,
    name: "King",
    category: "Woody",
    gender: "Unisex",
    price: 1200,
    image: "../perfume images/king.jpg",
    description: "Notes Citrus, Fresh Spicy, Woody, Lavender, Herbal, Soft Spicy, Earthy",
    scentPyramid: {
      top: ["Citrus", "Lavender"],
      heart: ["Fresh Spicy", "Herbal", "Soft Spicy"],
      base: ["Woody", "Earthy"]
    },
    sizes: ["65ml"],
    rating: 4.5,
    reviews: 18,
    bestseller: true
  }
];

let reviews = [];
try {
  const savedReviews = localStorage.getItem('alqamar_reviews');
  if (savedReviews) {
    reviews = JSON.parse(savedReviews);
  }
} catch (e) {
  reviews = [];
}

const quizQuestions = [
  {
    question: "What's your preferred time of day?",
    options: ["Morning - fresh and energizing", "Afternoon - warm and comforting", "Evening - mysterious and alluring", "Night - deep and sensual"]
  },
  {
    question: "Which environment appeals to you most?",
    options: ["Blooming gardens", "Ancient forests", "Desert landscapes", "Mountain peaks"]
  },
  {
    question: "How would you describe your personality?",
    options: ["Romantic and dreamy", "Bold and confident", "Mysterious and introspective", "Adventurous and free-spirited"]
  },
  {
    question: "What's your favorite season?",
    options: ["Spring - renewal and growth", "Summer - warmth and vitality", "Autumn - richness and depth", "Winter - crispness and clarity"]
  },
  {
    question: "Which scent family intrigues you most?",
    options: ["Floral - delicate and feminine", "Woody - earthy and grounding", "Oriental - warm and spicy", "Fresh - clean and invigorating"]
  }
];

const quizResults = {
  "Floral - delicate and feminine": [2, 5, 7, 12, 14],
  "Woody - earthy and grounding": [6, 10, 11, 13],
  "Oriental - warm and spicy": [1, 3, 4, 8, 9, 15],
  "Fresh - clean and invigorating": [4, 7, 10, 12, 14]
};

// Demo users for testing
const demoUsers = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@alqamar.com",
    password: "demo123", // In real app, this would be hashed
    addresses: [
      {
        id: 1,
        name: "Demo User",
        street: "123 Desert Oasis St",
        city: "Morocco City",
        state: "Morocco",
        zip: "12345",
        country: "Morocco"
      }
    ],
    orders: [
      {
        id: 1,
        date: "2024-01-10",
        items: [
          { productId: 1, quantity: 1, size: "65ml" },
          { productId: 2, quantity: 2, size: "30ml" }
        ],
        total: 627,
        status: "Delivered"
      }
    ],
    wishlist: [3, 5, 8]
  }
];

// Stripe test keys (replace with your own)
const stripePublishableKey = "pk_test_51EXAMPLE..."; // Replace with actual test key

// PayPal client ID (replace with your own)
const paypalClientId = "AZEXAMPLE..."; // Replace with actual client ID

// Export for use in other JS files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, reviews, quizQuestions, quizResults, demoUsers, stripePublishableKey, paypalClientId };
}
