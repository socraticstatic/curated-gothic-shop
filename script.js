/*
 * script.js
 *
 * Provides a basic data model for Caryn’s curated shop and dynamically
 * renders cards for each item in the Clothing, Accessories and Home
 * categories. Each object in the `items` array represents a product
 * Caryn might affiliate with; in a production deployment this data
 * could be loaded from an API or CMS. For now, the samples give
 * a sense of the visual layout and allow the page to feel alive.
 */

/*
 * In earlier versions we embedded curated items directly in this script. For a more
 * flexible experience, items are now loaded from the back‑end via AJAX. We
 * retain a fallback list here so that the UI still renders if the API is
 * unavailable (e.g. when running as a purely static site).
 */
const fallbackItems = [
  {
    category: 'clothing',
    name: 'Velvet Lace Jacket',
    image: 'https://images.unsplash.com/photo-1519415943484-c1a66774406f?auto=format&fit=crop&w=800&q=50',
    description: 'An elegant velvet jacket with lace trim inspired by Victorian gothic fashion.',
    link: 'https://gothicplus.com?ref=caryn-curations'
  },
  {
    category: 'clothing',
    name: 'Ruffled Maxi Dress',
    image: 'https://images.unsplash.com/photo-1514995567534-be1939c1e536?auto=format&fit=crop&w=800&q=50',
    description: 'Flowing dress with ruffled sleeves and corset-inspired bodice.',
    link: 'https://prettyattitude.com?ref=caryn-curations'
  },
  {
    category: 'clothing',
    name: 'Steampunk Waistcoat',
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=50',
    description: 'Tailored waistcoat with brass buttons and brocade pattern.',
    link: 'https://darkattitude.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Silver Crescent Necklace',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=50',
    description: 'Delicate sterling necklace featuring a crescent moon and gemstone pendant.',
    link: 'https://hellaholics.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Victorian Lace Gloves',
    image: 'https://images.unsplash.com/photo-1556228914-e6bb65a11531?auto=format&fit=crop&w=800&q=50',
    description: 'Soft lace gloves reminiscent of Victorian gothic elegance.',
    link: 'https://shopcursedcloset.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Leather Choker with O-Ring',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=50',
    description: 'Simple yet edgy choker crafted from black leather with a metal O-ring.',
    link: 'https://attitudeclothing.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Candle Holder Set',
    image: 'https://images.unsplash.com/photo-1530199202256-d8d7c90a6a92?auto=format&fit=crop&w=800&q=50',
    description: 'Black wrought iron candle holders to cast a warm gothic glow.',
    link: 'https://blackangelonline.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Skull Planter',
    image: 'https://images.unsplash.com/photo-1513908957991-3d5a21a58218?auto=format&fit=crop&w=800&q=50',
    description: 'A ceramic skull planter perfect for succulents or herbs.',
    link: 'https://spiraldirect.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Baroque Mirror',
    image: 'https://images.unsplash.com/photo-1591736832069-e8265b64c049?auto=format&fit=crop&w=800&q=50',
    description: 'Ornate baroque-style mirror to adorn your gothic boudoir.',
    link: 'https://prettyattitude.com?ref=caryn-curations'
  }
];

/**
 * Render a list of items into the appropriate category containers. Clears any
 * previously rendered cards before inserting the new ones. Accepts an
 * array of item objects with the shape defined in items.json.
 */
function renderItems(items) {
  // Clear existing cards
  document.querySelectorAll('.item-container').forEach(container => {
    container.innerHTML = '';
  });
  items.forEach(item => {
    const container = document.getElementById(`${item.category}-items`);
    if (!container) return;
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.search = `${item.name.toLowerCase()} ${item.description.toLowerCase()}`;
    card.innerHTML = `
      <div class="item-image" style="background-image: url('${item.image}');"></div>
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <a href="${item.url || item.link}" target="_blank" class="item-link">View Item</a>
    `;
    container.appendChild(card);
  });
}

/**
 * Fetch all items from the back‑end. Falls back to the hard‑coded list if the
 * API is unavailable or returns an error. Returns a promise resolving to an
 * array of item objects.
 */
async function fetchItems() {
  try {
    const response = await fetch('/api/items');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Using fallback items due to error fetching from API:', err);
    return fallbackItems;
  }
}

/**
 * Perform a search via the back‑end API. Returns matching items. Falls back to
 * client‑side filtering of the fallback list if the API call fails.
 */
async function searchItems(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return fetchItems();
  }
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (err) {
    console.warn('Search API unavailable, falling back to client filtering:', err);
    return fallbackItems.filter(item => {
      const text = `${item.name} ${item.description}`.toLowerCase();
      return text.includes(q);
    });
  }
}

/**
 * Set up event listeners for search and subscription. Invoked once DOM is ready.
 */
async function initialize() {
  // Load initial items and render
  const allItems = await fetchItems();
  renderItems(allItems);

  // Search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', async event => {
      const query = event.target.value;
      const results = await searchItems(query);
      renderItems(results);
    });
  }

  // Newsletter subscription
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const messageEl = document.getElementById('newsletter-message');
  if (form && emailInput && messageEl) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        messageEl.textContent = data.message || data.error || 'Unexpected response.';
        messageEl.style.color = response.ok ? '#8de08c' : '#e08c8c';
        if (response.ok) emailInput.value = '';
      } catch (err) {
        messageEl.textContent = 'Error subscribing. Please try again later.';
        messageEl.style.color = '#e08c8c';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initialize);